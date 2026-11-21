"use strict";
const entries = [
  {
    answer: "MEMORIADEMASSA",
    row: 0,
    col: 2,
    dir: "H",
    clue: "Conserva grandes volumes de arquivos e programas mesmo quando o computador está desligado.",
    number: 1,
    id: 0,
  },
  {
    answer: "DUALCORE",
    row: 0,
    col: 9,
    dir: "V",
    clue: "Processador com dois núcleos físicos de execução.",
    number: 2,
    id: 1,
  },
  {
    answer: "CACHE",
    row: 2,
    col: 0,
    dir: "H",
    clue: "Mantém cópias de informações frequentemente acessadas para reduzir o tempo de espera do processador.",
    number: 3,
    id: 2,
  },
  {
    answer: "EEPROM",
    row: 2,
    col: 4,
    dir: "V",
    clue: "Tecnologia não volátil que permite apagar e regravar eletricamente bytes individuais.",
    number: 4,
    id: 3,
  },
  {
    answer: "DATABUS",
    row: 2,
    col: 6,
    dir: "H",
    clue: "Conjunto de linhas que transporta valores entre os componentes do computador.",
    number: 5,
    id: 4,
  },
  {
    answer: "QUADCORE",
    row: 3,
    col: 13,
    dir: "V",
    clue: "Processador com quatro núcleos físicos de execução.",
    number: 6,
    id: 5,
  },
  {
    answer: "ADDRESSBUS",
    row: 3,
    col: 15,
    dir: "V",
    clue: "Conjunto de linhas que indica a posição a ser acessada na memória.",
    number: 7,
    id: 6,
  },
  {
    answer: "CPU",
    row: 4,
    col: 3,
    dir: "H",
    clue: "Executa instruções dos programas e coordena o processamento geral do computador.",
    number: 8,
    id: 7,
  },
  {
    answer: "DMA",
    row: 5,
    col: 0,
    dir: "V",
    clue: "Permite transferências entre periféricos e memória sem intervenção contínua do processador.",
    number: 9,
    id: 8,
  },
  {
    answer: "UC",
    row: 5,
    col: 2,
    dir: "V",
    clue: "Decodifica instruções e emite sinais que coordenam sua execução.",
    number: 10,
    id: 9,
  },
  {
    answer: "ULA",
    row: 5,
    col: 11,
    dir: "V",
    clue: "Circuito do processador responsável por cálculos e comparações lógicas.",
    number: 11,
    id: 10,
  },
  {
    answer: "MICROCONTROLADOR",
    row: 6,
    col: 0,
    dir: "H",
    clue: "Chip que integra processador, memória e periféricos para aplicações embarcadas.",
    number: 12,
    id: 11,
  },
  {
    answer: "REGISTRADORES",
    row: 9,
    col: 3,
    dir: "H",
    clue: "Pequenos espaços internos do processador que guardam operandos e resultados imediatos.",
    number: 13,
    id: 12,
  },
  {
    answer: "ROM",
    row: 9,
    col: 3,
    dir: "V",
    clue: "Armazena instruções permanentes, sendo tradicionalmente destinada apenas à leitura.",
    number: 13,
    id: 13,
  },
  {
    answer: "RAM",
    row: 9,
    col: 9,
    dir: "V",
    clue: "Guarda temporariamente programas em execução; seu conteúdo desaparece sem energia.",
    number: 14,
    id: 14,
  },
  {
    answer: "FLASH",
    row: 12,
    col: 12,
    dir: "H",
    clue: "Tecnologia não volátil utilizada em pendrives, com apagamento realizado em blocos.",
    number: 15,
    id: 15,
  },
];
const ROWS = 13,
  COLS = 17;
const $ = (s) => document.querySelector(s);
const board = $("#board"),
  cells = new Map(),
  clueButtons = new Map();
let active = entries[0],
  focused = null,
  seconds = 0,
  started = false,
  finished = false,
  checked = false,
  soundOn = false,
  audio = null;
const key = (r, c) => `${r},${c}`;
function positions(e) {
  return Array.from(e.answer, (letter, i) => ({
    r: e.row + (e.dir === "V" ? i : 0),
    c: e.col + (e.dir === "H" ? i : 0),
    letter,
  }));
}
for (const e of entries)
  for (const p of positions(e)) {
    const k = key(p.r, p.c);
    if (!cells.has(k)) cells.set(k, { ...p, entries: [] });
    cells.get(k).entries.push(e);
  }
board.style.gridTemplateColumns = `repeat(${COLS}, var(--cell))`;
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++) {
    const cell = cells.get(key(r, c));
    if (!cell) {
      const space = document.createElement("div");
      space.setAttribute("aria-hidden", "true");
      board.append(space);
      continue;
    }
    const box = document.createElement("div");
    box.className = "cell";
    const beginning = entries.find((e) => e.row === r && e.col === c);
    if (beginning) {
      const n = document.createElement("span");
      n.className = "number";
      n.textContent = beginning.number;
      box.append(n);
    }
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("autocapitalize", "characters");
    input.setAttribute("aria-label", `Linha ${r + 1}, coluna ${c + 1}`);
    cell.box = box;
    cell.input = input;
    box.append(input);
    board.append(box);
    input.addEventListener("focus", () => {
      focused = cell;
      if (!cell.entries.includes(active)) active = cell.entries[0];
      highlight();
    });
    input.addEventListener("click", () => {
      if (
        cell.entries.length > 1 &&
        cell.lastClick &&
        Date.now() - cell.lastClick < 450
      )
        toggleDirection(cell);
      cell.lastClick = Date.now();
    });
    input.addEventListener("input", () => {
      input.value = normalize(input.value).slice(-1);
      invalidate();
      if (input.value) {
        start();
        tone();
        box.classList.remove("edited");
        void box.offsetWidth;
        box.classList.add("edited");
        move(1);
      }
    });
    input.addEventListener("keydown", (ev) => handleKey(ev, cell));
    input.addEventListener("paste", (ev) => {
      ev.preventDefault();
      const text = normalize(ev.clipboardData.getData("text"));
      if (!text) return;
      const ps = positions(active);
      let at = ps.findIndex((p) => p.r === r && p.c === c);
      for (const letter of text) {
        if (at >= ps.length) break;
        const p = ps[at++];
        cells.get(key(p.r, p.c)).input.value = letter;
      }
      start();
      invalidate();
      const p = ps[Math.min(at, ps.length - 1)];
      cells.get(key(p.r, p.c)).input.focus();
    });
  }
function normalize(t) {
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}
for (const dir of ["H", "V"]) {
  const section = document.createElement("section");
  section.className = "clue-section";
  section.dataset.dir = dir;
  const h = document.createElement("h3");
  h.textContent = dir === "H" ? "HORIZONTAIS →" : "VERTICAIS ↓";
  section.append(h);
  const list = document.createElement("div");
  list.className = "clue-list";
  section.append(list);
  for (const e of entries.filter((e) => e.dir === dir)) {
    const b = document.createElement("button");
    b.className = "clue";
    b.innerHTML = `<span class="clue-num">${e.number}</span><span>${e.clue}<em>${e.answer.length} letras</em></span>`;
    b.addEventListener("click", () => select(e));
    clueButtons.set(e.id, b);
    list.append(b);
  }
  $("#clues").append(section);
}
function select(e) {
  active = e;
  const ps = positions(e);
  const p = ps.find((p) => !cells.get(key(p.r, p.c)).input.value) || ps[0];
  cells.get(key(p.r, p.c)).input.focus();
  highlight();
}
function highlight() {
  for (const cell of cells.values()) {
    cell.box.classList.toggle("selected", cell.entries.includes(active));
    cell.box.classList.toggle("focused", cell === focused);
  }
  for (const e of entries) {
    const b = clueButtons.get(e.id);
    b.classList.toggle("active", e === active);
    b.setAttribute("aria-pressed", String(e === active));
  }
  $("#current-clue").innerHTML =
    `<small>${active.number} · ${active.dir === "H" ? "HORIZONTAL →" : "VERTICAL ↓"} · ${active.answer.length} LETRAS</small>${active.clue}`;
}
function move(delta) {
  if (!focused) return;
  const ps = positions(active),
    i = ps.findIndex((p) => p.r === focused.r && p.c === focused.c);
  const p = ps[i + delta];
  if (p) cells.get(key(p.r, p.c)).input.focus();
}
function toggleDirection(cell) {
  active = cell.entries.find((e) => e !== active) || active;
  highlight();
}
function handleKey(ev, cell) {
  if (ev.key === " ") {
    ev.preventDefault();
    toggleDirection(cell);
    return;
  }
  if (ev.key === "Backspace") {
    ev.preventDefault();
    if (cell.input.value) {
      cell.input.value = "";
    } else {
      move(-1);
      if (focused) focused.input.value = "";
    }
    invalidate();
    return;
  }
  if (ev.key === "Delete") {
    ev.preventDefault();
    cell.input.value = "";
    invalidate();
    return;
  }
  if (ev.key === "Enter") {
    ev.preventDefault();
    select(entries[(entries.indexOf(active) + 1) % entries.length]);
    return;
  }
  const arrows = {
    ArrowLeft: [0, -1, "H"],
    ArrowRight: [0, 1, "H"],
    ArrowUp: [-1, 0, "V"],
    ArrowDown: [1, 0, "V"],
  };
  if (arrows[ev.key]) {
    ev.preventDefault();
    const [dr, dc, dir] = arrows[ev.key];
    active = cell.entries.find((e) => e.dir === dir) || active;
    const next = cells.get(key(cell.r + dr, cell.c + dc));
    if (next) next.input.focus();
    highlight();
  }
}
function start() {
  if (!finished) started = true;
}
setInterval(() => {
  if (started && !finished) {
    seconds++;
    renderTime();
  }
}, 1000);
function renderTime() {
  $("#timer").textContent =
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function invalidate() {
  if (checked) {
    checked = false;
    for (const cell of cells.values())
      cell.box.classList.remove("correct", "incorrect");
    for (const e of entries) {
      const b = clueButtons.get(e.id);
      b.classList.remove("good", "bad");
      b.querySelector("em").textContent = `${e.answer.length} letras`;
    }
    setScore(0);
    $("#feedback").textContent =
      "Você alterou o circuito. Confira novamente para atualizar os acertos.";
  }
  if (finished) {
    finished = false;
    started = true;
  }
}
function setScore(n) {
  $("#score").textContent = `${n} de ${entries.length} palavras`;
  $("#percent").textContent = `${Math.round((n / entries.length) * 100)}%`;
  $("#progress").style.width = `${(n / entries.length) * 100}%`;
  $(".progress-track").setAttribute("aria-valuenow", n);
}
$("#check").addEventListener("click", () => {
  checked = true;
  let total = 0;
  const results = new Map();
  for (const e of entries) {
    const ps = positions(e),
      value = ps.map((p) => cells.get(key(p.r, p.c)).input.value).join("");
    const ok = value === e.answer;
    results.set(e.id, ok);
    if (ok) total++;
    const b = clueButtons.get(e.id);
    b.classList.toggle("good", ok);
    b.classList.toggle("bad", !ok);
    const blank = ps.every((p) => !cells.get(key(p.r, p.c)).input.value);
    b.querySelector("em").textContent = ok
      ? "Correta ✓"
      : blank
        ? "Ainda não preenchida"
        : ps.some((p) => !cells.get(key(p.r, p.c)).input.value)
          ? "Incompleta · continue tentando"
          : "Revisar resposta";
  }
  for (const cell of cells.values()) {
    const good = cell.entries.some((e) => results.get(e.id));
    cell.box.classList.toggle("correct", good);
    cell.box.classList.toggle("incorrect", !good && !!cell.input.value);
  }
  setScore(total);
  if (total === entries.length) {
    const firstWin = !finished;
    finished = true;
    started = false;
    $("#feedback").textContent =
      `Circuito completo! Você conectou os 16 conceitos em ${$("#timer").textContent}.`;
    if (firstWin) {
      celebrate();
      tone(660);
    }
  } else
    $("#feedback").textContent = total
      ? `${total} conexões certas! Veja nas pistas quais respostas precisam de revisão.`
      : "Ainda não há palavras completas corretas. Siga as pistas e tente novamente.";
});
$("#reset").addEventListener("click", () => $("#reset-dialog").showModal());
$("#cancel-reset").addEventListener("click", () => $("#reset-dialog").close());
$("#confirm-reset").addEventListener("click", () => {
  for (const cell of cells.values()) {
    cell.input.value = "";
    cell.box.classList.remove("correct", "incorrect");
  }
  for (const e of entries) {
    const b = clueButtons.get(e.id);
    b.classList.remove("good", "bad");
    b.querySelector("em").textContent = `${e.answer.length} letras`;
  }
  seconds = 0;
  started = false;
  finished = false;
  checked = false;
  renderTime();
  setScore(0);
  $("#feedback").textContent =
    "Uma nova partida. Um novo jeito de conectar ideias.";
  $("#celebration").replaceChildren();
  $("#reset-dialog").close();
  select(entries[0]);
});
for (const b of document.querySelectorAll("[data-filter]"))
  b.addEventListener("click", () => {
    for (const other of document.querySelectorAll("[data-filter]")) {
      other.classList.toggle("active", other === b);
      other.setAttribute("aria-pressed", String(other === b));
    }
    for (const section of document.querySelectorAll(".clue-section"))
      section.hidden =
        b.dataset.filter !== "all" && section.dataset.dir !== b.dataset.filter;
  });
$("#sound").addEventListener("click", () => {
  soundOn = !soundOn;
  $("#sound").textContent = `Som: ${soundOn ? "ligado" : "desligado"}`;
  $("#sound").setAttribute("aria-pressed", String(soundOn));
  if (soundOn) tone(520);
});
function tone(f = 420) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
    const osc = audio.createOscillator(),
      gain = audio.createGain();
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.type = "sine";
    osc.frequency.value = f;
    gain.gain.setValueAtTime(0.025, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
    osc.start();
    osc.stop(audio.currentTime + 0.13);
  } catch {}
}
function celebrate() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 65; i++) {
    const bit = document.createElement("i");
    bit.className = "confetti";
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = ["#b4a4ff", "#85efd5", "#f4ca8f"][i % 3];
    bit.style.animationDelay = `${Math.random() * 0.7}s`;
    $("#celebration").append(bit);
    setTimeout(() => bit.remove(), 4000);
  }
}
highlight();
