import pool from "../db/connection.js";

async function listarTurmas(req, res, next) {
    try {
        const resultado = await pool.query("SELECT * FROM turmas");

        res.json(resultado.rows);

    } catch (erro) {
        next(erro);
    }
}

async function buscarTurma(req, res, next) {
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
        next(erro);
    }
}

async function adicionarTurma(req, res, next) {
    try {

        const {nome} =  req.body;

        const resultado = await pool.query("INSERT INTO turmas (nome) VALUES ($1) RETURNING *",
            [nome]
        );

        res.status(201).json(resultado.rows[0]);

    } catch (erro) {
        next(erro);
    }
}

//Revisar delete
async function deletarTurma(req, res, next) {
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
        next(erro);
    }
}

async function atualizarTurmas(req, res, next) {
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
        next(erro);
    }
}

async function listarAlunosDaTurma(req, res, next) {
    try {
        const {id} = req.params;

        // primeiro verifica se a turma existe
        const turma = await pool.query(
            "SELECT * FROM turmas WHERE id = $1",
            [id]
        );

        if (turma.rows.length === 0) {
            return res.status(404).json({message: "Turma inexistente"});
        }

        // se existe, busca os alunos dela
        const resultado = await pool.query(
            "SELECT alunos.id, alunos.nome, turmas.nome AS nome_turma FROM alunos JOIN turmas ON alunos.turma_id = turmas.id WHERE turmas.id = $1",
            [id]
        );

        res.json(resultado.rows);

    } catch (erro) {
        next(erro);
    }
}

export {listarTurmas, buscarTurma, adicionarTurma, deletarTurma, atualizarTurmas, listarAlunosDaTurma};