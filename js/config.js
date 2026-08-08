"use strict";

const CONFIG = {
    sistema: {
        nome: "Sistema Controle Presenças",
        versao: "0.1.0"
    },

    banco: {
        nome: "SistemaControlePresencasDB",
        versao: 3
    },

    grausMembros: [
        4,
        9,
        12,
        13,
        14,
        15,
        17,
        18,
        19,
        22,
        28,
        30,
        31,
        32,
        33
    ],

intersticiosGraus: {
    4: {
        proximoGrau: 9,
        meses: 9
    },

    9: {
        proximoGrau: 12,
        meses: 9
    },

    12: {
        proximoGrau: 13,
        meses: 6
    },

    13: {
        proximoGrau: 14,
        meses: 6
    },

    14: {
        proximoGrau: 15,
        meses: 9
    },

    15: {
        proximoGrau: 17,
        meses: 9
    },

    17: {
        proximoGrau: 18,
        meses: 6
    },

    18: {
        proximoGrau: 19,
        meses: 9
    },

    19: {
        proximoGrau: 22,
        meses: 6
    },

    22: {
        proximoGrau: 28,
        meses: 6
    },

    28: {
        proximoGrau: 30,
        meses: 9
    },

    30: {
        proximoGrau: 31,
        meses: 12
    },

    31: {
        proximoGrau: 32,
        meses: 6
    },

    32: {
        proximoGrau: 33,
        meses: 24
    }
},


    grausSessoes: [
        0,
        4,
        9,
        12,
        13,
        14,
        15,
        17,
        18
    ],

    tiposSessao: [
        "Ordinária",
        "Magna",
        "Não Houve Sessão"
    ]
};