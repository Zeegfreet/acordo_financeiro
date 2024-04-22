import conecatLocalStorage from "../connection/connectionLocalStorage.js";
import TrataArrays from "../funcoes/trataArray.js";

const idLocal = 'dadosGrupos';

class ModelGrupos {
    
    static consultaSemFiltros() {

        try {
            const baseGrupos = conecatLocalStorage.consultarDados(idLocal);
            const grupos = baseGrupos;
            return grupos;
            
        } catch (error) {
            return {message: `Erro ao consultar Grupos - Erro: ${error}`};
        }
    }

    static consultaComFiltros(parametros) {
        
        try {
            const baseGrupos = conecatLocalStorage.consultarDados(idLocal);
            const todosGrupos = baseGrupos;

            const grupos = todosGrupos.filter(
                grupo => {
                    var filtrar = null;
                    Object.keys(parametros).forEach( (e) => {
                        if (grupo[e] != parametros[e]) {
                            filtrar = true
                        } else if (grupo[e] === parametros[e] && filtrar != true) {
                            filtrar = false
                        }
                    });

                    if (filtrar === false) {
                        return grupo
                    }
                    
                }
            );

            return grupos;
            
        } catch (error) {
            return {message: `Erro ao consultar Grupos - Erro: ${error}`};
        }
    };

    static gravaGrupos(dados) {

        try {
            const grupos = conecatLocalStorage.gravarDados(idLocal, dados);

            return grupos;
            
        } catch (error) {
            return {message: `Erro no modelo de gravação de clientes - Erro: ${error}`};
        }
    }

    
}

export default ModelGrupos;