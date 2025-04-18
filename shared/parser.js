// shared/parser.js

function parseUserRequest(userInput) {
  const normalized = userInput.toLowerCase();
  const tasks = [];

  // Estrai nome progetto (super semplificato per ora)
  const nameMatch = normalized.match(/(?:app|progetto)\s+(?:per\s+)?([a-z\s]+)/);
  const projectName = nameMatch ? nameMatch[1].trim().replace(/\s+/g, '-') : 'untitled-app';

  // File system
  tasks.push({
    type: 'CREATE_FS_STRUCTURE',
    payload: { name: projectName }
  });

  // Database
  if (normalized.includes("utenti") || normalized.includes("login")) {
    tasks.push({
      type: 'SETUP_DATABASE',
      payload: { tables: ["users"] }
    });
  }

  if (normalized.includes("lista") || normalized.includes("spesa")) {
    const existing = tasks.find(t => t.type === 'SETUP_DATABASE');
    if (existing) {
      existing.payload.tables.push("items", "lists");
    } else {
      tasks.push({
        type: 'SETUP_DATABASE',
        payload: { tables: ["items", "lists"] }
      });
    }
  }

  // Backend / API
  if (normalized.includes("aggiungere") || normalized.includes("elementi") || normalized.includes("prodotti")) {
    tasks.push({
      type: 'CODE_BACKEND',
      payload: { routes: ["addItem", "getItems"] }
    });
  }

  return tasks;
}

module.exports = { parseUserRequest };
