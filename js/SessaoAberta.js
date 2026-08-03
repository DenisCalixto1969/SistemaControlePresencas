"use strict";

async function carregarSessaoAberta(idSessao) {
    console.log("Abrindo sessão:", idSessao);

    const sessao = await buscarRegistroPorId(
        "sessoes",
        idSessao
    );

    console.log("Dados da sessão:", sessao);

    const todasPresencas = await listarRegistros(
        "presencas"
    );

    const presencas = todasPresencas.filter(
        (presenca) => presenca.sessaoId === idSessao
    );

    const membrosDaSessao = await Promise.all(
        presencas.map(async (presenca) => {
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

    console.log(
        "Membros da sessão:",
        membrosDaSessao
    );

    console.table(
    membrosDaSessao.map(item => ({
        nome: item.membro?.nome,
        grau: item.membro?.grau,
        presente: item.presenca.presente
    }))
);

}