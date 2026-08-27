import express from "express";

import { adicionarTurma, atualizarTurmas, buscarTurma, deletarTurma, listarTurmas } from "../controllers/turmas.controller.js";
const router = express.Router();

router.get("/turmas", listarTurmas);

router.get("/turmas/:id", buscarTurma);

router.post("/turmas", adicionarTurma);

router.put("/turmas/:id", atualizarTurmas);

router.delete("/turmas/:id", deletarTurma);



export default router;