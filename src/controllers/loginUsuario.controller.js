async function loginUsuario(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ erro: "Email é obrigatório" });
    }

    if (typeof senha !== "string" || senha.trim() === "") {
      return res.status(400).json({ erro: "Senha é obrigatória" });
    }

    const emailLimpo = email.trim().toLowerCase();

    const resultado = await pool.query(
      "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1",
      [emailLimpo]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: "Email ou senha inválidos" });
    }

    res.status(200).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    next(erro);
  }
}