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
    testAgent,
    // decomposizione dei macro‑task
    planner:            taskDecomposer,
    analisi_requisiti:  taskDecomposer,
    database:           taskDecomposer,
    backend:            taskDecomposer,
    frontend:           taskDecomposer,
    testing:            taskDecomposer,
    integration:        taskDecomposer,
    documentation:      taskDecomposer,
    deploy:             taskDecomposer
  };

/**
 * Esegue una lista di task (macro o atomic).
 */
async function runTasks(tasks) {


  for (const task of tasks) {
    task.task = normalize(task.task);
    console.log(
      `[Executor] Eseguo task: ${task.task} (${task.id}) → modulo: ${task.modulo_target}`
    );

    const handler = moduleMap[task.modulo_target];
    if (!handler) {
      console.warn(
        `[Executor] Modulo non riconosciuto: ${task.modulo_target} (skipped)`
      );
      continue;
    }

    try {
      if (handler === taskDecomposer) {
        // macro‑task → atomic task
        const atomicTasks = await handler.decompose(task);
        console.log(
          `[Executor] Decomposer ha generato ${atomicTasks.length} subtasks per ${task.id}`
        );
        await runTasks(atomicTasks);
      } else {
        // atomic task → agente specialistico
        await handler.handle(task);
      }
    } catch (err) {
      console.error(
        `[Executor] Errore durante l'esecuzione di ${task.id}:`,
        err
      );
    }
  }
}

module.exports = { runTasks };
