"use strict";

function carregarModuloRelatorios() {
    return `
        <section class="cabecalho-pagina">
            <div>
                <h2>Relatórios</h2>

                <p>
                    Consulte a frequência dos membros por período.
                </p>
            </div>
        </section>

        <section class="painel">

            <h3>Período</h3>

            <div class="relatorio-filtros">

                <div class="campo-formulario">
                    <label for="dataInicialRelatorio">
                        Data inicial
                    </label>

                    <input
                        type="date"
                        id="dataInicialRelatorio"
                    >
                </div>

                <div class="campo-formulario">
                    <label for="dataFinalRelatorio">
                        Data final
                    </label>

                    <input
                        type="date"
                        id="dataFinalRelatorio"
                    >
                </div>

                <button
                    class="botao-primario"
                    id="botaoGerarRelatorio"
                >
                    Gerar relatório
                </button>

            </div>

            <div id="resultado-relatorio"></div>

        </section>
    `;
}