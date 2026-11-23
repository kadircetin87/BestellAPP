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
function getBasketItemTemplate(meal, i) {
  return `
    <div class="basket-item">
      <p>${meal.quantity} x ${meal.name}</p>
      <div class="basket-controls">
        ${getBasketControls(meal, i)}
      </div>
      <strong>${(meal.price * meal.quantity).toFixed(2).replace(".", ",")}€</strong>
    </div>
  `;
}

// Tek adette silme, daha fazla adette azaltma ve silme seçeneklerini gösterir.
function getBasketControls(meal, i) {
  const remove = `<button class="remove" aria-label="Remove ${meal.name} from basket" onclick="removeFromBasket(${i})"><img src="assets/icons/trash-icon.png" alt=""></button>`;
  let controls = remove;
  if (meal.quantity > 1) {
    controls += `<button aria-label="Decrease quantity of ${meal.name}" onclick="decreaseQuantity(${i})">−</button>`;
  }
  return controls + `<span>${meal.quantity}</span><button aria-label="Increase quantity of ${meal.name}" onclick="increaseQuantity(${i})">+</button>`;
}

// Sepetteki yemekleri ekrana basar
function renderBasket() {
  const list = document.getElementById("basket-list");
  let html = "";
  for (let i = 0; i < meals.length; i++) {
    if (meals[i].quantity > 0) {
      html += getBasketItemTemplate(meals[i], i);
    }
  }
  list.innerHTML = html || '<p class="empty">Nothing here yet.<br>Go ahead and choose something delicious!</p><img class="empty-cart" src="assets/icons/shopping_cart.png" alt="">';
  updateBasketControls();
  renderTotals();
}

// Sepetteki yemeklerin toplam fiyatını hesaplar
function getSubtotal() {
  let sum = 0;
  for (let i = 0; i < meals.length; i++) {
    sum += meals[i].price * meals[i].quantity;
  }
  return sum;
}

// Teslimat ücreti dahil toplamı döndürür
function getTotal() {
  return getSubtotal() + deliveryFee;
}

// Ara toplam, teslimat ve toplamı ekrana basar
function renderTotals() {
  const box = document.getElementById("basket-total");
  if (getSubtotal() === 0) {
    box.innerHTML = "";
    return;
  }
  const total = getTotal().toFixed(2).replace(".", ",") + "€";
  let html = `<p>Subtotal <span>${getSubtotal().toFixed(2).replace(".", ",")} €</span></p>`;
  html += `<p>Delivery fee <span>${deliveryFee.toFixed(2).replace(".", ",")}€</span></p>`;
  html += `<p>Total <span>${total}</span></p>`;
  document.getElementById("buy").textContent = `Buy now (${total})`;
  box.innerHTML = html;
}

// "Add to basket" butonunun yazısını günceller
function updateAddButton(i) {
  const button = document.getElementById("add-button-" + i);
  if (meals[i].quantity > 0) {
    button.textContent = "Added " + meals[i].quantity;
  } else {
    button.textContent = "Add to basket";
  }
}

// Tıklanan yemeğin adedini 1 artırır
function increaseQuantity(i) {
  meals[i].quantity += 1;
  updateAddButton(i);
  renderBasket();
}

// Adedi 1 azaltır; 0'ın altına inmez
function decreaseQuantity(i) {
  meals[i].quantity -= 1;
  if (meals[i].quantity < 0) {
    meals[i].quantity = 0;
  }
  updateAddButton(i);
  renderBasket();
}

// Yemeği sepetten tamamen çıkarır
function removeFromBasket(i) {
  meals[i].quantity = 0;
  updateAddButton(i);
  renderBasket();
}

// Sayfa yüklendiğinde çalışır
function init() {
  renderCatalog();
  renderBasket();
  window.matchMedia("(min-width: 901px)").addEventListener("change", closeDesktopDialog);
}

// Rozette farklı yemekleri değil, toplam adedi gösterir.
function updateBasketControls() {
  let count = 0;
  for (let i = 0; i < meals.length; i++) {
    count += meals[i].quantity;
  }
  document.getElementById("basket-count").textContent = count;
  document.getElementById("buy").hidden = count === 0;
}

// Aynı sepeti mobil pencerede açar.
function openBasket() {
  const dialog = document.getElementById("basket-dialog");
  dialog.appendChild(document.getElementById("basket"));
  dialog.showModal();
}

// Kapatıldığında sepeti menünün yanına geri taşır.
function restoreBasket() {
  document.querySelector(".content").appendChild(document.getElementById("basket"));
}

// Masaüstüne geçildiğinde açık mobil pencereyi kapatır.
function closeDesktopDialog(event) {
  const dialog = document.getElementById("basket-dialog");
  if (event.matches && dialog.open) dialog.close();
}

// Test siparişinden sonra adetleri ve görünümü sıfırlar.
function placeOrder() {
  if (getSubtotal() === 0) return;
  const dialog = document.getElementById("basket-dialog");
  if (dialog.open) dialog.close();
  for (let i = 0; i < meals.length; i++) {
    meals[i].quantity = 0;
    updateAddButton(i);
  }
  renderBasket();
  document.getElementById("order-dialog").showModal();
}
