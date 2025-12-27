async function loadProducts() {
  const res = await fetch('/admin/products');
  const products = await res.json();
  const tbody = document.getElementById('productTable');
  tbody.innerHTML = '';

  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.category}</td>
      <td>${p.page}</td>
      <td>${p.url}</td>
      <td>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteProduct(id) {
  if (!confirm('Delete product?')) return;
  await fetch('/admin/products/' + id, { method: 'DELETE' });
  loadProducts();
}

document.getElementById('productForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  await fetch('/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.value,
      category: form.category.value,
      page: form.page.value,
      url: form.url.value
    })
  });

  form.reset();
  loadProducts();
});

loadProducts();
