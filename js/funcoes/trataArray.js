
class TrataArrays{
    static agrupaArraysPorDado(dadosArray, campoBase){
        const listaBase = dadosArray.map( (linha, indice) => {

            return linha[campoBase]
        });

        const arrayFinal = dadosArray.filter((linha, i) => !listaBase.includes(linha[campoBase], i + 1))
        return arrayFinal
    }
}

export default TrataArrays;