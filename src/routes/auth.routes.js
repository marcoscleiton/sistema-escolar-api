import { Router } from "express";
import { registrarUsuario } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/registrar", registrarUsuario);

export default router;