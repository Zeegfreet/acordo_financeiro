import conecatLocalStorage from "../connection/connectionLocalStorage.js";
import TrataArrays from "../funcoes/trataArray.js";
import Calculos from "../funcoes/calculos.js";
import ServiceTitulos from "../services/serviceTitulos.js";

const idLocalTitulos = 'dadosPlanilha';

class modelTitulos {
    
    static consultaTitulos() {

        try {
            const titulos = conecatLocalStorage.consultarDados(idLocalTitulos);

            return titulos;
            
        } catch (error) {
            return {message: `Erro ao consultar Titulos - Erro: ${error}`};
        }
    }

    static consultaTitulosEAtualiza(dtReferencia) {

        try {
            const titulos = conecatLocalStorage.consultarDados(idLocalTitulos);

            const baseTitulosAtualizada = ServiceTitulos.atualizarTitulos(titulos, dtReferencia);
            return baseTitulosAtualizada;
            
        } catch (error) {
            return {message: `Erro ao consultar Titulos - Erro: ${error}`};
        }
    }

    static consultaTitulosEAtualizaFiltrado(dtReferencia, paramFiltros) {

        try {
            const todosTitulos = conecatLocalStorage.consultarDados(idLocalTitulos);

            const baseTitulosAtualizada = ServiceTitulos.atualizarTitulos(todosTitulos, dtReferencia);

            const titulos = ServiceTitulos.filtrarTitulos(baseTitulosAtualizada, paramFiltros);

            return titulos;
            
        } catch (error) {
            return {message: `Erro ao consultar Titulos - Erro: ${error}`};
        }
    }

    static consultaTitulosFiltrado(parametros) {
        
        try {
            const todosTitulos = conecatLocalStorage.consultarDados(idLocalTitulos);

            const titulos = todosTitulos.filter(
                titulo => {
                    var filtrar = null;
                    Object.keys(parametros).forEach( (e) => {
                        if (titulo[e] != parametros[e]) {
                            filtrar = true
                        } else if (titulo[e] === parametros[e] && filtrar != true) {
                            filtrar = false
                        }
                    });

                    if (filtrar === false) {
                        return titulo
                             }
                    
                }
            );

            return titulos;
            
        } catch (error) {
            return {message: `Erro na modelagem - Erro: ${error}`};
        }
    };

    static gravaTitulos(dados) {

        try {
            const titulos = conecatLocalStorage.gravarDados(idLocalTitulos, dados);

            return titulos;
            
        } catch (error) {
            return {message: `Erro no modelo de gravação de Titulos - Erro: ${error}`};
        }
    }

    
}

export default modelTitulos;