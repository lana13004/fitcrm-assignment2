// Get elements
const clientForm = document.getElementById('clientForm');
const clientTable = document.getElementById('clientTable')?.querySelector('tbody');
const searchBox = document.getElementById('searchBox');

// Load clients from localStorage
let clients = JSON.parse(localStorage.getItem('clients')) || [];

// If no clients in localStorage, initialize with default 10 clients
if (clients.length === 0) {
  clients = [
    {id: 1, name: "Farida Abdelrazek", email: "Faridaabdelrazek@gmail.com", phone: "555-1234", goal: "Weight Loss", startDate: "2024-01-15"},
    {id: 2, name: "Tarek Mohamed", email: "Tarekkmohamed@gmail.com", phone: "555-5678", goal: "Muscle Gain", startDate: "2024-03-12"},
    {id: 3, name: "Lana Ahmed", email: "lanabeshir@gmail.com", phone: "555-8765", goal: "General Fitness", startDate: "2023-11-10"},
    {id: 4, name: "Mohamed Beshir", email: "Mohamedbeshir@gmail.com", phone: "555-4321", goal: "Weight Loss", startDate: "2024-06-01"},
    {id: 5, name: "Yassin el Massry", email: "Yassin@gmail.com", phone: "555-6789", goal: "Muscle Gain", startDate: "2025-02-20"},
    {id: 6, name: "Mirna Sameh", email: "Mirnasameh@gmail.com", phone: "555-3456", goal: "General Fitness", startDate: "2024-09-15"},
    {id: 7, name: "Malak Solima", email: "Malaksoliman@gmail.com", phone: "555-7890", goal: "Weight Loss", startDate: "2024-12-05"},
    {id: 8, name: "Ahmed Hany", email: "Ahmedhany@gmail.com", phone: "555-9012", goal: "Muscle Gain", startDate: "2023-08-25"},
    {id: 9, name: "Ismail Mostafa", email: "Ismailmostafa@gmail.com", phone: "555-2345", goal: "General Fitness", startDate: "2024-04-18"},
    {id: 10, name: "Gamal Hussein", email: "Gamalhussein@gmail.com", phone: "555-6781", goal: "Weight Loss", startDate: "2025-01-05"}
  ];
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Helper: save to localStorage
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
  renderClients(searchBox?.value || '');
}

// Add new client
if (clientForm) {
  clientForm.addEventListener('submit', e => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      name: document.getElementById('name').value,
      age: document.getElementById('age')?.value,
      gender: document.getElementById('gender')?.value,
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

// Populate client list table
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
          <button onclick="viewClient(${c.id})">View</button>
        </td>
      `;
      clientTable.appendChild(tr);
    });
}

// Delete client
function deleteClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
  }
}

// Search clients
if (searchBox) {
  searchBox.addEventListener('input', () => renderClients(searchBox.value));
}

// Edit / View Client (simple placeholder)
function editClient(id) {
  alert('Edit functionality not fully implemented yet.');
}

function viewClient(id) {
  localStorage.setItem('viewClientId', id);
  window.location.href = 'client_view.html';
}

// Initial render
renderClients();
