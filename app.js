/* Providus — Pēc vēlēšanām: valdība un budžets. Vanilla JS, bez ārējām bibliotēkām. */
(function () {
  "use strict";
  const D = window.PDATA;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const MS = 86400000;
  const pd = s => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
  const days = (a, b) => Math.round((pd(b) - pd(a)) / MS);
  const addDays = (s, n) => iso(new Date(pd(s) + n * MS));
  const iso = dt => dt.toISOString().slice(0, 10);
  const fmt = s => { if (!s) return "—"; const [y, m, d] = s.split("-"); return `${d}.${m}.${y}`; };
  const MONTHS_G = ["janvārī", "februārī", "martā", "aprīlī", "maijā", "jūnijā", "jūlijā", "augustā", "septembrī", "oktobrī", "novembrī", "decembrī"];
  const MONTHS_S = ["jan", "feb", "mar", "apr", "mai", "jūn", "jūl", "aug", "sep", "okt", "nov", "dec"];
  const fmtLong = s => { const [y, m, d] = s.split("-").map(Number); return `${y}. gada ${d}. ${MONTHS_G[m - 1]}`; };
  const median = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const svgEl = (tag, attrs, parent) => { const e = document.createElementNS("http://www.w3.org/2000/svg", tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const pluralD = n => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "diena" : "dienas"}`;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* "Šodien" — var pārrakstīt ar ?date=YYYY-MM-DD (testēšanai / fiksētam attēlam) */
  const qp = new URLSearchParams(location.search).get("date");
  const TODAY = qp && /^\d{4}-\d{2}-\d{2}$/.test(qp) ? qp : iso(new Date());
  $("#stampToday").textContent = fmt(TODAY);
  $("#stampDate").textContent = fmt(D.UPDATED);

  /* Aprēķinātie Latvijas cikli */
  const LV = D.LV.map(c => ({ ...c, dGov: days(c.elect, c.gov), dBud: days(c.elect, c.budget), dG2B: days(c.gov, c.budget), dJan: days(c.elect, `${c.budgetYear}-01-01`), beforeJan: pd(c.budget) < pd(`${c.budgetYear}-01-01`) }));
  const STATS = {
    gov: { med: median(LV.map(c => c.dGov)), min: Math.min(...LV.map(c => c.dGov)), max: Math.max(...LV.map(c => c.dGov)) },
    bud: { med: median(LV.map(c => c.dBud)), min: Math.min(...LV.map(c => c.dBud)), max: Math.max(...LV.map(c => c.dBud)) },
    g2b: { med: median(LV.map(c => c.dG2B)), min: Math.min(...LV.map(c => c.dG2B)), max: Math.max(...LV.map(c => c.dG2B)) }
  };
  const E26 = D.LV2026.elect, JAN27 = "2027-01-01";
  const sinceElect = days(E26, TODAY);

  /* Tooltip */
  const tip = $("#tip");
  function showTip(html, x, y) {
    tip.innerHTML = html; tip.classList.add("on"); tip.setAttribute("aria-hidden", "false");
    const r = tip.getBoundingClientRect(); let left = x + 14, top = y + 14;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - 14;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - 14;
    tip.style.left = Math.max(8, left) + "px"; tip.style.top = Math.max(8, top) + "px";
  }
  function hideTip() { tip.classList.remove("on"); tip.setAttribute("aria-hidden", "true"); }

  /* Tabs */
  const tabs = $$(".tab"), panels = $$(".panel");
  function selectTab(id) {
    tabs.forEach(t => t.setAttribute("aria-selected", String(t.getAttribute("aria-controls") === id)));
    panels.forEach(p => { const on = p.id === id; p.classList.toggle("on", on); p.hidden = !on; });
    hideTip();
    requestAnimationFrame(() => { if (id === "vesture") renderGantt(); if (id === "kaimini") renderNeighbours(); });
  }
  tabs.forEach(t => t.addEventListener("click", () => selectTab(t.getAttribute("aria-controls"))));
  $(".tablist").addEventListener("keydown", e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); selectTab(n.getAttribute("aria-controls")); }
  });

  /* ===== 1. PĀRSKATS ===== */
  function animateNum(el, to) {
    if (reduced) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 700;
    const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function renderKPIs() {
    const toJan = days(TODAY, JAN27);
    const before = LV.filter(c => c.beforeJan).length;
    const k = [
      { lbl: "Dienas kopš 15. Saeimas vēlēšanām", val: Math.max(0, sinceElect), unit: "d.", sub: `Vēlēšanas ${fmt(E26)}. Valdība vēl nav apstiprināta.`, acc: "var(--now)", anim: true },
      { lbl: "Dienas līdz 2027. gada 1. janvārim", val: Math.max(0, toJan), unit: "d.", sub: toJan > 0 ? "Pēc tam, ja budžeta nav — pagaidu budžets." : "Budžeta gads jau sācies.", acc: "var(--bud)", anim: true },
      { lbl: "Mediāna: vēlēšanas → valdība", val: STATS.gov.med, unit: "d.", sub: `10 cikli 1993–2022 · no ${STATS.gov.min} līdz ${STATS.gov.max} dienām`, acc: "var(--gov)" },
      { lbl: "Mediāna: vēlēšanas → budžets", val: STATS.bud.med, unit: "d.", sub: `Budžets pirms 1. janvāra — ${before} reizes no 10`, acc: "var(--bud)" }
    ];
    $("#kpis").innerHTML = k.map(x => `<div class="card" style="--acc:${x.acc}"><div class="lbl">${x.lbl}</div><div class="val"><span class="num" data-v="${x.val}">${x.anim ? 0 : x.val}</span><small>${x.unit}</small></div><div class="sub">${x.sub}</div></div>`).join("");
    $$("#kpis .num").forEach((el, i) => { if (k[i].anim) animateNum(el, k[i].val); });
  }
  function renderSteps() {
    $("#steps").innerHTML = D.LV2026.steps.map(s => `<li class="step ${s.done ? "" : "todo"}"><span class="dot"></span><div class="d">${s.done ? fmt(s.date) : "?"}</div><div class="t">${esc(s.label)}</div>${s.hint ? `<div class="h">${esc(s.hint)}</div>` : ""}</li>`).join("");
  }

  /* Scenārijs */
  const scen = { gov: "2026-11-18", bud: "2026-12-23" };
  function rankText(v, key) {
    const arr = LV.map(c => c[key]); const faster = arr.filter(x => x > v).length, slower = arr.filter(x => x < v).length, same = arr.length - faster - slower;
    if (faster === arr.length) return "īsāk nekā visos 10 iepriekšējos ciklos";
    if (slower === arr.length) return "ilgāk nekā visos 10 iepriekšējos ciklos";
    return `īsāk nekā ${faster} un ilgāk nekā ${slower} no 10 cikliem${same ? ` (${same} — tikpat)` : ""}`;
  }
  function strip(values, labels, v, med, color, max) {
    const W = 600, H = 58, L = 8, Rr = 8, y = 30, sc = x => L + (x / max) * (W - L - Rr);
    let s = `<svg class="strip" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">`;
    s += `<line x1="${L}" x2="${W - Rr}" y1="${y}" y2="${y}" stroke="#cfc9bf" stroke-width="2"/>`;
    [0, 50, 100, 150, 200, 250].filter(t => t <= max).forEach(t => { s += `<line x1="${sc(t)}" x2="${sc(t)}" y1="${y - 4}" y2="${y + 4}" stroke="#c1bcb5"/><text x="${sc(t)}" y="${H - 4}" font-size="10" fill="#9a948b" text-anchor="middle">${t}</text>`; });
    s += `<line x1="${sc(med)}" x2="${sc(med)}" y1="${y - 14}" y2="${y + 10}" stroke="${color}" stroke-width="2" stroke-dasharray="3 3"/><text x="${sc(med)}" y="${y - 17}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">mediāna ${med}</text>`;
    // dot jitter for ties
    const seen = {};
    values.forEach((x, i) => { const k = Math.round(x / 3); seen[k] = (seen[k] || 0) + 1; const dy = (seen[k] - 1) * 7 * (seen[k] % 2 ? 1 : -1); s += `<circle cx="${sc(x)}" cy="${y + dy}" r="5" fill="${color}" fill-opacity=".55" stroke="#fff" stroke-width="1.5"><title>${labels[i]}: ${x} d.</title></circle>`; });
    if (v != null) { const cx = Math.min(sc(Math.min(v, max)), W - Rr); s += `<g><line x1="${cx}" x2="${cx}" y1="${y - 12}" y2="${y + 12}" stroke="#b33f62" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${y}" r="7" fill="#b33f62" stroke="#fff" stroke-width="2"/></g>`; }
    return s + "</svg>";
  }
  function renderScenario() {
    const g = scen.gov, b = scen.bud, out = $("#scenOut");
    updateDateHints();
    const dG = days(E26, g), dB = days(E26, b), dG2B = days(g, b);
    const invalid = dG2B < 0;
    const mx = Math.max(STATS.bud.max, dB, 250) + 10;
    const lbls = LV.map(c => `${c.year} · ${c.pm}`);
    const deadline4m = (() => { const dt = new Date(pd(g)); dt.setUTCMonth(dt.getUTCMonth() + 4); return iso(dt); })();
    const beforeJan = pd(b) < pd(JAN27);
    let html = "";
    if (invalid) html += `<div class="verdict bad">Budžeta datums ir pirms uzticības balsojuma. Latvijā budžeta projektu Saeimai iesniedz Ministru kabinets, tāpēc šāda secība nav iespējama — pārbīdi kādu no datumiem.</div>`;
    const metrics = [
      { name: "Vēlēšanas → valdība", v: dG, key: "dGov", st: STATS.gov, col: "#262b73", note: `uzticības balsojums ${fmt(g)}` },
      { name: "Valdība → budžets", v: invalid ? null : dG2B, key: "dG2B", st: STATS.g2b, col: "#1f6a7e", note: invalid ? "—" : `no ${fmt(g)} līdz ${fmt(b)}` },
      { name: "Vēlēšanas → budžets", v: dB, key: "dBud", st: STATS.bud, col: "#736d64", note: `budžets pieņemts ${fmt(b)}` }
    ];
    metrics.forEach(m => {
      html += `<div class="metric"><div class="row"><div><div class="name">${m.name}</div><div class="cmp">${m.note}</div></div><div class="big num">${m.v == null ? "—" : m.v}<small>d.</small></div></div>`;
      html += strip(LV.map(c => c[m.key]), lbls, m.v, m.st.med, m.col, mx);
      html += `<div class="cmp">${m.v == null ? "" : `Šis būtu <b>${rankText(m.v, m.key)}</b>. Vēsturiskais diapazons ${m.st.min}–${m.st.max} d., mediāna ${m.st.med} d.`}</div></div>`;
    });
    const nBefore = LV.filter(c => c.beforeJan).length;
    if (!invalid) {
      if (beforeJan) { const bj = LV.filter(c => c.beforeJan), gmin = Math.min(...bj.map(c => c.dGov)), gmax = Math.max(...bj.map(c => c.dGov)), bmin = Math.min(...bj.map(c => c.dG2B)), bmax = Math.max(...bj.map(c => c.dG2B)); html += `<div class="verdict ok"><b>Budžets pirms budžeta gada sākuma.</b> Tā kopš 1993. gada ir noticis ${nBefore} reizes no 10 (${bj.map(c => c.year).join(", ")}). Visos šajos gadījumos valdība bija apstiprināta ${gmin}–${gmax} dienās pēc vēlēšanām, un no uzticības balsojuma līdz budžetam pagāja ${bmin}–${bmax} dienas; tavā scenārijā — ${dG} un ${dG2B}. Ātra valdība pati par sevi to negarantē: 2002. gadā valdība tapa 33 dienās, bet budžetu pieņēma tikai 28.02.2003.</div>`; }
      else html += `<div class="verdict warn"><b>2027. gads sāktos ar pagaidu budžetu</b> (budžets ${days(JAN27, b)} d. pēc 1. janvāra). Tā bijis ${10 - nBefore} reizes no 10 — pēdējoreiz 2019. (03.04.) un 2023. gadā (09.03.). Pagaidu budžets turpina iepriekšējā gada politiku: pensijas, pabalsti, algas un parāda maksājumi tiek veikti, bet jaunas iniciatīvas un investīcijas gaida.</div>`;
    }
    html += `<div class="debate"><div class="dlabel">Ko par to saka debatēs (06.11.2026)</div><div class="pos" id="positions"></div></div>`;
    html += `<ul class="rules">
      <li><span class="i ${pd(g) <= pd("2026-11-19") ? "ok" : "no"}">${pd(g) <= pd("2026-11-19") ? "✓" : "!"}</span><div><b>Finanšu ministrijas atskaites punkts (~19.11.2026):</b> ja līdz tam nav uzticības jaunam Ministru kabinetam, FM sāk gatavot pagaidu budžetu 2027. gadam. Tavā scenārijā uzticība — ${fmt(g)}.</div></li>
      <li><span class="i info">§</span><div><b>LBFV 21. panta 3. daļa:</b> vēlēšanu gadā budžeta projekts Saeimā jāiesniedz ne vēlāk kā 4 mēnešus pēc uzticības balsojuma — šajā scenārijā līdz <b>${fmt(deadline4m)}</b>. Tas ir likumā noteiktais maksimums, nevis plānotais termiņš.</div></li>
      <li><span class="i info">2</span><div><b>Saeimas procedūra:</b> budžetu pieņem divos lasījumos; 2006–2014, kad valdība tapa ~mēneša laikā, no valdības līdz budžetam pagāja 42–51 diena. FM vērtējumā pilnam ciklam (t. sk. saskaņošana ar Eiropas Komisiju) vajag ap diviem mēnešiem.</div></li>
    </ul>`;
    out.innerHTML = html;
    renderPositions();
    if ($("#vesture").classList.contains("on")) renderGantt();
  }
  function renderPositions() {
    $("#positions").innerHTML = D.LV2026.positions.map((p, i) => `<div class="p"><div class="who">${esc(p.who)}</div><div class="v">${esc(p.view)} ${p.srcs ? p.srcs.map(x => `<a href="${x.url}" target="_blank" rel="noopener">${esc(x.label)} ↗</a>`).join(" · ") : `<a href="${p.src}" target="_blank" rel="noopener">avots ↗</a>`}</div><button class="btn" type="button" data-pos="${i}">Izmēģināt: ${esc(p.label)} (${fmt(p.budget)})</button></div>`).join("");
    $$("#positions [data-pos]").forEach(bt => bt.addEventListener("click", () => { setBud(D.LV2026.positions[+bt.dataset.pos].budget); }));
  }
  const BUD_PRESETS = [
    { l: "Līdz Ziemassvētkiem", d: "2026-12-23" }, { l: "Janvāra beigas", d: "2027-01-29" }, { l: "Februāra beigas", d: "2027-02-26" }, { l: "Marta beigas", d: "2027-03-31" }
  ];
  function renderBudChips() {
    $("#budChips").innerHTML = BUD_PRESETS.map(p => `<button type="button" class="chip bud" data-d="${p.d}" aria-pressed="${String(p.d === scen.bud)}">${p.l}<span class="sr-only"> (${fmt(p.d)})</span></button>`).join("");
    $$("#budChips .chip").forEach(c => c.addEventListener("click", () => setBud(c.dataset.d)));
  }
  function setBud(d) { scen.bud = d; $("#budDate").value = d; $$("#budChips .chip").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.d === d))); renderScenario(); }
  $("#budDate").addEventListener("change", e => { if (e.target.value) setBud(e.target.value); });
  $("#govDate").addEventListener("change", e => { if (e.target.value) { scen.gov = e.target.value; renderScenario(); } });
  function updateDateHints() {
    $("#govHint").textContent = `Izvēlēts: ${fmtLong(scen.gov)} — ${pluralD(days(E26, scen.gov))} pēc vēlēšanām. Noklusējums 18.11.2026 ir termiņš, līdz kuram A. Kulbergs cer izveidot valdību.`;
    $("#budHint").textContent = `Izvēlēts: ${fmtLong(scen.bud)} — ${pluralD(days(E26, scen.bud))} pēc vēlēšanām. Izvēlies gatavu variantu vai ievadi citu datumu.`;
  }

  /* ===== 2. VĒSTURE: GANTT ===== */
  const gstate = { view: "days", sort: "chrono", showScen: true };
  $$("[data-view]").forEach(b => b.addEventListener("click", () => { gstate.view = b.dataset.view; $$("[data-view]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); renderGantt(); }));
  $("#sortSel").addEventListener("change", e => { gstate.sort = e.target.value; renderGantt(); });
  $("#showScen").addEventListener("change", e => { gstate.showScen = e.target.checked; renderGantt(); });

  function renderGantt() {
    const host = $("#gantt"); if (!host.offsetParent && !$("#vesture").classList.contains("on")) return;
    const W = Math.max(320, host.clientWidth || 800), narrow = W < 640;
    const rows = [...LV];
    const sorters = { chrono: (a, b) => a.year - b.year, gov: (a, b) => a.dGov - b.dGov, bud: (a, b) => a.dBud - b.dBud, g2b: (a, b) => a.dG2B - b.dG2B };
    rows.sort(sorters[gstate.sort]);
    const open = { s: 15, year: 2026, pm: "?", elect: E26, isOpen: true, dNow: sinceElect, dJan: days(E26, JAN27), budgetYear: 2027 };
    rows.push(open);
    const RH = narrow ? 40 : 38, L = narrow ? 60 : 190, Rm = 56, T = 28, H = T + rows.length * RH + 30;
    const cal = gstate.view === "cal";
    // scale
    let x, ticks, tickLbl;
    if (!cal) {
      const max = 260; x = v => L + (v / max) * (W - L - Rm);
      ticks = narrow ? [0, 60, 120, 180, 240] : [0, 30, 60, 90, 120, 150, 180, 210, 240]; tickLbl = t => t === 0 ? (narrow ? "vēl." : "vēlēšanas") : t + (narrow ? "" : " d.");
    } else {
      // calendar: from 1 Jun of election year to 30 Apr next year, normalised; x in days from Jun 1
      const start = (y) => `${y}-06-01`;
      const span = days("2000-06-01", "2001-05-01"); x = v => L + (v / span) * (W - L - Rm);
      ticks = []; for (let m = 0; m < 11; m++) { const mm = (5 + m) % 12; const yy = mm >= 5 ? 2000 : 2001; ticks.push(days("2000-06-01", `${yy}-${String(mm + 1).padStart(2, "0")}-01`)); }
      tickLbl = (t, i) => (narrow && i % 2) ? "" : MONTHS_S[(5 + i) % 12];
      rows.forEach(r => { r._off = days(start(r.year), r.elect); });
    }
    const pos = (r, isoDate) => cal ? x(r._off + days(r.elect, isoDate)) : x(days(r.elect, isoDate));
    const svg = svgEl("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: "img", "aria-label": "Laika joslas: vēlēšanas, valdība, budžets pa sasaukumiem" });
    // grid
    ticks.forEach((t, i) => { const px = x(t); svgEl("line", { x1: px, x2: px, y1: T - 6, y2: H - 26, stroke: "#e6e2db" }, svg); svgEl("text", { x: px, y: T - 10, "text-anchor": "middle", "font-size": 11, fill: "#9a948b" }, svg).textContent = tickLbl(t, i); });
    if (cal) { const jx = x(days("2000-06-01", "2001-01-01")); svgEl("line", { x1: jx, x2: jx, y1: T - 6, y2: H - 26, stroke: "#b33f62", "stroke-width": 1.5, "stroke-dasharray": "4 3" }, svg); svgEl("text", { x: jx + 4, y: H - 12, "font-size": 11, fill: "#b33f62", "font-weight": 700 }, svg).textContent = "1. janvāris"; }
    else { const mx = x(STATS.bud.med); svgEl("line", { x1: mx, x2: mx, y1: T - 6, y2: H - 26, stroke: "#1f6a7e", "stroke-dasharray": "4 3" }, svg); svgEl("text", { x: narrow ? mx - 4 : mx + 4, y: H - 12, "text-anchor": narrow ? "end" : "start", "font-size": 11, fill: "#1f6a7e", "font-weight": 700 }, svg).textContent = narrow ? `mediāna ${STATS.bud.med} d.` : `mediāna līdz budžetam ${STATS.bud.med} d.`; const gx = x(STATS.gov.med); svgEl("line", { x1: gx, x2: gx, y1: T - 6, y2: H - 26, stroke: "#262b73", "stroke-dasharray": "4 3" }, svg); svgEl("text", { x: gx + 4, y: T + 2, "font-size": 11, fill: "#262b73", "font-weight": 700 }, svg).textContent = narrow ? `mediāna ${STATS.gov.med} d.` : `mediāna līdz valdībai ${STATS.gov.med} d.`; }
    // pattern
    const defs = svgEl("defs", {}, svg); const pat = svgEl("pattern", { id: "hatch", width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs); svgEl("rect", { width: 6, height: 6, fill: "#edeae4" }, pat); svgEl("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#c1bcb5", "stroke-width": 2 }, pat);
    rows.forEach((r, i) => {
      const y = T + i * RH, bh = narrow ? 14 : 16, by = y + (RH - bh) / 2;
      const g = svgEl("g", { class: "gantt-row", tabindex: 0, role: "button", "aria-label": r.isOpen ? `2026: process turpinās, ${sinceElect} dienas kopš vēlēšanām` : `${r.year}, ${r.pm}: valdība ${r.dGov} dienās, budžets ${r.dBud} dienās pēc vēlēšanām` }, svg);
      svgEl("rect", { class: "rowbg", x: 0, y, width: W, height: RH, fill: "transparent" }, g);
      const lab = svgEl("text", { x: L - 10, y: y + RH / 2 + 4, "text-anchor": "end", "font-size": narrow ? 11.5 : 12.5, "font-weight": 700, fill: r.isOpen ? "#b33f62" : "#333231" }, g);
      lab.textContent = narrow || r.isOpen ? (r.isOpen ? "2026 →" : r.year) : `${r.year} · ${r.pm.replace("Arturs Krišjānis ", "").replace("Valdis ", "").replace("Laimdota ", "").replace("Aigars ", "").replace("Einars ", "").replace("Vilis ", "").replace("Andris ", "").replace("Valdis ", "")}`;
      const x0 = pos(r, r.elect);
      if (!r.isOpen) {
        const xg = pos(r, r.gov), xb = pos(r, r.budget), xj = pos(r, `${r.budgetYear}-01-01`);
        const rg = svgEl("rect", { x: x0, y: by, width: 0, height: bh, rx: 0, fill: "#262b73" }, g);
        const rb = svgEl("rect", { x: xg, y: by, width: 0, height: bh, rx: 0, fill: "#49adc4" }, g);
        if (reduced) { rg.setAttribute("width", xg - x0); rb.setAttribute("width", xb - xg); } else { requestAnimationFrame(() => { rg.style.transition = "width .7s cubic-bezier(.2,.7,.2,1)"; rb.style.transition = "width .7s cubic-bezier(.2,.7,.2,1) .15s"; rg.setAttribute("width", xg - x0); rb.setAttribute("width", xb - xg); }); }
        if (!cal) svgEl("line", { x1: xj, x2: xj, y1: by - 4, y2: by + bh + 4, stroke: "#b33f62", "stroke-width": 2 }, g);
        svgEl("text", { x: xb + 6, y: y + RH / 2 + 4, "font-size": 11.5, fill: "#4a4845", "font-weight": 600 }, g).textContent = cal ? fmt(r.budget).slice(0, 5) : `${r.dBud} d.`;
        if (!narrow && !cal) svgEl("text", { x: x0 + (xg - x0) / 2, y: y + RH / 2 + 4, "font-size": 11, fill: "#fff", "text-anchor": "middle", "font-weight": 700 }, g).textContent = r.dGov >= 28 ? r.dGov : "";
      } else {
        const xn = pos(r, TODAY), xj = pos(r, JAN27);
        svgEl("rect", { x: x0, y: by, width: Math.max(2, xn - x0), height: bh, rx: 0, fill: "url(#hatch)", stroke: "#c1bcb5" }, g);
        svgEl("line", { x1: xn, x2: xn, y1: by - 6, y2: by + bh + 6, stroke: "#b33f62", "stroke-width": 2.5 }, g);
        svgEl("text", { x: xn + 6, y: y + RH / 2 + 4, "font-size": 11.5, fill: "#b33f62", "font-weight": 700 }, g).textContent = narrow ? `${sinceElect} d.` : `šodien · ${sinceElect} d.`;
        if (!cal) svgEl("line", { x1: xj, x2: xj, y1: by - 4, y2: by + bh + 4, stroke: "#b33f62", "stroke-width": 2, "stroke-dasharray": "3 2" }, g);
        if (gstate.showScen) {
          const xg = pos(r, scen.gov), xb = pos(r, scen.bud);
          if (xb > xg) {
            svgEl("rect", { x: x0, y: by + bh + 3, width: xg - x0, height: 5, rx: 0, fill: "#262b73", "fill-opacity": .5 }, g);
            svgEl("rect", { x: xg, y: by + bh + 3, width: xb - xg, height: 5, rx: 0, fill: "#49adc4", "fill-opacity": .6 }, g);
            svgEl("text", { x: xb + 6, y: by + bh + 11, "font-size": 10.5, fill: "#736d64" }, g).textContent = `scenārijs: ${cal ? fmt(scen.bud).slice(0, 5) : days(E26, scen.bud) + " d."}`;
          }
        }
      }
      const tipHtml = r.isOpen
        ? `<b>15. Saeima (2026) — process turpinās</b><br>Vēlēšanas ${fmt(E26)} · šodien ${fmt(TODAY)} (${sinceElect} d.)<br><span class="m">Tavs scenārijs: valdība ${fmt(scen.gov)} (${days(E26, scen.gov)} d.), budžets ${fmt(scen.bud)} (${days(E26, scen.bud)} d.)</span>`
        : `<b>${r.s}. Saeima · ${r.year}</b><br>Vēlēšanas ${fmt(r.electStart === r.elect ? r.elect : r.elect)}${r.electStart !== r.elect ? ` (2 dienas)` : ""}<br><span class="gv">Valdība: ${esc(r.pm)} — ${fmt(r.gov)} · ${r.dGov} d.</span><br><span class="bd">${r.budgetYear}. g. budžets — ${fmt(r.budget)} · ${r.dBud} d. pēc vēlēšanām, ${r.dG2B} d. pēc valdības</span><br><span class="m">Koalīcija: ${esc(r.coalition)} · ${r.parties} partijas · ${r.seats} mandāti (${r.majority ? "vairākums" : "mazākums"})${r.note ? "<br>" + esc(r.note) : ""}</span>`;
      g.addEventListener("mousemove", e => showTip(tipHtml, e.clientX, e.clientY));
      g.addEventListener("mouseleave", hideTip);
      g.addEventListener("focus", () => { const b = g.getBoundingClientRect(); showTip(tipHtml, b.left + L, b.top + RH); });
      g.addEventListener("blur", hideTip);
    });
    host.innerHTML = ""; host.appendChild(svg);
  }

  /* Tabula */
  const tstate = { key: "year", dir: 1 };
  function renderTable() {
    const cols = [
      { k: "s", l: "Saeima,<br>vēlēšanas", w: "10%", f: r => r.isOpen ? `<b>15.</b><span class="sub">${fmt(r.elect)}</span>` : `<b>${r.s}.</b><span class="sub">${r.electStart && r.electStart !== r.elect ? `${fmt(r.electStart).slice(0, 5)}–${fmt(r.elect)}` : fmt(r.elect)}</span>` },
      { k: "pm", l: "Pirmā valdība,<br>uzticības<br>balsojums", w: "16%", f: r => r.isOpen ? `<span class="pill open">vēl nav</span>` : `${esc(r.pm)}<span class="sub">${fmt(r.gov)}</span>` },
      { k: "dGov", l: "Vēlēšanas<br>→ valdība,<br>dienas", n: true, w: "11%", f: r => r.isOpen ? `<span style="color:var(--now)">${sinceElect}+</span>` : r.dGov },
      { k: "coalition", l: "Koalīcija", w: "18%", f: r => r.isOpen ? "sarunas turpinās" : `${esc(r.coalition)}<span class="sub">${r.parties} partijas · ${r.seats} mandāti · ${r.majority ? "vairākums" : "mazākums"}</span>` },
      { k: "budget", l: "Budžets<br>pieņemts", w: "12%", f: r => r.isOpen ? `<span class="pill open">2027. g. — nav</span>` : `${fmt(r.budget)}<span class="sub"><span class="pill ${r.beforeJan ? "ok" : "no"}">${r.beforeJan ? "pirms 1.I" : "pēc 1.I"}</span></span>` },
      { k: "dG2B", l: "Valdība<br>→ budžets,<br>dienas", n: true, w: "11%", f: r => r.isOpen ? "—" : r.dG2B },
      { k: "dBud", l: "Vēlēšanas<br>→ budžets,<br>dienas", n: true, w: "11%", f: r => r.isOpen ? "—" : r.dBud },
      { k: "src", l: "Avoti", w: "11%", f: r => r.isOpen ? `<span class="src"><a href="${D.SOURCES_2026[0].u}" target="_blank" rel="noopener">MK ↗</a><a href="${D.SOURCES_2026[1].u}" target="_blank" rel="noopener">LSM ↗</a></span>` : `<span class="src"><a href="${r.src.gov}" target="_blank" rel="noopener" title="Valdības datuma avots">valdība ↗</a><a href="${r.src.budget}" target="_blank" rel="noopener" title="Budžeta datuma avots">budžets ↗</a><a href="${r.src.elect}" target="_blank" rel="noopener" title="Vēlēšanu avots">CVK ↗</a></span>` }
    ];
    const rows = [...LV].sort((a, b) => { const va = a[tstate.key], vb = b[tstate.key]; return (va > vb ? 1 : va < vb ? -1 : 0) * tstate.dir; });
    rows.push({ isOpen: true, s: 15, elect: E26, year: 2026 });
    const t = $("#lvTable");
    t.innerHTML = `<colgroup>${cols.map(c => `<col style="width:${c.w}">`).join("")}</colgroup><thead><tr>${cols.map(c => `<th class="${c.n ? "n" : ""}">${c.k === "src" ? c.l : `<button type="button" data-k="${c.k}" aria-sort="${tstate.key === c.k ? (tstate.dir > 0 ? "ascending" : "descending") : "none"}">${c.l}</button>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td class="${c.n ? "n" : ""}">${c.f(r)}</td>`).join("")}</tr>`).join("")}</tbody>`;
    $$("th button", t).forEach(b => b.addEventListener("click", () => { const k = b.dataset.k; if (tstate.key === k) tstate.dir *= -1; else { tstate.key = k; tstate.dir = 1; } renderTable(); }));
  }

  /* ===== 4. KAIMIŅVALSTIS ===== */
  const nstate = { view: "days" };
  $$("[data-nview]").forEach(b => b.addEventListener("click", () => { nstate.view = b.dataset.nview; $$("[data-nview]").forEach(x => x.setAttribute("aria-pressed", String(x === b))); renderNeighbours(); }));
  const NB_ALL = [
    { code: "LV", name: "Latvija", electMonth: "oktobris", govDef: D.LV_RULES.govDef, rule: D.LV_RULES.rule, ruleShort: D.LV_RULES.ruleShort, ruleSrc: D.LV_RULES.ruleSrc, isLV: true,
      cycles: LV.slice(-3).map(c => ({ year: c.year, elect: c.elect, pm: c.pm, gov: c.gov, budget: c.budget, budgetYear: c.budgetYear, note: c.note, src: c.src })) },
    ...D.NEIGH
  ].map(n => ({ ...n, cycles: n.cycles.map(c => ({ ...c, dGov: days(c.elect, c.gov), dBud: days(c.elect, c.budget), dG2B: days(c.gov, c.budget), dJan: days(c.elect, `${c.budgetYear}-01-01`) })) }));
  function renderNeighbours() {
    const grid = $("#nbGrid"); const cal = nstate.view === "cal";
    grid.innerHTML = NB_ALL.map(n => {
      const W = 330, RH = 30, L = 40, Rm = 46, T = 8, H = T + n.cycles.length * RH + 22;
      let x; const maxD = 300;
      if (!cal) x = v => L + (v / maxD) * (W - L - Rm);
      else { const span = days("2000-03-01", "2001-05-01"); x = v => L + (v / span) * (W - L - Rm); }
      const pos = (c, d) => cal ? x(days(`${c.year}-03-01`, d)) : x(days(c.elect, d));
      let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(n.name)}: trīs pēdējie cikli">`;
      if (!cal) [0, 100, 200, 300].forEach(t => { s += `<line x1="${x(t)}" x2="${x(t)}" y1="${T}" y2="${H - 18}" stroke="#e6e2db"/><text x="${x(t)}" y="${H - 4}" font-size="10" fill="#9a948b" text-anchor="middle">${t === 0 ? "vēl." : t}</text>`; });
      else { for (let m = 0; m < 14; m += 2) { const mm = (2 + m) % 12, yy = m < 10 ? 2000 : 2001; const px = x(days("2000-03-01", `${yy}-${String(mm + 1).padStart(2, "0")}-01`)); s += `<line x1="${px}" x2="${px}" y1="${T}" y2="${H - 18}" stroke="#e6e2db"/><text x="${px}" y="${H - 4}" font-size="10" fill="#9a948b" text-anchor="middle">${MONTHS_S[mm]}</text>`; } const jx = x(days("2000-03-01", "2001-01-01")); s += `<line x1="${jx}" x2="${jx}" y1="${T}" y2="${H - 18}" stroke="#b33f62" stroke-width="1.5" stroke-dasharray="4 3"/>`; }
      n.cycles.forEach((c, i) => {
        const y = T + i * RH, bh = 12, by = y + (RH - bh) / 2;
        const x0 = pos(c, c.elect), xg = pos(c, c.gov), xb = pos(c, c.budget), xj = pos(c, `${c.budgetYear}-01-01`);
        s += `<text x="${L - 6}" y="${y + RH / 2 + 4}" text-anchor="end" font-size="11" font-weight="700" fill="#333231">${c.year}</text>`;
        s += `<rect x="${x0}" y="${by}" width="${Math.max(1, xg - x0)}" height="${bh}" rx="0" fill="#262b73"/>`;
        if (xb >= xg) s += `<rect x="${xg}" y="${by}" width="${Math.max(1, xb - xg)}" height="${bh}" rx="0" fill="#49adc4"/>`;
        else s += `<rect x="${xb}" y="${by + 2}" width="${xg - xb}" height="${bh - 4}" rx="0" fill="none" stroke="#49adc4" stroke-width="2" stroke-dasharray="3 2"/><circle cx="${xb}" cy="${by + bh / 2}" r="4" fill="#49adc4"/>`;
        if (!cal) s += `<line x1="${xj}" x2="${xj}" y1="${by - 4}" y2="${by + bh + 4}" stroke="#b33f62" stroke-width="2"/>`;
        s += `<text x="${Math.max(xb, xg, cal ? 0 : xj) + 5}" y="${y + RH / 2 + 4}" font-size="10.5" fill="#4a4845" font-weight="600">${cal ? fmt(c.budget).slice(0, 5) : c.dBud + " d."}</text>`;
      });
      s += "</svg>";
      const mg = median(n.cycles.map(c => c.dGov)), mb = median(n.cycles.map(c => c.dBud));
      const det = n.cycles.map(c => `<p><b>${c.year}</b> · vēlēšanas ${fmt(c.elect)}${c.electNote ? ` (${esc(c.electNote)})` : ""} → ${esc(c.pm)} ${fmt(c.gov)} (${c.dGov} d.) → ${c.budgetYear}. g. budžets ${fmt(c.budget)} (${c.dBud} d.; no valdības ${c.dG2B} d.)${c.note ? `<br><span style="color:var(--muted)">${esc(c.note)}</span>` : ""} <a href="${c.src.gov}" target="_blank" rel="noopener">valdība ↗</a> <a href="${c.src.budget}" target="_blank" rel="noopener">budžets ↗</a></p>`).join("");
      return `<div class="nb ${n.isLV ? "lv" : ""}"><div class="hd"><b>${esc(n.name)}</b><span>vēlēšanas: ${esc(n.electMonth)}</span></div><div class="def">Valdība = ${esc(n.govDef)}</div>${s}<div class="med"><span>→ valdība: <b>${mg} d.</b></span><span>→ budžets: <b>${mb} d.</b></span><span style="color:var(--muted)">(mediānas)</span></div><details><summary>Datumi, noteikumi un avoti</summary>${det}<p><b>Noteikums:</b> ${esc(n.rule)} <a href="${n.ruleSrc}" target="_blank" rel="noopener">avots ↗</a></p></details></div>`;
    }).join("");
    // table
    const t = $("#nbTable");
    t.innerHTML = `<colgroup><col style="width:14%"><col style="width:24%"><col style="width:11.5%"><col style="width:11.5%"><col style="width:11%"><col style="width:28%"></colgroup><thead><tr><th>Valsts,<br>vēlēšanu<br>mēnesis</th><th>„Valdība<br>izveidota”<br>nozīmē</th><th class="n">Vēlēšanas<br>→ valdība,<br>mediāna d.</th><th class="n">Vēlēšanas<br>→ budžets,<br>mediāna d.</th><th>Budžets<br>pirms<br>1. janvāra</th><th>Galvenais<br>noteikums</th></tr></thead><tbody>${NB_ALL.map(n => {
      const bj = n.cycles.filter(c => pd(c.budget) < pd(`${c.budgetYear}-01-01`)).length;
      return `<tr><td><b>${esc(n.name)}</b><span class="sub">${esc(n.electMonth)}</span>${n.isLV ? "<span class='sub'>pēdējie 3 cikli</span>" : ""}</td><td class="txt">${esc(n.govDef)}</td><td class="n">${median(n.cycles.map(c => c.dGov))}</td><td class="n">${median(n.cycles.map(c => c.dBud))}</td><td><span class="pill ${bj === 3 ? "ok" : bj === 0 ? "no" : ""}">${bj} no 3</span></td><td class="txt">${esc(n.ruleShort)} <a href="${n.ruleSrc}" target="_blank" rel="noopener">avots ↗</a></td></tr>`;
    }).join("")}</tbody>`;
  }

  /* ===== 5. METODIKA ===== */
  function renderMethod() {
    const defs = [
      ["Vēlēšanu diena", "Pēdējā balsošanas diena (1993. un 1995. gadā vēlēšanas notika divas dienas). Lietuvā — otrās kārtas diena."],
      ["Valdība", "Latvijā — pirmais Saeimas uzticības balsojums jaunam Ministru kabinetam pēc vēlēšanām (nevis koalīcijas līguma vai amatā stāšanās datums). Kaimiņvalstīs — katras valsts konstitucionālais solis, kas norādīts kartītē."],
      ["Budžets", "Nākamā (pirmā pilnā) gada valsts budžeta likuma pieņemšana parlamentā galīgajā balsojumā. Latvijā — 2. lasījums Saeimā; Polijā — pēdējais parlamenta balsojums (Sejms par Senāta labojumiem vai Senāts bez labojumiem); Zviedrijā — Riksdāga ietvara lēmums (rambeslut) par izdevumu griestiem."],
      ["Dienu skaitīšana", "Beigu datums mīnus sākuma datums kalendārajās dienās; vēlēšanu diena ir 0. diena."],
      ["Mediāna", "Vidējā vērtība sakārtotā rindā — to mazāk ietekmē ekstrēmi gadījumi (1993: 242 d.; 2018: 109 d. līdz valdībai) nekā vidējo aritmētisko."],
      ["Pirms / pēc 1. janvāra", "Vai budžets pieņemts pirms budžeta gada sākuma. Ja nē, Latvijā darbojas pagaidu budžets (LBFV 15. pants): finanšu ministrs apstiprina izdevumus iepriekšējā gada līmenī bez jaunām iniciatīvām."],
      ["2026. gada scenārijs", "Lietotāja izvēlēti datumi, nevis prognoze. Tie tiek salīdzināti ar 10 iepriekšējiem cikliem; rīks nevērtē, kurš variants ir „pareizs”."],
      ["Vēlēšanu rezultāti", "Saeimas vēlēšanu rezultāti 1922–2026 (CVK dati) ir atsevišķā Providus vizualizācijā; koalīcijas partijas tajā sasaistītas ar pirmo valdību pēc vēlēšanām."],
      ["Ierobežojumi", "Kaimiņvalstīm aptverti tikai trīs pēdējie cikli; vēlēšanu mēneši atšķiras (marts–oktobris), tāpēc „dienas līdz budžetam” nav tieši salīdzināmas ar laiku līdz 1. janvārim. Lietuvā un Polijā budžeta projektu bieži iesniedz vēl iepriekšējā valdība."],
      ["Atjaunināšana", `Dati pārbaudīti ${fmt(D.UPDATED)}. „Šodien” tiek rēķināts no pārlūka datuma; to var fiksēt ar parametru ?date=GGGG-MM-DD.`]
    ];
    $("#defs").innerHTML = defs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    $("#srcLV").innerHTML = LV.map(c => `<li><b>${c.s}. Saeima (${c.year})</b>: valdība — <a href="${c.src.gov}" target="_blank" rel="noopener">${c.src.gov}</a>; budžets — <a href="${c.src.budget}" target="_blank" rel="noopener">${c.src.budget}</a></li>`).join("") + `<li><b>Vēlēšanu datumi un rezultāti</b>: CVK arhīvs — <a href="https://arhivs.cvk.lv/lv/saeimas-velesanas/" target="_blank" rel="noopener">https://arhivs.cvk.lv/lv/saeimas-velesanas/</a>; <a href="https://www.cvk.lv/lv/velesanas/saeimas-velesanas" target="_blank" rel="noopener">https://www.cvk.lv/lv/velesanas/saeimas-velesanas</a></li>`;
    $("#src2026").innerHTML = D.SOURCES_2026.map(s => `<li>${esc(s.t)} — <a href="${s.u}" target="_blank" rel="noopener">${s.u}</a></li>`).join("");
    $("#srcNB").innerHTML = D.NEIGH.map(n => `<li><b>${esc(n.name)}</b> — noteikumi: <a href="${n.ruleSrc}" target="_blank" rel="noopener">${n.ruleSrc}</a><ul class="srcs">${n.cycles.map(c => `<li>${c.year}: valdība — <a href="${c.src.gov}" target="_blank" rel="noopener">${c.src.gov}</a>; budžets — <a href="${c.src.budget}" target="_blank" rel="noopener">${c.src.budget}</a></li>`).join("")}</ul></li>`).join("");
  }
  function dl(name, rows) {
    const csv = "\ufeff" + rows.map(r => r.map(v => { const s = String(v == null ? "" : v); return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }).join(";")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $("#dlLV").addEventListener("click", () => dl("latvija_valdibas_budzeti_1993_2026.csv", [["Saeima", "Vēlēšanu gads", "Vēlēšanu beigu diena", "Pirmā valdība", "Uzticības balsojums", "Budžeta gads", "Budžets pieņemts", "Vēlēšanas→valdība, d.", "Valdība→budžets, d.", "Vēlēšanas→budžets, d.", "Pirms 1. janvāra", "Koalīcija", "Partiju skaits", "Mandāti", "Vairākums", "Avots valdība", "Avots budžets"], ...LV.map(c => [c.s, c.year, c.elect, c.pm, c.gov, c.budgetYear, c.budget, c.dGov, c.dG2B, c.dBud, c.beforeJan ? "jā" : "nē", c.coalition, c.parties, c.seats, c.majority ? "vairākums" : "mazākums", c.src.gov, c.src.budget]), [15, 2026, E26, "", "", 2027, "", "", "", "", "process turpinās", "", "", "", "", D.SOURCES_2026[0].u, ""]]));
  $("#dlNB").addEventListener("click", () => dl("kaiminvalstis_valdibas_budzeti.csv", [["Valsts", "Vēlēšanu gads", "Vēlēšanu diena", "Valdība (definīcija)", "Premjers", "Valdība izveidota", "Budžeta gads", "Budžets pieņemts", "Vēlēšanas→valdība, d.", "Valdība→budžets, d.", "Vēlēšanas→budžets, d.", "Piezīme", "Avots valdība", "Avots budžets"], ...NB_ALL.flatMap(n => n.cycles.map(c => [n.name, c.year, c.elect, n.govDef, c.pm, c.gov, c.budgetYear, c.budget, c.dGov, c.dG2B, c.dBud, c.note || c.electNote || "", c.src.gov, c.src.budget]))]));

  /* Init */
  renderKPIs(); renderSteps(); renderBudChips(); renderScenario();
  renderTable(); renderMethod();
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if ($("#vesture").classList.contains("on")) renderGantt(); }, 150); });
})();
