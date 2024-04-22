

class Calculos {
    static diferencaEntreDatas(dtInicio, dtFim){
        const tratadtInicio = dtInicio.split('T');
        const tratadtFinal = dtFim.split('T');
        const dataInicio = new Date(tratadtInicio);
        const dataFinal = new Date(tratadtFinal);
    
        const dias = (dataFinal - dataInicio) /1000/60/60/24
        const diasRedondo = dias.toFixed();

        return Number(diasRedondo)
    };

    static incrementarDatas(data, dias){
        const formataData = data.split('T')[0]

        const objData = new Date(formataData);

        const diasMilissegundos = dias * 1000 * 60 * 60 *24;

        const dataFinal = new Date(objData.getTime() + diasMilissegundos);
        
        if (dataFinal.getDay() === 5 || dataFinal.getDay() === 6) {
            return this.incrementarDatas(dataFinal.toISOString(), 1)
        }

        return dataFinal
    };

    static calculaJuros(valor, dias, taxa){
        const taxaAd = Number(taxa / 30)
        const taxaTT = Number(taxaAd * dias)
        const vlrATT = Number((valor * taxaTT).toFixed(2))
        if (dias > 0) {
            return vlrATT
        } else {
            return 0
        }
        
    };

    static calculaMulta(valor, dias, taxa){
        
        if (dias > 0) {
            return Number((valor * taxa).toFixed(2))
        } else {
            return 0
        }
        
    };

    static defineStatusDeVencimento(dias){
        if (dias <= 0){
            return 'A Vencer'
        } else {
            return 'Vencido'
        }
    };
}

export default Calculos;