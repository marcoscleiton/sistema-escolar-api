import pool from "../db/connection.js";

async function listarNotas(req, res, next) {
  try {
    const { aluno_id, disciplina_id, bimestre } = req.query;

    let query = `
      SELECT
        n.id,
        a.nome AS aluno,
        d.nome AS disciplina,
        n.bimestre,
        n.prova_parcial,
        n.prova_bimestral
      FROM notas n
      JOIN alunos a ON n.aluno_id = a.id
      JOIN disciplinas d ON n.disciplina_id = d.id
      WHERE 1 = 1
    `;
    const parametros = [];

    if (aluno_id) {
      parametros.push(aluno_id);
      query += ` AND n.aluno_id = $${parametros.length}`;
    }

    if (disciplina_id) {
      parametros.push(disciplina_id);
      query += ` AND n.disciplina_id = $${parametros.length}`;
    }

    if (bimestre) {
      parametros.push(bimestre);
      query += ` AND n.bimestre = $${parametros.length}`;
    }

    query += " ORDER BY a.nome";

    const resultado = await pool.query(query, parametros);
    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

async function adicionarNota(req, res, next) {
  try {
    const { aluno_id, disciplina_id, bimestre, prova_parcial, prova_bimestral } = req.body;

    if (!aluno_id || !disciplina_id || !bimestre) {
      return res.status(400).json({
        erro: "aluno_id, disciplina_id e bimestre são obrigatórios",
      });
    }

    // evita duas notas pro mesmo aluno+disciplina+bimestre
    const existente = await pool.query(
      `SELECT id FROM notas WHERE aluno_id = $1 AND disciplina_id = $2 AND bimestre = $3`,
      [aluno_id, disciplina_id, bimestre]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({
        erro: "Já existe nota para este aluno, nesta disciplina, neste bimestre. Use PUT para atualizar.",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO notas (aluno_id, disciplina_id, bimestre, prova_parcial, prova_bimestral)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [aluno_id, disciplina_id, bimestre, prova_parcial, prova_bimestral]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function atualizarNota(req, res, next) {
  try {
    const { id } = req.params;
    const { prova_parcial, prova_bimestral } = req.body;

    const resultado = await pool.query(
      `UPDATE notas SET prova_parcial = $1, prova_bimestral = $2 WHERE id = $3 RETURNING *`,
      [prova_parcial, prova_bimestral, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Nota não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function deletarNota(req, res, next) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM notas WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Nota não encontrada" });
    }

    res.json({ mensagem: "Nota deletada com sucesso" });
  } catch (erro) {
    next(erro);
  }
}

export { listarNotas, adicionarNota, atualizarNota, deletarNota };