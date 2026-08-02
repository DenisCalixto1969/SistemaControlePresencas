"use strict";

class Membro {
    constructor(dados = {}) {
        const agora = new Date().toISOString();

        this.id = dados.id || crypto.randomUUID();
        this.nome = dados.nome || "";
        this.grau = Number(dados.grau) || 4;
        this.cir = dados.cir || "";
        this.cim = dados.cim || "";
        this.observacoes = dados.observacoes || "";
        this.ativo = dados.ativo ?? true;
        this.dataCadastro = dados.dataCadastro || agora;
        this.dataUltimaAlteracao =
            dados.dataUltimaAlteracao || agora;
    }
}

class Sessao {
    constructor(dados = {}) {
        const agora = new Date().toISOString();

        this.id = dados.id || crypto.randomUUID();
        this.data = dados.data || "";
        this.grau = Number(dados.grau) || 4;
        this.tipo = dados.tipo || "Ordinária";
        this.observacoes = dados.observacoes || "";
        this.dataCadastro = dados.dataCadastro || agora;
        this.dataUltimaAlteracao =
            dados.dataUltimaAlteracao || agora;
    }
}

class Presenca {
    constructor(dados = {}) {
        const agora = new Date().toISOString();

        this.id = dados.id || crypto.randomUUID();
        this.sessaoId = dados.sessaoId || "";
        this.membroId = dados.membroId || "";
        this.presente = dados.presente ?? false;
        this.dataCadastro = dados.dataCadastro || agora;
        this.dataUltimaAlteracao =
            dados.dataUltimaAlteracao || agora;
    }
}