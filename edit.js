async function loadListings() {
  const { data, error } = await db
    .from('listings')
    .select('id, title, price, image_url')
    .order('created_at', { ascending: false });

  const grid = document.getElementById('listings-grid');
  document.getElementById('loading-msg')?.remove();

  if (error || !data || data.length === 0) {
    grid.innerHTML = '<p>No listings found.</p>';
    return;
  }

  data.forEach(listing => {
    const card = document.createElement('div');
    card.className = 'listing-card';
    card.onclick = () => {
      window.location.href = `update.html?id=${listing.id}`;
    };

    card.innerHTML = `
      <div class="card-img-wrap">
        <img
          src="${listing.image_url || 'https://placehold.co/400x300?text=No+Image'}"
          alt="${listing.title}"
          onerror="this.src='https://placehold.co/400x300?text=No+Image'"
        />
      </div>
      <div class="card-info">
        <p class="card-title">${listing.title}</p>
        <p class="card-price">€${parseFloat(listing.price).toFixed(2)}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}

loadListings();