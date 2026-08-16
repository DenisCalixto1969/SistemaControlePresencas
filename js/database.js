"use strict";

let conexaoBanco = null;
async function abrirBanco() {
    const sessao = await obterSessaoAtual();

    if (!sessao) {
        throw new Error(
            "Usuário não autenticado."
        );
    }

    return true;
}
function criarTabelaMembros(banco) {
    if (banco.objectStoreNames.contains("membros")) {
        return;
    }

    const tabela = banco.createObjectStore("membros", {
        keyPath: "id"
    });

    tabela.createIndex("nome", "nome", {
        unique: false
    });

    tabela.createIndex("grau", "grau", {
        unique: false
    });

    tabela.createIndex("ativo", "ativo", {
        unique: false
    });
}

function criarTabelaSessoes(banco, transacao) {
    let tabela;

    if (!banco.objectStoreNames.contains("sessoes")) {
        tabela = banco.createObjectStore("sessoes", {
            keyPath: "id"
        });
    } else {
        tabela = transacao.objectStore("sessoes");
    }

    if (!tabela.indexNames.contains("numero")) {
        tabela.createIndex("numero", "numero", {
            unique: true
        });
    }

    if (!tabela.indexNames.contains("data")) {
        tabela.createIndex("data", "data", {
            unique: false
        });
    }

    if (!tabela.indexNames.contains("grau")) {
        tabela.createIndex("grau", "grau", {
            unique: false
        });
    }

    if (!tabela.indexNames.contains("tipo")) {
        tabela.createIndex("tipo", "tipo", {
            unique: false
        });
    }
}

function criarTabelaPresencas(banco) {
    if (banco.objectStoreNames.contains("presencas")) {
        return;
    }

    const tabela = banco.createObjectStore("presencas", {
        keyPath: "id"
    });

    tabela.createIndex("sessaoId", "sessaoId", {
        unique: false
    });

    tabela.createIndex("membroId", "membroId", {
        unique: false
    });

    tabela.createIndex(
        "sessaoMembro",
        ["sessaoId", "membroId"],
        {
            unique: true
        }
    );
}

function criarTabelaHistoricoGraus(banco) {
    if (
        banco.objectStoreNames.contains(
            "historicoGraus"
        )
    ) {
        return;
    }

    const tabela = banco.createObjectStore(
        "historicoGraus",
        {
            keyPath: "id"
        }
    );

    tabela.createIndex(
        "membroId",
        "membroId",
        {
            unique: false
        }
    );

    tabela.createIndex(
        "dataInicio",
        "dataInicio",
        {
            unique: false
        }
    );

    tabela.createIndex(
        "membroData",
        [
            "membroId",
            "dataInicio"
        ],
        {
            unique: true
        }
    );
}

function converterRegistroParaSupabase(registro) {
    const convertido = {};

    Object.entries(registro).forEach(
        ([chave, valor]) => {
            const novaChave = chave
                .replace("sessaoId", "sessao_id")
                .replace("membroId", "membro_id")
                .replace("dataInicio", "data_inicio")
                .replace("dataFim", "data_fim")
                .replace("dataCadastro", "data_cadastro")
                .replace(
                    "dataUltimaAlteracao",
                    "data_ultima_alteracao"
                );

            convertido[novaChave] = valor;
        }
    );

    return convertido;
}

function converterRegistroDoSupabase(registro) {
    const convertido = {};

    Object.entries(registro).forEach(
        ([chave, valor]) => {
            const novaChave = chave
                .replace("sessao_id", "sessaoId")
                .replace("membro_id", "membroId")
                .replace("data_inicio", "dataInicio")
                .replace("data_fim", "dataFim")
                .replace("data_cadastro", "dataCadastro")
                .replace(
                    "data_ultima_alteracao",
                    "dataUltimaAlteracao"
                );

            convertido[novaChave] = valor;
        }
    );

    return convertido;
}


async function adicionarRegistro(
    nomeTabela,
    registro
) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const registroSupabase =
        converterRegistroParaSupabase(registro);

    const { error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .insert(registroSupabase);

    if (error) {
        throw new Error(
            `Não foi possível adicionar o registro: ${error.message}`
        );
    }

    return registro;
}
async function atualizarRegistro(
    nomeTabela,
    registro
) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const registroSupabase =
        converterRegistroParaSupabase(registro);

    const { error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .update(registroSupabase)
            .eq("id", registro.id);

    if (error) {
        throw new Error(
            `Não foi possível atualizar o registro: ${error.message}`
        );
    }

    return registro;
}

async function buscarRegistroPorId(nomeTabela, id) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const { data, error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .select("*")
            .eq("id", id)
            .maybeSingle();

    if (error) {
        throw new Error(
            `Não foi possível localizar o registro: ${error.message}`
        );
    }

   return data
    ? converterRegistroDoSupabase(data)
    : null;
}

async function listarRegistros(nomeTabela) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const { data, error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .select("*");

    if (error) {
        throw new Error(
            `Não foi possível listar os registros: ${error.message}`
        );
    }

return (data || []).map(
    converterRegistroDoSupabase
);

}

async function excluirRegistro(nomeTabela, id) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const { error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .delete()
            .eq("id", id);

    if (error) {
        throw new Error(
            `Não foi possível excluir o registro: ${error.message}`
        );
    }

    return true;
}

async function contarRegistros(nomeTabela) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const { count, error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .select("*", {
                count: "exact",
                head: true
            });

    if (error) {
        throw new Error(
            `Não foi possível contar os registros: ${error.message}`
        );
    }

    return count || 0;
}

async function listarRegistrosPorIndice(
    nomeTabela,
    nomeIndice,
    valor
) {
    const nomeTabelaSupabase =
        nomeTabela === "historicoGraus"
            ? "historico_graus"
            : nomeTabela;

    const nomeIndiceSupabase =
        nomeIndice
            .replace("sessaoId", "sessao_id")
            .replace("membroId", "membro_id")
            .replace("dataInicio", "data_inicio");

    const { data, error } =
        await clienteSupabase
            .from(nomeTabelaSupabase)
            .select("*")
            .eq(nomeIndiceSupabase, valor);

    if (error) {
        throw new Error(
            `Não foi possível consultar os registros: ${error.message}`
        );
    }

    return (data || []).map(
        converterRegistroDoSupabase
    );
}
async function adicionarSessaoComPresencas(
    sessao,
    presencas
) {
    const sessaoSupabase =
        converterRegistroParaSupabase(sessao);

    const presencasSupabase =
        presencas.map(
            converterRegistroParaSupabase
        );

    const { error: erroSessao } =
        await clienteSupabase
            .from("sessoes")
            .insert(sessaoSupabase);

    if (erroSessao) {
        throw new Error(
            `Erro ao salvar sessão: ${erroSessao.message}`
        );
    }

    if (presencasSupabase.length > 0) {
        const { error: erroPresencas } =
            await clienteSupabase
                .from("presencas")
                .insert(presencasSupabase);

        if (erroPresencas) {
            await clienteSupabase
                .from("sessoes")
                .delete()
                .eq("id", sessao.id);

            throw new Error(
                `Erro ao salvar presenças: ${erroPresencas.message}`
            );
        }
    }

    return {
        sessao,
        quantidadePresencas: presencas.length
    };
}


async function excluirSessaoComPresencas(sessaoId) {
    const { error } =
        await clienteSupabase
            .from("sessoes")
            .delete()
            .eq("id", sessaoId);

    if (error) {
        throw new Error(
            `Não foi possível excluir a sessão: ${error.message}`
        );
    }

    return true;
}

async function restaurarDadosBackup(dadosBackup) {
    const banco = await abrirBanco();

    const nomesTabelas = [
        "membros",
        "sessoes",
        "presencas",
        "historicoGraus"
    ];

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomesTabelas,
            "readwrite"
        );

        const tabelaMembros =
            transacao.objectStore("membros");

        const tabelaSessoes =
            transacao.objectStore("sessoes");

        const tabelaPresencas =
            transacao.objectStore("presencas");

        const tabelaHistoricoGraus =
            transacao.objectStore("historicoGraus");

        // Primeiro limpa os dados atuais.
        tabelaMembros.clear();
        tabelaSessoes.clear();
        tabelaPresencas.clear();
        tabelaHistoricoGraus.clear();

        // Restaura os membros.
        dadosBackup.membros.forEach((membro) => {
            tabelaMembros.add(membro);
        });

        // Restaura as sessões.
        dadosBackup.sessoes.forEach((sessao) => {
            tabelaSessoes.add(sessao);
        });

        // Restaura as presenças.
        dadosBackup.presencas.forEach((presenca) => {
            tabelaPresencas.add(presenca);
        });

        // Restaura o histórico de graus.
        dadosBackup.historicoGraus.forEach((historico) => {
            tabelaHistoricoGraus.add(historico);
        });

        transacao.oncomplete = () => {
            resolve(true);
        };

        transacao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível restaurar o backup: ${
                        transacao.error?.message ||
                        "erro desconhecido"
                    }`
                )
            );
        };

        transacao.onabort = () => {
            reject(
                new Error(
                    `A restauração foi cancelada: ${
                        transacao.error?.message ||
                        "erro desconhecido"
                    }`
                )
            );
        };
    });
}