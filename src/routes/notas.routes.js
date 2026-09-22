import express from "express";
import {listarNotas, adicionarNota, atualizarNota, deletarNota,} from "../controllers/notas.controller.js";

const notasRouter = express.Router();

notasRouter.get("/notas", listarNotas);
notasRouter.post("/notas", adicionarNota);
notasRouter.put("/notas/:id", atualizarNota);
notasRouter.delete("/notas/:id", deletarNota);

export default notasRouter;