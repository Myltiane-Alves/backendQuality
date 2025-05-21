## Pré-requisitos
Antes de começar, certifique-se de que você tenha as seguintes ferramentas instaladas:

Node.js: Versão 18.x ou superior.
npm: Gerenciador de pacotes, instalado junto com o Node.js.
MySQL: Banco de dados relacional usado pelo projeto.

## Começando
Clonar o Repositório
Clone este repositório para sua máquina local:

git clone https://github.com/seu-usuario/soft-quality.git

cd soft-quality

## Instalar Dependências
Instale todas as dependências necessárias com o comando:

npm install


## Estrutura do Projeto
plaintext
Copiar
Editar
src/
├── config/         # Configurações e conexões com o banco de dados
├── controllers/    # Lógica dos controladores da aplicação
├── middleware/     # Middlewares usados na aplicação
├── models/         # Modelos das entidades do banco de dados
├── routes/         # Definições de rotas da API
├── utils/          # Funções utilitárias
├── server.js       # Arquivo principal do servidor


## Configuração de Ambiente
Crie um arquivo .env na raiz do projeto com as variáveis de ambiente. Você pode usar o seguinte exemplo como referência:

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=soft_quality_db
JWT_SECRET=sua_chave_secreta
PORT=3000

## Documentação da API
A aplicação oferece uma documentação detalhada da API utilizando o Swagger. Siga os passos abaixo para acessá-la:

## Gere a documentação com o comando:

npm run start-gendoc

Inicie o servidor com:

npm start

Acesse a documentação no navegador no endereço:
http://localhost:3000/api-docs


## Tecnologias Utilizadas
O projeto foi desenvolvido com as seguintes tecnologias e bibliotecas:

Node.js: Ambiente de execução para JavaScript.
Express.js: Framework web para criação de APIs.
MySQL: Banco de dados relacional.
JWT (JsonWebToken): Autenticação baseada em tokens.
Swagger: Documentação automatizada da API.
Babel: Compilador para compatibilidade com versões mais antigas do Node.js.
Jest: Testes unitários.
Nodemon: Monitoramento de mudanças no código durante o desenvolvimento.

## Dependências
@sap/hana-client: ^2.18.27
@sap/xsenv: ^4.2.0
axios: ^1.6.5
bcrypt: ^5.1.1
body-parser: ^1.20.2
cookie-parser: ^1.4.6
cors: ^2.8.5
date-fns: ^3.0.1
dotenv: ^16.3.1
express: ^4.18.2
jsonwebtoken: ^9.0.2
moment: ^2.29.4
morgan-body: ^2.6.9
mysql2: ^3.6.5
nodemjs: ^0.1.14
nodemon: ^3.0.1
passport: ^0.7.0
reflect-metadata: ^0.1.13
rxjs: ^7.8.1
swagger-ui-express: ^5.0.0
uuid: ^9.0.1
winston: ^3.11.0

## Licença
Este projeto está licenciado sob a licença ISC. Consulte o arquivo LICENSE para mais detalhes.


## Modelo de Pull Request ##

## Padrão de Commit ##
- [] Bug Fix (alteração ininterrupta que corrige um problema)
- [] New Feature (alteração ininterrupta que adiciona funcionalidade)
- [] Breaking Change (correção ou recurso que faria com que a funcionalidade existente não funcionasse conforme o esperado)
- [] This Change requer uma atualização da documentação

## Problema ##
[Descreva o problema ou a necessidade que este pull request está resolvendo. Inclua links para problemas ou tarefas relacionadas, se houver.]

## Solução Proposta ##
[Explique como você resolveu o problema. Descreva as mudanças específicas feitas no código ou na documentação.]

## Testes Realizados ##
[Descreva os testes que foram realizados para garantir que as mudanças funcionem conforme o esperado.]

## Capturas de Tela (Opcional)
[Se as mudanças forem visuais, adicione capturas de tela para ilustrar as alterações.]

## Checklist
 [] Criação de Controller
 [] Criação de Tabelas
 [] Transformando a Lógica Existente, Para NodeJS
 [] Link do Card do Trello da Action Criada / Alterada
[x] Nome Branch


## Notas Adicionais
[Adicione quaisquer notas adicionais que você julgue relevantes.]