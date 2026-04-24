async function loadCategories() {
  const { data } = await db.from("categories").select("*");

  const select = document.getElementById("category");

  data.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    select.appendChild(option);
  });
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const listing = {
    title: document.getElementById("title").value,
    price: document.getElementById("price").value,
    description: document.getElementById("description").value,
    image_url: document.getElementById("image").value,
    category_id: document.getElementById("category").value
  };

  const { error } = await db.from("listings").insert([listing]);

  const status = document.getElementById("status");

  if (error) {
    status.textContent = "Error adding listing";
  } else {
    status.textContent = "Listing added!";
    e.target.reset();
  }
});

loadCategories();
