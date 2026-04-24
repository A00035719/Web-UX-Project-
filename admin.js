const tbody = document.querySelector('#listings-table tbody');

async function loadListings() {
  const { data, error } = await db
    .from('listings')
    .select('id, title, price, image_url')
    .order('created_at', { ascending: false });

  tbody.innerHTML = '';

  if (error) {
    tbody.innerHTML = '<tr><td colspan="5">Error loading listings</td></tr>';
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No listings found</td></tr>';
    return;
  }

  data.forEach(listing => {
    const row = document.createElement('tr');

    const idTd = document.createElement('td');
    idTd.textContent = listing.id;

    const imgTd = document.createElement('td');
    imgTd.style.cssText = 'width:52px;padding:6px 8px;';
    const img = document.createElement('img');
    img.src = listing.image_url || 'https://placehold.co/40x40?text=?';
    img.alt = listing.title;
    img.onerror = () => { img.src = 'https://placehold.co/40x40?text=?'; };
    img.style.cssText = 'width:40px;height:40px;object-fit:cover;border-radius:6px;display:block;border:1px solid #E2DDD8;';
    imgTd.appendChild(img);

    const titleTd = document.createElement('td');
    titleTd.textContent = listing.title;

    const priceTd = document.createElement('td');
    priceTd.textContent = `$${listing.price}`;

    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.style.cssText = 'background:transparent;color:#C0392B;border:1px solid #C0392B;padding:0.35rem 0.85rem;border-radius:8px;font-family:DM Sans,sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:0.03em;cursor:pointer;';
    btn.onmouseenter = () => { btn.style.background = '#C0392B'; btn.style.color = '#fff'; };
    btn.onmouseleave = () => { btn.style.background = 'transparent'; btn.style.color = '#C0392B'; };
    btn.onclick = () => deleteListing(listing.id);
    const actionTd = document.createElement('td');
    actionTd.appendChild(btn);

    row.appendChild(idTd);
    row.appendChild(imgTd);
    row.appendChild(titleTd);
    row.appendChild(priceTd);
    row.appendChild(actionTd);
    tbody.appendChild(row);
  });
}

async function deleteListing(id) {
  if (!confirm("Are you sure you want to delete this listing?")) return;
  const { error } = await db.from('listings').delete().eq('id', id);
  if (error) { alert("Error deleting listing"); return; }
  loadListings();
}

loadListings();
