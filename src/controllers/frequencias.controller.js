import pool from "../db/connection.js";

async function listarFrequencias(req, res, next) {
  try {
    const { aluno_id, data, turma_id } = req.query;

    let query = `
      SELECT
        f.id,
        a.nome AS aluno,
        f.data,
        f.presente
      FROM frequencias f
      JOIN alunos a ON f.aluno_id = a.id
      WHERE 1 = 1
    `;
    const parametros = [];

    if (aluno_id) {
      parametros.push(aluno_id);
      query += ` AND f.aluno_id = $${parametros.length}`;
    }

    if (data) {
      parametros.push(data);
      query += ` AND f.data = $${parametros.length}`;
    }

    if (turma_id) {
      parametros.push(turma_id);
      query += ` AND a.turma_id = $${parametros.length}`;
    }

    query += " ORDER BY f.data DESC, a.nome";

    const resultado = await pool.query(query, parametros);
    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

async function registrarFrequenciaAluno(req, res, next) {
  try {
    const { aluno_id, data, presente } = req.body;

    if (!aluno_id || !data || presente === undefined) {
      return res.status(400).json({
        erro: "aluno_id, data e presente são obrigatórios",
      });
    }

    // evita duas frequências do mesmo aluno no mesmo dia
    const existente = await pool.query(
      `SELECT id FROM frequencias WHERE aluno_id = $1 AND data = $2`,
      [aluno_id, data]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({
        erro: "Já existe frequência registrada para este aluno nesta data. Use PUT para atualizar.",
      });
    }

    const resultado = await pool.query(
      `INSERT INTO frequencias (aluno_id, data, presente) VALUES ($1, $2, $3) RETURNING *`,
      [aluno_id, data, presente]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function registrarFrequenciaTurma(req, res, next) {
  try {
    const { turma_id, data, presencas } = req.body;

    if (!turma_id || !data || !Array.isArray(presencas) || presencas.length === 0) {
      return res.status(400).json({
        erro: "turma_id, data e uma lista de presenças são obrigatórios",
      });
    }

    const turmaExiste = await pool.query("SELECT id FROM turmas WHERE id = $1", [turma_id]);

    if (turmaExiste.rows.length === 0) {
      return res.status(404).json({ erro: "Turma inexistente" });
    }

    // verifica se já existe QUALQUER frequência da turma nesse dia, antes de inserir uma por uma
    const existentes = await pool.query(
      `SELECT f.aluno_id FROM frequencias f
       JOIN alunos a ON f.aluno_id = a.id
       WHERE a.turma_id = $1 AND f.data = $2`,
      [turma_id, data]
    );

    if (existentes.rows.length > 0) {
      return res.status(400).json({
        erro: "Já existe frequência registrada para esta turma nesta data.",
      });
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

async function atualizarFrequencia(req, res, next) {
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

async function deletarFrequencia(req, res, next) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM frequencias WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Registro de frequência não encontrado" });
    }

    res.json({ mensagem: "Registro de frequência removido com sucesso" });
  } catch (erro) {
    next(erro);
  }
}

export {
  listarFrequencias,
  registrarFrequenciaAluno,
  registrarFrequenciaTurma,
  atualizarFrequencia,
  deletarFrequencia,
};