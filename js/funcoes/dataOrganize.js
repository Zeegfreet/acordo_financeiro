
class DataOrganize {
    constructor(nIndice_Sumario, nObjeto){
        this.indice = nIndice_Sumario;
        this.objeto = nObjeto;
    };

    /*
    ##################################################################################################################
     Cria um objeto novo baseado nas chaves descritas em um objeto índice, exatamento nas mesmas dimensões do objeto
    ##################################################################################################################
    */
    //Concatenado, inclui o que estiver no resultante do objeto índice concatenado ao objeto base
    objTabelarizePorIndiceConcatenado(tabelaAtual, indiceAtual){
        var objTabela
        var objIndice
        if (!tabelaAtual) {
            objTabela = this.objTabelarizePorIndice();
            objIndice = this.indice;
        } else {
            objTabela = tabelaAtual;
            objIndice = indiceAtual;
        }
        
        Object.keys(objTabela).forEach( (key) => {
            if (typeof(objTabela[key]) === 'object' && objTabela[key] != null) {
                objTabela[key] = this.objTabelarizePorIndiceConcatenado(objTabela[key], objIndice[key]);

            } else if (indiceAtual[key] != null) {
                
                objTabela[key] = `${objIndice[key]} : ${objTabela[key]}`;
            }
        });
        return objTabela;
    };

    objTabelarizePorIndice(newIndex, titularizar){
        var novoIndice;
        if (!newIndex) {
            var novoIndice = this.indice
        } else {
            novoIndice = newIndex
        }
        var objetoFinal = {};

        Object.keys(novoIndice).forEach( key => {
           
            if (typeof(novoIndice[key]) === 'object' && novoIndice[key] != null) {
                if (key != 'Titularize') {
                    objetoFinal[key] = this.objTabelarizePorIndice(novoIndice[key]);
                    
                } else {
                    objetoFinal[key] = this.objTabelarizePorIndice(novoIndice[key], 'Titularize');
                }

            } 
            else if (titularizar === 'Titularize') {
                objetoFinal[key] = novoIndice[key];
            }
            else if (novoIndice[key] != null) {
                objetoFinal[key] = this.objeto[key];
                
            }
            else {
                objetoFinal[key] = '';
            }
        });

        return objetoFinal
    };

        /*
    ##################################################################################################################
     Cria um novo objeto baseado em um índice de sumarização com duas dimensões [linhas e colunas]
    ##################################################################################################################
    */
    objTabelarizeSumarizado(tabelaAtual, indiceAtual){
        var objTabela;
        var objIndice;
        var objNiveis;
        var objResultado = {};


        if (!tabelaAtual) {
            objTabela = this.objeto;
            objIndice = this.indice;
            objNiveis = 0;
        } else {
            objTabela = tabelaAtual;
            objIndice = indiceAtual;
            objNiveis = 1;
        };

        if (!objResultado['Titularize'] && objNiveis === 0) {
            objResultado['Titularize'] = objIndice[1];
        };

        console.log(objResultado);

        Object.keys(objTabela).forEach( key => { //percorre as linhas do Objeto
            if (typeof(objTabela[key]) === 'object' && objTabela[key] != null && key != 'Titularize') {
                if (objNiveis === 0) {
                    objResultado[key] = this.objTabelarizeSumarizado(objTabela[key], objIndice[1]);
                } else {
                    objResultado[key] = {...this.objTabelarizeSumarizado(objTabela[key], objIndice[1])};
                }
            } else if(key != 'Titularize') {
                Object.keys(objIndice).forEach( index => {
                    if (objTabela[index]) {
                        objResultado[index] = objTabela[index];
                    };
                });
               
            }
        });

        
        return objResultado
    };

    objtTabelarize(novoObjeto){
        
        Object.keys(this.indice).forEach( (key) => {
            
        });
    };
};

export default DataOrganize;