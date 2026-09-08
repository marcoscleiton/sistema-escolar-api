import express from "express";
import { listarProfessores, listarProfessorPorId, adicionarProfessor, atualizarProfessor, deletarProfessor} from "../controllers/professores.controller.js";

const router = express.Router();

router.get("/professores", listarProfessores);
router.get("/professores/:id", listarProfessorPorId);
router.post("/professores", adicionarProfessor);
router.put("/professores/:id", atualizarProfessor);
router.delete("/professores/:id", deletarProfessor);

export default router;
