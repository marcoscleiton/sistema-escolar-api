import pool from "../db/connection.js";

async function listarAlunos(req, res, next) {

    try {
        const resultado = await pool.query("SELECT * FROM alunos");
        res.json(resultado.rows);

    } catch (erro) {
        next(erro);
    }
};


async function buscarAluno(req, res, next) {

    try {
        const aluno = req.params.id;

        const resultado = await pool.query("SELECT * FROM alunos WHERE id = $1",
            [aluno]
        );

        res.json(resultado.rows[0]);

    } catch (erro) {
        next(erro);
    }
};


async function criarAluno(req, res, next) {

    try {
        const {nome, data_nascimento, turma_id} = req.body;

        const resultado = await pool.query("INSERT INTO alunos (nome, data_nascimento, turma_id) VALUES ($1, $2, $3) RETURNING *",
            [nome, data_nascimento, turma_id]
        )

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        next(erro);
    }
};


async function atualizarAluno(req, res, next) {

    try {
        const {id} = req.params;

        const {nome, data_nascimento, turma_id} = req.body;

        const resultado = await pool.query
        ("UPDATE alunos SET nome = $1, data_nascimento = $2, turma_id = $3 WHERE id = $4 RETURNING *",
            [nome, data_nascimento, turma_id, id]
        );
        res.json(resultado.rows[0]);
    } catch (erro) {
        next(erro);
    }
}


async function deletarAluno(req, res, next) {

    try {
        const {id} = req.params;

        await pool.query("DELETE FROM alunos WHERE id = $1",
            [id])

        res.status(200).json({mensagem: "Aluno apagado com sucesso"});

    } catch (erro) {
        next(erro);
    }
}


export {listarAlunos, buscarAluno, criarAluno, atualizarAluno, deletarAluno}