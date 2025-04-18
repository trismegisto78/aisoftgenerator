const macroTargets = new Set([
  'database',
  'backend',
  'frontend',
  'testing',
  'integration',
  'documentation',
  'deploy'
]);


// in cima a executor/executor.js
const normalize = s => {
  if (typeof s !== 'string') return '';
  return s
    .normalize('NFD')                            // separa caratteri e accenti
    .replace(/[\u0300-\u036f]/g, '')             // rimuove accenti
    .replace(/[^A-Za-z0-9]+/g, '_')              // trasforma non‑alfanumerici in underscore
    .replace(/_+/g, '_')                         // collassa underscore multipli
    .replace(/^_+|_+$/g, '')                     // rimuove underscore iniziali/finali
    .toUpperCase();                              // maiuscole
};




const fileSystemAgent   = require('../agents/fileSystemAgent');
const databaseAgent     = require('../agents/databaseAgent');
const codeAgent         = require('../agents/codeAgent');
const testAgent         = require('../agents/testAgent');
const taskDecomposer    = require('../planner/taskDecomposer');

// Mappa nome modulo → handler
const moduleMap = {
  fileSystemAgent,
  databaseAgent,
  codeAgent,
  testAgent
};

/**
 * Esegue una lista di task (macro o atomic).
 */
async function runTasks(tasks) {


  for (const task of tasks) {
    // normalizza il titolo
    task.task = normalize(task.task);

    console.log(`[Executor] Eseguo task: ${task.task} (${task.id}) → modulo: ${task.modulo_target}`);

    // se è un macro‑task, passa al decomposer
    if (macroTargets.has(task.modulo_target)) {
      try {
        const atomicTasks = await taskDecomposer.decompose(task);
        console.log(
          `[Executor] Decomposer ha generato ${atomicTasks.length} subtasks per ${task.id}`
        );
        await runTasks(atomicTasks);
      } catch (err) {
        console.error(`[Executor] Errore decomposing ${task.id}:`, err);
      }
      continue;
    }

    // altrimenti è atomic: trova l'agente
    const handler = moduleMap[task.modulo_target];
    if (!handler) {
      console.warn(`[Executor] Modulo non riconosciuto: ${task.modulo_target} (skip)`);
      continue;
    }
    try {
      await handler.handle(task);
    } catch (err) {
      console.error(`[Executor] Errore su ${task.id}:`, err);
    }
  }
}

module.exports = { runTasks };
