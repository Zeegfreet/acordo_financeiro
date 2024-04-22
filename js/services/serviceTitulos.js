import converterDado from "../funcoes/conversoes.js";
import Calculos from "../funcoes/calculos.js";

class ServiceTitulos {
    static printaTitulos(dados){
        try {
            var dadoConvertido = '';
            var defineTipo;
            var dadosPrintar = [];
            var dadoLinha = {};

            dados.forEach( (linha, index) => { //percorre as linhas do array
                Object.keys(linha).forEach( (key) => { //percorre as chaves na linha
                    defineTipo = key.split('_')[0];
                    
                    if(defineTipo === 'vlr'){
                        dadoConvertido = converterDado.printarNumero(linha[key]);
                    } else if (defineTipo === 'dt') {
                        dadoConvertido = converterDado.reverterStringDataUTC(linha[key]);
                    } else {
                        dadoConvertido = linha[key];
                    }
                    
                    
                    dadoLinha[key] = dadoConvertido
                    
                });
                dadosPrintar[index] = {...dadoLinha}
            });
            return dadosPrintar
            
        } catch (error) {
            return {message: `Erro no Serviço de Titulos - Erro: ${error}`, cod: 400}
        }
    };

    static printaTotais(dados){
        try {
            var dadoConvertido = '';
            var defineTipo;
            var dadosPrintar = [];
        


            Object.keys(dados).forEach( key => {
                    defineTipo = key.split('_')[0];

                    if(defineTipo === 'vlr' && dados[key] != null){
                        dadoConvertido = converterDado.printarNumero(dados[key]);
                    } else if (defineTipo === 'dt' && dados[key] != null) {
                        dadoConvertido = converterDado.reverterStringDataUTC(dados[key]);
                    } else {
                        dadoConvertido = dados[key];
                    }

                    dadosPrintar[key] = dadoConvertido
            });

            
            return dadosPrintar
            
        } catch (error) {
            return {message: `Erro no Serviço de print de Totais de Títulos - Erro: ${error.message}`, cod: 400}
        }
    };


    static calculaTotais(dados){
        try {
            var numTotal = [];
            dados.forEach( (linha) => { //percorre as linhas do array
                Object.keys(linha).forEach( (key) => { //percorre os items do objeto
                    var keyPrefixo = key.split('_')[0];
                    if (keyPrefixo === 'vlr') {
                        numTotal[key] = !numTotal[key] ? linha[key] : Number((numTotal[key] + linha[key]).toFixed(2));
                    } else {
                        numTotal[key] = null
                    }

                });
            });

            return numTotal;
            
        } catch (error) {
            return {message: `Erro no Serviço de Titulos - Erro: ${error}`};
        }
    }

    static atualizarTitulos(dados, dtReferencia){
        const attTitulos = dados.map( (titulo) => {
            titulo['dias_Vencido'] = Calculos.diferencaEntreDatas(titulo.dt_Vencimento, dtReferencia);
            titulo['Status'] = Calculos.defineStatusDeVencimento(titulo.dias_Vencido);
            titulo['vlr_Juros'] = Calculos.calculaJuros(titulo.vlr_Aberto, titulo['dias_Vencido'], titulo.per_Juros);
            titulo['vlr_Multa'] = Calculos.calculaMulta(titulo.vlr_Aberto, titulo['dias_Vencido'], titulo.per_Multa);
            titulo['vlr_Atualizado'] = Number((titulo.vlr_Aberto + titulo.vlr_Juros + titulo.vlr_Multa).toFixed(2));
            return titulo
        })
        return attTitulos
    }
    static filtrarTitulos(baseDeDados, filtros){
        const baseFiltrada = baseDeDados.filter(
            linha => {
                var filtrar = null;
                
                Object.keys(filtros).forEach( (e) => {
                    
                    if (typeof(filtros[e]) === 'object') { //se o conteúdo de E for um objeto
                        if (!filtros[e].includes(linha[e])) {
                            filtrar = true
                        } else if (filtros[e].includes(linha[e]) && filtrar != true) {
                            filtrar = false
                        }

                    } else { //se o conteúdo de E não for um objeto
                        if (linha[e] != filtros[e]) {
                            filtrar = true
                        } else if (linha[e] === filtros[e] && filtrar != true) {
                            filtrar = false
                        }
                        
                    }

                });

                if (filtrar === false) {
                    return linha
                }
                
            }
        );
        
        return baseFiltrada
    }

    
}

export default ServiceTitulos;