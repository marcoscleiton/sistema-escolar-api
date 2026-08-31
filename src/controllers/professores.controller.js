import {json} from "express";
import pool from "../db/connection";

const listarProfessores = async (req, res) => {
    try {
        
        const resultado = await pool.query(
            "SELECT * FROM professores"
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({error: "Erro ao tentar listar professores"});
    }
}

export {listarProfessores}