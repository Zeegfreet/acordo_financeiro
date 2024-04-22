import ControllerAcordo from "../controller/controllerAcordo.js";
import controllerTitulos from "../controller/controllerTitulos.js";
import DataOrganize from "../funcoes/dataOrganize.js";
import ObjectMaker from "../funcoes/objectMaker.js";
import FormularioAcordo from "./formularioAcordo.js";
import FormularioTitulos from "./formularioTitulos.js";

//consts
const cssGeral = `display: flex; flex-direction: column; border-top: 1px dashed gray; flex-wrap: wrap;`;
const styleTabela = `padding: 0;`;
const styleCabecalhos = `border: 1px solid gray;`;
const styleLinhaCabecalhos =`border: 1px solid gray; background-color: lightblue`;
const styleLinhas = `border: 1px solid gray;`;
const styleCelulas = `border: 1px solid gray; text-align: center;`;
const styleDado = `text-align: center;`;
const styleFormData = `margin: 0.5em; font-style: bold;`

var parcelasExibir = {};

const dadosExibir = {
    titulos: {
        vlr_Atualizado: 'Valor Total',
        vlr_Aberto: 'Valor Original',
        vlr_Juros: 'Valor Juros',
        vlr_Multa: 'Valor Multa'
    },
    original: {
        vlr_Atualizado: 'Valor Total',
        vlr_Aberto: 'Valor Aberto',
        vlr_Juros: 'Juros',
        vlr_Multa: 'Multa'
    },
    descontos: {
        vlr_Atualizado: 'Valor Total',
        vlr_Aberto: 'Valor Aberto',
        vlr_Juros: 'Juros',
        vlr_Multa: 'Multa'
    },
    acrescimos: {
        vlr_Atualizado: 'Valor Total',
        vlr_Aberto: 'Valor Aberto',
        vlr_Juros: 'Juros',
        vlr_Multa: 'Multa'
    },
    atualizado: {
        vlr_Atualizado: 'Valor Total',
        vlr_Aberto: 'Valor Aberto',
        vlr_Juros: 'Juros',
        vlr_Multa: 'Multa'
    }

}

class ImpressaoAcordo {
    static imprimirAcordo(tipo){
        if (tipo === 'Cliente') {
            parcelasExibir = {
                num_Parcela: 'Parcela',
                dt_Vencimento: 'Vencimento',
                vlr_Total: 'Valor Parcela',
                vlr_Taxa_Amortizacao: 'Juros Parcela',
                vlr_Total_Amortizacao: 'Valor Amortização',
                vlr_Saldo_Devedor: 'Saldo Remanescente',
                // vlr_Original_Amortizacao: 'Amortização Original',
                // vlr_Total_Encargos_Amortizacao: 'Amortização Encargos'
            }
            
        } else {
            parcelasExibir = {
                num_Parcela: 'Parcela',
                dt_Vencimento: 'Vencimento',
                vlr_Total: 'Valor Parcela',
                vlr_Taxa_Amortizacao: 'Juros Parcela',
                vlr_Total_Amortizacao: 'Valor Amortização',
                vlr_Saldo_Devedor: 'Saldo Remanescente',
                vlr_Original_Amortizacao: 'Amortização Original',
                vlr_Total_Encargos_Amortizacao: 'Amortização Encargos'
            }
        }
        const pagina = window.open('Impressão Pimpolho');
        const css = `<style>
        * {
        margin: 0;
        padding: 0;
        }
        
        table {
            width: 100%;
        }
        table *{
            border: 1px solid gray;
        }
        
        th {
            background-color: lightblue;
        }
        
        .conteudo__dados_totais {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5em;    
        }
        
        .conteudo__dados_totais div{
            border: 2px solid gray;
            text-align: center;
            padding: 0.5em;
        }
        </style>`

        //define as variáveis para uso
        const dadosAcordo = ControllerAcordo.consultaAcordo();
        const filtroTitulos = ControllerAcordo.consultaFiltros();
        const titulos = controllerTitulos.consultaComFiltrosEAtualiza(filtroTitulos.dados.dt_Referencia,filtroTitulos.dados.filtros);
        

        

        //cria o corpo da página de impressão
        const body = ObjectMaker.criarElemento('div');
        //cria o cabeçalho
        body.appendChild(this.criarCabecalho());
        //cria resumo
        body.appendChild(this.criaResumoParametros(dadosAcordo.dados.acordoPrint.parametros));
        //cria a área do acordo
        body.appendChild(this.criarObjAcordo(dadosAcordo.dados.acordoPrint.parametros.dt_Referencia, dadosAcordo.dados.acordoPrint.totais, dadosAcordo.dados.acordoPrint.parcelas.consolidado));
        //cria a tabela com as parcelas do acordo
        body.appendChild(this.criarObjAcordoRateado(dadosAcordo.dados));
        //cria divisor
        const divTitulos = ObjectMaker.criarElemento('div', null, null, cssGeral);
        const tituloDiv = ObjectMaker.criarElemento('h2', 'Títulos no Acordo', null, 'text-align: center');
        const tabelTitulos = FormularioTitulos.carregarTitulosTabelaSemTotais(titulos.dados.titulosPrint, titulos.dados.totaisPrint, "id_Titulo");
        divTitulos.appendChild(tituloDiv);

        //cria a tabela com o extrato dos titulos
        
        divTitulos.appendChild(tabelTitulos)
        body.appendChild(divTitulos);

        pagina.document.write(css + body.innerHTML);
        pagina.window.print();
        pagina.window.close();
    };


    static criaResumoParametros(parametros){
        console.log(parametros);
        var layoutParametros = {
            1: {
                dias_Duracao: 'Duração em Dias',
                meses_Duracao: 'Duração em Meses',
                dias_Periodicidade: 'Periodicidade',
                qtd_Parcelas: 'Quantidade de Parcelas',
            },
            2: {
                
                per_Desc_Encargos: 'Desconto Sobre Juros',
                per_Desc_Original: 'Desconto Sobre Valor Original',
                per_Taxa: 'Taxa negociada',
                coluna4: null
            },
            3: {
                dt_Referencia: 'Data de Referência Calculo',
                dt_Entrada: "Data da Entrada",
                dt_Finalizacao: "Data última Parcela",
                coluna4: null
            },
        }
       
        
        const divContainer = ObjectMaker.criarElemento('div', null, ['ct-Parametros'], cssGeral);
        const titulo = ObjectMaker.criarElemento('h2', 'PARÂMETROS UTILIZADOS', null, 'text-align: center');

        divContainer.appendChild(titulo); 
        
        
        const dtOrganize = new DataOrganize(layoutParametros, parametros);
        const tableOrganize = dtOrganize.objTabelarizePorIndiceConcatenado();
        const objTabela = ObjectMaker.criarTabela(tableOrganize, ['ct-tabela-parametros']);
        console.log(objTabela);
        const objParagrafo = ObjectMaker.criarElemento('br');
        divContainer.appendChild(objParagrafo);

        divContainer.appendChild(objTabela);
        return divContainer
    }
    
    static criarCabecalho(){
        const divCabecalho = ObjectMaker.criarElemento('div', null, ['ct-cabecalho'], 'display: flex; justify-content: center;');
        const cbTitulo = ObjectMaker.criarElemento('H1', 'ACORDO PIMPOLHO', ['ct-cabecalho'])
        divCabecalho.appendChild(cbTitulo);

        return divCabecalho
    };

    static criarObjAcordoRateado(baseDados){
        const objAcordoRateado = ObjectMaker.criarElemento('div', null, ['ct-rateado-acordo'], cssGeral);
        const objTitulo = ObjectMaker.criarElemento('h2', 'RATEIO DO ACORDO', null, 'text-align: center;');
        objAcordoRateado.appendChild(objTitulo);
        Object.keys(baseDados.acordoRateadoPrint).forEach( (key) => { //percorre as linhas do rateio

            const objRateio = ObjectMaker.criarElemento('div', null, null, cssGeral)
        
            const objRateioHeader = this.criarCabecalhoRateio(baseDados.acordoRateadoPrint[key]);

            const objRateioTotais = this.carregarTotais(baseDados.acordoRateadoPrint[key].acordo.totais);

            const objDivisor = ObjectMaker.criarElemento('h2', 'Parcelas', null, 'text-align: center;');

            const objRateioParcelas = this.carregaParcelas(baseDados.acordoRateadoPrint[key].acordo.parcelas.consolidado);

            objRateio.appendChild(objRateioHeader);
            objRateio.appendChild(objRateioTotais);
            objRateio.appendChild(objDivisor);
            objRateio.appendChild(objRateioParcelas);

            objAcordoRateado.appendChild(objRateio);
        });

        

        return objAcordoRateado
    }

    static criarCabecalhoRateio(dados){
        const divHeader = ObjectMaker.criarElemento('div', null, null, 'display: flex; padding: 1em; justify-content: center; gap: 3em;');
        Object.keys(dados).forEach( (key) => {
            if (typeof(dados[key]) != 'object') {
                const dado = ObjectMaker.criarElemento('div', `${dados[key]}`, null, 'text-align: center; font-weight: bold; border-bottom: 1px solid gray;');
                divHeader.appendChild(dado);
            }
        });
        return divHeader
    }

    static criarObjAcordo(dt_referencia, totais, parcelas){
        const objAcordo = ObjectMaker.criarElemento('div', null, ['ct-total-acordo'], cssGeral);
        const objTitulo = ObjectMaker.criarElemento('h2', 'TOTAIS GERAIS', null, 'text-align: center');
        objAcordo.appendChild(objTitulo);
        // const objDataReferencia = ObjectMaker.criarElemento('div', `Data Referencia: ${dt_referencia}`, ['ct-total-dt_referencia']);
        const objTotaisAcordo = this.carregarTotais(totais);
        const objDivisor = ObjectMaker.criarElemento('h2', 'Parcelas', null, 'text-align: center;');
        const objParcelas = this.carregaParcelas(parcelas);
            
        // objAcordo.appendChild(objDataReferencia);
        objAcordo.appendChild(objTotaisAcordo);
        objAcordo.appendChild(objDivisor);
        objAcordo.appendChild(objParcelas);
    
        return objAcordo
    }

    static carregarTotais(dados){
        


        const objTabela = ObjectMaker.criarElemento('table', null, ['conteudo-acordo_totais-tabela'],styleTabela);
        const objLinhaCabecalho = ObjectMaker.criarElemento('tr', null, ['tb-linha_cabecalho'], styleLinhaCabecalhos);
        const objCelulaVazia = ObjectMaker.criarElemento('th');
        var objColuna = [];
        var objLinha = [];

        objLinhaCabecalho.appendChild(objCelulaVazia);

        Object.keys(dadosExibir).forEach( key => {
            if (key != 'titulos') {
                const objColunaCabecalho = ObjectMaker.criarElemento('th', key, null, styleCabecalhos)
                objLinhaCabecalho.appendChild(objColunaCabecalho);
            }
        });

        objTabela.appendChild(objLinhaCabecalho);

        Object.keys(dadosExibir).forEach( key => {
            Object.keys(dadosExibir[key]).forEach((itemKey) => {
                if (!objLinha[itemKey]) {
                    objLinha[itemKey] = ObjectMaker.criarElemento('tr', null, ['acordo-tb-linha-valor', `acordo-tb-linha-${key}`], styleLinhas)
                    objTabela.appendChild(objLinha[itemKey]);
                };
                if (key === 'titulos') {
                    objColuna[key] = ObjectMaker.criarElemento('td', dadosExibir[key][itemKey], [`td-${key}`, `td-item-${itemKey}`], styleCelulas);
                    objLinha[itemKey].appendChild(objColuna[key]);
                } else  {
                    objColuna[key] = ObjectMaker.criarElemento('td', dados[key][itemKey], [`td-${key}`, 'tb-dado'], styleCelulas);
                    objLinha[itemKey].appendChild(objColuna[key]);
                }
            });
        });
                
        return objTabela
    }

    static carregaParcelas(parcelas){
        
        const objTabela = ObjectMaker.criarElemento('table', null, ['tb-parcelas', 'form-tabela'], styleTabela);

        objTabela.appendChild(this.criaCabecalho());

        Object.keys(parcelas).forEach( key => {
            const objLinha = this.criarLinha(parcelas[key], parcelas[key].num_Parcela)
            objTabela.appendChild(objLinha);
        });

        return objTabela
    };

    static criarLinha(parcela, key){
        const objLinha = ObjectMaker.criarElemento('tr', null, [`tb-parcela-${key}`], styleLinhas);

        Object.keys(parcelasExibir).forEach( key => {

            const objDado = ObjectMaker.criarElemento('td', parcela[key], null, styleCelulas)
            objLinha.appendChild(objDado);
        });

        return objLinha
    };

    static criaCabecalho(){
        const objHeader = ObjectMaker.criarElemento('tr', null, ['tb-hd-parcelas'], styleLinhaCabecalhos)

        Object.keys(parcelasExibir).forEach( key => {
            const objDado = ObjectMaker.criarElemento('th', parcelasExibir[key], [`tb-hd-${key}`], styleCabecalhos);
            objHeader.appendChild(objDado);
        })

        return objHeader
    };


}


export default ImpressaoAcordo;