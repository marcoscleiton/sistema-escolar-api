import pool from "../db/connection.js";

async function listarProfessoresDisciplinas(req, res, next) {
  try {
    const resultado = await pool.query(`
      SELECT
        pd.id,
        p.nome AS professor,
        d.nome AS disciplina,
        t.nome AS turma
      FROM professores_disciplinas pd
      JOIN professores p ON pd.professor_id = p.id
      JOIN disciplinas d ON pd.disciplina_id = d.id
      JOIN turmas t ON pd.turma_id = t.id
      ORDER BY p.nome
    `);

    res.json(resultado.rows);
  } catch (erro) {
    next(erro);
  }
}

async function adicionarVinculo(req, res, next) {
  try {
    const { professor_id, disciplina_id, turma_id } = req.body;

    if (!professor_id || !disciplina_id || !turma_id) {
      return res.status(400).json({
        erro: "professor_id, disciplina_id e turma_id são obrigatórios",
      });
    }

    // evita duplicar o mesmo vínculo (mesmo professor, disciplina e turma)
    const existente = await pool.query(
      `SELECT id FROM professores_disciplinas
       WHERE professor_id = $1 AND disciplina_id = $2 AND turma_id = $3`,
      [professor_id, disciplina_id, turma_id]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ erro: "Este vínculo já existe" });
    }

    const resultado = await pool.query(
      `INSERT INTO professores_disciplinas (professor_id, disciplina_id, turma_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [professor_id, disciplina_id, turma_id]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    next(erro);
  }
}

async function deletarVinculo(req, res, next) {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM professores_disciplinas WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Vínculo não encontrado" });
    }

    res.json({ mensagem: "Vínculo removido com sucesso" });
  } catch (erro) {
    next(erro);
  }
}

export { listarProfessoresDisciplinas, adicionarVinculo, deletarVinculo };