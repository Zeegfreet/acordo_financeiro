import conecatLocalStorage from "../connection/connectionLocalStorage.js";
import ConectaSessionStorage from "../connection/conectionSessionStorage.js";

const idLocal = 'acordoFiltros'
const idLocalAcordo = 'acordoDados'
const idlocalAcordoRateado = 'acordoRateado'

class ModelAcordo {
    static consultaFiltros() {

        try {
            const dados = ConectaSessionStorage.consultarDados(idLocal);

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de Acordo Gravação de Filtros Acordo - Erro: ${error}`};
        }
    };

    static consultaAcordo() {

        try {
            const dados = ConectaSessionStorage.consultarDados(idLocalAcordo);

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de consulta de Acordos - Erro: ${error}`};
        }
    };

    static gravaAcordo(acordo) {

        try {
            const dados = ConectaSessionStorage.gravarDados(idLocalAcordo, acordo);

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de consulta de Acordos - Erro: ${error}`};
        }
    };

    static gravaAcordoRateado(acordo) {

        try {
            const dados = ConectaSessionStorage.gravarDados(idlocalAcordoRateado, acordo);

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de consulta de Acordos - Erro: ${error}`};
        }
    };


    static gravaFiltros(filtros) {

        try {
            const dados = ConectaSessionStorage.gravarDados(idLocal, filtros);

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de Acordo Gravação de Filtros Acordo - Erro: ${error}`};
        }
    };

    static gravaParametros(parametros) {

        try {
            const dados = ConectaSessionStorage.gravarDados(idLocal, JSON.stringify(parametros));

            return dados;
            
        } catch (error) {
            return {message: `Erro no Modelo de Acordo Gravação de Parametros Acordo - Erro: ${error}`};
        }
    };

    static excluirDados() {

        try {
            const acordo = ConectaSessionStorage.excluirDados(idLocalAcordo);
            const filtros = ConectaSessionStorage.excluirDados(idLocal);
            
            return {message: 'sucesso ao excluir dados'};
            
        } catch (error) {
            return {message: `Erro no Modelo de consulta de Acordos - Erro: ${error}`};
        }
    };


};

export default ModelAcordo;