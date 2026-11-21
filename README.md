# A.point (waypoint)

Jogo em **8 bits** de revisão para a disciplina de Arquitetura Computacional. Crie seu personagem, escolha sua faculdade e seu item, e batalhe completando a cruzadinha com 16 conceitos de arquitetura para conquistar o item.

O projeto usa somente **HTML, CSS e JavaScript puros**. Todos os sprites em pixel art 32x32 (personagens, itens e logos) são desenhados em pixels pelo código. Basta abrir `index.html` no navegador.

## Como jogar

1. Aperte **START** e escolha um personagem: Alex, Bruno, Luna, Maya ou o robô Bot-7.
2. Escolha a faculdade. Apenas a **SPTECH** deixa você continuar.
3. Escolha um item: energético, café ou livro de espanhol.
4. Na batalha, escolha uma pista na lista ou clique em uma casa do tabuleiro e digite as letras direto nas casas.
5. Em uma casa compartilhada por duas palavras, pressione **Espaço** ou clique duas vezes para alternar entre horizontal e vertical. As **setas** navegam e **Enter** vai para a próxima pista.
6. Clique em **Conferir** para ver quais palavras estão certas ou erradas. O contador mostra, por exemplo, "8 de 16 palavras corretas".
7. Você tem **3 vidas**: um Conferir que não traz nenhuma palavra certa nova custa 1 vida, e sem vidas é fim de jogo. Há também **3 dicas** que revelam uma letra.
8. Use **Reiniciar** para limpar o tabuleiro. Acertando as 16 palavras, o item é seu!

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

## Arquivos

- `index.html` — telas do jogo (título, personagem, faculdade, item, batalha).
- `style.css` — visual 8 bits e layout responsivo.
- `script.js` — cruzadinha: tabuleiro, pistas, cronômetro, conferência, pontuação e sons.
- `game.js` — fluxo das telas e sprites 8 bits.
- `README.md` — documentação.

