class conecatLocalStorage {
    static consultarDados(parametro) {
        try {
            const dados = JSON.parse(localStorage.getItem(parametro));
            
            return dados
        } catch (error) {
            return {message: `Erro ao consultar localStorage - Erro: ${error}`};
        }
        
    }

    static gravarDados(parametro, dados){
        try {
            localStorage.setItem(parametro, JSON.stringify(dados));
            const retorno = JSON.parse(localStorage.getItem(parametro))
            return retorno
        } catch (error) {
            return {message: `Erro ao gravar localStorage - Erro: ${error}`};
        }
    }
}

export default conecatLocalStorage;