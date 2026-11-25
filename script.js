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

// Kategorileri kendi listelerine basar
function renderCatalog() {
  renderCategory("burger-list", 0, 4);
  renderCategory("pizza-list", 4, 8);
  renderCategory("salad-list", 8, meals.length);
}

// Tek bir kategoriyi ekrana basar
function renderCategory(id, start, end) {
  let html = "";
  for (let i = start; i < end; i++) {
    html += renderMealCard(meals[i], i);
  }
  document.getElementById(id).innerHTML = html;
}

// Sepetteki tek bir yemeğin satırını döndürür
function getBasketItemTemplate(meal, i) {
  const extraClass = meal.quantity > 1 ? " has-remove" : "";
  return `
    <div class="basket-item${extraClass}">
      <p>${meal.quantity} x ${meal.name}</p>
      <div class="basket-controls">
        ${getBasketControls(meal, i)}
      </div>
      <strong>${(meal.price * meal.quantity).toFixed(2).replace(".", ",")} €</strong>
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
  const total = getTotal().toFixed(2).replace(".", ",") + " €";
  let html = `<p>Subtotal <span>${getSubtotal().toFixed(2).replace(".", ",")} €</span></p>`;
  html += `<p>Delivery fee <span>${deliveryFee.toFixed(2).replace(".", ",")} €</span></p>`;
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
  window.addEventListener("resize", closeDesktopDialog);
  document.addEventListener("keydown", closeToastOnEscape);
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
  syncScrollLock();
}

// Kapatıldığında sepeti menünün yanına geri taşır.
function restoreBasket() {
  document.querySelector(".content").appendChild(document.getElementById("basket"));
  syncScrollLock();
}

// Kilit kararı: onay mesajı veya sepet penceresi açıksa sayfa kaymaz.
function syncScrollLock() {
  const busy = !document.getElementById("order-toast").hidden || document.getElementById("basket-dialog").open;
  if (busy) {
    lockScroll();
  } else {
    unlockScroll();
  }
}

// Masaüstüne geçildiğinde açık mobil pencereyi kapatır.
function closeDesktopDialog() {
  const dialog = document.getElementById("basket-dialog");
  if (window.innerWidth > 900 && dialog.open) dialog.close();
}

// Pencere açıkken arka planın kaymasını engeller.
function lockScroll() {
  document.documentElement.classList.add("no-scroll");
  document.body.classList.add("no-scroll");
}

// Pencere kapandığında sayfa kaydırmasını geri açar.
function unlockScroll() {
  document.documentElement.classList.remove("no-scroll");
  document.body.classList.remove("no-scroll");
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
  showOrderToast();
}

// Onay mesajını gösterir; arka planı kilitler ve 4 saniye sonra gizler.
function showOrderToast() {
  const toast = document.getElementById("order-toast");
  toast.hidden = false;
  syncScrollLock();
  document.getElementById("order-toast-close").focus();
  setTimeout(hideOrderToast, 4000);
}

// Onay mesajını gizler; sayfa kilidini yeniden değerlendirir.
function hideOrderToast() {
  document.getElementById("order-toast").hidden = true;
  syncScrollLock();
}

// Onay mesajı açıkken Escape tuşuyla kapatmayı sağlar.
function closeToastOnEscape(event) {
  const open = !document.getElementById("order-toast").hidden;
  if (event.key === "Escape" && open) hideOrderToast();
}
