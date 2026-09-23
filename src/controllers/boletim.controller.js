import pool from "../db/connection.js";

async function gerarBoletim(req, res, next) {
  try {
    const { id } = req.params;

    const alunoExiste = await pool.query("SELECT id, nome FROM alunos WHERE id = $1", [id]);

    if (alunoExiste.rows.length === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado" });
    }

    const resultado = await pool.query(
      `SELECT
         d.nome AS disciplina,
         n.bimestre,
         n.prova_parcial,
         n.prova_bimestral
       FROM notas n
       JOIN disciplinas d ON n.disciplina_id = d.id
       WHERE n.aluno_id = $1
       ORDER BY d.nome, n.bimestre`,
      [id]
    );

    const boletim = resultado.rows.map((linha) => {
      const media = (Number(linha.prova_parcial) + Number(linha.prova_bimestral)) / 2;

      return {
        disciplina: linha.disciplina,
        bimestre: linha.bimestre,
        prova_parcial: linha.prova_parcial,
        prova_bimestral: linha.prova_bimestral,
        media: Number(media.toFixed(2)),
      };
    });

    res.json({
      aluno: alunoExiste.rows[0].nome,
      boletim,
    });
  } catch (erro) {
    next(erro);
  }
}

export { gerarBoletim };