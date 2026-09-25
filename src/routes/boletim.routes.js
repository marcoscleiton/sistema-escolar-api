import express from "express";
import { verificarToken } from "../middlewares/autenticacao.js";
import { gerarBoletim } from "../controllers/boletim.controller.js";

const boletimRouter = express.Router();

boletimRouter.get("/alunos/:id/boletim", verificarToken, gerarBoletim);

export default boletimRouter;