const db = window.db;

async function loadListings() {
  const tbody = document.querySelector("#listings-table tbody");

  const { data, error } = await db.from("listings").select("*");

  tbody.innerHTML = "";

  if (error) {
    tbody.innerHTML = "<tr><td>Error</td></tr>";
    return;
  }

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.price}</td>
      <td><button onclick="deleteListing('${item.id}')">Delete</button></td>
    `;

    tbody.appendChild(row);
  });
}

async function deleteListing(id) {
  await db.from("listings").delete().eq("id", id);
  loadListings();
}

loadListings();
