# Sistema Escolar API

API REST para gestão escolar, desenvolvida como projeto de estudo aplicado a um caso real (sistema usado na escola onde trabalho).

## Tecnologias

- Node.js
- Express
- PostgreSQL
- pg (driver do PostgreSQL para Node)

## Como rodar o projeto

1. Clone o repositório
2. Instale as dependências:
npm install
3. Crie um arquivo `.env` na raiz com as variáveis de conexão do banco:
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema-escolar
4. Inicie o servidor:
npm start


## Estrutura do projeto

src/
controllers/ → regras de negócio de cada entidade
routes/ → definição das rotas (endpoints)
db/ → conexão com o PostgreSQL
server.js → ponto de entrada da aplicação


## Status do projeto

**Em desenvolvimento ativo.**

✅ Já implementado:
- CRUD completo de alunos (listar, buscar por id, criar, atualizar, deletar)
- CRUD completo de turmas (listar, buscar por id, criar, atualizar, deletar)
- Relacionamento entre alunos e turmas (listar alunos de uma turma específica, usando JOIN)

🔜 Próximos passos:
- CRUD de professores
- Relação entre professores e disciplinas
- Lançamento de notas e cálculo de médias
- Controle de frequência
- Geração de boletim