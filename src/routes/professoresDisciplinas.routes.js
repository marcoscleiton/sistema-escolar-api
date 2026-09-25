import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import {listarProfessoresDisciplinas, adicionarVinculo, deletarVinculo} from "../controllers/professoresDisciplinas.controller.js";

const professoresDisciplinasRouter = express.Router();

professoresDisciplinasRouter.get("/professores-disciplinas", verificarToken, listarProfessoresDisciplinas);
professoresDisciplinasRouter.post("/professores-disciplinas", verificarToken, adicionarVinculo);
professoresDisciplinasRouter.delete("/professores-disciplinas/:id", verificarToken, deletarVinculo);

export default professoresDisciplinasRouter;