import ModelGrupos from "../models/modelGrupos.js";

class ControllerGrupos {
    static consultaSemFiltro(){
        try {
            const baseTitulos = ModelGrupos.consultaSemFiltros();

            return { message: "Sucesso ao Consultar Grupos", codigo: 200, dados: baseTitulos}
            
        } catch (error) {
            return { message: `Erro no controlador de grupos - Erro: ${error}`, codigo: 400 };
        }
    };

    static consultaComFiltros(parametros){
        try {
            const baseTitulos = ModelGrupos.consultaComFiltros(parametros);

            return { message: "Sucesso ao Consultar Dados", codigo: 200, dados: baseTitulos}
        } catch (error) {
            return { message: `Erro no controlador de grupos - Erro: ${error}`, codigo: 400 };
        }
    }
    
}

export default ControllerGrupos;