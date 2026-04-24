async function loadListings() {
  const { data, error } = await db
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  const grid = document.getElementById("listings-grid");

  if (error || !data) {
    grid.innerHTML = "<p>Error loading listings</p>";
    return;
  }

  if (data.length === 0) {
    grid.innerHTML = "<p>No listings yet.</p>";
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "listing-card";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.image_url || 'https://placehold.co/400x300'}">
      </div>
      <div class="card-info">
        <p class="card-title">${item.title}</p>
        <p class="card-price">€${parseFloat(item.price).toFixed(2)}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

loadListings();
