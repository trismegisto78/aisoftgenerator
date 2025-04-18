// planner/taskDecomposer.js

require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Decompone un macro‑task in una lista di atomic task.
 * @param {Object} task Oggetto macro‑task con campi { id, task, descrizione, ... }
 * @returns {Promise<Object[]>} Array di atomic task JSON
 */
async function decompose(task) {
  // Prepara prompt per il LLM
  const prompt = `
Ricevi questo macro‑task JSON:
${JSON.stringify(task, null, 2)}

Scomponilo in una lista di **atomic task**.  
**OBBLIGATORIAMENTE** usa solo uno dei seguenti tipi (UPPER_SNAKE_CASE):

  GEN_FILE, CREATE_DIR, GEN_DB_SCHEMA, CREATE_TABLE,
  CONFIGURE_CONNECTION, PREPARE_INSERT_STATEMENT, EXECUTE_INSERT,
  GENERATE_SNIPPET, CREATE_API_ENDPOINT, IMPLEMENT_API_LOGIC,
  INSTALL_DEPENDENCIES, CREATE_TEST_CASE, RUN_TESTS,
  PREPARE_TEST_ENVIRONMENT, ANALYZE_TEST_RESULTS, LOG_INSERTION

Ogni atomic task deve avere ESATTAMENTE questi campi:
- "id": stringa univoca (es. "${task.id}-01")
- "task": uno dei tipi canonici elencati sopra
- "descrizione": descrizione dettagliata
- "stato": sempre "to_start"
- "modulo_target": uno fra "fileSystemAgent", "databaseAgent", "codeAgent", "testAgent"
- "dipendenze": array di id di altri atomic task
- "payload": oggetto con le info tecniche necessarie

Rispondi **solo** con un array JSON valido, senza testo o commenti aggiuntivi.
  `;

  // Chiamata LLM
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  let raw = completion.choices[0].message.content.trim();

  // Ripulisci eventuali blocchi markdown
  raw = raw
    .replace(/^```json\s*/, '')
    .replace(/```$/, '')
    .trim();

  // Parse JSON
  let atomicTasks;
  try {
    atomicTasks = JSON.parse(raw);
  } catch (err) {
    console.error("[Planner] Errore nel parsing dei subtasks:", err.message);
    console.log("Raw response:\n", raw);
    throw err;
  }

  return atomicTasks;
}

module.exports = { decompose };
