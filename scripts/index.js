const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");
const addButton = container.querySelector("profile__add-button");
const cardTemplate = document.querySelector("#card-template").content;

function addCard(nameValue, linkValue) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardElement.querySelector(".card__title").textContent = nameValue;
  cardElement.querySelector(".card__image").src = linkValue;
  cardsContainer.append(cardElement);

  deleteButton.addEventListener("click", () => deleteCard(cardElement));
}

function deleteCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach((elem) => addCard(elem.name, elem.link));
