"use strict";

async function carregarSessaoAberta(idSessao) {

    console.log("Abrindo sessão:", idSessao);

    const sessao = await buscarRegistroPorId(
        "sessoes",
        idSessao
    );

    console.log("Dados da sessão:", sessao);

}