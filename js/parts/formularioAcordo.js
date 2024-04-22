import ControllerAcordo from "../controller/controllerAcordo.js";
import controllerTitulos from "../controller/controllerTitulos.js";
import Calculos from "../funcoes/calculos.js";
import converterDado from "../funcoes/conversoes.js";
import InteracoesUsuario from "../funcoes/interacoes.js";
import RegrasAcordo from "../funcoes/RegrasAcordo.js";
import ImpressaoAcordo from "./impressaoAcordo.js";

const alcadasAcordo = {
    meses_Duracao: 10,
    max_Meses_Duracao: 16
}

var formDefault = JSON.parse(sessionStorage.getItem('parametrosAcordo')) || {
    per_Desc_Encargos: '0.00',
    per_Desc_Original: '0.00',
    per_Taxa: '10.00',
    qtd_Parcelas: 1,
    dias_Periodicidade: 10,
    dt_Entrada: (Calculos.incrementarDatas(new Date().toISOString(), 2).toISOString()).split('T')[0]

}

const parcelasExibir = {
    num_Parcela: 'Parcela',
    dt_Vencimento: 'Vencimento',
    vlr_Total: 'Valor Parcela',
    vlr_Taxa_Amortizacao: 'Juros Parcela',
    vlr_Total_Amortizacao: 'Valor Amortização',
    vlr_Saldo_Devedor: 'Saldo Remanescente',
    // vlr_Encargos_Amortizacao: 'Encargos Amortizacao',
    // vlr_Juros_Amortizacao: 'Juros Amortização',
    // vlr_Multa_Amortizacao: 'Multa Amortização'
}

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

const divTotais = document.querySelector('.conteudo-acordo_totais');
const formAcordo = document.querySelector('.conteudo-acordo__formulario-formulario');
const divParcelas = document.querySelector('.conteudo-acordo__parcelas');
const btnImprimir = document.querySelector('.btn-acordo-imprimir');
const btnImprimirCli = document.querySelector('.btn-acordo-imprimir-cli');
const btnCopiar = document.querySelector('.btn-acordo-copiar');
const formAcordoInputs = document.querySelectorAll('.form_acordo-item');
const mensagensAcordo = document.querySelector('.conteudo-acordo__mensagens');




//adiciona funções ao botão calcular Acordo

formAcordo.addEventListener('submit', (e) => {
    e.preventDefault();
    var validado = true;

    const formObject = new FormData(e.target).entries();
    const formulario = Object.fromEntries(formObject);

    formAcordoInputs.forEach( input => {
        const validaItem = validaCampos(input);

        if (validaItem === false) {
            validado = false
        }
    });

    if (validado === false) {
        mensagensAcordo.innerHTML = 'Verifique as inconsistências no formulário antes de calcular o acordo!'
    } else {
        FormularioAcordo.carregarTela(formulario);

        // sessionStorage.setItem('parametrosAcordo', JSON.stringify(formulario));
        // mensagensAcordo.innerHTML = '';
    }

    
});

//adiciona funções ao botão imprimir acordo
btnImprimir.addEventListener('click', (e) => {
    e.preventDefault();
     
    if (divParcelas.innerHTML != '') {
        ImpressaoAcordo.imprimirAcordo();
        mensagensAcordo.innerHTML = '';
    } else {
        mensagensAcordo.innerHTML = 'Clique no botão calcular antes de imprimir o acordo!'

    }

});


btnImprimirCli.addEventListener('click', (e) => {
    e.preventDefault();
     
    if (divParcelas.innerHTML != '') {
        ImpressaoAcordo.imprimirAcordo('Cliente');
        mensagensAcordo.innerHTML = '';
    } else {
        mensagensAcordo.innerHTML = 'Clique no botão calcular antes de imprimir o acordo!'

    }

});

btnCopiar.addEventListener('click', (e) => {
    e.preventDefault();
     
    if (divParcelas.innerHTML != '') {
        InteracoesUsuario.copiaObjeto(divParcelas);

        mensagensAcordo.innerHTML = '';
    } else {
        mensagensAcordo.innerHTML = 'Clique no botão calcular antes de copiar o acordo'

    }

});

//valida o formulário Acordo
formAcordoInputs.forEach( e => {
    e.addEventListener('change', (e) => validaCampos(e.target));
});



//classe principal

class FormularioAcordo {
    static carregarTela(parametros){
        // if (parametros) {
        //     sessionStorage.setItem('parametrosAcordo',JSON.stringify(parametros));
        //     formDefault = parametros;
            
        // }
        
        const acordo = ControllerAcordo.calculaAcordo(parametros);
        console.log(acordo);
        divTotais.innerHTML = ''
        divParcelas.innerHTML = ''
        
        if (!parametros) {
            divTotais.appendChild(this.carregarTotais(acordo.dados.acordoPrint.totais));

            this.carregarFormulario()

        } else {
            const validacaoAcordo = this.validaAcordo(acordo.dados.acordo.parametros)

            if (validacaoAcordo.validacao === true) {
                divTotais.appendChild(this.carregarTotais(acordo.dados.acordoPrint.totais));
                ControllerAcordo.gravaAcordo(acordo.dados);
                divParcelas.appendChild(this.exibirParcelas(acordo.dados.acordoPrint.parcelas.consolidado));
                
            } else {
                divTotais.appendChild(this.carregarTotais(acordo.dados.acordoPrint.totais));

            }

            mensagensAcordo.innerHTML = validacaoAcordo.mensagem;

        };
    };

    static validaAcordo(parametros){
        if (parametros.meses_Duracao > alcadasAcordo.max_Meses_Duracao) {
            return { validacao: false, mensagem: `Acordo excede o máximo de meses permitido pela organização, máximo: ${alcadasAcordo.max_Meses_Duracao}!` }
        };
        
        if (parametros.meses_Duracao > alcadasAcordo.meses_Duracao) {
            return { validacao: true, mensagem: `Acordo necessita de aprovação gerêncial, pois excedeu ${alcadasAcordo.meses_Duracao} meses de duração!` }
        };


        return { validacao: true, mensagem: 'Sucesso ao Calcular Acordo!' }
    }

    static exibirParcelas(parcelas){
        const objTabela = this.criarElemento('table', null, ['tb-parcelas', 'form-tabela']);

        objTabela.appendChild(this.criaCabecalho());

        Object.keys(parcelas).forEach( key => {
            const objLinha = this.criarLinha(parcelas[key], parcelas[key].num_Parcela)
            objTabela.appendChild(objLinha);
        });

        return objTabela
    }

    static criarLinha(parcela, key){
        const objLinha = this.criarElemento('tr', null, [`tb-parcela-${key}`]);

        Object.keys(parcelasExibir).forEach( key => {

            const objDado = this.criarElemento('td', parcela[key])
            objLinha.appendChild(objDado);
        });

        return objLinha
    }

    static criaCabecalho(){
        const objHeader = this.criarElemento('tr', null, ['tb-hd-parcelas'])

        Object.keys(parcelasExibir).forEach( key => {
            const objDado = this.criarElemento('th', parcelasExibir[key], [`tb-hd-${key}`]);
            objHeader.appendChild(objDado);
        })

        return objHeader
    }

    static carregarFormulario(){
        Object.keys(formDefault).forEach( (key) => {
            const itemFormulario = document.querySelector(`input[name=${key}]`)
            
            itemFormulario.value = formDefault[key];
        });
    };

    static atualizarAcordo(formulario){
        const acordoAtualizado = ControllerAcordo.calculaAcordo(formulario);
        console.log(acordoAtualizado);
    };

    static carregarTotais(dados){
        const objTabela = this.criarElemento('table', null, ['conteudo-acordo_totais-tabela']);
        const objLinhaCabecalho = this.criarElemento('tr', null, ['tb-linha_cabecalho']);
        const objLinhaVazia = this.criarElemento('th');
        var objColuna = [];
        var objLinha = [];

        objLinhaCabecalho.appendChild(objLinhaVazia);

        Object.keys(dadosExibir).forEach( key => {
            if (key != 'titulos') {
                const objColunaCabecalho = this.criarElemento('th', key)
                objLinhaCabecalho.appendChild(objColunaCabecalho);
            }
        });

        objTabela.appendChild(objLinhaCabecalho);

        Object.keys(dadosExibir).forEach( key => {
            Object.keys(dadosExibir[key]).forEach((itemKey) => {
                if (!objLinha[itemKey]) {
                    objLinha[itemKey] = this.criarElemento('tr', null, ['acordo-tb-linha-valor', `acordo-tb-linha-${key}`])
                    objTabela.appendChild(objLinha[itemKey]);
                };
                if (key === 'titulos') {
                    objColuna[key] = this.criarElemento('td', dadosExibir[key][itemKey], [`td-${key}`, `td-item-${itemKey}`]);
                    objLinha[itemKey].appendChild(objColuna[key]);
                } else  {
                    objColuna[key] = this.criarElemento('td', dados[key][itemKey], [`td-${key}`, 'tb-dado']);
                    objLinha[itemKey].appendChild(objColuna[key]);
                }
            });
        });
                
        return objTabela
    }

    static preencherTabela(dados){
        Object.keys(dados).forEach((key) => {

        });
    }

    static atualizarFormulario(){
        
    };



    static criarElemento(tipo, texto, classes){
        const elemento = document.createElement(tipo);
        
        if (texto && texto != null) {
            elemento.innerHTML = texto;
        }

        if (classes && classes != null) {
            classes.forEach(classe => {
                elemento.classList.add(classe)
            })
            
        }

        return elemento
    };
}


//função para validar campos do formulario

function validaCampos(input){
    const validacao = RegrasAcordo.validarCampo(input);
    const elementoMensagem = input.nextElementSibling;

    if (validacao.seguir === false) {
        input.setAttribute('validado', 'false');
        elementoMensagem.innerHTML = validacao.message;
        return false

    } else if (validacao.alcada === false) {
        input.setAttribute('validado', 'alert');
        elementoMensagem.innerHTML = validacao.message;
        return true
    } else {
        input.setAttribute('validado', 'true');
        elementoMensagem.innerHTML = '';
        return true
    }

}

export default FormularioAcordo;