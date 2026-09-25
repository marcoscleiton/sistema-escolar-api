import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import { listarProfessores, listarProfessorPorId, adicionarProfessor, atualizarProfessor, deletarProfessor} from "../controllers/professores.controller.js";

const professorRouter = express.Router();

professorRouter.get("/professores", verificarToken, listarProfessores);
professorRouter.get("/professores/:id", verificarToken, listarProfessorPorId);
professorRouter.post("/professores", verificarToken, adicionarProfessor);
professorRouter.put("/professores/:id", verificarToken, atualizarProfessor);
professorRouter.delete("/professores/:id", verificarToken, deletarProfessor);

export default professorRouter;
