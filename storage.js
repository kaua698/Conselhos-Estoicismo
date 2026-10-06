/* =========================================================
   Conselho do Dia — armazenamento local
   Tudo fica no localStorage deste navegador. Nada vai para servidor.
   ========================================================= */

const Store = (function () {
  const KEY = "conselho:v1";

  function empty() {
    return {
      v: 1,
      daily: null,     // { date, id } — conselho do dia, fixo depois de sorteado
      seen: {},        // { "AAAA-MM-DD": id } — conselhos do dia já vistos
      practiced: [],   // [{ id, date }]
      saved: [],       // [{ id, date }]
      answers: {}      // { id: "texto" }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return empty();
      const data = JSON.parse(raw);
      return Object.assign(empty(), data);
    } catch (e) {
      return empty();
    }
  }

  function persist(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* navegador sem storage (modo privado, cota cheia): o site continua funcionando */
    }
  }

  function today() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function dayNumber(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }

  /* Conselho do dia determinístico: depende só da data.
     Depois de escolhido, fica gravado — se a base crescer, o de hoje não muda. */
  function dailyId(list) {
    const data = load();
    const date = today();
    if (data.daily && data.daily.date === date && list.some((r) => r.id === data.daily.id)) {
      return data.daily.id;
    }
    const offset = dayNumber(date) - dayNumber(LANCAMENTO);
    const index = ((offset % list.length) + list.length) % list.length;
    const id = list[index].id;
    data.daily = { date, id };
    data.seen[date] = id;
    persist(data);
    return id;
  }

  function isPracticedToday(id) {
    const date = today();
    return load().practiced.some((p) => p.id === id && p.date === date);
  }

  function togglePracticed(id) {
    const data = load();
    const date = today();
    const i = data.practiced.findIndex((p) => p.id === id && p.date === date);
    if (i >= 0) data.practiced.splice(i, 1);
    else data.practiced.push({ id, date });
    persist(data);
    return i < 0;
  }

  function isSaved(id) {
    return load().saved.some((s) => s.id === id);
  }

  function toggleSaved(id) {
    const data = load();
    const i = data.saved.findIndex((s) => s.id === id);
    if (i >= 0) data.saved.splice(i, 1);
    else data.saved.push({ id, date: today() });
    persist(data);
    return i < 0;
  }

  function getAnswer(id) {
    return load().answers[id] || "";
  }

  function setAnswer(id, text) {
    const data = load();
    if (text.trim()) data.answers[id] = text;
    else delete data.answers[id];
    persist(data);
  }

  /* Lista de reflexões com a data mais recente de interação e o estado. */
  function recent() {
    const data = load();
    const map = {};
    const touch = (id, date) => {
      if (!map[id] || map[id] < date) map[id] = date;
    };
    Object.keys(data.seen).forEach((date) => touch(data.seen[date], date));
    data.practiced.forEach((p) => touch(p.id, p.date));
    data.saved.forEach((s) => touch(s.id, s.date));
    return Object.keys(map)
      .map((id) => ({
        id,
        date: map[id],
        practiced: data.practiced.some((p) => p.id === id),
        saved: data.saved.some((s) => s.id === id),
        answer: data.answers[id] || ""
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function savedList() {
    const data = load();
    return data.saved
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((s) => ({
        id: s.id,
        date: s.date,
        practiced: data.practiced.some((p) => p.id === s.id),
        saved: true,
        answer: data.answers[s.id] || ""
      }));
  }

  /* Dias do mês (1–31) com pelo menos uma prática. */
  function practicedDaysInMonth(year, month) {
    const prefix = year + "-" + String(month).padStart(2, "0") + "-";
    const days = new Set();
    load().practiced.forEach((p) => {
      if (p.date.startsWith(prefix)) days.add(Number(p.date.slice(8, 10)));
    });
    return days;
  }

  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {}
  }

  return {
    today, dailyId, isPracticedToday, togglePracticed, isSaved, toggleSaved,
    getAnswer, setAnswer, recent, savedList, practicedDaysInMonth, exportJSON, clear
  };
})();
