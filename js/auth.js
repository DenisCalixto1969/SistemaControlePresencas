"use strict";

let usuarioAutenticadoAtual = null;
let perfilUsuarioAtual = null;
let membroVinculadoAtual = null;

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

// Identificar o perfil do usuário
function identificarPerfilUsuario(usuario) {

    const email = usuario.email.toLowerCase();

    if (CONFIG.administradores.includes(email)) {
        return "administrador";
    }

    return "membro";
}

// Localizar o membro vinculado ao usuário autenticado
async function carregarVinculoMembro(usuario) {

    const { data, error } = await clienteSupabase
        .from("usuarios_membros")
        .select("membro_id")
        .eq("user_id", usuario.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Erro ao consultar vínculo do membro:",
            error
        );

        return null;
    }

    return data;
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

            usuarioAutenticadoAtual = resultado.usuario;

perfilUsuarioAtual =
    identificarPerfilUsuario(resultado.usuario);

membroVinculadoAtual = null;

// Administradores não precisam de vínculo com membros
if (perfilUsuarioAtual === "membro") {

    const vinculo =
        await carregarVinculoMembro(resultado.usuario);

    if (!vinculo) {

        await clienteSupabase.auth.signOut();

        usuarioAutenticadoAtual = null;
        perfilUsuarioAtual = null;
        membroVinculadoAtual = null;

        mensagem.textContent =
            "Usuário ainda não vinculado a um membro. Procure o administrador.";

        return;
    }

    membroVinculadoAtual = vinculo.membro_id;
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

// Mostrar / ocultar senha
const botaoMostrarSenha = document.getElementById("mostrar-senha");
const campoSenha = document.getElementById("login-senha");

if (botaoMostrarSenha && campoSenha) {

    botaoMostrarSenha.addEventListener("click", function () {

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        botaoMostrarSenha.textContent = "🙈";
        botaoMostrarSenha.setAttribute("aria-label", "Ocultar senha");
    } else {
        campoSenha.type = "password";
        botaoMostrarSenha.textContent = "👁️";
        botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
    }

});
}