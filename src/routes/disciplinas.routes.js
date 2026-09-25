import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import {listarDisciplinas, listarDisciplinaPorId, adicionarDisciplina, atualizarDisciplina, deletarDisciplina} from "../controllers/disciplinas.controller.js";

const disciplinasRouter = express.Router();

disciplinasRouter.get("/disciplinas", verificarToken, listarDisciplinas);
disciplinasRouter.get("/disciplinas/:id", verificarToken, listarDisciplinaPorId);
disciplinasRouter.post("/disciplinas", verificarToken, adicionarDisciplina);
disciplinasRouter.put("/disciplinas/:id", verificarToken, atualizarDisciplina);
disciplinasRouter.delete("/disciplinas/:id", verificarToken, deletarDisciplina);

export default disciplinasRouter;