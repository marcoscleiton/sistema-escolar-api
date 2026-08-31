import express from "express";
import { listarProfessores } from "../controllers/professores.controller";

const router = express.Router();

router.get("/professores", listarProfessores);