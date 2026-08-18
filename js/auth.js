"use strict";

async function obterSessaoAtual() {
    const { data, error } =
        await clienteSupabase.auth.getSession();

    if (error) {
        console.error(
            "Erro ao verificar sessão:",
            error
        );

        return null;
    }

    return data.session;
}

async function entrarNoSistema(email, senha) {
    const { data, error } =
        await clienteSupabase.auth.signInWithPassword({
            email,
            password: senha
        });

    if (error) {
        console.error(
            "Erro ao realizar login:",
            error
        );

        return {
            sucesso: false,
            mensagem: "E-mail ou senha inválidos."
        };
    }

    return {
        sucesso: true,
        sessao: data.session,
        usuario: data.user
    };
}

async function sairDoSistema() {
    const { error } =
        await clienteSupabase.auth.signOut();

    if (error) {
        console.error(
            "Erro ao sair do sistema:",
            error
        );

        return;
    }

    window.location.reload();
}


function configurarFormularioLogin() {
    const formulario =
        document.querySelector("#formulario-login");

    const mensagem =
        document.querySelector("#mensagem-login");

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        async (evento) => {
            evento.preventDefault();

            const email = document
                .querySelector("#login-email")
                .value
                .trim();

            const senha = document
                .querySelector("#login-senha")
                .value;

            mensagem.textContent = "Entrando...";

            const resultado =
                await entrarNoSistema(email, senha);

            if (!resultado.sucesso) {
                mensagem.textContent =
                    resultado.mensagem;

                return;
            }

            mensagem.textContent = "";

            const telaLogin =
                document.querySelector("#tela-login");

            if (telaLogin) {
                telaLogin.style.display = "none";
            }

            await iniciarSistema();
        }
    );
}

const botaoSair =
    document.querySelector("#botao-sair");

if (botaoSair) {
    botaoSair.addEventListener(
        "click",
        sairDoSistema
    );
}