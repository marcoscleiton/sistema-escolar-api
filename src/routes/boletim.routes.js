import express from "express";
import { gerarBoletim } from "../controllers/boletim.controller.js";

const boletimRouter = express.Router();

boletimRouter.get("/alunos/:id/boletim", gerarBoletim);

export default boletimRouter;