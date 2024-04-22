import conectaSheetJS from "../connection/connectionSheetJS.js";
import converterDado from "../funcoes/conversoes.js";
import TrataArrays from "../funcoes/trataArray.js";

class modelPlanilha {
        //function que trata os dados da planilha gerada e salva no localstorage
    static async lerPlanilha(arquivo) {
        //faz a leitura da planilha e converte em um array
        try {
            const arrayPlanilha = await conectaSheetJS.lerPlanilha(arquivo);
            
            const arrayTratado = arrayPlanilha.map(
                (linha) => {
                    var trataValor = converterDado.converteNumero(linha.Valor_Aberto);
                    if (trataValor > 0) {
                        trataValor = converterDado.converteNumero(linha.Valor_Aberto) - converterDado.converteNumero(linha.Descontos);
                    } else {
                        trataValor = converterDado.converteNumero(linha.Valor_Original)
                    }

                    const dados = {
                        cod_Credor: Number(linha.cod_empresa),
                        nome_Credor: linha.cod_empresa == 1 ? 'Brito' : 'Pimpolho',
                        id_Titulo: linha.cod_empresa + "-" + linha.cod_filial + "-" + linha.titulo,
                        cod_Cliente: Number(linha.Cod_Cliente),
                        nome_Cliente: linha.Nome_Cliente,
                        cliente_Cod: linha.Cod_Cliente + "-" + linha.Nome_Cliente,
                        cod_Grupo: Number(linha.Grupo_De_Empresas),
                        tipo_Titulo: linha.tipo,
                        grupo: linha.Nome_Grupo_De_Empresas,
                        grupo_Cod: linha.Grupo_De_Empresas != 0 ? linha.Grupo_De_Empresas + "-" + linha.Nome_Grupo_De_Empresas : null,
                        vlr_Aberto: trataValor, //converterDado.converteNumero(linha.Valor_Aberto) - converterDado.converteNumero(linha.Descontos),
                        per_Juros: converterDado.converteNumero(linha.Per_Juros)/100,
                        per_Multa: converterDado.converteNumero(linha.Per_Multa)/100,
                        dt_Emissao: converterDado.gerarStringDatasUTC(linha.Emissao),
                        dt_Vencimento: converterDado.gerarStringDatasUTC(linha.Vencimento)
                    }
            
                    return dados
                }
        );
            return arrayTratado
            
        } catch (error) {
            return {message: `Erro no processo de tratamento do arquivo Excel - Erro: ${error}`};
        }

    };

    static consultaClienteAgrupado(dados) {

        try {
            const titulosConsolidados = TrataArrays.agrupaArraysPorDado(dados,'cod_Cliente');
            const titulosTratados = titulosConsolidados.map((titulo) => {
                return {
                    cod_Cliente: titulo.cod_Cliente,
                    nome_Cliente: titulo.nome_Cliente,
                    cliente_Cod: titulo.cliente_Cod
                }
            })

            return titulosTratados;
            
        } catch (error) {
            return {message: `Erro ao Consolidar Clientes - Erro: ${error}`};
        }
    }

    static consultaGrupoAgrupado(dados) {

        try {
            const titulosConsolidados = TrataArrays.agrupaArraysPorDado(dados,'cod_Grupo');
            const titulosTratados = titulosConsolidados.map((titulo) => {
                return {
                    cod_Grupo: titulo.cod_Grupo,
                    nome_Cliente: titulo.grupo,
                    grupo_Cod: titulo.grupo_Cod
                }
            })

            return titulosTratados;
            
        } catch (error) {
            return {message: `Erro ao Consolidar Grupos - Erro: ${error}`};
        }
    }

};

export default modelPlanilha;