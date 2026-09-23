import express from "express";
import {
  listarFrequencias,
  registrarFrequenciaAluno,
  registrarFrequenciaTurma,
  atualizarFrequencia,
  deletarFrequencia,
} from "../controllers/frequencias.controller.js";

const frequenciasRouter = express.Router();

frequenciasRouter.get("/frequencias", listarFrequencias);
frequenciasRouter.post("/frequencias", registrarFrequenciaAluno);
frequenciasRouter.post("/frequencias/turma", registrarFrequenciaTurma);
frequenciasRouter.put("/frequencias/:id", atualizarFrequencia);
frequenciasRouter.delete("/frequencias/:id", deletarFrequencia);

export default frequenciasRouter;