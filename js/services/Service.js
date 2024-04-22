class Service {
    static filtrarObjetoLinha(baseDados, arrayFiltro){
        const listaBase = baseDados.map( (linha, indice) => {
            var itemsLinha = {};
            Object.keys(linha).forEach( (key) => {
                if (arrayFiltro.includes(key)) {
                    itemsLinha[key] = linha[key];
                };
            });
            return itemsLinha
        });

        return listaBase
    }

    static consolidaArray(dadosArray){
        
        const arrayBase = dadosArray.map( (linha, key) => { // percorre linhas
            var item = [];
            var chave = [];
            Object.values(linha).forEach( valor => { //percorre valores
                item[key] = !item[key] ? valor : item[key] + "-" + String(valor);
            });
            
            return item[key];
        });

        const arrayIndex = arrayBase.map( (linha, key) => {
            if (!arrayBase.includes(linha, key + 1)) {
                return true
            } else {
                return false
            }
        });

        const arrayFinal = dadosArray.filter( (valor, chave) => arrayIndex[chave] === true);

        return arrayFinal
    }

}

export default Service;