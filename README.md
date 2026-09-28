# Sistema Escolar API

API REST para gestão escolar, desenvolvida como projeto de estudo aplicado a um caso real (sistema pensado para a escola onde trabalho). Cobre alunos, turmas, professores, disciplinas, notas, frequência e boletim, com autenticação via JWT.

## Tecnologias

- **Node.js** (ES Modules)
- **Express**: rotas e middlewares
- **PostgreSQL** com o driver **pg**
- **dotenv**: variáveis de ambiente
- **bcrypt**: hash de senhas
- **jsonwebtoken**: autenticação com JWT

## Como rodar o projeto

1. Clone o repositório e instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco `sistema-escolar` no PostgreSQL e as tabelas descritas em [Banco de dados](#banco-de-dados).

3. Crie um arquivo `.env` na raiz com as variáveis:

   ```env
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sistema-escolar
   JWT_SECRET=uma_chave_longa_e_aleatoria
   ```

   Para gerar uma chave segura para o `JWT_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Inicie o servidor:

   ```bash
   npm start
   ```

## Estrutura do projeto

```
src/
├── controllers/   → regras de negócio de cada entidade
├── routes/        → definição das rotas (endpoints)
├── middlewares/   → autenticação (JWT) e tratamento de erros
├── utils/         → utilitários (ex: logger)
├── db/            → conexão com o PostgreSQL
└── server.js      → ponto de entrada da aplicação
```

## Autenticação

A API usa **JWT**. Todas as rotas exigem token, exceto as de `/auth`.

1. Cadastre um usuário em `POST /auth/registrar` (a senha é salva com hash bcrypt).
2. Faça login em `POST /auth/login` e receba o token.
3. Envie o token no header de cada requisição:

   ```
   Authorization: Bearer <token>
   ```

O token expira em 1 hora. Sem token, ou com token inválido/expirado, a API responde `401`.

## Endpoints

### Autenticação (públicas)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/registrar` | Cadastra um usuário |
| POST | `/auth/login` | Autentica e retorna o token |

### Alunos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/alunos` | Lista os alunos |
| GET | `/alunos/:id` | Busca um aluno |
| POST | `/alunos` | Cadastra um aluno |
| PUT | `/alunos/:id` | Atualiza um aluno |
| DELETE | `/alunos/:id` | Remove um aluno |
| GET | `/alunos/:id/boletim` | Boletim do aluno, com média por disciplina e bimestre |

### Turmas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/turmas` | Lista as turmas |
| GET | `/turmas/:id` | Busca uma turma |
| POST | `/turmas` | Cadastra uma turma |
| PUT | `/turmas/:id` | Atualiza uma turma |
| DELETE | `/turmas/:id` | Remove uma turma (bloqueado se houver alunos vinculados) |
| GET | `/turmas/:id/alunos` | Lista os alunos de uma turma |

### Professores

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/professores` | Lista professores (filtro opcional `?nome=`) |
| GET | `/professores/:id` | Busca um professor |
| POST | `/professores` | Cadastra um professor |
| PUT | `/professores/:id` | Atualiza um professor |
| DELETE | `/professores/:id` | Remove um professor (bloqueado se houver vínculo com disciplinas) |

### Disciplinas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/disciplinas` | Lista as disciplinas |
| GET | `/disciplinas/:id` | Busca uma disciplina |
| POST | `/disciplinas` | Cadastra uma disciplina |
| PUT | `/disciplinas/:id` | Atualiza uma disciplina |
| DELETE | `/disciplinas/:id` | Remove uma disciplina |

### Vínculo professor ↔ disciplina ↔ turma

Um professor pode lecionar mais de uma disciplina, e a mesma disciplina pode ter professores diferentes conforme a turma.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/professores-disciplinas` | Lista os vínculos |
| POST | `/professores-disciplinas` | Cria um vínculo |
| DELETE | `/professores-disciplinas/:id` | Remove um vínculo |

### Notas

Cada registro guarda a prova parcial e a prova bimestral de um aluno, em uma disciplina, em um bimestre.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/notas` | Lista as notas |
| GET | `/notas/:id` | Busca uma nota |
| POST | `/notas` | Lança uma nota |
| PUT | `/notas/:id` | Atualiza uma nota |
| DELETE | `/notas/:id` | Remove uma nota |

### Frequência

A presença é registrada uma vez por dia por aluno (sem separar por disciplina).

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/frequencias` | Lista frequências (filtros opcionais: `aluno_id`, `data`, `turma_id`) |
| POST | `/frequencias` | Registra a frequência de um aluno |
| POST | `/frequencias/turma` | Registra a frequência de uma turma inteira em uma data |
| PUT | `/frequencias/:id` | Atualiza a presença de um registro |
| DELETE | `/frequencias/:id` | Remove um registro |

## Regras de negócio

- **Boletim:** a média de cada bimestre é `(prova_parcial + prova_bimestral) / 2`, calculada por disciplina.
- **Frequência da turma:** o registro em lote usa **transação** (`BEGIN`/`COMMIT`/`ROLLBACK`): ou todos os alunos são gravados, ou nenhum. A lista é validada antes (alunos da turma, sem repetição, `presente` booleano).
- **Duplicidade:** não é permitido registrar duas frequências do mesmo aluno na mesma data (resposta `409`).
- **Exclusões protegidas:** turmas com alunos e professores com vínculos não podem ser removidos (bloqueio manual, sem `CASCADE`).

## Banco de dados

| Tabela | Colunas principais |
|--------|--------------------|
| `turmas` | `id`, `nome` |
| `alunos` | `id`, `nome`, `data_nascimento`, `turma_id` → `turmas` |
| `professores` | `id`, `nome` |
| `disciplinas` | `id`, `nome` |
| `professores_disciplinas` | `id`, `professor_id`, `disciplina_id`, `turma_id` (N:N com turma) |
| `notas` | `id`, `aluno_id`, `disciplina_id`, `bimestre`, `prova_parcial`, `prova_bimestral` |
| `frequencias` | `id`, `aluno_id`, `data`, `presente` |
| `usuarios` | `id`, `nome`, `email` (único), `senha_hash`, `criado_em` |

## Tratamento de erros

Erros inesperados são repassados com `next(erro)` para um middleware central, que registra o erro no logger e responde `500` com uma mensagem genérica. Erros de negócio (`400`, `401`, `404`, `409`) são respondidos diretamente em cada controller.

## Status do projeto

✅ **Backend concluído:**
- CRUDs completos de alunos, turmas, professores, disciplinas, notas e frequência
- Vínculo N:N entre professores, disciplinas e turmas
- Boletim com cálculo de médias
- Autenticação com JWT (cadastro, login e proteção das rotas)
- Middleware de tratamento de erros

🔜 **Próximos passos:**
- Front-end em React consumindo a API
- Boletim em PDF para impressão
- Documentação detalhada dos controllers e queries