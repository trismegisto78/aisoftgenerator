// test-decompose.js (nella root)
const decomposer = require('./planner/taskDecomposer');
const sampleTask = {
  id: "task-100",
  task: "sviluppo_backend",
  descrizione: "Implementare le API per gestire i dati del meal planner",
  stato: "to_start",
  modulo_target: "planner",
  dipendenze: ["task-002"],
  payload: { tech: "Node.js" }
};

(async () => {
  const subtasks = await decomposer.decompose(sampleTask);
  console.log("Atomic tasks:\n", subtasks);
})();
