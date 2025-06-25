import "./pages/index.css";

import { createCard, deleteCard, likeCard } from "./components/card";
import { fillForm, modalReset } from "./components/form";
import { clearValidation, enableValidation } from "./components/validation";
import { getUserDataApi, updateAvatarApi, getCardsApi, editUserDataApi } from "./components/api";

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
const descriptionInput = profileEditForm.querySelector(".popup__input_type_description");
const titleInput = profileAddForm.querySelector(".popup__input_type_card-name");
const urlInput = profileAddForm.querySelector(".popup__input_type_url");
const modalArray = document.querySelectorAll(".popup");

const avatarEditModal = document.querySelector(".popup_type_avatar");
const avatarEditInput = avatarEditModal.querySelector(".popup__input_type_avatar");
const avatarEditForm = document.forms["edit-avatar"];
const profileAvatar = document.querySelector(".profile__image");
let currentUserId = null;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

/* initialCards.forEach((cardData) => {
  const card = createCard({
    cardData,
    onDelete: deleteCard,
    onLike: likeCard,
    onImageClick: openCardModal,
  });
  cardsContainer.append(card);
}); */

Promise.all([getUserDataApi(), getCardsApi()])
  .then(([userData, initialCards]) => {
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    currentUserId = userData._id;

    initialCards.forEach((card) => {
      const cardData = {
        name: card.name,
        link: card.link,
      };
      const test = createCard({
        cardData,
        onDelete: deleteCard,
        onLike: likeCard,
        onImageClick: openCardModal,
      });
      cardsContainer.append(test);
    });
  })
  .catch((error) => console.log(error));

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
  clearValidation(profileEditModal, validationConfig);
  openModal(profileEditModal);
});

profileEditForm.addEventListener("submit", handleEditUserData);

/*
function handleEditUserData(e) {
  e.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(profileEditModal);
}
*/

function handleEditUserData(e) {
  e.preventDefault();
  const name = nameInput.value;
  const description = descriptionInput.value;

  editUserDataApi(name, description)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profileEditModal);
    })
    .catch((err) => console.log(err));
}

profileAddButton.addEventListener("click", () => {
  clearValidation(profileAddModal, validationConfig);
  openModal(profileAddModal);
});

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Ошибка загрузки изображения: ${url}`));
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

profileAvatar.addEventListener("click", () => {
  clearValidation(avatarEditModal, validationConfig);
  openModal(avatarEditModal);
});

function handleEditAvatar(e) {
  e.preventDefault();
  const avatarUrl = avatarEditInput.value;
  updateAvatarApi(avatarUrl)
    .then((avatarUrl) => {
      profileAvatar.style.backgroundImage = `url(${avatarUrl.avatar})`;
      closeModal(avatarEditModal);
    })
    .catch((err) => console.log(err));
}

avatarEditForm.addEventListener("submit", handleEditAvatar);

modalArray.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target === modal || e.target.classList.contains("popup__close")) {
      closeModal(modal);
    }
  });
});

function openCardModal(img, title, modal = document.querySelector(".popup_type_image")) {
  modal.querySelector(".popup__image").src = img.src;
  modal.querySelector(".popup__image").alt = img.alt;
  modal.querySelector(".popup__caption").textContent = title.textContent;
  openModal(modal);
}

enableValidation(validationConfig);
