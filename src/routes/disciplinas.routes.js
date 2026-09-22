import express from "express";
import {listarDisciplinas, listarDisciplinaPorId, adicionarDisciplina, atualizarDisciplina, deletarDisciplina} from "../controllers/disciplinas.controllers.js";

const disciplinasRouter = express.Router();

disciplinasRouter.get("/disciplinas", listarDisciplinas);
disciplinasRouter.get("/disciplinas/:id", listarDisciplinaPorId);
disciplinasRouter.post("/disciplinas", adicionarDisciplina);
disciplinasRouter.put("/disciplinas/:id", atualizarDisciplina);
disciplinasRouter.delete("/disciplinas/:id", deletarDisciplina);

export default disciplinasRouter;