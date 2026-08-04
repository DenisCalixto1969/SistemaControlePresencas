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
        <h2>
            Sessão nº ${formatarNumeroSessao(sessao.numero)}
        </h2>

        <p>
            <strong>Data:</strong>
            ${formatarData(sessao.data)}
        </p>

        <p>
            <strong>Grau:</strong>
            ${escaparHTML(sessao.grau)}
        </p>

        <p>
            <strong>Tipo:</strong>
            ${escaparHTML(sessao.tipo)}
        </p>

        <p>
            <strong>Status:</strong>
            ${escaparHTML(sessao.status || "Aberta")}
        </p>
    </div>

   <div class="sessao-aberta-resumo">
    <h3>Resumo</h3>

    <p>
        <strong>Total de membros:</strong>
        <span id="resumo-total">0</span>
    </p>

    <p>
        <strong>Presentes:</strong>
        <span id="resumo-presentes">0</span>
    </p>

    <p>
        <strong>Ausentes:</strong>
        <span id="resumo-ausentes">0</span>
    </p>
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
    atualizarResumoSessao();

    moduloSessaoAberta.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
   