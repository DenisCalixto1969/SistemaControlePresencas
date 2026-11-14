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
// Mostrar a área de recuperação de senha
const botaoEsqueciSenha =
    document.getElementById("botao-esqueci-senha");

const areaRecuperacao =
    document.getElementById("area-recuperacao");

if (botaoEsqueciSenha && areaRecuperacao) {
    botaoEsqueciSenha.addEventListener("click", () => {
        areaRecuperacao.style.display = "block";

        const emailLogin =
            document.getElementById("login-email").value.trim();

        document.getElementById("email-recuperacao").value =
            emailLogin;
    });
}

// Enviar link de recuperação
const botaoEnviarRecuperacao =
    document.getElementById("botao-enviar-recuperacao");

if (botaoEnviarRecuperacao) {
    botaoEnviarRecuperacao.addEventListener("click", async () => {
        const email = document
            .getElementById("email-recuperacao")
            .value.trim();

        const mensagem =
            document.getElementById("mensagem-recuperacao");

        if (!email) {
            mensagem.textContent = "Informe seu e-mail.";
            return;
        }

        mensagem.textContent = "Enviando link...";

      const { error } =
    await clienteSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://deniscalixto1969.github.io/SistemaControlePresencas/"
    });
        if (error) {
            console.error("Erro ao solicitar recuperação:", error);
            mensagem.textContent =
                "Não foi possível enviar o link. Tente novamente.";
            return;
        }

        mensagem.textContent =
            "Link enviado! Verifique seu e-mail.";
    });
}

// Detectar acesso pelo link de recuperação de senha
clienteSupabase.auth.onAuthStateChange((evento, sessao) => {

    if (evento === "PASSWORD_RECOVERY") {

        document.getElementById("formulario-login").style.display = "none";
        document.getElementById("botao-esqueci-senha").style.display = "none";
        document.getElementById("area-recuperacao").style.display = "none";

        document.getElementById("area-nova-senha").style.display = "block";
    }

});

// Salvar a nova senha
const botaoSalvarNovaSenha = document.getElementById("botao-salvar-nova-senha");

if (botaoSalvarNovaSenha) {
    botaoSalvarNovaSenha.addEventListener("click", async () => {

        const novaSenha = document.getElementById("nova-senha").value;
        const confirmarSenha = document.getElementById("confirmar-nova-senha").value;
        const mensagem = document.getElementById("mensagem-nova-senha");

        if (novaSenha.length < 6) {
            mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
            return;
        }

        if (novaSenha !== confirmarSenha) {
            mensagem.textContent = "As senhas não coincidem.";
            return;
        }

        mensagem.textContent = "Salvando nova senha...";

        const { error } = await clienteSupabase.auth.updateUser({
            password: novaSenha
        });

        if (error) {
            mensagem.textContent = "Erro ao salvar senha: " + error.message;
            return;
        }

        mensagem.textContent = "Senha alterada com sucesso! Faça login com sua nova senha.";

        await clienteSupabase.auth.signOut();

        document.getElementById("area-nova-senha").style.display = "none";
        document.getElementById("formulario-login").style.display = "block";
        document.getElementById("botao-esqueci-senha").style.display = "block";

    });
}