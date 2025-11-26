// ---- GET ELEMENTS ----
const clientForm = document.querySelector('form');
const clientTableBody = document.querySelector('table tbody');
const searchInput = document.getElementById('search');

// ---- LOAD CLIENTS FROM LOCALSTORAGE ----
let clients = JSON.parse(localStorage.getItem('clients')) || [];

// ---- SAVE TO LOCALSTORAGE ----
function saveClients() {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// ---- ADD OR EDIT CLIENT ----
if (clientForm) {
  const editId = localStorage.getItem('editClientId');

  if (editId) {
    // Fill form with existing client data
    const client = clients.find(c => c.id == editId);
    if (client) {
      clientForm.fullname.value = client.name;
      clientForm.age.value = client.age;
      clientForm.gender.value = client.gender;
      clientForm.email.value = client.email;
      clientForm.phone.value = client.phone;
      clientForm.goal.value = client.goal;
      clientForm.startdate.value = client.startDate;
    }
  }

  clientForm.addEventListener('submit', e => {
    e.preventDefault();

    const clientData = {
      id: editId ? parseInt(editId) : Date.now(),
      name: clientForm.fullname.value,
      age: clientForm.age.value,
      gender: clientForm.gender.value,
      email: clientForm.email.value,
      phone: clientForm.phone.value,
      goal: clientForm.goal.value,
      startDate: clientForm.startdate.value
    };

    if (editId) {
      // Update client
      const index = clients.findIndex(c => c.id == editId);
      clients[index] = clientData;
      localStorage.removeItem('editClientId');
      alert('Client updated!');
      window.location.href = 'clients.html';
    } else {
      // Add new client
      clients.push(clientData);
      alert('Client added!');
      clientForm.reset();
    }

    saveClients();
  });
}

// ---- RENDER CLIENT TABLE ----
function renderClients(filter = '') {
  if (!clientTableBody) return;

  clientTableBody.innerHTML = '';
  clients
    .filter(c => c.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td data-label="Name">${c.name}</td>
        <td data-label="Email">${c.email}</td>
        <td data-label="Phone">${c.phone}</td>
        <td data-label="Fitness Goal">${c.goal}</td>
        <td data-label="Membership Start Date">${c.startDate}</td>
        <td data-label="Actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
          <button class="view-btn">View</button>
        </td>
      `;
      // Attach actions
      tr.querySelector('.edit-btn').addEventListener('click', () => editClient(c.id));
      tr.querySelector('.delete-btn').addEventListener('click', () => deleteClient(c.id));
      tr.querySelector('.view-btn').addEventListener('click', () => viewClient(c.id));

      clientTableBody.appendChild(tr);
    });
}

// ---- DELETE CLIENT ----
function deleteClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    renderClients(searchInput?.value || '');
  }
}

// ---- EDIT CLIENT ----
function editClient(id) {
  localStorage.setItem('editClientId', id);
  window.location.href = 'clients_edits.html';
}

// ---- VIEW CLIENT ----
function viewClient(id) {
  localStorage.setItem('viewClientId', id);
  window.location.href = 'client_view.html';
}

// ---- SEARCH CLIENTS ----
if (searchInput) {
  searchInput.addEventListener('input', () => renderClients(searchInput.value));
}

// ---- CLIENT VIEW PAGE ----
document.addEventListener('DOMContentLoaded', () => {
  const clientId = localStorage.getItem('viewClientId');
  if (!clientId) return;

  const client = clients.find(c => c.id == clientId);
  if (!client) return;

  const fields = {
    clientName: client.name,
    clientEmail: client.email,
    clientPhone: client.phone,
    clientGoal: client.goal,
    clientStart: client.startDate
  };

  Object.keys(fields).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = fields[id];
  });

  const exerciseList = document.getElementById('exerciseList');
  if (exerciseList) exerciseList.innerHTML = `
    <li>Push Ups</li>
    <li>Squats</li>
    <li>Lunges</li>
    <li>Plank</li>
    <li>Burpees</li>
  `;

  // Render table if on clients.html
  renderClients(searchInput?.value || '');
});
