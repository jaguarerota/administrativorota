function formatarData(dataStr) {
    const partes = dataStr.split('-');
    const ano = partes[0];
    const mes = parseInt(partes[1], 10);
    const dia = partes[2];

    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    return `${dia} de ${meses[mes - 1]} de ${ano}`;
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Definir a largura da pagina para centralizar o conteúdo
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 20; 

    // Captura a data
    const dataInput = document.getElementById('data').value;
    const dataFormatada = new Date(dataInput);
    const opcoesFormatacao = { day: 'numeric', month: 'long', year: 'numeric' };
    const dataTexto = `São Paulo, ${dataFormatada.toLocaleDateString('pt-BR', opcoesFormatacao)}`;

    // Define a fonte como normal e centraliza a data  (falta arrumar fuso horario 1 dia antes)
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10); 
    doc.text(dataTexto, pageWidth - 10, currentY, { align: 'right' });
    currentY += 10; 

    // Define a fonte do título e centraliza
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14); // Tamanho da fonte do título
    doc.text('SECRETARIA DE SEGURANÇA PÚBLICA DO ESTADO DE SÃO PAULO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    doc.text('POLÍCIA MILITAR DO ESTADO DE SÃO PAULO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;

    // Adiciona a imagem ao PDF (centralizada abaixo do título)
    const imgWidth = 50;
    const imgHeight = 50;
    doc.addImage(imgData, 'PNG', (pageWidth - imgWidth) / 2, currentY, imgWidth, imgHeight); // Centraliza a imagem
    currentY += 60; // Avança a posição Y

    // Adiciona a linha horizontal mais curta
    const linhaY = currentY; // Altura da linha abaixo da imagem
    doc.setLineWidth(0.5); // Linha fina
    doc.setDrawColor(0, 0, 0); // Cor da linha (preta)
    const margem = 30; // Margem de cada lado
    doc.line(margem, linhaY, pageWidth - margem, linhaY); // Linha mais curta, sem ir até as bordas
    currentY += 10; // Avança a posição Y

    // Adiciona o título "1° BPT CHOQUE Rondas Ostensivas Tobias Aguiar"
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12); // Tamanho do texto
    doc.text('1° BPT CHOQUE Rondas Ostensivas Tobias Aguiar', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Adiciona a frase abaixo do título
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12); // Tamanho do texto
    doc.text('“Nas situações mais difíceis, quando todos olham para o perigo, nós corremos em direção a ele. É esse sacrifício que define o verdadeiro espírito de um policial militar.”', 10, currentY, { maxWidth: pageWidth - 20 });
    currentY += 20;

    // Título "REQUERIMENTO"
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12); // Tamanho do título
    doc.text('REQUERIMENTO', pageWidth / 2, currentY, { align: 'center' }); // Centraliza o título
    currentY += 10;

    // Adiciona a frase sobre o requerimento
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12); // Tamanho do texto
    const requerimentoText = 'O 1° Batalhão de Rondas Ostensivas Tobias de Aguiar solicita a colaboração do Exército Brasileiro da cidade de JAGUARÉ - SP para a realização de Transporte e destinação de materiais apreendidos que se encontram sob custódia de nosso batalhão.';
    const requerimentoLines = doc.splitTextToSize(requerimentoText, pageWidth - 20); // Quebra o texto em várias linhas
    for (let line of requerimentoLines) {
        if (currentY > pageHeight - 20) { // Verifica se precisa de nova página
            doc.addPage(); // Adiciona uma nova página
            currentY = 20; // Reseta Y para o início
        }
        doc.text(line, 10, currentY); // Adiciona linha ao PDF
        currentY += 10; // Avança a posição Y
    }

    // Adiciona o conteúdo da carga
    const conteudoCarga = document.getElementById('conteudoCarga').value;
    if (conteudoCarga) {
        doc.setFont('Helvetica', 'bold'); // Define a fonte como negrito
        doc.setFontSize(12); // Tamanho da fonte do conteúdo da carga
        if (currentY > pageHeight - 20) { // Verifica se precisa de nova página
            doc.addPage(); // Adiciona uma nova página
            currentY = 20; // Reseta Y para o início
        }
        doc.text('CONTEÚDO DA CARGA:', 10, currentY); // Adiciona título ao PDF
        currentY += 10; // Avança a posição Y
        doc.setFont('Helvetica', 'normal'); // Volta para a fonte normal
        const conteudoCargaLines = doc.splitTextToSize(conteudoCarga, pageWidth - 20); // Quebra o texto em várias linhas
        for (let line of conteudoCargaLines) {
            if (currentY > pageHeight - 20) { // Verifica se precisa de nova página
                doc.addPage(); // Adiciona uma nova página
                currentY = 20; // Reseta Y para o início
            }
            doc.text(line, 10, currentY); // Adiciona linha ao PDF
            currentY += 10; // Avança a posição Y
        }
    }

    // Adiciona o peso total da carga
    const pesoCarga = document.getElementById('pesoCarga').value; // Adicionado para peso total da carga
    if (pesoCarga) {
        doc.setFont('Helvetica', 'bold'); // Define a fonte como negrito
        doc.setFontSize(12); // Tamanho da fonte igual ao conteúdo da carga
        if (currentY > pageHeight - 20) { // Verifica se precisa de nova página
            doc.addPage(); // Adiciona uma nova página
            currentY = 20; // Reseta Y para o início
        }
        doc.text(`PESO TOTAL DA CARGA: ${pesoCarga}`, 10, currentY); // Ajusta a posição para o peso total
        currentY += 10; // Avança a posição Y
    }

    // Adiciona a QUANTIA DE DINHEIRO ILICITO
    const solicitacao = document.getElementById('solicitacao').value; // Alterado para QUANTIA DE DINHEIRO ILICITO
    if (solicitacao) {
        if (currentY > pageHeight - 20) { // 
            doc.addPage(); // 
            currentY = 20; 
        }
        doc.text(`QUANTIA DE DINHEIRO ILICITO: ${solicitacao}`, 10, currentY); // Ajustar posição para a QUANTIA DE DINHEIRO ILICITO
        currentY += 10; // Avança a posição Y
    }

    // Adiciona a linha fina antes da assinatura (FALTA TROCAR FONTE PARA UMA ESTILO CANETA)
    const linhaFinalY = currentY + 5; // Altura da linha abaixo da QUANTIA DE DINHEIRO ILICITO  (Deixei 5 pra teste)
    currentY += 5; 
    doc.setLineWidth(0.5); 
    doc.setDrawColor(0, 0, 0); // 
    doc.line(margem, linhaFinalY, pageWidth - margem, linhaFinalY); // Linha no final

    // Adiciona o campo de Assinatura do Responsável
    const assinaturaResponsavel = document.getElementById('assinaturaResponsavel').value; // Captura o valor do novo campo
    if (assinaturaResponsavel) {
        currentY = linhaFinalY - 5; // Define a posição Y para a assinatura, acima da linha tava e ()5
        doc.setFont('Courier', 'normal'); // Fonte Courier para a assinatura
        doc.setFontSize(12);
        doc.text(assinaturaResponsavel, pageWidth / 2, currentY, { align: 'center' }); 
        currentY += 10; 
    }

    // Adiciona o texto "ASSINATURA DO RESPONSÁVEL" abaixo da linha
    currentY += 5; 
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12); 
    doc.text('ASSINATURA DO RESPONSÁVEL', pageWidth / 2, currentY, { align: 'center' }); // Centraliza o texto

    // Salvar o PDF
    doc.save('SECRETARIA_DE_SEGURANCA_PUBLICA_DO_ESTADO_DE_SAO_PAULO_ROTA');
}
