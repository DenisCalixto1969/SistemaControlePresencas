# Especificação Funcional
## Sistema Controle Presenças

**Versão do documento:** 1.0  
**Data:** 08/08/2026

---

## 1. Objetivo do sistema

O Sistema Controle Presenças tem como objetivo realizar o cadastro de membros, sessões, controle de presença, histórico de graus, cálculo de frequência, relatórios e ranking de frequência.

O sistema foi desenvolvido para atender às regras específicas de participação dos membros nas sessões conforme seus respectivos graus.

---

## 2. Módulos do sistema

O sistema é composto pelos seguintes módulos:

- Início / Dashboard
- Membros
- Sessões
- Presenças
- Relatórios
- Ranking

---

## 3. Membros

### 3.1 Dados do membro

Cada membro possui os seguintes dados principais:

- Nome
- Grau
- Situação: Ativo ou Inativo
- CIR
- CIM
- Observações
- Data de cadastro
- Data da última alteração

### 3.2 Graus dos membros

Os graus previstos para membros são:

- 4
- 9
- 12
- 13
- 14
- 15
- 17
- 18
- 19
- 22
- 28
- 30
- 31
- 32
- 33

### 3.3 Situação do membro

Somente membros ativos participam normalmente das regras de geração de presença.

Membros inativos permanecem cadastrados para preservação das informações históricas.

### 3.4 Histórico de graus

O sistema mantém o histórico das alterações de grau de cada membro.

Cada registro histórico permite identificar:

- grau;
- data de início;
- data de término, quando aplicável.

O registro sem data de término representa o grau atual do membro.

O histórico deve permitir determinar qual era o grau do membro em determinada data.

---

## 4. Interstício entre graus

O sistema calcula o período mínimo previsto para progressão ao próximo grau.

Os interstícios utilizados são:

| Grau atual | Próximo grau | Interstício |
|---|---|---:|
| 4 | 9 | 9 meses |
| 9 | 12 | 9 meses |
| 12 | 13 | 6 meses |
| 13 | 14 | 6 meses |
| 14 | 15 | 9 meses |
| 15 | 17 | 9 meses |
| 17 | 18 | 6 meses |
| 18 | 19 | 9 meses |
| 19 | 22 | 6 meses |
| 22 | 28 | 6 meses |
| 28 | 30 | 9 meses |
| 30 | 31 | 12 meses |
| 31 | 32 | 6 meses |
| 32 | 33 | 24 meses |

Para o grau atual, o sistema apresenta:

- data de início no grau;
- próximo grau;
- quantidade de meses de interstício;
- data prevista para conclusão do interstício.

O grau 33 não possui próximo grau cadastrado no sistema.

---

## 5. Sessões

### 5.1 Dados da sessão

Cada sessão possui:

- Número
- Data
- Grau
- Tipo
- Observações
- Status
- Data de cadastro
- Data da última alteração

### 5.2 Graus das sessões

As sessões efetivamente realizadas podem utilizar os seguintes graus:

- 4
- 9
- 12
- 13
- 14
- 15
- 17
- 18

O grau 0 é reservado exclusivamente para o registro especial "Não Houve Sessão".

### 5.3 Tipos de sessão

Os tipos previstos são:

- Ordinária
- Magna
- Não Houve Sessão

### 5.4 Numeração

As sessões recebem numeração sequencial pelo sistema.

### 5.5 Data

Não deve existir mais de uma sessão cadastrada para a mesma data.

### 5.6 Status

As sessões podem possuir estados conforme seu fluxo operacional.

Entre os estados atualmente utilizados estão:

- Aberta
- Encerrada
- Não realizada

Sessões encerradas não podem ser alteradas através do fluxo normal de edição.

---

## 6. Regra de participação por grau

Um membro somente participa de uma sessão quando estiver apto para o grau daquela sessão.

A regra básica é:

**Grau do membro >= Grau da sessão**

Exemplos:

- membro grau 4 participa de sessão grau 4;
- membro grau 9 participa das sessões graus 4 e 9;
- membro grau 12 participa das sessões graus 4, 9 e 12;
- membros com graus superiores a 18 podem participar das sessões existentes até o grau 18.

A análise histórica deve considerar o grau que o membro possuía na data da sessão, e não simplesmente seu grau atual.

---

## 7. Geração de presenças

Ao cadastrar uma sessão efetivamente realizada, o sistema gera automaticamente os registros de presença dos membros aptos.

Cada registro de presença relaciona:

- sessão;
- membro;
- situação Presente/Ausente.

Inicialmente, os membros aptos são considerados ausentes até que sua presença seja registrada.

Membros que não são aptos para determinada sessão não recebem registro de presença para aquela sessão.

---

## 8. Abertura e encerramento da sessão

Uma sessão aberta permite realizar o controle de presença dos membros aptos.

Durante o controle são apresentados:

- dados da sessão;
- membros aptos;
- situação individual de presença;
- total de membros;
- presentes;
- ausentes.

O encerramento consolida a situação da sessão.

Sessões encerradas ficam protegidas contra edição pelo fluxo normal.

---

## 9. Não Houve Sessão

O sistema permite registrar um mês ou data em que não ocorreu sessão.

Esse registro utiliza:

- Tipo: Não Houve Sessão
- Grau: 0
- Status: Não realizada

Nesse caso:

- não são gerados registros de presença;
- não existem membros aptos;
- não gera ausência;
- não gera presença;
- não conta como sessão permitida;
- não interfere no percentual de frequência;
- não deve penalizar nenhum membro;
- não participa do detalhamento das sessões realizadas nos relatórios.

O registro existe apenas para manter o histórico de que naquele período não ocorreu sessão.

---

## 10. Consulta de Presenças

O módulo Presenças é utilizado para consulta do histórico.

Permite informar:

- Data inicial
- Data final
- Membro

O filtro de membro permite:

- Todos os membros
- Um membro específico

Os resultados são apresentados por sessão e mostram a situação de presença dos membros participantes.

O lançamento ou alteração da presença ocorre através do fluxo da sessão.

---

## 11. Relatórios

### 11.1 Relatório individual

O relatório individual apresenta:

- membro;
- período;
- sessões permitidas;
- presentes;
- ausentes;
- percentual de frequência;
- detalhamento das sessões.

No detalhamento são apresentados, entre outras informações:

- data;
- número da sessão;
- tipo;
- grau da sessão;
- grau do membro na data;
- situação da presença.

### 11.2 Relatório geral

O relatório geral apresenta os resultados dos membros no período selecionado.

Para cada membro são apresentados:

- sessões permitidas;
- presentes;
- ausentes;
- percentual de frequência.

---

## 12. Cálculo de frequência

A frequência é calculada pela fórmula:

**Frequência = (Total de Presenças / Total de Sessões Permitidas) × 100**

Quando não existem sessões permitidas, o percentual é considerado 0 para evitar divisão por zero.

O total de ausências é calculado por:

**Ausências = Sessões Permitidas - Presenças**

Registros do tipo "Não Houve Sessão" são excluídos desse cálculo.

---

## 13. Ranking de frequência

O Ranking utiliza a mesma regra de cálculo dos relatórios.

A classificação considera o percentual de frequência dos membros no período selecionado.

O ranking apresenta:

- posição;
- membro;
- sessões permitidas;
- presentes;
- ausentes;
- percentual de frequência.

O sistema também trata situações de empate na classificação.

Dessa forma, Relatórios e Ranking utilizam a mesma origem de cálculo e devem apresentar resultados consistentes.

---

## 14. Dashboard

O Dashboard apresenta uma visão geral dos principais indicadores do sistema.

Os indicadores são obtidos a partir dos dados cadastrados no banco de dados.

---

## 15. Armazenamento de dados

O sistema utiliza IndexedDB para armazenamento local.

As principais tabelas são:

### membros

Armazena os dados cadastrais dos membros.

### sessoes

Armazena as sessões e registros de meses sem sessão.

### presencas

Relaciona membros e sessões para controle da frequência.

### historicoGraus

Mantém o histórico das alterações de grau dos membros.

---

## 16. Regras de integridade

O sistema deve preservar as seguintes regras:

1. Uma data de sessão não pode ser cadastrada em duplicidade.
2. Somente membros aptos devem possuir presença em uma sessão.
3. A aptidão histórica deve respeitar o grau do membro na data da sessão.
4. Alterações posteriores de grau não devem modificar incorretamente os cálculos históricos.
5. "Não Houve Sessão" nunca deve gerar presença ou ausência.
6. "Não Houve Sessão" nunca deve entrar no cálculo de frequência.
7. Relatórios e Ranking devem utilizar a mesma regra de cálculo.
8. Dados históricos devem ser preservados sempre que necessários para os cálculos do sistema.

---

## 17. Situação da versão atual

Nesta versão encontram-se funcionais:

- Dashboard
- Cadastro e manutenção de membros
- Histórico de graus
- Cálculo de interstício
- Cadastro e manutenção de sessões
- Controle de presenças
- Encerramento de sessões
- Registro de "Não Houve Sessão"
- Consulta histórica de presenças
- Relatório individual
- Relatório geral
- Ranking de frequência

Os principais fluxos foram testados e encontram-se funcionando de acordo com as regras atualmente definidas.

---

## 18. Evoluções futuras

Novas funcionalidades poderão ser incorporadas posteriormente conforme a necessidade.

Possíveis evoluções deverão ser analisadas antes da implementação e registradas nesta especificação quando aprovadas.

## Backup e Restauração de Dados

### Objetivo

Permitir a criação de uma cópia de segurança dos dados do sistema e sua
posterior restauração em caso de perda, alteração indevida ou necessidade
de retornar o banco de dados a um estado anterior.

### Dados incluídos no backup

O backup deve armazenar os dados das seguintes tabelas:

- Membros;
- Sessões;
- Presenças;
- Histórico de Graus.

Além dos dados das tabelas, o arquivo de backup deve possuir informações
de identificação, incluindo:

- nome do sistema;
- versão do backup;
- data e hora de geração.

### Exportação

O usuário pode gerar um arquivo de backup através da opção
"Exportar Backup" disponível no Dashboard.

O sistema deve:

1. Ler os registros armazenados no IndexedDB.
2. Reunir os dados em uma estrutura única.
3. Gerar um arquivo no formato JSON.
4. Efetuar o download do arquivo para o computador do usuário.

### Seleção e validação do backup

Antes de permitir uma restauração, o sistema deve validar o arquivo
selecionado.

A validação deve verificar se o arquivo possui uma estrutura de backup
reconhecida pelo sistema.

Após a validação, o sistema deve informar a quantidade de:

- membros;
- sessões;
- presenças;
- registros do histórico de graus.

Arquivos inválidos não devem ser utilizados para restauração.

### Confirmação da restauração

A restauração nunca deve ocorrer imediatamente após a seleção do arquivo.

O usuário deve acionar a opção "Restaurar Backup".

Antes da execução, o sistema deve apresentar uma confirmação informando
que os dados atuais serão substituídos.

A confirmação também deve apresentar um resumo dos dados existentes
no backup selecionado.

Caso o usuário cancele a confirmação, nenhuma alteração deve ser
realizada no banco de dados.

### Execução da restauração

Após a confirmação do usuário, o sistema deve:

1. Restaurar os dados de Membros.
2. Restaurar os dados de Sessões.
3. Restaurar os dados de Presenças.
4. Restaurar os dados do Histórico de Graus.
5. Preservar os identificadores dos registros existentes no backup.
6. Manter os relacionamentos entre membros, sessões e presenças.
7. Recarregar a aplicação após a conclusão.

### Resultado esperado

Após a restauração, o banco IndexedDB deve representar o mesmo estado
dos dados existente no momento em que o backup foi gerado.

A restauração substitui os dados atuais pelos dados existentes no
arquivo de backup selecionado.