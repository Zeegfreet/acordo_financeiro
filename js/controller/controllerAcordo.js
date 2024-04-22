import ModelAcordo from "../models/modelAcordo.js";
import ServiceAcordo from "../services/serviceAcordo.js";
import controllerTitulos from "./controllerTitulos.js";

class ControllerAcordo {

    static consultaFiltros(){
        try {

            const dados = ModelAcordo.consultaFiltros();

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: dados}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaAcordo(){
        try {

            const dados = ModelAcordo.consultaAcordo();

            return { message: "Sucesso ao Consultar Acordo", codigo: 200, dados: dados}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };

    static calculaAcordo(parametros){
        try {
            const filtros = ModelAcordo.consultaFiltros();
            const baseTitulos = controllerTitulos.consultaComFiltrosEAtualiza(filtros.dt_Referencia, filtros.filtros);
            const acordoCalculado = ServiceAcordo.calculaAcordo(baseTitulos.dados.totais, parametros, filtros.dt_Referencia, true);
            const acordoRateado = ServiceAcordo.calculaRateio(baseTitulos.dados.titulos, parametros, filtros);
            const printAcordo = ServiceAcordo.printaAcordo(acordoCalculado);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: { acordo: acordoCalculado, acordoPrint: printAcordo, acordoRateado: acordoRateado.acordo, acordoRateadoPrint: acordoRateado.acordoPrint}}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };


    static gravaFiltros(Data, filtro){
        try {

            const filtros = { dt_Referencia: Data, filtros: filtro };
            const baseFiltros = ModelAcordo.gravaFiltros(filtros);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: baseFiltros}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };

    static gravaParametros(parametros){
        try {

            const dadosParametros = ModelAcordo.gravaFiltros(parametros);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: dadosParametros}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };

    static gravaAcordo(dados){
        try {

            const dadosParametros = ModelAcordo.gravaAcordo(dados);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: dadosParametros}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    };

    static limparCacheAcordo(){
        try {

            const dadosParametros = ModelAcordo.excluirDados();

            return { message: "Sucesso ao Consultar Dados", codigo: 200}
            
        } catch (error) {
            return { message: `Erro no controlador de Acordos - Erro: ${error}`, codigo: 400 };
        }
    }
};

export default ControllerAcordo;