import express from "express";
import {listarFrequencias, registrarFrequenciaAluno, registrarFrequenciaTurma, atualizarFrequencia, deletarFrequencia} from "../controllers/frequencias.controller.js";

const router = express.Router();

router.get("/frequencias", listarFrequencias);
router.post("/frequencias", registrarFrequenciaAluno);
router.post("/frequencias/turma", registrarFrequenciaTurma);
router.put("/frequencias/:id", atualizarFrequencia);
router.delete("/frequencias/:id", deletarFrequencia);

export default router;