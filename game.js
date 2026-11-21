// A.point (waypoint) — fluxo do jogo + sprites pixel art 32x32 desenhados por código
(() => {
  const $ = (s) => document.querySelector(s),
    INK = "#14172e";
  const show = (id) => {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.toggle("on", s.id === id));
    window.scrollTo(0, 0);
  };
  const put = (el, ...n) => el.replaceChildren(...n);
  const shade = (h, f) => {
    const n = parseInt(h.slice(1), 16);
    return (
      "#" +
      [16, 8, 0]
        .map((k) =>
          Math.max(0, Math.min(255, Math.round(((n >> k) & 255) * f)))
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  };
  const toCanvas = (g, px) => {
    const c = document.createElement("canvas"),
      x = c.getContext("2d");
    c.width = g[0].length;
    c.height = g.length;
    c.style.width = c.width * px + "px";
    c.style.height = c.height * px + "px";
    g.forEach((row, j) =>
      row.forEach((col, i) => {
        if (col) {
          x.fillStyle = col;
          x.fillRect(i, j, 1, 1);
        }
      }),
    );
    return c;
  };
  // paint: desenha com retângulos e aplica contorno escuro automático
  const paint =
    (draw, w = 34, h = 34, outline = true) =>
    (px) => {
      const g = Array.from({ length: h }, () => Array(w).fill(null)),
        o = outline ? 1 : 0;
      draw((x, y, a, b, c) => {
        for (let j = y + o; j < y + o + b; j++)
          for (let i = x + o; i < x + o + a; i++)
            if (g[j] && i >= 0 && i < w) g[j][i] = c;
      });
      const out = g.map((r) => r.slice());
      if (outline)
        g.forEach((r, j) =>
          r.forEach((c, i) => {
            if (
              !c &&
              [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
              ].some(([dx, dy]) => g[j + dy] && g[j + dy][i + dx])
            )
              out[j][i] = INK;
          }),
        );
      return toCanvas(out, px);
    };

  // ---------- Personagens ----------
  const human = (o) =>
    paint((R) => {
      const { skin, hair, shirt, pants, style, girl } = o;
      const sk = shade(skin, 0.8),
        hs = shade(hair, 0.7),
        hl = shade(hair, 1.5),
        ss = shade(shirt, 0.75),
        ps = shade(pants, 0.75);
      if (style === "long") {
        R(8, 4, 16, 18, hs);
        R(9, 4, 14, 16, hair);
      }
      if (style === "pony") {
        R(22, 8, 4, 12, hair);
        R(23, 18, 2, 4, hs);
      }
      if (girl) {
        R(9, 25, 14, 4, pants);
        R(9, 28, 14, 1, ps);
        R(11, 29, 4, 2, skin);
        R(17, 29, 4, 2, skin);
      } else {
        R(10, 26, 5, 4, pants);
        R(17, 26, 5, 4, pants);
        R(13, 26, 2, 4, ps);
        R(20, 26, 2, 4, ps);
      }
      R(9, 30, 6, 2, "#f4f4f4");
      R(17, 30, 6, 2, "#f4f4f4");
      R(9, 31, 6, 1, "#9aa3b5");
      R(17, 31, 6, 1, "#9aa3b5");
      R(9, 17, 14, 9, shirt);
      R(19, 17, 4, 9, ss);
      R(9, 25, 14, 1, ss);
      R(11, 20, 4, 4, "#1f2347");
      R(12, 21, 2, 2, "#2bb3c9");
      R(5, 17, 4, 8, shirt);
      R(23, 17, 4, 8, ss);
      R(5, 24, 4, 3, skin);
      R(23, 24, 4, 3, sk);
      R(14, 15, 4, 3, sk);
      R(14, 17, 4, 1, skin);
      R(10, 4, 12, 12, skin);
      R(20, 5, 2, 10, sk);
      R(9, 9, 1, 3, skin);
      R(22, 9, 1, 3, sk);
      R(9, 2, 14, 5, hair);
      R(9, 5, 2, 6, hair);
      R(21, 5, 2, 6, hair);
      R(12, 3, 6, 1, hl);
      R(9, 6, 14, 1, hs);
      if (style === "spiky") {
        R(10, 0, 3, 3, hair);
        R(15, 0, 3, 3, hair);
        R(20, 1, 3, 2, hair);
      }
      R(12, 8, 3, 1, hs);
      R(18, 8, 3, 1, hs);
      R(12, 9, 3, 3, "#fff");
      R(18, 9, 3, 3, "#fff");
      R(13, 10, 2, 2, "#2a1a0e");
      R(19, 10, 2, 2, "#2a1a0e");
      R(16, 11, 1, 2, sk);
      R(14, 13, 4, 1, "#b13e53");
      if (girl) {
        R(11, 12, 2, 1, "#ff9aa8");
        R(20, 12, 2, 1, "#ff9aa8");
      }
    });
  const robot = paint((R) => {
    const m = "#c8d0d8",
      ms = shade(m, 0.7),
      d = "#8a96a8",
      n = "#1f2347";
    R(15, 0, 2, 4, d);
    R(14, 0, 4, 2, "#e6005c");
    R(9, 4, 14, 11, m);
    R(20, 4, 3, 11, ms);
    R(10, 5, 12, 1, "#fff");
    R(11, 7, 10, 5, n);
    R(13, 8, 2, 3, "#2bb3c9");
    R(18, 8, 2, 3, "#2bb3c9");
    R(14, 13, 4, 1, n);
    R(6, 8, 3, 4, d);
    R(23, 8, 3, 4, ms);
    R(13, 15, 6, 3, d);
    R(8, 17, 16, 9, m);
    R(20, 17, 4, 9, ms);
    R(11, 19, 10, 5, n);
    R(12, 20, 8, 3, "#2bb3c9");
    R(15, 21, 2, 1, "#e6005c");
    R(10, 25, 12, 1, ms);
    R(4, 17, 4, 9, d);
    R(24, 17, 4, 9, ms);
    R(4, 25, 4, 3, n);
    R(24, 25, 4, 3, n);
    R(10, 26, 5, 4, "#4b5368");
    R(17, 26, 5, 4, "#4b5368");
    R(9, 30, 6, 2, n);
    R(17, 30, 6, 2, n);
  });
  const CHARS = [
    {
      nome: "ALEX",
      sp: human({
        skin: "#f1c27d",
        hair: "#2a1a0e",
        shirt: "#2bb3c9",
        pants: "#1f2347",
        style: "short",
      }),
    },
    {
      nome: "BRUNO",
      sp: human({
        skin: "#8d5524",
        hair: "#14172e",
        shirt: "#f9b233",
        pants: "#1565c0",
        style: "spiky",
      }),
    },
    {
      nome: "LUNA",
      sp: human({
        skin: "#f1c27d",
        hair: "#e6005c",
        shirt: "#1565c0",
        pants: "#1f2347",
        style: "long",
        girl: true,
      }),
    },
    {
      nome: "MAYA",
      sp: human({
        skin: "#c68642",
        hair: "#3b2314",
        shirt: "#e6005c",
        pants: "#2bb3c9",
        style: "pony",
        girl: true,
      }),
    },
    { nome: "BOT-7", sp: robot },
  ];
  let me = CHARS[0];

  // ---------- Itens ----------
  const ITEMS = [
    {
      nome: "ENERGÉTICO",
      art: "O ENERGÉTICO",
      sp: paint((R) => {
        R(10, 4, 14, 26, "#1565c0");
        R(11, 6, 3, 22, "#4a90e2");
        R(21, 4, 3, 26, "#0d3f80");
        R(10, 2, 14, 3, "#c8d0d8");
        R(12, 1, 10, 1, "#e8edf2");
        R(10, 29, 14, 2, "#8a96a8");
        R(10, 14, 14, 4, "#e6005c");
        R(18, 7, 4, 2, "#f9b233");
        R(16, 9, 4, 2, "#f9b233");
        R(18, 11, 4, 2, "#f9b233");
        R(13, 20, 8, 1, "#fff");
        R(13, 23, 8, 1, "#fff");
      }),
    },
    {
      nome: "CAFÉ",
      art: "O CAFÉ",
      sp: paint((R) => {
        R(6, 29, 22, 2, "#c8d0d8");
        R(8, 14, 18, 15, "#f4f4f4");
        R(22, 14, 4, 15, "#c8d0d8");
        R(9, 14, 16, 3, "#5d3a1a");
        R(10, 15, 6, 1, "#8b5a2b");
        R(26, 17, 5, 2, "#f4f4f4");
        R(29, 17, 2, 8, "#f4f4f4");
        R(26, 23, 5, 2, "#f4f4f4");
        R(14, 20, 6, 5, "#2bb3c9");
        R(16, 21, 2, 3, "#1f2347");
        R(13, 8, 2, 3, "#c8d0d8");
        R(15, 5, 2, 3, "#c8d0d8");
        R(19, 8, 2, 3, "#c8d0d8");
        R(21, 5, 2, 3, "#c8d0d8");
      }),
    },
    {
      nome: "LIVRO DE ESPANHOL",
      art: "O LIVRO DE ESPANHOL",
      sp: paint((R) => {
        R(6, 6, 22, 24, "#e6005c");
        R(6, 6, 4, 24, "#a30040");
        R(10, 28, 18, 2, "#f4e4c1");
        R(27, 8, 2, 20, "#f4e4c1");
        R(13, 10, 12, 8, "#f9b233");
        R(15, 12, 1, 5, INK);
        R(16, 12, 2, 1, INK);
        R(16, 14, 1, 1, INK);
        R(16, 16, 2, 1, INK);
        R(20, 12, 3, 1, INK);
        R(20, 13, 1, 1, INK);
        R(20, 14, 3, 1, INK);
        R(22, 15, 1, 1, INK);
        R(20, 16, 3, 1, INK);
        R(13, 22, 12, 2, "#2bb3c9");
        R(13, 25, 12, 1, "#f9b233");
      }),
    },
  ];

  // ---------- Logos (aproximações em pixel art) ----------
  const logoSP = paint(
    (R) => {
      R(0, 0, 32, 32, "#1f2347");
      R(3, 3, 13, 12, "#e3e6e8");
      R(3, 17, 13, 12, "#2bb3c9");
      R(18, 3, 11, 26, "#fff");
      R(21, 6, 5, 8, "#1f2347");
      R(22, 18, 7, 11, "#1f2347");
      R(16, 3, 2, 26, "#1f2347");
    },
    32,
    32,
    false,
  );
  const GL = {
    F: ["XXXXX", "XX...", "XXXX.", "XX...", "XX...", "XX...", "XX..."],
    I: ["XXXXX", "..XX.", "..XX.", "..XX.", "..XX.", "..XX.", "XXXXX"],
    A: [".XXX.", "XX.XX", "XX.XX", "XXXXX", "XX.XX", "XX.XX", "XX.XX"],
    P: ["XXXX.", "XX.XX", "XX.XX", "XXXX.", "XX...", "XX...", "XX..."],
  };
  const logoFIAP = (px) => {
    const W = 28,
      H = 12,
      g = Array.from({ length: H }, () => Array(W).fill("#f4f4f4"));
    [..."FIAP"].forEach((l, k) =>
      GL[l].forEach((row, j) =>
        [...row].forEach((c, i) => {
          if (c === "X") {
            g[j + 3][k * 6 + i + 2] = "#9c0f3c";
            g[j + 2][k * 6 + i + 1] = "#ed145b";
          }
        }),
      ),
    );
    return toCanvas(g, px);
  };

  const heart = (full) =>
    toCanvas(
      [
        "..XX.XX..",
        ".XXXXXXX.",
        ".XXXXXXX.",
        "..XXXXX..",
        "...XXX...",
        "....X....",
      ].map((r) =>
        [...r].map((c) => (c === "X" ? (full ? "#e6005c" : "#4b5368") : null)),
      ),
      3,
    );

  // ---------- Telas ----------
  put($("#deco"), me.sp(4), ...ITEMS.map((it) => it.sp(4)));
  $("#start").onclick = () => show("s-char");
  CHARS.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    b.append(c.sp(5), c.nome);
    b.onclick = () => {
      me = c;
      show("s-school");
    };
    $("#chars").append(b);
  });
  $("#logo-fiap").append(logoFIAP(6));
  $("#logo-sptech").append(logoSP(5));
  $("#fiap").onclick = () => {
    const n = $("#nope");
    n.hidden = true;
    void n.offsetWidth;
    n.hidden = false;
  };
  $("#sptech").onclick = () => {
    $("#nope").hidden = true;
    show("s-item");
  };

  let item = ITEMS[0];
  ITEMS.forEach((it) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "card";
    b.append(it.sp(6), it.nome);
    b.onclick = () => {
      item = it;
      put($("#intro-art"), me.sp(6), it.sp(6));
      show("s-intro");
    };
    $("#items").append(b);
  });

  // ---------- Mecânica: 3 vidas + 3 dicas ----------
  let hearts = 3,
    hints = 3,
    best = 0;
  const hud = () => {
    put($("#hearts"), ...[0, 1, 2].map((i) => heart(i < hearts)));
    $("#hint").textContent = "DICA (" + hints + ")";
  };
  const restart = () => {
    hearts = 3;
    hints = 3;
    best = 0;
    hud();
  };
  const overlay = (title, text, over) => {
    put($("#win-art"), me.sp(6), item.sp(6));
    $("#win-title").textContent = title;
    $("#win-text").textContent = text;
    $("#close-win").dataset.over = over ? "1" : "";
    $("#win").hidden = false;
  };

  $("#go").onclick = () => {
    put($("#hud-art"), me.sp(2), item.sp(2));
    $("#hud-text").textContent = "BATALHANDO POR: " + item.nome;
    restart();
    show("s-game");
    selectEntry(entries[0]);
  };
  // Conferir sem acertar nenhuma palavra nova custa 1 vida
  $("#check").addEventListener("click", () => {
    const n = parseInt($("#score").textContent, 10);
    if (n >= entries.length) return;
    if (n > best) {
      best = n;
      return;
    }
    hearts -= 1;
    hud();
    $("#feedback").textContent += " −1 VIDA!";
    if (hearts <= 0)
      overlay(
        "GAME OVER",
        "SEM VIDAS! O GUARDIÃO FICOU COM O ITEM. TENTE DE NOVO!",
        true,
      );
  });
  $("#hint").onclick = () => {
    const open = [...cells.values()].filter((c) => c.input.value !== c.letter);
    if (!hints || !open.length) return;
    const t = open[Math.floor(Math.random() * open.length)];
    t.input.value = t.letter;
    hints -= 1;
    hud();
    invalidateResults();
    startTimer();
    t.input.focus();
  };
  $("#confirm-reset").addEventListener("click", restart);
  $("#close-win").onclick = (e) => {
    $("#win").hidden = true;
    if (e.currentTarget.dataset.over) {
      restart();
      resetGame();
    }
  };

  const baseCelebrate = celebrate;
  celebrate = () => {
    baseCelebrate();
    setTimeout(
      () =>
        overlay(
          "VITÓRIA!",
          "VOCÊ CONQUISTOU " +
            item.art +
            " COM " +
            hearts +
            " VIDA(S) RESTANTE(S)!",
          false,
        ),
      1200,
    );
  };
})();
