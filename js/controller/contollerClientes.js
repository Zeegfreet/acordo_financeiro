import ModelClientes from "../models/modelClientes.js";

class ControllerClientes {
    static consultaSemFiltro(){
        try {
            const baseClientes = ModelClientes.consultaSemFiltros();

            return { message: "Sucesso ao Consultar Clientes", codigo: 200, dados: baseClientes}
            
        } catch (error) {
            return { message: `Erro no controlador de Clientes - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaComFiltros(parametros){
        try {
            const baseClientes = ModelClientes.consultaComFiltros(parametros);

            return { message: "Sucesso ao Consultar Clientes", codigo: 200, dados: baseClientes}
        } catch (error) {
            return { message: `Erro no controlador de Clientes - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaComFiltrosConsolidado(parametros){
        try {
            const baseClientes = ModelClientes.consultaComFiltros(parametros);

            return { message: "Sucesso ao Consultar Clientes", codigo: 200, dados: baseClientes}
        } catch (error) {
            return { message: `Erro no controlador de Clientes - Erro: ${error}`, codigo: 400 };
        }
    }
    
}

export default ControllerClientes;