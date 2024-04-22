import controllerTitulos from "../controller/controllerTitulos.js";
import Calculos from "../funcoes/calculos.js";
import converterDado from "../funcoes/conversoes.js";
import Service from './Service.js'

const tabelaCalculo = 'PRICE';
const ratearPor = ['cliente_Cod', 'nome_Credor'];

class ServiceAcordo {
    static calculaAcordo(totais, param, dt_Referencia , calcularParam){
        var composicao = {
            parametros: {},
            totais: {
                original: {},
                descontos: {},
                acrescimos: {},
                atualizado: {},
            },
            parcelas: {
                consolidado: {},
                rateado: {}
            }
        };

        try {

            if (param) {
                // consolida os parametros gerais do acordo
                if (calcularParam === true) {
                    composicao.parametros = this.defineParametros(param, dt_Referencia);

                } 

                // consolida os totais do acordo
                const consTotais = this.defineTotais(totais, param, composicao.totais);
                composicao.totais = consTotais.totais;

                // extratifica as parcelas do acordo
                var varParcelas;
                if (consTotais.parcelas) {
                    varParcelas = this.defineParcelas(param, composicao.totais.atualizado, composicao.totais.original.vlr_Aberto, consTotais.parcelas);
                
                } else {
                    varParcelas = this.defineParcelas(param, composicao.totais.atualizado, composicao.totais.original.vlr_Aberto);
                }
                composicao.parcelas.consolidado = varParcelas;

        } else {
                Object.keys(totais).forEach( (e) => {
                    if (totais[e] != null) {
                        composicao.totais.original[e] = totais[e];
                    }
                });

            }

           
                return composicao
        } catch (error) {
            return {message: `Erro no Serviço de Acordos - Erro: ${error}`, cod: 400}
        }
    };
    static consolidarDados(baseDados, camposRateio){
        const linhaFiltrada = Service.filtrarObjetoLinha(baseDados, camposRateio);
        const linhaConsolidada = Service.consolidaArray(linhaFiltrada, camposRateio);

        
        return linhaConsolidada
    }

    static defineParcelas(parametros, totaisAcordo, vlr_Original, tabelaParcelas){
        const objAcordo = {};

        if (tabelaCalculo === 'DEFAULT' || parametros.qtd_Parcelas <= 1) {
            for (let index = 0; index < parametros.qtd_Parcelas; index++) {
                objAcordo[index] = {
                        num_Parcela: Number(index  + 1),
                        dt_Vencimento: Calculos.incrementarDatas(parametros.dt_Entrada, (index * parametros.dias_Periodicidade)).toISOString(),
                        vlr_Total: Number((totaisAcordo.vlr_Atualizado / parametros.qtd_Parcelas).toFixed(2)),
                        vlr_Taxa_Amortizacao: vlr_Original <= totaisAcordo.vlr_Atualizado ? Number(((totaisAcordo.vlr_Atualizado / parametros.qtd_Parcelas) -  (vlr_Original / parametros.qtd_Parcelas)).toFixed(2)) : 0,
                        vlr_Saldo_Devedor: 0,
                        vlr_Total_Amortizacao: Number((vlr_Original / parametros.qtd_Parcelas).toFixed(2)),
                        vlr_Encargos_Amortizacao: Number((totaisAcordo.vlr_Juros / parametros.qtd_Parcelas + totaisAcordo.vlr_Multa / parametros.qtd_Parcelas).toFixed(2)),
                        vlr_Juros_Amortizacao: Number((totaisAcordo.vlr_Juros / parametros.qtd_Parcelas).toFixed(2)),
                        vlr_Multa_Amortizacao: Number((totaisAcordo.vlr_Multa / parametros.qtd_Parcelas).toFixed(2))
                }                
            }
            
        } else {
            for (let index = 0; index < parametros.qtd_Parcelas; index++) {
                objAcordo[index] = {
                        num_Parcela: index + 1,
                        dt_Vencimento: tabelaParcelas.atualiza_Total.parcelas[index + 1].dt_Vencimento,
                        vlr_Total: tabelaParcelas.atualiza_Total.parcelas[index + 1].vlr_Parcela,
                        vlr_Taxa_Amortizacao: tabelaParcelas.atualiza_Total.parcelas[index + 1].vlr_Juros,
                        vlr_Saldo_Devedor: tabelaParcelas.atualiza_Total.parcelas[index + 1].vlr_Saldo_Devedor,
                        vlr_Total_Amortizacao: tabelaParcelas.atualiza_Total.parcelas[index + 1].vlr_Amortizacao,
                        vlr_Original_Amortizacao: tabelaParcelas.atualiza_Original.parcelas[index + 1].vlr_Amortizacao,
                        vlr_Total_Encargos_Amortizacao: Number((tabelaParcelas.atualiza_Total.parcelas[index + 1].vlr_Parcela - tabelaParcelas.atualiza_Original.parcelas[index + 1].vlr_Amortizacao).toFixed(2))

                }
                
            }
        }

        return objAcordo
    };

    static defineTotais(totaisTitulos, parametros, tituolosTotais){
        
                var objeto = tituolosTotais;
                // totais
                //totais gerais
                Object.keys(totaisTitulos).forEach( (e) => {
                    if (totaisTitulos[e] != null) {
                        
                        objeto.original[e] = totaisTitulos[e];
                    }
                });

                //totais descontos
                objeto.descontos = {
                    vlr_Aberto: Number((parametros.per_Desc_Original * objeto.original.vlr_Aberto).toFixed(2)),
                    vlr_Juros: Number((parametros.per_Desc_Encargos * objeto.original.vlr_Juros).toFixed(2)),
                    vlr_Multa: Number((parametros.per_Desc_Encargos * objeto.original.vlr_Multa).toFixed(2)),
                    vlr_Atualizado: Number(((parametros.per_Desc_Original * objeto.original.vlr_Aberto)
                    + (parametros.per_Desc_Encargos * objeto.original.vlr_Juros)
                    + (parametros.per_Desc_Encargos * objeto.original.vlr_Multa)).toFixed(2))
                }


                const vlr_Total_Com_Desconto = (objeto.original.vlr_Atualizado - objeto.descontos.vlr_Atualizado)
                const vlr_Original_Com_Desconto = (objeto.original.vlr_Aberto - objeto.descontos.vlr_Aberto)
                const vlr_Juros_Com_Desconto = (objeto.original.vlr_Juros - objeto.descontos.vlr_Juros)
                const vlr_Multa_Com_Desconto = (objeto.original.vlr_Multa - objeto.descontos.vlr_Multa)

                if (tabelaCalculo === 'DEFAULT' || parametros.qtd_Parcelas <= 1) {
                    
                    //totais acrescimos
                    objeto.acrescimos = {
                        vlr_Aberto: Number(((parametros.per_Taxa/30) * parametros.dias_Duracao * (objeto.original.vlr_Aberto - objeto.descontos.vlr_Aberto)).toFixed(2)),
                        vlr_Juros: Number(((parametros.per_Taxa/30) * parametros.dias_Duracao * (objeto.original.vlr_Juros - objeto.descontos.vlr_Juros)).toFixed(2)),
                        vlr_Multa: Number(((parametros.per_Taxa/30) * parametros.dias_Duracao * (objeto.original.vlr_Multa - objeto.descontos.vlr_Multa)).toFixed(2)),
                        vlr_Atualizado: Number(((parametros.per_Taxa/30) * parametros.dias_Duracao * (objeto.original.vlr_Atualizado - objeto.descontos.vlr_Atualizado)).toFixed(2)),
                    }

                    //totais atualizado
                    objeto.atualizado = {
                        vlr_Aberto: Number((objeto.original.vlr_Aberto - objeto.descontos.vlr_Aberto + objeto.acrescimos.vlr_Aberto).toFixed(2)),
                        vlr_Atualizado: Number((objeto.original.vlr_Atualizado - objeto.descontos.vlr_Atualizado + objeto.acrescimos.vlr_Atualizado).toFixed(2)),
                        vlr_Juros: Number((objeto.original.vlr_Juros - objeto.descontos.vlr_Juros + objeto.acrescimos.vlr_Juros).toFixed(2)),
                        vlr_Multa: Number((objeto.original.vlr_Multa - objeto.descontos.vlr_Multa + objeto.acrescimos.vlr_Multa).toFixed(2)),
                    }
                    return { totais: objeto }
                } else if (tabelaCalculo === 'PRICE') {

                    const atualiza_Total = this.calculoTabelaPrice(vlr_Total_Com_Desconto, parametros.qtd_Parcelas, parametros.per_Taxa, parametros.dias_Periodicidade, parametros.dt_Entrada);
                    const atualiza_Original = this.calculoTabelaPrice(vlr_Original_Com_Desconto, parametros.qtd_Parcelas, parametros.per_Taxa, parametros.dias_Periodicidade, parametros.dt_Entrada);
                    const atualiza_Juros = this.calculoTabelaPrice(vlr_Juros_Com_Desconto, parametros.qtd_Parcelas, parametros.per_Taxa, parametros.dias_Periodicidade, parametros.dt_Entrada);
                    const atualiza_Multa = this.calculoTabelaPrice(vlr_Multa_Com_Desconto, parametros.qtd_Parcelas, parametros.per_Taxa, parametros.dias_Periodicidade, parametros.dt_Entrada);

                    //totais acrescimos
                    objeto.acrescimos = {
                        vlr_Aberto: atualiza_Original.vlr_Juros,
                        vlr_Juros: atualiza_Juros.vlr_Juros,
                        vlr_Multa: atualiza_Multa.vlr_Juros,
                        vlr_Atualizado: atualiza_Total.vlr_Juros,
                    }

                    //totais atualizado
                    objeto.atualizado = {
                        vlr_Aberto: atualiza_Original.vlr_Total,
                        vlr_Atualizado: atualiza_Total.vlr_Total,
                        vlr_Juros: atualiza_Juros.vlr_Total,
                        vlr_Multa: atualiza_Multa.vlr_Total,
                    }

                    return { totais: objeto, parcelas: { atualiza_Total, atualiza_Original, atualiza_Juros, atualiza_Multa } };
                }
                
    };
    static calculoTabelaPrice(valorPresente, qtdParcelas, taxaMensal, diasPeriodicidade, dt_Entrada){
        const convPV = Number(valorPresente);
        const convN = Number(qtdParcelas);
        const convI = Number(taxaMensal);
        const convPeriodicidade = Number(diasPeriodicidade);
        const convIPeriodizada = (1 + convI)**(convPeriodicidade/30)-1

        const dividendo = ((1 + convIPeriodizada)**convN)*convIPeriodizada
        const divisor = ((1 + convIPeriodizada)**convN) - 1
        const vlrParcela = ((dividendo/divisor) * convPV);


        const vlrTotal = Number(((vlrParcela * convN)).toFixed(2));
        const vlrJuros = Number((vlrTotal - valorPresente).toFixed(2))

        const tabParcelas = this.parcelamentoTabelaPrice(convN, convPV, convIPeriodizada, vlrParcela, dt_Entrada, convPeriodicidade);


        return {vlr_Total: vlrTotal, vlr_Juros: vlrJuros, parcelas: tabParcelas };
    };

    static parcelamentoTabelaPrice(convN, convPV, convIPeriodizada, vlrParcela, dt_Entrada, dias_Periodicidade){
        var parcelas = {};
        for (let i = 1; i < convN + 1; i++) {
            if (i === 1) {
                parcelas[i] = {
                    num_Parcela: i,
                    dt_Vencimento: dt_Entrada,
                    vlr_Parcela: Number((vlrParcela).toFixed(2)),
                    vlr_Juros: Number((convPV * convIPeriodizada).toFixed(2)),
                    vlr_Amortizacao:  Number((vlrParcela - (convPV * convIPeriodizada)).toFixed(2)),
                    vlr_Saldo_Devedor:  Number((convPV - (vlrParcela - (convPV * convIPeriodizada))).toFixed(2))
                };
                
            }
            else {
                
                parcelas[i] = {
                    num_Parcela: i,
                    dt_Vencimento: Calculos.incrementarDatas(dt_Entrada, ((i - 1) * dias_Periodicidade)).toISOString(),
                    vlr_Parcela: Number((vlrParcela).toFixed(2)),
                    vlr_Juros: Number((parcelas[i-1].vlr_Saldo_Devedor * convIPeriodizada).toFixed(2)),
                    vlr_Amortizacao: Number((vlrParcela - (parcelas[i-1].vlr_Saldo_Devedor * convIPeriodizada)).toFixed(2)),
                    vlr_Saldo_Devedor: Number((parcelas[i-1].vlr_Saldo_Devedor - (vlrParcela - (parcelas[i-1].vlr_Saldo_Devedor * convIPeriodizada))).toFixed(2)) <= 1 ? 0 : Number((parcelas[i-1].vlr_Saldo_Devedor - (vlrParcela - (parcelas[i-1].vlr_Saldo_Devedor * convIPeriodizada))).toFixed(2))
                };

            };

       };

       return parcelas
    };

    static defineParametros(parametros, dt_Referencia){
        var objeto = {};
        objeto = parametros
        objeto['dias_Periodicidade'] = Number(parametros.dias_Periodicidade);
        objeto['qtd_Parcelas'] = Number(parametros.qtd_Parcelas);
        objeto['per_Desc_Encargos'] = Number(parametros.per_Desc_Encargos)/100;
        objeto['per_Desc_Original'] = Number(parametros.per_Desc_Original)/100;
        objeto['per_Taxa'] = Number(parametros.per_Taxa)/100;
        objeto['dt_Entrada'] = new Date(parametros.dt_Entrada).toISOString();
        objeto['dt_Referencia'] = dt_Referencia
        const diasIncremento = Calculos.diferencaEntreDatas(dt_Referencia, objeto.dt_Entrada);
        const diasPeriodico = (objeto.qtd_Parcelas - 1) * objeto.dias_Periodicidade;
        objeto['dt_Finalizacao'] = Calculos.incrementarDatas(dt_Referencia, diasIncremento + diasPeriodico).toISOString();
        objeto['dias_Duracao'] = Calculos.diferencaEntreDatas(objeto.dt_Referencia, objeto.dt_Finalizacao);
        objeto['meses_Duracao'] = Number((objeto.dias_Duracao / 30).toFixed(0))

        return objeto
    };

    static calculaRateio(baseDados, parametros, filtros){
        const listaConsolidada = this.consolidarDados(baseDados, ratearPor)
        var acordoRateado = {};
        var acordoRateadoPrint = {};

        listaConsolidada.forEach( (linha, key) => {
            var filtroAtualizado = {...filtros};
            filtroAtualizado.filtros = {...filtroAtualizado.filtros, ...linha}

            const baseTitulos = controllerTitulos.consultaComFiltrosEAtualiza(filtroAtualizado.dt_Referencia, filtroAtualizado.filtros);
            const acordoCalculado = this.calculaAcordo(baseTitulos.dados.totais, parametros, filtroAtualizado.dt_Referencia);
            const printAcordoCalculado = this.printaAcordo(acordoCalculado);
            
            acordoRateado[key] = { ...linha, acordo: {...acordoCalculado}};
            acordoRateadoPrint[key] = { ...linha, acordo: {...printAcordoCalculado}};
        });


        return { acordo: acordoRateado, acordoPrint: acordoRateadoPrint}
    }

    static printaAcordo(dados){

        try {
            var dadoConvertido;
            var dadoLinha = {};

            Object.keys(dados).forEach( (key) => {
                if (typeof(dados[key]) === 'object') {
                    dadoConvertido = this.printaAcordo(dados[key]);

                } else {
                    const defineTipo = key.split('_')[0];
                    if (defineTipo === 'vlr') {
                        dadoConvertido = converterDado.printarNumero(dados[key]);
                    } else if(defineTipo === 'dt'){
                        dadoConvertido = converterDado.reverterStringDataUTC(dados[key]);
                    } else if(defineTipo === 'per'){
                        dadoConvertido = converterDado.printaPercentual(dados[key]);
                    } else {
                        dadoConvertido = dados[key];
                    }
                }
                dadoLinha[key] = dadoConvertido
            });

            return dadoLinha
            
        } catch (error) {
            return {message: `Erro no Serviço de Titulos - Erro: ${error}`, cod: 400}
        }
    };

}

export default ServiceAcordo;