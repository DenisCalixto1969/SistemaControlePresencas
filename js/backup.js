"use strict";
let backupSelecionado = null;

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


async function validarArquivoBackup(arquivo) {
    try {
        const texto =
            await arquivo.text();

        const backup =
            JSON.parse(texto);

        if (
            !backup ||
            backup.sistema !==
                "Sistema Controle Presenças"
        ) {
            throw new Error(
                "Arquivo não pertence ao sistema."
            );
        }

        if (
            !backup.dados ||
            !Array.isArray(backup.dados.membros) ||
            !Array.isArray(backup.dados.sessoes) ||
            !Array.isArray(backup.dados.presencas) ||
            !Array.isArray(backup.dados.historicoGraus)
        ) {
            throw new Error(
                "Estrutura do backup inválida."
            );
        }

        console.log(
            "Backup validado com sucesso:",
            backup
        );

        return backup;

    } catch (erro) {
        console.error(
            "Erro ao validar backup:",
            erro
        );

        throw erro;
    }
}

async function selecionarArquivoBackup(evento) {
    const arquivo =
        evento.target.files[0];

    if (!arquivo) {
        return;
    }

    try {
        const backup =
            await validarArquivoBackup(
                arquivo
            );

            backupSelecionado = backup;

        const totalMembros =
            backup.dados.membros.length;

        const totalSessoes =
            backup.dados.sessoes.length;

        const totalPresencas =
            backup.dados.presencas.length;

        const totalHistoricoGraus =
            backup.dados.historicoGraus.length;

        mostrarMensagem(
    `Backup válido: ${totalMembros} membros, ${totalSessoes} sessões, ${totalPresencas} presenças e ${totalHistoricoGraus} registros de histórico de graus. Confirme a restauração para continuar.`,
    "sucesso"
);

        console.log(
            "Resumo do backup:",
            {
                totalMembros,
                totalSessoes,
                totalPresencas,
                totalHistoricoGraus
            }
        );

    } catch (erro) {
        mostrarMensagem(
            "O arquivo selecionado não é um backup válido do sistema.",
            "erro"
        );
    } finally {
        evento.target.value = "";
    }
}

function confirmarRestauracaoBackup() {
    if (!backupSelecionado) {
        mostrarMensagem(
            "Selecione primeiro um arquivo de backup válido.",
            "erro"
        );

        return;
    }

    const totalMembros =
        backupSelecionado.dados.membros.length;

    const totalSessoes =
        backupSelecionado.dados.sessoes.length;

    const totalPresencas =
        backupSelecionado.dados.presencas.length;

    const totalHistoricoGraus =
        backupSelecionado.dados.historicoGraus.length;

    const confirmar = window.confirm(
        `ATENÇÃO!\n\n` +
        `A restauração substituirá os dados atuais do sistema.\n\n` +
        `Backup selecionado:\n` +
        `• ${totalMembros} membros\n` +
        `• ${totalSessoes} sessões\n` +
        `• ${totalPresencas} presenças\n` +
        `• ${totalHistoricoGraus} registros de histórico de graus\n\n` +
        `Deseja continuar?`
    );

    if (!confirmar) {
        mostrarMensagem(
            "Restauração cancelada.",
            "sucesso"
        );

        return;
    }

    mostrarMensagem(
        "Confirmação recebida. A restauração ainda não foi executada.",
        "sucesso"
    );

    console.log(
        "Backup confirmado para futura restauração:",
        backupSelecionado
    );
}
