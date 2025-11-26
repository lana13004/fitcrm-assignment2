// Get elements
const clientForm = document.getElementById('clientForm');
const clientTable = document.getElementById('clientTable')?.querySelector('tbody');
const searchBox = document.getElementById('searchBox');

// Load clients from localStorage
let clients = JSON.parse(localStorage.getItem('clients')) || [];

// Helper: save to localStorage
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Add new client
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
    renderClients(searchBox.value);
  }
}

// Search clients
if (searchBox) {
  searchBox.addEventListener('input', () => renderClients(searchBox.value));
}

// Edit / View Client (simple redirect for now)
function editClient(id) {
  alert('Edit feature will repopulate form (implement as needed)');
}

function viewClient(id) {
  localStorage.setItem('viewClientId', id);
  window.location.href = 'client_view.html';
}

// Populate client_view.html
document.addEventListener('DOMContentLoaded', () => {
  const clientId = localStorage.getItem('viewClientId');
  if (!clientId) return;
  const client = clients.find(c => c.id == clientId);
  if (!client) return;

  document.getElementById('clientName').textContent = client.name;
  document.getElementById('clientEmail').textContent = client.email;
  document.getElementById('clientPhone').textContent = client.phone;
  document.getElementById('clientGoal').textContent = client.goal;
  document.getElementById('clientStart').textContent = client.startDate;

  // Suggested exercises placeholder
  const exerciseList = document.getElementById('exerciseList');
  if (exerciseList) exerciseList.innerHTML = `
    <ul>
      <li>Push Ups</li>
      <li>Squats</li>
      <li>Lunges</li>
      <li>Plank</li>
      <li>Burpees</li>
    </ul>
  `;
});

