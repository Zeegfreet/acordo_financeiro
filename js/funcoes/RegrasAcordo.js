import Calculos from "./calculos.js";
import converterDado from "./conversoes.js";

const limitadores = {
    per_Desc_Encargos: {
        min: 0,
        max: 80,
        min_absolute: 0,
        max_absolute: 100
    },
    per_Desc_Original: {
        min: 0,
        max: 0,
        min_absolute: 0,
        max_absolute: 30,
    },
    per_Taxa: {
        min: 1,
        max: 10,
        min_absolute: 0,
        max_absolute: 10,
    },
    qtd_Parcelas: {
        min: 1,
        max: 20,
        min_absolute: 1,
        max_absolute: 30,
    },
    dias_Periodicidade: {
        min: 5,
        max: 45,
        min_absolute: 1,
        max_absolute: 60
    },
    dt_Entrada: {
        min: 2,
        max: 15,
        min_absolute: 1,
        max_absolute: 60
    }
}



class RegrasAcordo {

    static validarCampo(input){
        var validaCampo = true;
        var resultado = true;
        var valor;
        var message

        const atributo = input.attributes['name'].value
        const prefixoAtributo = atributo.split('_')[0];


        //trata dados pelo prefixo
        if (prefixoAtributo === 'dt') {
            valor = Calculos.diferencaEntreDatas(new Date().toISOString(), input.value)+1;
        } else {
            valor = Number(input.value);
        }

        Object.keys(limitadores[atributo]).forEach((key) => {
            const prefixo = key.split('_')[0];
            const sufixo = key.split('_')[1];
            if (prefixo === 'min' && valor < limitadores[atributo][key]) {

                resultado = false
                message = `Requerer autorização gerencia, mínimo da alçada: ${limitadores[atributo][key]}`
                if (sufixo === 'absolute') {
                    validaCampo = false
                    message = `Operação não permitida, mínimo permitido: ${limitadores[atributo][key]}`
                }

            } else if (prefixo === 'max'  && valor > limitadores[atributo][key]) {
                resultado = false
                message = `Requerer autorização gerencia, máximo da alçada: ${limitadores[atributo][key]}`
                if (sufixo === 'absolute') {
                    validaCampo = false
                    message = `Operação não permitida, máximo permitido: ${limitadores[atributo][key]}`
                }

            }
        });

        return {message: message, alcada: resultado, seguir: validaCampo}

    }
}

export default RegrasAcordo;