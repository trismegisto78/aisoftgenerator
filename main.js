const orchestrator = require('./orchestrator/orchestrator');

async function start() {
  console.log("Avvio piattaforma di generazione software...");
  await orchestrator.start();
}

start();
