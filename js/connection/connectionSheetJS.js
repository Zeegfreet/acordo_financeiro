import { read, writeFileXLSX, utils } from "../sheetjs/index.js";

class conectaSheetJS{
    // function que faz a leitura do arquivo e converte em um array
    static async lerPlanilha(arquivo, aba= 0) {
        try {
            const arquivoParaArrayBF = await arquivo.arrayBuffer();
            const workbook = await read(arquivoParaArrayBF);
            const worksheet = workbook.Sheets[workbook.SheetNames[aba]];
            const workSheetArray = utils.sheet_to_json(worksheet, {raw: false});
            
            return workSheetArray
            
        } catch (error) {
            return {Message: `Erro ao realizar consulta - ${error} `}
        }
    };

};

export default conectaSheetJS;