// js/main.js
// Single JS file used by all pages. Designed to detect which page it's on
// and wire up appropriate functionality. Exposes global functions used by
// inline onclick handlers created when rendering rows.

(function () {
  // Sample clients (initial seed)
  const sampleClients = [
    { id: 1, name: "Farida Abdelrazek", email: "Faridaabdelrazek@gmail.com", phone: "555-1234", goal: "Weight Loss", startDate: "2024-01-15", age: 28, gender: "Female", history: [] },
    { id: 2, name: "Tarek Mohamed", email: "Tarekkmohamed@gmail.com", phone: "555-5678", goal: "Muscle Gain", startDate: "2024-03-12", age: 32, gender: "Male", history: [] },
    { id: 3, name: "Lana Ahmed", email: "lanabeshir@gmail.com", phone: "555-8765", goal: "General Fitness", startDate: "2023-11-10", age: 25, gender: "Female", history: [] },
    { id: 4, name: "Mohamed Beshir", email: "Mohamedbeshir@gmail.com", phone: "555-4321", goal: "Weight Loss", startDate: "2024-06-01", age: 30, gender: "Male", history: [] },
    { id: 5, name: "Yassin el Massry", email: "Yassin@gmail.com", phone: "555-6789", goal: "Muscle Gain", startDate: "2025-02-20", age: 27, gender: "Male", history: [] },
    { id: 6, name: "Mirna Sameh", email: "Mirnasameh@gmail.com", phone: "555-3456", goal: "General Fitness", startDate: "2024-09-15", age: 29, gender: "Female", history: [] },
    { id: 7, name: "Malak Solima", email: "Malaksoliman@gmail.com", phone: "555-7890", goal: "Weight Loss", startDate: "2024-12-05", age: 26, gender: "Female", history: [] },
    { id: 8, name: "Ahmed Hany", email: "Ahmedhany@gmail.com", phone: "555-9012", goal: "Muscle Gain", startDate: "2023-08-25", age: 31, gender: "Male", history: [] },
    { id: 9, name: "Ismail Mostafa", email: "Ismailmostafa@gmail.com", phone: "555-2345", goal: "General Fitness", startDate: "2024-04-18", age: 28, gender: "Male", history: [] },
    { id: 10, name: "Gamal Hussein", email: "Gamalhussein@gmail.com", phone: "555-6781", goal: "Weight Loss", startDate: "2025-01-05", age: 33, gender: "Male", history: [] }
  ];

  // ----- Utilities -----
  function loadClients() {
    const raw = localStorage.getItem('clients');
    if (!raw) {
      localStorage.setItem('clients', JSON.stringify(sampleClients));
      return [...sampleClients];
    }
    try {
      return JSON.parse(raw) || [];
    } catch (e) {
      console.error("Failed to parse clients from localStorage:", e);
      localStorage.removeItem('clients');
      localStorage.setItem('clients', JSON.stringify(sampleClients));
      return [...sampleClients];
    }
  }

  function saveClients(clients) {
    localStorage.setItem('clients', JSON.stringify(clients));
  }

  // Expose globals for inline onclicks
  window.viewClient = function (id) {
    localStorage.setItem('viewClientId', id);
    window.location.href = 'client_view.html';
  };
  window.editClient = function (id) {
    localStorage.setItem('editClientId', id);
    window.location.href = 'client_edits.html';
  };
  window.deleteClient = function (id) {
    if (!confirm("Are you sure you want to delete this client?")) return;
    let clients = loadClients();
    clients = clients.filter(c => c.id !== id);
    saveClients(clients);

    const table = document.getElementById('clientTable');
    if (table) renderClients(document.getElementById('search')?.value || '');
  };

  // ----- Rendering client list (clients.html) -----
  function renderClients(filter = '') {
    const tableBody = document.getElementById('clientTable');
    if (!tableBody) return;
    const clients = loadClients();
    tableBody.innerHTML = '';

    const filtered = clients.filter(c => c.name.toLowerCase().includes((filter || '').toLowerCase()));
    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" class="center">No clients found.</td></tr>`;
      return;
    }

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.phone)}</td>
        <td>${escapeHtml(c.goal)}</td>
        <td>${escapeHtml(c.startDate)}</td>
        <td class="td-buttons">
          <button class="view-btn" onclick="viewClient(${c.id})">View</button>
          <button class="edit-btn" onclick="editClient(${c.id})">Edit</button>
          <button class="delete-btn" onclick="deleteClient(${c.id})">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 6;
  }

  // ----- Page-specific wiring -----
  document.addEventListener('DOMContentLoaded', () => {
    const pageAddForm = document.getElementById('clientForm');
    const pageEditForm = document.getElementById('editClientForm');
    const pageClientTable = document.getElementById('clientTable');
    const pageSearch = document.getElementById('search');

    // Clients list
    if (pageClientTable) {
      renderClients();
      if (pageSearch) pageSearch.addEventListener('input', () => renderClients(pageSearch.value));
    }

    // Add client page
    if (pageAddForm) {
      pageAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const goal = document.getElementById('goal').value;
        const startDate = document.getElementById('startDate').value;

        if (!name || !email || !phone || !goal || !startDate) { alert("Please fill all required fields."); return; }
        if (!isValidEmail(email)) { alert("Please enter a valid email."); return; }
        if (!isValidPhone(phone)) { alert("Please enter a valid phone number."); return; }

        const clients = loadClients();
        const newClient = { id: Date.now(), name, age, gender, email, phone, goal, startDate, history: [] };
        clients.push(newClient);
        saveClients(clients);
        alert('Client added!');
        pageAddForm.reset();
      });
    }

    // Edit client page
    if (pageEditForm) {
      const editId = localStorage.getItem('editClientId');
      const clients = loadClients();
      const idx = clients.findIndex(c => c.id == editId);
      if (idx === -1) { alert("Client not found."); window.location.href = 'clients.html'; return; }
      const cli = clients[idx];
      document.getElementById('name').value = cli.name || '';
      document.getElementById('age').value = cli.age || '';
      document.getElementById('gender').value = cli.gender || '';
      document.getElementById('email').value = cli.email || '';
      document.getElementById('phone').value = cli.phone || '';
      document.getElementById('goal').value = cli.goal || '';
      document.getElementById('startDate').value = cli.startDate || '';

      pageEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const goal = document.getElementById('goal').value;
        const startDate = document.getElementById('startDate').value;

        if (!name || !email || !phone || !goal || !startDate) { alert("Please fill all required fields."); return; }
        if (!isValidEmail(email)) { alert("Please enter a valid email."); return; }
        if (!isValidPhone(phone)) { alert("Please enter a valid phone number."); return; }

        clients[idx] = { ...clients[idx], name, age, gender, email, phone, goal, startDate };
        saveClients(clients);
        alert("Client updated successfully!");
        window.location.href = 'clients.html';
      });
    }

    // Client view page
    const clientDetails = document.getElementById('clientDetails');
    const exerciseList = document.getElementById('exercise-list'); // must match <ul id="exercise-list">
    if (clientDetails) {
      const viewId = localStorage.getItem('viewClientId');
      const clients = loadClients();
      const client = clients.find(c => c.id == viewId);
      if (!client) {
        clientDetails.innerHTML = "<p>Client not found.</p>";
      } else {
        clientDetails.innerHTML = `
          <p><strong>Name:</strong> ${escapeHtml(client.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(client.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(client.phone)}</p>
          <p><strong>Goal:</strong> ${escapeHtml(client.goal)}</p>
          <p><strong>Membership Start:</strong> ${escapeHtml(client.startDate)}</p>
          <p><strong>Training History:</strong> ${client.history && client.history.length ? escapeHtml(client.history.join(', ')) : 'No training history available yet.'}</p>
        `;
      }

      // Fetch 5 exercises via CORS proxy (AllOrigins)
      (async function loadExercises() {
        if (!exerciseList) return;
        try {
          exerciseList.innerHTML = '<li>Loading exercises...</li>';
          const resp = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://wger.de/api/v2/exercise/?limit=5&language=2'));
          if (!resp.ok) throw new Error('Network response not ok');
          const data = await resp.json();
          const results = JSON.parse(data.contents).results;

          if (results.length === 0) {
            exerciseList.innerHTML = '<li>No exercises found.</li>';
            return;
          }

          exerciseList.innerHTML = ''; // clear loading
          results.forEach(ex => {
            const li = document.createElement('li');
            li.textContent = ex.name || 'Unnamed';
            exerciseList.appendChild(li);
          });
        } catch (err) {
          console.warn('Exercise fetch failed:', err);
          // Fallback static list
          const fallbackExercises = ["Push-ups", "Squats", "Lunges", "Plank", "Jumping Jacks"];
          exerciseList.innerHTML = '';
          fallbackExercises.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            exerciseList.appendChild(li);
          });
        }
      })();
    }
  });
})();
