const filterForm = document.querySelector('.filters-form');
const priceFrom = document.getElementById('price-from');
const priceTo = document.getElementById('price-to');
const catalogSections = document.querySelectorAll('.catalog-section');
const catalogResult = document.getElementById('catalog-result');
const catalogEmpty = document.getElementById('catalog-empty');

function filterCatalog() {
  const min = priceFrom.value === '' ? 0 : priceFrom.valueAsNumber;
  const max = priceTo.value === '' ? Infinity : priceTo.valueAsNumber;
  priceTo.setCustomValidity(max < min ? 'Максимальная цена должна быть не меньше минимальной.' : '');
  if (!filterForm.reportValidity()) return;

  let count = 0;
  catalogSections.forEach((section) => {
    const price = Number(section.dataset.price);
    section.hidden = price < min || price > max;
    if (!section.hidden) count++;
  });
  catalogResult.textContent = `Найдено товаров: ${count}`;
  catalogEmpty.hidden = count !== 0;
}

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterCatalog();
});

filterForm.addEventListener('input', () => priceTo.setCustomValidity(''));

filterForm.addEventListener('reset', () => {
  priceTo.setCustomValidity('');
  catalogSections.forEach((section) => { section.hidden = false; });
  catalogResult.textContent = 'Найдено товаров: 3';
  catalogEmpty.hidden = true;
});

// Переход к категории показывает её даже после фильтрации по цене.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => filterForm.reset());
});
