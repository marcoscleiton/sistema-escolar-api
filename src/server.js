import express from "express";
import alunosRouter from "./routes/alunos.routes.js";
import turmasRouter from "./routes/turmas.routes.js";

const app = express();

app.use(express.json());

function logger (req, res, next) {
    console.log(req.method, req.url);
    next();
}

app.use(logger);
app.use(alunosRouter);
app.use(turmasRouter);

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000!");
});