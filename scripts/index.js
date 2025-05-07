const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData, deleteHandler) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  deleteButton.addEventListener("click", () => deleteHandler(cardElement));
  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((cardData) =>
  cardsContainer.append(createCard(cardData, deleteCard))
);
