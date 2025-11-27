// Elements
const clientForm = document.getElementById('clientForm');
const clientTable = document.getElementById('clientTable')?.querySelector('tbody');
const searchBox = document.getElementById('searchBox');
const editForm = document.getElementById('editForm');

// Load clients
let clients = JSON.parse(localStorage.getItem('clients')) || [];

// Save to localStorage
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Add client
if (clientForm) {
  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      name: document.getElementById('name').value,
      age: document.getElementById('age').value,
      gender: document.getElementById('gender').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      goal: document.getElementById('goal').value,
      startDate: document.getElementById('startDate').value
    };
    clients.push(newClient);
    saveClients();
    alert('Client added!');
    clientForm.reset();
  });
}

// Render clients table
function renderClients(filter = '') {
  if (!clientTable) return;
  clientTable.innerHTML = '';
  clients
    .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.goal}</td>
        <td>${c.startDate}</td>
        <td>
          <button onclick="editClient(${c.id})">Edit</button>
          <button onclick="deleteClient(${c.id})">Delete</button>
        </td>
      `;
      clientTable.appendChild(tr);
    });
}

// Delete
function deleteClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    renderClients(searchBox.value);
  }
}

// Search
if (searchBox) {
  searchBox.addEventListener('input', () => renderClients(searchBox.value));
}

// Edit redirect
function editClient(id) {
  localStorage.setItem('editClientId', id);
  window.location.href = 'clients_edits.html';
}

// Populate edit form
if (editForm) {
  const editId = localStorage.getItem('editClientId');
  const client = clients.find(c => c.id == editId);
  if (client) {
    document.getElementById('editName').value = client.name;
    document.getElementById('editAge').value = client.age;
    document.getElementById('editGender').value = client.gender;
    document.getElementById('editEmail').value = client.email;
    document.getElementById('editPhone').value = client.phone;
    document.getElementById('editGoal').value = client.goal;
    document.getElementById('editStartDate').value = client.startDate;
  }

  editForm.addEventListener('submit', e => {
    e.preventDefault();
    client.name = document.getElementById('editName').value;
    client.age = document.getElementById('editAge').value;
    client.gender = document.getElementById('editGender').value;
    client.email = document.getElementById('editEmail').value;
    client.phone = document.getElementById('editPhone').value;
    client.goal = document.getElementById('editGoal').value;
    client.startDate = document.getElementById('editStartDate').value;
    saveClients();
    alert('Client updated!');
    window.location.href = 'clients.html';
  });
}

// Initial render for clients page
renderClients();
