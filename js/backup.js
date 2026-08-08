"use strict";

async function exportarBackup() {
    try {
        const membros =
            await listarRegistros("membros");

        const sessoes =
            await listarRegistros("sessoes");

        const presencas =
            await listarRegistros("presencas");

        const historicoGraus =
            await listarRegistros("historicoGraus");

        const backup = {
            sistema: "Sistema Controle Presenças",

            versaoBackup: 1,

            dataBackup:
                new Date().toISOString(),

            dados: {
                membros,
                sessoes,
                presencas,
                historicoGraus
            }
        };

        const conteudoJSON =
            JSON.stringify(
                backup,
                null,
                2
            );

        const arquivo =
            new Blob(
                [conteudoJSON],
                {
                    type: "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                arquivo
            );

        const link =
            document.createElement("a");

        const dataAtual =
            new Date()
                .toISOString()
                .slice(0, 10);

        link.href = url;

        link.download =
            `backup-sistema-presencas-${dataAtual}.json`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

        mostrarMensagem(
            "Backup exportado com sucesso.",
            "sucesso"
        );

        console.log(
            "Backup exportado:",
            backup
        );

    } catch (erro) {
        console.error(
            "Erro ao exportar backup:",
            erro
        );

        mostrarMensagem(
            "Não foi possível exportar o backup.",
            "erro"
        );
    }
}