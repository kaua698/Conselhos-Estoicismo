/* =========================================================
   Conselho do Dia — lógica das páginas
   Todo conteúdo dinâmico é inserido com textContent (nada de innerHTML).
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Utilidades ---------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, props, ...children) {
    const node = document.createElement(tag);
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        if (value == null || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    children.flat().forEach((child) => {
      if (child == null || child === false) return;
      node.append(child instanceof Node ? child : document.createTextNode(child));
    });
    return node;
  }

  function icon(name, cls = "icon") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", cls);
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + name);
    svg.append(use);
    return svg;
  }

  const byId = (id) => REFLEXOES.find((r) => r.id === id);
  const temaById = (id) => TEMAS.find((t) => t.id === id);
  const reflexoesDoTema = (id) => REFLEXOES.filter((r) => r.theme === id);

  const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const DIAS_CURTOS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  function parseDate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const shortDate = (str) => { const d = parseDate(str); return d.getDate() + " " + MESES_CURTOS[d.getMonth()]; };

  function fadeIn(node) {
    node.classList.remove("fade-in");
    void node.offsetWidth; // reinicia a animação
    node.classList.add("fade-in");
  }

  let toastTimer;
  function toast(message) {
    const node = $("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-visible"), 2200);
  }

  /* Rótulo de confiança da fonte: sempre ícone + texto. */
  function badge(r) {
    if (r.type === "modern") {
      return el("p", { class: "badge" }, icon("i-pen"), "Interpretação moderna");
    }
    if (r.sourceStatus === "verified") {
      return el("p", { class: "badge badge--verified" }, icon("i-check"), "Fonte verificada");
    }
    if (r.sourceStatus === "paraphrase") {
      return el("p", { class: "badge" }, el("span", { class: "badge__symbol", "aria-hidden": "true", text: "≈" }), "Paráfrase de uma ideia estoica");
    }
    return el("p", { class: "badge" }, el("span", { class: "badge__symbol", "aria-hidden": "true", text: "?" }), "Atribuição tradicional, mas incerta");
  }

  function workLine(r) {
    if (!r.work) return "";
    return r.reference ? r.work + ", " + r.reference : r.work;
  }

  function authorNode(r) {
    if (r.type === "modern" || !r.author) return null;
    const work = workLine(r);
    return el("p", { class: "advice__author" }, r.author, work ? el("span", { class: "advice__work", text: " · " + work }) : null);
  }

  function shareText(r) {
    const lines = ["“" + r.text + "”"];
    if (r.type !== "modern" && r.author) lines.push("— " + r.author);
    const base = location.href.split(/[?#]/)[0].replace(/[^/]*$/, "");
    lines.push("", "Conselho do Dia · " + base);
    return lines.join("\n");
  }

  async function share(r) {
    const text = shareText(r);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Conselho do Dia", text });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Texto copiado");
    } catch (e) {
      toast("Não foi possível copiar");
    }
  }

  /* ---------- Comum a todas as páginas ---------- */

  function renderTopDate() {
    const node = $("[data-today]");
    if (!node) return;
    const today = Store.today();
    const d = parseDate(today);
    node.dateTime = today;
    node.textContent = DIAS_CURTOS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()];
  }

  function renderRhythm() {
    const countNode = $("[data-rhythm-count]");
    const dotsNode = $("[data-dots]");
    if (!countNode || !dotsNode) return;
    const now = parseDate(Store.today());
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const done = Store.practicedDaysInMonth(year, month);
    const total = new Date(year, month, 0).getDate();
    const nome = MESES[month - 1];

    countNode.textContent = done.size === 0
      ? "Nenhuma prática ainda em " + nome
      : done.size + (done.size === 1 ? " prática em " : " práticas em ") + nome;

    dotsNode.replaceChildren();
    for (let day = 1; day <= total; day++) {
      let cls = "dot";
      if (done.has(day)) cls += " dot--done";
      else if (day < now.getDate()) cls += " dot--missed";
      dotsNode.append(el("span", { class: cls }));
    }
  }

  function statusNode(item) {
    if (item.practiced) return el("span", { class: "status status--done" }, icon("i-check"), "Praticado");
    if (item.saved) return el("span", { class: "status" }, icon("i-bookmark", "icon"), "Salvo");
    return el("span", { class: "status", text: "Visto" });
  }

  function reflectionRow(item, opts = {}) {
    const r = byId(item.id);
    if (!r) return null;
    const tema = temaById(r.theme);
    return el("li", null,
      el("a", { class: "row", href: "index.html?r=" + encodeURIComponent(r.id) },
        el("span", { class: "row__body", style: "width:100%" },
          el("span", { class: "row__meta" },
            el("span", { text: shortDate(item.date) + " · " + (tema ? tema.nome : "") }),
            statusNode(item)
          ),
          el("span", { class: "row__title", text: r.title }),
          opts.showAnswer && item.answer ? el("span", { class: "row__answer", text: "Sua resposta: “" + item.answer + "”" }) : null
        )
      )
    );
  }

  /* ---------- Hoje ---------- */

  function initHoje() {
    const params = new URLSearchParams(location.search);
    const requested = params.get("r") && byId(params.get("r"));
    const dailyId = Store.dailyId(REFLEXOES);
    const r = requested || byId(dailyId);
    const isDaily = r.id === dailyId;

    // Cabeçalho do conselho
    const eyebrow = $("[data-eyebrow]");
    const d = parseDate(Store.today());
    const dataLonga = DIAS[d.getDay()].replace(/^./, (c) => c.toUpperCase()) + ", " + d.getDate() + " de " + MESES[d.getMonth()];
    eyebrow.replaceChildren(...(isDaily
      ? [el("span", { class: "eyebrow__date", text: dataLonga + " · " }), "Seu conselho de hoje"]
      : ["Reflexão"]));
    $("[data-back]").hidden = isDaily;

    const tema = temaById(r.theme);
    const themeLink = $("[data-theme]");
    themeLink.textContent = tema.nome;
    themeLink.href = "explorar.html?tema=" + tema.id + "#tema";

    $("[data-text]").textContent = r.text;
    const source = $(".advice__source");
    source.replaceChildren(...[authorNode(r), badge(r)].filter(Boolean));
    $("[data-explanation]").textContent = r.explanation;
    $("[data-question]").textContent = r.question;
    $("[data-action]").textContent = r.action;
    $("[data-minutes]").textContent = r.minutes + " min";
    $("[data-help]").hidden = !r.help;
    if (!isDaily) document.title = r.title + " — Conselho do Dia";
    fadeIn($("[data-advice]"));

    // Resposta (salva enquanto digita)
    const answer = $("[data-answer]");
    answer.value = Store.getAnswer(r.id);
    let answerTimer;
    answer.addEventListener("input", () => {
      clearTimeout(answerTimer);
      answerTimer = setTimeout(() => Store.setAnswer(r.id, answer.value), 300);
    });

    // Praticado
    const practiceBtn = $("[data-practice]");
    const paintPractice = () => {
      const on = Store.isPracticedToday(r.id);
      practiceBtn.setAttribute("aria-pressed", String(on));
      practiceBtn.replaceChildren(...(on ? [icon("i-check"), "Praticado hoje"] : ["Marcar como praticado"]));
    };
    practiceBtn.addEventListener("click", () => {
      const on = Store.togglePracticed(r.id);
      paintPractice();
      renderRhythm();
      if (on) toast("Prática registrada");
    });
    paintPractice();

    // Salvar
    const saveBtn = $("[data-save]");
    const paintSave = () => {
      const on = Store.isSaved(r.id);
      saveBtn.setAttribute("aria-pressed", String(on));
      $("[data-save-label]").textContent = on ? "Salvo" : "Salvar";
    };
    saveBtn.addEventListener("click", () => {
      const on = Store.toggleSaved(r.id);
      paintSave();
      toast(on ? "Salvo em Reflexões" : "Removido dos salvos");
    });
    paintSave();

    // Compartilhar
    $("[data-share]").addEventListener("click", () => share(r));

    // Outra reflexão (não troca o conselho do dia)
    const others = REFLEXOES.filter((x) => x.id !== r.id && x.id !== dailyId);
    const other = others[Math.floor(Math.random() * others.length)];
    $("[data-other]").href = "index.html?r=" + encodeURIComponent(other.id);

    // Lateral (desktop)
    renderRhythm();
    const previous = $("[data-previous]");
    const items = Store.recent().filter((i) => i.id !== dailyId).slice(0, 3);
    previous.replaceChildren(...items.map((i) => reflectionRow(i)).filter(Boolean));
    if (!items.length) previous.append(el("li", { class: "empty", text: "Suas reflexões anteriores aparecem aqui." }));
  }

  /* ---------- Explorar ---------- */

  function initExplorar() {
    const chipsNode = $("[data-chips]");
    const result = $("[data-result]");
    const position = {}; // índice atual por sentimento

    function pick(sentimento, step) {
      const lista = reflexoesDoTema(sentimento.tema);
      if (!(sentimento.id in position)) {
        const first = lista.findIndex((r) => r.id === sentimento.primeiro);
        position[sentimento.id] = first >= 0 ? first : 0;
      } else if (step) {
        position[sentimento.id] = (position[sentimento.id] + 1) % lista.length;
      }
      return lista[position[sentimento.id]];
    }

    function showResult(sentimento, step) {
      const r = pick(sentimento, step);
      const tema = temaById(r.theme);
      result.replaceChildren(
        el("p", { class: "eyebrow", text: tema.nome }),
        el("p", { class: "result__text", text: r.text }),
        el("div", { style: "display:flex;flex-direction:column;gap:6px" }, authorNode(r), badge(r)),
        el("div", { class: "result__divider" },
          el("p", { class: "eyebrow", text: "Pratique agora" }),
          el("p", { class: "action-text", text: r.action })
        ),
        sentimento.ajuda || r.help
          ? el("p", { class: "help-note" },
              "Se estiver pesado demais, converse com alguém. ",
              el("strong", { text: "CVV — ligue 188" }), ", 24h e gratuito, ou acesse ",
              el("a", { href: "https://cvv.org.br", rel: "noopener", text: "cvv.org.br" }), ".")
          : null,
        el("div", { class: "btn-row" },
          reflexoesDoTema(sentimento.tema).length > 1
            ? el("button", { type: "button", class: "btn", text: "Outra deste tema", onclick: () => showResult(sentimento, true) })
            : null,
          el("a", { class: "btn btn--primary", href: "index.html?r=" + encodeURIComponent(r.id), text: "Abrir reflexão" })
        )
      );
      result.hidden = false;
      fadeIn(result);
    }

    SENTIMENTOS.forEach((s) => {
      const chip = el("button", { type: "button", class: "chip", "aria-pressed": "false" }, icon("i-check"), s.label);
      chip.addEventListener("click", () => {
        $$(".chip", chipsNode).forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        showResult(s, false);
      });
      chipsNode.append(chip);
    });

    // Lista de temas
    const themesNode = $("[data-themes]");
    TEMAS.forEach((t) => {
      const n = reflexoesDoTema(t.id).length;
      if (!n) return;
      themesNode.append(el("li", null,
        el("a", { class: "row", href: "explorar.html?tema=" + t.id + "#tema" },
          el("span", { class: "row__body" },
            el("span", { class: "row__title", text: t.nome }),
            el("span", { class: "row__desc", text: t.desc + " · " + n + (n === 1 ? " reflexão" : " reflexões") })
          ),
          icon("i-chevron", "icon icon--chevron")
        )
      ));
    });

    // Detalhe de um tema (?tema=)
    const temaId = new URLSearchParams(location.search).get("tema");
    const tema = temaId && temaById(temaId);
    if (tema) {
      const detail = $("[data-theme-detail]");
      $("[data-theme-name]").textContent = tema.nome;
      $("[data-theme-desc]").textContent = tema.desc;
      $("[data-theme-list]").replaceChildren(...reflexoesDoTema(tema.id).map((r) =>
        el("li", null,
          el("a", { class: "row", href: "index.html?r=" + encodeURIComponent(r.id) },
            el("span", { class: "row__body" },
              el("span", { class: "row__title", text: r.title }),
              el("span", { class: "row__desc", text: r.type === "modern" ? "Interpretação moderna" : r.author })
            ),
            icon("i-chevron", "icon icon--chevron")
          )
        )
      ));
      detail.hidden = false;
      document.title = tema.nome + " — Conselho do Dia";
    }
  }

  /* ---------- Reflexões ---------- */

  function initReflexoes() {
    renderRhythm();
    const listNode = $("[data-list]");
    let current = "recentes";

    function empty(message) {
      return el("p", { class: "empty" }, message + " ", el("a", { href: "index.html", text: "Ver o conselho de hoje →" }));
    }

    function render() {
      $$("[data-tab]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tab === current)));
      let content;
      if (current === "recentes") {
        const items = Store.recent();
        content = items.length
          ? el("ol", { class: "rows" }, items.map((i) => reflectionRow(i, { showAnswer: true })).filter(Boolean))
          : empty("Nada aqui ainda.");
      } else if (current === "salvos") {
        const items = Store.savedList();
        content = items.length
          ? el("ol", { class: "rows" }, items.map((i) => reflectionRow(i, { showAnswer: true })).filter(Boolean))
          : empty("Você ainda não salvou nenhuma reflexão.");
      } else {
        const counts = {};
        Store.recent().forEach((i) => {
          const r = byId(i.id);
          if (r) counts[r.theme] = (counts[r.theme] || 0) + 1;
        });
        const temas = TEMAS.filter((t) => counts[t.id]).sort((a, b) => counts[b.id] - counts[a.id]);
        content = temas.length
          ? el("ul", { class: "rows" }, temas.map((t) =>
              el("li", null,
                el("a", { class: "row", href: "explorar.html?tema=" + t.id + "#tema" },
                  el("span", { class: "row__title", text: t.nome }),
                  el("span", { class: "row__desc", text: counts[t.id] + (counts[t.id] === 1 ? " reflexão" : " reflexões") })
                )
              )))
          : empty("Nada aqui ainda.");
      }
      listNode.replaceChildren(content);
      fadeIn(listNode);
    }

    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => { current = b.dataset.tab; render(); }));
    render();

    // Exportar
    $("[data-export]").addEventListener("click", () => {
      const blob = new Blob([Store.exportJSON()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = el("a", { href: url, download: "conselho-do-dia-" + Store.today() + ".json" });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    // Apagar — pede confirmação no próprio botão
    const clearBtn = $("[data-clear]");
    let armed = false;
    let armTimer;
    clearBtn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        clearBtn.textContent = "Confirmar: apagar tudo";
        armTimer = setTimeout(() => { armed = false; clearBtn.textContent = "Apagar meus dados"; }, 4000);
        return;
      }
      clearTimeout(armTimer);
      armed = false;
      Store.clear();
      clearBtn.textContent = "Apagar meus dados";
      renderRhythm();
      render();
      toast("Seus dados foram apagados");
    });
  }

  /* ---------- Prática ---------- */

  function initPratica() {
    let index = 0;
    const optionsNode = $("[data-options]");
    const revealBtn = $("[data-reveal]");
    const answer = $("[data-answer]");

    function render() {
      const s = SITUACOES[index];
      $("[data-counter]").textContent = (index + 1) + " de " + SITUACOES.length;
      $("[data-situation]").textContent = s.texto;
      optionsNode.replaceChildren(...s.opcoes.map((o, i) =>
        el("label", { class: "option" },
          el("input", { type: "checkbox", name: "opcao-" + i }),
          el("span", { class: "option__text", text: o.texto }),
          el("span", { class: "option__tag", "data-tag": i, hidden: true })
        )
      ));
      revealBtn.hidden = false;
      answer.hidden = true;
    }

    revealBtn.addEventListener("click", () => {
      const s = SITUACOES[index];
      $$(".option", optionsNode).forEach((label, i) => {
        const o = s.opcoes[i];
        const marcada = $("input", label).checked;
        const tag = $("[data-tag]", label);
        tag.textContent = o.controle ? "✓ depende de você" : "não depende";
        tag.className = "option__tag" + (o.controle ? " option__tag--yes" : "");
        tag.hidden = false;
        label.classList.toggle("is-wrong", marcada !== o.controle);
      });
      $("[data-lead]").textContent = s.perspectiva;
      $("[data-reasoning]").textContent = s.raciocinio;
      $("[data-do]").textContent = s.acao;
      revealBtn.hidden = true;
      answer.hidden = false;
      fadeIn(answer);
    });

    $("[data-next]").addEventListener("click", () => {
      index = (index + 1) % SITUACOES.length;
      render();
      $("[data-situation]").focus({ preventScroll: true });
      fadeIn($("[data-perspective]"));
    });

    $("[data-situation]").tabIndex = -1;
    render();
  }

  /* ---------- Início ---------- */

  renderTopDate();
  const pages = { index: initHoje, explorar: initExplorar, reflexoes: initReflexoes, pratica: initPratica };
  const init = pages[document.body.dataset.page];
  if (init) init();
})();
