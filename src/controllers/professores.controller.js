
import pool from "../db/connection.js";

const listarProfessores = async (req, res) => {
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
   
        } catch (error) {
            res.status(500).json({error: "Erro ao tentar listar professor"})
    }
}
export {listarProfessores}