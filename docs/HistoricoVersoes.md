# Histórico de Versões

## v0.1.0

**Data:** 02/08/2026

### Estrutura inicial

- Criação da estrutura do projeto.
- Criação dos arquivos HTML, CSS e JavaScript.
- Configuração do IndexedDB.
- Criação das tabelas iniciais do sistema.

---

## v0.2.0

### Módulo Membros

- Cadastro de membros.
- Pesquisa por nome e grau.
- Ordenação alfabética.
- Edição de membros.
- Campos CIR, CIM e Observações.

---

## v0.2.1

### Situação dos membros

- Ativação de membros.
- Inativação de membros.
- Persistência do status no banco de dados.

---

## v0.2.2

### Conclusão inicial do módulo Membros

- Exclusão de membros.
- Validações de cadastro.
- Persistência dos dados no IndexedDB.
- Suporte aos graus de membros até o grau 33.

---

## v0.3.0

### Módulo Sessões

- Cadastro de sessões.
- Numeração sequencial.
- Cadastro de data, grau, tipo e observações.
- Tipos Ordinária e Magna.
- Validação para impedir sessões com datas duplicadas.
- Edição de sessões.
- Exclusão de sessões.
- Visualização de sessões.
- Geração automática dos registros de presença.
- Seleção automática dos membros aptos conforme o grau da sessão.

---

## v0.4.0

### Controle de Presenças

- Abertura de sessões.
- Listagem dos membros aptos.
- Registro de Presente e Ausente.
- Atualização automática dos totais da sessão.
- Encerramento de sessões.
- Proteção contra edição de sessões encerradas.

---

## v0.5.0

### Relatórios

- Relatório individual por membro.
- Relatório geral.
- Filtro por período.
- Cálculo de sessões permitidas.
- Cálculo de presenças.
- Cálculo de ausências.
- Cálculo do percentual de frequência.
- Detalhamento das sessões do membro.

---

## v0.6.0

### Ranking de Frequência

- Criação do ranking de membros.
- Classificação por frequência.
- Exibição de sessões permitidas, presenças e ausências.
- Tratamento de empates.
- Destaque visual das primeiras posições.

---

## v0.7.0

### Dashboard

- Criação do painel inicial.
- Indicadores gerais do sistema.
- Membros ativos.
- Total de sessões.
- Frequência média.
- Melhor frequência.
- Membros abaixo de 75%.
- Última sessão.
- Últimas sessões.
- Ranking rápido.
- Melhorias visuais nos cartões e painéis.

---

## v0.8.0

### Histórico de Graus

- Criação do histórico de graus dos membros.
- Registro da data de início de cada grau.
- Preservação dos graus anteriores.
- Utilização do grau histórico nos cálculos de frequência.
- Visualização do histórico no cadastro do membro.

### Interstícios

- Cadastro dos períodos de interstício entre os graus.
- Identificação automática do próximo grau.
- Cálculo da data prevista para conclusão do interstício.

---

## v0.9.0

### Visualização e segurança operacional

- Visualização de membros sem necessidade de entrar no modo de edição.
- Visualização de sessões sem necessidade de entrar no modo de edição.
- Proteção das sessões encerradas contra alterações pelo fluxo normal.
- Melhorias no fluxo de consulta das informações.

---

## v0.10.0

### Registro "Não Houve Sessão"

- Inclusão do tipo "Não Houve Sessão".
- Utilização do grau 0 para esse tipo de registro.
- Status "Não realizada".
- Nenhum registro de presença é criado.
- O registro não conta como sessão permitida.
- O registro não gera ausência.
- O registro não interfere no percentual de frequência.
- Exclusão automática desses registros dos cálculos e detalhamentos de frequência.

---

## v0.11.0

### Consulta de Presenças

- Implementação do módulo Presenças.
- Consulta por período.
- Filtro por membro.
- Consulta de todos os membros.
- Agrupamento dos resultados por sessão.
- Identificação visual de Presente e Ausente.
- Melhorias visuais da tela de consulta.

---

## v0.12.0

**Data:** 08/08/2026

### Consolidação da versão funcional

- Revisão dos módulos principais.
- Integração das regras de histórico de graus aos cálculos.
- Correção dos relatórios para desconsiderar registros "Não Houve Sessão".
- Validação do relatório individual.
- Validação do relatório geral.
- Validação do Ranking.
- Revisão funcional de Membros, Sessões, Presenças, Relatórios, Ranking e Dashboard.
- Atualização da documentação do projeto.

### Situação

Os principais módulos do Sistema Controle Presenças encontram-se implementados e funcionais.

Esta versão passa a representar um marco estável do desenvolvimento antes da implementação de novas funcionalidades.

## v0.3.0

Data: 09/08/2026

### Backup e Restauração

- Implementada exportação completa do banco de dados para arquivo JSON.
- Backup das tabelas:
  - Membros;
  - Sessões;
  - Presenças;
  - Histórico de Graus.
- Inclusão da identificação e versão do backup.
- Inclusão da data e hora de geração do backup.
- Implementada seleção de arquivo JSON para restauração.
- Implementada validação do arquivo antes da restauração.
- Exibição da quantidade de registros encontrados no backup.
- Implementada confirmação de segurança antes da restauração.
- Restauração completa dos dados no IndexedDB.
- Preservação dos IDs e relacionamentos entre os registros.
- Recarregamento automático da aplicação após a restauração.

### Testes

Restauração testada com sucesso.

O backup utilizado continha:

- 4 membros;
- 10 sessões;
- 26 presenças;
- 5 registros de histórico de graus.

Após a criação do backup, foram adicionadas duas novas sessões,
totalizando 12 sessões.

Ao restaurar o backup anterior, o sistema retornou corretamente
para 10 sessões, confirmando a substituição dos dados atuais
pelos dados existentes no backup.

### Status

Backup e restauração concluídos e testados com sucesso.