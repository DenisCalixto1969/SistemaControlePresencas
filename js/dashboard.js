"use strict";


function carregarModuloDashboard() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Visão Geral</h2>

                <p>
                    Acompanhe os principais indicadores do sistema.
                </p>
            </div>
        </section>


        <section class="dashboard-resumo">

        <article class="cartao dashboard-cartao dashboard-cartao-membros">

                <div class="dashboard-cartao-cabecalho">
                    👥
                </div>

                <strong
                    class="cartao-valor"
                    id="dashboard-membros-ativos"
                >
                    0
                </strong>

                <span class="cartao-titulo">
                    Membros Ativos
                </span>

            </article>


          <article class="cartao dashboard-cartao dashboard-cartao-frequencia">

                <div class="dashboard-cartao-cabecalho">
                    📅
                </div>

                <strong
                    class="cartao-valor"
                    id="dashboard-total-sessoes"
                >
                    0
                </strong>

                <span class="cartao-titulo">
                    Sessões
                </span>

            </article>


            <article class="cartao dashboard-cartao">

                <div class="dashboard-cartao-cabecalho">
                    📈
                </div>

                <strong
                    class="cartao-valor"
                    id="dashboard-frequencia-media"
                >
                    0,00%
                </strong>

                <span class="cartao-titulo">
                    Frequência Média
                </span>

            </article>

    </section>


       <article class="cartao dashboard-cartao-secundario">

    <div class="dashboard-secundario-icone">
        🏆
    </div>

    <span class="cartao-titulo">
        Melhor frequência
    </span>

    <strong
        class="dashboard-cartao-texto"
        id="dashboard-melhor-frequencia"
    >
        —
    </strong>

        </article>

    <article class="cartao dashboard-cartao-secundario">

    <div class="dashboard-secundario-icone">
        ⚠️
    </div>

    <span class="cartao-titulo">
        Abaixo de 50%
    </span>

    <strong
        class="cartao-valor"
        id="dashboard-abaixo-50"
    >
        0
    </strong>

    </article>

            <article class="cartao dashboard-cartao-secundario">

    <div class="dashboard-secundario-icone">
        🕒
    </div>

    <span class="cartao-titulo">
        Última sessão
    </span>

    <strong
        class="dashboard-cartao-texto"
        id="dashboard-ultima-sessao"
    >
        —
    </strong>

    </article>

        </section>


        <section
            class="painel dashboard-secao"
            id="dashboard-ultimas-sessoes"
        >
            <h3>Últimas sessões</h3>

            <p>Carregando...</p>
        </section>


        <section
            class="painel dashboard-secao"
            id="dashboard-ranking"
        >
            <h3>Ranking rápido</h3>

            <p>Carregando...</p>
        </section>

   <section class="painel dashboard-secao">
    <div class="dashboard-secao-cabecalho">
        <div>
            <h3>💾 Backup do sistema</h3>

            <p>
                Gere uma cópia de segurança dos dados cadastrados.
            </p>
        </div>
    </div>

    <button
        type="button"
        class="botao botao-primario"
        id="botao-exportar-backup"
    >
        Exportar Backup
    </button>

    <input
        type="file"
        id="arquivo-restaurar-backup"
        accept=".json,application/json"
    >
<button
    type="button"
    class="botao botao-perigo"
    id="botao-restaurar-backup"
>
    Restaurar Backup
</button>

<p
    id="ultimo-backup-sistema"
    class="ultimo-backup-sistema"
>
    Último backup realizado: nenhum backup registrado.
</p>

</section>

    `;
}

async function carregarDashboard() {
    console.log(
        "Dashboard carregado com sucesso."
    );

    await carregarIndicadores();
    await carregarUltimasSessoes();
    await carregarRankingRapido();
    carregarUltimoBackup();

    const botaoBackup =
        document.getElementById(
            "botao-exportar-backup"
        );

    if (botaoBackup) {
        botaoBackup.addEventListener(
            "click",
            exportarBackup
        );
    }

    const campoArquivoBackup =
        document.getElementById(
            "arquivo-restaurar-backup"
        );

    if (campoArquivoBackup) {
        campoArquivoBackup.addEventListener(
            "change",
            selecionarArquivoBackup
        );
        
    }

    const botaoRestaurarBackup =
    document.getElementById(
        "botao-restaurar-backup"
    );

if (botaoRestaurarBackup) {
    botaoRestaurarBackup.addEventListener(
        "click",
        confirmarRestauracaoBackup
    );
}
}

function carregarUltimoBackup() {
    const elemento =
        document.getElementById(
            "ultimo-backup-sistema"
        );

    if (!elemento) {
        return;
    }

    const ultimoBackup =
        localStorage.getItem(
            "ultimoBackupSistema"
        );

    if (!ultimoBackup) {
        elemento.textContent =
            "Último backup realizado: nenhum backup registrado.";

        return;
    }

    const data =
        new Date(ultimoBackup);

    const dataFormatada =
        data.toLocaleDateString(
            "pt-BR"
        );

    const horaFormatada =
        data.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    elemento.textContent =
        `Último backup realizado: ${dataFormatada} às ${horaFormatada}`;
}

async function carregarIndicadores() {
    const membros =
        await listarRegistros("membros");

    const sessoes =
        await listarRegistros("sessoes");

    const presencas =
        await listarRegistros("presencas");

    let totalAbaixo50 = 0;


    /*
     * MEMBROS ATIVOS
     */

    const membrosAtivos =
        membros.filter(
            (membro) =>
                membro.ativo === true
        ).length;

    const elementoMembros =
        document.getElementById(
            "dashboard-membros-ativos"
        );

    if (elementoMembros) {
        elementoMembros.textContent =
            membrosAtivos;
    }


    /*
     * TOTAL DE SESSÕES
     */

    const totalSessoes =
        sessoes.length;

    const elementoSessoes =
        document.getElementById(
            "dashboard-total-sessoes"
        );

    if (elementoSessoes) {
        elementoSessoes.textContent =
            totalSessoes;
    }


    /*
     * FREQUÊNCIA MÉDIA
     */

    const totalPresentes =
        presencas.filter(
            (presenca) =>
                presenca.presente === true
        ).length;

    const totalPresencas =
        presencas.length;

    const frequenciaMedia =
        totalPresencas > 0
            ? (
                totalPresentes /
                totalPresencas
            ) * 100
            : 0;

    const elementoFrequenciaMedia =
        document.getElementById(
            "dashboard-frequencia-media"
        );

    if (elementoFrequenciaMedia) {
        elementoFrequenciaMedia.textContent =
            frequenciaMedia
                .toFixed(2)
                .replace(".", ",") + "%";
    }


    /*
     * MELHOR FREQUÊNCIA
     */

    const elementoMelhorFrequencia =
        document.getElementById(
            "dashboard-melhor-frequencia"
        );

    if (
        elementoMelhorFrequencia &&
        sessoes.length > 0
    ) {
        const sessoesOrdenadas = [
            ...sessoes
        ].sort(
            (a, b) =>
                a.data.localeCompare(b.data)
        );

        const dataInicial =
            sessoesOrdenadas[0].data;

        const dataFinal =
            sessoesOrdenadas[
                sessoesOrdenadas.length - 1
            ].data;

        const membrosAtivosLista =
            membros.filter(
                (membro) =>
                    membro.ativo === true
            );

        const frequenciasMembros =
            await Promise.all(
                membrosAtivosLista.map(
                    async (membro) => {
                        const frequencia =
                            await calcularFrequenciaMembro(
                                membro,
                                dataInicial,
                                dataFinal
                            );

                        return {
                            membro,
                            frequencia
                        };
                    }
                )
            );

        const membrosComSessoes =
            frequenciasMembros.filter(
                (item) =>
                    item.frequencia.totalSessoes > 0
            );

        if (membrosComSessoes.length > 0) {
            const maiorPercentual =
                Math.max(
                    ...membrosComSessoes.map(
                        (item) =>
                            item.frequencia.percentual
                    )
                );

            const melhores =
                membrosComSessoes.filter(
                    (item) =>
                        item.frequencia.percentual ===
                        maiorPercentual
                );

const elementoAbaixo50 =
    document.getElementById(
        "dashboard-abaixo-50"
    );

    totalAbaixo50 =
    membrosComSessoes.filter(
        (item) =>
            item.frequencia.percentual < 50
    ).length;

if (elementoAbaixo50) {
    elementoAbaixo50.textContent =
        totalAbaixo50;
}    

const elementoUltimaSessao =
    document.getElementById(
        "dashboard-ultima-sessao"
    );

if (
    elementoUltimaSessao &&
    sessoes.length > 0
) {

    const ultimaSessao =
        [...sessoes].sort(
            (a, b) =>
                b.data.localeCompare(a.data)
        )[0];

    elementoUltimaSessao.innerHTML = `
        Sessão ${ultimaSessao.numero}<br>
        ${formatarData(ultimaSessao.data)}
    `;

}


            elementoMelhorFrequencia.innerHTML = `
                ${melhores
                    .map(
                        (item) =>
                            escaparHTML(
                                item.membro.nome
                            )
                    )
                    .join("<br>")}

                <br>

                <span>
                    ${maiorPercentual
                        .toFixed(2)
                        .replace(".", ",")}%
                </span>
            `;
        } else {
            elementoMelhorFrequencia.textContent =
                "—";
        }
    }

  /*
     * CONFERÊNCIA NO CONSOLE
     */

    console.log(
    "Indicadores do Dashboard:",
    {
        membrosAtivos,
        totalSessoes,
        totalPresencas,
        totalPresentes,
        frequenciaMedia,
        totalAbaixo50
    }
);
}

async function carregarRankingRapido() {
    const areaRanking =
        document.getElementById(
            "dashboard-ranking"
        );

    if (!areaRanking) {
        return;
    }

    const membros =
        await listarRegistros("membros");

    const sessoes =
        await listarRegistros("sessoes");

    const membrosAtivos =
        membros.filter(
            (membro) =>
                membro.ativo === true
        );

    if (
        membrosAtivos.length === 0 ||
        sessoes.length === 0
    ) {
        areaRanking.innerHTML = `
            <h3>Ranking rápido</h3>

            <p class="dashboard-sem-dados">
                Ainda não há dados suficientes
                para gerar o ranking.
            </p>
        `;

        return;
    }

    const sessoesOrdenadas =
        [...sessoes].sort(
            (a, b) =>
                a.data.localeCompare(b.data)
        );

    const dataInicial =
        sessoesOrdenadas[0].data;

    const dataFinal =
        sessoesOrdenadas[
            sessoesOrdenadas.length - 1
        ].data;

    const ranking =
        await Promise.all(
            membrosAtivos.map(
                async (membro) => {
                    const frequencia =
                        await calcularFrequenciaMembro(
                            membro,
                            dataInicial,
                            dataFinal
                        );

                    return {
                        membro,
                        frequencia
                    };
                }
            )
        );

    const rankingComSessoes =
        ranking.filter(
            (item) =>
                item.frequencia.totalSessoes > 0
        );

    rankingComSessoes.sort(
        (a, b) => {
            if (
                b.frequencia.percentual !==
                a.frequencia.percentual
            ) {
                return (
                    b.frequencia.percentual -
                    a.frequencia.percentual
                );
            }

            if (
                b.frequencia.totalPresentes !==
                a.frequencia.totalPresentes
            ) {
                return (
                    b.frequencia.totalPresentes -
                    a.frequencia.totalPresentes
                );
            }

            return a.membro.nome.localeCompare(
                b.membro.nome,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );
        }
    );

    rankingComSessoes.forEach(
        (item, indice) => {
            if (indice === 0) {
                item.posicao = 1;
                return;
            }

            const anterior =
                rankingComSessoes[indice - 1];

            const empate =
                item.frequencia.percentual ===
                    anterior.frequencia.percentual &&
                item.frequencia.totalPresentes ===
                    anterior.frequencia.totalPresentes;

            item.posicao =
                empate
                    ? anterior.posicao
                    : indice + 1;
        }
    );

    const primeiros =
        rankingComSessoes.filter(
            (item) =>
                item.posicao <= 3
        );

    if (primeiros.length === 0) {
        areaRanking.innerHTML = `
            <h3>Ranking rápido</h3>

            <p class="dashboard-sem-dados">
                Nenhum membro possui sessões
                permitidas no período.
            </p>
        `;

        return;
    }

    areaRanking.innerHTML = `
        <div class="dashboard-secao-cabecalho">
            <div>
                <h3>🏆 Ranking rápido</h3>

                <p>
                    ${formatarData(dataInicial)}
                    até
                    ${formatarData(dataFinal)}
                </p>
            </div>
        </div>

        <div class="dashboard-ranking-lista">

            ${primeiros
                .map((item) => {
                    const medalha =
                        item.posicao === 1
                            ? "🥇"
                            : item.posicao === 2
                                ? "🥈"
                                : "🥉";

                    const percentual =
                        item.frequencia.percentual
                            .toFixed(2)
                            .replace(".", ",");

                    return `
                        <div class="dashboard-ranking-item">

                            <div class="dashboard-ranking-posicao">
                                ${medalha}
                            </div>

                            <div class="dashboard-ranking-membro">
                                <strong>
                                    ${escaparHTML(
                                        item.membro.nome
                                    )}
                                </strong>

                                <span>
                                    ${item.posicao}º Lugar
                                </span>
                            </div>

                            <strong class="dashboard-ranking-percentual">
                                ${percentual}%
                            </strong>

                        </div>
                    `;
                })
                .join("")}

        </div>
    `;
}
  
async function carregarUltimasSessoes() {
    const areaSessoes =
        document.getElementById(
            "dashboard-ultimas-sessoes"
        );

    if (!areaSessoes) {
        return;
    }

    const sessoes =
        await listarRegistros("sessoes");

    const presencas =
        await listarRegistros("presencas");

    if (sessoes.length === 0) {
        areaSessoes.innerHTML = `
            <h3>Últimas sessões</h3>

            <p class="dashboard-sem-dados">
                Nenhuma sessão cadastrada.
            </p>
        `;

        return;
    }

    const ultimasSessoes =
        [...sessoes]
            .sort(
                (a, b) =>
                    b.data.localeCompare(a.data)
            )
            .slice(0, 3);

    const sessoesComResumo =
        ultimasSessoes.map(
            (sessao) => {
                const presencasSessao =
                    presencas.filter(
                        (presenca) =>
                            presenca.sessaoId ===
                            sessao.id
                    );

                const presentes =
                    presencasSessao.filter(
                        (presenca) =>
                            presenca.presente === true
                    ).length;

                return {
                    sessao,
                    presentes,
                    totalAptos:
                        presencasSessao.length
                };
            }
        );

    areaSessoes.innerHTML = `
        <div class="dashboard-secao-cabecalho">
            <div>
                <h3>📅 Últimas sessões</h3>

                <p>
                    As 3 sessões mais recentes
                </p>
            </div>
        </div>

        <div class="dashboard-sessoes-lista">

            ${sessoesComResumo
                .map(
                    ({
                        sessao,
                        presentes,
                        totalAptos
                    }) => {
                        return `
                            <div class="dashboard-sessao-item">

                                <div class="dashboard-sessao-principal">
                                    <strong>
                                        Sessão ${formatarNumeroSessao(
                                            sessao.numero
                                        )}
                                    </strong>

                                    <span>
                                        ${formatarData(
                                            sessao.data
                                        )}
                                    </span>
                                </div>

                                <div class="dashboard-sessao-detalhes">
                                    <span>
                                        ${escaparHTML(
                                            sessao.tipo
                                        )}
                                    </span>

                                    <span>
                               ${
                            Number(sessao.grau) === 0 ||
                          sessao.tipo === "Não Houve Sessão"
                           ? "—"
                          : `Grau ${escaparHTML(sessao.grau)}`
                             }
                             </span>
                                </div>

                                <div class="dashboard-sessao-presencas">
                                    <strong>
                                        ${presentes}
                                    </strong>

                                    <span>
                                  presentes de ${totalAptos} permitidos
                                    </span>
                                </div>

                            </div>
                        `;
                    }
                )
                .join("")}

        </div>
    `;
}
