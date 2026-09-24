import { Router } from "express";
import { registrarUsuario } from "../controllers/auth.controller.js";

const authrouter = express.Router();

authrouter.post("/auth/registrar", registrarUsuario);

export default authrouter;