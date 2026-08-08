# Andamento do Projeto

## Última atualização
02/08/2026

## Versão atual
v0.2.0 em desenvolvimento

## Concluído
- Estrutura HTML, CSS e JavaScript
- Navegação entre módulos
- IndexedDB
- Cadastro de membros
- Pesquisa de membros
- Edição de membros
- Graus de membros até 33
- Ativação e Inativação de membros

## Próxima etapa
- Testar exclusão segura
- Implementar ordenação por nome e grau
- Concluir o módulo Membros

## Observações
- Sessões disponíveis somente nos graus 4, 9, 12, 13, 14, 15, 17 e 18.
- Membros podem possuir graus superiores e participar de todas as sessões inferiores.

## Versão atual
v0.2.2 concluída

## Concluído
- Estrutura HTML, CSS e JavaScript
- Navegação entre módulos
- IndexedDB
- Cadastro de membros
- Pesquisa por nome e grau
- Ordenação alfabética
- Edição de membros
- Ativação e inativação
- Exclusão segura
- Graus de membros até 33

## Próxima etapa
- Planejar o módulo Sessões
- Criar cadastro de sessões
- Gerar automaticamente a lista de presença


## Próxima etapa

- Configurar o botão Editar da tabela Sessões.
- Configurar a exclusão segura de sessões e suas presenças vinculadas.
- Configurar o botão Abrir Sessão.
- Construir a tela de lançamento de presenças.


## Marco de desenvolvimento — 08/08/2026

O Sistema Controle Presenças atingiu uma versão funcional estável de seus principais módulos.

Após implementação e testes, não foram identificadas anormalidades relevantes no funcionamento atual do sistema.

### Módulo Membros

O cadastro de membros encontra-se funcional, incluindo:

- cadastro de membro;
- edição;
- visualização;
- exclusão;
- ativação e inativação;
- pesquisa por nome e grau;
- ordenação alfabética;
- campos CIR, CIM e Observações;
- controle do grau atual do membro;
- histórico de alterações de grau.

### Histórico de graus

Foi implementado o histórico de graus dos membros.

Quando ocorre alteração de grau, o sistema mantém o registro histórico, permitindo identificar o grau que o membro possuía em determinado período.

Também foi implementado o cálculo de interstício para o próximo grau.

Interstícios cadastrados:

- Grau 4 → 9: 9 meses
- Grau 9 → 12: 9 meses
- Grau 12 → 13: 6 meses
- Grau 13 → 14: 6 meses
- Grau 14 → 15: 9 meses
- Grau 15 → 17: 9 meses
- Grau 17 → 18: 6 meses
- Grau 18 → 19: 9 meses
- Grau 19 → 22: 6 meses
- Grau 22 → 28: 6 meses
- Grau 28 → 30: 9 meses
- Grau 30 → 31: 12 meses
- Grau 31 → 32: 6 meses
- Grau 32 → 33: 24 meses

Para o grau atual, o sistema apresenta:

- data de início no grau;
- próximo grau;
- interstício necessário;
- data prevista para conclusão do interstício.

### Módulo Sessões

O módulo de sessões encontra-se funcional, incluindo:

- cadastro;
- edição;
- visualização;
- exclusão;
- abertura da sessão;
- encerramento;
- geração automática das presenças dos membros aptos;
- número sequencial da sessão;
- data;
- grau;
- tipo;
- observações;
- status da sessão.

Tipos de sessão atualmente previstos:

- Ordinária;
- Magna;
- Não Houve Sessão.

### Regra especial — Não Houve Sessão

Foi criada uma situação especial para registrar meses em que não ocorreu sessão.

Nessa situação:

- Tipo = Não Houve Sessão;
- Grau = 0;
- status = Não realizada;
- nenhuma presença é gerada;
- o registro não conta como sessão permitida;
- não gera presença;
- não gera ausência;
- não interfere no percentual de frequência;
- não participa do detalhamento das sessões realizadas nos relatórios.

Essa regra foi testada nos relatórios individual e geral.

### Regra de participação por grau

Para sessões efetivamente realizadas, somente membros aptos são incluídos no controle de presença.

A aptidão considera o grau que o membro possuía na data da sessão.

Dessa forma, alterações posteriores de grau não modificam indevidamente a análise histórica da frequência.

### Módulo Presenças

Foi implementada a consulta ao histórico de presenças.

A consulta permite filtrar por:

- data inicial;
- data final;
- membro específico;
- todos os membros.

Os resultados são apresentados agrupados por sessão, identificando os membros como Presente ou Ausente.

O módulo Presenças funciona como consulta histórica, enquanto o lançamento das presenças ocorre através da abertura da sessão.

### Relatórios

O módulo de relatórios encontra-se funcional.

É possível gerar relatório:

- individual por membro;
- geral para todos os membros;
- por período.

O relatório individual apresenta:

- sessões permitidas;
- presentes;
- ausentes;
- percentual de frequência;
- detalhamento das sessões;
- grau da sessão;
- grau que o membro possuía na data da sessão;
- situação da presença.

Cálculo da frequência:

Frequência = (Presenças / Sessões Permitidas) × 100

Registros do tipo "Não Houve Sessão" são desconsiderados integralmente no cálculo.

### Ranking

O Ranking de Frequência encontra-se implementado e funcional.

A classificação utiliza os mesmos cálculos de frequência utilizados pelos relatórios, garantindo consistência entre os módulos.

O ranking apresenta:

- classificação;
- membros em destaque;
- sessões permitidas;
- presenças;
- ausências;
- percentual de frequência;
- tratamento de posições empatadas.

### Dashboard

O Dashboard apresenta indicadores gerais do sistema e encontra-se integrado aos dados cadastrados.

### Banco de dados

O sistema utiliza IndexedDB para armazenamento local dos dados.

Principais tabelas utilizadas:

- membros;
- sessoes;
- presencas;
- historicoGraus.

### Situação atual

Os principais módulos do sistema foram implementados e testados.

Até o momento desta atualização, não foram identificadas anormalidades relevantes nos testes realizados.

O projeto entra agora em uma fase de consolidação, documentação e futuros aprimoramentos.