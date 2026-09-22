import express from "express";
import alunosRouter from "./routes/alunos.routes.js";
import turmasRouter from "./routes/turmas.routes.js";
import professoresRouter from "./routes/professores.routes.js";
import disciplinasRouter from "./routes/disciplinas.routes.js";
import professoresDisciplinasRouter from "./routes/professoresDisciplinas.routes.js";
import tratamentoDeErro from "./middlewares/tratamentoDeErros.js";
import notasRouter from "./routes/notas.routes.js";

const app = express();

app.use(express.json());


app.use(alunosRouter);
app.use(turmasRouter);
app.use(professoresRouter);
app.use(disciplinasRouter);
app.use(professoresDisciplinasRouter);
app.use(notasRouter);
app.use(tratamentoDeErro);

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000!");
});