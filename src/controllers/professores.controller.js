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

export {listarProfessores}