# A.point — Conexões de Arquitetura

Jogo interativo de revisão para a disciplina de Arquitetura Computacional. O objetivo é descobrir 16 conceitos a partir das pistas e completar o tabuleiro conectando as palavras.

O projeto usa somente **HTML, CSS e JavaScript puros**. Não depende de bibliotecas, frameworks, fontes externas, instalação ou servidor: basta abrir `index.html` no navegador.

## Como jogar

1. Escolha uma pista na lista ou clique em uma casa do tabuleiro.
2. Digite as letras diretamente nas casas. As respostas são aceitas em maiúsculas e sem acentos.
3. Em uma casa compartilhada por duas palavras, pressione **Espaço** ou clique duas vezes para alternar entre horizontal e vertical.
4. Use as **setas** para navegar pelas casas. Pressione **Enter** para selecionar a próxima pista.
5. Clique em **Conferir respostas** para ver quais palavras estão corretas, incompletas ou precisam de revisão. O contador e a barra mostram o total de acertos.
6. Use **Reiniciar** para limpar a partida e começar novamente.

O cronômetro começa na primeira letra inserida. O som é opcional e começa desligado. Também é possível colar uma resposta inteira a partir da primeira casa da palavra selecionada.

## Palavras e pistas

O tabuleiro usa as 16 palavras do enunciado. Todas se cruzam com pelo menos uma outra palavra.

| Nº | Direção | Resposta | Pista |
|---:|---|---|---|
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

As pistas foram mantidas no projeto original. O enunciado recomenda conferir a terminologia com o e-book da disciplina; esse e-book não veio junto dos arquivos recebidos.

## Arquivos

- `index.html` — estrutura da página e componentes do jogo.
- `style.css` — identidade visual, cores, animações e layout responsivo.
- `script.js` — tabuleiro, navegação, pistas, cronômetro, validação, pontuação, sons e celebração.
- `README.md` — documentação e instruções de publicação.

