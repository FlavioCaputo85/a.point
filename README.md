# Arqui — Cruzadinha Computacional

Jogo de revisão de arquitetura computacional, feito exclusivamente com HTML, CSS e JavaScript, sem bibliotecas, fontes externas ou etapa de instalação.

## Site publicado

PREENCHA AQUI com o endereço real após publicar no GitHub Pages.

## Como jogar

Abra index.html no navegador. Escolha uma pista ou uma casa e digite. Letras são convertidas para maiúsculas, sem acentos. Cada cruzamento compartilha a mesma casa.

- Setas: navegar e selecionar a direção.
- Espaço: alternar direção em cruzamentos.
- Backspace: apagar; numa casa vazia, voltar e apagar a anterior.
- Enter: próxima palavra.
- Também é possível colar uma resposta na palavra selecionada.
- Conferir circuito: conta palavras completas corretas e apresenta o resultado em cada pista. Casas verdes pertencem a pelo menos uma palavra correta; casas vermelhas preenchidas precisam de revisão. Uma casa verde não garante que ambas as palavras do cruzamento estejam certas: consulte a indicação de cada pista.
- Ao editar depois de conferir, o resultado anterior é limpo; confira novamente.
- Reiniciar: pede confirmação e limpa letras, resultados e cronômetro.
- Som opcional, desligado por padrão. O tempo começa ao inserir a primeira letra. Não há salvamento: recarregar a página inicia outra partida.

## Estrutura

- index.html: estrutura e interface.
- style.css: vidro translúcido, layout adaptável e animações.
- script.js: tabuleiro fixo de 16 palavras, pistas, interação e validação.
- README.md: documentação.

O tabuleiro tem 13 linhas e 17 colunas. Todas as palavras estão conectadas. Em telas pequenas, deslize horizontalmente a área do tabuleiro. Os efeitos respeitam a preferência de redução de movimento. A transparência tem fundo alternativo quando o navegador não suporta desfoque.

## Palavras e pistas

| Nº | Direção | Palavra | Pista |
|---|---|---|---|
| 1 | Horizontal | MEMORIADEMASSA | Conserva grandes volumes de arquivos e programas mesmo quando o computador está desligado. |
| 2 | Vertical | DUALCORE | Processador com dois núcleos físicos de execução. |
| 3 | Horizontal | CACHE | Mantém cópias de informações frequentemente acessadas para reduzir o tempo de espera do processador. |
| 4 | Vertical | EEPROM | Tecnologia não volátil que permite apagar e regravar eletricamente bytes individuais. |
| 5 | Horizontal | DATABUS | Conjunto de linhas que transporta valores entre os componentes do computador. |
| 6 | Vertical | QUADCORE | Processador com quatro núcleos físicos de execução. |
| 7 | Vertical | ADDRESSBUS | Conjunto de linhas que indica a posição a ser acessada na memória. |
| 8 | Horizontal | CPU | Executa instruções dos programas e coordena o processamento geral do computador. |
| 9 | Vertical | DMA | Permite transferências entre periféricos e memória sem intervenção contínua do processador. |
| 10 | Vertical | UC | Decodifica instruções e emite sinais que coordenam sua execução. |
| 11 | Vertical | ULA | Circuito do processador responsável por cálculos e comparações lógicas. |
| 12 | Horizontal | MICROCONTROLADOR | Chip que integra processador, memória e periféricos para aplicações embarcadas. |
| 13 | Horizontal | REGISTRADORES | Pequenos espaços internos do processador que guardam operandos e resultados imediatos. |
| 13 | Vertical | ROM | Armazena instruções permanentes, sendo tradicionalmente destinada apenas à leitura. |
| 14 | Vertical | RAM | Guarda temporariamente programas em execução; seu conteúdo desaparece sem energia. |
| 15 | Horizontal | FLASH | Tecnologia não volátil utilizada em pendrives, com apagamento realizado em blocos. |

As pistas têm até 15 palavras. Revise a terminologia com o e-book da disciplina antes da entrega: esse material não foi fornecido junto ao enunciado.

## Publicação

1. Crie um repositório público chamado arqcomp-cruzadinha.
2. Desenvolva e versione o projeto ao longo de pelo menos dois dias, com no mínimo seis commits reais. Não basta enviar tudo em um único commit.
3. Coloque os quatro arquivos na raiz, com index.html diretamente nela.
4. Em Settings → Pages, escolha Deploy from a branch, main e / (root). Salve.
5. Copie o endereço informado pelo GitHub Pages e atualize a seção Site publicado deste README.
6. Teste o site em janela anônima, incluindo digitação, conferência e reinício.
7. Envie ao Moodle somente o endereço do site, não o endereço do repositório.

Não inclua nome completo, RA, e-mail, telefone ou outros dados pessoais nos arquivos públicos. O nome informado no pedido foi omitido intencionalmente.

## Sugestão de etapas de versionamento

Use estas mensagens apenas quando as alterações correspondentes forem realmente realizadas. Este pacote não cria histórico Git e não satisfaz sozinho a exigência de commits em dias diferentes.

Dia 1:
- feat: cria estrutura inicial da página
- feat: adiciona tabuleiro e pistas numeradas
- feat: implementa digitação e navegação

Dia 2:
- feat: implementa conferência e reinício
- style: adiciona vidro translúcido e ajustes responsivos
- docs: documenta regras e endereço publicado

Se houver correções reais, registre-as com fix: descrição curta.
# a.
