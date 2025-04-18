// agents/codeAgent.js
module.exports.handle = async function(task) {
  const p = task.payload || {};

  switch (task.task) {
    case 'CREATE_API_ENDPOINT': {
      const route  = p.route  || '/api/unknown';
      const method = (p.method || 'GET').toUpperCase();
      console.log(`[Code Agent] Genero endpoint ${method} ${route}`);
      // TODO: genera snippet Express/Fastify
      break;
    }
    case 'IMPLEMENT_API_LOGIC': {
      console.log(
        `[Code Agent] Implemento logica per ${p.route || '/api/unknown'} ` +
        `con payload ${JSON.stringify(p)}`
      );
      break;
    }
    case 'INSTALL_DEPENDENCIES': {
      const pkgs = Array.isArray(p.packages) ? p.packages.join(', ') : '(nessuno)';
      console.log(`[Code Agent] Installo dipendenze: ${pkgs}`);
      // TODO: scrivi package.json o esegui comando
      break;
    }
    case 'GENERATE_SNIPPET': {
      console.log(`[Code Agent] Genero snippet ${p.language||'js'}: ${p.spec||'(nessuna spec)'}`);
      break;
    }
    case 'SETUP_ENV': {
      console.log(`[Code Agent] Configuro ENV: ${JSON.stringify(p)}`);
      break;
    }
    case 'GEN_FILE': {
      // questo viene gestito da fileSystemAgent: per sicurezza logghiamo il contenuto
      console.log(`[Code Agent] GEN_FILE delegato a FS: payload = ${JSON.stringify(p)}`);
      break;
    }
    default:
      console.warn(`[Code Agent] Task non gestito: ${task.task}`);
  }
};
