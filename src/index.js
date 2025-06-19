import "./pages/index.css";

import { initialCards } from "./components/cards";
import { createCard, deleteCard, likeCard } from "./components/card";
import { fillForm, modalReset } from "./components/form";

const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const profileAddModal = document.querySelector(".popup_type_new-card");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileEditModal = document.querySelector(".popup_type_edit");
const profileEditForm = document.forms["edit-profile"];
const profileAddForm = document.forms["new-place"];
const nameInput = profileEditForm.querySelector(".popup__input_type_name");
const descriptionInput = profileEditForm.querySelector(
  ".popup__input_type_description"
);
const titleInput = profileAddForm.querySelector(".popup__input_type_card-name");
const urlInput = profileAddForm.querySelector(".popup__input_type_url");
const modalArray = document.querySelectorAll(".popup");

initialCards.forEach((cardData) => {
  const card = createCard({
    cardData,
    onDelete: deleteCard,
    onLike: likeCard,
    onImageClick: openCardModal,
  });
  cardsContainer.append(card);
});

function openModal(modal) {
  modal.classList.add("popup_is-animated");
  setTimeout(() => {
    modal.classList.add("popup_is-opened");
  }, 1);
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(e) {
  if (e.key === "Escape") {
    const modal = document.querySelector(".popup_is-opened");
    if (modal) {
      closeModal(modal);
    }
  }
}

profileEditButton.addEventListener("click", () => {
  fillForm([nameInput, descriptionInput], [profileTitle, profileDescription]);
  const fieldset = profileEditModal.querySelector(".popup__form_set");
  const inputList = Array.from(fieldset.querySelectorAll(".popup__input"));
  const buttonElement = fieldset.querySelector(".popup__button");
  inputList.forEach((inputElement) => {
    checkInputValidity(fieldset, inputElement);
  });
  toggleButtonState(inputList, buttonElement);
  openModal(profileEditModal);
});

profileEditForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(profileEditModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(profileAddModal);
});

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error(`Ошибка загрузки изображения: ${url}`));
    img.src = url;
  });
}

profileAddForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cardData = {
    name: titleInput.value,
    link: urlInput.value,
  };

  try {
    await loadImage(cardData.link);
    closeModal(profileAddModal);
    modalReset(profileAddForm);

    const card = createCard({
      cardData,
      onDelete: deleteCard,
      onLike: likeCard,
      onImageClick: openCardModal,
    });
    cardsContainer.prepend(card);
  } catch (error) {
    console.error(error);
    const errorElement = document.createElement("div");
    errorElement.classList.add("error-message");
    errorElement.textContent = "Не удалось загрузить изображение";
    profileAddForm.appendChild(errorElement);

    setTimeout(() => {
      if (profileAddForm.contains(errorElement)) {
        profileAddForm.removeChild(errorElement);
      }
    }, 3000);
  }
});

modalArray.forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("popup__close")) {
      closeModal(modal);
    }
  });
});

function openCardModal(
  img,
  title,
  modal = document.querySelector(".popup_type_image")
) {
  modal.querySelector(".popup__image").src = img.src;
  modal.querySelector(".popup__image").alt = img.alt;
  modal.querySelector(".popup__caption").textContent = title.textContent;
  openModal(modal);
}

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add("form__input_type_error");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("form__input-error");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove("form__input_type_error");
  errorElement.classList.remove("form__input-error");
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  console.log(
    "validity.patternMismatch -",
    inputElement.validity.patternMismatch
  );
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  console.log("valid - ", inputElement.validity.valid);
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
  console.groupEnd();
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const buttonElement = formElement.querySelector(".popup__button");
  toggleButtonState(inputList, buttonElement);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function (e) {
      console.group("input");
      if (e instanceof InputEvent) {
        console.log("InputEvent! Тип действия:", e.inputType);
      } else if (e instanceof Event) {
        console.log("Базовое Event");
      }
      console.log("e.type", e.inputType);
      console.log(`inputElement.value "${inputElement.value}"`);

      console.log(e);
      console.log("e.data - ", e.data);
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".popup__form"));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    const fieldsetList = Array.from(
      formElement.querySelectorAll(".popup__form_set")
    );
    fieldsetList.forEach((fieldSet) => {
      setEventListeners(fieldSet);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add("popup__button_inactive");
    buttonElement.setAttribute("disabled", "");
  } else {
    buttonElement.classList.remove("popup__button_inactive");
    buttonElement.removeAttribute("disabled", "");
  }
};

enableValidation();
