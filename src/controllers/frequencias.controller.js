import { pool } from "../db/connection.js";

export async function listarFrequencias(req, res, next) {
  try {
    const { aluno_id, data, turma_id } = req.query;

    let query = `
      SELECT frequencias.id, alunos.nome AS aluno, frequencias.data, frequencias.presente
      FROM frequencias
      JOIN alunos ON frequencias.aluno_id = alunos.id
      WHERE 1=1
    `;
    const valores = [];

    if (aluno_id) {
      valores.push(aluno_id);
      query += ` AND frequencias.aluno_id = $${valores.length}`;
    }
    if (data) {
      valores.push(data);
      query += ` AND frequencias.data = $${valores.length}`;
    }
    if (turma_id) {
      valores.push(turma_id);
      query += ` AND alunos.turma_id = $${valores.length}`;
    }

    query += " ORDER BY frequencias.data DESC";

    const resultado = await pool.query(query, valores);
    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

export async function registrarFrequenciaAluno(req, res, next) {
  try {
    const { aluno_id, data, presente } = req.body;

    const resultado = await pool.query(
      `INSERT INTO frequencias (aluno_id, data, presente) VALUES ($1, $2, $3) RETURNING *`,
      [aluno_id, data, presente]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function registrarFrequenciaTurma(req, res, next) {
  try {
    const { turma_id, data, presencas } = req.body;

    if (!Array.isArray(presencas) || presencas.length === 0) {
      return res.status(400).json({ erro: "Lista de presenças vazia ou inválida" });
    }

    const turmaExiste = await pool.query("SELECT id FROM turmas WHERE id = $1", [turma_id]);

    if (turmaExiste.rows.length === 0) {
      return res.status(404).json({ erro: "Turma inexistente" });
    }

    const inseridos = [];

    for (const item of presencas) {
      const resultado = await pool.query(
        `INSERT INTO frequencias (aluno_id, data, presente) VALUES ($1, $2, $3) RETURNING *`,
        [item.aluno_id, data, item.presente]
      );
      inseridos.push(resultado.rows[0]);
    }

    res.status(201).json(inseridos);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarFrequencia(req, res, next) {
  try {
    const { id } = req.params;
    const { presente } = req.body;

    const resultado = await pool.query(
      `UPDATE frequencias SET presente = $1 WHERE id = $2 RETURNING *`,
      [presente, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Registro de frequência não encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

export async function deletarFrequencia(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await pool.query("DELETE FROM frequencias WHERE id = $1 RETURNING *", [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Registro de frequência não encontrado" });
    }

    res.json({ mensagem: "Registro de frequência removido com sucesso" });
  } catch (erro) {
    next(erro);
  }
}