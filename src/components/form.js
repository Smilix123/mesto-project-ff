function fillForm(inputsArray, dataArray) {
  inputsArray.forEach((input, index) => {
    input.value = dataArray[index].textContent;
  });
}

function modalReset(modal) {
  modal.reset();
}

export { fillForm, modalReset };
