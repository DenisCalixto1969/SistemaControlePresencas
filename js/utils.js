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

/**
 * Localiza o grau que estava vigente em uma data.
 *
 * @param {Array} historicoGraus Registros do membro.
 * @param {string} dataReferencia Data no formato AAAA-MM-DD.
 * @returns {number|null}
 */
function obterGrauNoHistorico(
    historicoGraus,
    dataReferencia
) {
    if (
        !Array.isArray(historicoGraus) ||
        !dataReferencia
    ) {
        return null;
    }

    const registroVigente = historicoGraus.find(
        (registro) => {
            const iniciou =
                registro.dataInicio <= dataReferencia;

            const aindaEstavaVigente =
                registro.dataFim == null ||
                registro.dataFim >= dataReferencia;

            return iniciou && aindaEstavaVigente;
        }
    );

    if (!registroVigente) {
        return null;
    }

    return Number(registroVigente.grau);
}


/**
 * Busca no banco o grau de um membro em determinada data.
 *
 * @param {string} membroId
 * @param {string} dataReferencia Data no formato AAAA-MM-DD.
 * @returns {Promise<number|null>}
 */
async function buscarGrauMembroNaData(
    membroId,
    dataReferencia
) {
    if (!membroId || !dataReferencia) {
        return null;
    }

    const historicoCompleto = await listarRegistros(
        "historicoGraus"
    );

    const historicoDoMembro = historicoCompleto.filter(
        (registro) =>
            registro.membroId === membroId
    );

    return obterGrauNoHistorico(
        historicoDoMembro,
        dataReferencia
    );
}

async function membroEstavaAptoNaSessao(
    membro,
    sessao
) {
    if (
        !membro ||
        !sessao ||
        membro.ativo !== true
    ) {
        return false;
    }

    const grauNaData = await buscarGrauMembroNaData(
        membro.id,
        sessao.data
    );

    const grauConsiderado =
        grauNaData !== null
            ? grauNaData
            : Number(membro.grau);

    return (
        grauConsiderado >= Number(sessao.grau)
    );
}

async function listarSessoesPermitidas(
    membro,
    dataInicial,
    dataFinal
) {
    if (
        !membro ||
        !dataInicial ||
        !dataFinal
    ) {
        return [];
    }

    const todasSessoes = await listarRegistros(
        "sessoes"
    );

    const sessoesDoPeriodo = todasSessoes.filter(
        (sessao) =>
            sessao.data >= dataInicial &&
            sessao.data <= dataFinal
    );

    const resultados = await Promise.all(
        sessoesDoPeriodo.map(async (sessao) => {
            const apto = await membroEstavaAptoNaSessao(
                membro,
                sessao
            );

            return apto ? sessao : null;
        })
    );

    return resultados
        .filter(Boolean)
        .sort(
            (sessaoA, sessaoB) =>
                sessaoA.data.localeCompare(
                    sessaoB.data
                )
        );
}

async function calcularFrequenciaMembro(
    membro,
    dataInicial,
    dataFinal
) {
    const sessoesPermitidas =
        await listarSessoesPermitidas(
            membro,
            dataInicial,
            dataFinal
        );

    const todasPresencas = await listarRegistros(
        "presencas"
    );

    const idsSessoesPermitidas = new Set(
        sessoesPermitidas.map(
            (sessao) => sessao.id
        )
    );

    const presencasDoMembro =
        todasPresencas.filter(
            (presenca) =>
                presenca.membroId === membro.id &&
                idsSessoesPermitidas.has(
                    presenca.sessaoId
                )
        );

    const totalSessoes =
        sessoesPermitidas.length;

    const totalPresentes =
        presencasDoMembro.filter(
            (presenca) =>
                presenca.presente === true
        ).length;

    const totalAusentes =
        totalSessoes - totalPresentes;

    const percentual =
        totalSessoes > 0
            ? Number(
                (
                    totalPresentes /
                    totalSessoes *
                    100
                ).toFixed(2)
            )
            : 0;

    return {
        membroId: membro.id,
        totalSessoes,
        totalPresentes,
        totalAusentes,
        percentual,
        sessoesPermitidas
    };
}

function calcularDataIntersticio(dataInicial, meses) {
    if (!dataInicial || !meses) {
        return null;
    }

    const partes = dataInicial.split("-");

    if (partes.length !== 3) {
        return null;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]) - 1;
    const dia = Number(partes[2]);

    const data = new Date(
        ano,
        mes,
        dia,
        12,
        0,
        0
    );

    const diaOriginal = data.getDate();

    data.setDate(1);

    data.setMonth(
        data.getMonth() + Number(meses)
    );

    const ultimoDiaMes =
        new Date(
            data.getFullYear(),
            data.getMonth() + 1,
            0
        ).getDate();

    data.setDate(
        Math.min(
            diaOriginal,
            ultimoDiaMes
        )
    );

    const anoFinal =
        data.getFullYear();

    const mesFinal =
        String(
            data.getMonth() + 1
        ).padStart(2, "0");

    const diaFinal =
        String(
            data.getDate()
        ).padStart(2, "0");

    return `${anoFinal}-${mesFinal}-${diaFinal}`;
}
