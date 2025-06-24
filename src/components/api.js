export { getUserDataApi, getCardsApi };

const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-41",
  headers: {
    authorization: "143f916c-f045-4e3b-8db8-22feba489e0e",
    "Content-Type": "application/json",
  },
};

const getUserDataApi = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(getResponse);
};

const getCardsApi = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(getResponse);
};

const getResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};
