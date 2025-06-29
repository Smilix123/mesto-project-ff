export { clearValidation, enableValidation };

const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  toggleButtonState(formElement, validationConfig);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function (e) {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(formElement, validationConfig);
    });
  });
};

const enableValidation = (validationConfig) => {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    const fieldsetList = Array.from(formElement.querySelectorAll(".popup__form_set"));
    fieldsetList.forEach((fieldSet) => {
      setEventListeners(fieldSet, validationConfig);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (fieldset, validationConfig) => {
  const inputList = Array.from(fieldset.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = fieldset.querySelector(validationConfig.submitButtonSelector);
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

const clearValidation = (modal, validationConfig) => {
  const fieldset = modal.querySelector(".popup__form_set");
  const inputList = Array.from(modal.querySelectorAll(validationConfig.inputSelector));
  inputList.forEach((inputElement) => {
    hideInputError(fieldset, inputElement, validationConfig);
    inputElement.setCustomValidity("");
  });
  toggleButtonState(fieldset, validationConfig);
};
