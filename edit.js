// edit.js

let currentListingId = null;

// Fetch listing from Supabase by ID
async function fetchListing() {
  const id = document.getElementById('listing-id').value.trim();

  if (!id) {
    alert('Please enter a listing ID.');
    return;
  }

  const { data, error } = await db
    .from('listings')
    .select('*, categories(id, name)')
    .eq('id', id)
    .single();

  if (error || !data) {
    alert('No listing found with that ID. Please try again.');
    return;
  }

  // Save the ID for use in updateListing()
  currentListingId = data.id;

  // Pre-populate the form fields
  document.getElementById('title').value = data.title;
  document.getElementById('description').value = data.description;
  document.getElementById('price').value = data.price;
  document.getElementById('image-url').value = data.image_url || '';

  // Load categories into dropdown, then set the current one
  await loadCategories(data.category_id);

  // Show the form
  document.getElementById('edit-form-section').style.display = 'block';
  document.getElementById('status-message').textContent = '';
}

// Load categories from Supabase into the <select> dropdown
async function loadCategories(selectedId) {
  const { data, error } = await db
    .from('categories')
    .select('id, name')
    .order('name');

  if (error || !data) {
    console.error('Could not load categories:', error);
    return;
  }

  const select = document.getElementById('category');
  select.innerHTML = ''; // Clear any existing options

  data.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    if (cat.id === selectedId) option.selected = true;
    select.appendChild(option);
  });
}

// Update the listing in Supabase
async function updateListing() {
  if (!currentListingId) {
    alert('No listing selected.');
    return;
  }

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const category_id = parseInt(document.getElementById('category').value);
  const image_url = document.getElementById('image-url').value.trim();

  // Basic validation
  if (!title || !description || isNaN(price) || !category_id) {
    alert('Please fill in all required fields.');
    return;
  }

  const { error } = await db
    .from('listings')
    .update({ title, description, price, category_id, image_url })
    .eq('id', currentListingId);

  const status = document.getElementById('status-message');

  if (error) {
    status.textContent = 'Something went wrong. Please try again.';
    status.style.color = '#C0392B';
  } else {
    status.textContent = '✓ Listing updated successfully!';
    status.style.color = '#C17B4E';
  }
}