"use strict";

function carregarModuloPresencas() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Presenças</h2>

                <p>
                    Consulte o histórico de presenças dos membros.
                </p>
            </div>
        </section>

        <section class="painel">
            <div class="presencas-filtros">

                <div class="campo-formulario">
                    <label for="presencas-data-inicial">
                        Data inicial
                    </label>

                    <input
                        type="date"
                        id="presencas-data-inicial"
                    >
                </div>

                <div class="campo-formulario">
                    <label for="presencas-data-final">
                        Data final
                    </label>

                    <input
                        type="date"
                        id="presencas-data-final"
                    >
                </div>

                <div class="campo-formulario">
                    <label for="presencas-membro">
                        Membro
                    </label>

                    <select id="presencas-membro">
                        <option value="">
                            Todos os membros
                        </option>
                    </select>
                </div>

                <div class="presencas-filtros-acoes">
                    <button
                        type="button"
                        class="botao-primario"
                        id="botao-consultar-presencas"
                    >
                        Consultar
                    </button>
                </div>

            </div>
        </section>

        <section
            class="painel"
            id="resultado-presencas"
        >
            <p>
                Informe os filtros e clique em
                <strong>Consultar</strong>.
            </p>
        </section>
    `;
}


async function inicializarModuloPresencas() {
    await carregarMembrosFiltroPresencas();

    const botaoConsultar =
        document.querySelector(
            "#botao-consultar-presencas"
        );

    if (botaoConsultar) {
        botaoConsultar.addEventListener(
            "click",
            consultarPresencas
        );
    }

    console.log(
        "Módulo Presenças inicializado."
    );
}

async function carregarMembrosFiltroPresencas() {
    const campoMembro = document.querySelector(
        "#presencas-membro"
    );

    if (!campoMembro) {
        return;
    }

    const membros = await listarRegistros("membros");

    const membrosOrdenados = membros
        .filter((membro) => membro.ativo)
        .sort((a, b) =>
            a.nome.localeCompare(
                b.nome,
                "pt-BR"
            )
        );

    campoMembro.innerHTML = `
        <option value="">
            Todos os membros
        </option>

        ${membrosOrdenados
            .map((membro) => `
                <option value="${membro.id}">
                    ${escaparHTML(membro.nome)}
                </option>
            `)
            .join("")}
    `;
}

async function consultarPresencas() {
    const dataInicial =
        document.querySelector(
            "#presencas-data-inicial"
        ).value;

    const dataFinal =
        document.querySelector(
            "#presencas-data-final"
        ).value;

    const membroId =
        document.querySelector(
            "#presencas-membro"
        ).value;

    const areaResultado =
        document.querySelector(
            "#resultado-presencas"
        );

    if (!areaResultado) {
        return;
    }

    const sessoes =
        await listarRegistros("sessoes");

    const sessoesFiltradas = sessoes
        .filter((sessao) => {
            if (
                sessao.tipo ===
                "Não Houve Sessão"
            ) {
                return false;
            }

            if (
                dataInicial &&
                sessao.data < dataInicial
            ) {
                return false;
            }

            if (
                dataFinal &&
                sessao.data > dataFinal
            ) {
                return false;
            }

            return true;
        })
        .sort(
            (a, b) =>
                b.data.localeCompare(a.data)
        );

    console.log(
        "Consulta de presenças:",
        {
            dataInicial,
            dataFinal,
            membroId,
            sessoesEncontradas:
                sessoesFiltradas.length
        }
    );

    const todasPresencas =
    await listarRegistros("presencas");

const membros =
    await listarRegistros("membros");

const sessoesComPresencas =
    sessoesFiltradas.map((sessao) => {
        const presencasSessao =
            todasPresencas.filter(
                (presenca) =>
                    presenca.sessaoId === sessao.id &&
                    (
                        !membroId ||
                        String(presenca.membroId) ===
                            String(membroId)
                    )
            );

        const itens =
            presencasSessao.map(
                (presenca) => {
                    const membro =
                        membros.find(
                            (item) =>
                                item.id ===
                                presenca.membroId
                        );

                    return {
                        presenca,
                        membro
                    };
                }
            )
            .filter(
                (item) => item.membro
            )
            .sort(
                (a, b) =>
                    a.membro.nome.localeCompare(
                        b.membro.nome,
                        "pt-BR"
                    )
            );

        return {
            sessao,
            itens
        };
    })
    .filter(
        (item) =>
            !membroId ||
            item.itens.length > 0
    );

areaResultado.innerHTML = `
    <h3>Resultado da consulta</h3>

    <p>
        ${sessoesComPresencas.length}
        ${
            sessoesComPresencas.length === 1
                ? "sessão encontrada"
                : "sessões encontradas"
        }.
    </p>

    ${
        sessoesComPresencas.length === 0
            ? `
                <p>
                    Nenhuma presença encontrada
                    para os filtros informados.
                </p>
            `
            : sessoesComPresencas
                .map(({ sessao, itens }) => {
                    return `
                        <div class="presencas-sessao">

                            <div class="presencas-sessao-cabecalho">
                                <strong>
                                    Sessão ${formatarNumeroSessao(
                                        sessao.numero
                                    )}
                                </strong>

                                <span>
                                    ${formatarData(sessao.data)}
                                    • Grau ${sessao.grau}
                                    • ${escaparHTML(sessao.tipo)}
                                </span>
                            </div>

                            <div class="presencas-lista">

                                ${itens
                                    .map(({ presenca, membro }) => {
                                        return `
                                            <div class="presencas-item">

                                                <span>
                                                    ${escaparHTML(
                                                        membro.nome
                                                    )}
                                                </span>

                                                <strong
                                                    class="${
                                                        presenca.presente
                                                            ? "estado-presente"
                                                            : "estado-ausente"
                                                    }"
                                                >
                                                    ${
                                                        presenca.presente
                                                            ? "Presente"
                                                            : "Ausente"
                                                    }
                                                </strong>

                                            </div>
                                        `;
                                    })
                                    .join("")}

                            </div>

                        </div>
                    `;
                })
                .join("")
    }
`;
}