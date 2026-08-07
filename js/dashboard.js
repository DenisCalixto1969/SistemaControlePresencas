"use strict";

async function carregarDashboard() {
    await carregarIndicadores();
    await carregarUltimasSessoes();
    await carregarRankingRapido();
}

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

    const membros =
        await listarRegistros("membros");

    const membrosAtivos =
        membros.filter(
            (membro) => membro.ativo
        ).length;

    document.getElementById(
        "dashboard-membros"
    ).textContent = membrosAtivos;

    const sessoes =
        await listarRegistros("sessoes");

    document.getElementById(
        "dashboard-sessoes"
    ).textContent =
        sessoes.length;

    const presencas =
        await listarRegistros("presencas");

    const totalPresentes =
        presencas.filter(
            (p) => p.presente
        ).length;

    document.getElementById(
        "dashboard-presencas"
    ).textContent =
        totalPresentes;

}

async function carregarIndicadores() {
    const membros = await listarRegistros(
        "membros"
    );

    const sessoes = await listarRegistros(
        "sessoes"
    );

    const presencas = await listarRegistros(
        "presencas"
    );

    const membrosAtivos = membros.filter(
        (membro) => membro.ativo === true
    ).length;

    const totalSessoes = sessoes.length;

    const totalPresentes = presencas.filter(
        (presenca) => presenca.presente === true
    ).length;

    const elementoMembros = document.querySelector(
        "#dashboard-membros-ativos"
    );

    const elementoSessoes = document.querySelector(
        "#dashboard-total-sessoes"
    );

    if (elementoMembros) {
        elementoMembros.textContent =
            membrosAtivos;
    }

    if (elementoSessoes) {
        elementoSessoes.textContent =
            totalSessoes;
    }

    console.log(
        "Indicadores do Dashboard:",
        {
            membrosAtivos,
            totalSessoes,
            totalPresentes
        }
    );
}