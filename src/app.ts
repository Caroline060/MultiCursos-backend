import { server } from './server';
import { DatabaseModel } from './model/DataBaseModel';

const port: number = 3333;

new DatabaseModel().testeConexao().then((resdb) => {
  if (resdb) {
    server.listen(port, () => {
      console.clear();
      console.log(`Aplicação on-line`)
      console.log(`Conexão com o banco de dados realizada com sucesso! Endereço do servidor: http://localhost:${port}`);
    });
  } else {
    console.log(`Erro ao conectar com o banco de dados.`);
  }
});