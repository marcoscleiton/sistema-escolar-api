import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import {listarNotas, adicionarNota, atualizarNota, deletarNota} from "../controllers/notas.controller.js";

const notasRouter = express.Router();

notasRouter.get("/notas", verificarToken, listarNotas);
notasRouter.post("/notas", verificarToken, adicionarNota);
notasRouter.put("/notas/:id", verificarToken, atualizarNota);
notasRouter.delete("/notas/:id", verificarToken, deletarNota);

export default notasRouter;