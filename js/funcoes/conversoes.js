
class converterDado{
    static gerarStringDatasUTC(data){
        const arrData = data.split('/');
        const stringData = arrData[2] + "-" + arrData[1] + "-" + arrData[0] + "T00:00:00Z";
        
        return stringData
    }

    static reverterStringDataUTC(dataUTC){
        
        const removeH = dataUTC.split('T')[0];
        const arrData = removeH.split('-');
        const stringData = arrData[2] + "/" + arrData[1] + "/" + arrData[0];
        return stringData
    }
    
    static converteNumero(strNumero){
        const regex1 = /\./g
        const regex2 = /\,/g
        var numero = strNumero.replace(regex1, "");
        var numero = numero.replace(regex2, ".");
    
        return Number(numero)
    }

    static printarNumero(intNumero){
        const regex = /\./g;
        const stringNumero = String(intNumero);
        var depoisDaVirgula = stringNumero.split(".")[1];
        const antesDaVirgulaOriginal = stringNumero.split(".")[0];
        
        if (!depoisDaVirgula || String(depoisDaVirgula).length == 0) {
            depoisDaVirgula = '00'
        } else if (String(depoisDaVirgula).length == 1) {
            depoisDaVirgula += '0'
        }

        const arrayAntesdaVirgula = antesDaVirgulaOriginal.split("");
        const totalCaracteres = String(antesDaVirgulaOriginal).length
        var antesDaVirgula = ''

        arrayAntesdaVirgula.forEach((caractere, index) => {
            
                if (calculaCaracter(index, totalCaracteres)) {
                    antesDaVirgula += '.';
                }
                antesDaVirgula += caractere;
        
        });

        return antesDaVirgula + "," + depoisDaVirgula
    }

    static printaPercentual(intNumero){
        const numeroBase = Number(intNumero * 100);
        const numeroTratado = this.printarNumero(numeroBase);
        const numeroFInal = numeroTratado + "%"

        return numeroFInal
    }

}


function calculaCaracter(i, total){
    const index = total - i;
    const multiplicador = Number(index / 3)
    const multiplicadorArred = Number((index / 3).toFixed(0))


    if (index == total) {
        return false
    } else if (multiplicador === multiplicadorArred) {
        return true
    } else {
        return false
    }
}



export default converterDado;