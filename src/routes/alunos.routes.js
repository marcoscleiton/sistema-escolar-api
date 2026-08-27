import express from "express";
import { atualizarAluno, buscarAluno, criarAluno, deletarAluno, listarAlunos } from "../controllers/alunos.controller.js";
const router = express.Router();

router.get("/alunos", listarAlunos);

router.get("/alunos/:id", buscarAluno);

router.post("/alunos", criarAluno);

router.put("/alunos", atualizarAluno);

router.delete("/alunos/:id", deletarAluno);

export default router;
