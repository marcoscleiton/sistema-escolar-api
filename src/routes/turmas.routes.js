import express from "express";

import { adicionarTurma, atualizarTurmas, buscarTurma, deletarTurma, listarAlunosDaTurma, listarTurmas } from "../controllers/turmas.controller.js";
const router = express.Router();

router.get("/turmas", listarTurmas);

router.get("/turmas/:id", buscarTurma);

router.get("/turmas/:id/alunos", listarAlunosDaTurma);

router.post("/turmas", adicionarTurma);

router.put("/turmas/:id", atualizarTurmas);

router.delete("/turmas/:id", deletarTurma);



export default router;