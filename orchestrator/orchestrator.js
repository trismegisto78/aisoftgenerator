// orchestrator/orchestrator.js

require('dotenv').config();
const readline = require('readline-sync');
const { OpenAI } = require('openai');
const executor = require('../executor/executor');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function start() {
  console.log("[Orchestrator] In attesa dell'input dell'utente...\n");

  const inputUtente = readline.question("Descrivi il software che vuoi generare:\n> ");

  const prompt = `
Sei un assistente che trasforma richieste testuali in task strutturati per la generazione automatica di software.

Dato il seguente input utente:
"${inputUtente}"

Genera una lista JSON con massimo 6 oggetti, ognuno con questo schema fisso:

{
  "id": "task-001",
  "task": "...",
  "descrizione": "...",
  "stato": "to_start",
  "modulo_target": "...",
  "dipendenze": [],
  "payload": { ... }
}

Rispondi solo con un array JSON valido, senza commenti o testo aggiuntivo.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3
  });

  const rispostaGrezza = completion.choices[0].message.content.trim();

let tasks;
try {
  const cleanJson = rispostaGrezza
    .replace(/^```json\n/, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();

  tasks = JSON.parse(cleanJson);
} catch (err) {
  console.error("[Orchestrator] Errore nel parsing del JSON dalla risposta:", err.message);
  console.log("Contenuto ricevuto:\n", rispostaGrezza);
  return;
}


  console.log("[Orchestrator] Task ricevuti da OpenAI:");
  tasks.forEach(t => {
    console.log(`• ${t.task} (${t.id}) [${t.modulo_target}]`);
  });

  await executor.runTasks(tasks);
}

module.exports = { start };
