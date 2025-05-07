// @todo: Темплейт карточки

/* const cardTemplate = document.querySelector("#card-template").content;
const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
const cardsContainer = document.querySelector(".places__list");

for (let i = 0; i < initialCards.length; i++) {
  console.log(initialCards[i]);
  cardElement.querySelector(".card__image").src = initialCards[i].link;
  cardElement.querySelector(".card__title").textContent = initialCards[i].name;
  cardsContainer.append(cardElement);
}

function addCard(nameValue, linkValue) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = songTemplate.querySelector(".card").cloneNode(true);

  cardElement.querySelector(".card__title").textContent = nameValue;
  cardElement.querySelector(".card__image").src = linkValue;
  cardsContainer.append(cardElement);
} */

const container = document.querySelector(".content");
const cardsContainer = container.querySelector(".places__list");
const addButton = container.querySelector("profile__add-button");
const cardTemplate = document.querySelector("#card-template").content;

function addCard(nameValue, linkValue) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

  cardElement.querySelector(".card__title").textContent = nameValue;
  cardElement.querySelector(".card__image").src = linkValue;
  cardsContainer.append(cardElement);

  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", function (e) {
      cardElement.remove();
    });
}

for (let i = 0; i < initialCards.length; i++) {
  addCard(initialCards[i].name, initialCards[i].link);
}

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу
