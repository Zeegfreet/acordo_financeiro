import modelTitulos from "../models/modelTitulos.js";
import ServiceTitulos from "../services/serviceTitulos.js";

class controllerTitulos {
    static consultaSemFiltro(){
        try {
            const baseTitulos = modelTitulos.consultaTitulos();

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: baseTitulos}
            
        } catch (error) {
            return { message: `Erro no controlador de titulos - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaSemFiltrosEAtualiza(dtReferencia){
        try {
            const baseTitulos = modelTitulos.consultaTitulosEAtualiza(dtReferencia);

            const totalTitulos =  ServiceTitulos.calculaTotais(baseTitulos);

            const printTitulos = ServiceTitulos.printaTitulos(baseTitulos);

            const printTotais = ServiceTitulos.printaTotais(totalTitulos);
            
            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: {totais: totalTitulos, titulos: baseTitulos, totaisPrint: printTotais, titulosPrint: printTitulos}}
            
        } catch (error) {
            return { message: `Erro no controlador de titulos - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaComFiltrosEAtualiza(dtReferencia, filtros){
        try {
            const baseTitulos = modelTitulos.consultaTitulosEAtualizaFiltrado(dtReferencia, filtros);
            
            const totalTitulos =  ServiceTitulos.calculaTotais(baseTitulos);

            const printTitulos = ServiceTitulos.printaTitulos(baseTitulos);

            const printTotais = ServiceTitulos.printaTotais(totalTitulos);
            
            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: {totais: totalTitulos, titulos: baseTitulos, totaisPrint: printTotais, titulosPrint: printTitulos}}
            
        } catch (error) {
            return { message: `Erro no controlador de titulos - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaComFiltros(parametros){
        try {
            const baseTitulos = modelTitulos.consultaTitulosFiltrado(parametros);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: baseTitulos}
        } catch (error) {
            return { message: `Erro no controlador de titulos - Erro: ${error}`, codigo: 400 };
        }
    }
    
}

export default controllerTitulos;