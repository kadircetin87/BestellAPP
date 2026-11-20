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

// Tıklanan yemeğin adedini 1 artırır
function increaseQuantity(i) {
  meals[i].quantity += 1;
  const button = document.getElementById("add-button-" + i);
  button.textContent = "Added " + meals[i].quantity;
}

// Sayfa yüklendiğinde çalışır
function init() {
  renderCatalog();
}
