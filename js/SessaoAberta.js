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

        estado.textContent = novoEstado
            ? "Presente"
            : "Ausente";

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
                <label>
                 <input
                    type="checkbox"
                    class="controle-presenca"
                    data-presenca-id="${presenca.id}"
                    ${presenca.presente ? "checked" : ""}
                >

        <span>
            ${escaparHTML(
                membro?.nome ||
                "Membro não encontrado"
            )}
        </span>
        </label>

        <span>
        Grau ${escaparHTML(
            membro?.grau ?? "-"
        )}
         </span>

        <strong class="estado-presenca">
        ${
            presenca.presente
                ? "Presente"
                : "Ausente"
        }
         </strong>
        </div>
                        `;
        })
                    .join("")
        }
        </div>
    `;

    moduloSessaoAberta.style.display = "block";

    moduloSessaoAberta.removeEventListener(
    "change",
    alterarPresenca
);

moduloSessaoAberta.addEventListener(
    "change",
    alterarPresenca
);

    moduloSessaoAberta.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
   