module.exports.handle = async function(task) {
  const p = task.payload || {};

  switch (task.task) {
    case 'GEN_DB_SCHEMA': {
      console.log(`[DB Agent] Genero schema DB per ${p.tech || 'Node.js/SQL'}`);
      // TODO: costruisci oggetto schema o script SQL
      break;
    }
    case 'CREATE_TABLE': {
      const tableName = p.table || p.tableName || 'recipes';
      const cols      = p.columns || p.fields || ['id','name','ingredients','instructions'];

      console.info("[DB Agent] cols="+JSON.stringify(cols, null, 2));
      console.log(`[DB Agent] Creo tabella ${tableName} (${cols.join(', ')})`);
      // TODO: esegui CREATE TABLE ...
      break;
    }
    case 'PREPARE_INSERT_STATEMENT': {
      const table = p.table || 'recipes';
      const fields = p.fields || ['name','ingredients','instructions'];
      console.log(`[DB Agent] Preparo INSERT per ${table} (${fields.join(', ')})`);
      // TODO: genera stringa parametrizzata
      break;
    }
    case 'EXECUTE_INSERT': {
      console.log(`[DB Agent] Eseguo INSERT in ${p.table || 'recipes'}:`, p.data);
      // TODO: esegui realmente la query
      break;
    }
    case 'CONFIGURE_CONNECTION': {
      console.log(
        `[DB Agent] Configuro connessione ` +
        `${p.host||'localhost'}:${p.port||5432} user=${p.user||'admin'}`
      );
      break;
    }
    default:
      console.warn(`[DB Agent] Task non gestito: ${task.task}`);
  }
};