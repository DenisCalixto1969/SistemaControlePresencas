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

    const { data, error } =
        await clienteSupabase.rpc(
            "obter_indicadores_dashboard"
        );

    if (error) {
        console.error(
            "Erro ao carregar indicadores:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar os indicadores.",
            "erro"
        );

        return;
    }

    if (!data || data.length === 0) {
        console.error(
            "Nenhum indicador foi retornado."
        );
        return;
    }

    const indicadores = data[0];

    const { data: melhorPercentual, error: erroMelhor } =
    await clienteSupabase.rpc(
        "obter_melhor_percentual_dashboard"
    );

if (erroMelhor) {
    console.error(
        "Erro ao consultar melhor percentual:",
        erroMelhor
    );
}

    /*
     * MEMBROS ATIVOS
     */

    const elementoMembros =
        document.getElementById(
            "dashboard-membros-ativos"
        );

    if (elementoMembros) {
        elementoMembros.textContent =
            indicadores.total_membros_ativos;
    }

    /*
     * TOTAL DE SESSÕES ENCERRADAS
     */

    const elementoSessoes =
        document.getElementById(
            "dashboard-total-sessoes"
        );

    if (elementoSessoes) {
        elementoSessoes.textContent =
            indicadores.total_sessoes;
    }

    /*
     * FREQUÊNCIA MÉDIA
     */

    const frequenciaMedia =
        Number(indicadores.frequencia_media);

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

    if (elementoMelhorFrequencia) {
        const nomes = String(
            indicadores.melhores_frequencias || "—"
        )
            .split("\n")
            .map(nome => escaparHTML(nome))
            .join("<br>");

        elementoMelhorFrequencia.innerHTML = `
            ${nomes}
            <br>
            <span>
    ${Number(melhorPercentual ?? 0)
        .toFixed(2)
        .replace(".", ",")}%
</span>
        `;
    }

    /*
     * MEMBROS ABAIXO DE 50%
     */

    const elementoAbaixo50 =
        document.getElementById(
            "dashboard-abaixo-50"
        );

    if (elementoAbaixo50) {
        elementoAbaixo50.textContent =
            indicadores.membros_abaixo_50;
    }

    /*
     * ÚLTIMA SESSÃO ENCERRADA
     */

    const elementoUltimaSessao =
        document.getElementById(
            "dashboard-ultima-sessao"
        );

    if (
        elementoUltimaSessao &&
        indicadores.ultima_sessao_numero !== null
    ) {
        elementoUltimaSessao.innerHTML = `
            Sessão ${indicadores.ultima_sessao_numero}<br>
            ${formatarData(
                indicadores.ultima_sessao_data
            )}
        `;
    }

    /*
     * CONFERÊNCIA NO CONSOLE
     */

    console.log(
        "Indicadores do Dashboard:",
        indicadores
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

    /*
     * PERÍODO DAS SESSÕES
     */

    const sessoes =
        await listarRegistros("sessoes");

    const sessoesOrdenadas =
        [...sessoes].sort(
            (a, b) =>
                a.data.localeCompare(b.data)
        );

    if (sessoesOrdenadas.length === 0) {
        areaRanking.innerHTML = `
            <h3>Ranking rápido</h3>
            <p class="dashboard-sem-dados">
                Ainda não há dados suficientes
                para gerar o ranking.
            </p>
        `;
        return;
    }

    const dataInicial =
        sessoesOrdenadas[0].data;

    const dataFinal =
        sessoesOrdenadas[
            sessoesOrdenadas.length - 1
        ].data;

    /*
     * CONSULTA DO RANKING NO SUPABASE
     */

    const { data: dadosRanking, error } =
        await clienteSupabase.rpc(
            "obter_ranking_frequencia",
            {
                p_data_inicial: dataInicial,
                p_data_final: dataFinal
            }
        );

    if (error) {
        console.error(
            "Erro ao consultar ranking rápido:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar o ranking rápido.",
            "erro"
        );

        return;
    }

    /*
     * CONVERSÃO DOS DADOS
     */

    const ranking =
        (dadosRanking || [])
            .map(item => ({
                membro: {
                    id: item.membro_id,
                    nome: item.nome
                },

                frequencia: {
                    totalSessoes:
                        Number(item.total_sessoes),

                    totalPresentes:
                        Number(item.total_presentes),

                    totalAusentes:
                        Number(item.total_ausentes),

                    percentual:
                        Number(item.percentual)
                }
            }))
            .filter(
                item =>
                    item.frequencia.totalSessoes > 0
            );

    /*
     * CLASSIFICAÇÃO
     */

    ranking.forEach((item, indice) => {

        if (indice === 0) {
            item.posicao = 1;
            return;
        }

        const anterior =
            ranking[indice - 1];

        const empate =
            item.frequencia.percentual ===
                anterior.frequencia.percentual &&
            item.frequencia.totalPresentes ===
                anterior.frequencia.totalPresentes;

        item.posicao =
            empate
                ? anterior.posicao
                : indice + 1;
    });

    const primeiros =
        ranking.filter(
            item => item.posicao <= 3
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

    /*
     * EXIBIÇÃO DO RANKING
     */

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
                .map(item => {

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

    const { data: resumos, error } =
        await clienteSupabase.rpc(
            "obter_resumo_ultimas_sessoes"
        );

    if (error) {
        console.error(
            "Erro ao consultar resumo das sessões:",
            error
        );

        mostrarMensagem(
            "Não foi possível carregar o resumo das sessões.",
            "erro"
        );

        return;
    }

    const mapaResumos = new Map(
        (resumos || []).map(item => [
            item.sessao_id,
            item
        ])
    );

    const sessoesComResumo =
        ultimasSessoes.map(sessao => {

            const resumo =
                mapaResumos.get(sessao.id);

            return {
                sessao,
                presentes: Number(
                    resumo?.total_presentes ?? 0
                ),
                totalAptos: Number(
                    resumo?.total_aptos ?? 0
                )
            };
        });

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
                    }) => `
                        <div class="dashboard-sessao-item">

                            <div class="dashboard-sessao-principal">
                                <strong>
                                    Sessão ${formatarNumeroSessao(
                                        sessao.numero
                                    )}
                                </strong>

                                <span>
                                    ${formatarData(sessao.data)}
                                </span>
                            </div>

                            <div class="dashboard-sessao-detalhes">
                                <span>
                                    ${escaparHTML(sessao.tipo)}
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
                    `
                )
                .join("")}

        </div>
    `;
}