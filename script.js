"use strict";

// As 16 respostas do enunciado. As coordenadas mantêm todas as palavras conectadas.
const entries = [
  { answer: "MEMORIADEMASSA", row: 0, col: 2, dir: "H", clue: "Conserva grandes volumes de arquivos e programas mesmo quando o computador está desligado.", number: 1, id: 0 },
  { answer: "DUALCORE", row: 0, col: 9, dir: "V", clue: "Processador com dois núcleos físicos de execução.", number: 2, id: 1 },
  { answer: "CACHE", row: 2, col: 0, dir: "H", clue: "Mantém cópias de informações frequentemente acessadas para reduzir o tempo de espera do processador.", number: 3, id: 2 },
  { answer: "EEPROM", row: 2, col: 4, dir: "V", clue: "Tecnologia não volátil que permite apagar e regravar eletricamente bytes individuais.", number: 4, id: 3 },
  { answer: "DATABUS", row: 2, col: 6, dir: "H", clue: "Conjunto de linhas que transporta valores entre os componentes do computador.", number: 5, id: 4 },
  { answer: "QUADCORE", row: 3, col: 13, dir: "V", clue: "Processador com quatro núcleos físicos de execução.", number: 6, id: 5 },
  { answer: "ADDRESSBUS", row: 3, col: 15, dir: "V", clue: "Conjunto de linhas que indica a posição a ser acessada na memória.", number: 7, id: 6 },
  { answer: "CPU", row: 4, col: 3, dir: "H", clue: "Executa instruções dos programas e coordena o processamento geral do computador.", number: 8, id: 7 },
  { answer: "DMA", row: 5, col: 0, dir: "V", clue: "Permite transferências entre periféricos e memória sem intervenção contínua do processador.", number: 9, id: 8 },
  { answer: "UC", row: 5, col: 2, dir: "V", clue: "Decodifica instruções e emite sinais que coordenam sua execução.", number: 10, id: 9 },
  { answer: "ULA", row: 5, col: 11, dir: "V", clue: "Circuito do processador responsável por cálculos e comparações lógicas.", number: 11, id: 10 },
  { answer: "MICROCONTROLADOR", row: 6, col: 0, dir: "H", clue: "Chip que integra processador, memória e periféricos para aplicações embarcadas.", number: 12, id: 11 },
  { answer: "REGISTRADORES", row: 9, col: 3, dir: "H", clue: "Pequenos espaços internos do processador que guardam operandos e resultados imediatos.", number: 13, id: 12 },
  { answer: "ROM", row: 9, col: 3, dir: "V", clue: "Armazena instruções permanentes, sendo tradicionalmente destinada apenas à leitura.", number: 13, id: 13 },
  { answer: "RAM", row: 9, col: 9, dir: "V", clue: "Guarda temporariamente programas em execução; seu conteúdo desaparece sem energia.", number: 14, id: 14 },
  { answer: "FLASH", row: 12, col: 12, dir: "H", clue: "Tecnologia não volátil utilizada em pendrives, com apagamento realizado em blocos.", number: 15, id: 15 }
];

const ROWS = 13;
const COLS = 17;
const $ = (selector) => document.querySelector(selector);
const board = $("#board");
const cells = new Map();
const clueButtons = new Map();

let active = entries[0];
let focused = null;
let seconds = 0;
let started = false;
let finished = false;
let checked = false;
let soundOn = false;
let audioContext = null;
let timerInterval = null;

const cellKey = (row, col) => `${row},${col}`;

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
}

function positions(entry) {
  return Array.from(entry.answer, (letter, index) => ({
    row: entry.row + (entry.dir === "V" ? index : 0),
    col: entry.col + (entry.dir === "H" ? index : 0),
    letter
  }));
}

function buildCellMap() {
  for (const entry of entries) {
    for (const position of positions(entry)) {
      const id = cellKey(position.row, position.col);
      if (!cells.has(id)) cells.set(id, { ...position, entries: [] });
      const cell = cells.get(id);
      if (cell.letter !== position.letter) {
        throw new Error(`Conflito de letras na posição ${id}.`);
      }
      cell.entries.push(entry);
    }
  }

  // Evita que uma palavra fique isolada, sem cruzar com outra.
  for (const entry of entries) {
    const crosses = positions(entry).some((position) => cells.get(cellKey(position.row, position.col)).entries.length > 1);
    if (!crosses) throw new Error(`A palavra ${entry.answer} não cruza com outra palavra.`);
  }
}

function buildBoard() {
  board.style.gridTemplateColumns = `repeat(${COLS}, var(--cell))`;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const cell = cells.get(cellKey(row, col));
      if (!cell) {
        const hole = document.createElement("div");
        hole.className = "grid-hole";
        hole.setAttribute("aria-hidden", "true");
        board.append(hole);
        continue;
      }

      const box = document.createElement("div");
      box.className = "cell";
      if (cell.entries.length > 1) box.classList.add("crossing");

      const beginning = entries.find((entry) => entry.row === row && entry.col === col);
      if (beginning) {
        const number = document.createElement("span");
        number.className = "number";
        number.textContent = beginning.number;
        box.append(number);
      }

      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.autocomplete = "off";
      input.spellcheck = false;
      input.inputMode = "text";
      input.setAttribute("autocapitalize", "characters");
      input.setAttribute("aria-label", `Linha ${row + 1}, coluna ${col + 1}`);
      input.dataset.row = row;
      input.dataset.col = col;

      cell.box = box;
      cell.input = input;
      box.append(input);
      board.append(box);

      input.addEventListener("focus", () => {
        focused = cell;
        if (!cell.entries.includes(active)) {
          active = cell.entries.find((entry) => entry.dir === active.dir) || cell.entries[0];
        }
        highlight();
      });

      input.addEventListener("click", () => {
        if (cell.entries.length < 2) return;
        const now = Date.now();
        if (cell.lastClick && now - cell.lastClick < 420) toggleDirection(cell);
        cell.lastClick = now;
      });

      input.addEventListener("input", () => {
        input.value = normalize(input.value).slice(-1);
        invalidateResults();
        if (input.value) {
          startTimer();
          playTone(420);
          box.classList.remove("edited");
          void box.offsetWidth;
          box.classList.add("edited");
          moveInActiveWord(1);
        }
      });

      input.addEventListener("keydown", (event) => handleCellKey(event, cell));
      input.addEventListener("paste", (event) => handlePaste(event, cell));
    }
  }
}

function buildClues() {
  for (const direction of ["H", "V"]) {
    const section = document.createElement("section");
    section.className = "clue-section";
    section.dataset.dir = direction;

    const heading = document.createElement("h3");
    heading.textContent = direction === "H" ? "HORIZONTAIS →" : "VERTICAIS ↓";
    section.append(heading);

    const list = document.createElement("div");
    list.className = "clue-list";
    section.append(list);

    for (const entry of entries.filter((item) => item.dir === direction)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "clue";
      button.setAttribute("aria-pressed", "false");

      const number = document.createElement("span");
      number.className = "clue-num";
      number.textContent = entry.number;

      const copy = document.createElement("span");
      copy.className = "clue-copy";
      copy.append(document.createTextNode(entry.clue));

      const status = document.createElement("em");
      status.textContent = `${entry.answer.length} LETRAS`;
      copy.append(status);

      button.append(number, copy);
      button.addEventListener("click", () => selectEntry(entry));
      clueButtons.set(entry.id, button);
      list.append(button);
    }

    $("#clues").append(section);
  }
}

function selectEntry(entry) {
  active = entry;
  const wordPositions = positions(entry);
  const next = wordPositions.find((position) => !cells.get(cellKey(position.row, position.col)).input.value) || wordPositions[0];
  cells.get(cellKey(next.row, next.col)).input.focus();
  highlight();
}

function highlight() {
  for (const cell of cells.values()) {
    cell.box.classList.toggle("current-word", cell.entries.includes(active));
    cell.box.classList.toggle("focused", cell === focused);
  }

  for (const entry of entries) {
    const button = clueButtons.get(entry.id);
    const isActive = entry === active;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  $("#active-clue-number").textContent = String(active.number).padStart(2, "0");
  $("#active-clue-meta").textContent = `${active.dir === "H" ? "HORIZONTAL →" : "VERTICAL ↓"} · ${active.answer.length} LETRAS`;
  $("#current-clue").textContent = active.clue;
}

function moveInActiveWord(delta) {
  if (!focused) return;
  const wordPositions = positions(active);
  const index = wordPositions.findIndex((position) => position.row === focused.row && position.col === focused.col);
  const next = wordPositions[index + delta];
  if (next) cells.get(cellKey(next.row, next.col)).input.focus();
}

function toggleDirection(cell) {
  const other = cell.entries.find((entry) => entry !== active);
  if (!other) return;
  active = other;
  highlight();
  playTone(570);
}

function handleCellKey(event, cell) {
  if (event.key === " ") {
    event.preventDefault();
    toggleDirection(cell);
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    if (cell.input.value) {
      cell.input.value = "";
    } else {
      moveInActiveWord(-1);
      if (focused) focused.input.value = "";
    }
    invalidateResults();
    return;
  }

  if (event.key === "Delete") {
    event.preventDefault();
    cell.input.value = "";
    invalidateResults();
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    const nextIndex = (entries.indexOf(active) + 1) % entries.length;
    selectEntry(entries[nextIndex]);
    return;
  }

  const arrows = {
    ArrowLeft: { row: 0, col: -1, dir: "H" },
    ArrowRight: { row: 0, col: 1, dir: "H" },
    ArrowUp: { row: -1, col: 0, dir: "V" },
    ArrowDown: { row: 1, col: 0, dir: "V" }
  };
  const direction = arrows[event.key];
  if (!direction) return;

  event.preventDefault();
  const matchingEntry = cell.entries.find((entry) => entry.dir === direction.dir);
  if (matchingEntry) active = matchingEntry;
  const nextCell = cells.get(cellKey(cell.row + direction.row, cell.col + direction.col));
  if (nextCell && nextCell.entries.includes(active)) nextCell.input.focus();
  else highlight();
}

function handlePaste(event, cell) {
  event.preventDefault();
  const pasted = normalize(event.clipboardData.getData("text"));
  if (!pasted) return;

  const wordPositions = positions(active);
  let index = wordPositions.findIndex((position) => position.row === cell.row && position.col === cell.col);
  if (index < 0) return;

  for (const letter of pasted) {
    if (index >= wordPositions.length) break;
    const position = wordPositions[index];
    cells.get(cellKey(position.row, position.col)).input.value = letter;
    index += 1;
  }

  invalidateResults();
  startTimer();
  const next = wordPositions[Math.min(index, wordPositions.length - 1)];
  cells.get(cellKey(next.row, next.col)).input.focus();
  playTone(520);
}

function startTimer() {
  if (finished || started) return;
  started = true;
  timerInterval = window.setInterval(() => {
    if (!started || finished) return;
    seconds += 1;
    renderTime();
  }, 1000);
}

function stopTimer() {
  started = false;
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function renderTime() {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  $("#timer").textContent = `${minutes}:${remainder}`;
}

function setScore(correctCount) {
  const percent = Math.round((correctCount / entries.length) * 100);
  $("#score").textContent = `${correctCount} de ${entries.length} palavras corretas`;
  $("#percent").textContent = `${percent}%`;
  $("#progress").style.width = `${percent}%`;
  $(".progress-track").setAttribute("aria-valuenow", String(correctCount));
}

function invalidateResults() {
  if (checked) {
    checked = false;
    for (const cell of cells.values()) cell.box.classList.remove("correct", "incorrect");
    for (const entry of entries) {
      const button = clueButtons.get(entry.id);
      button.classList.remove("good", "bad");
      button.querySelector("em").textContent = `${entry.answer.length} LETRAS`;
    }
    setScore(0);
    $("#feedback").textContent = "Você alterou o circuito. Confira novamente para atualizar os acertos.";
  }

  if (finished) {
    finished = false;
    startTimer();
  }
}

function checkAnswers() {
  checked = true;
  let correctCount = 0;
  const results = new Map();

  for (const entry of entries) {
    const wordPositions = positions(entry);
    const value = wordPositions.map((position) => cells.get(cellKey(position.row, position.col)).input.value).join("");
    const isCorrect = value === entry.answer;
    const isBlank = wordPositions.every((position) => !cells.get(cellKey(position.row, position.col)).input.value);
    const isIncomplete = wordPositions.some((position) => !cells.get(cellKey(position.row, position.col)).input.value);

    results.set(entry.id, isCorrect);
    if (isCorrect) correctCount += 1;

    const button = clueButtons.get(entry.id);
    button.classList.toggle("good", isCorrect);
    button.classList.toggle("bad", !isCorrect);
    const status = button.querySelector("em");
    status.textContent = isCorrect ? "CORRETA ✓" : isBlank ? "AINDA NÃO PREENCHIDA" : isIncomplete ? "INCOMPLETA · CONTINUE" : "REVISAR RESPOSTA";
  }

  for (const cell of cells.values()) {
    const belongsToCorrectWord = cell.entries.some((entry) => results.get(entry.id));
    cell.box.classList.toggle("correct", belongsToCorrectWord);
    cell.box.classList.toggle("incorrect", !belongsToCorrectWord && Boolean(cell.input.value));
  }

  setScore(correctCount);
  if (correctCount === entries.length) {
    const firstWin = !finished;
    finished = true;
    stopTimer();
    $("#feedback").textContent = `Circuito completo! Você conectou os 16 conceitos em ${$("#timer").textContent}. Mandou bem!`;
    if (firstWin) {
      celebrate();
      playTone(660);
      window.setTimeout(() => playTone(790), 130);
    }
  } else if (correctCount > 0) {
    $("#feedback").textContent = `${correctCount} conexões certas. As pistas mostram exatamente o que ainda precisa de revisão.`;
    playTone(490);
  } else {
    $("#feedback").textContent = "Ainda não há palavras corretas. Volte às pistas e tente mais uma vez.";
    playTone(300);
  }
}

function resetGame() {
  for (const cell of cells.values()) {
    cell.input.value = "";
    cell.box.classList.remove("correct", "incorrect", "edited");
  }
  for (const entry of entries) {
    const button = clueButtons.get(entry.id);
    button.classList.remove("good", "bad");
    button.querySelector("em").textContent = `${entry.answer.length} LETRAS`;
  }

  stopTimer();
  seconds = 0;
  finished = false;
  checked = false;
  renderTime();
  setScore(0);
  $("#feedback").textContent = "Tudo zerado. Uma nova tentativa, um novo circuito.";
  $("#celebration").replaceChildren();
  $("#reset-dialog").close();
  selectEntry(entries[0]);
}

function configureFilters() {
  for (const button of document.querySelectorAll("[data-filter]")) {
    button.addEventListener("click", () => {
      for (const option of document.querySelectorAll("[data-filter]")) {
        const selected = option === button;
        option.classList.toggle("active", selected);
        option.setAttribute("aria-pressed", String(selected));
      }
      for (const section of document.querySelectorAll(".clue-section")) {
        section.hidden = button.dataset.filter !== "all" && section.dataset.dir !== button.dataset.filter;
      }
    });
  }
}

function playTone(frequency = 420) {
  if (!soundOn) return;
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.035, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.11);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  } catch (error) {
    // O jogo continua normalmente caso o navegador bloqueie áudio.
  }
}

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#d9fa45", "#ff705d", "#3155e7", "#9ee7bd", "#fffdf7"];
  for (let index = 0; index < 76; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.75}s`;
    piece.style.transform = `rotate(${Math.random() * 90}deg)`;
    $("#celebration").append(piece);
    window.setTimeout(() => piece.remove(), 3600);
  }
}

function bindControls() {
  $("#check").addEventListener("click", checkAnswers);
  $("#reset").addEventListener("click", () => $("#reset-dialog").showModal());
  $("#cancel-reset").addEventListener("click", () => $("#reset-dialog").close());
  $("#confirm-reset").addEventListener("click", resetGame);
  $("#sound").addEventListener("click", () => {
    soundOn = !soundOn;
    $("#sound").setAttribute("aria-pressed", String(soundOn));
    $("#sound").setAttribute("aria-label", soundOn ? "Desativar sons do jogo" : "Ativar sons do jogo");
    $("#sound-state").textContent = soundOn ? "SOM ON" : "SOM OFF";
    if (soundOn) playTone(540);
  });
}

buildCellMap();
buildBoard();
buildClues();
configureFilters();
bindControls();
highlight();
