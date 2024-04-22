class GestorDePaginas {
    static async carregaPaginaOBJ(Objeto, link){
            try {
                let xhr = await fetch(link);
                let retorno  = await xhr.text();
                Objeto.innerHTML = retorno
                
            } catch (error) {
                Objeto.innerHTML = {Message: `Erro ao Carregar Página - Erro: ${error.Message}`}
            }
    }
}

export default GestorDePaginas;