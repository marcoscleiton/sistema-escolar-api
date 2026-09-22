import pool from "../db/connection.js";

async function listarDisciplinas(req, res, next) {
  try {
    const resultado = await pool.query("SELECT * FROM disciplinas ORDER BY nome");
    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

async function listarDisciplinaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM disciplinas WHERE id = $1", [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Disciplina não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function adicionarDisciplina(req, res, next) {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "O campo nome é obrigatório" });
    }

    const resultado = await pool.query(
      "INSERT INTO disciplinas (nome) VALUES ($1) RETURNING *",
      [nome]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function atualizarDisciplina(req, res, next) {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "O campo nome é obrigatório" });
    }

    const resultado = await pool.query(
      "UPDATE disciplinas SET nome = $1 WHERE id = $2 RETURNING *",
      [nome, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Disciplina não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function deletarDisciplina(req, res, next) {
  try {
    const { id } = req.params;

    // antes de deletar, verificar se existe vínculo em professores_disciplinas
    const vinculo = await pool.query(
      "SELECT id FROM professores_disciplinas WHERE disciplina_id = $1",
      [id]
    );

    if (vinculo.rows.length > 0) {
      return res.status(400).json({
        erro: "Não é possível deletar: existem professores vinculados a esta disciplina",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM disciplinas WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Disciplina não encontrada" });
    }

    res.json({ mensagem: "Disciplina deletada com sucesso" });
  } catch (erro) {
    next(erro);
  }
}

export {
  listarDisciplinas,
  listarDisciplinaPorId,
  adicionarDisciplina,
  atualizarDisciplina,
  deletarDisciplina,
};