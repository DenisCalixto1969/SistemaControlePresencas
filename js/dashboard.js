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

            <article class="cartao dashboard-cartao">
                <span class="cartao-titulo">
                    Membros ativos
                </span>

                <strong
                    class="cartao-valor"
                    id="dashboard-membros-ativos"
                >
                    0
                </strong>
            </article>


            <article class="cartao dashboard-cartao">
                <span class="cartao-titulo">
                    Sessões
                </span>

                <strong
                    class="cartao-valor"
                    id="dashboard-total-sessoes"
                >
                    0
                </strong>
            </article>


            <article class="cartao dashboard-cartao">
                <span class="cartao-titulo">
                    Frequência média
                </span>

                <strong
                    class="cartao-valor"
                    id="dashboard-frequencia-media"
                >
                    0,00%
                </strong>
            </article>

        </section>


        <section class="dashboard-resumo">

            <article class="cartao dashboard-cartao">
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


            <article class="cartao dashboard-cartao">
                <span class="cartao-titulo">
                    Abaixo de 75%
                </span>

                <strong
                    class="cartao-valor"
                    id="dashboard-abaixo-75"
                >
                    0
                </strong>
            </article>


            <article class="cartao dashboard-cartao">
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
    `;
}


async function carregarDashboard() {
    console.log(
        "Dashboard carregado com sucesso."
    );

    await carregarIndicadores();
    await carregarRankingRapido();
}

async function carregarIndicadores() {
    const membros =
        await listarRegistros("membros");

    const sessoes =
        await listarRegistros("sessoes");

    const presencas =
        await listarRegistros("presencas");

    let totalAbaixo75 = 0;


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

const elementoAbaixo75 =
    document.getElementById(
        "dashboard-abaixo-75"
    );

    totalAbaixo75 =
    membrosComSessoes.filter(
        (item) =>
            item.frequencia.percentual < 75
    ).length;

if (elementoAbaixo75) {
    elementoAbaixo75.textContent =
        totalAbaixo75;
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
        totalAbaixo75
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
  