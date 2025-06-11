import "./pages/index.css";

import { initialCards } from "./components/cards";
import { createCard, deleteCard, likeCard } from "./components/card";
import { openModal, closeModal } from "./components/modal";
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

profileEditButton.addEventListener("click", () => {
  fillForm([nameInput, descriptionInput], [profileTitle, profileDescription]);
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
