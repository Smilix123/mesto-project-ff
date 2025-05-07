const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

function createCard(cardData) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");

  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  return cardElement;
}

function addCard(cardData, deleteHandler) {
  const cardElement = createCard(cardData);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", () => deleteHandler(cardElement));
  cardsContainer.append(cardElement);
}

function deleteCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((cardData) => addCard(cardData, deleteCard));
