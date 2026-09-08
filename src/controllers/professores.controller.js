import pool from "../db/connection.js";

async function listarProfessores(req, res, next) {
    try {
        const {nome} = req.query;

        let resultado;

        if (nome) {
            resultado = await pool.query("SELECT * FROM professores WHERE nome ILIKE $1",
                [`%${nome}%`]
            )
        } else {
            resultado = await pool.query("SELECT * FROM professores")
        }

        res.json(resultado.rows);

    } catch (erro) {
        next(erro);
    }
}
async function listarProfessorPorId (req, res, next) {
    try {
        const {id} = req.params;

        const resultado = await pool.query("SELECT * FROM professores WHERE id = $1",
            [id]
        );
        if (resultado.rows.length === 0) {
            return res.status(404).json("Professor não encontrado")
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        next(error);
    }
}

async function adicionarProfessor (req, res, next) {
    try {
        const {nome} = req.body;

       const resultado = await pool.query("INSERT INTO professores (nome) VALUES ($1) RETURNING *",
        [nome]
       )
        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        next(error)
    }
}

async function atualizarProfessor(req, res, next) {
    try {
    const {id} = req.params;
    const {nome} = req.body

    const resultado = await pool.query("UPDATE professores SET nome = $1 WHERE id = $2 RETURNING *",
        [nome, id]
    )
    if (resultado.rows.length === 0) {
        return res.status(404).json({erro: "Professor não encontrado"});
    }

    res.json(resultado.rows[0]);

    } catch (error) {
        next(error);
    }
    
}

async function deletarProfessor(req, res, next) {
    try {
        const { id } = req.params;

        const vinculos = await pool.query(
            "SELECT * FROM professores_disciplinas WHERE professor_id = $1",
            [id]
        );

        if (vinculos.rows.length > 0) {
            return res.status(400).json({ erro: "Não é possível deletar: professor possui disciplinas vinculadas" });
        }

        const resultado = await pool.query(
            "DELETE FROM professores WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Professor não encontrado" });
        }

        res.json({ mensagem: "Professor deletado com sucesso" });

    } catch (error) {
        next(error);
    }
}
export {listarProfessores, listarProfessorPorId, adicionarProfessor, atualizarProfessor, deletarProfessor}