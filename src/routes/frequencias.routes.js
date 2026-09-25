import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import {listarFrequencias, registrarFrequenciaAluno, registrarFrequenciaTurma, atualizarFrequencia, deletarFrequencia,} from "../controllers/frequencias.controller.js";

const frequenciasRouter = express.Router();

frequenciasRouter.get("/frequencias", verificarToken, listarFrequencias);
frequenciasRouter.post("/frequencias", verificarToken, registrarFrequenciaAluno);
frequenciasRouter.post("/frequencias/turma", verificarToken, registrarFrequenciaTurma);
frequenciasRouter.put("/frequencias/:id", verificarToken, atualizarFrequencia);
frequenciasRouter.delete("/frequencias/:id", verificarToken, deletarFrequencia);

export default frequenciasRouter;