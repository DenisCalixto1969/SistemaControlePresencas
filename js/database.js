"use strict";

let conexaoBanco = null;

function abrirBanco() {
    return new Promise((resolve, reject) => {
        if (conexaoBanco) {
            resolve(conexaoBanco);
            return;
        }

        const requisicao = indexedDB.open(
            CONFIG.banco.nome,
            CONFIG.banco.versao
        );

        requisicao.onupgradeneeded = (evento) => {
    const banco = evento.target.result;
    const transacao = evento.target.transaction;

    criarTabelaMembros(banco);
    criarTabelaSessoes(banco, transacao);
    criarTabelaPresencas(banco);
};

        requisicao.onsuccess = (evento) => {
            conexaoBanco = evento.target.result;

            conexaoBanco.onversionchange = () => {
                conexaoBanco.close();
                conexaoBanco = null;
            };

            resolve(conexaoBanco);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível abrir o banco: ${requisicao.error}`
                )
            );
        };
    });
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

async function adicionarRegistro(nomeTabela, registro) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readwrite"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.add(registro);

        requisicao.onsuccess = () => {
            resolve(registro);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível adicionar o registro: ${requisicao.error}`
                )
            );
        };
    });
}

async function atualizarRegistro(nomeTabela, registro) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readwrite"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.put(registro);

        requisicao.onsuccess = () => {
            resolve(registro);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível atualizar o registro: ${requisicao.error}`
                )
            );
        };
    });
}

async function buscarRegistroPorId(nomeTabela, id) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readonly"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.get(id);

        requisicao.onsuccess = () => {
            resolve(requisicao.result || null);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível localizar o registro: ${requisicao.error}`
                )
            );
        };
    });
}

async function listarRegistros(nomeTabela) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readonly"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.getAll();

        requisicao.onsuccess = () => {
            resolve(requisicao.result);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível listar os registros: ${requisicao.error}`
                )
            );
        };
    });
}

async function excluirRegistro(nomeTabela, id) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readwrite"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.delete(id);

        requisicao.onsuccess = () => {
            resolve(true);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível excluir o registro: ${requisicao.error}`
                )
            );
        };
    });
}

async function contarRegistros(nomeTabela) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readonly"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const requisicao = tabela.count();

        requisicao.onsuccess = () => {
            resolve(requisicao.result);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível contar os registros: ${requisicao.error}`
                )
            );
        };
    });
}

async function listarRegistrosPorIndice(
    nomeTabela,
    nomeIndice,
    valor
) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            nomeTabela,
            "readonly"
        );

        const tabela = transacao.objectStore(nomeTabela);
        const indice = tabela.index(nomeIndice);
        const requisicao = indice.getAll(valor);

        requisicao.onsuccess = () => {
            resolve(requisicao.result);
        };

        requisicao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível consultar os registros: ${requisicao.error}`
                )
            );
        };
    });
}

async function adicionarSessaoComPresencas(
    sessao,
    presencas
) {
    const banco = await abrirBanco();

    return new Promise((resolve, reject) => {
        const transacao = banco.transaction(
            ["sessoes", "presencas"],
            "readwrite"
        );

        const tabelaSessoes = transacao.objectStore("sessoes");
        const tabelaPresencas = transacao.objectStore("presencas");

        tabelaSessoes.add(sessao);

        presencas.forEach((presenca) => {
            tabelaPresencas.add(presenca);
        });

        transacao.oncomplete = () => {
            resolve({
                sessao,
                quantidadePresencas: presencas.length
            });
        };

        transacao.onerror = () => {
            reject(
                new Error(
                    `Não foi possível salvar a sessão: ${transacao.error}`
                )
            );
        };

        transacao.onabort = () => {
            reject(
                new Error(
                    `O salvamento da sessão foi cancelado: ${transacao.error}`
                )
            );
        };
    });
}