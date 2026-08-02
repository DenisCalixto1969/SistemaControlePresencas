"use strict";

function escaparHTML(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function mostrarMensagem(texto, tipo = "sucesso") {
    let container = document.querySelector("#mensagens-sistema");

    if (!container) {
        container = document.createElement("div");
        container.id = "mensagens-sistema";
        container.className = "mensagens-sistema";

        document.body.appendChild(container);
    }

    const mensagem = document.createElement("div");

    mensagem.className = `mensagem-sistema mensagem-${tipo}`;
    mensagem.textContent = texto;

    container.appendChild(mensagem);

    window.setTimeout(() => {
        mensagem.classList.add("mensagem-saindo");
    }, 3000);

    window.setTimeout(() => {
        mensagem.remove();
    }, 3400);
}

function formatarData(dataISO) {
    if (!dataISO) {
        return "—";
    }

    const partes = dataISO.split("-");

    if (partes.length !== 3) {
        return dataISO;
    }

    const [ano, mes, dia] = partes;

    return `${dia}/${mes}/${ano}`;
}

function obterDiaSemana(dataISO) {
    if (!dataISO) {
        return "";
    }

    const data = new Date(`${dataISO}T12:00:00`);

    return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long"
    }).format(data);
}

function formatarNumeroSessao(numero) {
    return String(numero).padStart(3, "0");
}
