import { Router } from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";

const authrouter = Router();

authrouter.post("/auth/registrar", registrarUsuario);

authrouter.post("/auth/login", loginUsuario);

export default authrouter;