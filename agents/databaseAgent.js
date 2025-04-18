// agents/databaseAgent.js

module.exports.handle = async function(task) {
  const p = task.payload || {};

  switch (task.task) {
    case 'CREATE_TABLE_RECIPES':
    case 'CREATE_TABLE': {
      const tableName = p.tableName || 'recipes';
      const columns   = p.columns   || ['id','name','ingredients','instructions'];
      console.log(`[DB Agent] Creo tabella ${tableName} (${columns.join(', ')})`);
      break;
    }
    case 'DEFINE_RELATIONS': {
      console.log(`[DB Agent] Definisco relazioni: ${JSON.stringify(p.relations)}`);
      break;
    }
    case 'CREATE_DATABASE':
    case 'CREATE_DB': {
      const dbName = p.databaseName || 'my_database';
      console.log(`[DB Agent] Creo database ${dbName}`);
      break;
    }
    case 'CONFIGURE_CONNECTION': {
      console.log(
        `[DB Agent] Configuro connessione ` +
        `${p.host || 'localhost'}:${p.port||5432} user=${p.user||'root'}`
      );
      break;
    }
    default:
      console.warn(`[DB Agent] Task non gestito: ${task.task}`);
  }
};
