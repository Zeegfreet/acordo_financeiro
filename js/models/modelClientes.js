import conecatLocalStorage from "../connection/connectionLocalStorage.js";
import TrataArrays from "../funcoes/trataArray.js";

const idLocal = 'dadosClientes';

class ModelClientes {
    
    static consultaSemFiltros() {

        try {
            const baseClientes = conecatLocalStorage.consultarDados(idLocal);
            const clientes = baseClientes;
            return clientes;
            
        } catch (error) {
            return {message: `Erro ao consultar Clientes - Erro: ${error}`};
        }
    }

    static consultaComFiltros(parametros) {
        
        try {
            const baseClientes = conecatLocalStorage.consultarDados(idLocal);
            const todosClientes = baseClientes;

            const grupos = todosClientes.filter(
                grupo => {
                    var filtrar = null;
                    Object.keys(parametros).forEach( (e) => {
                        if (cliente[e] != parametros[e]) {
                            filtrar = true
                        } else if (cliente[e] === parametros[e] && filtrar != true) {
                            filtrar = false
                        }
                    });

                    if (filtrar === false) {
                        return cliente
                    }
                    
                }
            );

            return grupos;
            
        } catch (error) {
            return {message: `Erro ao consultar Clientes - Erro: ${error}`};
        }
    };

    static gravaClientes(dados) {

        try {
            const clientes = conecatLocalStorage.gravarDados(idLocal, dados);

            return clientes;
            
        } catch (error) {
            return {message: `Erro no modelo de gravação de clientes - Erro: ${error}`};
        }
    }

    
}

export default ModelClientes;