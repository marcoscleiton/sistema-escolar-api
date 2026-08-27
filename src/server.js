import express from "express";
import router from "./routes/alunos.routes.js";

const app = express();

app.use(express.json());

app.use(router);

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000!");
});
//revisar amanhã 25/08/2026