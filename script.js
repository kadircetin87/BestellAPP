// Sepete ekleme düğmesini döndürür
function getAddButtonTemplate(i) {
  return `<button id="add-button-${i}" onclick="increaseQuantity(${i})">Add to basket</button>`;
}

// Tek bir yemeğin kart HTML'ini döndürür
function renderMealCard(meal, i) {
  return `
    <article class="meal-card">
      <img src="${meal.image}" alt="${meal.name}" />
      <div>
        <h3>${meal.name}</h3>
        <p>${meal.description}</p>
        <strong>${meal.price.toFixed(2).replace(".", ",")} €</strong>
        ${getAddButtonTemplate(i)}
      </div>
    </article>
  `;
}

// Tüm yemekleri ekrana basar
function renderCatalog() {
  const list = document.getElementById("meal-list");
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    html += renderMealCard(meals[i], i);
  }
  list.innerHTML = html;
}

// Sepetteki tek bir yemeğin satırını döndürür
function getBasketItemTemplate(meal) {
  return `
    <div class="basket-item">
      <p>${meal.quantity} x ${meal.name}</p>
      <strong>${(meal.price * meal.quantity).toFixed(2).replace(".", ",")} €</strong>
    </div>
  `;
}

// Sepetteki yemekleri ekrana basar
function renderBasket() {
  const list = document.getElementById("basket-list");
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    if (meals[i].quantity > 0) {
      html += getBasketItemTemplate(meals[i]);
    }
  }
  if (html === "") {
    html = "<p>Your basket is empty.</p>";
  }
  list.innerHTML = html;
}

// Tıklanan yemeğin adedini 1 artırır
function increaseQuantity(i) {
  meals[i].quantity += 1;
  const button = document.getElementById("add-button-" + i);
  button.textContent = "Added " + meals[i].quantity;
  renderBasket();
}

// Sayfa yüklendiğinde çalışır
function init() {
  renderCatalog();
  renderBasket();
}
