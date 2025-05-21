import hana from '@sap/hana-client';


export const connParams = {
    serverNode: '10.117.165.43:30015',
    uid: 'GTO_MYLTIANE',
    pwd: 'Game9532@',
    dbname: 'QUALITY_CONC_HML',
    encrypt: false
};
 const conn = hana.createConnection();

conn.connect(connParams, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados estabelecida com sucesso.');
});
  
export default conn;

