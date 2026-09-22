import logger from "../utils/logger.js";

const tratamentoDeErro = (erro, req, res, next) => {
    logger(erro)
    res.status(500).json({erro: "Erro ao tentar acessar servidor!"});
}
const criarErro = (mensagem, erro) => {
    
}
export default tratamentoDeErro;