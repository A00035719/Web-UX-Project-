// update.js — handles the update form

let currentListingId = null;

// Get the listing ID from the URL e.g. update.html?id=3
const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');

async function init() {
    if (!listingId) {
        alert('No listing selected. Redirecting back.');
        window.location.href = 'edit.html';
        return;
    }

    await loadCategories();
    await fetchListing(listingId);
}

async function fetchListing(id) {
    const { data, error } = await db
        .from('listings')
        .select('*, categories(id, name)')
        .eq('id', id)
        .single();

    if (error || !data) {
        alert('Could not load listing. Redirecting back.');
        window.location.href = 'edit.html';
        return;
    }

    currentListingId = data.id;

    document.getElementById('title').value = data.title;
    document.getElementById('description').value = data.description;
    document.getElementById('price').value = data.price;
    document.getElementById('image-url').value = data.image_url || '';

  // Set the correct category in the dropdown
    document.getElementById('category').value = data.category_id;
}

async function loadCategories() {
    const { data, error } = await db
        .from('categories')
        .select('id, name')
        .order('name');

    if (error || !data) return;

    const select = document.getElementById('category');
    select.innerHTML = '';
    data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function updateListing() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const category_id = parseInt(document.getElementById('category').value);
    const image_url = document.getElementById('image-url').value.trim();

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

init();