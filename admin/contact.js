async function loadContacts() {
  const res = await fetch('/admin/contacts');
  const contacts = await res.json();
  const tbody = document.getElementById('contactTable');
  tbody.innerHTML = '';

  contacts.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone || '-'}</td>
      <td>${c.status}</td>
      <td>${c.message}</td>
      <td>
        ${c.status === 'new'
          ? `<button onclick="markRead('${c._id}')">Mark Read</button>`
          : ''}
        <button onclick="deleteContact('${c._id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function markRead(id) {
  await fetch('/admin/contacts/' + id + '/read', { method: 'PUT' });
  loadContacts();
}

async function deleteContact(id) {
  if (!confirm('Delete enquiry?')) return;
  await fetch('/admin/contacts/' + id, { method: 'DELETE' });
  loadContacts();
}

loadContacts();
