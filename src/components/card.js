import { setLikeApi, deleteCardApi } from "./api";

const cardTemplate = document.querySelector("#card-template").content;

function createCard({ cardData, onDelete, onLike, onImageClick }) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");

  const likesCount = cardElement.querySelector(".card__like-count");

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likesCount.textContent = cardData.likes.length;

  likeButton.addEventListener("click", () => onLike(likeButton, cardData.id, likesCount));
  cardImage.addEventListener("click", () => onImageClick(cardImage, cardTitle));

  const userHasLike = cardData.likes.some((like) => {
    return like._id === cardData.userId;
  });

  if (userHasLike) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (cardData.ownerId !== cardData.userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => onDelete(cardElement, cardData.id));
  }
  return cardElement;
}

function deleteCard(cardElement, cardId) {
  deleteCardApi(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(`Ошибка при удалении карточки: ${err}`);
    });
}

function likeCard(likeButton, cardId, likesCount) {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  setLikeApi(cardId, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_is-active");
      likesCount.textContent = updatedCard.likes.length;
    })
    .catch((err) => console.log(err));
}

export { createCard, deleteCard, likeCard };
