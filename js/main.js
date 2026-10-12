const orderDialog = document.getElementById('order-dialog');
const orderForm = document.getElementById('order-form');
const orderButtons = document.querySelectorAll('[data-product]');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const productCaption = document.getElementById('product-caption');
const successMessage = document.getElementById('success-message');

function clearErrors() {
  Array.from(orderForm.elements).forEach((element) => {
    element.removeAttribute('aria-invalid');
  });
}

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    orderForm.reset();
    clearErrors();
    selectedProductInput.value = button.dataset.product;
    productCaption.textContent = button.dataset.product;
    successMessage.hidden = true;
    orderDialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

orderForm.addEventListener('input', (event) => {
  if (event.target.willValidate && event.target.checkValidity()) {
    event.target.removeAttribute('aria-invalid');
  }
});

orderForm.addEventListener('submit', (event) => {
  // Сервер пока не подключён, поэтому обрабатываем форму в браузере.
  event.preventDefault();
  clearErrors();

  if (!orderForm.checkValidity()) {
    Array.from(orderForm.elements).forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });
    orderForm.reportValidity();
    return;
  }

  successMessage.hidden = false;
  orderForm.reset();
  orderDialog.close();
});
