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
  console.log("[taskDecomposer] task json:\n---------------"+JSON.stringify(task, null, 2)+"\n---------------\n")
  const prompt = `
You receive this macro‑task JSON:
${JSON.stringify(task, null, 2)}

Decompose it into a list of **atomic tasks**.  
**MANDATORY**: use *only* the following atomic task types (UPPER_SNAKE_CASE):

  GEN_FILE, CREATE_DIR, GEN_DB_SCHEMA, CREATE_TABLE,
  CONFIGURE_CONNECTION, PREPARE_INSERT_STATEMENT, EXECUTE_INSERT,
  GENERATE_SNIPPET, CREATE_API_ENDPOINT, IMPLEMENT_API_LOGIC,
  INSTALL_DEPENDENCIES, CREATE_TEST_CASE, RUN_TESTS,
  PREPARE_TEST_ENVIRONMENT, ANALYZE_TEST_RESULTS, LOG_INSERTION

Each atomic task must have *exactly* these fields:
{
  "id": "<macro-task-id>-NN",
  "task": "<one of the types above>",
  "descrizione": "<detailed description>",
  "stato": "to_start",
  "modulo_target": one of ["fileSystemAgent","databaseAgent","codeAgent","testAgent"],
  "dipendenze": [<list of other task ids>],
  "payload": { /* must include mandatory parameters:
     - for GEN_FILE: path or file_name AND content
     - for CREATE_API_ENDPOINT: route AND method
     - for INSTALL_DEPENDENCIES: packages (array)
     (and so on for each type)
  */}
}

Respond *only* with a valid JSON array of atomic tasks, no extra text or markdown.
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
