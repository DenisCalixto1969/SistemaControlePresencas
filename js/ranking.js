"use strict";

function carregarModuloRanking() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Ranking</h2>

                <p>
                    Consulte a classificação de frequência dos membros
                    por período.
                </p>
            </div>
        </section>

        <section class="painel">
            <form id="formulario-ranking">
                <div class="grade-formulario-relatorio">
                    <div class="grupo-campo">
                        <label for="ranking-data-inicial">
                            Data inicial
                        </label>

                        <input
                            type="date"
                            id="ranking-data-inicial"
                            required
                        >
                    </div>

                    <div class="grupo-campo">
                        <label for="ranking-data-final">
                            Data final
                        </label>

                        <input
                            type="date"
                            id="ranking-data-final"
                            required
                        >
                    </div>
                </div>

                <div class="grupo-botoes">
                    <button
                        type="submit"
                        class="botao botao-primario"
                        id="botao-gerar-ranking"
                    >
                        Gerar ranking
                    </button>
                </div>
            </form>
        </section>

        <section
            class="area-resultado-ranking oculto"
            id="resultado-ranking"
        >
        </section>
    `;
}

function inicializarModuloRanking() {
    const formulario = document.querySelector(
        "#formulario-ranking"
    );

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        gerarRanking
    );
}

function obterDadosFormularioRanking() {
    const dataInicial = document.querySelector(
        "#ranking-data-inicial"
    ).value;

    const dataFinal = document.querySelector(
        "#ranking-data-final"
    ).value;

    return {
        dataInicial,
        dataFinal
    };
}

function validarDadosRanking(dados) {
    if (!dados.dataInicial) {
        return "Informe a data inicial.";
    }

    if (!dados.dataFinal) {
        return "Informe a data final.";
    }

    if (dados.dataInicial > dados.dataFinal) {
        return (
            "A data inicial não pode ser posterior " +
            "à data final."
        );
    }

    return null;
}

async function gerarRanking(evento) {
    evento.preventDefault();

    const dados = obterDadosFormularioRanking();
    const erroValidacao =
        validarDadosRanking(dados);

    if (erroValidacao) {
        mostrarMensagem(
            erroValidacao,
            "erro"
        );

        return;
    }

    const resultado = document.querySelector(
        "#resultado-ranking"
    );

    if (!resultado) {
        return;
    }

    const membros = await listarRegistros(
    "membros"
);

membros.sort((a, b) =>
    a.nome.localeCompare(
        b.nome,
        "pt-BR",
        {
            sensitivity: "base"
        }
    )
);

const { data: dadosRanking, error } =
    await clienteSupabase.rpc(
        "obter_ranking_frequencia",
        {
            p_data_inicial: dados.dataInicial,
            p_data_final: dados.dataFinal
        }
    );

if (error) {
    console.error(
        "Erro ao consultar ranking:",
        error
    );

    mostrarMensagem(
        "Não foi possível carregar o ranking.",
        "erro"
    );

    return;
}

const ranking = (dadosRanking || []).map(item => ({
    membro: {
        id: item.membro_id,
        nome: item.nome
    },

    frequencia: {
        totalSessoes: Number(item.total_sessoes),
        totalPresentes: Number(item.total_presentes),
        totalAusentes: Number(item.total_ausentes),
        percentual: Number(item.percentual)
    }
}));


ranking.sort((a, b) => {

    // 1º critério: maior percentual
    if (b.frequencia.percentual !== a.frequencia.percentual) {
        return b.frequencia.percentual - a.frequencia.percentual;
    }

    // 2º critério: maior número de sessões permitidas
    if (b.frequencia.totalSessoes !== a.frequencia.totalSessoes) {
        return b.frequencia.totalSessoes - a.frequencia.totalSessoes;
    }

    // 3º critério: maior número de presenças
    if (b.frequencia.totalPresentes !== a.frequencia.totalPresentes) {
        return b.frequencia.totalPresentes - a.frequencia.totalPresentes;
    }

    // 4º critério: ordem alfabética
    return a.membro.nome.localeCompare(
        b.membro.nome,
        "pt-BR",
        { sensitivity: "base" }
    );
});

// Posição conforme a classificação final
ranking.forEach((item, indice) => {
    item.posicao = indice + 1;
});

// Definir os membros visíveis conforme o perfil
const rankingExibido =
    perfilUsuarioAtual === "membro"
        ? ranking.filter(
            item => item.frequencia.percentual === 100
        )
        : ranking;

/*const primeiro = ranking[0];
const segundo = ranking[1];
const terceiro = ranking[2];*/


resultado.innerHTML = `
<section class="painel painel-ranking">

    <div class="cabecalho-resultado-ranking">

        <h3>
            🏆 Ranking de Frequência
        </h3>

        <p>
            Período:
            ${formatarData(dados.dataInicial)}
            até
            ${formatarData(dados.dataFinal)}
        </p>

        <p>
            <strong>Membros classificados:</strong>
          ${rankingExibido.length}
        </p>

        ${perfilUsuarioAtual === "membro" ? `
    
    <p class="aviso-ranking-membro">
    
    ℹ️ Este ranking apresenta somente os membros
        com 100% de frequência no período consultado.
        Critério: nº Sessões e ordem alfabética.

    </p>
` : ""}

    </div>

   <div class="podio-ranking">

  ${rankingExibido
    .filter(
        item =>
            perfilUsuarioAtual === "membro" ||
            item.posicao <= 3
    )
        .map((item) => {

         const medalha =
    item.frequencia.percentual === 100 ? "🥇" : "";

            return criarCartaoPodio(
                item,
                item.posicao,
                medalha
            );
        })
        .join("")}

</div>

<div class="detalhamento-ranking">
    <h3>Classificação completa</h3>

    ${
        ranking.length === 0
            ? `
                <p class="relatorio-sem-resultados">
                    Nenhum membro foi encontrado para o período.
                </p>
            `
            : `
                <div class="tabela-responsiva">
                    <table class="tabela-relatorio">
                        <thead>
                            <tr>
                                <th>Posição</th>
                                <th>Membro</th>
                                <th>Sessões permitidas</th>
                                <th>Presenças</th>
                                <th>Ausências</th>
                                <th>Frequência</th>
                            </tr>
                        </thead>

                        <tbody>
                           ${rankingExibido
                           .map((item, indice) => {
                                   const posicao =
                                   item.posicao;
                                    const percentual =
                                        item.frequencia.percentual
                                            .toFixed(2)
                                            .replace(".", ",");

                                    const status =
                                        obterStatusFrequencia(
                                            item.frequencia.percentual
                                        );

                                  const medalha =
    item.frequencia.percentual === 100 ? "🥇" : "";

                                    return `
                                        <tr
                                            class="
                                                linha-ranking
                                                linha-ranking-${posicao}
                                            "
                                        >
                                            <td>
                                                <strong>

                                             ${medalha} ${posicao}

                                                </strong>
                                            </td>

                                            <td>
                                                <strong>
                                                    ${escaparHTML(
                                                        item.membro.nome
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                ${item.frequencia.totalSessoes}
                                            </td>

                                            <td>
                                                ${item.frequencia.totalPresentes}
                                            </td>

                                            <td>
                                                ${item.frequencia.totalAusentes}
                                            </td>

                                            <td>
                                                <strong>
                                                    ${percentual}%
                                                </strong>

                                                <br>

                                                <span class="${status.classe}">
                                                    ${status.texto}
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                })
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `
    }
</div>

<p class="criterios-ranking">
    Critérios de classificação:
    frequência, quantidade de presenças
    e ordem alfabética.
</p>

</section>  `;
resultado.classList.remove("oculto");

resultado.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

}

function criarCartaoPodio(
    item,
    posicao,
    medalha
) {
    const percentual =
        item.frequencia.percentual
            .toFixed(2)
            .replace(".", ",");

    const status =
        obterStatusFrequencia(
            item.frequencia.percentual
        );

    return `
        <article
            class="
                cartao-podio
                cartao-podio-${posicao}
            "
        >
            <span class="medalha-podio">
                ${medalha}
            </span>

            <span class="posicao-podio">
               ${posicao}
            </span>

            <strong class="nome-podio">
                ${escaparHTML(item.membro.nome)}
            </strong>

            <span class="percentual-podio">
                ${percentual}%
            </span>

            <span class="${status.classe}">
                ${status.texto}
            </span>
        </article>
    `;
}
