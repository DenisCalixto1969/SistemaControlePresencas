"use strict";

function carregarModuloRelatorios() {
    return `
   
    <section class="cabecalho-pagina">
            <div>
                <h2>Relatórios</h2>

                <p>
                    Consulte os dados de frequência por período.
                </p>
            </div>
        </section>

        <section class="painel">
            <form id="formulario-relatorio">
               <div class="grade-formulario-relatorio">

    <div class="grupo-campo">
        <label for="relatorio-data-inicial">
            Data inicial
        </label>

        <input
            type="date"
            id="relatorio-data-inicial"
            required
        >
    </div>

    <div class="grupo-campo">
        <label for="relatorio-data-final">
            Data final
        </label>

        <input
            type="date"
            id="relatorio-data-final"
            required
        >
    </div>

</div>

<div class="grupo-campo">
    <label for="relatorio-membro">
        Membro
    </label>

    <select id="relatorio-membro">
        <option value="">Todos os membros</option>
    </select>
</div>

<div class="grupo-botoes">
    <button
        type="submit"
        class="botao botao-primario"
    >
        Gerar relatório
    </button>
</div>
            </form>
        </section>

        <section
            class="area-resultado-relatorio oculto"
            id="resultado-relatorio"
        >
        </section>
    `;
}

async function carregarMembrosRelatorio() {
    const select = document.querySelector(
        "#relatorio-membro"
    );

    if (!select) {
        return;
    }

    const membros = await listarRegistros(
        "membros"
    );

    membros.sort((membroA, membroB) =>
        membroA.nome.localeCompare(
            membroB.nome,
            "pt-BR",
            {
                sensitivity: "base"
            }
        )
    );

    select.innerHTML = `
        <option value="">
            Todos os membros
        </option>

        ${membros
            .map((membro) => {
                return `
                    <option value="${membro.id}">
                        ${escaparHTML(membro.nome)}
                    </option>
                `;
            })
            .join("")}
    `;
}

function inicializarModuloRelatorios() {
    const formulario = document.querySelector(
        "#formulario-relatorio"
    );

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        gerarRelatorio
    );
}

function obterDadosFormularioRelatorio() {
    const dataInicial = document.querySelector(
        "#relatorio-data-inicial"
    ).value;

    const dataFinal = document.querySelector(
        "#relatorio-data-final"
    ).value;

    const membroId = document.querySelector(
        "#relatorio-membro"
    ).value;

    return {
        dataInicial,
        dataFinal,
        membroId
    };
}

function validarDadosRelatorio(dados) {
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

async function gerarRelatorio(evento) {
    evento.preventDefault();

    const dados = obterDadosFormularioRelatorio();

    const erroValidacao =
        validarDadosRelatorio(dados);

    if (erroValidacao) {
        mostrarMensagem(
            erroValidacao,
            "erro"
        );

        return;
    }

    
    const botaoGerar = document.querySelector(
        "#formulario-relatorio button[type='submit']"
    );

    const resultado = document.querySelector(
        "#resultado-relatorio"
    );

    if (!resultado) {
        return;
    }

    botaoGerar.disabled = true;
    botaoGerar.textContent = "Gerando...";

    try {
        
        if (!dados.membroId) {
    await gerarRelatorioTodosMembros(
        dados,
        resultado
    );

    return;
}
        const membro = await buscarRegistroPorId(
            "membros",
            dados.membroId
        );

        if (!membro) {
            throw new Error(
                "O membro selecionado não foi encontrado."
            );
        }

        const frequencia =
            await calcularFrequenciaMembro(
                membro,
                dados.dataInicial,
                dados.dataFinal
            );

            const todasPresencas = await listarRegistros(
    "presencas"
);

const presencasDoMembro = todasPresencas.filter(
    (presenca) =>
        presenca.membroId === membro.id
);

const detalhesSessoes = await Promise.all(
    frequencia.sessoesPermitidas.map(
        async (sessao) => {
            const presenca = presencasDoMembro.find(
                (registro) =>
                    registro.sessaoId === sessao.id
            );

            const grauNaData =
                await buscarGrauMembroNaData(
                    membro.id,
                    sessao.data
                );

            return {
                sessao,
                grauNaData:
                    grauNaData ?? membro.grau,
                presente:
                    presenca?.presente === true
            };
        }
    )
);

        resultado.innerHTML = `
            <section class="painel">
                <div class="cabecalho-resultado-relatorio">
                    <div>
                        <h3>Relatório de frequência</h3>

                        <p>
                            <strong>Membro:</strong>
                            ${escaparHTML(membro.nome)}
                        </p>

                        <p>
                            <strong>Período:</strong>
                            ${formatarData(dados.dataInicial)}
                            até
                            ${formatarData(dados.dataFinal)}
                        </p>
                    </div>
                </div>

                <div class="resumo-relatorio-grid">
                    <article class="resumo-relatorio-card">
                        <span>Sessões permitidas</span>

                        <strong>
                            ${frequencia.totalSessoes}
                        </strong>
                    </article>

                    <article
                        class="
                            resumo-relatorio-card
                            resumo-relatorio-presente
                        "
                    >
                        <span>Presentes</span>

                        <strong>
                            ${frequencia.totalPresentes}
                        </strong>
                    </article>

                    <article
                        class="
                            resumo-relatorio-card
                            resumo-relatorio-ausente
                        "
                    >
                        <span>Ausentes</span>

                        <strong>
                            ${frequencia.totalAusentes}
                        </strong>
                    </article>

                    <article
                        class="
                            resumo-relatorio-card
                            resumo-relatorio-percentual
                        "
                    >
                        <span>Frequência</span>

                        <strong>
                            ${frequencia.percentual
                                .toFixed(2)
                                .replace(".", ",")}%
                        </strong>
                    </article>
                </div>
            
                <div class="detalhamento-relatorio">
    <h3>Detalhamento das sessões</h3>

    ${
        detalhesSessoes.length === 0
            ? `
                <p class="relatorio-sem-resultados">
                    Nenhuma sessão permitida foi encontrada
                    no período selecionado.
                </p>
            `
            : `
                <div class="tabela-responsiva">
                    <table class="tabela-relatorio">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Sessão</th>
                                <th>Tipo</th>
                                <th>Grau da sessão</th>
                                <th>Grau do membro</th>
                                <th>Presença</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${detalhesSessoes
                                .map(
                                    ({
                                        sessao,
                                        grauNaData,
                                        presente
                                    }) => {
                                        return `
                                            <tr>
                                                <td>
                                                    ${formatarData(
                                                        sessao.data
                                                    )}
                                                </td>

                                                <td>
                                                    ${formatarNumeroSessao(
                                                        sessao.numero
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        sessao.tipo
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        sessao.grau
                                                    )}
                                                </td>

                                                <td>
                                                    ${escaparHTML(
                                                        grauNaData
                                                    )}
                                                </td>

                                                <td>
                                                    <strong
                                                        class="
                                                            status-relatorio
                                                            ${
                                                                presente
                                                                    ? "status-relatorio-presente"
                                                                    : "status-relatorio-ausente"
                                                            }
                                                        "
                                                    >
                                                        ${
                                                            presente
                                                                ? "Presente"
                                                                : "Ausente"
                                                        }
                                                    </strong>
                                                </td>
                                            </tr>
                                        `;
                                    }
                                )
                                .join("")}
                        </tbody>
                    </table>
                </div>
            `
    }
</div>
    </section>
        `;
        resultado.classList.remove("oculto");

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } catch (erro) {
        console.error(
            "Erro ao gerar relatório:",
            erro
        );

        mostrarMensagem(
            "Não foi possível gerar o relatório.",
            "erro"
        );
    } finally {
        botaoGerar.disabled = false;
        botaoGerar.textContent = "Gerar relatório";
    }
}


async function gerarRelatorioTodosMembros(
    dados,
    resultado
) {
    const membros = await listarRegistros(
        "membros"
    );

    membros.sort((membroA, membroB) =>
        membroA.nome.localeCompare(
            membroB.nome,
            "pt-BR",
            {
                sensitivity: "base"
            }
        )
    );

    const frequencias = await Promise.all(
        membros.map(async (membro) => {
            const frequencia =
                await calcularFrequenciaMembro(
                    membro,
                    dados.dataInicial,
                    dados.dataFinal
                );

            return {
                membro,
                frequencia
            };
        })
    );

    resultado.innerHTML = `
        <section class="painel">
            <div class="cabecalho-resultado-relatorio">
                <div>
                    <h3>
                        Relatório geral de frequência
                    </h3>

                    <p>
                        <strong>Período:</strong>
                        ${formatarData(dados.dataInicial)}
                        até
                        ${formatarData(dados.dataFinal)}
                    </p>

                    <p>
                        <strong>Membros:</strong>
                        ${frequencias.length}
                    </p>
                </div>
            </div>

            ${
                frequencias.length === 0
                    ? `
                        <p class="relatorio-sem-resultados">
                            Nenhum membro foi encontrado.
                        </p>
                    `
                    : `
                        <div class="tabela-responsiva">
                            <table class="tabela-relatorio">
                                <thead>
                                    <tr>
                                        <th>Membro</th>
                                        <th>Sessões permitidas</th>
                                        <th>Presentes</th>
                                        <th>Ausentes</th>
                                        <th>Frequência</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    ${frequencias
                                        .map(
                                            ({
                                                membro,
                                                frequencia
                                            }) => {
                                                const percentual =
                                                    frequencia.percentual
                                                        .toFixed(2)
                                                        .replace(".", ",");

                                                 const status =
                                                   obterStatusFrequencia(
                                                   frequencia.percentual
                                            );
        
                                            return `
                                                    <tr>
                                                        <td>
                                                            <strong>
                                                                ${escaparHTML(
                                                                    membro.nome
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            ${frequencia.totalSessoes}
                                                        </td>

                                                        <td>
                                                            ${frequencia.totalPresentes}
                                                        </td>

                                                        <td>
                                                            ${frequencia.totalAusentes}
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
                                            }
                                        )
                                        .join("")}
                                </tbody>
                            </table>
                        </div>
                    `
            }
        </section>
    `;

    resultado.classList.remove("oculto");

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function obterStatusFrequencia(percentual) {

    if (percentual >= 90) {
        return {
            texto: "Excelente",
            classe: "status-frequencia-excelente"
        };
    }

    if (percentual >= 75) {
        return {
            texto: "Boa",
            classe: "status-frequencia-boa"
        };
    }

    if (percentual >= 50) {
        return {
            texto: "Atenção",
            classe: "status-frequencia-atencao"
        };
    }

    return {
        texto: "Baixa",
        classe: "status-frequencia-baixa"
    };

}