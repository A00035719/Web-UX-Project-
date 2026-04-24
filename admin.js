const tbody = document.querySelector('#listings-table tbody');

async function loadListings() {
  const { data, error } = await db
    .from('listings')
    .select('id, title, price')
    .order('created_at', { ascending: false });

  tbody.innerHTML = '';

  if (error) {
    tbody.innerHTML = '<tr><td colspan="4">Error loading listings</td></tr>';
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No listings found</td></tr>';
    return;
  }

  data.forEach(listing => {
    const row = document.createElement('tr');

    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.style.cssText = 'background:transparent;color:#C0392B;border:1px solid #C0392B;padding:0.35rem 0.85rem;border-radius:8px;font-family:DM Sans,sans-serif;font-size:0.78rem;font-weight:500;letter-spacing:0.03em;cursor:pointer;';
    btn.onmouseenter = () => { btn.style.background = '#C0392B'; btn.style.color = '#fff'; };
    btn.onmouseleave = () => { btn.style.background = 'transparent'; btn.style.color = '#C0392B'; };
    btn.onclick = () => deleteListing(listing.id);

    const td = document.createElement('td');
    td.appendChild(btn);

    row.innerHTML = `
      <td>${listing.id}</td>
      <td>${listing.title}</td>
      <td>$${listing.price}</td>
    `;
    row.appendChild(td);
    tbody.appendChild(row);
  });
}

async function deleteListing(id) {
  if (!confirm("Are you sure you want to delete this listing?")) return;

  const { error } = await db
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    alert("Error deleting listing");
    console.error(error);
    return;
  }

  loadListings();
}

loadListings();
