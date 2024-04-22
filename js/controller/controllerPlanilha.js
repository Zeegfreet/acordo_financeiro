import ModelClientes from "../models/modelClientes.js";
import ModelGrupos from "../models/modelGrupos.js";
import modelPlanilha from "../models/modelPlanilha.js";
import modelTitulos from "../models/modelTitulos.js";


class controllerPlanilha {
    static async gravarPlanilhaLocalStorage(arquivo){
        try {
            const planilhaTratada = await modelPlanilha.lerPlanilha(arquivo);

            //salva o array com a lista de titulos no localstorage
            const planilhaFinal = modelTitulos.gravaTitulos(planilhaTratada);

            //cria lista de clientes consolidado e salva no localStorage
            const baseClientes = modelPlanilha.consultaClienteAgrupado(planilhaTratada);
            const listaClientes = ModelClientes.gravaClientes(baseClientes);

            //cria lista de grupos consolidado e salva no localStorage
            const baseGrupos = modelPlanilha.consultaGrupoAgrupado(planilhaTratada);
            const listaGrupos = ModelGrupos.gravaGrupos(baseGrupos);

            //retorna com informação de sucesso ou insucesso na criação
            return {message: "Sucesso ao Carregar Dados", codigo: 200, dados: {planilhaFinal, listaClientes, listaGrupos}}
            
        } catch (error) {
            return {message: `Erro na execução do processo de gravação da Planilha - Erro: ${error}`, codigo: 400};
        }
    }

    static consultaClienteConsolidado(dados){
        try {
            const clientes = modelPlanilha.consultaClienteAgrupado(dados);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: clientes}
        } catch (error) {
            return { message: `Erro no controlador de titulos - Erro: ${error}`, codigo: 400 };
        }
    }
}

export default controllerPlanilha;