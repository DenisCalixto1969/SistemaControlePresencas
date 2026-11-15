"use strict";

document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacao
);

async function iniciarAplicacao() {
    configurarFormularioLogin();

    /*
     * Ao abrir ou atualizar o sistema,
     * encerramos qualquer sessão anterior.
     * Assim o acesso sempre exige
     * e-mail e senha novamente.
     */
    

    const telaLogin =
        document.querySelector("#tela-login");

    if (telaLogin) {
        telaLogin.style.display = "";
    }
}

async function iniciarSistema() {
    try {
        await abrirBanco();

        configurarMenu();

      await abrirModulo("inicio");

// Registra a tela inicial como ponto de partida
// da navegação entre os módulos.
history.replaceState(
    {
        sistemaModulo: true,
        modulo: "inicio"
    },
    "",
    window.location.href
);
        console.log(
            "Sistema Controle Presenças iniciado."
        );

        console.log(
            "Banco de dados aberto com sucesso."
        );
    } catch (erro) {
        console.error(
            "Erro ao iniciar o sistema:",
            erro
        );
    }
}

function configurarMenu() {

    const botoesMenu =
        document.querySelectorAll(".menu-botao");

    botoesMenu.forEach((botao) => {

        const perfilNecessario =
            botao.dataset.perfil;

        // Controlar visibilidade conforme o perfil
        if (
            perfilNecessario &&
            perfilUsuarioAtual !== perfilNecessario
        ) {
            botao.hidden = true;
        } else {
            botao.hidden = false;
        }

       botao.addEventListener("click", async () => {

    const nomeModulo = botao.dataset.modulo;

    // Evita criar histórico ao clicar no módulo já aberto.
    if (history.state?.modulo === nomeModulo) {
        return;
    }

    // Registra a navegação no histórico do navegador.
    history.pushState(
        {
            sistemaModulo: true,
            modulo: nomeModulo
        },
        "",
        window.location.href
    );

    try {
        await abrirModulo(nomeModulo);

        atualizarBotaoAtivo(botao);

    } catch (erro) {

        console.error(
            `Erro ao abrir o módulo ${nomeModulo}:`,
            erro
        );

        mostrarMensagem(
            "Não foi possível abrir o módulo.",
            "erro"
        );
    }
});

    });

    window.removeEventListener(
    "popstate",
    tratarNavegacaoHistorico
);

window.addEventListener(
    "popstate",
    tratarNavegacaoHistorico
);
}

function tratarNavegacaoHistorico(evento) {

    const estado = evento.state;

    // Só tratamos os registros criados pelo sistema.
    if (
        !estado ||
        !estado.sistemaModulo ||
        !estado.modulo
    ) {
        return;
    }

    const nomeModulo = estado.modulo;

    // Atualiza o conteúdo do módulo sem criar
    // uma nova entrada no histórico.
    abrirModulo(nomeModulo)
        .then(() => {

            const botao = document.querySelector(
                `.menu-botao[data-modulo="${nomeModulo}"]`
            );

            if (botao) {
                atualizarBotaoAtivo(botao);
            }

        })
        .catch((erro) => {

            console.error(
                "Erro ao recuperar módulo pelo histórico:",
                erro
            );

            mostrarMensagem(
                "Não foi possível recuperar o módulo.",
                "erro"
            );
        });
}

function atualizarBotaoAtivo(botaoSelecionado) {
    const botoesMenu = document.querySelectorAll(
        ".menu-botao"
    );

    botoesMenu.forEach((botao) => {
        botao.classList.remove("ativo");
    });

    botaoSelecionado.classList.add("ativo");
}

async function abrirModulo(nomeModulo) {
    const conteudoPrincipal = document.querySelector(
        "#conteudo-principal"
    );

    const moduloSessaoAberta =
    document.getElementById(
        "modulo-sessao-aberta"
    );

if (moduloSessaoAberta) {
    moduloSessaoAberta.style.display =
        "none";
}

    if (!conteudoPrincipal) {
        throw new Error(
            "O elemento #conteudo-principal não foi encontrado."
        );
    }

  // Bloquear acesso de membros ao módulo Presenças
if (
    nomeModulo === "presencas" &&
    perfilUsuarioAtual !== "administrador"
) {
    mostrarMensagem(
        "Você não tem permissão para acessar este módulo.",
        "erro"
    );

    await abrirModulo("inicio");
    return;
}  

    switch (nomeModulo) {
        case "membros":
            conteudoPrincipal.innerHTML =
                carregarModuloMembros();

            inicializarModuloMembros();
            break;

        case "sessoes":
            conteudoPrincipal.innerHTML =
                carregarModuloSessoes();

            inicializarModuloSessoes();
            break;

            case "presencas":
    conteudoPrincipal.innerHTML =
        carregarModuloPresencas();

    await inicializarModuloPresencas();
    break;
    
        case "relatorios":
            conteudoPrincipal.innerHTML =
            carregarModuloRelatorios();

            await carregarMembrosRelatorio();

            inicializarModuloRelatorios();
            break;

         case "ranking":
           conteudoPrincipal.innerHTML =
           carregarModuloRanking();

          inicializarModuloRanking();
          break;
          case "inicio":
          default:
         conteudoPrincipal.innerHTML =
         carregarModuloDashboard();

         await carregarDashboard();
         break;
}
}
