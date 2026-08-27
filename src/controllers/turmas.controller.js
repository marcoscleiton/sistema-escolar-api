import { json } from "express";
import pool from "../db/connection.js";

async function listarTurmas(req, res) {
    try {
        const resultado = await pool.query("SELECT * FROM turmas");

        res.json(resultado.rows);

    } catch (erro) {

        res.status(500).json({erro: "Erro ao tentar listar turmas"});
    }
}
export {listarTurmas};

async function buscarTurma(req, res) {
    try {
        const {id} = req.params;

        const resultado = await pool.query("SELECT * FROM turmas WHERE id = $1",
            [id]
        );
        if (!resultado.rows[0]) {
            return res.status(404).json({erro: "Turma inexistente."});
        }
        
        res.json(resultado.rows[0]);
        

    } catch (erro) {    
        res.status(500).json({erro: "Erro ao tentar buscar turma"});
    }
}
export {buscarTurma}

async function adicionarTurma(req, res) {
    try {

        const {nome} =  req.body;

        const resultado = await pool.query("INSERT INTO turmas (nome) VALUES ($1) RETURNING *",
            [nome]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        res.status(500).json({erro: "Erro ao tentar adicionar turma."});
    }
}
export {adicionarTurma}

//Revisar delete
async function deletarTurma(req, res) {
    try {
        const { id } = req.params;

        const verificacao = await pool.query(
            "SELECT * FROM alunos WHERE turma_id = $1",
            [id]
        );

        if (verificacao.rows.length > 0) {
            return res.status(400).json({erro: "Não é possível deletar: existem alunos nessa turma."});
        }

        const resultado = await pool.query(
            "DELETE FROM turmas WHERE id = $1 RETURNING *",
            [id]
        );

        if (!resultado.rows[0]) {
            return res.status(404).json({erro: "Turma não encontrada."});
        }

        res.status(200).json({mensage: "Turma deletada com sucesso."});

    } catch (erro) {
        res.status(500).json({erro: "Erro ao tentar deletar turma"});
    }
}

async function atualizarTurmas(req, res) {
    try {

    const {id} = req.params;

    const {nome} = req.body;

    const resultado = await pool.query("UPDATE turmas SET nome = $1 WHERE id = $2 RETURNING *",
        [nome, id]
    );
    if (!resultado.rows[0]) {
        return res.status(404).json({erro: "Erro ao tentar atualizar turma."});
    }
        res.status(200).json({message: "Turma atualizada com sucesso."});

    } catch (erro) {
        res.status(500).json({erro: "Erro ao tentar atualizar turma"});
    }
}

export {listarTurmas, buscarTurma, adicionarTurma, deletarTurma, atualizarTurmas};