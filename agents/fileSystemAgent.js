const fs   = require('fs-extra');
const path = require('path');

// Esportiamo direttamente la funzione handle marcata async
module.exports.handle = async function(task) {
  const p = task.payload || {};


  if (task.task === 'CREATE_DIR') {
    console.info(`[FS Agent] CREATE_DIR payload=${JSON.stringify(task.payload, null, 2)} ---> in questo punto dovrebbe richiedere l'informazione all'executor`);
    return;
  }
  
  
  if (task.task === 'GEN_FILE') {
    // payload può definire 'path' o 'file_name'
    const fileName = p.path || p.file_name;
    if (!fileName) {
      console.warn(`[FS Agent] GEN_FILE senza 'path' o 'file_name' nel payload per ${task.id}`);
      return;
    }

    // costruiamo il percorso sotto 'generated/'
    const filePath = path.join('generated', fileName);
    const content  = p.content || '';

    console.log(`[FS Agent] Genero file ${filePath}`);
    // assicuriamoci che la cartella esista
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content);
    return;
  }

  // eventuali altri casi (es. LOG_INSERTION)...
  console.warn(`[FS Agent] Task non gestito: ${task.task}`);
};
