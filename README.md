# FitCRM — Simple Client Manager

## Project summary
FitCRM is a lightweight frontend-only CRM webapp to help fitness instructors manage client data: add clients, search, edit, view details, delete, and see suggested exercises for the next session. Data persists in the browser via localStorage.

## Tech stack
- HTML
- CSS
- JavaScript (vanilla)
- No backend required — localStorage is used for persistence

## Files
- index.html — Add new client
- clients.html — Client list & search
- client_edits.html — Edit client
- client_view.html — View client (details + exercises)
- css/styles.css — Styling
- js/main.js — App logic

## How to run locally
1. Ensure you are in the project directory.
2. Run a local server:
   ```bash
   python3 -m http.server 8000

