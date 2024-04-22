class FormularioClientes {
    
    static carregarOptions(objDados, vlrDefault, paramValor){
        const objDefault = `<option value='${vlrDefault}'>${vlrDefault}</option>'`;
        try {
            var objFinal = `<option value='${vlrDefault}'>${vlrDefault}</option>'`
            objDados.forEach(e => {
                if (e[paramValor] != null) {
                    objFinal += `<option value='${e[paramValor]}'>${e[paramValor]}</option>'`
                    
                }
            });
        
            return objFinal
            
        } catch (error) {
            return objDefault
        }
    }
}

export default FormularioClientes