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
    await clienteSupabase.auth.signOut();

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
    const botoesMenu = document.querySelectorAll(
        ".menu-botao"
    );

    botoesMenu.forEach((botao) => {
        botao.addEventListener(
            "click",
            async () => {
                const nomeModulo =
                    botao.dataset.modulo;

                atualizarBotaoAtivo(botao);

                try {
                    await abrirModulo(nomeModulo);
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
            }
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
