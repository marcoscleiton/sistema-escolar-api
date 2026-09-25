import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";

import { adicionarTurma, atualizarTurmas, buscarTurma, deletarTurma, listarAlunosDaTurma, listarTurmas } from "../controllers/turmas.controller.js";
const turmasRouter = express.Router();

turmasRouter.get("/turmas", verificarToken, listarTurmas);

turmasRouter.get("/turmas/:id", verificarToken, buscarTurma);

turmasRouter.get("/turmas/:id/alunos", verificarToken, listarAlunosDaTurma);

turmasRouter.post("/turmas", verificarToken, adicionarTurma);

turmasRouter.put("/turmas/:id", verificarToken, atualizarTurmas);

turmasRouter.delete("/turmas/:id", verificarToken, deletarTurma);



export default router;