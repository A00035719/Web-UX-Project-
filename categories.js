async function loadCategories() {
  const { data } = await db.from("categories").select("*");

  const select = document.getElementById("category-filter");

  select.innerHTML = '<option value="">All</option>';

  data.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

async function loadListings(categoryId = null) {
  let query = db.from("listings").select("*");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data } = await query;

  const grid = document.getElementById("listings-grid");
  grid.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "listing-card";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.image_url || 'https://placehold.co/400x300'}">
      </div>
      <div class="card-info">
        <p class="card-title">${item.title}</p>
        <p class="card-price">€${item.price}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

document.getElementById("category-filter").addEventListener("change", (e) => {
  loadListings(e.target.value);
});

loadCategories();
loadListings();
