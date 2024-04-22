import converterDado from "../funcoes/conversoes.js";
import DataOrganize from "../funcoes/dataOrganize.js";
import ObjectMaker from "../funcoes/objectMaker.js";


const dadosCache = localStorage.getItem('ordemTitulos');
const dadosExibir = JSON.parse(dadosCache) || {
    id_Titulo: 'Titulo',
    cliente_Cod: 'Cliente',
    Status: 'Status',
    tipo_Titulo: 'Tipo',
    dt_Emissao: 'Emissao',
    dt_Vencimento: 'Vencimento',
    dias_Vencido: 'Dias',
    vlr_Atualizado: 'Valor Total',
    vlr_Aberto: 'Valor Aberto',
    vlr_Juros: 'Juros',
    vlr_Multa: 'Multa'

}

// const dadosExibir = {
//     1: {
//         id_Titulo: 'Titulo',
//         cliente_Cod: 'Cliente',
//         Status: 'Status',
//         tipo_Titulo: 'Tipo',
//         dt_Emissao: 'Emissao',
//         dt_Vencimento: 'Vencimento',
//         dias_Vencido: 'Dias',
//         vlr_Atualizado: 'Valor Total',
//         vlr_Aberto: 'Valor Aberto',
//         vlr_Juros: 'Juros',
//         vlr_Multa: 'Multa'
//     }

// };

class FormularioTitulos {
    static carregarTitulosTabela(objDestino, dados, totais, key){
        //limpa os dados do quadro e tabela
        objDestino.innerHTML = '';

        //cria totalizadores
        objDestino.appendChild(this.criaTotalizadores(totais, key));

        // //cria tabela
        objDestino.appendChild(this.criarTabela(dados, totais, key));

        // const objDataOrganize = new DataOrganize(dadosExibir, dados);
        // const objTabelaTitulos = objDataOrganize.objTabelarizeSumarizado();

        // objDestino.appendChild(ObjectMaker.criarTabela(objTabelaTitulos, [ 'form-tabela', 'conteudo__dados_titulos'], 'id_Titulo'));

    };

    static carregarTitulosTabelaSemTotais(dados, totais, key){
        const ObjTabela = ObjectMaker.criarElemento('div');

        //cria tabela
        ObjTabela.appendChild(this.criarTabela(dados, totais, key));
        
        return ObjTabela
    };

    static criaTotalizadores(totais, key){
        const objQuadro = this.criarElemento('div', null, ['conteudo__dados_totais', 'container']);
            var j = 0

            Object.keys(dadosExibir).forEach((i)=> { //percorre as colunas
                if (totais[i] != null) {
                    j += 1
                    switch (j) {
                        case 1:
                            var classe = 'variacao-um';
                           break;
                        case 2:
                            var classe = 'variacao-dois';
                            break;
                        case 3:
                            var classe = 'variacao-tres';
                            break;
                        case 4:
                            var classe = 'variacao-quatro';
                            break;
                        default:
                            var classe = 'variacao-um'
                            j = 0
                            break;
                    }

                    const conteudoDiv = `<label>${dadosExibir[i]}</label><br>${totais[i]}`;
                    const objCard = this.criarElemento('div', dadosExibir[i], [ 'conteudo__dados_totais-item', classe]);
                    objCard.innerHTML = conteudoDiv;
                    objQuadro.appendChild(objCard);
                    
                }
            });

        return objQuadro
    }


    static criarTabela(dados, totais, key){
        const objTabela = this.criarElemento('table', null, [ 'form-tabela', 'conteudo__dados_titulos']);
        
        objTabela.appendChild(this.criarCabecalho(key));

        dados.forEach((linha) => {
            objTabela.appendChild(this.criarLinha(linha, linha[key]))
        });
        return objTabela
    };

    static criarCabecalho(key){
        //cria a linha do header
        const objHeader = this.criarElemento('tr');


        //cria célula de seleção
        const objCelulaSel = this.criarElemento('th');
        
        const objCOmboBox = this.criarElemento('input', null, ['form-checkbox']);
        objCOmboBox.setAttribute('type', 'checkbox');
        objCelulaSel.appendChild(objCOmboBox);
        objCOmboBox.onchange = () => {this.checkBoxToggle('.cb-item', objCOmboBox.checked)};
        objHeader.appendChild(objCelulaSel);

        //cria os elementos do header
            Object.keys(dadosExibir).forEach((key)=> { //percorre as colunas
                const objCelula = this.criarElemento('th', dadosExibir[key])
                objCelula.setAttribute('draggable', true);
                objHeader.appendChild(objCelula);
            });

        return objHeader
    };


    static criarLinha(dados, key){
        const objLinha = this.criarElemento('tr');

        //cria a celula de seleção
        const objCelulaSel = this.criarElemento('td');
        
        const objCOmboBox = this.criarElemento('input', null, ['form-checkbox', 'cb-item']);
        objCOmboBox.setAttribute('Value', key);
        objCOmboBox.setAttribute('type', 'checkbox');
        objCelulaSel.appendChild(objCOmboBox);
        objLinha.appendChild(objCelulaSel);

        //cria os elementos de linha
            Object.keys(dadosExibir).forEach((key, i)=> { //percorre as colunas
                const objCelula = this.criarElemento('td', dados[key])
                objLinha.appendChild(objCelula);
            });


        return objLinha
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

    

    static checkBoxToggle(classes, valor){
        const todosCheckbox = document.querySelectorAll(classes);

        todosCheckbox.forEach(e => {
            e.checked = valor;
        });
    };


    static imprimirPagina(objeto){
        const pagina = window.open('Impressão Pimpolho');
        const css = `<style>
        * {
        margin: 0;
        padding: 0;
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
        pagina.document.write(css + objeto.innerHTML);

        pagina.window.print();
        pagina.window.close();
    }

}

export default FormularioTitulos;