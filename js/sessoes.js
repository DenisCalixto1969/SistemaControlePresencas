"use strict";

let sessoesCarregadas = [];
let sessaoEmEdicaoId = null;
let sessaoEmExclusaoId = null;

function carregarModuloSessoes() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Sessões</h2>

                <p>
                    Cadastre e consulte as sessões realizadas.
                </p>
            </div>

            <button
                type="button"
                class="botao-primario"
                id="botao-nova-sessao"
            >
                + Nova sessão
            </button>
        </section>

        <section class="barra-ferramentas">
            <div class="campo-pesquisa">
                <label for="pesquisa-sessao">
                    Pesquisar
                </label>

                <input
                    type="search"
                    id="pesquisa-sessao"
                    placeholder="Digite o número ou a data"
                    autocomplete="off"
                >
            </div>

            <div class="contador-registros">
                <span id="quantidade-sessoes">
                    0 sessões
                </span>
            </div>
        </section>

        <section class="painel painel-listagem">
            <div class="lista-cabecalho lista-sessoes-grid">
                <span>Nº</span>
                <span>Data</span>
                <span>Grau</span>
                <span>Tipo</span>
                <span>Ações</span>
            </div>

            <div id="lista-sessoes" class="lista-corpo">
                <div class="estado-lista">
                    Carregando sessões...
                </div>
            </div>
        </section>

       ${criarModalSessao()}
${criarModalExclusaoSessao()}
`;
}

function criarModalSessao() {
    const opcoesGraus = CONFIG.grausSessoes
        .map((grau) => {
            return `
                <option value="${grau}">
                    Grau ${grau}
                </option>
            `;
        })
        .join("");

    const opcoesTipos = CONFIG.tiposSessao
        .map((tipo) => {
            return `
                <option value="${escaparHTML(tipo)}">
                    ${escaparHTML(tipo)}
                </option>
            `;
        })
        .join("");

    return `
        <div
            class="modal-fundo oculto"
            id="modal-sessao"
            aria-hidden="true"
        >
            <section
                class="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-sessao"
            >
                <header class="modal-cabecalho">
                    <div>
                        <h3 id="titulo-modal-sessao">
                            Nova sessão
                        </h3>

                        <p>
                            Preencha os dados da sessão.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="botao-fechar-modal"
                        id="botao-fechar-modal-sessao"
                        aria-label="Fechar formulário"
                    >
                        ×
                    </button>
                </header>

                <form id="formulario-sessao">
                    <div class="formulario-grid">
                        <div class="grupo-campo">
                            <label for="sessao-numero">
                                Número
                            </label>

                            <input
                                type="text"
                                id="sessao-numero"
                                readonly
                            >
                        </div>

                        <div class="grupo-campo">
                            <label for="sessao-data">
                                Data
                                <span class="obrigatorio">*</span>
                            </label>

                            <input
                                type="date"
                                id="sessao-data"
                                required
                            >
                        </div>

                        <div class="grupo-campo">
                            <label for="sessao-grau">
                                Grau
                                <span class="obrigatorio">*</span>
                            </label>

                            <select id="sessao-grau" required>
                                ${opcoesGraus}
                            </select>
                        </div>

                        <div class="grupo-campo">
                            <label for="sessao-tipo">
                                Tipo
                                <span class="obrigatorio">*</span>
                            </label>

                            <select id="sessao-tipo" required>
                                ${opcoesTipos}
                            </select>
                        </div>

                        <div class="grupo-campo campo-largura-total">
                            <label for="sessao-observacoes">
                                Observações
                            </label>

                            <textarea
                                id="sessao-observacoes"
                                rows="4"
                                maxlength="1000"
                            ></textarea>
                        </div>
                    </div>

                    <p
                        class="mensagem-formulario oculto"
                        id="mensagem-formulario-sessao"
                    ></p>

                    <footer class="modal-acoes">
                        <button
                            type="button"
                            class="botao-secundario"
                            id="botao-cancelar-sessao"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="botao-primario"
                            id="botao-salvar-sessao"
                        >
                            Salvar sessão
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    `;
}

function criarModalExclusaoSessao() {
    return `
        <div
            class="modal-fundo oculto"
            id="modal-exclusao-sessao"
            aria-hidden="true"
        >
            <section
                class="modal modal-confirmacao"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-exclusao-sessao"
            >
                <header class="modal-cabecalho">
                    <div>
                        <h3 id="titulo-exclusao-sessao">
                            Excluir sessão
                        </h3>

                        <p>
                            Esta ação não poderá ser desfeita.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="botao-fechar-modal"
                        id="botao-fechar-exclusao-sessao"
                        aria-label="Fechar confirmação"
                    >
                        ×
                    </button>
                </header>

                <div class="modal-confirmacao-conteudo">
                    <p id="texto-exclusao-sessao">
                        Deseja realmente excluir esta sessão?
                    </p>

                    <p class="aviso-exclusao-sessao">
                        A lista de presença vinculada também será excluída.
                    </p>

                    <footer class="modal-acoes">
                        <button
                            type="button"
                            class="botao-secundario"
                            id="botao-cancelar-exclusao-sessao"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            id="botao-confirmar-exclusao-sessao"
                        >
                            Excluir sessão
                        </button>
                    </footer>
                </div>
            </section>
        </div>
    `;
}



async function inicializarModuloSessoes() {
    configurarEventosSessoes();
    await carregarSessoes();
}

function configurarEventosSessoes() {
    const botaoNovaSessao = document.querySelector(
        "#botao-nova-sessao"
    );

    const botaoFechar = document.querySelector(
        "#botao-fechar-modal-sessao"
    );

    const botaoCancelar = document.querySelector(
        "#botao-cancelar-sessao"
    );

    const formulario = document.querySelector(
        "#formulario-sessao"
    );

    const campoPesquisa = document.querySelector(
        "#pesquisa-sessao"
    );

    const modal = document.querySelector("#modal-sessao");
    const listaSessoes = document.querySelector("#lista-sessoes");

    const modalExclusao = document.querySelector(
    "#modal-exclusao-sessao"
);

const botaoFecharExclusao = document.querySelector(
    "#botao-fechar-exclusao-sessao"
);

const botaoCancelarExclusao = document.querySelector(
    "#botao-cancelar-exclusao-sessao"
);

const botaoConfirmarExclusao = document.querySelector(
    "#botao-confirmar-exclusao-sessao"
);

    botaoNovaSessao.addEventListener(
        "click",
        abrirModalNovaSessao
    );

    botaoFechar.addEventListener(
        "click",
        fecharModalSessao
    );

    botaoCancelar.addEventListener(
        "click",
        fecharModalSessao
    );

    formulario.addEventListener(
        "submit",
        salvarSessao
    );

    campoPesquisa.addEventListener("input", () => {
        filtrarSessoes(campoPesquisa.value);
    });
    listaSessoes.addEventListener(
    "click",
    tratarAcaoSessao
);

    modal.addEventListener("click", (evento) => {
        if (evento.target === modal) {
            fecharModalSessao();
        }
    });


botaoFecharExclusao.addEventListener(
    "click",
    fecharModalExclusaoSessao
);

botaoCancelarExclusao.addEventListener(
    "click",
    fecharModalExclusaoSessao
);

botaoConfirmarExclusao.addEventListener(
    "click",
    confirmarExclusaoSessao
);

modalExclusao.addEventListener("click", (evento) => {
    if (evento.target === modalExclusao) {
        fecharModalExclusaoSessao();
    }
});

}


async function abrirModalNovaSessao() {
    sessaoEmEdicaoId = null;

    const formulario = document.querySelector(
        "#formulario-sessao"
    );

    const mensagem = document.querySelector(
        "#mensagem-formulario-sessao"
    );

    formulario.reset();

    mensagem.textContent = "";
    mensagem.classList.add("oculto");

    document.querySelector(
        "#titulo-modal-sessao"
    ).textContent = "Nova sessão";

    document.querySelector(
        "#botao-salvar-sessao"
    ).textContent = "Salvar sessão";

    const proximoNumero = calcularProximoNumeroSessao();

    document.querySelector(
        "#sessao-numero"
    ).value = formatarNumeroSessao(proximoNumero);

    const campoGrau = document.querySelector("#sessao-grau");

    campoGrau.disabled = false;
    campoGrau.value = CONFIG.grausSessoes[0];

    document.querySelector(
        "#sessao-tipo"
    ).value = CONFIG.tiposSessao[0];

    const modal = document.querySelector("#modal-sessao");

    modal.classList.remove("oculto");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-aberto");

    window.setTimeout(() => {
        document.querySelector("#sessao-data").focus();
    }, 50);
}

async function abrirModalEditarSessao(id) {
    try {
        const sessao = await buscarRegistroPorId(
            "sessoes",
            id
        );

        if (!sessao) {
            mostrarMensagem(
                "A sessão selecionada não foi encontrada.",
                "erro"
            );

            return;
        }

        sessaoEmEdicaoId = id;

        document.querySelector(
            "#titulo-modal-sessao"
        ).textContent = "Editar sessão";

        document.querySelector(
            "#botao-salvar-sessao"
        ).textContent = "Salvar alterações";

        document.querySelector(
            "#sessao-numero"
        ).value = formatarNumeroSessao(sessao.numero);

        document.querySelector(
            "#sessao-data"
        ).value = sessao.data;

        const campoGrau = document.querySelector("#sessao-grau");

        campoGrau.value = sessao.grau;
        campoGrau.disabled = true;

        document.querySelector(
            "#sessao-tipo"
        ).value = sessao.tipo;

        document.querySelector(
            "#sessao-observacoes"
        ).value = sessao.observacoes || "";

        const mensagem = document.querySelector(
            "#mensagem-formulario-sessao"
        );

        mensagem.textContent = "";
        mensagem.classList.add("oculto");

        const modal = document.querySelector("#modal-sessao");

        modal.classList.remove("oculto");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-aberto");

        window.setTimeout(() => {
            document.querySelector("#sessao-data").focus();
        }, 50);
    } catch (erro) {
        console.error("Erro ao abrir edição da sessão:", erro);

        mostrarMensagem(
            "Não foi possível abrir a sessão para edição.",
            "erro"
        );
    }
}



function fecharModalSessao() {
    const modal = document.querySelector("#modal-sessao");

    modal.classList.add("oculto");
    modal.setAttribute("aria-hidden", "true");

    document.querySelector("#sessao-grau").disabled = false;

    sessaoEmEdicaoId = null;

    document.body.classList.remove("modal-aberto");
}

function calcularProximoNumeroSessao() {
    if (sessoesCarregadas.length === 0) {
        return 1;
    }

    const maiorNumero = Math.max(
        ...sessoesCarregadas.map((sessao) => {
            return Number(sessao.numero) || 0;
        })
    );

    return maiorNumero + 1;
}

function membroPodeParticiparDaSessao(membro, sessao) {
    const membroAtivo = membro.ativo === true;
    const grauMembro = Number(membro.grau);
    const grauSessao = Number(sessao.grau);

    return membroAtivo && grauMembro >= grauSessao;
}

async function gerarPresencasDaSessao(sessao) {
    const membros = await listarRegistros("membros");

    const membrosAptos = membros.filter((membro) => {
        return membroPodeParticiparDaSessao(
            membro,
            sessao
        );
    });

    return membrosAptos.map((membro) => {
        return new Presenca({
            sessaoId: sessao.id,
            membroId: membro.id,
            presente: false
        });
    });
}

async function salvarSessao(evento) {
    evento.preventDefault();

    const dados = obterDadosFormularioSessao();
    const erroValidacao = validarDadosSessao(dados);

    if (erroValidacao) {
        mostrarErroFormularioSessao(erroValidacao);
        return;
    }

    const botaoSalvar = document.querySelector(
        "#botao-salvar-sessao"
    );

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = "Salvando...";

    try {
        const dataJaCadastrada =
            await verificarDataSessaoExistente(
                dados.data,
                sessaoEmEdicaoId
            );

        if (dataJaCadastrada) {
            mostrarErroFormularioSessao(
                "Já existe uma sessão cadastrada para esta data."
            );

            return;
        }

        if (sessaoEmEdicaoId) {
            await atualizarSessaoExistente(dados);

            fecharModalSessao();
            await carregarSessoes();

            mostrarMensagem(
                "Sessão atualizada com sucesso.",
                "sucesso"
            );

            return;
        }

        const novaSessao = new Sessao({
            ...dados,
            numero: calcularProximoNumeroSessao(),
            status: "Aberta"
        });

        const presencas = await gerarPresencasDaSessao(
            novaSessao
        );

        await adicionarSessaoComPresencas(
            novaSessao,
            presencas
        );

        fecharModalSessao();
        await carregarSessoes();

        mostrarMensagem(
            `Sessão cadastrada com sucesso. ${presencas.length} membros aptos foram incluídos.`,
            "sucesso"
        );
    } catch (erro) {
        console.error("Erro ao salvar sessão:", erro);

        mostrarErroFormularioSessao(
            "Não foi possível salvar a sessão."
        );
    } finally {
        botaoSalvar.disabled = false;

        botaoSalvar.textContent = sessaoEmEdicaoId
            ? "Salvar alterações"
            : "Salvar sessão";
    }
}

async function atualizarSessaoExistente(dados) {
    const sessaoAtual = await buscarRegistroPorId(
        "sessoes",
        sessaoEmEdicaoId
    );

    if (!sessaoAtual) {
        throw new Error("Sessão não encontrada.");
    }

    const sessaoAtualizada = new Sessao({
        ...sessaoAtual,

        data: dados.data,
        tipo: dados.tipo,
        observacoes: dados.observacoes,

        id: sessaoAtual.id,
        numero: sessaoAtual.numero,
        grau: sessaoAtual.grau,
        status: sessaoAtual.status || "Aberta",

        dataCadastro: sessaoAtual.dataCadastro,

        dataUltimaAlteracao: new Date().toISOString()
    });

    await atualizarRegistro(
        "sessoes",
        sessaoAtualizada
    );
}



function obterDadosFormularioSessao() {
    return {
        data: document.querySelector("#sessao-data").value,

        grau: Number(
            document.querySelector("#sessao-grau").value
        ),

        tipo: document.querySelector("#sessao-tipo").value,

        observacoes: document
            .querySelector("#sessao-observacoes")
            .value
            .trim()
    };
}

function validarDadosSessao(dados) {
    if (!dados.data) {
        return "Informe a data da sessão.";
    }

    if (!CONFIG.grausSessoes.includes(dados.grau)) {
        return "Selecione um grau válido.";
    }

    if (!CONFIG.tiposSessao.includes(dados.tipo)) {
        return "Selecione um tipo de sessão válido.";
    }

    return "";
}

async function verificarDataSessaoExistente(
    data,
    sessaoIgnoradaId = null
) {
    const sessoes = await listarRegistrosPorIndice(
        "sessoes",
        "data",
        data
    );

    return sessoes.some((sessao) => {
        return sessao.id !== sessaoIgnoradaId;
    });
}

function mostrarErroFormularioSessao(texto) {
    const mensagem = document.querySelector(
        "#mensagem-formulario-sessao"
    );

    mensagem.textContent = texto;
    mensagem.classList.remove("oculto");
}

async function carregarSessoes() {
    const lista = document.querySelector("#lista-sessoes");

    lista.innerHTML = `
        <div class="estado-lista">
            Carregando sessões...
        </div>
    `;

    try {
        sessoesCarregadas = await listarRegistros("sessoes");

        sessoesCarregadas.sort((sessaoA, sessaoB) => {
            return sessaoB.data.localeCompare(sessaoA.data);
        });

        renderizarSessoes(sessoesCarregadas);
    } catch (erro) {
        console.error("Erro ao carregar sessões:", erro);

        lista.innerHTML = `
            <div class="estado-lista estado-erro">
                Não foi possível carregar as sessões.
            </div>
        `;
    }
}

function filtrarSessoes(termoPesquisa) {
    const termo = termoPesquisa.trim();

    if (!termo) {
        renderizarSessoes(sessoesCarregadas);
        return;
    }

    const somenteNumeros = termo.replace(/\D/g, "");

    const sessoesFiltradas = sessoesCarregadas.filter((sessao) => {
        const numeroFormatado = formatarNumeroSessao(
            sessao.numero
        );

        const dataFormatada = formatarData(sessao.data);

        return (
            numeroFormatado.includes(termo) ||
            dataFormatada.includes(termo) ||
            String(sessao.numero) === somenteNumeros
        );
    });

    renderizarSessoes(sessoesFiltradas);
}

function renderizarSessoes(sessoes) {
    const lista = document.querySelector("#lista-sessoes");

    const contador = document.querySelector(
        "#quantidade-sessoes"
    );

    contador.textContent = formatarQuantidadeSessoes(
        sessoes.length
    );

    if (sessoes.length === 0) {
        lista.innerHTML = `
            <div class="estado-lista">
                Nenhuma sessão encontrada.
            </div>
        `;

        return;
    }

    lista.innerHTML = sessoes
        .map((sessao) => criarLinhaSessao(sessao))
        .join("");
}

function tratarAcaoSessao(evento) {
    const botao = evento.target.closest("[data-acao]");

    if (!botao) {
        return;
    }

    const acao = botao.dataset.acao;
    const id = botao.dataset.id;

    if (acao === "editar") {
        abrirModalEditarSessao(id);
        return;
    }

    if (acao === "abrir") {
        abrirSessao(id);
        return;
    }

    if (acao === "excluir") {
        prepararExclusaoSessao(id);
    }
}

async function abrirSessao(id) {
    try {
        const sessao = await buscarRegistroPorId(
            "sessoes",
            id
        );

        if (!sessao) {
            mostrarMensagem(
                "A sessão selecionada não foi encontrada.",
                "erro"
            );

            return;
        }

        await carregarSessaoAberta(sessao.id);
    } 
    
    catch (erro) {
        console.error("Erro ao abrir sessão:", erro);

        mostrarMensagem(
            "Não foi possível abrir a sessão.",
            "erro"
        );
    }
}

async function prepararExclusaoSessao(id) {
    try {
        const sessao = await buscarRegistroPorId(
            "sessoes",
            id
        );

        if (!sessao) {
            mostrarMensagem(
                "A sessão selecionada não foi encontrada.",
                "erro"
            );

            return;
        }

        sessaoEmExclusaoId = id;

        const numero = formatarNumeroSessao(sessao.numero);
        const data = formatarData(sessao.data);

        document.querySelector(
            "#texto-exclusao-sessao"
        ).innerHTML = `
            Deseja realmente excluir a
            <strong>Sessão nº ${numero}</strong>,
            realizada em
            <strong>${escaparHTML(data)}</strong>?
        `;

        const modal = document.querySelector(
            "#modal-exclusao-sessao"
        );

        modal.classList.remove("oculto");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-aberto");
    } catch (erro) {
        console.error(
            "Erro ao preparar exclusão da sessão:",
            erro
        );

        mostrarMensagem(
            "Não foi possível abrir a confirmação de exclusão.",
            "erro"
        );
    }
}

async function confirmarExclusaoSessao() {
    if (!sessaoEmExclusaoId) {
        return;
    }

    const botao = document.querySelector(
        "#botao-confirmar-exclusao-sessao"
    );

    botao.disabled = true;
    botao.textContent = "Excluindo...";

    try {
        await excluirSessaoComPresencas(
            sessaoEmExclusaoId
        );

        fecharModalExclusaoSessao();
        await carregarSessoes();

        mostrarMensagem(
            "Sessão excluída com sucesso.",
            "sucesso"
        );
    } catch (erro) {
        console.error("Erro ao excluir sessão:", erro);

        mostrarMensagem(
            "Não foi possível excluir a sessão.",
            "erro"
        );
    } finally {
        botao.disabled = false;
        botao.textContent = "Excluir sessão";
    }
}

function fecharModalExclusaoSessao() {
    const modal = document.querySelector(
        "#modal-exclusao-sessao"
    );

    modal.classList.add("oculto");
    modal.setAttribute("aria-hidden", "true");

    sessaoEmExclusaoId = null;

    const existeOutroModalAberto = document.querySelector(
        ".modal-fundo:not(.oculto)"
    );

    document.body.classList.toggle(
        "modal-aberto",
        Boolean(existeOutroModalAberto)
    );
}


function criarLinhaSessao(sessao) {
    const numero = formatarNumeroSessao(sessao.numero);
    const data = formatarData(sessao.data);
    const diaSemana = obterDiaSemana(sessao.data);

    const classeTipo = sessao.tipo === "Magna"
        ? "tipo-magna"
        : "tipo-ordinaria";

    return `
        <article
            class="lista-linha lista-sessoes-grid ${classeTipo}"
        >
            <strong data-rotulo="Número">
                ${numero}
            </strong>

            <div class="coluna-principal" data-rotulo="Data">
                <strong>${data}</strong>

                <small>${escaparHTML(diaSemana)}</small>
            </div>

            <span data-rotulo="Grau">
                ${escaparHTML(sessao.grau)}
            </span>

            <span data-rotulo="Tipo">
                ${escaparHTML(sessao.tipo)}
            </span>

            <div class="acoes-linha" data-rotulo="Ações">

    <button
        type="button"
        class="botao-icone"
        data-acao="editar"
        data-id="${sessao.id}"
        title="Editar sessão"
        aria-label="Editar sessão ${numero}"
    >
        ✎
    </button>

   <button
    type="button"
    class="botao-icone"
    data-acao="abrir"
    data-id="${sessao.id}"
    title="Abrir sessão"
    aria-label="Abrir sessão ${numero}"
>
    ◉
    </button>

    <button
        type="button"
        class="botao-icone botao-perigo"
        data-acao="excluir"
        data-id="${sessao.id}"
        title="Excluir sessão"
        aria-label="Excluir sessão ${numero}"
    >
        ×
    </button>

</div>
        </article>
    `;
}

function formatarQuantidadeSessoes(quantidade) {
    if (quantidade === 1) {
        return "1 sessão";
    }

    return `${quantidade} sessões`;
}