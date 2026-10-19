const checkoutForm = document.getElementById('checkout-form');
const productSelect = document.getElementById('checkout-product');
const quantityInput = document.getElementById('checkout-quantity');
const deliverySelect = document.getElementById('checkout-delivery');
const addressField = document.getElementById('address-field');
const addressInput = document.getElementById('checkout-address');
const confirmDialog = document.getElementById('confirm-dialog');
const orderSuccess = document.getElementById('order-success');
const money = (amount) => amount.toLocaleString('ru-RU') + ' ₽';

const requestedProduct = new URLSearchParams(window.location.search).get('product');
if (Array.from(productSelect.options).some((option) => option.value === requestedProduct)) {
  productSelect.value = requestedProduct;
}

function getOrder() {
  const option = productSelect.selectedOptions[0];
  const quantity = quantityInput.valueAsNumber;
  const deliveryCost = deliverySelect.value === 'courier' ? 300 : 0;
  return {
    product: option.dataset.name,
    quantity,
    subtotal: Number(option.dataset.price) * quantity,
    deliveryCost,
    total: Number(option.dataset.price) * quantity + deliveryCost
  };
}

function updateSummary() {
  const courier = deliverySelect.value === 'courier';
  addressField.hidden = !courier;
  addressInput.disabled = !courier;
  addressInput.required = courier;
  if (!courier) addressInput.removeAttribute('aria-invalid');

  const order = getOrder();
  const validQuantity = quantityInput.checkValidity();
  document.getElementById('summary-product').textContent = order.product;
  document.getElementById('summary-quantity').textContent = validQuantity ? order.quantity : 'От 1 до 10';
  document.getElementById('summary-subtotal').textContent = validQuantity ? money(order.subtotal) : '—';
  document.getElementById('summary-delivery').textContent = courier ? money(order.deliveryCost) : 'Бесплатно';
  document.getElementById('summary-total').textContent = validQuantity ? money(order.total) : '—';
}

checkoutForm.addEventListener('input', (event) => {
  orderSuccess.hidden = true;
  if (event.target.willValidate && event.target.checkValidity()) {
    event.target.removeAttribute('aria-invalid');
  }
  updateSummary();
});

checkoutForm.addEventListener('change', updateSummary);

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  Array.from(checkoutForm.elements).forEach((element) => {
    element.removeAttribute('aria-invalid');
    if (element.willValidate && !element.checkValidity()) {
      element.setAttribute('aria-invalid', 'true');
    }
  });
  if (!checkoutForm.reportValidity()) return;

  const order = getOrder();
  document.getElementById('confirm-product').textContent = `${order.product} — ${order.quantity} шт.`;
  document.getElementById('confirm-contact').textContent =
    `${checkoutForm.elements.name.value}, ${checkoutForm.elements.email.value}, ${checkoutForm.elements.phone.value}`;
  document.getElementById('confirm-delivery').textContent = deliverySelect.value === 'courier'
    ? `Курьер: ${addressInput.value}` : 'Самовывоз';
  document.getElementById('confirm-total').textContent = `Итого: ${money(order.total)}`;
  confirmDialog.showModal();
});

document.getElementById('edit-order').addEventListener('click', () => confirmDialog.close());

document.getElementById('confirm-order').addEventListener('click', () => {
  confirmDialog.close();
  checkoutForm.reset();
  Array.from(checkoutForm.elements).forEach((element) => element.removeAttribute('aria-invalid'));
  updateSummary();
  orderSuccess.hidden = false;
  orderSuccess.scrollIntoView({ block: 'start' });
});

updateSummary();
