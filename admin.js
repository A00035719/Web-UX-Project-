async function waitForDb() {
  while (!window.db) {
    await new Promise(r => setTimeout(r, 50));
  }
  return window.db;
}

const tbody = document.querySelector('#listings-table tbody');

async function loadListings() {
  const db = await waitForDb();

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

    row.innerHTML = `
      <td>${listing.id}</td>
      <td>${listing.title}</td>
      <td>$${listing.price}</td>
      <td><button onclick="deleteListing('${listing.id}')">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

async function deleteListing(id) {
  const db = await waitForDb();

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
