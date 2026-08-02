"use strict";

document.addEventListener("DOMContentLoaded", iniciarSistema);

function iniciarSistema() {
    console.log("Sistema Controle Presenças iniciado.");

    configurarMenu();
}

function configurarMenu() {
    const botoesMenu = document.querySelectorAll(".menu-botao");

    botoesMenu.forEach((botao) => {
        botao.addEventListener("click", () => {
            removerMenuAtivo(botoesMenu);
            botao.classList.add("ativo");

            const nomeModulo = botao.textContent.trim();

            console.log(`Módulo selecionado: ${nomeModulo}`);
        });
    });
}

function removerMenuAtivo(botoesMenu) {
    botoesMenu.forEach((botao) => {
        botao.classList.remove("ativo");
    });
}