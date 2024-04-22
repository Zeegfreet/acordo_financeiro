class ConectaSessionStorage {
    static consultarDados(parametro) {
        try {
            const dados = JSON.parse(sessionStorage.getItem(parametro));
            
            return dados
        } catch (error) {
            return {message: `Erro ao consultar sessionStorage - Erro: ${error}`};
        }
        
    }

    static gravarDados(parametro, dados){
        try {
            sessionStorage.setItem(parametro, JSON.stringify(dados));
            const retorno = JSON.parse(sessionStorage.getItem(parametro))
            return retorno
        } catch (error) {
            return {message: `Erro ao gravar sessionStorage - Erro: ${error}`};
        }
    }

    static excluirDados(parametro) {
        try {
            sessionStorage.removeItem(parametro)
            
            return {message: `Sucesso ao Excluir dados`}
        } catch (error) {
            return {message: `Erro ao consultar sessionStorage - Erro: ${error}`};
        }
        
    }
}

export default ConectaSessionStorage;