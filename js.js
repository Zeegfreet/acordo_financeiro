import FormularioClientes from "./js/parts/formularioClientes.js";
import FormularioTitulos from "./js/parts/formularioTitulos.js";
import controllerPlanilha from "./js/controller/controllerPlanilha.js";
import controllerTitulos from "./js/controller/controllerTitulos.js";
import ControllerGrupos from "./js/controller/controllerGrupos.js";
import ControllerClientes from "./js/controller/contollerClientes.js";
import converterDado from "./js/funcoes/conversoes.js";
import GestorDePaginas from "./js/funcoes/GestorDePaginas.js"
import FormularioAcordo from "./js/parts/formularioAcordo.js";
import ControllerAcordo from "./js/controller/controllerAcordo.js";
import RegrasAcordo from "./js/funcoes/RegrasAcordo.js";

//salva as variaveis de ambiente
const formArquivo = document.querySelector('.conteudo__formulario');
const formClientes = document.querySelector('.conteudo__form-cliente');
const formAcordo = document.querySelector('.conteudo-acordo__formulario-formulario');
const formAcordoInputs = document.querySelectorAll('.form_acordo-item');
const contDados = document.querySelector('.conteudo__dados');
const btnImprimir = document.querySelector('.btn_imprimir');
const btnAcordo = document.querySelector('.btn_acordo');
const formDataReferencia = document.querySelector('.conteudo__form-cliente__data-referencia');
const formSelectGrupo = document.querySelector('.conteudo__form-cliente__grupo');
const formSelectCliente = document.querySelector('.conteudo__form-cliente__cliente');
const sistemaMensagens = document.querySelector('.conteudo__form_retorno');
const mensagensAcordo = document.querySelector('.conteudo-acordo__mensagens');
const divPopup = document.querySelector('.popup');
const divConteudoPopup  = document.querySelector('.conteudo__popup');
const tableTitulos = document.querySelector('.conteudo__dados');


//seta status inicial do formulário data de referência


atualizarFormulario();
    function atualizarFormulario(){
        const grupos = ControllerGrupos.consultaSemFiltro();
        const clientes = ControllerClientes.consultaSemFiltro();

        formSelectGrupo.innerHTML = FormularioClientes.carregarOptions(grupos.dados, 'Todos', 'grupo_Cod');
        formSelectCliente.innerHTML = FormularioClientes.carregarOptions(clientes.dados, 'Todos', 'cliente_Cod');
        formDataReferencia.value = (new Date()).toISOString().split("T")[0];

};




// clique no botao acordo
btnAcordo.addEventListener('click', (e) => {
    e.preventDefault();
    
    chamarTelaAcordo()
});





//clique no botão imprimir
btnImprimir.addEventListener('click', (e) => {
    e.preventDefault();
    if ((tableTitulos.innerHTML).length > 10) {
        FormularioTitulos.imprimirPagina(tableTitulos);
    } else {
        sistemaMensagens.innerHTML = 'Atuelize a lista de titulos para impressão!'
    }
});

//Adiciona funções ao botão Carregar Arquivo voltado a leitura de arquivos em excel
formArquivo.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const arquivo = e.target.elements['form-arquivo'].files[0];

        if (arquivo) {
            sistemaMensagens.innerHTML = `<img src="./img/loading.gif" width="40">`;
            const planilha = await controllerPlanilha.gravarPlanilhaLocalStorage(arquivo);
            console.log(planilha);
            sistemaMensagens.textContent = planilha.message;
            atualizarFormulario()
        } else {
            sistemaMensagens.textContent = "Selecione um arquivo para carregar!";
        }
});

//Adiciona funções ao botão Atualizar Dados responsável pelo carregamento de títulos na tela
formClientes.addEventListener('submit', (e) => {
    e.preventDefault();
    const formObject = new FormData(e.target).entries();
    const formulario = Object.fromEntries(formObject);
    var filtros = {};

    Object.keys(formulario).forEach((key) => {
        const prefixo = key.split('_')[0];
        if (prefixo != 'dt' && formulario[key] != 'Todos') {
            filtros[key] = formulario[key];
        }
    });

    const dataTratada = new Date(formulario.dt_Referencia).toISOString();
    atualizarTabelaTitulos(dataTratada, filtros);
    
});




// //seleciona tudo
// function selecionaDados(e){
//     console.log(e);
// }



//função para gerir atualização da tabela de títulos

function atualizarTabelaTitulos(dtReferencia, filtros){
    var listaTitulos;
    if (Number(Object.keys(filtros).length) <= 0){
        listaTitulos = controllerTitulos.consultaSemFiltrosEAtualiza(dtReferencia);


    } else {
        listaTitulos = controllerTitulos.consultaComFiltrosEAtualiza(dtReferencia, filtros);
    }

    FormularioTitulos.carregarTitulosTabela(tableTitulos, listaTitulos.dados.titulosPrint, listaTitulos.dados.totaisPrint, "id_Titulo");
    sistemaMensagens.textContent = listaTitulos.message;
    
}


// FUNÇÕES ###########

function chamarTelaAcordo(){
    const eleTitulos = document.querySelectorAll('.cb-item');
    const dataTratada = new Date(formDataReferencia.value).toISOString();
    
    var selTitulos = [];

    //cria um array com os titulos marcados no formulário
    eleTitulos.forEach( (e)=> {
        if (e.checked === true) {
            selTitulos.push(e.attributes.value.value) 
        }
    });

    //se o array retornar vazio cria um array com todos os titulos do formulário
    if (selTitulos.length <= 0) {
        eleTitulos.forEach( (e)=> {
                selTitulos.push(e.attributes.value.value) 

        });
    }
    
    const filtros = { id_Titulo: selTitulos };
    
    // verifica se algum titulo foi selecionado para executar o processo e salva no localStorage

    if (selTitulos.length > 0) {
        const salvaFiltros = ControllerAcordo.gravaFiltros(dataTratada, filtros);
        FormularioAcordo.carregarTela();

        divPopup.classList.toggle('hidden');
        const tabelaResumoTitulos = document.querySelector('.conteudo__dados_titulos')
        tabelaResumoTitulos.classList.add('hidden');
    } else {
        sistemaMensagens.innerHTML = 'Atualize a lista de títulos para seguir!'
    }
}


//clique na div popup

divPopup.addEventListener('click', (e) => {
    if(e.target === divPopup){
        divPopup.classList.toggle('hidden');
        const tabelaResumoTitulos = document.querySelector('.conteudo__dados_titulos')
        ControllerAcordo.limparCacheAcordo();
        tabelaResumoTitulos.classList.toggle('hidden')
    }
})