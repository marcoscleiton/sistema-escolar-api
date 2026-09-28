import pool from "../db/connection.js";

// id precisa ser um número inteiro positivo (evita "abc" chegar no banco)
function idValido(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0;
}

// data no formato YYYY-MM-DD e que realmente exista (rejeita 2026-02-31)
function dataValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }
  const data = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

// presente precisa ser exatamente true ou false
function presenteValido(valor) {
  return typeof valor === "boolean";
}


async function listarFrequencias(req, res, next) {
  try {
    const { aluno_id, data, turma_id } = req.query;

    if (aluno_id && !idValido(aluno_id)) {
      return res.status(400).json({ erro: "aluno_id inválido" });
    }

    if (turma_id && !idValido(turma_id)) {
      return res.status(400).json({ erro: "turma_id inválido" });
    }

    if (data && !dataValida(data)) {
      return res.status(400).json({ erro: "data inválida. Use o formato AAAA-MM-DD" });
    }

    let query = `
      SELECT
        f.id,
        f.aluno_id,
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

    if (!idValido(aluno_id)) {
      return res.status(400).json({ erro: "aluno_id inválido" });
    }

    if (!dataValida(data)) {
      return res.status(400).json({ erro: "data inválida. Use o formato AAAA-MM-DD" });
    }

    if (!presenteValido(presente)) {
      return res.status(400).json({ erro: "O campo presente deve ser true ou false" });
    }

    const alunoExiste = await pool.query(
      "SELECT id FROM alunos WHERE id = $1",
      [aluno_id]
    );

    if (alunoExiste.rows.length === 0) {
      return res.status(404).json({ erro: "Aluno inexistente" });
    }

    // evita duas frequências do mesmo aluno no mesmo dia
    const existente = await pool.query(
      "SELECT id FROM frequencias WHERE aluno_id = $1 AND data = $2",
      [aluno_id, data]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({
        erro: "Já existe frequência registrada para este aluno nesta data. Use PUT para atualizar.",
      });
    }

    const resultado = await pool.query(
      "INSERT INTO frequencias (aluno_id, data, presente) VALUES ($1, $2, $3) RETURNING *",
      [aluno_id, data, presente]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    // 23505 = violação de UNIQUE (caso a constraint (aluno_id, data) exista no banco)
    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Já existe frequência registrada para este aluno nesta data.",
      });
    }
    next(erro);
  }
}

async function registrarFrequenciaTurma(req, res, next) {
  let client;

  try {
    const { turma_id, data, presencas } = req.body;

    // ---------- 1. validações básicas ----------
    if (!turma_id || !data || !Array.isArray(presencas) || presencas.length === 0) {
      return res.status(400).json({
        erro: "turma_id, data e uma lista de presenças são obrigatórios",
      });
    }

    if (!idValido(turma_id)) {
      return res.status(400).json({ erro: "turma_id inválido" });
    }

    if (!dataValida(data)) {
      return res.status(400).json({ erro: "data inválida. Use o formato AAAA-MM-DD" });
    }

    // ---------- 2. a turma existe? ----------
    const turmaExiste = await pool.query(
      "SELECT id FROM turmas WHERE id = $1",
      [turma_id]
    );

    if (turmaExiste.rows.length === 0) {
      return res.status(404).json({ erro: "Turma inexistente" });
    }

    // ---------- 3. já existe frequência da turma nesse dia? ----------
    const existentes = await pool.query(
      `SELECT f.aluno_id FROM frequencias f
       JOIN alunos a ON f.aluno_id = a.id
       WHERE a.turma_id = $1 AND f.data = $2`,
      [turma_id, data]
    );

    if (existentes.rows.length > 0) {
      return res.status(409).json({
        erro: "Já existe frequência registrada para esta turma nesta data.",
      });
    }

    // ---------- 4. valida cada item ANTES de gravar qualquer coisa ----------
    const alunosDaTurma = await pool.query(
      "SELECT id FROM alunos WHERE turma_id = $1",
      [turma_id]
    );
    const idsValidos = new Set(alunosDaTurma.rows.map((aluno) => aluno.id));
    const idsRecebidos = new Set();

    for (const item of presencas) {
      const alunoId = Number(item.aluno_id);

      if (!idValido(item.aluno_id) || !idsValidos.has(alunoId)) {
        return res.status(400).json({
          erro: `Aluno ${item.aluno_id} não pertence a esta turma`,
        });
      }

      if (idsRecebidos.has(alunoId)) {
        return res.status(400).json({
          erro: `Aluno ${item.aluno_id} aparece mais de uma vez na lista`,
        });
      }

      if (!presenteValido(item.presente)) {
        return res.status(400).json({
          erro: "O campo presente deve ser true ou false",
        });
      }

      idsRecebidos.add(alunoId);
    }

    // ---------- 5. transação: tudo ou nada ----------
    client = await pool.connect();
    await client.query("BEGIN");

    const inseridos = [];

    for (const item of presencas) {
      const resultado = await client.query(
        "INSERT INTO frequencias (aluno_id, data, presente) VALUES ($1, $2, $3) RETURNING *",
        [Number(item.aluno_id), data, item.presente]
      );
      inseridos.push(resultado.rows[0]);
    }

    await client.query("COMMIT");
    res.status(201).json(inseridos);
  } catch (erro) {
    if (client) {
      await client.query("ROLLBACK");
    }

    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Já existe frequência registrada para algum aluno da turma nesta data.",
      });
    }

    next(erro);
  } finally {
    // devolve a conexão ao pool, sempre (senão as conexões vazam)
    if (client) {
      client.release();
    }
  }
}

async function atualizarFrequencia(req, res, next) {
  try {
    const { id } = req.params;
    const { presente } = req.body;

    if (!idValido(id)) {
      return res.status(400).json({ erro: "id inválido" });
    }

    if (!presenteValido(presente)) {
      return res.status(400).json({
        erro: "O campo presente é obrigatório e deve ser true ou false",
      });
    }

    const resultado = await pool.query(
      "UPDATE frequencias SET presente = $1 WHERE id = $2 RETURNING *",
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

    if (!idValido(id)) {
      return res.status(400).json({ erro: "id inválido" });
    }

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