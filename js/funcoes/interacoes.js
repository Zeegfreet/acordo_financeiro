// Importa a biblioteca html2canvas
import html2canvas from '../canva/canva.js';


class InteracoesUsuario {
    static copiaObjeto(objeto){

        // Seleciona a div que deseja converter em imagem
        const div = objeto;

        // Converte a div em uma imagem usando html2canvas
        html2canvas(div).then(canvas => {
            // Converte o canvas em um Blob
            canvas.toBlob(blob => {
                // Copia o Blob para o Clipboard
                navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).then(() => {
                    console.log('Imagem copiada para o Clipboard!');
                }).catch(err => {
                    console.error('Erro ao copiar imagem para o Clipboard:', err);
                });
            }, 'image/png');
        });
    };

};

export default InteracoesUsuario;