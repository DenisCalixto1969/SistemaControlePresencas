"use strict";

let membrosCarregados = [];
let membroEmEdicaoId = null;
let membroEmExclusaoId = null;
let grauOriginalMembro = null;

function carregarModuloMembros() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Membros</h2>

                <p>
                    Cadastre, consulte e gerencie os membros do Capítulo.
                </p>
            </div>

            <button
                type="button"
                class="botao-primario"
                id="botao-novo-membro"
            >
                + Novo membro
            </button>
        </section>

        <section class="barra-ferramentas">
            <div class="campo-pesquisa">
                <label for="pesquisa-membro">
                    Pesquisar
                </label>

                <input
                    type="search"
                    id="pesquisa-membro"
                    placeholder="Digite o nome ou o grau"
                    autocomplete="off"
                >
            </div>

            <div class="contador-registros">
                <span id="quantidade-membros">0 membros</span>
            </div>
        </section>

        <section class="painel painel-listagem">
            <div class="lista-cabecalho lista-membros-grid">
                <span>Nome</span>
                <span>Grau</span>
                <span>CIR</span>
                <span>Situação</span>
                <span>Ações</span>
            </div>

            <div id="lista-membros" class="lista-corpo">
                <div class="estado-lista">
                    Carregando membros...
                </div>
            </div>
        </section>

        ${criarModalMembro()}
        ${criarModalExclusaoMembro()}
    `;
}

function criarModalMembro() {
   const opcoesGraus = CONFIG.grausMembros
        .map((grau) => {
            return `
                <option value="${grau}">
                    Grau ${grau}
                </option>
            `;
        })
        .join("");

    return `
        <div
            class="modal-fundo oculto"
            id="modal-membro"
            aria-hidden="true"
        >
            <section
                class="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-membro"
            >
                <header class="modal-cabecalho">
                    <div>
                        <h3 id="titulo-modal-membro">
                            Novo membro
                        </h3>

                        <p>
                            Preencha os dados do membro.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="botao-fechar-modal"
                        id="botao-fechar-modal-membro"
                        aria-label="Fechar formulário"
                    >
                        ×
                    </button>
                </header>

                <form id="formulario-membro">
                    <div class="formulario-grid">
                        <div class="grupo-campo campo-largura-total">
                            <label for="membro-nome">
                                Nome <span class="obrigatorio">*</span>
                            </label>

                            <input
                                type="text"
                                id="membro-nome"
                                maxlength="150"
                                autocomplete="off"
                                required
                            >
                        </div>

                        <div class="grupo-campo">
                            <label for="membro-grau">
                                Grau <span class="obrigatorio">*</span>
                            </label>

                            <select id="membro-grau" required>
                                ${opcoesGraus}
                            </select>
                        </div>

                        <div
                        class="grupo-campo oculto"
                        id="grupo-data-mudanca-grau"
                    >
                        <label for="membro-data-mudanca-grau">
                            Data da mudança de grau
                        </label>

                        <input
                            type="date"
                            id="membro-data-mudanca-grau"
                        >
                    </div>

                        
                        <div class="grupo-campo grupo-checkbox">
                            <label for="membro-ativo">
                                Situação
                            </label>

                            <label class="controle-checkbox">
                                <input
                                    type="checkbox"
                                    id="membro-ativo"
                                    checked
                                >

                                <span>Membro ativo</span>
                            </label>
                        </div>

                        <div class="grupo-campo">
                            <label for="membro-cir">
                                CIR
                            </label>

                            <input
                                type="text"
                                id="membro-cir"
                                maxlength="50"
                                autocomplete="off"
                            >
                        </div>

                        <div class="grupo-campo">
                            <label for="membro-cim">
                                CIM
                            </label>

                            <input
                                type="text"
                                id="membro-cim"
                                maxlength="50"
                                autocomplete="off"
                            >
                        </div>

                        <div class="grupo-campo campo-largura-total">
                            <label for="membro-observacoes">
                                Observações
                            </label>

                            <textarea
                                id="membro-observacoes"
                                rows="4"
                                maxlength="1000"
                            ></textarea>
                        </div>

                        <section class="historico-graus">
                        <h3>Histórico de graus</h3>

                         <div id="historico-graus-membro">
                        <p class="historico-graus-vazio">
                         O histórico será exibido ao editar um membro.
                         </p>
                        </div>
                        </section>

                    </div>



                    <p
                        class="mensagem-formulario oculto"
                        id="mensagem-formulario-membro"
                    ></p>

                    <footer class="modal-acoes">
                        <button
                            type="button"
                            class="botao-secundario"
                            id="botao-cancelar-membro"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            class="botao-primario"
                            id="botao-salvar-membro"
                        >
                            Salvar membro
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    `;
}

function criarModalExclusaoMembro() {
    return `
        <div
            class="modal-fundo oculto"
            id="modal-exclusao-membro"
            aria-hidden="true"
        >
            <section
                class="modal modal-confirmacao"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-exclusao-membro"
            >
                <header class="modal-cabecalho">
                    <div>
                        <h3 id="titulo-exclusao-membro">
                            Excluir membro
                        </h3>

                        <p>
                            Esta ação não poderá ser desfeita.
                        </p>
                    </div>

                    <button
                        type="button"
                        class="botao-fechar-modal"
                        id="botao-fechar-exclusao-membro"
                        aria-label="Fechar confirmação"
                    >
                        ×
                    </button>
                </header>

                <div class="modal-confirmacao-conteudo">
                    <p id="texto-exclusao-membro">
                        Deseja realmente excluir este membro?
                    </p>

                    <footer class="modal-acoes">
                        <button
                            type="button"
                            class="botao-secundario"
                            id="botao-cancelar-exclusao-membro"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="botao-excluir"
                            id="botao-confirmar-exclusao-membro"
                        >
                            Excluir membro
                        </button>
                    </footer>
                </div>
            </section>
        </div>
    `;
}


async function inicializarModuloMembros() {
    configurarEventosMembros();
    await carregarMembros();
}

function configurarEventosMembros() {
    const botaoNovo = document.querySelector("#botao-novo-membro");

    const botaoFechar = document.querySelector(
        "#botao-fechar-modal-membro"
    );

    const botaoCancelar = document.querySelector(
        "#botao-cancelar-membro"
    );

    const formulario = document.querySelector("#formulario-membro");

    const campoPesquisa = document.querySelector("#pesquisa-membro");

    const modalMembro = document.querySelector("#modal-membro");

    const listaMembros = document.querySelector("#lista-membros");

    const modalExclusao = document.querySelector(
        "#modal-exclusao-membro"
    );

    const botaoFecharExclusao = document.querySelector(
        "#botao-fechar-exclusao-membro"
    );

    const botaoCancelarExclusao = document.querySelector(
        "#botao-cancelar-exclusao-membro"
    );

    const botaoConfirmarExclusao = document.querySelector(
        "#botao-confirmar-exclusao-membro"
    );

    botaoNovo.addEventListener("click", abrirModalNovoMembro);
    botaoFechar.addEventListener("click", fecharModalMembro);
    botaoCancelar.addEventListener("click", fecharModalMembro);

    formulario.addEventListener("submit", salvarMembro);
    document
    .querySelector("#membro-grau")
    .addEventListener(
        "change",
        controlarCampoDataMudancaGrau
    );

    campoPesquisa.addEventListener("input", () => {
        filtrarMembros(campoPesquisa.value);
    });

    listaMembros.addEventListener("click", tratarAcaoMembro);

    modalMembro.addEventListener("click", (evento) => {
        if (evento.target === modalMembro) {
            fecharModalMembro();
        }
    });

    modalExclusao.addEventListener("click", (evento) => {
        if (evento.target === modalExclusao) {
            fecharModalExclusaoMembro();
        }
    });

    botaoFecharExclusao.addEventListener(
        "click",
        fecharModalExclusaoMembro
    );

    botaoCancelarExclusao.addEventListener(
        "click",
        fecharModalExclusaoMembro
    );

    botaoConfirmarExclusao.addEventListener(
        "click",
        confirmarExclusaoMembro
    );

    document.addEventListener("keydown", tratarTeclaEscapeMembros);
}

function abrirModalNovoMembro() {
    membroEmEdicaoId = null;

    const modal = document.querySelector("#modal-membro");
    const formulario = document.querySelector("#formulario-membro");
    const campoAtivo = document.querySelector("#membro-ativo");
    const mensagem = document.querySelector(
        "#mensagem-formulario-membro"
    );

    document.querySelector(
        "#titulo-modal-membro"
    ).textContent = "Novo membro";

    document.querySelector(
        "#botao-salvar-membro"
    ).textContent = "Salvar membro";

    formulario.reset();

    campoAtivo.checked = true;
    mensagem.textContent = "";
    mensagem.classList.add("oculto");

    modal.classList.remove("oculto");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-aberto");

    window.setTimeout(() => {
        document.querySelector("#membro-nome").focus();
    }, 50);
}

async function carregarHistoricoGraus(membroId) {
    const container = document.querySelector(
        "#historico-graus-membro"
    );

    if (!container) {
        return;
    }

    const historico = await listarRegistros("historicoGraus");

    const registros = historico
        .filter(item => item.membroId === membroId)
        .sort((a, b) =>
            new Date(b.dataInicio) - new Date(a.dataInicio)
        );

    if (registros.length === 0) {
        container.innerHTML = `
            <p class="historico-graus-vazio">
                Nenhum histórico de grau registrado.
            </p>
        `;
        return;
    }

    container.innerHTML = registros.map(item => `
        <div class="historico-grau-item">
            <div>
                <strong>Grau ${item.grau}</strong><br>
                <span>
                    Desde ${formatarData(item.dataInicio)}
                </span>
            </div>
        </div>
    `).join("");
}


async function abrirModalEditarMembro(id) {
    const membro = await buscarRegistroPorId("membros", id);

    if (!membro) {
        mostrarMensagem(
            "O membro selecionado não foi encontrado.",
            "erro"
        );

        return;
    }

    membroEmEdicaoId = id;

    document.querySelector(
        "#titulo-modal-membro"
    ).textContent = "Editar membro";

    document.querySelector(
        "#botao-salvar-membro"
    ).textContent = "Salvar alterações";

    document.querySelector("#membro-nome").value = membro.nome;
    document.querySelector("#membro-grau").value = membro.grau;
    grauOriginalMembro = Number(membro.grau);

const grupoDataMudancaGrau = document.querySelector(
    "#grupo-data-mudanca-grau"
);

const campoDataMudancaGrau = document.querySelector(
    "#membro-data-mudanca-grau"
);

grupoDataMudancaGrau.classList.add("oculto");
campoDataMudancaGrau.value = "";
campoDataMudancaGrau.required = false;

    document.querySelector("#membro-cir").value = membro.cir || "";
    document.querySelector("#membro-cim").value = membro.cim || "";

    document.querySelector(
        "#membro-observacoes"
    ).value = membro.observacoes || "";

    document.querySelector("#membro-ativo").checked = membro.ativo;

   await carregarHistoricoGrausMembro(id);

    const mensagem = document.querySelector(
        "#mensagem-formulario-membro"
    );

    mensagem.textContent = "";
    mensagem.classList.add("oculto");

    const modal = document.querySelector("#modal-membro");

    modal.classList.remove("oculto");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-aberto");

    await carregarHistoricoGraus(id);

    window.setTimeout(() => {
        document.querySelector("#membro-nome").focus();
    }, 50);
}

function fecharModalMembro() {
    const modal = document.querySelector("#modal-membro");

    modal.classList.add("oculto");
    modal.setAttribute("aria-hidden", "true");

    membroEmEdicaoId = null;

    atualizarEstadoBloqueioPagina();
}

function calcularDiaAnterior(dataISO) {
    const data = new Date(
        `${dataISO}T12:00:00`
    );

    data.setDate(
        data.getDate() - 1
    );

    return data
        .toISOString()
        .slice(0, 10);
}

async function registrarHistoricoGrau(
    membroId,
    grau,
    dataMudanca = null
) {
    const agora = new Date().toISOString();

    const dataInicio =
        dataMudanca ||
        agora.slice(0, 10);

    const historicoCompleto = await listarRegistros(
        "historicoGraus"
    );

    const historicoDoMembro = historicoCompleto
        .filter(
            (registro) =>
                registro.membroId === membroId
        )
        .sort(
            (registroA, registroB) =>
                registroB.dataInicio.localeCompare(
                    registroA.dataInicio
                )
        );

    const historicoAtual = historicoDoMembro.find(
        (registro) =>
            registro.dataFim == null
    );

    /*
     * Primeiro histórico do membro.
     */
    if (!historicoAtual) {
        const primeiroHistorico = {
            id: crypto.randomUUID(),
            membroId,
            grau: Number(grau),
            dataInicio,
            dataFim: null,
            observacoes: "",
            dataCadastro: agora,
            dataUltimaAlteracao: agora
        };

        await adicionarRegistro(
            "historicoGraus",
            primeiroHistorico
        );

        return;
    }

    /*
     * Se o grau atual já for o mesmo,
     * não existe mudança para registrar.
     */
    if (
        Number(historicoAtual.grau) ===
        Number(grau)
    ) {
        return;
    }

    /*
     * Não permitimos duas mudanças reais
     * na mesma data.
     */
    if (
        historicoAtual.dataInicio ===
        dataInicio
    ) {
        throw new Error(
            "Já existe uma mudança de grau registrada nesta data."
        );
    }

    /*
     * Fecha o grau anterior no dia anterior
     * ao início do novo grau.
     */
    await atualizarRegistro(
        "historicoGraus",
        {
            ...historicoAtual,
            dataFim: calcularDiaAnterior(
                dataInicio
            ),
            dataUltimaAlteracao: agora
        }
    );

    /*
     * Cria o novo grau vigente.
     */
    const novoHistorico = {
        id: crypto.randomUUID(),
        membroId,
        grau: Number(grau),
        dataInicio,
        dataFim: null,
        observacoes: "",
        dataCadastro: agora,
        dataUltimaAlteracao: agora
    };

    await adicionarRegistro(
        "historicoGraus",
        novoHistorico
    );
}


function calcularDiaAnterior(dataISO) {
    const data = new Date(
        `${dataISO}T12:00:00`
    );

    data.setDate(
        data.getDate() - 1
    );

    return data
        .toISOString()
        .slice(0, 10);
}
function controlarCampoDataMudancaGrau() {
    if (!membroEmEdicaoId) {
        return;
    }

    const campoGrau = document.querySelector(
        "#membro-grau"
    );

    const grupoData = document.querySelector(
        "#grupo-data-mudanca-grau"
    );

    const campoData = document.querySelector(
        "#membro-data-mudanca-grau"
    );

    if (
        !campoGrau ||
        !grupoData ||
        !campoData
    ) {
        return;
    }

    const grauFoiAlterado =
        Number(campoGrau.value) !==
        Number(grauOriginalMembro);

    grupoData.classList.toggle(
        "oculto",
        !grauFoiAlterado
    );

    campoData.required = grauFoiAlterado;

    if (
        grauFoiAlterado &&
        !campoData.value
    ) {
        campoData.value = new Date()
            .toISOString()
            .slice(0, 10);
    }

    if (!grauFoiAlterado) {
        campoData.value = "";
    }
}
    async function salvarMembro(evento) {
    evento.preventDefault();

    const botaoSalvar = document.querySelector(
        "#botao-salvar-membro"
    );

    const dados = obterDadosFormularioMembro();
    const erroValidacao = validarDadosMembro(dados);

    if (erroValidacao) {
        mostrarErroFormularioMembro(erroValidacao);
        return;
    }

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = "Salvando...";

    try {
    if (membroEmEdicaoId) {
        /*
         * Buscamos o cadastro anterior antes de atualizá-lo,
         * para comparar o grau antigo com o novo.
         */
        const membroAnterior = await buscarRegistroPorId(
            "membros",
            membroEmEdicaoId
        );

        if (!membroAnterior) {
            throw new Error(
                "O membro em edição não foi encontrado."
            );
        }

        const grauFoiAlterado =
    Number(membroAnterior.grau) !==
    Number(dados.grau);

if (grauFoiAlterado) {
    const campoDataMudanca = document.querySelector(
        "#membro-data-mudanca-grau"
    );

    const dataMudanca = campoDataMudanca?.value;

    if (!dataMudanca) {
        throw new Error(
            "Informe a data da mudança de grau."
        );
    }

    await registrarHistoricoGrau(
        membroEmEdicaoId,
        dados.grau,
        dataMudanca
    );
}



await atualizarMembroExistente(dados);

        mostrarMensagem(
            grauFoiAlterado
                ? "Membro atualizado e mudança de grau registrada."
                : "Membro atualizado com sucesso.",
            "sucesso"
        );
    } else {
        const novoMembro = new Membro(dados);

        await adicionarRegistro(
            "membros",
            novoMembro
        );

        await registrarHistoricoGrau(
            novoMembro.id,
            dados.grau
        );

        mostrarMensagem(
            "Membro cadastrado com sucesso.",
            "sucesso"
        );
    }

    fecharModalMembro();
    await carregarMembros();

    } catch (erro) {
        console.error("Erro ao salvar membro:", erro);

        mostrarErroFormularioMembro(
            "Não foi possível salvar o membro."
        );
    } finally {
        botaoSalvar.disabled = false;

        botaoSalvar.textContent = membroEmEdicaoId
            ? "Salvar alterações"
            : "Salvar membro";
    }
}

async function carregarHistoricoGrausMembro(membroId) {
    const areaHistorico = document.querySelector(
        "#historico-graus-membro"
    );

    if (!areaHistorico) {
        return;
    }

    const todosRegistros = await listarRegistros(
        "historicoGraus"
    );

    const historico = todosRegistros
        .filter(
            (registro) => registro.membroId === membroId
        )
        .sort(
            (registroA, registroB) =>
                registroB.dataInicio.localeCompare(
                    registroA.dataInicio
                )
        );

    if (historico.length === 0) {
        areaHistorico.innerHTML = `
            <p class="historico-graus-vazio">
                Nenhum histórico de grau registrado.
            </p>
        `;

        return;
    }

    areaHistorico.innerHTML = historico
        .map((registro) => {
            return `
                <div class="historico-grau-item">
                    <strong>
                        Grau ${escaparHTML(registro.grau)}
                    </strong>

                    <span>
                        ${formatarData(registro.dataInicio)}
                    </span>
                </div>
            `;
        })
        .join("");
}


async function atualizarMembroExistente(dados) {
    const membroAtual = await buscarRegistroPorId(
        "membros",
        membroEmEdicaoId
    );

    if (!membroAtual) {
        throw new Error("Membro não encontrado.");
    }

    const membroAtualizado = new Membro({
        ...membroAtual,
        ...dados,

        id: membroAtual.id,

        dataCadastro: membroAtual.dataCadastro,

        dataUltimaAlteracao: new Date().toISOString()
    });


    await atualizarRegistro("membros", membroAtualizado);
}

function obterDadosFormularioMembro() {


    return {
        nome: document.querySelector("#membro-nome").value.trim(),

        grau: Number(
            document.querySelector("#membro-grau").value
        ),

        cir: document.querySelector("#membro-cir").value.trim(),

        cim: document.querySelector("#membro-cim").value.trim(),

        observacoes: document
            .querySelector("#membro-observacoes")
            .value
            .trim(),

        ativo: document.querySelector("#membro-ativo").checked
    };
}

function validarDadosMembro(dados) {
    if (!dados.nome) {
        return "Informe o nome do membro.";
    }

    if (dados.nome.length < 3) {
        return "O nome deve possuir pelo menos 3 caracteres.";
    }

   if (!CONFIG.grausMembros.includes(dados.grau))  {
        return "Selecione um grau válido.";
    }

    return "";
}

function mostrarErroFormularioMembro(texto) {
    const mensagem = document.querySelector(
        "#mensagem-formulario-membro"
    );

    mensagem.textContent = texto;
    mensagem.classList.remove("oculto");
}

async function carregarMembros() {
    const lista = document.querySelector("#lista-membros");

    lista.innerHTML = `
        <div class="estado-lista">
            Carregando membros...
        </div>
    `;

    try {
        membrosCarregados = await listarRegistros("membros");

        membrosCarregados.sort((membroA, membroB) => {
            return membroA.nome.localeCompare(
                membroB.nome,
                "pt-BR",
                {
                    sensitivity: "base"
                }
            );
        });

        renderizarMembros(membrosCarregados);
    } catch (erro) {
        console.error("Erro ao carregar membros:", erro);

        lista.innerHTML = `
            <div class="estado-lista estado-erro">
                Não foi possível carregar os membros.
            </div>
        `;
    }
}

function filtrarMembros(termoPesquisa) {
    const termo = termoPesquisa
        .trim()
        .toLocaleLowerCase("pt-BR");

    if (!termo) {
        renderizarMembros(membrosCarregados);
        return;
    }

    const membrosFiltrados = membrosCarregados.filter((membro) => {
        const nome = membro.nome
            .toLocaleLowerCase("pt-BR");

        const grau = String(membro.grau);

        return (
            nome.includes(termo) ||
            grau === termo
        );
    });

    renderizarMembros(membrosFiltrados);
}

function renderizarMembros(membros) {
    const lista = document.querySelector("#lista-membros");
    const contador = document.querySelector("#quantidade-membros");

    contador.textContent = formatarQuantidadeMembros(membros.length);

    if (membros.length === 0) {
        lista.innerHTML = `
            <div class="estado-lista">
                Nenhum membro encontrado.
            </div>
        `;

        return;
    }

    lista.innerHTML = membros
        .map((membro) => criarLinhaMembro(membro))
        .join("");
}

function criarLinhaMembro(membro) {
    const classeSituacao = membro.ativo
        ? "status-ativo"
        : "status-inativo";

    const textoSituacao = membro.ativo
        ? "Ativo"
        : "Inativo";

    const textoAcaoStatus = membro.ativo
        ? "Inativar membro"
        : "Ativar membro";

    const simboloStatus = membro.ativo
        ? "●"
        : "○";

    const cir = membro.cir || "—";

    return `
        <article class="lista-linha lista-membros-grid">
            <div class="coluna-principal">
                <strong>${escaparHTML(membro.nome)}</strong>

                <small>
                    CIM: ${escaparHTML(membro.cim || "não informado")}
                </small>
            </div>

            <span data-rotulo="Grau">
                ${escaparHTML(membro.grau)}
            </span>

            <span data-rotulo="CIR">
                ${escaparHTML(cir)}
            </span>

            <span data-rotulo="Situação">
                <span class="status ${classeSituacao}">
                    ${textoSituacao}
                </span>
            </span>

            <div class="acoes-linha" data-rotulo="Ações">
                <button
                    type="button"
                    class="botao-icone"
                    data-acao="editar"
                    data-id="${membro.id}"
                    title="Editar membro"
                    aria-label="Editar ${escaparHTML(membro.nome)}"
                >
                    ✎
                </button>

                <button
                    type="button"
                    class="botao-icone"
                    data-acao="alternar-status"
                    data-id="${membro.id}"
                    title="${textoAcaoStatus}"
                    aria-label="${textoAcaoStatus}"
                >
                    ${simboloStatus}
                </button>

                <button
                    type="button"
                    class="botao-icone botao-perigo"
                    data-acao="excluir"
                    data-id="${membro.id}"
                    title="Excluir membro"
                    aria-label="Excluir ${escaparHTML(membro.nome)}"
                >
                    ×
                </button>
            </div>
        </article>
    `;
}

function tratarAcaoMembro(evento) {
    const botao = evento.target.closest("[data-acao]");

    if (!botao) {
        return;
    }

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    if (acao === "editar") {
        abrirModalEditarMembro(id);
        return;
    }

    if (acao === "alternar-status") {
        alternarStatusMembro(id);
        return;
    }

    if (acao === "excluir") {
        prepararExclusaoMembro(id);
    }
}

async function alternarStatusMembro(id) {
    try {
        const membro = await buscarRegistroPorId("membros", id);

        if (!membro) {
            mostrarMensagem(
                "O membro selecionado não foi encontrado.",
                "erro"
            );

            return;
        }

        membro.ativo = !membro.ativo;
        membro.dataUltimaAlteracao = new Date().toISOString();

        await atualizarRegistro("membros", membro);
        await carregarMembros();

        const mensagem = membro.ativo
            ? "Membro ativado com sucesso."
            : "Membro inativado com sucesso.";

        mostrarMensagem(mensagem, "sucesso");
    } catch (erro) {
        console.error("Erro ao alterar situação:", erro);

        mostrarMensagem(
            "Não foi possível alterar a situação do membro.",
            "erro"
        );
    }
}

async function prepararExclusaoMembro(id) {
    try {
        const membro = await buscarRegistroPorId("membros", id);

        if (!membro) {
            mostrarMensagem(
                "O membro selecionado não foi encontrado.",
                "erro"
            );

            return;
        }

        const presencas = await listarRegistrosPorIndice(
            "presencas",
            "membroId",
            id
        );

        if (presencas.length > 0) {
            mostrarMensagem(
                "Este membro possui histórico de presença. Inative o cadastro em vez de excluí-lo.",
                "aviso"
            );

            return;
        }

        membroEmExclusaoId = id;

        document.querySelector(
            "#texto-exclusao-membro"
        ).innerHTML = `
            Deseja realmente excluir
            <strong>${escaparHTML(membro.nome)}</strong>?
        `;

        const modal = document.querySelector(
            "#modal-exclusao-membro"
        );

        modal.classList.remove("oculto");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-aberto");
    } catch (erro) {
        console.error("Erro ao preparar exclusão:", erro);

        mostrarMensagem(
            "Não foi possível verificar o cadastro.",
            "erro"
        );
    }
}

async function confirmarExclusaoMembro() {
    if (!membroEmExclusaoId) {
        return;
    }

    const botao = document.querySelector(
        "#botao-confirmar-exclusao-membro"
    );

    botao.disabled = true;
    botao.textContent = "Excluindo...";

    try {
        await excluirRegistro(
            "membros",
            membroEmExclusaoId
        );

        fecharModalExclusaoMembro();
        await carregarMembros();

        mostrarMensagem(
            "Membro excluído com sucesso.",
            "sucesso"
        );
    } catch (erro) {
        console.error("Erro ao excluir membro:", erro);

        mostrarMensagem(
            "Não foi possível excluir o membro.",
            "erro"
        );
    } finally {
        botao.disabled = false;
        botao.textContent = "Excluir membro";
    }
}

function fecharModalExclusaoMembro() {
    const modal = document.querySelector(
        "#modal-exclusao-membro"
    );

    modal.classList.add("oculto");
    modal.setAttribute("aria-hidden", "true");

    membroEmExclusaoId = null;

    atualizarEstadoBloqueioPagina();
}

function tratarTeclaEscapeMembros(evento) {
    if (evento.key !== "Escape") {
        return;
    }

    const modalMembro = document.querySelector("#modal-membro");

    const modalExclusao = document.querySelector(
        "#modal-exclusao-membro"
    );

    if (modalMembro && !modalMembro.classList.contains("oculto")) {
        fecharModalMembro();
        return;
    }

    if (
        modalExclusao &&
        !modalExclusao.classList.contains("oculto")
    ) {
        fecharModalExclusaoMembro();
    }
}

function atualizarEstadoBloqueioPagina() {
    const existeModalAberto = document.querySelector(
        ".modal-fundo:not(.oculto)"
    );

    document.body.classList.toggle(
        "modal-aberto",
        Boolean(existeModalAberto)
    );
}

function formatarQuantidadeMembros(quantidade) {
    if (quantidade === 1) {
        return "1 membro";
    }

    return `${quantidade} membros`;
}