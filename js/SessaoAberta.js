async function carregarSessaoAberta(idSessao) {
    const sessao = await buscarRegistroPorId(
        "sessoes",
        idSessao
    );

    if (!sessao) {
        mostrarMensagem(
            "A sessão selecionada não foi encontrada.",
            "erro"
        );

        return;
    }

    async function alterarPresenca(evento) {
    const controle = evento.target.closest(
        ".controle-presenca"
    );

    if (!controle) {
        return;
    }

    const presencaId = controle.dataset.presencaId;

    const presenca = await buscarRegistroPorId(
        "presencas",
        presencaId
    );

    if (!presenca) {
        mostrarMensagem(
            "O registro de presença não foi encontrado.",
            "erro"
        );

        controle.checked = !controle.checked;
        return;
    }

    const novoEstado = controle.checked;

    const presencaAtualizada = {
        ...presenca,
        presente: novoEstado,
        dataUltimaAlteracao: new Date().toISOString()
    };

    try {
        await atualizarRegistro(
            "presencas",
            presencaAtualizada
        );

        const linha = controle.closest(
            ".sessao-aberta-membro"
        );

        const estado = linha.querySelector(
            ".estado-presenca"
        );

        estado.classList.toggle(
            "estado-presente",
            novoEstado
        );

        estado.classList.toggle(
            "estado-ausente",
            !novoEstado
        );

        estado.textContent = novoEstado
            ? "● Presente"
            : "● Ausente";

        atualizarResumoSessao();

        mostrarMensagem(
            novoEstado
                ? "Presença registrada."
                : "Presença removida.",
            "sucesso"
        );
    } catch (erro) {
        console.error(
            "Erro ao atualizar presença:",
            erro
        );

        controle.checked = !novoEstado;

        mostrarMensagem(
            "Não foi possível atualizar a presença.",
            "erro"
        );
    }
}

function atualizarResumoSessao() {
    const moduloSessaoAberta = document.querySelector(
        "#modulo-sessao-aberta"
    );

    if (!moduloSessaoAberta) {
        return;
    }

    const controles = moduloSessaoAberta.querySelectorAll(
        ".controle-presenca"
    );

    const total = controles.length;

    const presentes = Array.from(controles).filter(
        (controle) => controle.checked
    ).length;

    const ausentes = total - presentes;

    const totalElemento = moduloSessaoAberta.querySelector(
        "#resumo-total"
    );

    const presentesElemento = moduloSessaoAberta.querySelector(
        "#resumo-presentes"
    );

    const ausentesElemento = moduloSessaoAberta.querySelector(
        "#resumo-ausentes"
    );

    if (
        !totalElemento ||
        !presentesElemento ||
        !ausentesElemento
    ) {
        return;
    }

    totalElemento.textContent = total;
    presentesElemento.textContent = presentes;
    ausentesElemento.textContent = ausentes;
}
   
    const todasPresencas = await listarRegistros("presencas");

    const presencasDaSessao = todasPresencas.filter(
    (presenca) => presenca.sessaoId === idSessao
    );

    const membrosDaSessao = await Promise.all(
    presencasDaSessao.map(async (presenca) => {
        const membro = await buscarRegistroPorId(
            "membros",
            presenca.membroId
        );

        return {
            presenca,
            membro
        };
    })
    );

    const moduloSessaoAberta = document.querySelector(
        "#modulo-sessao-aberta"
    );

    if (!moduloSessaoAberta) {
    throw new Error(
        "O elemento #modulo-sessao-aberta não foi encontrado no index.html."
    );
}

    moduloSessaoAberta.innerHTML = `
    <div class="sessao-aberta-cabecalho">
    
    <div class="sessao-aberta-titulo">
    <div>
        <h2>
            Sessão nº ${formatarNumeroSessao(sessao.numero)}
        </h2>
    </div>

    <div class="sessao-aberta-acoes">
        <span class="sessao-aberta-status">
            ${escaparHTML(sessao.status || "Aberta")}
        </span>

        ${
            (sessao.status || "Aberta") === "Aberta"
                ? `
                    <button
                        type="button"
                        class="botao-perigo"
                        id="botao-encerrar-sessao"
                        data-sessao-id="${sessao.id}"
                    >
                        Encerrar sessão
                    </button>
                `
                : ""
        }
    </div>
        
    </div>

    <div class="sessao-aberta-dados">
        <div class="sessao-aberta-dado">
            <span>Grau</span>

            <strong>
                ${escaparHTML(sessao.grau)}
            </strong>
        </div>

        <div class="sessao-aberta-dado">
            <span>Tipo</span>

            <strong>
                ${escaparHTML(sessao.tipo)}
            </strong>
        </div>

        <div class="sessao-aberta-dado">
            <span>Data</span>

            <strong>
                ${formatarData(sessao.data)}
            </strong>
        </div>
    </div>
</div>

<div class="sessao-aberta-resumo">
    <h3>Resumo da sessão</h3>

    <div class="sessao-aberta-resumo-grid">
        <div class="resumo-card">
            <span>Total</span>

            <strong id="resumo-total">0</strong>
        </div>

        <div class="resumo-card resumo-card-presente">
            <span>Presentes</span>

            <strong id="resumo-presentes">0</strong>
        </div>

        <div class="resumo-card resumo-card-ausente">
            <span>Ausentes</span>

            <strong id="resumo-ausentes">0</strong>
        </div>
    </div>
</div>
<div class="sessao-aberta-lista">
    <h3>Lista de presença</h3>

        ${
            membrosDaSessao.length === 0
                ? `
                    <p>
                        Esta sessão não possui membros vinculados.
                    </p>
                `
                : membrosDaSessao
                    .map(({ membro, presenca }) => {
                        return `
            <div
             class="sessao-aberta-membro"
            data-presenca-id="${presenca.id}"
            >

             <label
             style="
            display:flex;
            align-items:flex-start;
            gap:12px;
            flex:1;
            cursor:pointer;
          "
        >

      <input
    type="checkbox"
    class="controle-presenca"
    data-presenca-id="${presenca.id}"
    ${presenca.presente ? "checked" : ""}
    ${
        (sessao.status || "Aberta") === "Encerrada"
            ? "disabled"
            : ""
    }
>

        <div class="sessao-aberta-info">

            <span class="sessao-aberta-nome">
                ${escaparHTML(
                    membro?.nome ||
                    "Membro não encontrado"
                )}
            </span>

            <span class="sessao-aberta-grau">
                Grau ${escaparHTML(
                    membro?.grau ?? "-"
                )}
            </span>

        </div>

        </label>

        <strong
        class="
            estado-presenca
            ${
                presenca.presente
                    ? "estado-presente"
                    : "estado-ausente"
            }
        "
        >
        ${
            presenca.presente
                ? "● Presente"
                : "● Ausente"
        }
         </strong>

         </div>

       `;
        })
          .join("")
        }
        </div>
    `   ;

    moduloSessaoAberta.style.display = "block";

    moduloSessaoAberta.removeEventListener(
    "change",
    alterarPresenca
);

moduloSessaoAberta.addEventListener(
    "change",
    alterarPresenca
);
const botaoEncerrarSessao = moduloSessaoAberta.querySelector(
    "#botao-encerrar-sessao"
);

if (botaoEncerrarSessao) {
    botaoEncerrarSessao.addEventListener(
        "click",
        encerrarSessao
    );
}

    atualizarResumoSessao();

    async function encerrarSessao(evento) {
    const botao = evento.currentTarget;
    const sessaoId = botao.dataset.sessaoId;

    const confirmou = window.confirm(
        "Deseja realmente encerrar esta sessão?\n\n" +
        "Após o encerramento, as presenças não poderão mais ser alteradas."
    );

    if (!confirmou) {
        return;
    }

    botao.disabled = true;
    botao.textContent = "Encerrando...";

    try {
        const sessao = await buscarRegistroPorId(
            "sessoes",
            sessaoId
        );

        if (!sessao) {
            throw new Error("Sessão não encontrada.");
        }

        const sessaoAtualizada = {
            ...sessao,
            status: "Encerrada",
            dataEncerramento: new Date().toISOString(),
            dataUltimaAlteracao: new Date().toISOString()
        };

        await atualizarRegistro(
            "sessoes",
            sessaoAtualizada
        );

        mostrarMensagem(
            "Sessão encerrada com sucesso.",
            "sucesso"
        );

        await carregarSessaoAberta(sessaoId);
    } catch (erro) {
        console.error(
            "Erro ao encerrar sessão:",
            erro
        );

        mostrarMensagem(
            "Não foi possível encerrar a sessão.",
            "erro"
        );

        botao.disabled = false;
        botao.textContent = "Encerrar sessão";
    }
}



    moduloSessaoAberta.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
   