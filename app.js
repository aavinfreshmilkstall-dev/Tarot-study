/* ---------- Data assembly ---------- */
const ALL_MINOR = [].concat(TAROT_WANDS, TAROT_CUPS, TAROT_SWORDS, TAROT_PENTACLES);
const ALL_CARDS = [].concat(TAROT_MAJOR, ALL_MINOR);
const SUITS = [
  {key:"Wands", label:"Wands", data:TAROT_WANDS},
  {key:"Cups", label:"Cups", data:TAROT_CUPS},
  {key:"Swords", label:"Swords", data:TAROT_SWORDS},
  {key:"Pentacles", label:"Pentacles", data:TAROT_PENTACLES}
];

function findCard(id){ return ALL_CARDS.find(c=>c.id===id); }
function findSpread(id){ return TAROT_SPREADS.find(s=>s.id===id); }

/* ---------- Progress storage (local only, no sync) ---------- */
const STORE_KEY = "tarot-learning-progress-v1";
function loadProgress(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }catch(e){ return {}; }
}
function saveProgress(p){ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
function markChapterScore(chapterId, correct, total){
  const p = loadProgress();
  p[chapterId] = { correct, total, done:true, ts:Date.now() };
  saveProgress(p);
}

/* ---------- Quiz engine (shared) ---------- */
let lastAttempt = null; // {items:[{q,userAnswer,correct,type}], correctCount, total, chapterLabel, backRoute}

function renderQuiz(container, questions, chapterLabel, chapterId, backRoute){
  container.innerHTML = "";
  const form = document.createElement("div");
  const state = questions.map(()=>null);

  questions.forEach((q, qi)=>{
    const card = document.createElement("div");
    card.className = "qcard";
    const head = document.createElement("div");
    head.className = "qhead";
    head.textContent = "QUESTION " + (qi+1) + " OF " + questions.length + (q.type==="yesno" ? " — TRUE / FALSE" : " — CHOOSE ONE");
    card.appendChild(head);
    const qt = document.createElement("div");
    qt.className = "qtext";
    qt.textContent = q.q;
    card.appendChild(qt);

    const opts = q.type === "yesno" ? ["True","False"] : q.options;
    opts.forEach((optText, oi)=>{
      const row = document.createElement("label");
      row.className = "opt";
      row.innerHTML = `<input type="radio" name="q${qi}" value="${oi}"> <span>${optText}</span>`;
      row.querySelector("input").addEventListener("change", ()=>{
        state[qi] = oi;
        card.querySelectorAll(".opt").forEach(o=>o.classList.remove("selected"));
        row.classList.add("selected");
      });
      card.appendChild(row);
    });
    form.appendChild(card);
  });
  container.appendChild(form);

  const submitBtn = document.createElement("button");
  submitBtn.className = "btn";
  submitBtn.textContent = "Submit Test";
  submitBtn.addEventListener("click", ()=>{
    const items = questions.map((q, qi)=>{
      const userIdx = state[qi];
      let correctIdx = q.type === "yesno" ? (q.answer ? 0 : 1) : q.answer;
      const isCorrect = userIdx === correctIdx;
      const correctText = q.type === "yesno" ? (q.answer ? "True" : "False") : q.options[q.answer];
      const givenText = userIdx===null ? "No answer given" : (q.type==="yesno" ? (userIdx===0?"True":"False") : q.options[userIdx]);
      return { qtext:q.q, given:givenText, correctText, isCorrect };
    });
    const correctCount = items.filter(i=>i.isCorrect).length;
    lastAttempt = { items, correctCount, total: questions.length, chapterLabel, backRoute };
    if(chapterId) markChapterScore(chapterId, correctCount, questions.length);
    location.hash = "#/answers";
  });
  container.appendChild(submitBtn);
}

function renderAnswers(container){
  if(!lastAttempt){ container.innerHTML = "<p>No recent test found.</p>"; return; }
  const { items, correctCount, total, chapterLabel, backRoute } = lastAttempt;
  container.innerHTML = "";

  const banner = document.createElement("div");
  banner.className = "score-banner";
  banner.innerHTML = `<div class="big">${correctCount} / ${total}</div><div class="sub">${chapterLabel} — Answer Key</div>`;
  container.appendChild(banner);

  items.forEach((it, i)=>{
    const row = document.createElement("div");
    row.className = "answer-row " + (it.isCorrect ? "correct" : "incorrect");
    row.innerHTML = `
      <div class="tag">${it.isCorrect ? "Correct" : "Incorrect"} — Q${i+1}</div>
      <div class="qtxt">${it.qtext}</div>
      <div class="given">Your answer: ${it.given}</div>
      ${it.isCorrect ? "" : `<div class="correctans">Correct answer: ${it.correctText}</div>`}
    `;
    container.appendChild(row);
  });

  const btn = document.createElement("a");
  btn.className = "btn secondary";
  btn.textContent = "Back";
  btn.href = backRoute || "#/home";
  container.appendChild(btn);
}

/* ---------- Final Test bank ---------- */
function buildFinalTestBank(){
  let bank = [];
  ALL_CARDS.forEach(c=> c.quiz.forEach(q=> bank.push(Object.assign({}, q, {source:c.name}))));
  TAROT_SPREADS.forEach(s=> s.quiz.forEach(q=> bank.push(Object.assign({}, q, {source:s.name}))));
  return bank;
}
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

/* ---------- Views ---------- */
const app = document.getElementById("view");

function setActiveTab(tab){
  document.querySelectorAll("footer.tabbar button").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
}

function progressSummary(){
  const p = loadProgress();
  const totalChapters = ALL_CARDS.length + TAROT_SPREADS.length;
  const done = Object.keys(p).filter(k=>k!=="__final").length;
  return {done, totalChapters};
}

function viewHome(){
  setActiveTab("home");
  const {done, totalChapters} = progressSummary();
  let html = `
    <div class="hero">
      <div class="glyph">✦</div>
      <h1>Tarot, Studied Properly</h1>
      <p>78 cards, five spreads, and a test after every chapter — built from the traditional Rider-Waite-Smith system, in plain original language.</p>
    </div>
    <div class="progress-banner">
      <div><div class="num">${done} / ${totalChapters}</div><div class="label">chapters completed</div></div>
      <a href="#/finaltest" class="btn secondary" style="width:auto;margin:0;">Final Test →</a>
    </div>
  `;
  html += `<div class="section-title">Major Arcana · 22 cards</div><div class="grid">`;
  TAROT_MAJOR.forEach(c=>{
    const p = loadProgress();
    const done = p[c.id] && p[c.id].done;
    html += `<a class="tile ${done?'done':''}" href="#/card/${c.id}">${done?'<span class="check">✓</span>':''}<div class="num">${c.number}</div><div class="name">${c.name.replace('The ','')}</div></a>`;
  });
  html += `</div>`;

  SUITS.forEach(suit=>{
    html += `<div class="section-title">${suit.label} · 14 cards</div><div class="grid">`;
    suit.data.forEach(c=>{
      const p = loadProgress();
      const done = p[c.id] && p[c.id].done;
      html += `<a class="tile ${done?'done':''}" href="#/card/${c.id}">${done?'<span class="check">✓</span>':''}<div class="num">${c.number}</div><div class="name">${c.name.replace(' of '+suit.label,'')}</div></a>`;
    });
    html += `</div>`;
  });

  html += `<div class="section-title">Spreads · 5 chapters</div><div class="list">`;
  TAROT_SPREADS.forEach(s=>{
    const p = loadProgress();
    const done = p[s.id] && p[s.id].done;
    html += `<a class="list-row" href="#/spread/${s.id}"><span class="t">${done?'✓ ':''}${s.name}</span><span class="arrow">›</span></a>`;
  });
  html += `</div>`;

  app.innerHTML = html;
}

function chapterHeaderNav(backHref){
  return `<a class="back-btn" href="${backHref}">‹ Back</a>`;
}

function viewCard(id){
  const c = findCard(id);
  if(!c){ location.hash = "#/home"; return; }
  setActiveTab("");
  const idx = ALL_CARDS.findIndex(x=>x.id===id);
  const prev = ALL_CARDS[idx-1];
  const next = ALL_CARDS[idx+1];

  app.innerHTML = `
    ${chapterHeaderNav("#/home")}
    <div class="card-frame" style="margin-top:16px;">
      <div class="card-frame-inner">
        <div class="mono" style="color:var(--gold); font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase;">
          ${c.arcana==='major' ? 'Major Arcana · No. '+c.number : c.suit+' · '+c.number}
        </div>
        <h1>${c.name}</h1>
        <div class="block-label">Card Imagery</div>
        <p class="imagery">${c.imagery}</p>
        <div class="block-label">Upright Keywords</div>
        <div class="chip-row">${c.keywordsUpright.map(k=>`<span class="chip">${k}</span>`).join("")}</div>
        <div class="block-label">Upright Meaning</div>
        <p>${c.uprightMeaning}</p>
        <div class="block-label">Reversed Keywords</div>
        <div class="chip-row">${c.keywordsReversed.map(k=>`<span class="chip rev">${k}</span>`).join("")}</div>
        <div class="block-label">Reversed Meaning</div>
        <p>${c.reversedMeaning}</p>
        <a class="btn" href="#/quiz/card/${c.id}">Take Chapter Test</a>
      </div>
    </div>
    <div class="btn-row">
      ${prev ? `<a class="btn ghost" href="#/card/${prev.id}">‹ ${prev.name}</a>` : "<span></span>"}
      ${next ? `<a class="btn ghost" href="#/card/${next.id}">${next.name} ›</a>` : "<span></span>"}
    </div>
  `;
}

function viewSpread(id){
  const s = findSpread(id);
  if(!s){ location.hash = "#/home"; return; }
  setActiveTab("");
  app.innerHTML = `
    ${chapterHeaderNav("#/home")}
    <div class="card-frame" style="margin-top:16px;">
      <div class="card-frame-inner">
        <div class="mono" style="color:var(--gold); font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase;">Spread</div>
        <h1>${s.name}</h1>
        <p>${s.description}</p>
        <div class="block-label">Positions</div>
        ${s.positions.map(p=>`<div class="spread-position">${p}</div>`).join("")}
        <a class="btn" href="#/quiz/spread/${s.id}">Take Chapter Test</a>
      </div>
    </div>
  `;
}

function viewQuiz(kind, id){
  setActiveTab("");
  let questions, label, backRoute, chapterId;
  if(kind==="card"){
    const c = findCard(id);
    if(!c){ location.hash="#/home"; return; }
    questions = c.quiz; label = c.name; backRoute = "#/card/"+id; chapterId = c.id;
  } else {
    const s = findSpread(id);
    if(!s){ location.hash="#/home"; return; }
    questions = s.quiz; label = s.name; backRoute = "#/spread/"+id; chapterId = s.id;
  }
  app.innerHTML = `${chapterHeaderNav(backRoute)}<h1 style="margin-top:16px;">${label} — Test</h1><p class="imagery">Answer every question, then submit to see your score on a separate page.</p><div id="quizhost"></div>`;
  renderQuiz(document.getElementById("quizhost"), questions, label, chapterId, backRoute);
}

function viewAnswers(){
  setActiveTab("");
  app.innerHTML = `${chapterHeaderNav("#/home")}<h1 style="margin-top:16px;">Answer Key</h1><div id="anshost"></div>`;
  renderAnswers(document.getElementById("anshost"));
}

let finalTestQuestions = [];
function viewFinalTest(){
  setActiveTab("final");
  const bank = buildFinalTestBank();
  app.innerHTML = `
    ${chapterHeaderNav("#/home")}
    <div class="hero">
      <div class="glyph">✦</div>
      <h1>Final Test</h1>
      <p>Drawn from all ${ALL_CARDS.length} cards and ${TAROT_SPREADS.length} spread chapters. Each attempt pulls a fresh 40-question set.</p>
    </div>
    <button class="btn" id="startFinal">Begin Final Test (40 questions)</button>
    <div id="finalhost"></div>
  `;
  document.getElementById("startFinal").addEventListener("click", ()=>{
    finalTestQuestions = shuffle(bank).slice(0, Math.min(40, bank.length));
    const host = document.getElementById("finalhost");
    document.getElementById("startFinal").remove();
    renderQuiz(host, finalTestQuestions, "Final Test", "__final", "#/finaltest");
  });
}

/* ---------- Router ---------- */
function router(){
  const hash = location.hash || "#/home";
  const parts = hash.replace("#/","").split("/");
  window.scrollTo(0,0);
  if(parts[0]==="home" || hash==="#/"){ viewHome(); }
  else if(parts[0]==="card"){ viewCard(parts[1]); }
  else if(parts[0]==="spread"){ viewSpread(parts[1]); }
  else if(parts[0]==="quiz"){ viewQuiz(parts[1], parts[2]); }
  else if(parts[0]==="answers"){ viewAnswers(); }
  else if(parts[0]==="finaltest"){ viewFinalTest(); }
  else { viewHome(); }
}
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
