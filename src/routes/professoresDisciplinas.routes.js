import express from "express";
import {listarProfessoresDisciplinas, adicionarVinculo, deletarVinculo} from "../controllers/professoresDisciplinas.controller.js";

const professoresDisciplinasRouter = express.Router();

professoresDisciplinasRouter.get("/professores-disciplinas", listarProfessoresDisciplinas);
professoresDisciplinasRouter.post("/professores-disciplinas", adicionarVinculo);
professoresDisciplinasRouter.delete("/professores-disciplinas/:id", deletarVinculo);

export default professoresDisciplinasRouter;