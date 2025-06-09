function openModal(modal) {
  modal.classList.add("popup_is-opened", "popup_is-animated")
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(e) {
  const modal = document.querySelector(".popup_is-opened");
  if (e.key === "Escape" && modal) {
    closeModal(modal);
  }
}

export { openModal, closeModal };
