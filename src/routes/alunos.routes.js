import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import { atualizarAluno, buscarAluno, criarAluno, deletarAluno, listarAlunos } from "../controllers/alunos.controller.js";
const alunosRouter = express.Router();

alunosRouter.get("/alunos", verificarToken, listarAlunos);

alunosRouter.get("/alunos/:id", verificarToken, buscarAluno);

alunosRouter.post("/alunos", verificarToken, criarAluno);

alunosRouter.put("/alunos", verificarToken, atualizarAluno);

alunosRouter.delete("/alunos/:id",verificarToken, deletarAluno);

export default alunosRouter;
