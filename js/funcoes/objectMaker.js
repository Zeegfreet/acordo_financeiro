

class ObjectMaker {
    static criarElemento(tipo, conteudo, arrayClasses , tagStyle){
        //criação do objeto
        const elemento = document.createElement(tipo);
        
        // conteúdo
        if (conteudo && conteudo != null) {
            elemento.innerHTML = conteudo;
        }
        
        //gestor de classes
        if (arrayClasses && arrayClasses != null) {
            arrayClasses.forEach(classe => {
                elemento.classList.add(classe)
            })
            
        }

        // estilo
        if (tagStyle && tagStyle != null) {
            elemento.setAttribute('style', tagStyle) ;
        }

        //gestor de estilos

        return elemento
    };

    static criarTabela(objetoTabela, arrayClasses, chaveLinha){
        const objTabela = this.criarElemento('table', null, arrayClasses);

        Object.keys(objetoTabela).forEach( (idLinha) => {
            const objLinha = ObjectMaker.criarElemento('tr', null, [`tb-linha-${chaveLinha}`, `tb-linha-tabela`]);

            Object.keys(objetoTabela[idLinha]).forEach( (idCelula) => {
                const objCelula = this.criarCelulaTabela(objetoTabela[idLinha][idCelula], idLinha);
                objLinha.appendChild(objCelula);
            });
            
            if (idLinha === 'Titularize') {
                objTabela.prepend(objLinha);
            } else {
                objTabela.appendChild(objLinha);

            }
        });

        return objTabela;
    };

    static criarCelulaTabela(valor, idLinha){
        const objCelula = idLinha === 'Titularize' ? this.criarElemento('th') : this.criarElemento('td');
        
        objCelula.innerHTML = valor;

        return objCelula
    }
};

export default ObjectMaker;