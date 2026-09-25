import bcrypt from "bcrypt";
import pool from "../db/connection.js";

async function registrarUsuario(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ erro: "Nome é obrigatório e deve ser texto" });
    }

    if (typeof email !== "string" || email.trim() === "" || !email.includes("@")) {
      return res.status(400).json({ erro: "Email é obrigatório e deve ser válido" });
    }

    if (typeof senha !== "string" || senha.length < 6) {
      return res.status(400).json({ erro: "Senha é obrigatória e deve ter pelo menos 6 caracteres" });
    }

    const emailLimpo = email.trim().toLowerCase();
    const senhaHash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome.trim(), emailLimpo, senhaHash]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }
    next(erro);
  }
}

export { registrarUsuario };