import { pool } from "../db/connection.js";

export async function listarNotas(req, res, next) {
  try {
    const { aluno_id, disciplina_id, bimestre } = req.query;

    let query = `
      SELECT notas.id, alunos.nome AS aluno, disciplinas.nome AS disciplina,
             notas.bimestre, notas.prova_parcial, notas.prova_bimestral
      FROM notas
      JOIN alunos ON notas.aluno_id = alunos.id
      JOIN disciplinas ON notas.disciplina_id = disciplinas.id
      WHERE 1=1
    `;
    const valores = [];

    if (aluno_id) {
      valores.push(aluno_id);
      query += ` AND notas.aluno_id = $${valores.length}`;
    }
    if (disciplina_id) {
      valores.push(disciplina_id);
      query += ` AND notas.disciplina_id = $${valores.length}`;
    }
    if (bimestre) {
      valores.push(bimestre);
      query += ` AND notas.bimestre = $${valores.length}`;
    }

    const resultado = await pool.query(query, valores);
    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

export async function listarNotaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT * FROM notas WHERE id = $1", [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Nota não encontrada" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function adicionarNota(req, res, next) {
  try {
    const { aluno_id, disciplina_id, bimestre, prova_parcial, prova_bimestral } = req.body;

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

export async function atualizarNota(req, res, next) {
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

export async function deletarNota(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await pool.query("DELETE FROM notas WHERE id = $1 RETURNING *", [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Nota não encontrada" });
    }

    res.json({ mensagem: "Nota removida com sucesso" });
  } catch (erro) {
    next(erro);
  }
}