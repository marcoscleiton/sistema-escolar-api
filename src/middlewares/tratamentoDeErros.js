import logger from "../utils/logger.js";

const tratamentoDeErro = (erro, req, res, next) => {
    logger(erro)
    res.status(500).json({erro: "Erro ao tentar acessar servidor!"});
}
export default tratamentoDeErro;