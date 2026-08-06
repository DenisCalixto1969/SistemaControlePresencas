"use strict";

function carregarModuloRelatorios() {
    return `
   
    <section class="cabecalho-pagina">
            <div>
                <h2>Relatórios</h2>

                <p>
                    Consulte os dados de frequência por período.
                </p>
            </div>
        </section>

        <section class="painel">
            <form id="formulario-relatorio">
               <div class="grade-formulario-relatorio">

    <div class="grupo-campo">
        <label for="relatorio-data-inicial">
            Data inicial
        </label>

        <input
            type="date"
            id="relatorio-data-inicial"
            required
        >
    </div>

    <div class="grupo-campo">
        <label for="relatorio-data-final">
            Data final
        </label>

        <input
            type="date"
            id="relatorio-data-final"
            required
        >
    </div>

</div>

<div class="grupo-campo">
    <label for="relatorio-membro">
        Membro
    </label>

    <select id="relatorio-membro">
        <option value="">Todos os membros</option>
    </select>
</div>

<div class="grupo-botoes">
    <button
        type="submit"
        class="botao botao-primario"
    >
        Gerar relatório
    </button>
</div>
            </form>
        </section>

        <section
            class="area-resultado-relatorio oculto"
            id="resultado-relatorio"
        >
        </section>
    `;
}

async function carregarMembrosRelatorio() {
    const select = document.querySelector(
        "#relatorio-membro"
    );

    if (!select) {
        return;
    }

    const membros = await listarRegistros(
        "membros"
    );

    membros.sort((membroA, membroB) =>
        membroA.nome.localeCompare(
            membroB.nome,
            "pt-BR",
            {
                sensitivity: "base"
            }
        )
    );

    select.innerHTML = `
        <option value="">
            Todos os membros
        </option>

        ${membros
            .map((membro) => {
                return `
                    <option value="${membro.id}">
                        ${escaparHTML(membro.nome)}
                    </option>
                `;
            })
            .join("")}
    `;
}

