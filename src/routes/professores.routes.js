import express from "express";
import { listarProfessores, listarProfessorPorId, adicionarProfessor, atualizarProfessor, deletarProfessor} from "../controllers/professores.controller.js";

const professorRouter = express.Router();

professorRouter.get("/professores", listarProfessores);
professorRouter.get("/professores/:id", listarProfessorPorId);
professorRouter.post("/professores", adicionarProfessor);
professorRouter.put("/professores/:id", atualizarProfessor);
professorRouter.delete("/professores/:id", deletarProfessor);

export default professorRouter;
