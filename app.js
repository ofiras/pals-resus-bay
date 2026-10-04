(() => {
'use strict';
const I18N = window.PALS_I18N;
const D_EN = window.PALS;
let D_HE = null, LANG = 'en', D = D_EN, CUR = { name: 'home', arg: undefined };
const t = (k, ...a) => { const L = I18N[LANG] || I18N.en; const v = L[k] !== undefined ? L[k] : I18N.en[k]; return typeof v === 'function' ? v(...a) : v; };
const app = document.getElementById('app');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const mmss = s => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const mShort = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

/* ---------------- icons ---------------- */
const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC = {
  sim: sv('<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M5 11h3l1.5-3 3 7 2-4H19"/><path d="M9 21h6"/>'),
  atlas: sv('<rect x="8" y="2" width="8" height="5" rx="1.5"/><path d="M12 7v3"/><path d="M12 10l5 3.5-5 3.5-5-3.5z"/><path d="M7 13.5H4v6h5M17 13.5h3v6h-5"/>'),
  rush: sv('<path d="M2 12h4l2-6 3 12 3-9 2 3h6"/>'),
  drill: sv('<path d="M18 2l4 4"/><path d="M20 4l-4 4"/><path d="M14 4l6 6"/><path d="M15.5 6.5l-9 9L4 20l4.5-2.5 9-9"/><path d="M4 20l-2 2"/><path d="M9.5 11.5l3 3"/>'),
  cpr: sv('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/><path d="M6.5 12h2.5l1.5-2.5 2 5 1.5-2.5h3.5"/>'),
  recall: sv('<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v13"/><path d="M7 12h6M7 16h4"/>'),
  card: sv('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3"/><path d="M9 11h6M9 15h6M9 19h3"/>'),
  back: sv('<path d="M15 18l-6-6 6-6"/>').replace('<svg', '<svg class="flipx"'),
  snd: sv('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'),
  mute: sv('<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M22 9l-6 6M16 9l6 6"/>'),
  eye: sv('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'),
  ff: sv('<path d="M13 19l9-7-9-7v14zM2 19l9-7-9-7v14z"/>').replace('<svg', '<svg class="flipx"'),
  exam: sv('<path d="M9 3h6v3H9z"/><rect x="5" y="5" width="14" height="16" rx="2"/><path d="M9 13l2 2 4-4"/>'),
  live: sv('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M10 2h4"/><path d="M12 2v3"/>'),
  flag: sv('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
  dice: sv('<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="16" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z"/></svg>'
};
/* Instrument icons for every cart item (24x24 line drawings). */
const ICA = {
  resp: sv('<circle cx="9" cy="6" r="3"/><path d="M4 21v-5a5 5 0 0 1 10 0v5"/><path d="M17 8c1.5 1 1.5 3 0 4M19.5 6c3 2 3 6 0 8"/>'),
  shout: sv('<path d="M3 10v4h3l7 4V6L6 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>'),
  ems: sv('<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>'),
  check: sv('<path d="M12 20s-7-4.4-7-9.6A4 4 0 0 1 12 8a4 4 0 0 1 7 2.4C19 15.6 12 20 12 20z"/><path d="M7.5 12h2.5l1-2 2 4 1-2h2.5"/>'),
  cpr: sv('<path d="M8 3h8"/><path d="M12 3v7"/><path d="M8.5 7.5L12 11l3.5-3.5"/><path d="M4 18c2-3 5-4 8-4s6 1 8 4"/><path d="M4 21h16"/>'),
  auscult: sv('<path d="M6 3v5a5 5 0 0 0 10 0V3"/><path d="M11 13v2a4 4 0 0 0 8 0v-2"/><circle cx="19" cy="11" r="2"/>'),
  vagal: sv('<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/><path d="M10 4l2 2 2-2M10 20l2-2 2 2"/>'),
  hts: sv('<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L21 21"/><path d="M8 10h4M10 8v4"/>'),
  pads: sv('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><path d="M6.5 12v4a3 3 0 0 0 3 3h4.5M17.5 12V8a3 3 0 0 0-3-3H10"/>'),
  rhythm: sv('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M4 13h4l1.5-4 2.5 7 2-5 1 2h5"/>'),
  shock: sv('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  sync: sv('<path d="M2 18h5l2-9 2 9h11"/><path d="M9 3l-1.6 2.5h3.2z" fill="currentColor"/><path d="M15 8l-2 4h3l-2 4"/>'),
  pace: sv('<path d="M3 17h4V5"/><path d="M7 17h3l2-6 2 6h7"/><circle cx="7" cy="4" r="1" fill="currentColor"/>'),
  leads: sv('<path d="M3 13h4l2-5 3 9 2-6 2 2h5"/><circle cx="19" cy="6" r="2.2"/><path d="M19 8.2V11"/>'),
  ecg12: sv('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" opacity=".45"/><path d="M5 12h3l1.5-3 2 6 1.5-3H19"/>'),
  drugSyr: sv('<path d="M18 2l4 4"/><path d="M20 4l-3.5 3.5"/><path d="M15 5l4 4L9 19H5v-4z"/><path d="M8 12l2 2M11 9l2 2"/><path d="M2 22l3-3"/>'),
  drugPen: sv('<rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M5 19l-2 2"/><path d="M8 13l3 3"/>'),
  drugVial: sv('<path d="M9 2h6v3H9z"/><path d="M8 5h8v14a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3z"/><path d="M8 11h8"/>'),
  drugSpray: sv('<rect x="8" y="10" width="8" height="12" rx="2"/><path d="M10 10V7h4v3"/><path d="M11 7V3h2v4"/><path d="M15 3l2-1M15 5h3M15 7l2 1"/>'),
  ivio: sv('<path d="M4 20l5-5"/><rect x="9" y="4" width="7" height="10" rx="2" transform="rotate(45 12.5 9)"/><path d="M16 4l4 4"/><path d="M13 13l3 3"/>'),
  fluid: sv('<path d="M7 3h10v11a5 5 0 0 1-10 0z"/><path d="M7 8h10"/><path d="M12 19v3"/><path d="M10 11h4"/>'),
  vaso: sv('<rect x="3" y="4" width="18" height="15" rx="2"/><rect x="6" y="7" width="12" height="5" rx="1"/><path d="M7 15h2M11 15h2M15 15h2"/><path d="M12 19v3"/>'),
  glucose: sv('<rect x="6" y="2" width="12" height="20" rx="3"/><rect x="9" y="5" width="6" height="5" rx="1"/><path d="M12 13c-1.6 2-1.6 3.6 0 3.6s1.6-1.6 0-3.6z"/>'),
  position: sv('<circle cx="10" cy="7" r="4"/><path d="M6 21v-3a6 6 0 0 1 9-5"/><path d="M15 3c3 1 5 4 5 7"/><path d="M20 10l-2-1M20 10l1-2"/>'),
  suction: sv('<path d="M3 21l8-8"/><path d="M11 13c2-2 2-5 0-7l3-3c3 3 3 8 0 11z"/><path d="M17 17h4v4h-4z"/>'),
  o2: sv('<path d="M7 9c0-3 2-5 5-5s5 2 5 5v4c0 3-2 5-5 5s-5-2-5-5z"/><path d="M12 18v4h7"/><path d="M3 10l4 .5M21 10l-4 .5"/>'),
  bvm: sv('<ellipse cx="16" cy="8" rx="6" ry="4.5"/><path d="M10 8H7"/><path d="M2 15l2.5-6h2L9 15c0 3-7 3-7 0z"/><path d="M22 8h1"/>'),
  airway: sv('<rect x="5" y="2" width="5" height="4" rx="1"/><path d="M7.5 6v8a6 6 0 0 0 6 6H19"/><ellipse cx="11" cy="16.5" rx="2" ry="1.2" transform="rotate(-40 11 16.5)"/>'),
  albuterol: sv('<path d="M7 11h10l-1.5 10h-7z"/><path d="M12 11V7"/><path d="M9 7h6"/><path d="M9 4c1 1 2 1 3 0s2-1 3 0"/>'),
  nebepi: sv('<path d="M7 11h10l-1.5 10h-7z"/><path d="M12 11V7"/><path d="M9 7h6"/><path d="M9 4c1 1 2 1 3 0s2-1 3 0"/><path d="M10 15h4"/>'),
  needle: sv('<path d="M14 3l7 7"/><path d="M17.5 6.5L8 16"/><path d="M8 16l-5 5"/><path d="M10.5 9.5l4 4"/>')
};
const DRUG_ICON = { epiim: 'drugPen', naloxone: 'drugSpray', abx: 'drugVial', dexa: 'drugVial', antihist: 'drugVial' };
/* Syringe-label colours loosely after ISO 26825 drug classes. */
const DRUG_COL = { epi: '#c39bff', epiim: '#c39bff', vaso: '#c39bff', atropine: '#5fd38d', adenosine: '#f2f2f2', amio: '#f2f2f2', procain: '#f2f2f2', lido: '#9aa7ad', naloxone: '#64a8ff', dextrose: '#ffe27a', mag: '#f2f2f2', abx: '#ffb46b', dexa: '#ffb46b', antihist: '#ffb46b' };
const actIcon = a => ICA[a.id] || ICA[DRUG_ICON[a.id] || 'drugSyr'];
ICA.history = sv('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>');
ICA.labs = sv('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 15h9"/>');
/* Live controls on the drawn defibrillator: [action, x, y, w, h] in the device's 240x92 viewBox (padded for fingers). */
const MON_HOT = [['pads', 143, 17, 34, 16], ['rhythm', 183, 13, 44, 16], ['sync', 183, 28, 44, 16], ['ecg12', 183, 43, 44, 16], ['shock', 192, 60, 26, 26], ['pace', 143, 69, 34, 15]];
function cartHTML() {
  const G = id => D.GROUPS.find(g => g.id === id), lbl = id => esc(G(id).n);
  return `<div class="cartviz" role="tablist" aria-label="${esc(t('cartAria'))}">
    <div class="cartbody">
      <button class="stn stn-pole" role="tab" data-tab="line" aria-label="${esc(G('line').full)}">
        <svg viewBox="0 0 34 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M17 8v184M9 8h16M9 8c-2 0-3 2-3 4M25 8c2 0 3 2 3 4" stroke="#9aa7ad" stroke-width="2.4" fill="none"/><path d="M7 14h12v26a6 6 0 0 1-12 0z" fill="rgba(200,235,255,.28)" stroke="#d6eef8" stroke-width="1.2"/><path d="M7 30h12v10a6 6 0 0 1-12 0z" fill="rgba(140,210,255,.35)"/><rect x="11" y="47" width="4" height="7" rx="1" fill="#d6eef8"/><path d="M13 54c0 10 6 12 6 22s-8 14-8 30" stroke="#d6eef8" stroke-width="1" fill="none" opacity=".7"/><rect x="5" y="80" width="24" height="30" rx="3" fill="#dfe6ea" stroke="#7d8f98"/><rect x="8" y="84" width="18" height="9" rx="1.5" fill="#062a1c"/><path d="M10 89h3l1-2 2 4 1-2h5" stroke="#3ef08f" stroke-width=".9" fill="none"/><circle cx="11" cy="101" r="2" fill="#3d8bff"/><circle cx="17" cy="101" r="2" fill="#3ef08f"/><circle cx="23" cy="101" r="2" fill="#ff5d73"/><path d="M5 196l12-6 12 6" stroke="#9aa7ad" stroke-width="2.4" fill="none"/></svg>
        <span class="vh">${lbl('line')}</span></button>
      <div class="cbody">
        <div class="stn stn-mon" data-tab="mon">
          <svg viewBox="0 0 240 92" aria-hidden="true"><path d="M70 10V4h100v6" stroke="#55626b" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="4" y="10" width="232" height="80" rx="12" fill="#2b343b" stroke="#47555f"/><rect x="14" y="19" width="120" height="62" rx="5" fill="#02080b" stroke="#1d2a31"/><path d="M18 46h16l4-12 6 24 5-14 3 6h22l4-12 6 24 5-14 3 6h22" stroke="#3ef08f" stroke-width="1.6" fill="none"/><path d="M18 70c6 0 7-8 12-8s6 8 12 8 7-8 12-8 6 8 12 8 7-8 12-8 6 8 12 8 7-8 12-8 6 8 12 8" stroke="#40d4f6" stroke-width="1.2" fill="none"/><text x="120" y="31" fill="#3ef08f" font-family="monospace" font-size="11" text-anchor="end" font-weight="700">HR</text><circle cx="160" cy="50" r="15" fill="#3a464f" stroke="#5f6f7a"/><path d="M160 50l7-8" stroke="#e9eef0" stroke-width="3" stroke-linecap="round"/><circle cx="160" cy="50" r="3" fill="#e9eef0"/><rect x="186" y="15" width="38" height="12" rx="3.5" fill="#ffd84a"/><text x="205" y="23.8" fill="#2b343b" font-family="monospace" font-size="8.6" text-anchor="middle" font-weight="700">ANALYZE</text><rect x="186" y="30" width="38" height="12" rx="3.5" fill="#e9eef0"/><text x="205" y="38.8" fill="#2b343b" font-family="monospace" font-size="9.2" text-anchor="middle" font-weight="700">SYNC</text><rect x="186" y="45" width="38" height="12" rx="3.5" fill="#9fd8ff"/><text x="205" y="53.8" fill="#12303d" font-family="monospace" font-size="8.2" text-anchor="middle" font-weight="700" direction="ltr" unicode-bidi="isolate">12-LEAD</text><circle cx="205" cy="72" r="10" fill="#e0303f" stroke="#ff8f99" stroke-width="1.5"/><path d="M207 64.5l-5.5 8.5h4.5l-2 6.5 5.5-8.5h-4.5z" fill="#fff"/><rect x="146" y="72" width="28" height="9" rx="2" fill="#5f6f7a"/><text x="160" y="79" fill="#e9eef0" font-family="monospace" font-size="7.2" text-anchor="middle" font-weight="700">PACER</text><rect x="146" y="20" width="28" height="10" rx="2.5" fill="#ff7a45" stroke="#ffb08a" stroke-width=".8"/><text x="160" y="27.6" fill="#2b1206" font-family="monospace" font-size="7.6" text-anchor="middle" font-weight="700">PADS</text><path d="M146 25 C 136 25, 140 6, 120 6" stroke="#ff7a45" stroke-width="1.6" fill="none" opacity=".8"/></svg>
          <button class="mhot mscreen" role="tab" data-tab="mon" style="left:5.8%;top:20.6%;width:50%;height:67.4%" aria-label="${esc(G('mon').full)}"></button>
          ${MON_HOT.map(([id, x, y, w, h]) => `<button class="mhot mkey" data-act="${id}" style="left:${x / 2.4}%;top:${y / 0.92}%;width:${w / 2.4}%;height:${h / 0.92}%" aria-label="${esc((D.ACTIONS.find(a => a.id === id) || {}).n || id)}" title="${esc((D.ACTIONS.find(a => a.id === id) || {}).n || id)}"></button>`).join('')}
          <span class="stl">${lbl('mon')}</span>${kbd('Q')}</div>
        <div class="drawers">
          ${['drug', 'line', 'air'].map((id, i) => `<button class="stn drawer" role="tab" data-tab="${id}"><span class="dn">${i + 1}</span><span class="dlab">${lbl(id)}</span>${i === 0 ? '<i class="seal" aria-hidden="true"></i>' : ''}<i class="handle" aria-hidden="true"></i>${kbd('WER'[i])}</button>`).join('')}
        </div>
        <div class="wheels" aria-hidden="true"><i></i><i></i></div>
      </div>
      <button class="stn stn-side" role="tab" data-tab="air" aria-label="${esc(G('air').full)}">
        <svg viewBox="0 0 44 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="M22 10c-8 0-14 5-14 12v6h28v-6c0-7-6-12-14-12z" fill="#f3f6f7" stroke="#9aa7ad"/><rect x="18" y="2" width="8" height="9" rx="2" fill="#7d8f98"/><path d="M26 6h8" stroke="#7d8f98" stroke-width="3"/><rect x="8" y="27" width="28" height="94" rx="6" fill="#3f4b52" stroke="#5f6f7a"/><text x="22" y="80" fill="#f3f6f7" font-family="monospace" font-size="8" text-anchor="middle" font-weight="700" transform="rotate(-90 22 76)">O\u2082</text><ellipse cx="22" cy="140" rx="11" ry="16" fill="rgba(80,160,255,.55)" stroke="#9cc7ff"/><path d="M14 132c5 3 11 3 16 0M14 140c5 3 11 3 16 0M14 148c5 3 11 3 16 0" stroke="#cfe5ff" stroke-width=".8" fill="none" opacity=".8"/><rect x="18" y="155" width="8" height="8" rx="2" fill="#dfe6ea"/><path d="M12 168h20l-4 12c-2 4-10 4-12 0z" fill="rgba(200,235,255,.35)" stroke="#d6eef8"/><path d="M22 124v-8c0-6 8-6 8-12" stroke="#a6f0c6" stroke-width="1.4" fill="none"/></svg>
        <span class="vh">${lbl('air')}</span></button>
    </div>
  </div>
  <div class="tray" id="tray"><div class="trayhd" id="trayHd"></div><div class="cartgrid" id="grid"></div></div>`;
}
/* Hands-on actions shown on the patient panel: the three you reach for most are big. */
const PT_KEYS = { cpr: 'C', bvm: 'B', check: 'P', position: 'H' };
function ptActsHTML(c) {
  const B = D.ACTIONS.filter(a => a.g === 'bed').map(a => actLabel(a, c)), big = ['cpr', 'bvm', 'check'];
  const btn = (a, cls) => `<button class="pa ${cls} a-${a.id}" data-act="${a.id}"><span class="ai">${actIcon(a)}</span><span class="at"><b>${esc(a.n)}</b>${cls === 'big' ? `<small>${esc(a.s)}</small>` : ''}</span>${PT_KEYS[a.id] ? kbd(PT_KEYS[a.id]) : ''}</button>`;
  return `<div class="pabig">${big.map(id => btn(B.find(a => a.id === id), 'big')).join('')}</div><div class="pasm">${B.filter(a => !big.includes(a.id)).map(a => btn(a, 'sm')).join('')}</div>`;
}
const dimCart = on => ['#cart', '#ptacts'].forEach(q => { const el = $(q); if (el) el.classList.toggle('dim', on); });
const kbd = s => `<kbd class="kbd">${s}</kbd>`;
const keyLabel = i => i < 9 ? String(i + 1) : i === 9 ? '0' : '\u21e7' + (i - 9);
const starsHTML = (n, cls = 'stars') => `<span class="${cls}">${[0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}">${IC.star}</span>`).join('')}</span>`;

/* ---------------- storage ---------------- */
const Store = {
  k: 'palsResusBay.v1',
  d: { xp: 0, best: {}, rush: 0, drill: 0, cpr: 0, exam: 0, sprint: 0, rx: {}, cards: {}, weak: {}, sound: true, vary: true },
  load() { try { const s = localStorage.getItem(this.k); if (s) Object.assign(this.d, JSON.parse(s)); } catch (e) { /* storage unavailable */ } },
  save(sync = true) { try { localStorage.setItem(this.k, JSON.stringify(this.d)); } catch (e) { /* storage unavailable */ } if (sync) Sync.schedule(); },
  addXP(n) { this.d.xp += Math.max(0, Math.round(n)); this.save(); }
};
/* Cross-device sync: one private document per signed-in viewer in the artifact's db. Local storage stays the source
   of truth on this device; the remote copy is merged in once at start and then overwritten after changes. */
const normCard = v => v == null ? null : typeof v === 'number' ? { b: v, due: 0, t: 0 } : v;
function mergeState(a, b) {
  const o = Object.assign({}, a);
  ['xp', 'rush', 'drill', 'cpr', 'exam', 'sprint'].forEach(k => { o[k] = Math.max(a[k] || 0, b[k] || 0); });
  o.rx = Object.assign({}, b.rx || {}); for (const k in a.rx || {}) { const x = a.rx[k], y = o.rx[k]; if (!y || x[1] >= y[1]) o.rx[k] = x; }
  o.best = Object.assign({}, b.best || {}); for (const k in a.best || {}) o.best[k] = Math.max(o.best[k] || 0, a.best[k]);
  o.cards = Object.assign({}, a.cards || {});
  for (const k in b.cards || {}) { const x = normCard(o.cards[k]), y = normCard(b.cards[k]); if (!x || (y && y.t > x.t)) o.cards[k] = y; }
  o.weak = Object.assign({}, a.weak || {});
  for (const k in b.weak || {}) { const x = o.weak[k], y = b.weak[k]; if (!x || (y && y.t > x.t)) o.weak[k] = y; }
  return o;
}
const Sync = {
  ref: null, busy: false, again: false, timer: null, on: false, db: null,
  async init() {
    try {
      if (!window.claude || !window.claude.use) return;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      this.db = db;
      if (!db || !user) return;
      const id = await user.id(); if (!id) return;
      this.ref = db.doc('data/users/' + id + '/progress');
      const snap = await this.ref.get();
      if (snap.exists && snap.data().state) { Object.assign(Store.d, mergeState(Store.d, snap.data().state)); Store.save(false); }
      this.on = true; this.push();
      if (CUR.name === 'home') go('home');
    } catch (e) { this.ref = null; }
  },
  schedule() { if (!this.ref) return; clearTimeout(this.timer); this.timer = setTimeout(() => this.push(), 2500); },
  async push() {
    if (!this.ref) return;
    if (this.busy) { this.again = true; return; }
    this.busy = true;
    try { const d = JSON.parse(JSON.stringify(Store.d)); delete d.lang; delete d.sound; delete d.liveW; await this.ref.set({ state: d, at: Date.now() }); } catch (e) { /* kept locally; retried on the next change */ }
    this.busy = false;
    if (this.again) { this.again = false; this.push(); }
  }
};
Store.load();
/* Difficulty levels. 1 Guided (descriptions, dose choices, hints), 2 Clinical (read the monitor yourself: no rhythm
   descriptions, step names or cycle to-do lists), 3 Expert (type every dose and energy, no in-run hints or explanations,
   faster clock, no peeking). Levels unlock with progress. */
const LV_XP = [1, 1.5, 2];
const clearedAt = lv => Object.entries(Store.d.bestLv || {}).filter(([id, l]) => l >= lv && (Store.d.best[id] || 0) >= 2).length;
function lvUnlocked(lv) {
  if (lv <= 1) return true;
  const twoStar = Object.keys(Store.d.best || {}).filter(id => !id.startsWith('gen-') && Store.d.best[id] >= 2).length;
  if (lv === 2) return Store.d.xp >= 400 || twoStar >= 5;
  return Store.d.xp >= 1400 || clearedAt(2) >= 3;
}
const curLevel = () => { let l = Store.d.level || 1; while (l > 1 && !lvUnlocked(l)) l--; return l; };
/* Text that describes the rhythm or the strip gives the answer away; from Clinical up it is replaced. Authored cases are
   matched on their English text (shared logic for both languages); generated cases carry explicit hs/hm flags. */
const RX_RE = /\b(VF|pVT|VT|SVT|asystole|PEA|sinus|flat line|complex(es)?|P waves?|QRS|AV block|heart block|torsades|fibrillation|flutter|tachycardia|bradycardia|Mobitz|Wenckebach)\b|\b(HR|rate|at) \d{2,3}\b/i;
function hidesText(i, field) {
  const p = S.c.phases[i]; if (!p || S.lv < 2 || p.type === 'post') return false;
  if (field === 'say' && (p.type || 'act') === 'cycle') return true;
  if (S.c.gen || p.tw) return !!p[field === 'say' ? 'hs' : 'hm'];
  const e = p._e;
  return !!(e && typeof e[field] === 'string' && RX_RE.test(e[field]));
}
const sayOf = (p, i) => !hidesText(i, 'say') ? p.say : (p.type || 'act') === 'cycle' ? t('cycGeneric') : (S.st.monitor ? t('lookMon') : t('lookPt'));
const msgOf = (p, i) => hidesText(i, 'msg') ? t('msgDone') : (p.msg || t('done'));
/* Typed doses (Expert): target value or [low, high] range, and the unit asked for. */
const ANS = {
  epi: w => [Math.min(0.01 * w, 1), 'mg'], epiim: w => [Math.min(0.01 * w, 0.5), 'mg'], atropine: w => [Math.max(0.1, Math.min(0.02 * w, 0.5)), 'mg'],
  adeno1: w => [Math.min(0.1 * w, 6), 'mg'], adeno2: w => [Math.min(0.2 * w, 12), 'mg'], amio: w => [Math.min(5 * w, 300), 'mg'], amioArrest: w => [Math.min(5 * w, 300), 'mg'],
  lido: w => [Math.min(w, 100), 'mg'], procain: w => [15 * w, 'mg'], naloxone: w => [w <= 20 ? 0.1 * w : 2, 'mg'],
  dextrose: w => [[5 * w, 10 * w], 'mL D10W'], fluid: w => [20 * w, 'mL'], fluidCard: w => [[5 * w, 10 * w], 'mL'], mag: w => [[20 * w, Math.min(50 * w, 2000)], 'mg'],
  shock1: w => [2 * w, 'J'], shock2: w => [4 * w, 'J'], shock3: w => [[4 * w, Math.min(10 * w, 360)], 'J'], sync1: w => [[0.5 * w, w], 'J'], sync2: w => [2 * w, 'J']
};
function doseOk(key, w, x) {
  const [v, u] = ANS[key](w), tol = u === 'J' ? 0.15 : 0.1;
  if (Array.isArray(v)) return x >= v[0] * (1 - tol / 2) && x <= v[1] * (1 + tol / 2);
  return Math.abs(x - v) <= Math.max(v * tol, 0.005);
}
const ansText = (key, w) => { const [v, u] = ANS[key](w); return (Array.isArray(v) ? `${D.f(v[0])}-${D.f(v[1])}` : D.f(v)) + ' ' + u; };
/* Spaced repetition: each card has a box (0-4) and a due time. Box intervals in days. */
const DAY = 864e5, BOX_DAYS = [0, 1, 3, 7, 21];
const cardRec = id => normCard(Store.d.cards[id]);
const cardBox = id => { const r = cardRec(id); return r ? r.b : 0; };
function cardSet(id, b, dueNow) { const now = Date.now(); Store.d.cards[id] = { b, due: dueNow ? now : now + BOX_DAYS[b] * DAY, t: now }; }
/* Weak-spot topics. Card membership is matched on the English card text (ids are shared by both languages). */
const TOPICS = {
  epi: { re: /epinephrine/i, algo: 'arrest' }, defib: { re: /defibrillat|unsynchronized|shock energy|first shock|second shock/i, algo: 'arrest' },
  sync: { re: /synchroniz|cardioversion/i, algo: 'tachy' }, adeno: { re: /adenosine/i, algo: 'tachy' },
  antiarr: { re: /amiodarone|lidocaine|procainamide/i, algo: 'arrest' }, atropine: { re: /atropine/i, algo: 'brady' },
  fluid: { re: /bolus|crystalloid/i, algo: 'shock' }, dextrose: { re: /glucose|dextrose|hypoglyc/i, algo: 'shock' },
  naloxone: { re: /naloxone|opioid/i, algo: 'resp' }, mag: { re: /magnesium/i, algo: 'resp' },
  hts: { re: /H's|reversible|tension|tamponade|toxin/i, algo: 'arrest' },
  rhythm: { re: /\bVF\b|\bVT\b|SVT|PEA|asystole|AV block|QRS|P wave|rhythm/i, algo: 'tachy' },
  vitals: { re: /hypotens|systolic|heart rate|tube size|ETT/i, algo: 'approach' }, doses: { re: /mg\/kg|J\/kg|mL\/kg/i, algo: 'arrest' },
  bls: { c: 'BLS', algo: 'bls' }, arrest: { c: 'Arrest', algo: 'arrest' }, brady: { c: 'Brady', algo: 'brady' }, tachy: { c: 'Tachy', algo: 'tachy' },
  shock: { c: 'Shock', algo: 'shock' }, resp: { c: 'Resp', algo: 'resp' }, rosc: { c: 'ROSC', algo: 'rosc' }, approach: { c: 'Assess', algo: 'approach' }
};
const DOSE_TOPIC = { epi: 'epi', epiim: 'epi', atropine: 'atropine', adeno1: 'adeno', adeno2: 'adeno', amio: 'antiarr', amioArrest: 'antiarr', lido: 'antiarr', procain: 'antiarr', naloxone: 'naloxone', dextrose: 'dextrose', fluid: 'fluid', fluidCard: 'fluid', mag: 'mag', shock1: 'defib', shock2: 'defib', shock3: 'defib', sync1: 'sync', sync2: 'sync' };
const drillTopic = n => /Epinephrine/i.test(n) ? 'epi' : /sync/i.test(n) ? 'sync' : /shock|defib/i.test(n) ? 'defib' : /Adenosine/i.test(n) ? 'adeno' : /Amiodarone|Lidocaine|Procainamide/i.test(n) ? 'antiarr' : /Atropine/i.test(n) ? 'atropine' : /bolus|fluid/i.test(n) ? 'fluid' : /Dextrose|D10|D25|glucose/i.test(n) ? 'dextrose' : /Naloxone/i.test(n) ? 'naloxone' : /Magnesium/i.test(n) ? 'mag' : 'doses';
const TOPIC_CARDS = {};
function topicCards(tp) {
  if (!TOPIC_CARDS[tp]) { const T = TOPICS[tp]; TOPIC_CARDS[tp] = !T ? [] : D_EN.CARDS.filter(c => T.c ? c.c === T.c : T.re.test(c.q + ' ' + c.a)).map(c => c.id); }
  return TOPIC_CARDS[tp];
}
function noteWeak(tp, n = 1) { if (!TOPICS[tp]) return; const w = Store.d.weak[tp] || { n: 0 }; Store.d.weak[tp] = { n: Math.min(9, w.n + n), t: Date.now() }; }
function easeWeak(tp, n) { const w = Store.d.weak[tp]; if (!w) return; const v = w.n - n; if (v <= 0.05) delete Store.d.weak[tp]; else Store.d.weak[tp] = { n: v, t: Date.now() }; }
const weakList = () => Object.entries(Store.d.weak || {}).filter(([tp, w]) => TOPICS[tp] && w.n >= 0.5).sort((a, b) => b[1].n - a[1].n);
/* After a run: record weak topics and send their flashcards back for review. Specific topics (a drug, an energy)
   reset their cards to box 0; broad algorithm topics only make their cards due again. */
function applyWeak(topics, algo, clean) {
  topics.forEach(tp => {
    noteWeak(tp);
    const spec = !(TOPICS[tp] && TOPICS[tp].c);
    topicCards(tp).forEach(id => { const r = cardRec(id); if (spec) cardSet(id, 0, true); else if (r) cardSet(id, Math.min(r.b, 1), true); });
  });
  if (clean && algo) easeWeak(algo, 1);
  Store.save();
}
function setLang(l) {
  if (l === 'he' && !D_HE) { try { D_HE = I18N.buildHe(D_EN); } catch (e) { D_HE = null; } }
  if (l === 'he' && !D_HE) l = 'en';
  LANG = l; D = l === 'he' ? D_HE : D_EN;
  document.documentElement.lang = l; document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
  Store.d.lang = l; Store.save();
}
setLang(Store.d.lang || ((navigator.language || '').toLowerCase().startsWith('he') ? 'he' : 'en'));
/* In Hebrew mode: elements with no Hebrew letters (doses, energies, English abbreviations) read left to right.
   Mixed Hebrew text stays right to left, and each run of numbers, units and English ("0.21 mg IM, 0.21 mL",
   "1 mg/mL") is isolated left to right, so "0.21 mL \u05e9\u05dc 1 mg/mL" never scrambles. textContent is unchanged. */
const HEB_RE = /[\u0590-\u05ff]/;
const BIDI_SEL = '.opt, .chip, .rule, .branch, .cc td small, .fb span, .clue, .sheet p, .say, .qtext, .look, .why';
const LTR_RUN = /[A-Za-z0-9](?:[A-Za-z0-9 .,/+\-\u2212\u2013\u00d7%:=<>\u2265\u2264~\u03bc\u00b7']*[A-Za-z0-9%])?/g;
function bidiRuns(el) {
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('kbd, bdi, svg, input') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach(n => {
    const s = n.textContent; LTR_RUN.lastIndex = 0;
    if (!LTR_RUN.test(s)) return;
    LTR_RUN.lastIndex = 0;
    const fr = document.createDocumentFragment(); let at = 0, mt;
    while ((mt = LTR_RUN.exec(s))) {
      if (mt.index > at) fr.appendChild(document.createTextNode(s.slice(at, mt.index)));
      const b = document.createElement('bdi'); b.dir = 'ltr'; b.textContent = mt[0]; fr.appendChild(b);
      at = mt.index + mt[0].length;
    }
    if (at < s.length) fr.appendChild(document.createTextNode(s.slice(at)));
    n.replaceWith(fr);
  });
}
function bidiFix(root) {
  if (LANG !== 'he' || !root.querySelectorAll) return;
  const els = [...root.querySelectorAll(BIDI_SEL)]; if (root.matches && root.matches(BIDI_SEL)) els.push(root);
  els.forEach(el => {
    if (!HEB_RE.test(el.textContent)) { if (!el.matches('.sheet p, .say, .qtext, .look, .why')) el.setAttribute('dir', 'ltr'); return; }
    el.removeAttribute('dir');
    bidiRuns(el);
  });
}
new MutationObserver(ms => {
  if (LANG !== 'he') return;
  for (const m of ms) m.addedNodes.forEach(n => {
    if (n.nodeType === 1) { if (n.tagName !== 'BDI') bidiFix(n); }
    else if (n.nodeType === 3 && n.parentElement && n.parentElement.tagName !== 'BDI') { const host = n.parentElement.closest(BIDI_SEL); if (host) bidiFix(host); }
  });
}).observe(document.body, { childList: true, subtree: true });
const RANKS = [[0, 'Bystander'], [150, 'First Responder'], [400, 'Code Nurse'], [800, 'Resident'], [1400, 'Fellow'], [2200, 'Team Leader'], [3200, 'Code Captain']];
function rankOf(xp) {
  let i = 0; while (i < RANKS.length - 1 && xp >= RANKS[i + 1][0]) i++;
  const lo = RANKS[i][0], hi = RANKS[i + 1] ? RANKS[i + 1][0] : lo + 1000;
  const RN = t('ranks');
  return { name: RN[i], pct: Math.min(100, Math.round((xp - lo) / (hi - lo) * 100)), next: RANKS[i + 1] ? RN[i + 1] : null };
}

/* ---------------- sound ---------------- */
const Sound = {
  ctx: null,
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.ctx = null; } }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
  },
  tone(f, d = 0.08, type = 'sine', v = 0.06, when = 0) {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + d + 0.03);
  },
  /* Pulse-oximeter tone: a short, soft, almost pure beep on each pleth peak. Pitch falls about half a semitone for every
     1% drop in SpO2 (about 940 Hz at 100%), the way bedside monitors let you hear desaturation without looking. */
  wave() {
    if (!this.pw && this.ctx) { const re = new Float32Array([0, 1, 0.16, 0.05, 0.02]), im = new Float32Array(re.length); this.pw = this.ctx.createPeriodicWave(re, im); }
    return this.pw;
  },
  pulseTone(spo2) {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t = c.currentTime + 0.005, f = 940 * Math.pow(2, (Math.max(50, Math.min(100, spo2)) - 100) / 24);
    const o = c.createOscillator(), g = c.createGain();
    o.setPeriodicWave(this.wave()); o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.055, t + 0.004);
    g.gain.setValueAtTime(0.055, t + 0.045); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.14);
  },
  /* QRS beep when there is no SpO2 signal: fixed pitch, a little shorter. */
  qrs() { this.tone(880, 0.05, 'sine', 0.04); },
  /* IEC 60601-1-8 style high-priority alarm: a burst of 3 + 2 harmonic-rich pulses. */
  alarm() {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, w = this.wave(), base = c.currentTime + 0.01;
    [0, 0.2, 0.4, 0.75, 0.95].forEach(dt => {
      const t = base + dt, o = c.createOscillator(), g = c.createGain(), o2 = c.createOscillator(), g2 = c.createGain();
      o.setPeriodicWave(w); o.frequency.value = 523; o2.type = 'square'; o2.frequency.value = 1046; g2.gain.value = 0.18;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.035, t + 0.02); g.gain.setValueAtTime(0.035, t + 0.13); g.gain.linearRampToValueAtTime(0.0001, t + 0.16);
      o.connect(g); o2.connect(g2).connect(g); g.connect(c.destination); o.start(t); o2.start(t); o.stop(t + 0.18); o2.stop(t + 0.18);
    });
  },
  /* Medium-priority alarm (low SpO2): three slower, lower pulses. */
  alarmMed() {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, w = this.wave(), base = c.currentTime + 0.01;
    [0, 0.3, 0.6].forEach(dt => {
      const t = base + dt, o = c.createOscillator(), g = c.createGain();
      o.setPeriodicWave(w); o.frequency.value = 440;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.03); g.gain.setValueAtTime(0.03, t + 0.18); g.gain.linearRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.25);
    });
  },
  ok() { this.tone(660, 0.08, 'triangle', 0.06); this.tone(990, 0.12, 'triangle', 0.05, 0.07); },
  bad() { this.tone(180, 0.2, 'sawtooth', 0.04); },
  zap() { this.tone(70, 0.35, 'sawtooth', 0.09); this.tone(140, 0.2, 'square', 0.05, 0.02); },
  charge(d = 1.6) {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t0 = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(500, t0); o.frequency.exponentialRampToValueAtTime(1500, t0 + d);
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.03, t0 + 0.1); g.gain.setValueAtTime(0.03, t0 + d - 0.05); g.gain.linearRampToValueAtTime(0.0001, t0 + d);
    o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + d + 0.05);
  },
  ready() { this.tone(1200, 0.12, 'square', 0.03); this.tone(1200, 0.12, 'square', 0.03, 0.18); },
  click(acc) { this.tone(acc ? 1500 : 1100, 0.03, 'square', 0.04); },
  noiseBuf() {
    if (!this.nb && this.ctx) { const n = this.ctx.sampleRate, b = this.ctx.createBuffer(1, n, n), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.nb = b; }
    return this.nb;
  },
  /* NIBP cuff: the pump motor while it inflates (a low buzz with some air noise) */
  cuffPump(d) {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t0 = c.currentTime + 0.01, g = c.createGain(), o = c.createOscillator(), lp = c.createBiquadFilter(), ns = c.createBufferSource(), ng = c.createGain(), bp = c.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(95, t0); o.frequency.linearRampToValueAtTime(82, t0 + d);
    lp.type = 'lowpass'; lp.frequency.value = 420;
    ns.buffer = this.noiseBuf(); ns.loop = true; bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8; ng.gain.value = 0.35;
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.022, t0 + 0.15); g.gain.setValueAtTime(0.022, t0 + d - 0.2); g.gain.linearRampToValueAtTime(0.0001, t0 + d);
    o.connect(lp).connect(g); ns.connect(bp).connect(ng).connect(g); g.connect(c.destination);
    o.start(t0); ns.start(t0); o.stop(t0 + d + 0.05); ns.stop(t0 + d + 0.05);
  },
  /* a short release of air at each deflation step */
  cuffStep() {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, t0 = c.currentTime + 0.005, ns = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
    ns.buffer = this.noiseBuf(); hp.type = 'highpass'; hp.frequency.value = 2500;
    g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.018, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    ns.connect(hp).connect(g).connect(c.destination); ns.start(t0); ns.stop(t0 + 0.14);
  },
  /* measurement done: one soft beep */
  cuffDone() { this.tone(1046, 0.09, 'sine', 0.035); },
  /* Chest sounds through the stethoscope, two breaths. Normal air entry is soft filtered noise; stridor is a harsh
     high-pitched inspiratory note, wheeze a musical expiratory one, crackles are fine clicks on inspiration, grunting a
     short low expiratory note; a nearly silent chest is barely audible. */
  breath(k, P = 2) {
    if (!Store.d.sound || !this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx, out = c.destination, T0 = c.currentTime + 0.05, ins = P * 0.4, ex = P * 0.5, vol = k.silent ? 0.25 : 1;
    const env = (g, t, d, v) => { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + d * 0.35); g.gain.linearRampToValueAtTime(v * 0.7, t + d * 0.75); g.gain.linearRampToValueAtTime(0.0001, t + d); };
    const air = (t, d, f, v) => { const ns = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain(); ns.buffer = this.noiseBuf(); ns.loop = true; bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 0.9; env(g, t, d, v * vol); ns.connect(bp).connect(g).connect(out); ns.start(t); ns.stop(t + d + 0.05); };
    const note = (t, d, f0, f1, type, v, q) => { const o = c.createOscillator(), bp = c.createBiquadFilter(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f1, t + d); bp.type = 'bandpass'; bp.frequency.value = (f0 + f1) / 2; bp.Q.value = q; env(g, t, d, v * vol); o.connect(bp).connect(g).connect(out); o.start(t); o.stop(t + d + 0.05); };
    for (let n = 0; n < 2; n++) {
      const t = T0 + n * P;
      air(t, ins, 420, 0.05); air(t + ins + 0.05, ex, 260, 0.022);
      if (k.stridor) { note(t, ins, 620, 760, 'sawtooth', 0.03, 6); note(t, ins, 930, 1080, 'sawtooth', 0.012, 8); }
      if (k.wheeze) { note(t + ins + 0.05, ex, 520, 430, 'triangle', 0.035, 4); note(t + ins + 0.1, ex * 0.9, 390, 330, 'sine', 0.025, 4); }
      if (k.crackle) for (let i = 0; i < 9; i++) {
        const ct = t + ins * (0.35 + 0.6 * Math.random()), ns = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
        ns.buffer = this.noiseBuf(); hp.type = 'highpass'; hp.frequency.value = 1800;
        g.gain.setValueAtTime(0.05 * vol, ct); g.gain.exponentialRampToValueAtTime(0.0001, ct + 0.012);
        ns.connect(hp).connect(g).connect(out); ns.start(ct, Math.random() * 0.5); ns.stop(ct + 0.02);
      }
      if (k.grunt) note(t + ins + 0.05, 0.22, 210, 170, 'sawtooth', 0.04, 2);
    }
  }
};
document.addEventListener('pointerdown', () => Sound.ensure(), { passive: true });
document.addEventListener('keydown', () => Sound.ensure());

/* ---------------- ECG generator ---------------- */
const gs = (x, s) => Math.exp(-(x * x) / (2 * s * s));
function shape(e, x) {
  switch (e.k) {
    case 'P': return 0.24 * gs(x, e.ps || 0.02);
    /* QT shortens and T narrows as the rate rises, so the next P wave stays visible in sinus tachycardia. */
    case 'N': { const tq = 0.09 + 0.16 * Math.sqrt(e.rr); return -0.09 * gs(x + 0.022, 0.007) + gs(x, 0.0095) - 0.26 * gs(x - 0.022, 0.008) + (e.ta ?? 0.28) * gs(x - tq, 0.024 + 0.03 * Math.min(e.rr, 1)); }
    case 'W': { const tq = 0.2 + 0.08 * Math.sqrt(e.rr); return 0.9 * gs(x, 0.034) - 0.62 * gs(x - 0.075, 0.03) - 0.3 * gs(x - tq, 0.06); }
    case 'S': return 1.1 * gs(x, 0.004);
  }
  return 0;
}
const cprArt = t => { const ph = t % 0.545; return 0.9 * gs(ph - 0.1, 0.045) - 0.35 * gs(ph - 0.26, 0.07); };
const cprPleth = t => { const ph = t % 0.545; return gs(ph - 0.2, 0.07); };
/* Impedance respiration: a smooth rise on inspiration and slower fall, at the breathing (or ventilator) period st.rp.
   Compressions show as a fast ripple; apnea is a flat line. */
function respWave(t, st) {
  if (st.cpr) return 0.18 * Math.sin(2 * Math.PI * 1.83 * t) + (st.rp ? 0.35 * Math.max(0, Math.sin(2 * Math.PI * t / st.rp)) : 0);
  if (!st.rp) return (Math.random() - 0.5) * 0.02;
  const P = st.rp, x = t % P, ins = P * 0.4;
  return x < ins ? 0.5 - 0.5 * Math.cos(Math.PI * x / ins) : 0.5 + 0.5 * Math.cos(Math.PI * (x - ins) / (P - ins));
}
/* Capnography waveform, 0..~1 (1 = 50 mmHg). st.co2 is the end-tidal value, st.vent the breath period in seconds.
   Bag-mask CPR without an advanced airway gives pairs of breaths (15:2); with a tube, one breath every vent seconds.
   Compressions add a small ripple to the plateau. */
function capWave(t, st) {
  const v = Math.min(1.25, (st.co2 || 0) / 50), rip = st.cpr ? 0.05 * v * Math.sin(2 * Math.PI * 1.83 * t) : 0;
  if (st.cpr && !st.tube) {
    const x = t % 9;
    if (x < 0.08) return v * 0.6 * (1 - x / 0.08);
    if (x < 0.55 || (x >= 1.45 && x < 1.9)) return 0.02;
    if (x < 1.45) { const r = x - 0.55; return v * Math.min(1, r / 0.12) * (0.92 + 0.08 * r / 0.9); }
    const r = x - 1.9; return v * Math.min(1, r / 0.12) * Math.max(0.5, 1 - r / 15) + rip;
  }
  const P = st.vent || 3, x = t % P, ins = Math.min(0.9, P * 0.35);
  if (x < 0.08) return v * (1 - x / 0.08);
  if (x < ins) return 0.02;
  const r = x - ins;
  return v * Math.min(1, r / 0.12) * (0.9 + 0.1 * Math.min(1, r / (P - ins))) + rip;
}
class Rhythm {
  constructor(type, hr, t0) { this.type = type; this.hr = Math.max(20, hr || 80); this.ev = []; this.n = t0; this.na = t0; this.k = 0; this.seed = Math.random() * 10; }
  sched(T) {
    const ty = this.type, hr = this.hr;
    if (ty === 'vf' || ty === 'torsades' || ty === 'asystole') return;
    if (ty === 'avb3') {
      while (this.na < T) { this.ev.push({ t: this.na, k: 'P' }); this.na += 0.58; }
      while (this.n < T) { this.ev.push({ t: this.n, k: 'W', rr: 60 / hr, c: 1 }); this.n += 60 / hr; }
      return;
    }
    while (this.n < T) {
      const t = this.n, rr = 60 / hr;
      switch (ty) {
        case 'nsr': case 'stach': case 'sbrady': case 'avb1': case 'pea': {
          const pr = ty === 'avb1' ? 0.3 : (hr > 160 ? 0.08 : hr > 130 ? 0.095 : 0.13);
          this.ev.push({ t: t - pr, k: 'P', ps: hr > 130 ? 0.015 : 0.02 }); this.ev.push({ t, k: 'N', rr, c: 1, ta: hr > 130 ? 0.22 : undefined });
          const j = ty === 'stach' ? 0.05 : 0.03;
          this.n += rr * (1 + (Math.random() * 2 - 1) * j); break;
        }
        case 'svt': this.ev.push({ t, k: 'N', rr, c: 1, ta: 0.18 }); this.n += rr; break;
        case 'vt': this.ev.push({ t, k: 'W', rr, c: 1 }); this.n += rr; break;
        case 'paced': this.ev.push({ t: t - 0.04, k: 'S' }); this.ev.push({ t, k: 'W', rr, c: 1 }); this.n += rr; break;
        case 'afib': { const r = rr * (0.6 + Math.random() * 0.8); this.ev.push({ t, k: 'N', rr: r, c: 1, ta: 0.2 }); this.n += r; break; }
        case 'aflutter': this.ev.push({ t, k: 'N', rr, c: 1, ta: 0.1 }); this.n += rr; break;
        case 'mobitz1': {
          const pp = 60 / hr, seq = [0.16, 0.24, 0.32, null], pr = seq[this.k % 4]; this.k++;
          this.ev.push({ t, k: 'P' }); if (pr !== null) this.ev.push({ t: t + pr, k: 'N', rr: pp * 1.3, c: 1 });
          this.n += pp; break;
        }
        case 'mobitz2': {
          const pp = 60 / hr, drop = this.k % 3 === 2; this.k++;
          this.ev.push({ t, k: 'P' }); if (!drop) this.ev.push({ t: t + 0.16, k: 'N', rr: pp, c: 1 });
          this.n += pp; break;
        }
        default: this.ev.push({ t, k: 'N', rr, c: 1 }); this.n += rr;
      }
    }
  }
  prune(t) { if (this.ev.length > 40) this.ev = this.ev.filter(e => e.t > t - 2); }
  ecg(t) {
    this.sched(t + 0.6);
    const ty = this.type; let v = 0;
    if (ty === 'vf') { const a = (0.3 + 0.2 * Math.sin(2 * Math.PI * 0.21 * t + this.seed)) * (this.amp ?? 1); return a * (Math.sin(2 * Math.PI * 5.3 * t) + 0.55 * Math.sin(2 * Math.PI * 7.9 * t + 1.3) + 0.4 * Math.sin(2 * Math.PI * 3.1 * t + 0.4 + this.seed)); }
    if (ty === 'torsades') return 0.85 * Math.sin(2 * Math.PI * 3.7 * t) * (0.2 + 0.8 * Math.abs(Math.sin(2 * Math.PI * 0.32 * t)));
    if (ty === 'asystole') return 0.025 * Math.sin(2 * Math.PI * 0.27 * t + this.seed);
    if (ty === 'afib') v += 0.045 * (Math.sin(2 * Math.PI * 6.3 * t) + Math.sin(2 * Math.PI * 8.9 * t + 1) + 0.7 * Math.sin(2 * Math.PI * 5.1 * t + 2)) / 2;
    if (ty === 'aflutter') { const ph = (t * 5) % 1; v += 0.18 * (ph < 0.8 ? 0.5 - ph / 0.8 : -0.5 + (ph - 0.8) / 0.2); }
    for (const e of this.ev) { const x = t - e.t; if (x < -0.25 || x > 0.7) continue; v += shape(e, x); }
    return v;
  }
  pleth(t) {
    let v = 0;
    for (const e of this.ev) { if (!e.c) continue; const x = t - e.t; if (x < 0 || x > 0.9) continue; v += 0.9 * gs(x - 0.2, 0.07) + 0.32 * gs(x - 0.43, 0.06); }
    return Math.min(v, 1.25);
  }
}

/* ---------------- monitor ---------------- */
const COL = {};
function readCols() { const cs = getComputedStyle(document.documentElement); ['ecg', 'spo2', 'co2', 'rr'].forEach(k => { COL[k] = cs.getPropertyValue('--' + k).trim() || '#3ef08f'; }); }
readCols();
class Monitor {
  constructor(cv, o = {}) {
    this.cv = cv; this.ctx = cv.getContext('2d'); this.sweep = o.sweep || 5; this.onBeat = o.onBeat || null; this.full = !!o.full;
    this.t0 = performance.now(); this.last = 0; this.cursor = 0;
    this.st = { monitor: true, rhythm: 'nsr', hr: 100, pulse: true, cpr: false };
    this.r = new Rhythm('nsr', 100, 0.2);
    this.resize();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(cv);
    this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
  }
  now() { return (performance.now() - this.t0) / 1000; }
  set(s) {
    const p = this.st; this.st = Object.assign({}, p, s);
    if (this.st.rhythm !== p.rhythm) this.r = new Rhythm(this.st.rhythm, this.st.hr, Math.max(this.now() + 0.12, this.holdT || 0));
    else if (this.st.hr !== p.hr) this.r.hr = Math.max(20, this.st.hr || 80);
    this.r.amp = this.st.vfa;
  }
  /* A pause in the heartbeat (adenosine, a shock): no complexes for s seconds, then whatever rhythm there is by then. */
  hold(s) {
    const now = this.now(), t = now + s; this.holdT = Math.max(this.holdT || 0, t);
    this.r.ev = this.r.ev.filter(e => e.t <= now); this.r.n = Math.max(this.r.n, t); this.r.na = Math.max(this.r.na, t);
  }
  /* A shock: the trace saturates, drifts back to the baseline, and only then shows the rhythm. */
  shock() { this.shockT = this.now(); this.hold(1.7); }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(60, Math.round(this.cv.clientWidth)), h = Math.max(60, Math.round(this.cv.clientHeight));
    if (w === this.cw && h === this.ch) return;
    this.cw = w; this.ch = h; this.w = w;
    this.cv.width = w * dpr; this.cv.height = h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.eMin = new Float32Array(w).fill(NaN); this.eMax = new Float32Array(w).fill(NaN);
    this.pMin = new Float32Array(w).fill(NaN); this.pMax = new Float32Array(w).fill(NaN);
    this.cMin = new Float32Array(w).fill(NaN); this.cMax = new Float32Array(w).fill(NaN);
    this.rMin = new Float32Array(w).fill(NaN); this.rMax = new Float32Array(w).fill(NaN);
    this.stamp = new Int32Array(w).fill(-1);
  }
  loop() {
    this.raf = requestAnimationFrame(this.loop);
    if (!this.cv.isConnected) { this.destroy(); return; }
    this.step(); this.draw();
  }
  destroy() { cancelAnimationFrame(this.raf); if (this.ro) this.ro.disconnect(); this.ro = null; }
  step() {
    const t = this.now(); let a = this.last; if (t - a > 0.6) a = t - 0.6; if (a >= t) return;
    const w = this.w, sw = this.sweep, dt = sw / w / 3, st = this.st, r = this.r;
    let col = this.cursor;
    for (let tt = a; tt < t; tt += dt) {
      const k = Math.floor(tt / sw); col = Math.min(w - 1, Math.floor((tt / sw - k) * w));
      let e = 0, p = 0, cc = NaN, rs = 0;
      if (st.monitor) {
        const sx = this.shockT != null ? tt - this.shockT : -1;
        e = r.ecg(tt);
        if (sx >= 0 && sx < 1.7) e = (r.type === 'vf' || r.type === 'torsades' ? 0 : e) + (sx < 0.06 ? 1.25 : sx < 0.12 ? -0.75 : 0.9 * Math.exp(-(sx - 0.12) / 0.35));
        e += (st.cpr ? cprArt(tt) : 0) + (Math.random() - 0.5) * 0.014;
        p = st.pulse ? r.pleth(tt) * (st.perf ?? 1) : (st.cpr ? 0.35 * cprPleth(tt) : 0);
        if (st.co2 != null) cc = capWave(tt, st);
        if (this.full) rs = respWave(tt, st);
      }
      if (this.stamp[col] !== k) { this.stamp[col] = k; this.eMin[col] = this.eMax[col] = e; this.pMin[col] = this.pMax[col] = p; this.cMin[col] = this.cMax[col] = cc; this.rMin[col] = this.rMax[col] = rs; }
      else {
        if (rs < this.rMin[col]) this.rMin[col] = rs; if (rs > this.rMax[col]) this.rMax[col] = rs;
        if (e < this.eMin[col]) this.eMin[col] = e; if (e > this.eMax[col]) this.eMax[col] = e;
        if (p < this.pMin[col]) this.pMin[col] = p; if (p > this.pMax[col]) this.pMax[col] = p;
        if (!(cc >= this.cMin[col])) this.cMin[col] = isNaN(this.cMin[col]) ? cc : Math.min(cc, this.cMin[col]); if (!(cc <= this.cMax[col])) this.cMax[col] = isNaN(this.cMax[col]) ? cc : Math.max(cc, this.cMax[col]);
      }
    }
    /* beeps: on each QRS (pleth tone when SpO2 reads, QRS tone otherwise); during CPR the monitor counts the compressions */
    if (st.monitor && this.onBeat) {
      if (st.cpr && !st.pulse) {
        for (let n = Math.floor(a / 0.545); n <= Math.floor(t / 0.545); n++) { const q = n * 0.545 + 0.1, pl = n * 0.545 + 0.2; if (q > a && q <= t) this.onBeat('qrs'); if (pl > a && pl <= t) this.onBeat('pleth'); }
      } else for (const ev of r.ev) { if (!ev.c) continue; if (ev.t > a && ev.t <= t) this.onBeat('qrs'); if (st.pulse && ev.t + 0.2 > a && ev.t + 0.2 <= t) this.onBeat('pleth'); }
    }
    this.cursor = col; this.last = t; r.prune(t);
  }
  draw() {
    const c = this.ctx, w = this.cw, h = this.ch;
    c.clearRect(0, 0, w, h);
    c.strokeStyle = 'rgba(110,170,190,0.06)'; c.lineWidth = 1; c.beginPath();
    const g = w / (this.sweep * 5);
    for (let x = 0; x < w; x += g) { c.moveTo(Math.round(x) + 0.5, 0); c.lineTo(Math.round(x) + 0.5, h); }
    for (let y = 0; y < h; y += g) { c.moveTo(0, Math.round(y) + 0.5); c.lineTo(w, Math.round(y) + 0.5); }
    c.stroke();
    const cap = this.st.monitor && this.st.co2 != null;
    /* Bedside layout: one lane per waveform (ECG larger), each lined up with its number beside the canvas. */
    if (this.full) {
      const L = [['e', 1.4, COL.ecg, 'II', 0.62, 0.48], ['p', 1, COL.spo2, this.st.monitor && this.st.pulse && this.st.perf < 0.5 ? 'Pleth \u00b7 low perfusion' : 'Pleth', 0.88, 0.66], ['r', 1, COL.rr, 'Resp', 0.86, 0.6]].concat(cap ? [['c', 1, COL.co2, 'CO\u2082', 0.92, 0.75]] : []);
      const tot = L.reduce((a, l) => a + l[1], 0); let y = 0;
      c.font = '600 10px "IBM Plex Mono", monospace';
      L.forEach(([k, wt, col, lab, base, amp], i) => {
        const H = h * wt / tot, top = y; y += H;
        if (i) { c.strokeStyle = 'rgba(110,170,190,0.13)'; c.beginPath(); c.moveTo(0, Math.round(top) + 0.5); c.lineTo(w, Math.round(top) + 0.5); c.stroke(); }
        this.trace(this[k + 'Min'], this[k + 'Max'], v => top + H * base - v * H * amp, col);
        c.globalAlpha = 0.75; c.fillStyle = col; c.fillText(lab, 6, top + 12); c.globalAlpha = 1;
      });
      return;
    }
    /* Three lanes once capnography is connected: ECG, pleth, CO2. */
    const eTop = h * 0.04, eH = h * (cap ? 0.48 : 0.6), pTop = h * (cap ? 0.53 : 0.68), pH = h * (cap ? 0.21 : 0.3), cTop = h * 0.76, cH = h * 0.23;
    this.trace(this.eMin, this.eMax, v => eTop + eH * 0.62 - v * eH * 0.48, COL.ecg);
    this.trace(this.pMin, this.pMax, v => pTop + pH * 0.9 - v * pH * 0.68, COL.spo2);
    if (cap) this.trace(this.cMin, this.cMax, v => cTop + cH * 0.95 - v * cH * 0.8, COL.co2);
    c.font = '600 10px "IBM Plex Mono", monospace'; c.globalAlpha = 0.7;
    c.fillStyle = COL.ecg; c.fillText('II', 6, 12);
    c.fillStyle = COL.spo2; c.fillText('PLETH', 6, pTop + 10);
    if (cap) { c.fillStyle = COL.co2; c.fillText('CO\u2082', 6, cTop + 10); }
    c.globalAlpha = 1;
  }
  trace(mn, mx, fy, col) {
    const c = this.ctx, w = this.w, gap = Math.max(10, w * 0.02), cur = this.cursor;
    c.strokeStyle = col; c.lineWidth = 1.7; c.lineJoin = 'round'; c.shadowColor = col; c.shadowBlur = 5;
    c.beginPath(); let pen = false, prev = 0;
    for (let x = 0; x < w; x++) {
      const d = (x - cur + w) % w;
      if ((d > 0 && d < gap) || isNaN(mn[x])) { pen = false; continue; }
      let a = fy(mn[x]), b = fy(mx[x]);
      if (Math.abs(prev - a) > Math.abs(prev - b)) { const tmp = a; a = b; b = tmp; }
      if (!pen) { c.moveTo(x, a); pen = true; } else c.lineTo(x, a);
      if (Math.abs(b - a) > 0.5) c.lineTo(x, b);
      prev = b;
    }
    c.stroke(); c.shadowBlur = 0;
  }
}

/* ---------------- shell: routing, modals ---------------- */
let cleanups = [];
const MODALS = new Set();
function cleanup() { cleanups.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; MODALS.forEach(m => m.close()); }
/* The guide: what a case is, what the monitor shows, and where every action and item lives. Opens by itself once. */
function tutorial() {
  const T = t('tut'); let i = 0;
  const names = g => D.ACTIONS.filter(a => a.g === g).map(a => esc(a.n)).join(' \u00b7 ');
  const page = pg => `<h2>${esc(pg.h)}</h2>
    ${pg.vis === 'pt' ? `<div class="tutvis"><div class="pt skin-pink eyes-open breathing has-mask has-pads has-io" style="--skin:#f0c4a4;--lips:#c9737a;--skinE:#a8796a">${patientSVG('child')}</div></div>` : pg.vis === 'cart' ? `<div class="tutvis cart" inert>${cartHTML().split('<div class="tray"')[0]}</div>` : ''}
    ${pg.p.map(x => `<p>${esc(x)}</p>`).join('')}
    ${pg.list ? `<p class="tutlist">${names(pg.list)}</p>` : ''}
    ${pg.groups ? `<dl class="tutdl">${pg.groups.map(g => `<dt>${esc(D.GROUPS.find(x => x.id === g).full)}</dt><dd>${names(g)}</dd>`).join('')}</dl>` : ''}
    ${(pg.p2 || []).map(x => `<p>${esc(x)}</p>`).join('')}`;
  const m = modal(`<div class="sheet wide tut" role="dialog" aria-modal="true"><div class="eyebrow">${esc(T.title)} \u00b7 <span id="tutN"></span></div><div id="tutB"></div>
    <div class="row"><button class="btn primary" data-n></button><button class="btn ghost" data-p>${esc(T.prev)}</button><button class="btn ghost" data-x>${esc(T.close)}</button></div></div>`);
  const ui = () => {
    $('#tutN', m.el).textContent = `${i + 1} / ${T.pages.length}`; $('#tutB', m.el).innerHTML = page(T.pages[i]);
    $('[data-p]', m.el).disabled = i === 0; $('[data-n]', m.el).textContent = i === T.pages.length - 1 ? T.done : T.next;
    const sh = $('.sheet', m.el); if (sh) sh.scrollTop = 0; m.el.scrollTop = 0;
  };
  m.el.addEventListener('click', e => {
    if (e.target.closest('[data-n]')) { if (i === T.pages.length - 1) m.close(); else { i++; ui(); } }
    else if (e.target.closest('[data-p]')) { if (i) { i--; ui(); } }
    else if (e.target.closest('[data-x]')) m.close();
  });
  if (!Store.d.tutSeen) { Store.d.tutSeen = true; Store.save(); }
  ui();
}
document.addEventListener('click', e => { if (e.target.closest('[data-tut]')) tutorial(); });
/* The case-screen tour: a spotlight walks over the screen itself and says in one line what each part is for.
   Runs by itself in the first case; the ? button in the case bar replays it. The case clock stands still meanwhile. */
const TOUR_SEL = ['#mon', '#situ', '#pt', '#ptacts', '.stn-mon', '.drawers', '#tray', '.simbar .in'];
function tour() {
  if (!S || $('.tour')) return;
  const T = t('tour'), steps = TOUR_SEL.map((sel, i) => ({ sel, txt: T.steps[i] })).filter(s => { const e = $(s.sel); return e && e.getClientRects().length; });
  if (!steps.length) return;
  let i = 0;
  const el = document.createElement('div'); el.className = 'tour';
  el.innerHTML = `<div class="tspot"></div><div class="tbub" role="dialog" aria-live="polite"><p></p><div class="trow"><span class="tn"></span><button class="btn ghost sm" data-x>${esc(T.skip)}</button><button class="btn primary sm" data-n></button></div></div>`;
  document.body.appendChild(el);
  const spot = $('.tspot', el), bub = $('.tbub', el);
  const holder = { el, close: () => end() };
  MODALS.add(holder); S.modal = true;
  const place = () => {
    const tg = $(steps[i].sel); if (!tg) return;
    const r = tg.getBoundingClientRect(), pad = 6, vw = innerWidth, vh = innerHeight;
    const L = Math.max(4, r.left - pad), T0 = Math.max(4, r.top - pad), R = Math.min(vw - 4, r.right + pad), B = Math.min(vh - 4, r.bottom + pad);
    Object.assign(spot.style, { left: L + 'px', top: T0 + 'px', width: Math.max(0, R - L) + 'px', height: Math.max(0, B - T0) + 'px' });
    const bw = bub.offsetWidth, bh = bub.offsetHeight;
    let top = B + 10;
    if (top + bh > vh - 8) top = T0 - 10 - bh;
    if (top < 8) top = Math.min(vh - bh - 8, Math.max(8, T0 + 12));
    bub.style.top = top + 'px'; bub.style.left = Math.max(12, Math.min(vw - bw - 12, (L + R) / 2 - bw / 2)) + 'px';
  };
  const show = () => {
    if (steps[i].sel === '#tray') setTab('drug');
    const tg = $(steps[i].sel);
    if (tg && steps[i].sel !== '.simbar .in') tg.scrollIntoView({ block: 'center', behavior: 'instant' });
    $('p', bub).textContent = steps[i].txt;
    bidiRuns($('p', bub));
    $('.tn', bub).textContent = `${i + 1} / ${steps.length}`;
    $('[data-n]', bub).textContent = i === steps.length - 1 ? T.done : T.next;
    place(); setTimeout(place, 80);
  };
  const next = () => { if (i < steps.length - 1) { i++; show(); } else end(); };
  const kh = e => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); e.stopPropagation(); next(); } };
  function end() {
    if (!el.isConnected) return;
    el.remove(); MODALS.delete(holder); if (S) { S.modal = MODALS.size > 0; setTab('mon'); }
    removeEventListener('scroll', place, true); removeEventListener('resize', place); document.removeEventListener('keydown', kh, true);
    Store.d.tourSeen = true; Store.save();
  }
  el.addEventListener('click', e => { if (e.target.closest('[data-n]')) next(); else if (e.target.closest('[data-x]')) end(); });
  addEventListener('scroll', place, true); addEventListener('resize', place); document.addEventListener('keydown', kh, true);
  cleanups.push(end);
  show();
  setTimeout(() => { const b = $('[data-n]', bub); if (b) b.focus({ preventScroll: true }); }, 30);
}
function go(name, arg) { cleanup(); CUR = { name, arg }; window.scrollTo(0, 0); (SCREENS[name] || SCREENS.home)(arg); }
function modal(html) {
  const el = document.createElement('div'); el.className = 'scrim'; el.innerHTML = html; document.body.appendChild(el);
  const m = { el, close() { el.remove(); MODALS.delete(m); if (S) S.modal = MODALS.size > 0; } };
  MODALS.add(m); if (S) S.modal = true;
  const f = el.querySelector('button'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 30);
  return m;
}
function toast(msg) {
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.body.appendChild(el);
  setTimeout(() => el.remove(), 1800);
}
function topBar() {
  const r = rankOf(Store.d.xp);
  return `<div class="top"><div class="brand"><span class="dot"></span><b>PALS Resus Bay</b></div>
    <div class="xp" title="${esc(r.next ? t('nextRank', r.next) : t('topRank'))}"><div><strong>${esc(r.name)}</strong> <small>${Store.d.xp} XP</small></div><div class="bar"><i style="width:${r.pct}%"></i></div></div>
    ${langBtn()}<button class="iconbtn" data-tut aria-label="${esc(t('tut').title)}" title="${esc(t('tut').title)}">?</button><button class="iconbtn" data-report aria-label="${esc(t('reportAria'))}">${IC.flag}</button><button class="iconbtn" data-snd aria-label="${esc(t('sound'))}">${Store.d.sound ? IC.snd : IC.mute}</button></div>`;
}
const langBtn = () => `<button class="langbtn" data-lang aria-label="${esc(t('langAria'))}">${esc(t('langBtn'))}</button>`;
const secHead = (title, sub) => `<div class="sechead"><button class="iconbtn" data-go="home" aria-label="${esc(t('backHome'))}">${IC.back}</button><h2>${esc(title)}</h2>${langBtn()}<button class="iconbtn" data-tut aria-label="${esc(t('tut').title)}" title="${esc(t('tut').title)}">?</button><button class="iconbtn" data-report aria-label="${esc(t('reportAria'))}">${IC.flag}</button>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>`;
app.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) { go(g.dataset.go, g.dataset.arg); return; }
  if (e.target.closest('[data-lang]')) { setLang(LANG === 'he' ? 'en' : 'he'); go(CUR.name, CUR.arg); return; }
  const s = e.target.closest('[data-snd]');
  if (s) { Store.d.sound = !Store.d.sound; Store.save(); Sound.ensure(); $$('[data-snd]').forEach(b => { b.innerHTML = Store.d.sound ? IC.snd : IC.mute; }); }
});

/* ---------------- HOME ---------------- */
function home() {
  const d = Store.d, cleared = D.CASES.filter(c => d.best[c.id] > 0).length;
  const mastered = D.CARDS.reduce((s, c) => s + cardBox(c.id), 0) / (D.CARDS.length * 4);
  const due = D.CARDS.filter(c => { const r = cardRec(c.id); return r && r.due <= Date.now(); }).length;
  const TT = t('tiles'), tv = k => typeof TT[k] === 'function' ? TT[k](k === 'cases' ? D.CASES.length : D.CARDS.length) : TT[k];
  const tiles = [
    { go: 'cases', ic: IC.sim, c: 'var(--accent)', k: 'cases', stat: t('statCleared', cleared, D.CASES.length), big: true },
    { go: 'atlas', ic: IC.atlas, c: 'var(--spo2)', k: 'atlas', stat: t('statAlgos', D.ALGOS.length) },
    { go: 'rush', ic: IC.rush, c: 'var(--ecg)', k: 'rush', stat: t('statBest', d.rush || 0) },
    { go: 'drill', ic: IC.drill, c: 'var(--rr)', k: 'drill', stat: t('statBest', d.drill || 0) },
    { go: 'cpr', ic: IC.cpr, c: 'var(--bp)', k: 'cpr', stat: t('statBestPct', d.cpr || 0) },
    { go: 'recall', ic: IC.recall, c: 'var(--co2)', k: 'recall', stat: due ? t('statDue', due) : t('statMastered', Math.round(mastered * 100)) },
    { go: 'exam', ic: IC.exam, c: 'var(--spo2)', k: 'exam', stat: t('statBestPct', d.exam || 0) },
    { go: 'live', ic: IC.live, c: 'var(--bad)', k: 'live', stat: t('statLive'), live: true },
    { go: 'card', ic: IC.card, c: 'var(--z-white)', k: 'card', stat: t('statRef') }
  ].map(x => Object.assign(x, { n: tv(x.k)[0], p: tv(x.k)[1] }));
  app.innerHTML = `<div class="shell">${topBar()}
    <section class="hero">
      <div>
        <div class="eyebrow">${esc(t('eyebrowHome'))}</div>
        <h1>${esc(t('h1a'))}<br><span>${esc(t('h1b'))}</span></h1>
        <p class="lede">${esc(t('lede'))}</p>
        <div class="cta"><button class="btn primary" data-go="cases">${esc(t('ctaStart'))}</button><button class="btn" data-go="random">${IC.dice} ${esc(t('surpriseH'))}</button><button class="btn" data-go="atlas">${esc(t('ctaLearn'))}</button></div>
      </div>
      <div class="heromon" aria-label="${esc(t('monAria'))}">
        <div class="mhead"><span id="hName"></span><span>${esc(t('bed'))}</span></div>
        <div class="mbody"><canvas id="hcv"></canvas>
          <div class="side">
            <div class="vital" style="--vc:var(--ecg)"><small><span>HR</span></small><b id="hHR">110</b></div>
            <div class="vital" style="--vc:var(--spo2)"><small><span>SpO\u2082</span></small><b id="hSp">98</b></div>
            <div class="vital sm" style="--vc:var(--bp)"><small><span>NIBP</span></small><b id="hBP">96/58</b></div>
          </div>
        </div>
      </div>
    </section>
    <div class="path">${t('steps').map((st, i) => `<div class="step"><b>${i + 1}</b><div><h3>${esc(st[0])}</h3><p>${esc(st[1])}</p></div></div>`).join('')}</div>
    ${weakPanel(due)}
    <div class="modes">${tiles.map(x => `<button class="tile${x.big ? ' big' : ''}${x.live ? ' livetile' : ''}" style="--tc:${x.c}" data-go="${x.go}"><span class="stat">${esc(x.stat)}</span><span class="ic">${x.ic}</span><h3>${esc(x.n)}</h3><p>${esc(x.p)}</p></button>`).join('')}</div>
    <p class="foot">${esc(t('foot'))}${Sync.on ? ` ${esc(t('synced'))}` : ''}</p>
  </div>`;
  const mon = new Monitor($('#hcv'), { sweep: 4 });
  const demo = [
    { r: 'nsr', hr: 110, p: true, n: 'Sinus rhythm', sp: 98, bp: '96/58' },
    { r: 'svt', hr: 260, p: true, n: 'SVT', sp: 95, bp: '84/50' },
    { r: 'vf', hr: 0, p: false, n: 'Ventricular fibrillation', sp: null, bp: null },
    { r: 'sbrady', hr: 48, p: true, n: 'Sinus bradycardia', sp: 84, bp: '64/36' },
    { r: 'avb3', hr: 40, p: true, n: 'Complete heart block', sp: 92, bp: '70/40' },
    { r: 'vt', hr: 190, p: false, n: 'Pulseless VT', sp: null, bp: null }
  ];
  let k = 0;
  const show = () => {
    const x = demo[k % demo.length]; k++;
    mon.set({ monitor: true, rhythm: x.r, hr: x.hr, pulse: x.p, cpr: false });
    $('#hName').textContent = t('demo')[demo.indexOf(x)]; $('#hHR').textContent = x.r === 'vf' ? '---' : x.hr;
    $('#hSp').textContent = x.sp ?? '--'; $('#hBP').textContent = x.bp ?? '--';
  };
  show();
  const iv = setInterval(show, 6000);
  cleanups.push(() => { clearInterval(iv); mon.destroy(); });
}

function weakPanel(due) {
  const wl = weakList().slice(0, 3), TP = t('topics');
  if (!wl.length && !due) return '';
  return `<section class="weak"><div class="weakhd"><h3>${esc(t('weakTitle'))}</h3>${due ? `<button class="btn sm" data-go="recall" data-arg="due">${esc(t('dueN', due))}</button>` : ''}</div>
    ${wl.length ? `<div class="weaklist">${wl.map(([tp, w]) => `<div class="wk"><div class="wkt"><b>${esc(TP[tp] || tp)}</b><span class="wbar"><i style="width:${Math.min(100, Math.round(w.n * 12))}%"></i></span></div><div class="wkb"><button class="btn sm" data-go="recall" data-arg="weak:${tp}">${esc(t('drillCards'))}</button><button class="btn ghost sm" data-go="algo" data-arg="${TOPICS[tp].algo}">${esc(t('reviewAlgo'))}</button></div></div>`).join('')}</div>` : `<p class="muted">${esc(t('weakNone'))}</p>`}
  </section>`;
}

/* ---------------- CASE LIST ---------------- */
function cases() {
  const groups = [...new Set(D.CASES.map(c => c.group))], G = t('gen');
  const LV = t('levels'), cl = curLevel();
  app.innerHTML = `<div class="shell">${secHead(t('casesTitle'), t('casesSub'))}
    <div class="lvsel" role="radiogroup" aria-label="${esc(t('lvLabel'))}">${LV.map((L, i) => { const l = i + 1, ok = lvUnlocked(l); return `<button class="lvbtn lv${l}${l === cl ? ' on' : ''}${ok ? '' : ' locked'}" role="radio" aria-checked="${l === cl}" data-level="${l}" ${ok ? '' : 'aria-disabled="true"'}><b>${ok ? '' : '\ud83d\udd12 '}${esc(L.n)}</b><small>${esc(ok ? L.d : L.req)}</small></button>`; }).join('')}</div>
    <section class="group genset"><div class="genhd"><h3>${esc(t('genHead'))}</h3><span class="tgls"><label class="tgl"><input type="checkbox" id="real" ${Store.d.real !== false ? 'checked' : ''}><span>${esc(t('realLbl'))}</span></label><label class="tgl"><input type="checkbox" id="vary" ${Store.d.vary !== false ? 'checked' : ''}><span>${esc(t('varyLbl'))}</span></label><label class="tgl"><input type="checkbox" id="fatigue" ${Store.d.fatigue === true ? 'checked' : ''}><span>${esc(t('fatLbl'))}</span></label><label class="tgl"><input type="checkbox" id="course" ${Store.d.course !== false ? 'checked' : ''}><span>${esc(t('courseLbl'))}</span></label></span></div>
      <p class="muted gensub">${esc(t('genSub'))}</p>
      <button class="casecard surprisecard" data-go="random"><div class="row"><span class="zone" style="--zc:var(--rr)">${IC.dice} ${esc(t('surprise'))}</span></div><h4>${esc(t('surpriseH'))}</h4><p>${esc(t('surpriseP'))}</p></button>
      <div class="cards">${['arrest', 'tachy', 'brady'].map(ty => `<button class="casecard gencard" data-go="gen" data-arg="${ty}"><div class="row"><span class="zone" style="--zc:var(--accent)">${IC.dice} ${esc(t('genAny'))}</span>${starsHTML(Store.d.best['gen-' + ty] || 0)}</div><h4>${esc(G.title[ty])}</h4><p>${esc(t('genDesc')[ty])}</p></button>`).join('')}</div></section>
    ${groups.map(g => `<section class="group"><h3>${esc(g)}</h3><div class="cards">${D.CASES.filter(c => c.group === g).map(c => {
      const z = D.zoneFor(c.wt), best = Store.d.best[c.id] || 0, algo = D.ALGOS.find(a => a.id === c.algo), bl = (Store.d.bestLv || {})[c.id] || 0;
      return `<button class="casecard" data-go="sim" data-arg="${c.id}">
        <div class="row">${cl >= 2 ? `<span class="zone" style="--zc:var(--dim)">? ${t('kg')}</span>` : `<span class="zone" style="--zc:var(--z-${z.id})">${esc(z.n)} \u00b7 ${c.wt} ${t('kg')}</span>`}<span class="cstat">${bl >= 2 ? `<i class="lvtag lv${bl}">${esc(LV[bl - 1].n)}</i>` : ''}${starsHTML(best)}</span></div>
        <h4>${esc(c.title)}</h4>
        <p>${esc(c.brief)}</p>
        <div class="row"><span class="meta"><span class="chip">${esc(c.age)}</span><span class="chip">${esc(algo ? algo.name : '')}</span></span><span class="diff" title="${esc(t('difficulty'))}">${[1, 2, 3].map(i => `<i class="${i <= c.diff ? 'on' : ''}"></i>`).join('')}</span></div>
      </button>`; }).join('')}</div></section>`).join('')}
  </div>`;
  $('#vary').addEventListener('change', e => { Store.d.vary = e.target.checked; Store.save(); });
  $('#course').addEventListener('change', e => { Store.d.course = e.target.checked; Store.save(); toast(e.target.checked ? t('courseOn') : t('courseOff')); });
  $('#fatigue').addEventListener('change', e => { Store.d.fatigue = e.target.checked; Store.save(); toast(e.target.checked ? t('fatOn') : t('fatOff')); });
  $('#real').addEventListener('change', e => { Store.d.real = e.target.checked; Store.save(); toast(e.target.checked ? t('realOn') : t('realOff')); });
  $('.lvsel').addEventListener('click', e => { const b = e.target.closest('[data-level]'); if (!b) return; const l = +b.dataset.level; if (!lvUnlocked(l)) { toast(t('levels')[l - 1].req); return; } Store.d.level = l; Store.save(); go('cases'); });
}
function varyCase(c) {
  let w = c.wt * (0.87 + Math.random() * 0.26);
  w = w < 10 ? Math.round(w * 2) / 2 : Math.round(w);
  return Object.assign({}, c, { wt: w, baseWt: c.wt });
}
const genCase = type => window.PALS_GEN.make(['arrest', 'tachy', 'brady'].includes(type) ? type : 'arrest', D, t('gen'));
/* Surprise: any fixed case or a generated one, with the case type hidden until the debrief. */
function surpriseCase() {
  const pool = D.CASES.map(c => () => Object.assign({}, c)).concat(['arrest', 'arrest', 'tachy', 'brady'].map(ty => () => genCase(ty)));
  const c = Object.assign(pick(pool)(), { surprise: true });
  if (c.gen) c.title = t('surprise');
  return c;
}

/* ---------------- SIMULATOR ---------------- */
let S = null, MON = null;
const SKIN = { pink: ['#f0b49c', '#cf6670', '#c98a74'], pale: ['#eadbd2', '#c79aa0', '#b9a59a'], mottled: ['#d2b2b6', '#9a6f86', '#a5838c'], cyan: ['#b6c3da', '#5f70ad', '#8794b0'], grey: ['#b5b6ba', '#77809a', '#8a8c94'], flushed: ['#f4a593', '#c8505e', '#cf7867'] };
const actName = id => actLabel(D.ACTIONS.find(a => a.id === id) || { id, n: id }, S && S.c).n;
/* Patient on the bed, seen from above. Proportions change with age; equipment layers are shown by CSS classes. */
function patientSVG(kind) {
  const P = {
    infant: { hy: 50, hr: 21, tw: 40, ty: 77, th: 44, aw: 9, al: 32, ar: 34, lw: 12, ll: 40, la: 22, hair: '#b8875a', pants: 'diaper' },
    child: { hy: 40, hr: 16.5, tw: 44, ty: 61, th: 58, aw: 10, al: 52, ar: 14, lw: 13, ll: 70, la: 4, hair: '#4a3428', pants: 'shorts' },
    teen: { hy: 33, hr: 14.5, tw: 52, ty: 50, th: 70, aw: 11, al: 62, ar: 10, lw: 15, ll: 80, la: 3, hair: '#2a1d16', pants: 'shorts' }
  }[kind] || null;
  const p = P || { hy: 40, hr: 16.5, tw: 44, ty: 61, th: 58, aw: 10, al: 52, ar: 14, lw: 13, ll: 70, la: 4, hair: '#4a3428', pants: 'shorts' };
  const cx = 70, tx = cx - p.tw / 2, by = p.ty + p.th, hipY = by - 8, KNEE = kind === 'infant' ? 0.56 : 0.48;
  const shL = [tx + 5, p.ty + 7], shR = [tx + p.tw - 5, p.ty + 7];
  const arm = (sx, sy, rot, side) => `<g transform="translate(${sx} ${sy}) rotate(${rot})"><rect x="${-p.aw / 2}" y="0" width="${p.aw}" height="${p.al}" rx="${p.aw / 2}" fill="url(#skG)" stroke="var(--skinE)" stroke-width=".6"/><ellipse cx="0" cy="${p.al + p.aw * 0.35}" rx="${p.aw * 0.62}" ry="${p.aw * 0.75}" fill="var(--skin)" stroke="var(--skinE)" stroke-width=".6"/>${side === 'R' ? `<g class="probe"><rect x="${-p.aw * 0.55}" y="${p.al + p.aw * 0.55}" width="${p.aw * 1.1}" height="${p.aw * 0.9}" rx="2" fill="#2f3a41" stroke="#77858d" stroke-width=".6"/><circle class="led" cx="0" cy="${p.al + p.aw}" r="1.6" fill="#ff3b4e"/><path d="M0 ${p.al + p.aw * 1.45} c 6 10, 20 14, 40 18" stroke="#77858d" stroke-width="1" fill="none"/></g>` : ''}</g>`;
  const leg = (x, rot) => `<g transform="translate(${x} ${hipY}) rotate(${rot})"><rect x="${-p.lw / 2}" y="0" width="${p.lw}" height="${p.ll}" rx="${p.lw / 2}" fill="url(#skG)" stroke="var(--skinE)" stroke-width=".6"/><path d="M${-p.lw * 0.3} ${p.ll * KNEE} q ${p.lw * 0.3} ${p.lw * 0.22} ${p.lw * 0.6} 0" stroke="var(--skinE)" stroke-width=".7" fill="none" opacity=".7"/><ellipse cx="${rot > 0 ? -2 : 2}" cy="${p.ll + 1}" rx="${p.lw * 0.5}" ry="${p.lw * 0.7}" fill="var(--skin)" stroke="var(--skinE)" stroke-width=".6"/></g>`;
  const lx = cx - p.lw * 0.75, rx = cx + p.lw * 0.75;
  /* IO site: proximal tibia, just below the knee, on the medial (inner) side of the patient's right leg.
     Leg-local point (medial offset, distance from hip) rotated with the leg (SVG rotate is clockwise). */
  const th = p.la * Math.PI / 180, ioL = [p.lw * 0.18, p.ll * (KNEE + 0.13)];
  const ioX = lx + ioL[0] * Math.cos(th) - ioL[1] * Math.sin(th), ioY = hipY + ioL[0] * Math.sin(th) + ioL[1] * Math.cos(th);
  const eyeY = p.hy - p.hr * 0.05, eyeDx = p.hr * 0.38, mouthY = p.hy + p.hr * 0.5;
  const nip = [cx - p.tw * 0.24, p.ty + p.th * 0.3, cx + p.tw * 0.24];
  const pads = `<g class="pads"><path d="M${cx - p.tw * 0.27} ${p.ty + 6} C ${cx - 40} ${p.ty - 20}, 20 30, 10 20" stroke="#ff7a45" stroke-width="1.6" fill="none"/><path d="M${cx + p.tw * 0.38} ${p.ty + p.th * 0.6} C 128 ${p.ty + 30}, 132 60, 130 22" stroke="#ff7a45" stroke-width="1.6" fill="none"/><rect x="${cx - p.tw * 0.42}" y="${p.ty + 4}" width="${p.tw * 0.32}" height="${p.th * 0.34}" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="${cx - p.tw * 0.39}" y="${p.ty + 7}" width="${p.tw * 0.26}" height="4" rx="1" fill="#ff7a45"/><rect x="${cx + p.tw * 0.14}" y="${p.ty + p.th * 0.46}" width="${p.tw * 0.32}" height="${p.th * 0.34}" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="${cx + p.tw * 0.17}" y="${p.ty + p.th * 0.49}" width="${p.tw * 0.26}" height="4" rx="1" fill="#ff7a45"/></g>`;
  const lead = (x, y, c) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#f3f6f7" stroke="#9aa7ad" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="1.4" fill="${c}"/>`;
  const leads = `<g class="leads"><path d="M${shL[0] + 2} ${p.ty + 3} C 30 ${p.ty - 10}, 22 40, 14 30 M${shR[0] - 2} ${p.ty + 3} C 108 ${p.ty - 10}, 118 40, 126 30 M${cx + p.tw * 0.3} ${by - 12} C ${cx + p.tw * 0.7} ${by - 20}, 126 90, 128 40" stroke="#c7d3d8" stroke-width=".8" fill="none" opacity=".75"/>${lead(shL[0] + 2, p.ty + 3, '#f3f6f7')}${lead(shR[0] - 2, p.ty + 3, '#222')}${lead(cx + p.tw * 0.3, by - 12, '#e0303f')}</g>`;
  const hands = kind === 'infant'
    ? `<g class="hands"><path d="M${tx - 7} ${p.ty + p.th * 0.62} q -3 -10 6 -14 l ${p.tw * 0.45} 4 q 3 3 0 6 z" fill="#d9a07a" stroke="#8a5a3c"/><path d="M${tx + p.tw + 7} ${p.ty + p.th * 0.62} q 3 -10 -6 -14 l ${-p.tw * 0.45} 4 q -3 3 0 6 z" fill="#d9a07a" stroke="#8a5a3c"/><ellipse cx="${cx - 3}" cy="${p.ty + p.th * 0.5}" rx="3.2" ry="5" fill="#e6b08a" stroke="#8a5a3c"/><ellipse cx="${cx + 3}" cy="${p.ty + p.th * 0.5}" rx="3.2" ry="5" fill="#e6b08a" stroke="#8a5a3c"/></g>`
    : `<g class="hands"><path d="M${cx - 16} ${p.ty + p.th * 0.72} q -2 -18 16 -20 q 18 2 16 20 q -16 8 -32 0z" fill="#c98b62" stroke="#8a5a3c"/><path d="M${cx - 13} ${p.ty + p.th * 0.62} q 0 -14 13 -16 q 13 2 13 16 q -13 7 -26 0z" fill="#d9a07a" stroke="#8a5a3c"/><path d="M${cx - 8} ${p.ty + p.th * 0.56} l 0 -6 M${cx - 3} ${p.ty + p.th * 0.55} l 0 -7 M${cx + 2} ${p.ty + p.th * 0.55} l 0 -7 M${cx + 7} ${p.ty + p.th * 0.56} l 0 -6" stroke="#8a5a3c" stroke-width=".8"/></g>`;
  return `<svg viewBox="0 0 140 220" role="img" aria-label="${esc(t('ptAria'))}">
  <defs>
    <linearGradient id="skG" x1="0" x2="1"><stop offset="0" stop-color="var(--skin)"/><stop offset=".6" stop-color="var(--skin)"/><stop offset="1" stop-color="var(--skinE)" stop-opacity=".9"/></linearGradient>
    <radialGradient id="hdG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="var(--skin)"/><stop offset=".8" stop-color="var(--skin)"/><stop offset="1" stop-color="var(--skinE)"/></radialGradient>
    <linearGradient id="bdG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2c4a57"/><stop offset="1" stop-color="#21404c"/></linearGradient>
  </defs>
  <rect x="3" y="2" width="134" height="216" rx="14" fill="#0e1f27" stroke="#2d5567"/>
  <rect x="9" y="8" width="122" height="204" rx="11" fill="url(#bdG)"/>
  <path d="M9 120 h122" stroke="#31566a" stroke-width="1" opacity=".6"/>
  <rect x="${cx - 34}" y="${p.hy - p.hr - 9}" width="68" height="${p.hr * 2 + 6}" rx="${p.hr}" fill="#3b6170" opacity=".85"/>
  ${leg(lx, p.la)}${leg(rx, -p.la)}
  ${p.pants === 'diaper'
    ? `<path d="M${cx - p.tw * 0.5} ${hipY - 6} h${p.tw} v6 q -4 16 -${p.tw * 0.5} 18 q -${p.tw * 0.5 - 4} -2 -${p.tw * 0.5} -18 z" fill="#eef3f5" stroke="#b8c6cc"/><rect x="${cx - p.tw * 0.5 + 2}" y="${hipY - 4}" width="7" height="5" rx="1.5" fill="#8ec5ff"/><rect x="${cx + p.tw * 0.5 - 9}" y="${hipY - 4}" width="7" height="5" rx="1.5" fill="#8ec5ff"/>`
    : `<path d="M${cx - p.tw * 0.5} ${hipY - 8} h${p.tw} l 2 ${p.ll * 0.3} h-${p.tw * 0.46} l -2 -6 l -2 6 h-${p.tw * 0.46} z" fill="#3d6b8a" stroke="#2a5068"/>`}
  <g class="io"><path d="M${ioX} ${ioY} C ${ioX - 18} ${ioY + 6}, 8 ${ioY + 30}, 6 214" stroke="#d6eef8" stroke-width="1.1" fill="none" opacity=".8"/><rect x="${ioX - 4}" y="${ioY - 4}" width="8" height="8" rx="2" fill="#ff4fa3" stroke="#fff" stroke-width=".8"/><circle cx="${ioX}" cy="${ioY}" r="1.6" fill="#fff"/></g>
  ${arm(shL[0], shL[1], p.ar, 'L')}${arm(shR[0], shR[1], -p.ar, 'R')}
  <g class="chest">
    <rect class="torso" x="${tx}" y="${p.ty}" width="${p.tw}" height="${p.th}" rx="${p.tw * 0.36}" fill="url(#skG)" stroke="var(--skinE)" stroke-width=".7"/>
    <path d="M${cx - p.tw * 0.28} ${p.ty + p.th * 0.42} q ${p.tw * 0.28} 5 ${p.tw * 0.56} 0 M${cx - p.tw * 0.3} ${p.ty + p.th * 0.52} q ${p.tw * 0.3} 5 ${p.tw * 0.6} 0" stroke="var(--skinE)" stroke-width=".7" fill="none" opacity=".45"/>
    <circle cx="${nip[0]}" cy="${nip[1]}" r="1.4" fill="var(--lips)" opacity=".7"/><circle cx="${nip[2]}" cy="${nip[1]}" r="1.4" fill="var(--lips)" opacity=".7"/>
    <circle cx="${cx}" cy="${p.ty + p.th * 0.74}" r="1.2" fill="var(--skinE)"/>
    <g class="retr" stroke="#6b3f33" fill="none" stroke-linecap="round"><path d="M${cx - p.tw * 0.36} ${p.ty + p.th * 0.66} q ${p.tw * 0.16} -${p.th * 0.1} ${p.tw * 0.33} -${p.th * 0.03} M${cx + p.tw * 0.36} ${p.ty + p.th * 0.66} q -${p.tw * 0.16} -${p.th * 0.1} -${p.tw * 0.33} -${p.th * 0.03}" stroke-width="1.5"/><path d="M${cx - p.tw * 0.3} ${p.ty + p.th * 0.33} q ${p.tw * 0.1} 2.5 ${p.tw * 0.2} 0 M${cx + p.tw * 0.3} ${p.ty + p.th * 0.33} q -${p.tw * 0.1} 2.5 -${p.tw * 0.2} 0" stroke-width="1"/><path d="M${cx - 3.5} ${p.ty + 2.5} q 3.5 4 7 0" stroke-width="1.4"/></g>
    <g class="mottle" fill="#7d5a78" opacity=".35"><circle cx="${cx - 9}" cy="${p.ty + 14}" r="4"/><circle cx="${cx + 9}" cy="${p.ty + 26}" r="5"/><circle cx="${cx - 4}" cy="${p.ty + p.th * 0.62}" r="4.5"/><circle cx="${cx + 12}" cy="${p.ty + p.th * 0.78}" r="3.5"/><circle cx="${cx - 14}" cy="${p.ty + p.th * 0.45}" r="3"/></g>
    <g class="hives" fill="#e35d6a" opacity=".55"><circle cx="${cx - 10}" cy="${p.ty + 12}" r="3"/><circle cx="${cx + 11}" cy="${p.ty + 18}" r="3.5"/><circle cx="${cx}" cy="${p.ty + p.th * 0.55}" r="2.6"/><circle cx="${cx + 12}" cy="${p.ty + p.th * 0.7}" r="3"/><circle cx="${cx - 13}" cy="${p.ty + p.th * 0.75}" r="2.2"/></g>
    ${leads}${pads}
  </g>
  <rect x="${cx - p.hr * 0.36}" y="${p.hy + p.hr * 0.7}" width="${p.hr * 0.72}" height="${p.ty - p.hy - p.hr * 0.7 + 4}" fill="var(--skin)" stroke="var(--skinE)" stroke-width=".5"/>
  <ellipse cx="${cx - p.hr * 0.98}" cy="${p.hy + 1}" rx="${p.hr * 0.18}" ry="${p.hr * 0.3}" fill="var(--skin)" stroke="var(--skinE)" stroke-width=".6"/>
  <ellipse cx="${cx + p.hr * 0.98}" cy="${p.hy + 1}" rx="${p.hr * 0.18}" ry="${p.hr * 0.3}" fill="var(--skin)" stroke="var(--skinE)" stroke-width=".6"/>
  <circle cx="${cx}" cy="${p.hy}" r="${p.hr}" fill="url(#hdG)" stroke="var(--skinE)" stroke-width=".7"/>
  ${kind === 'infant'
    ? `<path d="M${cx - p.hr * 0.6} ${p.hy - p.hr * 0.72} q ${p.hr * 0.3} -${p.hr * 0.3} ${p.hr * 0.6} -${p.hr * 0.1} q ${p.hr * 0.3} -${p.hr * 0.25} ${p.hr * 0.55} ${p.hr * 0.05}" stroke="${p.hair}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`
    : `<path d="M${cx - p.hr * 1.02} ${p.hy - p.hr * 0.05} C ${cx - p.hr * 1.05} ${p.hy - p.hr * 1.15}, ${cx + p.hr * 1.05} ${p.hy - p.hr * 1.15}, ${cx + p.hr * 1.02} ${p.hy - p.hr * 0.05} C ${cx + p.hr * 0.75} ${p.hy - p.hr * 0.62}, ${cx + p.hr * 0.1} ${p.hy - p.hr * 0.5}, ${cx - p.hr * 0.25} ${p.hy - p.hr * 0.72} C ${cx - p.hr * 0.5} ${p.hy - p.hr * 0.45}, ${cx - p.hr * 0.85} ${p.hy - p.hr * 0.45}, ${cx - p.hr * 1.02} ${p.hy - p.hr * 0.05}Z" fill="${p.hair}"/>`}
  <path d="M${cx - eyeDx - 3.2} ${eyeY - 4.2} q 3.2 -1.6 6.4 0 M${cx + eyeDx - 3.2} ${eyeY - 4.2} q 3.2 -1.6 6.4 0" stroke="${p.hair}" stroke-width="1" fill="none" opacity=".8"/>
  <path class="eyeC" d="M${cx - eyeDx - 3} ${eyeY} q 3 2.4 6 0 M${cx + eyeDx - 3} ${eyeY} q 3 2.4 6 0" stroke="#3a2a22" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <g class="eyeO">${[-1, 1].map(s => `<g class="eye"><ellipse cx="${cx + s * eyeDx}" cy="${eyeY}" rx="3.3" ry="2.5" fill="#fbfbf6" stroke="#3a2a22" stroke-width=".6"/><circle cx="${cx + s * eyeDx}" cy="${eyeY + 0.2}" r="1.7" fill="#3b2a20"/><circle cx="${cx + s * eyeDx + 0.6}" cy="${eyeY - 0.5}" r=".5" fill="#fff"/></g>`).join('')}</g>
  <path d="M${cx - 1.2} ${p.hy + p.hr * 0.12} q 1.2 2.4 2.4 0" stroke="var(--skinE)" stroke-width="1" fill="none"/>
  <ellipse cx="${cx - p.hr * 0.55}" cy="${p.hy + p.hr * 0.3}" rx="${p.hr * 0.18}" ry="${p.hr * 0.11}" fill="var(--lips)" opacity=".25"/><ellipse cx="${cx + p.hr * 0.55}" cy="${p.hy + p.hr * 0.3}" rx="${p.hr * 0.18}" ry="${p.hr * 0.11}" fill="var(--lips)" opacity=".25"/>
  <ellipse cx="${cx}" cy="${mouthY}" rx="${p.hr * 0.2}" ry="${p.hr * 0.1}" fill="var(--lips)"/>
  <g class="tube"><path d="M${cx - p.hr * 0.75} ${mouthY - 1} h${p.hr * 1.5}" stroke="#f3e6c4" stroke-width="3.2" stroke-linecap="round" opacity=".95"/><path d="M${cx} ${mouthY} Q ${cx + p.hr * 0.9} ${mouthY + 3}, ${cx + p.hr + 10} ${p.hy - p.hr * 0.5}" stroke="#e8f6ff" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M${cx} ${mouthY} Q ${cx + p.hr * 0.9} ${mouthY + 3}, ${cx + p.hr + 10} ${p.hy - p.hr * 0.5}" stroke="#9fd8ff" stroke-width="1" fill="none" opacity=".7"/><rect x="${cx + p.hr + 6}" y="${p.hy - p.hr * 0.5 - 9}" width="8" height="6" rx="1.5" fill="#f3f6f7" stroke="#9aa7ad"/><rect x="${cx + p.hr + 6.5}" y="${p.hy - p.hr * 0.5 - 15}" width="7" height="5" rx="1" fill="#a974ff"/><path d="M${cx + p.hr + 10} ${p.hy - p.hr * 0.5 - 15} C ${cx + p.hr + 14} ${p.hy - p.hr - 18}, 128 20, 130 10" stroke="#a974ff" stroke-width=".9" fill="none" opacity=".8"/></g>
  <g class="o2line"><path d="M${cx - p.hr * 0.6} ${mouthY - 2} C ${cx - p.hr * 1.4} ${mouthY + 6}, 26 ${p.hy - 6}, 12 ${p.hy - 22}" stroke="#a6f0c6" stroke-width="1.6" fill="none" opacity=".85"/><path d="M${cx - p.hr * 0.9} ${p.hy - p.hr * 0.1} C ${cx - p.hr * 1.1} ${p.hy - p.hr * 1.2}, ${cx + p.hr * 1.1} ${p.hy - p.hr * 1.2}, ${cx + p.hr * 0.9} ${p.hy - p.hr * 0.1}" stroke="#d6eef8" stroke-width=".9" fill="none" opacity=".7"/></g>
  <path class="mask" d="M${cx - p.hr * 0.55} ${p.hy + p.hr * 0.05} q ${p.hr * 0.55} -${p.hr * 0.45} ${p.hr * 1.1} 0 q ${p.hr * 0.12} ${p.hr * 0.55} -${p.hr * 0.12} ${p.hr * 0.85} q -${p.hr * 0.43} ${p.hr * 0.3} -${p.hr * 0.86} 0 q -${p.hr * 0.24} -${p.hr * 0.3} -${p.hr * 0.12} -${p.hr * 0.85}z" fill="rgba(200,240,255,.3)" stroke="#bfefff" stroke-width="1.2"/>
  <g class="bag"><path d="M${cx + p.hr * 0.35} ${p.hy + p.hr * 0.2} L ${cx + p.hr + 4} ${p.hy - p.hr * 0.25}" stroke="#dfe6ea" stroke-width="4" stroke-linecap="round"/><g transform="translate(${cx + p.hr + 13} ${p.hy - p.hr * 0.6}) rotate(-50)"><g class="bagbody"><ellipse cx="0" cy="0" rx="12" ry="8" fill="rgba(80,160,255,.62)" stroke="#9cc7ff"/><path d="M-6 -7 q 3 7 0 14 M0 -8 q 3 8 0 16 M6 -7 q 3 7 0 14" stroke="#cfe5ff" stroke-width=".7" fill="none"/></g><rect x="12" y="-2.5" width="6" height="5" rx="1.5" fill="#dfe6ea"/><ellipse cx="27" cy="0" rx="9" ry="5" fill="rgba(166,240,198,.35)" stroke="#a6f0c6" stroke-width=".8"/></g></g>
  ${hands}
</svg>`;
}

function simScreen(arg) {
  let c = arg && typeof arg === 'object' ? arg : D.CASES.find(x => x.id === arg);
  if (!c) { go('cases'); return; }
  if (!c.gen && !c.baseWt && Store.d.vary !== false) c = varyCase(c);
  c = Object.assign({}, c, { phases: c.phases.slice() });
  if (c.gen && c.baseGenWt == null) c.baseGenWt = c.wt;
  const lv = curLevel(), LVN = t('levels')[lv - 1], ageY = ageYears(c);
  /* Post-ROSC stabilization board before the end of arrest cases that finish at ROSC. */
  if ((POST_IDS.includes(c.id) || c.gen === 'arrest') && !c.phases.some(p => p.type === 'post')) {
    const ei = c.phases.findIndex(p => p.type === 'end');
    c.phases.splice(ei < 0 ? c.phases.length : ei, 0, { type: 'post', k: t('postK'), say: t('postSay'), t: 90, need: [] });
  }
  { const ce = !c.gen && D_EN.CASES.find(x => x.id === c.id); if (ce) c.phases.forEach((p, i) => { if (p.type !== 'post' && !p._e) p._e = ce.phases[i]; }); }
  plotTwists(c, lv);
  const hideWt = lv >= 2 && ageY != null;
  const z = D.zoneFor(c.wt);
  app.innerHTML = `<div class="sim">
    <div class="simbar"><div class="in">
      <button class="iconbtn" id="sBack" aria-label="${esc(t('leaveCase'))}">${IC.back}</button>
      <div class="ttl"><span><i class="lvtag lv${lv}">${esc(LVN.n)}</i>${Store.d.real !== false ? ` <i class="lvtag real">${esc(t('realTag'))}</i>` : ''} ${esc(c.age)} \u00b7 <span id="ttlWt">${hideWt ? '?' : c.wt}</span> ${t('kg')} \u00b7 ${esc(c.place)}</span></div>
      <button class="clock gasb" id="gasBox" data-gas hidden><small>${esc(t('gasChip'))}</small><b>pH</b></button>
      <div class="clock epi" id="epiBox" hidden><small>${esc(t('epi'))}</small><b id="epiT">0:00</b></div>
      <div class="clock"><small>${esc(t('code'))}</small><b id="clk">00:00</b></div>
      <div class="clock"><small>${esc(t('score'))}</small><b id="scr">0</b></div>
      <button class="iconbtn" data-snd aria-label="${esc(t('sound'))}">${Store.d.sound ? IC.snd : IC.mute}</button>
      <button class="iconbtn" data-tour aria-label="${esc(t('tour').aria)}" title="${esc(t('tour').aria)}">?</button>
      <button class="iconbtn" data-report aria-label="${esc(t('reportAria'))}">${IC.flag}</button>
    </div>
    <div class="mstrip" id="mstrip" aria-hidden="true">
      <div class="msv"><span style="--vc:var(--ecg)">HR<b id="sHR">--</b></span><span style="--vc:var(--spo2)">SpO\u2082<b id="sSp">--</b></span><span style="--vc:var(--bp)">NBP<b id="sBP">--</b></span><span style="--vc:var(--rr)">RR<b id="sRR">--</b></span><span style="--vc:var(--co2)">CO\u2082<b id="sCO">--</b></span></div>
      <button class="mss" id="msS" type="button" tabindex="-1"><span id="sSay"></span><span id="sDots"></span></button>
    </div></div>
    <div class="simgrid">
      <section class="bay">
        <div class="monitor imv" id="mon">
          <div class="mhd"><span class="mbed">${esc(c.field ? 'AED' : t('bedNo'))} \u00b7 ${esc(c.age)}</span><span class="malm" id="mAlm"></span>${c.field ? '' : '<span class="mtmp">T <b id="vT">--</b> \u00b0C</span>'}<button class="msil" id="mSil" type="button">${esc(t('silence'))}</button><span class="mclk" id="mClk"></span></div>
          <div class="mmain">
            <canvas id="cv"></canvas>
            <div class="nums">
              <div class="nb" id="wHR" style="--vc:var(--ecg)"><div class="nl"><span>HR</span><i id="lHR"></i></div><b id="vHR">--</b></div>
              <div class="nb" id="wSp" style="--vc:var(--spo2)"><div class="nl"><span>SpO\u2082</span><i id="lSp"></i></div><b id="vSp">--</b><span class="pr">Pulse <em id="vPR">--</em></span></div>
              <div class="nb" style="--vc:var(--rr)"><div class="nl"><span>RR</span><i id="lRR"></i></div><b id="vRR">--</b></div>
              <div class="nb co2" id="wCO" style="--vc:var(--co2)"><div class="nl"><span>EtCO\u2082</span><i>mmHg</i></div><b id="vCO">--</b></div>
            </div>
            <div class="nosignal" id="nosig"><div><b>${esc(t('noSignal'))}</b>${esc(t('attach'))}</div></div>
          </div>
          <div class="mnbp" id="wBP" style="--vc:var(--bp)" role="button" tabindex="0" aria-label="NBP Start"><span class="nl"><span>NBP</span><i id="nbpI">Auto 1 min</i></span><span class="nbpst" id="nbpSt">START</span><b id="vBP">--</b><em id="vMAP"></em></div>
        </div>
        <div class="patient">
          <div class="pt" id="pt">${patientSVG(c.kind)}</div>
          <div class="ptinfo">
            <div id="ptZone">${hideWt ? `<span class="zone" style="--zc:var(--dim)">? ${t('kg')}</span>` : `<span class="zone" style="--zc:var(--z-${z.id})">${esc(z.n)} \u00b7 ${c.wt} ${t('kg')}</span>`}</div>
            <div class="who">${esc(c.age)}</div>
            <div class="look" id="look"></div>
            <div class="flags" id="flags"></div>
          </div>
          <div class="ptacts" id="ptacts" role="group" aria-label="${esc(t('ptActsAria'))}">${ptActsHTML(c)}</div>
        </div>
      </section>
      <section class="console">
        <div class="situ" id="situ" aria-live="polite"></div>
        <div class="cart" id="cart">${cartHTML()}</div>
        <div class="peekrow">${lv >= 3 ? `<span class="muted small">${esc(t('peekOff'))}</span>` : `<button class="btn ghost" id="peek">${IC.eye} ${esc(lv === 2 ? t('peek2') : t('peek'))}</button>`}</div>
        <details class="recorder" open><summary><span>${esc(t('recorder'))}</span><span id="recN">${esc(t('events', 0))}</span></summary><ol id="recL"></ol></details>
      </section>
    </div>
  </div>`;
  S = {
    c, st: Object.assign({ monitor: false, rhythm: 'nsr', hr: 100, pulse: true, spo2: null, rr: null, bp: null, etco2: null, cpr: false, skin: 'pink', look: '', alarm: false }, c.init),
    flags: Object.assign({ pads: false, leads: false, io: false, o2: false, bvm: false, tube: false }, c.flags || {}),
    i: -1, p: null, done: new Set(), qWrong: new Set(), score: 0, max: 0, errs: [], teach: [], hints: 0, codeT: 0, lastEpi: null,
    shocks: 0, syncs: 0, adeno: 0, recs: 0, busy: true, fb: null, tab: 'mon', started: false, alarmT: 0, modal: false,
    lv, real: Store.d.real !== false, weak: new Set(), m: { recog: null, cpr0: null, shockable0: null, shock1: null, nonshock0: null, epi1: null, pauses: [], cur: 0, arrestT: 0, cprT: 0, prevT: 0, lowQ: 0 },
    ageY, hideWt, cq: { v: 17, tg: 17, fat: false, at: null, n: 0 }, dv: {}, nbp: { v: null, at: '', busy: false, t: 0, next: 0, on: false, cuff: 0, step: 0 }, htsLate: null, lim: null, silUntil: 0, dev: {}, given: {}, wBase: {}, rAcc: 0, worsening: false, nz: {}, nzT: 0, nzN: 0, dAcc: 0, alarm2: 0, smT: 0, warned: false,
    tl: { seg: [], cpr: [], ev: [], sm: [], cprOn: null }, post: null
  };
  /* Clinical/Expert realistic drawer: sometimes the prefilled epinephrine syringes have run out. */

  const tPh = c.gen === 'arrest' ? tempOf(JSON.stringify(c.phases)) : null;
  S.temp = tempOf([c.init && c.init.look, c.brief].join(' ')) ?? (tPh != null && tPh < 34 ? tPh : 36.5 + Math.floor(Math.random() * 6) / 10);
  smoothVitals(0);
  if (S.st.cpr) S.m.cpr0 = 0;
  /* age-based alarm limits shown beside each number, like a bedside monitor */
  const LIM = ageY == null || ageY >= 1 ? (ageY != null && ageY >= 12 ? { hr: [140, 50], rr: [30, 10] } : { hr: [160, 70], rr: [40, 14] }) : { hr: [200, 100], rr: [60, 20] };
  S.lim = LIM;
  $('#lHR').innerHTML = `${LIM.hr[0]}<br>${LIM.hr[1]}`; $('#lSp').innerHTML = '100<br>90'; $('#lRR').innerHTML = `${LIM.rr[0]}<br>${LIM.rr[1]}`;
  /* NBP: tap the field for a measurement now (STAT), like the Start key on the monitor */
  const nbpGo = () => { if (S && S.st.monitor && !S.nbp.busy) { Sound.ensure(); nbpStart(); } };
  $('#wBP').addEventListener('click', nbpGo);
  $('#wBP').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nbpGo(); } });
  $('#mSil').addEventListener('click', () => { if (!S) return; S.silUntil = performance.now() + 120000; Sound.click(true); updVitals(); });
  MON = new Monitor($('#cv'), { sweep: 3.5, full: true, onBeat: k => { if (!S || S.finished) return; const sp = S.dv.spo2; if (sp) { if (k === 'pleth') Sound.pulseTone(sp); } else if (k === 'qrs') Sound.qrs(); } });
  MON.set(monState()); tlTrack();
  setTab('mon'); updAll(); updScore();
  $('#situ').innerHTML = `<p class="say muted">${esc(t('readFile'))}</p>`;
  $('#cart').addEventListener('click', e => {
    const a = e.target.closest('[data-act]'); if (a) { doAction(a.dataset.act); return; }
    const bad = e.target.closest('[data-bad]'); if (bad) { realBad(bad.dataset.bad); return; }
    const amp = e.target.closest('[data-amp]'); if (amp) { routeChooser(); return; }
    const tb = e.target.closest('[data-tab]'); if (tb) setTab(tb.dataset.tab);
  });
  $('#ptacts').addEventListener('click', e => { const a = e.target.closest('[data-act]'); if (a) doAction(a.dataset.act); });
  $('#situ').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'); if (q) { answerQ(+q.dataset.q); return; }
    const pf = e.target.closest('[data-pf]'); if (pf) { postCtl(pf.dataset.pf); return; }
    if (e.target.closest('[data-ecg]')) { if (!S.modal) ecgPrint(); return; }
    if (e.target.closest('#ff')) endCycle();
  });
  if ($('#peek')) $('#peek').addEventListener('click', peek);
  $('[data-tour]').addEventListener('click', () => { if (S && S.started && !S.finished && !S.modal) tour(); });
  $('#mon').title = t('monTap');
  /* tapping the monitor prints a strip; with a pulse that is the same as asking for a 12-lead */
  $('#cv').addEventListener('click', () => { if (S && S.started && !S.finished && !S.modal && S.st.monitor) { if (S.st.pulse && S.p && !S.busy && S.p.type !== 'q' && S.p.type !== 'end') doAction('ecg12'); else ecgPrint(); } });
  $('#sBack').addEventListener('click', () => {
    if (!S.started || S.finished) { go('cases'); return; }
    const m = modal(`<div class="sheet"><h2>${esc(t('leaveQ'))}</h2><p class="muted">${esc(t('leaveSub'))}</p><div class="row"><button class="btn" data-stay>${esc(t('keepGoing'))}</button><button class="btn primary" data-leave>${esc(t('leave'))}</button></div></div>`);
    m.el.addEventListener('click', e => { if (e.target.closest('[data-leave]')) go('cases'); else if (e.target.closest('[data-stay]')) m.close(); });
  });
  const iv = setInterval(tick, 100);
  document.addEventListener('keydown', simKey);
  cleanups.push(() => { clearInterval(iv); document.removeEventListener('keydown', simKey); if (MON) MON.destroy(); MON = null; S = null; });
  showBrief();
}
/* Keyboard: C compressions, B bag-mask, P pulse check, H head-tilt; Q W E R open the defibrillator and drawers 1-3, 1-9 and 0 (Shift+1-9 beyond ten) press cart buttons or answer, Space skips a finished cycle, Esc cancels a dialog. */
function simKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || (e.target.closest && e.target.closest('input, textarea'))) return;
  const dm = /^(Digit|Numpad)(\d)$/.exec(e.code), d = dm ? +dm[2] : null;
  const idx = d === null ? -1 : e.shiftKey ? (d ? 9 + d : -1) : (d === 0 ? 9 : d - 1);
  const top = [...MODALS].pop();
  if (top) {
    if (e.key === 'Escape') { const x = top.el.querySelector('[data-x], [data-stay]'); if (x) x.click(); }
    else if (idx >= 0) { const b = top.el.querySelectorAll('.opt')[idx]; if (b) { e.preventDefault(); b.click(); } }
    return;
  }
  if (!S || !S.started || S.finished || !S.p) return;
  if (S.p.type === 'q') { if (idx >= 0) { const b = $$('#situ .opt')[idx]; if (b) { e.preventDefault(); b.click(); } } return; }
  const pk = Object.keys(PT_KEYS).find(k => 'Key' + PT_KEYS[k] === e.code);
  if (pk) { const b = $(`#ptacts [data-act="${pk}"]`); if (b) { e.preventDefault(); b.click(); } return; }
  const ti = ['KeyQ', 'KeyW', 'KeyE', 'KeyR'].indexOf(e.code);
  if (ti >= 0) { setTab(['mon', 'drug', 'line', 'air'][ti]); return; }
  if (idx >= 0) { const b = $$('#grid [data-act], #grid [data-bad], #grid [data-amp]')[idx]; if (b) { e.preventDefault(); b.click(); } return; }
  if (e.code === 'Space') { const ff = $('#ff'); if (ff) { e.preventDefault(); ff.click(); } }
}
const respP = () => S.post ? 60 / S.post.rate : S.st.rr > 0 ? 60 / S.st.rr : (S.flags.bvm || S.flags.tube) ? ventP() : null;
const tempOf = s => { const m = /(\d\d(?:\.\d)?) ?\u00b0C/.exec(String(s || '')); return m ? +m[1] : null; };
/* How well the fingertip is perfused (0.3 to 1): sets the height of the pleth wave. Falls with the pressure and with cold, mottled skin. */
function perfK() {
  const st = S.st, bp = parseBP(st.bp), lo = sbpLow(S.ageY); let k = 1;
  if (bp) k = Math.max(0.3, Math.min(1, (bp[0] - (lo - 22)) / 26));
  if (st.skin === 'mottled' || st.skin === 'grey') k = Math.min(k, 0.45); else if (st.skin === 'pale') k = Math.min(k, 0.75);
  return k;
}
/* What the child looks like, read from the appearance line: eyes, work of breathing, gasps, and what the chest sounds like. */
const LOOK_RE = {
  not: /no (stridor|wheez\w*)|\u05d0\u05d9\u05df (\u05e1\u05d8\u05e8\u05d9\u05d3\u05d5\u05e8|\u05e6\u05e4\u05e6\u05d5\u05e4\u05d9\u05dd)/gi,
  shut: /unresponsive|limp|floppy|letharg|sedated|slumped|pain only|only to pain|not breathing|collapsed|barely respon|breathing pause|\u05dc\u05d0 \u05de\u05d2\u05d9\u05d1|\u05e8\u05e4\u05d5\u05d9|\u05dc\u05ea\u05e8\u05d2\u05d9|\u05de\u05d5\u05e8\u05d3\u05de|\u05e6\u05e0\u05d5\u05d7|\u05dc\u05db\u05d0\u05d1|\u05dc\u05d0 \u05e0\u05d5\u05e9|\u05e9\u05e8\u05d5\u05e2|\u05d1\u05e7\u05d5\u05e9\u05d9 \u05de\u05d2\u05d9\u05d1|\u05d4\u05e4\u05e1\u05e7\u05ea \u05e0\u05e9\u05d9\u05de\u05d4|\u05dc\u05dc\u05d0 \u05ea\u05d2\u05d5\u05d1\u05d4/i,
  half: /drowsy|sleepy|confused|tired|moaning|groaning|waking|\u05d9\u05e9\u05e0\u05d5\u05e0|\u05de\u05d1\u05d5\u05dc\u05d1\u05dc|\u05e2\u05d9\u05d9\u05e4|\u05d2\u05d5\u05e0\u05d7|\u05de\u05ea\u05e2\u05d5\u05e8\u05e8/i,
  wob: /grunt|retraction|stridor|wheez|tripod|flaring|\u05d0\u05e0\u05e7\u05d4|\u05e0\u05e1\u05d9\u05d2\u05d5\u05ea|\u05e1\u05d8\u05e8\u05d9\u05d3\u05d5\u05e8|\u05e6\u05e4\u05e6\u05d5\u05e4|\u05d7\u05e6\u05d5\u05d1\u05d4|\u05db\u05e0\u05e4\u05d9 \u05d4\u05d0\u05e3/i,
  gasp: /gasp|\u05d2\u05e1\u05d9\u05e1\u05d4/i, stridor: /stridor|\u05e1\u05d8\u05e8\u05d9\u05d3\u05d5\u05e8/i, wheeze: /wheez|\u05e6\u05e4\u05e6\u05d5\u05e4/i, crackle: /grunt|crackle|\u05d0\u05e0\u05e7\u05d4|\u05d7\u05e8\u05d7\u05d5\u05e8/i, grunt: /grunt|\u05d0\u05e0\u05e7\u05d4/i, silent: /silent chest|\u05d7\u05d6\u05d4 \u05db\u05de\u05e2\u05d8 \u05e9\u05e7\u05d8/i
};
const lookTxt = () => String(S.st.look || '').replace(LOOK_RE.not, '');
function chestSound() {
  const st = S.st, f = S.flags, lk = lookTxt(), bag = f.bvm || f.tube;
  if (!(st.rr > 0 && st.pulse) && !bag) return;
  const k = {}; ['stridor', 'wheeze', 'crackle', 'grunt', 'silent'].forEach(n => { k[n] = LOOK_RE[n].test(lk); });
  if (f.tube) k.stridor = k.grunt = false;
  Sound.breath(k, Math.max(1.1, Math.min(3, st.rr > 0 ? 60 / st.rr : 2.5)));
}
const monState = () => ({ monitor: S.st.monitor, rhythm: S.st.rhythm, hr: S.st.hr, pulse: S.st.pulse, cpr: S.st.cpr, perf: S.perf ?? perfK(), vfa: S.vfa ?? 1, co2: capOn() ? (S.dv.co2 ?? co2Val()) : null, vent: ventP(), tube: S.flags.tube, rp: respP() });
function applySt(o) {
  if (!S.worsening && S.wBase) { if (o.spo2 != null) delete S.wBase.spo2; if (o.skin) delete S.wBase.skin; }
  if (o.look) { const tv = tempOf(o.look); if (tv != null) S.temp = tv; }
  Object.assign(S.st, o); if (S.st.cpr && S.m.cpr0 === null) S.m.cpr0 = S.codeT; MON.set(monState()); tlTrack(); updAll(); }
/* Capnography: in-line on the bag or the tube, or whenever the case reports an EtCO2. */
const capOn = () => !!(S && (S.flags.tube || S.flags.bvm || S.st.etco2 != null || S.post));
function co2Val() {
  const st = S.st;
  if (st.etco2 != null) return st.etco2;
  /* the heart is beating again under the compressions: EtCO2 jumps before anyone has felt a pulse */
  if (S.roscHold && st.cpr) return 42;
  if (st.pulse) return 38;
  return st.cpr ? S.cq.v : 4;
}
function ventP() {
  const st = S.st, k = S.c.kind;
  if (S.post) return 60 / S.post.rate;
  if (st.cpr) return S.flags.tube ? (k === 'teen' ? 3 : 2.5) : 9;
  if (S.flags.tube || (S.flags.bvm && !(st.rr > 0))) return 60 / (k === 'infant' ? 30 : k === 'teen' ? 16 : 22);
  return 60 / Math.max(10, st.rr || 20);
}
const parseBP = b => { const m = /^(\d+)\/(\d+)/.exec(String(b || '')); return m ? [+m[1], +m[2]] : null; };
const sbpLow = y => y == null ? 70 : y < 1 / 12 ? 60 : y < 1 ? 70 : y <= 10 ? 70 + 2 * Math.floor(y) : 90;
/* Age in years: generated cases carry it; fixed cases are parsed from the English age text. */
function ageYears(c) {
  if (c.ageY != null) return c.ageY;
  const e = D_EN.CASES.find(x => x.id === c.id), s = (e && e.age) || '';
  let m = /(\d+)-month/.exec(s); if (m) return +m[1] / 12;
  m = /(\d+)-week/.exec(s); if (m) return +m[1] / 52;
  m = /(\d+)-year/.exec(s); if (m) return +m[1];
  return null;
}
/* Weight from age (APLS): infants months/2 + 4, 1-5 y 2 x age + 8, 6 y and older 3 x age + 7. */
const estWt = y => y < 1 ? Math.round(y * 12) / 2 + 4 : y <= 5 ? 2 * Math.round(y) + 8 : 3 * Math.round(y) + 7;
const roundWt = w => w < 10 ? Math.round(w * 2) / 2 : Math.round(w);
const POST_IDS = ['crib', 'pitch', 'teen', 'winter', 'storm', 'squeeze'];
/* ---------------- unpredictable course, complications, wrap-up ---------------- */
const DISPO = {'slow': 'picu', 'block': 'picu', 'apnea': 'picu', 'tube': 'picu', 'svt': 'ward', 'recess': 'picu', 'teen': 'picu', 'fever': 'home', 'peanut': 'ward', 'sepsis': 'picu', 'crash': 'picu', 'tummy': 'ward', 'heart': 'picu', 'dka': 'picu', 'bike': 'picu', 'pills': 'ward', 'croup': 'ward', 'wheeze': 'picu', 'lungs': 'picu', 'sugar': 'ward', 'head': 'picu'};
const TREAT_IDS = ['o2', 'bvm', 'airway', 'vagal', 'adenosine', 'sync', 'shock', 'pace', 'cpr', 'epi', 'epiim', 'atropine', 'amio', 'lido', 'procain', 'naloxone', 'dextrose', 'mag', 'abx', 'dexa', 'antihist', 'fluid', 'vaso', 'albuterol', 'nebepi', 'needle'];
const NO_COMP = ['tube', 'squeeze'];
/* What the scripted case looks like just before each step (pulse, rhythm, what is in place), assuming every needed action is done. */
function simPhases(c) {
  const st = Object.assign({ pulse: true, cpr: false, rhythm: 'nsr' }, c.init), fl = Object.assign({}, c.flags), out = [];
  c.phases.forEach(p => {
    out.push({ pulse: st.pulse, cpr: st.cpr, rhythm: st.rhythm, io: !!fl.io, bvm: !!fl.bvm, tube: !!fl.tube });
    if (p.set) Object.assign(st, p.set);
    if (p.type === 'cycle' && (!p.set || p.set.cpr === undefined)) st.cpr = true;
    (p.need || []).flat().forEach(a => { if (a === 'ivio') fl.io = true; if (a === 'bvm') fl.bvm = true; if (a === 'airway') fl.tube = true; if (a === 'cpr') st.cpr = true; if (a === 'rhythm') st.cpr = false; });
    if (p.after) Object.assign(st, p.after);
  });
  return out;
}
const COMP = {
  vomit: T => [{ tw: true, k: T.vomK, say: T.vomSay, cond: () => S.flags.bvm && !S.flags.tube, dip: 8, need: ['suction'], ok: ['position'], why: { airway: T.vomWhyTube }, msg: T.vomMsg, teach: T.vomTeach, t: 10 }],
  io: T => [{ tw: true, k: T.ioK, say: T.ioSay, cond: () => S.flags.io, flag: { io: false }, need: ['ivio'], msg: T.ioMsg, teach: T.ioTeach, t: 14 }],
  tube: T => [
    { tw: true, k: T.tubeK, say: T.tubeSay, cond: () => S.flags.tube && (S.twTube = true), flag: { tube: false, bvm: false }, dip: 14, need: ['bvm'], why: { airway: T.tubeWhyAw }, msg: T.tubeMsg, teach: T.tubeTeach, t: 10 },
    { tw: true, k: T.tubeK2, say: T.tubeSay2, cond: () => !!S.twTube, need: ['airway'], msg: T.tubeMsg2, t: 16 }]
};
const vitTxt = (s, W) => W.hV(s.hr || '--', s.spo2 || '--', s.bp || '--');
function handoverOpts(p) {
  const W = t('tw').wrap, c = S.c, st = S.st, did = [...(S.did || [])].filter(a => TREAT_IDS.includes(a)).slice(0, 7).map(a => actName(a));
  const fake = actName(['amio', 'atropine', 'naloxone', 'adenosine', 'abx', 'dexa'].find(a => !(S.did || new Set()).has(a)) || 'lido');
  const now = vitTxt(st, W); let old = vitTxt(c.init || {}, W);
  if (old === now) old = vitTxt({ hr: (st.hr || 100) + 45, spo2: Math.max(70, (st.spo2 || 96) - 9), bp: st.bp }, W);
  const line = (list, vit) => W.hLine(c.age, c.wt, list.length ? list.join(', ') : W.hNone, vit);
  p.opts = [{ t: line(did, now), ok: true }, { t: line(did.concat(fake), now), why: W.hWhyDrug(fake) }, { t: line(did, old), why: W.hWhyOld }];
}
/* Rewrites the step list for this run: treatments that need repeating, one complication, and the wrap-up steps.
   window.__twist = { all: true, comp: 'vomit' | 'io' | 'tube' } forces them (tests). */
function plotTwists(c, lv) {
  const T = t('tw'), F = window.__twist || {}, on = F.all || (Store.d.course !== false && lv >= 2), R = n => F.all || Math.random() < n;
  const P = c.phases, flat = p => (p.need || []).flat(), mk = o => Object.assign({ tw: true, need: [] }, o);
  if (on && !c.field && !c.gen) {
    /* the arrest rhythm that will not give up: one or two more rounds before ROSC */
    const sim = simPhases(c);
    const r = P.findIndex((p, i) => i > 0 && p.set && p.set.cpr === false && p.after && p.after.pulse === true && flat(p).includes('check') && !sim[i].pulse && P[i - 1].type === 'cycle');
    if (r > 0 && T.still[sim[r].rhythm]) {
      const rh = sim[r].rhythm, shk = ['vf', 'vt', 'torsades'].includes(rh), n = F.all ? 2 : Math.random() < 0.45 ? 1 : Math.random() < 0.3 ? 2 : 0, add = [];
      for (let k = 0; k < n; k++) {
        add.push(mk({ k: T.chkK, say: T.chkSay, need: ['rhythm'], msg: T.still[rh], hm: true, t: 8 }));
        add.push(shk ? mk({ k: T.shkK, say: T.still[rh], hs: true, need: ['shock'], why: { epi: T.shkWhyEpi, sync: '!' + T.shkWhySync }, msg: T.shkMsg, after: { cpr: true }, t: 12 })
          : mk({ k: T.cprK, say: T.still[rh], hs: true, need: ['cpr'], why: { shock: '!' + T.nonWhyShock }, msg: T.cprMsg, t: 8 }));
        add.push(mk({ type: 'cycle', k: T.cycK, say: T.cycSay, dur: 14, need: ['epi'], ok: ['airway', 'hts', 'ivio', 'bvm', 'glucose'], why: shk ? {} : { shock: '!' + T.nonWhyShock }, teach: T.cycTeach }));
      }
      P.splice(r, 0, ...add);
    }
    /* SVT that adenosine does not hold: the infant tires and needs cardioversion */
    if (c.id === 'svt' && R(0.4)) {
      const a = P.findIndex(p => flat(p).includes('adenosine') && p.after && p.after.rhythm);
      if (a > 0) {
        const o = P[a];
        P[a] = Object.assign({}, o, { msg: T.svtFail, hm: false, tw: true, after: undefined });
        const add = mk({ k: T.svtK, say: T.svtSay, set: { bp: '56/34', skin: 'mottled', look: T.svtLook, spo2: 91 }, need: ['sync'], ok: ['o2'], why: { adenosine: T.svtWhyAdeno, vagal: T.svtWhyAdeno, shock: '!' + T.svtWhyShock, amio: T.svtWhyAmio }, msg: T.svtMsg, after: Object.assign({}, o.after, { bp: '82/50', skin: 'pink', spo2: 98 }), teach: T.svtTeach, t: 16 });
        if (P[a + 1] && P[a + 1].type === 'q') P.splice(a + 1, 1, add); else P.splice(a + 1, 0, add);
      }
    }
    /* shock that needs one more bolus */
    if (['sepsis', 'tummy'].includes(c.id) && R(0.5)) {
      const b = P.findIndex(p => (p.type || 'act') === 'act' && flat(p).includes('fluid'));
      if (b >= 0) P.splice(b + 1, 0, mk({ k: T.fluK, say: T.fluSay, need: ['fluid'], ok: ['glucose', 'abx', 'auscult'], why: { vaso: T.fluWhyVaso }, msg: T.fluMsg, teach: T.fluTeach, t: 16 }));
    }
    /* one complication in about half the runs */
    if (!NO_COMP.includes(c.id) && R(0.5)) {
      const s2 = simPhases(c), first = a => P.findIndex(p => flat(p).includes(a)), fb = first('bvm'), fi = first('ivio'), ft = first('airway'), cand = { vomit: [], io: [], tube: [] };
      for (let j = 1; j < P.length; j++) {
        const p = P[j], q = P[j - 1];
        if (p.tw || q.tw || !['act', 'cycle'].includes(p.type || 'act') || p.set || q.type === 'q' || q.flash || flat(p).some(a => ['shock', 'sync', 'cpr', 'check', 'rhythm', 'adenosine'].includes(a))) continue;
        if (fb >= 0 && j > fb && s2[j].bvm && !s2[j].tube) cand.vomit.push(j);
        if (fi >= 0 && j > fi + 1 && s2[j].io) cand.io.push(j);
        if (ft >= 0 && j > ft && s2[j].tube) cand.tube.push(j);
      }
      const kinds = Object.keys(cand).filter(k => cand[k].length && (!F.comp || F.comp === k));
      if (kinds.length) { const k = pick(kinds), j = pick(cand[k]); P.splice(j, 0, ...COMP[k](T)); }
    }
  }
  /* hospital cases that do not end in an arrest finish with a reassessment, a destination and a handover */
  if (!c.field && !c.gen && DISPO[c.id] && !P.some(p => p.type === 'post')) {
    const e = P.findIndex(p => p.type === 'end'), W = T.wrap, d = DISPO[c.id], X = (t('extra') || {})[c.id] || {};
    P.splice(e < 0 ? P.length : e, 0,
      mk({ k: W.reK, say: W.reSay, need: [['check', 'auscult', 'resp'], 'labs'], build: p => { const st = S.st; p.msg = W.reMsg({ hr: st.hr || '--', sp: st.spo2 || '--', bp: st.bp || '--', rr: st.rr || '--' }); }, teach: W.reTeach, t: 20 }),
      mk({ type: 'q', k: W.dK, say: W.dSay, q: W.dQ, opts: ['picu', 'ward', 'home'].map(k => k === d ? { t: W.d[k], ok: true } : { t: W.d[k], why: W.dWhy[d][k] }), teach: W.dTeach }),
      mk({ type: 'q', k: W.hK, say: W.hSay, q: W.hQ, opts: [], build: handoverOpts, teach: W.hTeach }));
  }
}
/* Bloods: the blood gas (a point-of-care analyzer next door) is back in about half a minute and prints like the real
   one; the rest of the labs take a couple of minutes, often only after the case is over (then they are in the debrief). */
const GAS_RE = [['ph', /^pH\s+([\d.]+)/], ['pco2', /^pCO\u2082\s+([\d.]+)/], ['po2', /^pO\u2082\s+([\d.]+)/], ['hco3', /^HCO\u2083\s+([\d.]+)/], ['lac', /^lactate\s+([\d.]+)/i], ['glu', /^glucose\s+>?\s*([\d.]+)/i], ['na', /^Na\s+([\d.]+)/], ['k', /^K\s+([\d.]+)/], ['hb', /^Hb\s+([\d.]+)/]];
const gasItems = lang => { const x = (((I18N[lang] || {}).extra || {})[S.c.id] || {}).labs; return x ? x.split(' \u00b7 ') : []; };
const sev = P => 1 / (1 + 23400 / (P * P * P + 150 * P));
function gasOf() {
  const st = S.st, f = S.flags, did = S.did || new Set(), v = {}, R = Math.random, vent = f.bvm || f.tube;
  gasItems('en').forEach(x => { for (const [k, re] of GAS_RE) { const m = re.exec(x); if (m) { v[k] = parseFloat(m[1]); break; } } });
  const arr = !st.pulse || S.m.arrestT > 0, poor = ['mottled', 'grey'].includes(st.skin);
  let ph = v.ph ?? (arr ? 7.05 : poor ? 7.27 : 7.38), pco2 = v.pco2 ?? (v.hco3 != null ? 1.5 * v.hco3 + 8 : arr ? 55 : poor ? 31 : 39);
  const hco3 = v.hco3 ?? 0.0307 * pco2 * Math.pow(10, ph - 6.1);
  /* what was already done changes the sample: ventilation clears CO2, dextrose and fluids work */
  if (vent && st.pulse && pco2 > 50 && did.has(f.tube ? 'airway' : 'bvm')) { pco2 = 45 + (pco2 - 45) * 0.35; ph = 6.1 + Math.log10(hco3 / (0.0307 * pco2)); }
  let glu = v.glu ?? 95 + R() * 20, lac = v.lac ?? (arr ? 8 : poor ? 4.2 : 1.2);
  if (did.has('dextrose') && glu < 70) glu = 105 + R() * 30;
  if (did.has('fluid')) lac *= 0.75;
  const sat = st.pulse ? (S.dv.spo2 ?? st.spo2 ?? 96) : null;
  let po2 = v.po2;
  if (po2 == null) {
    if (sat == null) po2 = vent ? 55 + R() * 30 : 28 + R() * 12;
    else if (sat >= 97 && (f.o2 || vent)) po2 = 110 + R() * (vent ? 220 : 120);
    else { let a = 5, b = 700; for (let n = 0; n < 40; n++) { const m = (a + b) / 2; if (sev(m) * 100 < sat) a = m; else b = m; } po2 = a; }
  }
  const so2 = Math.min(99.6, sev(po2) * 100), cohb = 0.5 + R() * 0.6, methb = 0.3 + R() * 0.5, fo2hb = so2 * (100 - cohb - methb) / 100;
  const hb = v.hb ?? 11.5 + R() * 2, na = v.na ?? 137 + R() * 3, k = v.k ?? 3.9 + R() * 0.5, ca = 1.14 + R() * 0.14;
  const gap = 12 + (glu > 250 && hco3 < 18 ? 24 - hco3 : Math.max(0, lac - 1)), d = new Date(), z = n => String(n).padStart(2, '0');
  ph += (R() - 0.5) * 0.008;
  return { ph, pco2, po2, hco3, beB: 0.93 * (hco3 - 24.4 + 14.8 * (ph - 7.4)), beE: hco3 - 24.8 + 16.2 * (ph - 7.4), hct: hb * 2.94, hb, so2, fo2hb, cohb, methb, fhhb: 100 - fo2hb - cohb - methb,
    na, k, ca, cl: na + k - hco3 - gap, gap, glu, lac, date: `${z(d.getDate())} . ${z(d.getMonth() + 1)} . ${d.getFullYear()}`, time: `${z(d.getHours())}:${z(d.getMinutes())}`,
    pt: (!S.c.gen && (D_EN.CASES.find(x => x.id === S.c.id) || {}).age) || '', wt: S.c.wt };
}
function gasPrint() {
  const g = S && S.gas; if (!g) return;
  const row = (n, x, dp, u, r) => `<div class="gr"><span>${n}</span><b>${x.toFixed(dp)}<i>${r ? (x < r[0] ? '\u2193' : x > r[1] ? '\u2191' : '') : ''}</i></b><em>${u}</em></div>`;
  const m = modal(`<div class="sheet gasp" role="dialog" aria-modal="true"><div class="paper" dir="ltr" lang="en">
    <div class="gh"><b>ARTERIAL SAMPLE</b><span>${g.date}</span><span>${g.time}</span><span>System Name</span><span>RESUS BAY</span><span>Patient</span><span>${esc(g.pt)}${g.pt ? ' \u00b7 ' : ''}${g.wt} kg</span></div>
    <h4>ACID/BASE 37.0 \u00b0C</h4>${row('pH', g.ph, 3, '', [7.35, 7.45])}${row('pCO\u2082', g.pco2, 1, 'mmHg', [35, 45])}${row('pO\u2082', g.po2, 1, 'mmHg', [80, 108])}${row('HCO\u2083\u207b act', g.hco3, 1, 'mmol/L', [22, 26])}${row('BE(B)', g.beB, 1, 'mmol/L', [-2, 2])}${row('BE(ecf)', g.beE, 1, 'mmol/L', [-2, 2])}
    <h4>CO-OXIMETRY</h4>${row('Hct', g.hct, 0, '%', [33, 43])}${row('tHb', g.hb, 1, 'g/dL', [11, 14.5])}${row('sO\u2082', g.so2, 1, '%', [95, 100])}${row('FO\u2082Hb', g.fo2hb, 1, '%', [94, 99])}${row('FCOHb', g.cohb, 1, '%', [0, 1.5])}${row('FMetHb', g.methb, 1, '%', [0, 1.5])}${row('FHHb', g.fhhb, 1, '%', [0, 5])}
    <h4>ELECTROLYTES</h4>${row('Na\u207a', g.na, 1, 'mmol/L', [135, 145])}${row('K\u207a', g.k, 2, 'mmol/L', [3.5, 5])}${row('Ca\u207a\u207a', g.ca, 2, 'mmol/L', [1.12, 1.32])}${row('Cl\u207b', g.cl, 0, 'mmol/L', [98, 107])}${row('AnGap', g.gap, 1, 'mmol/L', [8, 16])}
    <h4>METABOLITES</h4>${row('Glu', g.glu, 0, 'mg/dL', [70, 140])}${row('Lac', g.lac, 2, 'mmol/L', [0.5, 2])}
    <div class="gf">\u2191, \u2193 \u2013 Out of range</div></div>
    <div class="row"><button class="btn" data-x>${esc(t('tut').close)}</button></div></div>`);
  m.el.addEventListener('click', e => { if (e.target.closest('[data-x]') || e.target === m.el) m.close(); });
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-gas]')) gasPrint();
  else if (e.target.closest('[data-gasdb]') && S) { if (!S.gas) S.gas = gasOf(); gasPrint(); }
});
/* the labs other than the gas (blood count, chemistry, markers), in the current language */
function otherLabs() {
  const en = gasItems('en'), loc = gasItems(LANG), same = en.length === loc.length;
  const rest = en.map((x, i) => GAS_RE.some(([, re]) => re.test(x)) ? null : (same ? loc[i] : x)).filter(Boolean);
  return rest.length ? rest.join(' \u00b7 ') : t('labsNone');
}
function labsSend(quiet) {
  if (S.labsSent) { if (!quiet) { if (S.gas) gasPrint(); else { S.fb = { t: 'note', h: t('fbAlready'), m: t('labsWait') }; renderSitu(); } } return; }
  const s0 = S, g = gasOf(); S.labsSent = true;
  if (!quiet) { rec(actName('labs'), 'ok'); tlEv('labs', actName('labs')); Sound.click(true); S.fb = { t: 'note', h: t('fbFine'), m: t('labsSentM') }; renderSitu(); }
  setTimeout(() => {
    if (S !== s0 || S.finished) return;
    S.gas = g; rec(`${t('gasH')}: pH ${g.ph.toFixed(2)} \u00b7 pCO\u2082 ${Math.round(g.pco2)} \u00b7 HCO\u2083 ${g.hco3.toFixed(1)} \u00b7 Lac ${g.lac.toFixed(1)}`, 'ok'); toast(t('gasBackT'));
    const b = $('#gasBox'); if (b) b.hidden = false;
    if (!S.busy && !S.modal) { S.fb = { t: 'note', h: t('gasH'), m: t('gasBackM'), gas: true }; renderSitu(); }
  }, window.__fastEnd ? 800 : 30000);
  setTimeout(() => {
    if (S !== s0 || S.finished) return;
    S.labsBack = true; const o = otherLabs(); rec(`${t('labsH')}: ${o}`, 'ok'); toast(t('labsBackT'));
    if (!S.busy && !S.modal) { S.fb = { t: 'note', h: t('labsH'), m: o }; renderSitu(); }
  }, window.__fastEnd ? 1500 : 120000);
}
function setTab(tab) {
  S.tab = tab;
  $$('#cart [data-tab]').forEach(b => { const on = b.dataset.tab === tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  const g = D.GROUPS.find(x => x.id === tab);
  $('#tray').className = 'tray t-' + tab;
  $('#trayHd').textContent = g ? g.full : '';
  if (S.real && REAL_ITEMS[tab]) { $('#grid').innerHTML = realItemsHTML(tab); $('#grid').className = 'ritems'; updAvail(); return; }
  $('#grid').className = 'cartgrid';
  $('#grid').innerHTML = D.ACTIONS.filter(a => a.g === tab).map((a, i) => `<button class="cbtn${a.g === 'drug' ? ' drug' : ''} a-${a.id}" data-act="${a.id}"${a.g === 'drug' ? ` style="--lc:${DRUG_COL[a.id] || '#f2f2f2'}"` : ''}><span class="ai">${actIcon(a)}</span><span class="at"><b>${esc(a.n)}</b><small>${esc(a.s)}</small></span>${kbd(keyLabel(i))}</button>`).join('');
  updAvail();
}
function updAll() { updVitals(); updPatient(); }
/* What cannot be used right now is greyed out (it still answers a tap with the reason):
   bystander cases have only hands until the AED arrives; shock, sync, pace and analysis need pads (analysis also
   works on monitor leads with a pulse); IV drugs need IV/IO access. */
function unavail(id) {
  if (!S || !id) return null;
  if (S.c.field) {
    const A = D.ACTIONS.find(a => a.id === id);
    if (['pads', 'rhythm', 'shock'].includes(id)) { if (!aedHere()) return 'field'; }
    else if (id === 'bvm' || (A && A.g !== 'bed')) return 'field';
  }
  if (D.NEEDS_PADS.includes(id) && !S.flags.pads && !(id === 'rhythm' && S.flags.leads && S.st.pulse)) return 'pads';
  if (D.NEEDS_IO.includes(id) && !S.flags.io) return 'io';
  return null;
}
function updAvail() {
  if (!S) return;
  $$('.sim [data-act], .sim [data-amp]').forEach(b => { const na = !!unavail(b.dataset.act || b.dataset.amp); b.classList.toggle('na', na); if (na) b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
}
/* The call button: the code team in hospital, EMS (and the AED) out of hospital. */
const actLabel = (a, c) => a.id !== 'ems' || !c ? a : Object.assign({}, a, c.field ? { n: t('emsFieldN'), s: t('emsFieldS') } : { n: t('emsHospN'), s: t('emsHospS') });
/* Numbers on the monitor move toward their targets over a few seconds instead of jumping (S.dv = displayed). */
function vitTargets() {
  const st = S.st, bp = parseBP(st.bp);
  /* good compressions give a (low) SpO2 reading; how low depends on the ventilation and oxygen being given */
  const f = S.flags, cprSp = !st.pulse && st.cpr && st.monitor && !S.cq.fat ? (f.tube ? 82 : f.bvm ? 76 : f.o2 ? 64 : 50) : null;
  return { hr: st.pulse ? st.hr : null, spo2: st.pulse && st.spo2 ? st.spo2 : cprSp, sbp: st.pulse && bp ? bp[0] : null, dbp: st.pulse && bp ? bp[1] : null, rr: st.rr != null && !st.cpr ? st.rr : null, co2: capOn() ? co2Val() : null };
}
function smoothVitals(dt) {
  const T = vitTargets(), dv = S.dv, TAU = { hr: 3.5, spo2: 5, sbp: 6, dbp: 6, rr: 4, co2: 3 };
  for (const k in T) {
    const tg = T[k];
    if (tg == null) { dv[k] = null; continue; }
    /* SpO2 that comes back (ROSC, good CPR) starts low and climbs; the very first reading is the real value */
    if (dv[k] == null) { dv[k] = k === 'spo2' && S.spoSeen ? Math.min(tg, 45) : tg; if (k === 'spo2') S.spoSeen = true; continue; }
    dv[k] += (tg - dv[k]) * Math.min(1, dt / TAU[k]);
    if (Math.abs(tg - dv[k]) < 0.3) dv[k] = tg;
  }
}
/* Natural variation around the target: a slow, mean-reverting random walk per number. Regular tachycardias
   (SVT, VT, paced, flutter) barely vary; NIBP updates less often, like a cuff cycling. */
function wiggle(dt) {
  S.nzT += dt; if (S.nzT < 1) return;
  S.nzT = 0; S.nzN++;
  const st = S.st, fixed = ['svt', 'vt', 'paced', 'aflutter'].includes(st.rhythm);
  const AMP = { hr: fixed ? 1 : Math.max(2, (st.hr || 100) * 0.03), spo2: 1.3, sbp: 4, dbp: 3, rr: 1.5, co2: 1.5 };
  for (const k in AMP) {
    if ((k === 'sbp' || k === 'dbp') && S.nzN % 4) continue;
    const a = AMP[k], v = S.nz[k] || 0;
    S.nz[k] = Math.max(-a, Math.min(a, v * 0.6 + (Math.random() - 0.5) * a * 1.8));
  }
}
/* What the monitor shows for a vital right now (smoothed value plus natural variation). */
const shownV = k => { const v = S.dv[k]; if (v == null) return null; const x = Math.round(v + (v > 5 ? S.nz[k] || 0 : 0)); return k === 'spo2' ? Math.min(100, x) : x; };
function updVitals() {
  const st = S.st, on = st.monitor, dv = S.dv, shown = shownV;
  $('#nosig').hidden = on;
  $('#mon').classList.toggle('alarm', on && !st.pulse);
  $('#mon').classList.toggle('capno', on && capOn());
  let hr = '--';
  if (on) hr = (st.rhythm === 'vf' || st.rhythm === 'torsades') ? '---' : st.rhythm === 'asystole' ? '0' : String(shown('hr') ?? st.hr);
  $('#vHR').textContent = hr;
  /* phone strip mirrors the monitor numbers */
  const sv = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  sv('sHR', hr); sv('sSp', on && dv.spo2 != null ? Math.min(100, shown('spo2')) : '--');
  const nb = S.nbp, nv = on && nb.v && nb.v !== 'fail' ? nb.v : null;
  const bpTxt = !on ? '--' : nb.busy ? String(nb.cuff) : nv ? `${nv.s}/${nv.d}` : nb.v === 'fail' ? '-?-' : '--';
  sv('sBP', bpTxt); sv('sRR', on && dv.rr != null ? shown('rr') : '--'); sv('sCO', on && dv.co2 != null ? shown('co2') : '--');
  $('#vSp').textContent = on && dv.spo2 != null ? Math.min(100, shown('spo2')) : '--';
  $('#vBP').textContent = bpTxt;
  const wbp = $('#wBP');
  if (wbp) {
    wbp.classList.toggle('meas', on && nb.busy);
    $('#nbpI').textContent = !on ? 'Auto 1 min' : nb.busy ? (nb.t < NBP_INF ? 'Inflating' : 'Measuring') : nb.v === 'fail' ? 'Measurement failed' : nb.at ? `Auto 1 min \u00b7 ${nb.at}` : 'Auto 1 min';
    $('#nbpSt').textContent = nb.busy ? 'CUFF' : 'START';
  }
  $('#vRR').textContent = on && dv.rr != null ? shown('rr') : '--';
  const vt = $('#vT'); if (vt) vt.textContent = on && S.temp != null ? S.temp.toFixed(1) : '--';
  $('#vCO').textContent = on && dv.co2 != null ? shown('co2') : '--';
  const pr = $('#vPR'); if (pr) pr.textContent = on && dv.spo2 != null && dv.hr != null ? shown('hr') : '--';
  const mp = $('#vMAP'); if (mp) mp.textContent = nv && !nb.busy ? `(${Math.round((nv.s + 2 * nv.d) / 3)})` : '';
  /* alarm banner: red *** for life-threatening, yellow ** for the rest; silencing mutes the sound, not the message */
  const al = $('#mAlm');
  if (al) {
    let msg = '', lvl = '';
    if (on && !st.pulse) { lvl = 'hi'; msg = '*** Alarm'; }
    else if (on) {
      const hr = shown('hr'), sp = shown('spo2'), sb = nv ? nv.s : null, lim = S.lim;
      /* limit alarms only: the learner interprets the rhythm (no "brady", "asystole" or similar labels) */
      if (sp != null && sp < 85) { lvl = 'hi'; msg = '*** SpO\u2082 Low'; }
      else if (sp != null && sp < 90) { lvl = 'med'; msg = '** SpO\u2082 Low'; }
      else if (sb != null && sb < sbpLow(S.ageY)) { lvl = 'med'; msg = '** NBP Sys Low'; }
      else if (hr != null && lim && hr > lim.hr[0]) { lvl = 'med'; msg = '** HR High'; }
      else if (hr != null && lim && hr < lim.hr[1]) { lvl = 'med'; msg = '** HR Low'; }
    }
    const sil = S.silUntil && performance.now() < S.silUntil;
    al.textContent = msg; al.className = 'malm' + (lvl ? ' ' + lvl : '') + (sil && msg ? ' sil' : '');
    const sb = $('#mSil'); if (sb) sb.classList.toggle('on', !!sil);
  }
}
function updPatient() {
  const st = S.st, f = S.flags, pt = $('#pt');
  const sk = SKIN[st.skin] || SKIN.pink;
  pt.style.setProperty('--skin', sk[0]); pt.style.setProperty('--lips', sk[1]); pt.style.setProperty('--skinE', sk[2] || '#a8796a');
  pt.style.setProperty('--br', (st.rr ? Math.max(0.8, Math.min(6, 60 / st.rr)) : 3) + 's');
  const lk = lookTxt(), shut = !st.pulse || f.tube || S.died || LOOK_RE.shut.test(lk);
  pt.className = 'pt skin-' + st.skin
    + (shut ? '' : LOOK_RE.half.test(lk) || (st.spo2 != null && st.spo2 < 75) ? ' eyes-half' : ' eyes-open')
    + (st.pulse && st.rr > 0 && !f.tube && LOOK_RE.wob.test(lk) ? ' wob' : '')
    + (!st.cpr && !f.bvm && !f.tube && !S.died && LOOK_RE.gasp.test(lk) ? ' gasp' : '')
    + (st.cpr ? ' cpr' : '') + (!st.cpr && st.pulse && st.rr > 0 ? ' breathing' : '')
    + ((f.o2 || f.bvm) && !f.tube ? ' has-mask' : '') + (f.bvm && !f.tube ? ' has-bag' : '')
    + (f.tube ? ' has-tube' : '') + (f.pads ? ' has-pads' : '') + (f.leads ? ' has-leads' : '') + (f.io ? ' has-io' : '');
  $('#look').textContent = S.cq.fat && S.lv === 1 && st.cpr ? t('cqLook') : (st.look || '');
  const FL = t('flags'), fl = [[FL[0], f.o2 || f.bvm], [FL[1], f.bvm], [FL[2], f.pads], [FL[3], f.io], [FL[4], f.tube], [FL[5], st.cpr]];
  $('#flags').innerHTML = fl.map(([n, v]) => `<span class="flag${v ? ' on' : ''}">${n}</span>`).join('');
  $$('#ptacts .a-cpr').forEach(b => b.classList.toggle('active', !!st.cpr));
  $$('#ptacts .a-bvm').forEach(b => b.classList.toggle('active', !!f.bvm));
}
function updScore() { const e = $('#scr'); if (e) e.textContent = Math.max(0, Math.round(S.score)); }
function rec(m, cls) {
  S.recs++;
  const l = $('#recL'); if (!l) return;
  l.insertAdjacentHTML('beforeend', `<li class="${cls || ''}"><span>${mmss(S.codeT)}</span>${esc(m)}</li>`);
  l.scrollTop = l.scrollHeight; $('#recN').textContent = t('events', S.recs);
}
function flashBtn(id, cls) {
  $$(`#cart [data-act="${id}"], #ptacts [data-act="${id}"]`).forEach(b => {
    b.classList.remove('flashok', 'flashbad'); void b.offsetWidth; b.classList.add(cls);
    setTimeout(() => b.classList.remove(cls), 700);
  });
}
function zap() {
  Sound.zap(); if (MON) MON.shock();
  const fx = document.createElement('div'); fx.className = 'flashfx'; document.body.appendChild(fx); setTimeout(() => fx.remove(), 500);
  const pt = $('#pt'); if (pt) { pt.classList.remove('jolt'); void pt.offsetWidth; pt.classList.add('jolt'); setTimeout(() => pt && pt.classList.remove('jolt'), 400); }
}

function showBrief() {
  const c = S.c, z = D.zoneFor(c.wt), hw = S.hideWt;
  const m = modal(`<div class="sheet brief" role="dialog" aria-modal="true">
    <h2>${esc(t('caseFile'))}</h2>
    ${c.baseWt && c.baseWt !== c.wt && !hw ? `<div class="varied">${IC.dice}<span>${esc(t('varied', c.baseWt))}</span></div>` : ''}
    <div class="card"><div class="big" id="bWt">${hw ? '?' : c.wt}<small>${esc(t('kg'))}</small></div><div><span id="bZone">${hw ? '' : `<span class="zone" style="--zc:var(--z-${z.id})">${esc(t('zoneWord', z.n))}</span>`}</span><div style="margin-top:6px;font-weight:700">${esc(c.age)}</div><div class="muted" style="font-size:14px">${esc(c.place)}</div></div></div>
    <p>${esc(c.brief)}</p>
    ${hw ? weightStepHTML() : ''}
    <div class="lvbrief lv${S.lv}"><b>${esc(t('levels')[S.lv - 1].n)}</b><span>${esc(t('levels')[S.lv - 1].d)}</span></div>
    <ul class="how">${t('how').map(x => `<li>${esc(x)}</li>`).join('')}${Store.d.fatigue === true ? `<li>${esc(t('howCq'))}</li>` : ''}</ul>
    <div class="row"><button class="btn primary" data-start ${hw ? 'disabled' : ''}>${esc(t('startClock'))}</button><button class="btn ghost" data-go="cases">${esc(t('back'))}</button><button class="btn ghost" data-tut>${esc(t('tut').title)}</button></div>
  </div>`);
  m.el.addEventListener('click', e => {
    const wb = e.target.closest('[data-wt]'); if (wb && !wb.disabled) { wtAnswer(+wb.dataset.wt, m, wb); return; }
    if (e.target.closest('[data-start]') && !S.hideWt) {
      m.close(); Sound.ensure(); S.started = true; S.lastTick = performance.now(); nextPhase();
      if (!Store.d.tourSeen && !/[?&]debug/.test(location.search)) setTimeout(() => { if (S && !S.finished && !S.modal) tour(); }, 450);
    }
    else if (e.target.closest('[data-go]')) go('cases');
  });
  const f = $('form.wtform', m.el);
  if (f) {
    setTimeout(() => { const i = $('#wtv', m.el); if (i) i.focus(); }, 60);
    f.addEventListener('submit', e => { e.preventDefault(); const x = parseFloat(($('#wtv', m.el).value || '').replace(',', '.')); if (!isNaN(x) && x > 0) wtAnswer(x, m); });
  }
}
/* ================= Weight estimation (Clinical and Expert) ================= */
function weightStepHTML() {
  const e = roundWt(estWt(S.ageY)), typed = S.lv >= 3;
  const opts = shuffle([...new Set([e, roundWt(e * 0.55), roundWt(e * 1.6), roundWt(e * 2.3)])]);
  return `<div class="west"><h3>${esc(t('wtQ'))}</h3><p class="muted small">${esc(typed ? t('wtSub3') : t('wtSub2'))}</p>
    ${typed ? `<form class="typed wtform" autocomplete="off"><input id="wtv" type="text" inputmode="decimal" dir="ltr" aria-label="${esc(t('wtQ'))}"><span class="tu">kg</span><button class="btn primary" type="submit">${esc(t('wtSet'))}</button></form>`
      : `<div class="opts two">${opts.map((w, i) => `<button class="opt" data-wt="${w}" dir="ltr">${kbd(i + 1)}${w} kg</button>`).join('')}</div>`}
    <p class="why" id="wwhy" hidden></p></div>`;
}
function wtAnswer(x, m, btn) {
  if (!S.hideWt) return;
  const e = roundWt(estWt(S.ageY)), real = S.c.wt, typed = S.lv >= 3;
  const ok = typed ? (Math.abs(x - real) / real <= 0.25 || Math.abs(x - e) / e <= 0.12) : x === e;
  const y = $('#wwhy', m.el); y.hidden = false;
  let use;
  if (ok) { use = typed ? roundWt(x) : e; y.classList.add('good'); y.textContent = t('wtOk', use); Sound.ok(); if (btn) btn.classList.add('right'); }
  else {
    use = real; S.score -= 15; S.weak.add('doses');
    S.errs.push({ k: t('wtK'), msg: `${t('wtBad', x, e)} ${t('wtRule')}`, what: `${t('wtK')}: ${x} kg` });
    y.textContent = `${t('wtBad', x, e)} ${t('wtRule')} ${t('wtTape', real)}`; Sound.bad(); if (btn) btn.classList.add('wrong');
  }
  S.c.wt = use; S.hideWt = false;
  $$('[data-wt], #wtv, .wtform button', m.el).forEach(b => { b.disabled = true; });
  const z = D.zoneFor(use);
  $('#bWt', m.el).innerHTML = `${use}<small>${esc(t('kg'))}</small>`;
  $('#bZone', m.el).innerHTML = `<span class="zone" style="--zc:var(--z-${z.id})">${esc(t('zoneWord', z.n))}</span>`;
  $('#ttlWt').textContent = use;
  $('#ptZone').innerHTML = `<span class="zone" style="--zc:var(--z-${z.id})">${esc(z.n)} \u00b7 ${use} ${t('kg')}</span>`;
  $('[data-start]', m.el).disabled = false;
  rec(t('wtRec', use), ok ? 'ok' : 'bad');
}

function nextPhase() {
  if (!S) return;
  S.i++;
  const p = S.c.phases[S.i];
  if (!p) { finish(); return; }
  stallReset();
  /* a complication only happens if the thing it is about is really in place */
  if (p.cond && !p.cond()) { nextPhase(); return; }
  if (p.build) p.build(p);
  if (p.flag) { Object.assign(S.flags, p.flag); updAll(); }
  if (p.dip && S.st.pulse && S.st.spo2) { if (S.wBase.spo2 == null) S.wBase.spo2 = S.st.spo2; S.worsening = true; applySt({ spo2: Math.max(60, S.st.spo2 - p.dip) }); S.worsening = false; }
  p.type = p.type || 'act'; p.need = p.need || [];
  S.p = p; S.done = new Set(); S.qWrong = new Set(); S.pT0 = performance.now(); S.busy = false;
  /* A ROSC step (organized rhythm, pulse comes back): compressions keep running until the learner pauses them for the
     rhythm/pulse check, so they see the rhythm, the pleth and the SpO2 tone appear themselves. */
  let pset = p.set;
  const pn = (p.need || []).flat();
  S.roscHold = null;
  if (pset && pset.cpr === false && S.st.cpr && p.type === 'act' && p.after && p.after.pulse === true && (pn.includes('check') || pn.includes('rhythm'))) {
    pset = Object.assign({}, pset); delete pset.cpr; S.roscHold = p;
    if (S.lv < 3) S.fb = { t: 'note', h: t('roscHoldH'), m: t('roscHoldM') };
  }
  if (pset) applySt(pset);
  /* a few seconds to watch the patient and the monitor settle before the debrief (can be skipped) */
  if (p.type === 'end') { const ms = window.__fastEnd ? 1500 : 10000; S.busy = true; S.endAt = performance.now() + ms; renderSitu(); dimCart(true); setTimeout(() => { if (S && S.p === p) finish(); }, ms); return; }
  if (p.type === 'cycle') {
    if (!p.set || p.set.cpr === undefined) applySt({ cpr: true });
    S.cycEnd = performance.now() + cycDur(p) * 1000;
    /* The compressor may tire during this cycle: EtCO2 sags until someone swaps in. */
    S.cq.at = Store.d.fatigue === true && !S.st.pulse && S.cq.n < 2 && Math.random() < 0.5 ? performance.now() + Math.min(cycDur(p) * 600, 2500 + Math.random() * 3000) : null;
  }
  if (p.type === 'q') S.qopts = shuffle(p.opts);
  if (p.type === 'post') postInit();
  /* Things that stay in place (monitor, access, oxygen, bag, tube, running CPR) count for a later step automatically. */
  if (p.type === 'act' || p.type === 'cycle') {
    const f = S.flags, have = { labs: S.labsSent, pads: f.pads || (f.leads && S.st.pulse), leads: f.leads || f.pads, ivio: f.io, o2: f.o2 || f.bvm || f.tube, bvm: f.bvm || f.tube, airway: f.tube, cpr: p.type === 'act' && S.st.cpr };
    const auto = [];
    p.need.forEach((it, i) => { const a = (Array.isArray(it) ? it : [it]).find(x => have[x]); if (a) { S.done.add(i); auto.push(actName(a)); } });
    /* a scheduled epinephrine dose is already covered if the last one went in under 3 minutes ago */
    const sinceEpi = S.lastEpi === null ? null : S.codeT - S.lastEpi;
    let epiNote = '';
    if (!S.st.pulse && sinceEpi !== null && sinceEpi < 170) p.need.forEach((it, i) => { if (it === 'epi' && !S.done.has(i)) { S.done.add(i); epiNote = t('epiRecent', mShort(sinceEpi)); } });
    if (epiNote && !auto.length) S.fb = { t: 'note', h: t('fbAlready'), m: epiNote };
    if (auto.length) {
      S.fb = { t: 'note', h: t('fbAlready'), m: t('autoDone', auto.join(', ')) + (epiNote ? ' ' + epiNote : '') };
      if (p.type === 'act' && p.need.every((_, i) => S.done.has(i))) { dimCart(true); renderSitu(); S.busy = true; setTimeout(() => { if (S && S.p === p) { S.busy = false; phaseDone(); } }, 900); return; }
    }
  }
  dimCart(p.type === 'q');
  renderSitu();
}
function fbHTML(fb) { return `<div class="fb ${fb.t}"><b>${esc(fb.h)}</b><span>${esc(fb.m)}</span>${fb.gas ? `<span><button class="btn sm ghost" data-gas>${esc(t('gasView'))}</button></span>` : ''}${fb.inf ? `<span class="inf" style="--d:${fb.infMs}ms">${esc(fb.inf)}<i></i></span>` : ''}${fb.teach ? `<span class="teach">${esc(fb.teach)}</span>` : ''}</div>`; }
function renderSitu() {
  const p = S.p, el = $('#situ'); if (!p || !el) return;
  const dots = S.lv < 3 && (p.type === 'act' || p.type === 'cycle') && p.need.length ? `<div class="needs" aria-label="${esc(t('actionsDone', S.done.size, p.need.length))}">${p.need.map((_, i) => `<i class="${S.done.has(i) ? 'done' : ''}"></i>`).join('')}</div>` : '';
  /* no step number or step name: they would give the diagnosis away */
  const eb = p.type === 'end' ? `<span class="eyebrow">${esc(t('outcome'))}</span>` : '';
  let h = eb || dots ? `<div class="hd">${eb}${dots}</div>` : '';
  /* phone strip: the current instruction and progress dots stay in view while scrolling the drawer */
  const ss = $('#sSay'), sd = $('#sDots');
  if (ss) ss.textContent = p.type === 'q' ? `${sayOf(p, S.i)} ${p.q}` : sayOf(p, S.i);
  if (sd) sd.innerHTML = dots;
  if (S.fb) h += fbHTML(S.fb);
  h += `<p class="say">${esc(sayOf(p, S.i))}</p>`;
  if (p.type === 'post') h += postHTML();
  if (p.type === 'end') h += `<div><button class="btn primary" id="toDeb">${esc(t('toDebrief'))} <span id="debN">${Math.max(0, Math.ceil(((S.endAt || 0) - performance.now()) / 1000))}</span></button></div>`;
  if (p.type === 'q') h += `<div class="qtext">${esc(p.q)}</div><div class="opts">${S.qopts.map((o, i) => `<button class="opt${S.qWrong.has(i) ? ' wrong' : ''}" data-q="${i}">${kbd(i + 1)}${esc(o.t)}</button>`).join('')}</div>${S.st.monitor && S.st.pulse ? `<div><button class="btn sm ghost ecgbtn" data-ecg>${ICA.ecg12} ${esc(t('ecgRun'))}</button></div>` : ''}`;
  if (p.type === 'cycle') {
    const allDone = p.need.every((_, i) => S.done.has(i));
    h += `<div class="cycle"><span>${esc(t('cprIn'))} \u00b7 <b id="cycLeft">2:00</b> ${esc(t('toCheck'))}</span></div><div class="timebar cyc"><i id="tb" style="width:${Math.min(100, (1 - (S.cycEnd - performance.now()) / 1000 / cycDur(p)) * 100)}%"></i></div>`;
    if (!S.busy && allDone) h += `<div><button class="btn" id="ff">${IC.ff} ${esc(t('skip'))}</button></div>`;
  } else if (p.type !== 'end') h += `<div class="timebar"><i id="tb" style="width:100%"></i></div>`;
  /* bystander cases: grey out what you do not have (all hospital kit, the bag-mask, and the AED until it arrives) */
  const sim = $('.sim'); if (sim) { sim.classList.toggle('field', !!S.c.field); sim.classList.toggle('aed', !!S.c.field && aedHere()); }
  updAvail();
  const keepTb = $('#tb', el), w0 = keepTb && keepTb.style.width;
  el.innerHTML = h;
  if (w0 && p.type !== 'cycle' && $('#tb', el)) $('#tb', el).style.width = w0;
  if (window.innerWidth <= 980) { const top = el.getBoundingClientRect().top; if (top < 60 || top > window.innerHeight * 0.75) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  stripUpd();
}
/* Phones: show the vitals once the monitor scrolls away, and the instruction once the situation card does. */
function stripUpd() {
  const ms = document.getElementById('mstrip'); if (!ms) return;
  const row = ms.parentElement.querySelector('.in'), bar = row.getBoundingClientRect().bottom;
  document.documentElement.style.setProperty('--sbh', row.offsetHeight + 'px');
  if (window.innerWidth > 980) { ms.className = 'mstrip'; return; }
  const mon = $('#mon'), situ = $('#situ');
  const vOut = mon && mon.getBoundingClientRect().bottom < bar + 20;
  const sOut = situ && situ.getBoundingClientRect().top + 60 < bar;
  ms.className = 'mstrip' + (vOut ? ' v' : '') + (sOut ? ' s' : '');
}
let stripRaf = 0;
const stripSched = () => { if (!stripRaf) stripRaf = requestAnimationFrame(() => { stripRaf = 0; stripUpd(); }); };
window.addEventListener('scroll', stripSched, { passive: true, capture: true });
window.addEventListener('resize', stripSched);
document.addEventListener('click', e => { if (e.target.closest('#toDeb') && S && S.p && S.p.type === 'end') { finish(); return; } if (e.target.closest('#msS')) { const s = $('#situ'); if (s) s.scrollIntoView({ block: 'start', behavior: 'smooth' }); } });
function tick() {
  if (!S || !S.started || S.finished) return;
  const now = performance.now(), dt = (now - (S.lastTick || now)) / 1000; S.lastTick = now;
  const p = S.p; if (!p) return;
  if (S.modal) { S.cycEnd += dt * 1000; S.pT0 += dt * 1000; if (S.cq.at) S.cq.at += dt * 1000; return; }
  if (p.type === 'cycle' && !S.busy) {
    S.codeT += dt * 120 / cycDur(p);
    const left = (S.cycEnd - now) / 1000, tb = $('#tb');
    if (tb) tb.style.width = Math.min(100, (1 - left / cycDur(p)) * 100) + '%';
    const cl = $('#cycLeft'); if (cl) cl.textContent = mShort(Math.max(0, left) * 120 / cycDur(p));
    if (left <= 0) endCycle();
  } else {
    if (p.type === 'end') { const n = $('#debN'); if (n) n.textContent = Math.max(0, Math.ceil((S.endAt - now) / 1000)); }
    else S.codeT += dt;
    if (!S.busy && (p.type === 'act' || p.type === 'q' || p.type === 'post')) {
      const lim = limOf(p), el = (now - S.pT0) / 1000, tb = $('#tb');
      if (tb) { tb.style.width = Math.max(0, 100 - el / lim * 100) + '%'; tb.parentElement.classList.toggle('late', el > lim); }
    }
  }
  $('#clk').textContent = mmss(S.codeT);
  physio(now, dt, p);
  trackMetrics();
  if (S.lastEpi !== null) {
    const since = S.codeT - S.lastEpi, b = $('#epiBox');
    b.hidden = false; $('#epiT').textContent = mShort(since); b.classList.toggle('due', since >= 180 && !S.st.pulse);
  }
  const quiet = S.silUntil && now < S.silUntil;
  if (!quiet && S.st.monitor && !S.st.pulse && !S.modal && now - S.alarmT > 4500) { S.alarmT = now; Sound.alarm(); }
  else if (!quiet && S.st.monitor && S.st.pulse && S.dv.spo2 != null && S.dv.spo2 < 90 && now - S.alarm2 > 20000) { S.alarm2 = now; Sound.alarmMed(); }
  const ck = $('#mClk'); if (ck) { const d = new Date(); ck.textContent = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
}
/* Physiology between scripted steps: compressor fatigue, slow worsening while the team hesitates, smoothed numbers,
   and timeline samples. Scripted set/after values stay authoritative; this only moves between them. */
function physio(now, dt, p) {
  const st = S.st, cq = S.cq;
  if (cq.at && now >= cq.at && st.cpr && !st.pulse && capOn()) { cq.at = null; cq.fat = true; cq.n++; cq.tg = 7 + Math.random() * 2; tlEv('cqlow', t('cqLowEv')); updPatient(); }
  if (!st.cpr && cq.fat) { cq.fat = false; updPatient(); }
  cq.v += (cq.tg - cq.v) * Math.min(1, dt / 2.5);
  if (!S.busy && st.pulse && (p.type === 'act' || p.type === 'q' || p.type === 'post') && (now - S.pT0) / 1000 > limOf(p)) {
    S.dAcc += dt;
    if (S.dAcc >= 2.5) { S.dAcc = 0; worsen(); }
  }
  /* An arrest where nothing moves for a long time (well past the step's time limit, dialogs not counted): the rhythm
     fades and the EtCO2 falls; if it goes on, the resuscitation fails. Any completed action resets it. */
  if (!st.pulse && !S.died && !S.roscHold && !S.busy && (p.type === 'act' || p.type === 'q')) {
    S.stallT = (S.stallT || 0) + dt;
    const over = S.stallT - limOf(p) - 40;
    if (over > 0) {
      if (!S.stall) {
        S.stall = { hr: st.hr, acc: 0 }; cq.tg = Math.min(cq.tg, 8); tlEv('worse', t('stallEv'));
        if (S.lv < 3) { S.fb = { t: 'bad', h: t('stallH'), m: t('stallM') }; renderSitu(); }
      }
      S.stall.acc += dt;
      if (S.stall.acc >= 3) { S.stall.acc = 0; if (st.rhythm === 'pea' && st.hr > 20) { S.worsening = true; applySt({ hr: Math.max(20, st.hr - 3) }); S.worsening = false; } }
      if (over > (st.cpr ? 100 : 60)) { die(true); return; }
    }
  }
  /* once oxygen is on, SpO2 lost to waiting climbs back to where it was */
  const f = S.flags;
  if (S.wBase.spo2 != null && st.pulse && (f.o2 || f.bvm || f.tube)) {
    S.rAcc += dt;
    if (S.rAcc >= 1.2) {
      S.rAcc = 0; S.worsening = true;
      const up = Math.min(S.wBase.spo2, st.spo2 + 1), ch = { spo2: up };
      if ((up >= 85 || up >= S.wBase.spo2) && S.wBase.skin) { ch.skin = S.wBase.skin; delete S.wBase.skin; }
      applySt(ch); S.worsening = false;
      if (up >= S.wBase.spo2) delete S.wBase.spo2;
    }
  }
  /* oxygen also brings back the heart rate and pressure that hypoxia had pulled down */
  if (st.pulse && (f.o2 || f.bvm || f.tube) && !S.died && ((S.wBase.hr != null && S.wBase.hrHyp) || (S.wBase.bp && S.wBase.bpHyp) || (S.wBase.rr != null && S.wBase.rrHyp)) && (st.spo2 == null || st.spo2 >= 80)) {
    S.hAcc = (S.hAcc || 0) + dt;
    if (S.hAcc >= 1.2) {
      S.hAcc = 0; const ch = {};
      if (S.wBase.hr != null && S.wBase.hrHyp) {
        const h = Math.min(S.wBase.hr, st.hr + 5); ch.hr = h;
        if (h >= 60 && S.wBase.rh && st.rhythm !== S.wBase.rh) ch.rhythm = S.wBase.rh;
        if (h >= S.wBase.hr) { delete S.wBase.hr; delete S.wBase.rh; delete S.wBase.hrHyp; }
      }
      if (S.wBase.rr != null && S.wBase.rrHyp) {
        const r0 = S.wBase.rr, r = st.rr || 0, nr = r < r0 ? Math.min(r0, r + 2) : Math.max(r0, r - 1); ch.rr = nr;
        if (nr === r0) { delete S.wBase.rr; delete S.wBase.rrHyp; }
      }
      if (S.wBase.bp && S.wBase.bpHyp) {
        const b = parseBP(st.bp), B = parseBP(S.wBase.bp);
        if (b && B) { const s2 = Math.min(B[0], b[0] + 1), d2 = Math.min(B[1], b[1] + 1); ch.bp = `${s2}/${d2}`; if (s2 >= B[0]) { delete S.wBase.bp; delete S.wBase.bpHyp; } }
        else { delete S.wBase.bp; delete S.wBase.bpHyp; }
      }
      S.worsening = true; applySt(ch); S.worsening = false;
    }
  }
  smoothVitals(dt); wiggle(dt); postLive(); nbpTick(dt);
  /* the pleth wave shrinks and grows with perfusion; untreated VF gets finer, good compressions coarsen it again */
  S.perf = (S.perf ?? perfK()) + (perfK() - (S.perf ?? perfK())) * Math.min(1, dt / 4);
  S.vfa = st.rhythm === 'vf' && !st.pulse ? Math.max(0.35, Math.min(1, (S.vfa ?? 1) + (S.stall ? -dt / 40 : st.cpr ? dt / 60 : -dt / 80))) : 1;
  /* The ECG rate drifts toward a new rate within the same rhythm; a rhythm change (e.g. conversion) is immediate. */
  if (st.rhythm !== S.ehR || S.eh == null) { S.ehR = st.rhythm; S.eh = st.hr; }
  else S.eh += (st.hr - S.eh) * Math.min(1, dt / 3.5);
  if (MON) MON.set({ co2: capOn() ? S.dv.co2 : null, vent: ventP(), tube: S.flags.tube, hr: Math.round(S.eh), rp: respP(), perf: S.perf, vfa: S.vfa });
  S.smT += dt;
  if (S.smT >= 1) {
    S.smT = 0;

    if (st.monitor) S.tl.sm.push([S.codeT, S.dv.spo2, S.dv.co2]);
  }
  updVitals();
}
/* Non-invasive BP: the cuff measures on its own every minute and when the learner presses it. The number on the
   monitor is the last reading with its time, not a live value. A measurement takes about 9 s: the pump inflates
   above systolic, then the cuff deflates in steps. With no pulse it cannot measure. */
const NBP_INT = 60, NBP_INF = 3, NBP_DUR = 9;
function nbpStart() {
  const n = S.nbp, sb = S.dv.sbp;
  n.busy = true; n.t = 0; n.step = 0; n.cuff = 0;
  n.peak = Math.round(Math.min(220, Math.max(100, (sb || 90) + 30)));
  Sound.cuffPump(NBP_INF);
  updVitals();
}
function nbpTick(dt) {
  const n = S.nbp, on = !!S.st.monitor;
  if (!on) { n.on = false; n.busy = false; return; }
  if (!n.on) { n.on = true; nbpStart(); return; }
  if (!n.busy) { n.next -= dt; if (n.next <= 0) nbpStart(); return; }
  n.t += dt;
  if (n.t < NBP_INF) { n.cuff = Math.round(n.peak * n.t / NBP_INF); return; }
  const fr = Math.min(1, (n.t - NBP_INF) / (NBP_DUR - NBP_INF)), steps = 9, k = Math.floor(fr * steps);
  if (k > n.step) { n.step = k; Sound.cuffStep(); }
  const low = Math.max(20, (S.dv.dbp || 40) - 15);
  n.cuff = Math.round(n.peak - (n.peak - low) * (n.step / steps));
  if (n.t >= NBP_DUR) {
    n.busy = false; n.next = NBP_INT; n.cuff = 0;
    const ok = S.st.pulse && S.dv.sbp != null && S.dv.sbp > 25;
    n.v = ok ? { s: shownV('sbp'), d: shownV('dbp') } : 'fail';
    const d = new Date(); n.at = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    Sound.cuffDone();
  }
}
/* Untreated deterioration, one small step every 2.5 s while a step is overdue. Hypoxia (SpO2 < 94 without oxygen)
   and shock (systolic below the age limit) each get worse, and each drags the other down: deep hypoxia lowers the
   pressure, deep shock lowers the saturation. Then comes pre-terminal bradycardia, and finally cardiac arrest, which
   ends the case. Oxygen reverses what hypoxia caused; the scripted next step sets its own values. */
function worsen() {
  const st = S.st, f = S.flags, ch = {}, bp = parseBP(st.bp), lo = sbpLow(S.ageY), ox = f.o2 || f.bvm || f.tube;
  if (S.p && S.p.type === 'post') {
    if (st.spo2 && st.spo2 < 94 && !ox && st.spo2 > 62) ch.spo2 = st.spo2 - 1;
    if (bp && bp[0] < lo && bp[0] > lo - 18) ch.bp = `${bp[0] - 1}/${Math.max(15, bp[1] - 1)}`;
  } else {
    const sp = st.spo2, sb = bp ? bp[0] : null, db = bp ? bp[1] : null, hr = st.hr;
    let nsp = sp, nsb = sb, ndb = db, nhr = hr;
    if (sp != null && sp < 94 && !ox) nsp = sp - 1;
    if (sb != null && sb < lo) { nsb = sb - 1; ndb = db - 1; }
    if (sp != null && sp < 70 && sb != null) { nsb = Math.min(nsb, sb - 1); ndb = Math.min(ndb, db - 1); }
    if (sb != null && sb < lo - 10 && sp != null && !ox) nsp = Math.min(nsp, sp - 1);
    /* pre-terminal: deep hypoxia, or a pressure far below the age limit and well below where this child started
       (a case that opens hypotensive still has some time before the heart gives up) */
    const base = parseBP(S.wBase.bp || st.bp), baseSb = base ? base[0] : sb;
    const preterm = (sp != null && sp < 65) || (sb != null && sb < lo - 20 && sb <= baseSb - 15);
    if (preterm && hr) nhr = Math.round(hr - Math.max(3, hr * 0.06));
    /* breathing: faster at first (working harder), then it tires and slows to agonal gasps before the arrest */
    const rr = st.rr, rr0 = S.wBase.rr ?? rr;
    if (rr) {
      if (preterm) ch.rr = Math.max(4, Math.round(rr - Math.max(2, rr * 0.08)));
      else if (((sp != null && sp < 90) || (sb != null && sb < lo)) && rr < rr0 * 1.4 && (S.rrK = !S.rrK)) ch.rr = rr + 1;
    }
    if (nsp != null && nsp !== sp) ch.spo2 = Math.max(20, nsp);
    if (nsb != null && (nsb !== sb || ndb !== db)) ch.bp = `${Math.max(20, nsb)}/${Math.max(10, ndb)}`;
    if (nhr !== hr) {
      ch.hr = nhr;
      if (nhr < 60 && ['nsr', 'stach', 'svt'].includes(st.rhythm)) ch.rhythm = 'sbrady';
    }
    if (preterm && !S.preterm) {
      S.preterm = true; ch.skin = 'grey'; ch.look = t('lookPreterm'); tlEv('preterm', t('worsePretermH'));
      if (S.lv < 3) { S.fb = { t: 'bad', h: t('worsePretermH'), m: t('worsePretermM') }; renderSitu(); }
    }
    if (preterm && (nhr <= 30 || (nsb != null && nsb <= 30 && nhr < 60))) { die(); return; }
  }
  if (ch.spo2 && ch.spo2 < 80 && ['pink', 'pale', 'mottled'].includes(st.skin) && !ch.skin) ch.skin = 'cyan';
  if (!Object.keys(ch).length) return;
  /* remember where this started, so oxygen can bring it back */
  if (ch.spo2 && S.wBase.spo2 == null) S.wBase.spo2 = st.spo2;
  if (ch.skin && S.wBase.skin == null) S.wBase.skin = st.skin;
  if (ch.hr != null && S.wBase.hr == null) { S.wBase.hr = st.hr; S.wBase.rh = st.rhythm; S.wBase.hrHyp = st.spo2 != null && st.spo2 < 65; }
  if (ch.rr != null && S.wBase.rr == null) { S.wBase.rr = st.rr; S.wBase.rrHyp = !bp || bp[0] >= lo; }
  if (ch.bp && S.wBase.bp == null) { S.wBase.bp = st.bp; S.wBase.bpHyp = !bp || bp[0] >= lo; }
  S.worsening = true; applySt(ch); S.worsening = false;
  if (!S.warned) { S.warned = true; tlEv('worse', t('worseEv')); if (S.lv === 1 && !S.preterm) { S.fb = { t: 'note', h: t('worseH'), m: t('worseM') }; renderSitu(); } }
}
/* Left untreated long enough, the child arrests: the case ends there. */
function die(arr) {
  if (S.died) return;
  S.died = true;
  S.worsening = true; applySt(arr ? { rhythm: 'asystole', hr: 0, rr: 0, cpr: false, skin: 'grey', look: t('lookDead'), alarm: true } : { pulse: false, rhythm: 'pea', hr: 24, rr: 0, cpr: false, skin: 'grey', look: t('lookDead'), alarm: true }); S.worsening = false;
  tlEv('died', t(arr ? 'stallDiedH' : 'diedEv'));
  err(t(arr ? 'stallDiedM' : 'diedM'), true, null, t(arr ? 'stallDiedWhat' : 'diedWhat'), 50, t(arr ? 'stallDiedH' : 'diedH'));
  const p = { type: 'end', need: [], say: t(arr ? 'stallDiedSay' : 'diedSay') }, ms = window.__fastEnd ? 1500 : 10000;
  S.i = S.c.phases.length; S.p = p; S.done = new Set(); S.busy = true; S.endAt = performance.now() + ms;
  renderSitu(); dimCart(true);
  setTimeout(() => { if (S && S.p === p) { S.worsening = true; applySt({ rhythm: 'asystole', hr: 0 }); S.worsening = false; } }, Math.min(ms, 5000));
  setTimeout(() => { if (S && S.p === p) finish(); }, ms);
}

/* Resuscitation-quality metrics, in code time. A pause is time without compressions while pulseless after CPR has
   started; phases marked pauseOk (lone rescuer leaving to call) are excluded. */
const phaseEN = () => (S.p && S.p._e) || {};
function trackMetrics() {
  const st = S.st, m = S.m, dc = Math.max(0, S.codeT - m.prevT); m.prevT = S.codeT;
  if (st.monitor && !st.pulse) {
    if (['vf', 'vt', 'torsades'].includes(st.rhythm)) { if (m.shockable0 === null) m.shockable0 = S.codeT; }
    else if (['asystole', 'pea'].includes(st.rhythm) && m.nonshock0 === null) m.nonshock0 = S.codeT;
  }
  if (S.cq.fat && st.cpr) m.lowQ += dc;
  if (m.cpr0 !== null && !st.pulse) {
    m.arrestT += dc;
    if (st.cpr) { m.cprT += dc; if (m.cur > 0) { m.pauses.push(m.cur); m.cur = 0; } }
    else if (!phaseEN().pauseOk) m.cur += dc;
  } else if (m.cur > 0) { m.pauses.push(m.cur); m.cur = 0; }
}
function qualityRows() {
  const m = S.m;
  if (m.cur > 0) { m.pauses.push(m.cur); m.cur = 0; }
  const M = t('metrics'), rows = [];
  if (m.recog !== null && m.cpr0 !== null && m.cpr0 >= m.recog) rows.push([M.cpr, m.cpr0 - m.recog, 10]);
  if (m.shockable0 !== null && m.shock1 !== null && m.shock1 >= m.shockable0) rows.push([M.shock, m.shock1 - m.shockable0, 120]);
  if (m.nonshock0 !== null && m.epi1 !== null && m.epi1 >= m.nonshock0) rows.push([M.epi, m.epi1 - m.nonshock0, 300]);
  if (m.pauses.length) rows.push([M.pause, Math.max(...m.pauses), 10]);
  if (S.cq.n || m.lowQ > 0) rows.push([M.lowq, m.lowQ, 20]);
  const out = rows.map(([l, v, tg]) => ({ l, v: mShort(v), tg: '\u2264 ' + mShort(tg), ok: v <= tg }));
  if (m.arrestT > 30) { const fr = m.cprT / m.arrestT; out.push({ l: M.ccf, v: Math.round(fr * 100) + '%', tg: '\u2265 80%', ok: fr >= 0.8 }); }
  return out;
}
function metricsHTML(out) {
  if (!out.length) return '';
  return `<h3>${esc(t('qualityTitle'))}</h3><div class="metrics">${out.map(r => `<div class="met ${r.ok ? 'ok' : 'bad'}"><span>${esc(r.l)}</span><b dir="ltr">${r.v}</b><small>${esc(t('target'))} <span dir="ltr">${r.tg}</span></small></div>`).join('')}</div><p class="muted small">${esc(t('qualityNote'))}</p>`;
}
/* In a bystander case the AED is there from the step where it arrives (the first step that asks for pads). */
function aedHere() {
  if (!S.c.aed) return false;
  const at = S.c.phases.findIndex(q => (q.need || []).includes('pads'));
  return at >= 0 && S.i >= at;
}
function prereq(id) {
  if (D.NEEDS_IO.includes(id) && !S.flags.io) return t('noAccess');
  if (D.NEEDS_PADS.includes(id) && !S.flags.pads && !(id === 'rhythm' && S.flags.leads && S.st.pulse)) return t('noPads');
  return null;
}
function alreadyDone(id) {
  const f = S.flags;
  if (id === 'pads' && f.pads) return t('adPads');
  if (id === 'leads' && (f.leads || f.pads)) return t('adLeads');
  if (id === 'ivio' && f.io) return t('adIV');
  if (id === 'o2' && (f.o2 || f.bvm)) return t('adO2');
  if (id === 'bvm' && f.bvm) return t('adBVM');
  if (id === 'airway' && f.tube) return t('adAirway');
  if (id === 'cpr' && S.st.cpr) return t('adCPR');
  return null;
}
function defaultWhy(id) {
  const st = S.st, cyc = S.p.type === 'cycle';
  if (id === 'shock' && cyc && !st.pulse && (st.rhythm === 'vf' || st.rhythm === 'vt')) return t('whyShockCycle');
  if ((id === 'check' || id === 'rhythm') && cyc) return t('whyCheckCycle');
  if (id === 'cpr' && st.pulse) return t('whyCprPulse');
  return D.WHY[id] || D.GENERIC_WHY;
}
function paramKey(id, p) {
  if (p.dose && p.dose[id]) return p.dose[id];
  switch (id) {
    case 'epi': case 'epiim': case 'atropine': case 'lido': case 'procain': case 'naloxone': case 'dextrose': case 'fluid': case 'mag': return id;
    case 'amio': return S.st.pulse ? 'amio' : 'amioArrest';
    case 'adenosine': return S.adeno ? 'adeno2' : 'adeno1';
    case 'shock': return S.c.aed ? null : ['shock1', 'shock2', 'shock3'][Math.min(S.shocks, 2)];
    case 'sync': return S.syncs ? 'sync2' : 'sync1';
  }
  return null;
}
const GIVEN_IDS = new Set(['epi', 'epiim', 'atropine', 'adenosine', 'amio', 'lido', 'procain', 'naloxone', 'dextrose', 'mag', 'abx', 'dexa', 'antihist', 'albuterol', 'nebepi', 'needle', 'vaso']);
function effects(id) {
  const f = S.flags;
  if (GIVEN_IDS.has(id)) S.given[id] = S.codeT;
  (S.did = S.did || new Set()).add(id);
  switch (id) {
    case 'labs': labsSend(true); break;
    case 'o2': f.o2 = true; break;
    case 'bvm': f.bvm = true; f.o2 = true; break;
    case 'check': if (S.m.cpr0 === null) S.m.recog = S.codeT; break;
    case 'pads': f.pads = true; applySt({ monitor: true }); break;
    case 'leads': f.leads = true; applySt({ monitor: true }); break;
    case 'ivio': f.io = true; break;
    case 'airway': f.tube = true; f.o2 = true; break;
    case 'cpr': applySt({ cpr: true }); break;
    case 'rhythm': applySt({ cpr: false }); break;
    case 'epi': S.lastEpi = S.codeT; if (S.m.epi1 === null) S.m.epi1 = S.codeT; break;
    case 'glucose': if (S.post) S.post.gluK = true; break;
    case 'shock': S.shocks++; if (S.m.shock1 === null) S.m.shock1 = S.codeT; zap(); break;
    case 'sync': S.syncs++; zap(); break;
    case 'adenosine': S.adeno++; if (MON && S.st.pulse) MON.hold(3.2); break;
  }
  updAll();
}
const pneeds = p => (p.need || []).flat();
/* Drug doses: asked once per case. A dose (with its dilution and draw-up) answered right the first time is simply given again. */
function rxChain(id, key, p) {
  const memo = S.rxOk && S.rxOk[key];
  if (memo) { toast(t('rxSame', memo)); return Promise.resolve(memo); }
  const e0 = S.errs.length;
  return doseDialog(key)
    .then(r => (r && S && S.real && S.p === p) ? (DILUTE[id] ? prepDilution(id) : Promise.resolve(true)).then(ok => ok && S && S.p === p ? drawUp(id, key) : false).then(ok => ok ? r : null) : r)
    .then(r => { if (r && S && S.errs.length === e0) (S.rxOk = S.rxOk || {})[key] = r; return r; });
}
function doAction(id, ro) {
  if (!S || S.busy || !S.started || S.modal) return;
  const p = S.p; if (!p || p.type === 'q' || p.type === 'end') return;
  if (id === 'auscult') chestSound();
  /* history and bloods can be asked for at any moment; a step that needs them judges them like any other action */
  const wanted = p.type !== 'post' && p.need.some((it, i) => !S.done.has(i) && (it === id || (Array.isArray(it) && it.includes(id))));
  if (id === 'history' && !wanted) { rec(actName(id), 'ok'); S.fb = { t: 'note', h: t('hxH'), m: ((t('extra') || {})[S.c.id] || {}).hx || t('hxNone') }; renderSitu(); return; }
  if (id === 'labs' && !wanted && !S.c.field) { labsSend(); return; }
  if (p.type === 'post') { postAct(id); return; }
  if (S.roscHold === p && S.st.cpr) {
    if (id === 'cpr') { S.fb = { t: 'note', h: t('fbAlready'), m: t('roscRunning') }; renderSitu(); return; }
    if (id === 'rhythm' || id === 'check') {
      S.roscHold = null;
      S.worsening = true; applySt({ cpr: false, pulse: true, alarm: false, spo2: p.after.spo2 != null ? p.after.spo2 : S.st.spo2 }); S.worsening = false;
      if (id === 'rhythm' && !pneeds(p).includes('rhythm')) { rec(actName(id), 'ok'); S.fb = { t: 'note', h: t('fbFine'), m: t('roscPauseM') }; renderSitu(); return; }
    }
  }
  /* Bystander cases: only your hands. The AED works once someone has brought it; there is no hospital kit at all. */
  if (S.c.field) {
    const A = D.ACTIONS.find(a => a.id === id), aedAct = ['pads', 'rhythm', 'shock'].includes(id);
    if (aedAct ? !aedHere() : id === 'bvm' || (A && A.g !== 'bed')) {
      flashBtn(id, 'flashbad');
      S.fb = { t: 'note', h: t('fieldH'), m: aedAct ? (S.c.aed ? t('fieldNoAedYet') : t('fieldNoAed')) : id === 'bvm' ? t('fieldNoBag') : t('fieldNoKit') }; renderSitu(); return;
    }
  }
  /* Swapping the compressor: tap CPR while compressions are running. */
  if (id === 'cpr' && S.st.cpr && !ro) {
    if (S.cq.fat) {
      S.cq.fat = false; S.cq.tg = 17 + Math.random() * 3;
      rec(t('cqSwap'), 'ok'); tlEv('cqswap', t('cqSwap')); Sound.ok(); flashBtn('cpr', 'flashok');
      S.fb = { t: 'ok', h: t('cqSwapH'), m: S.lv >= 3 ? '' : t('cqSwapM') }; updPatient(); renderSitu(); return;
    }
    if (capOn()) { S.fb = { t: 'note', h: t('fbAlready'), m: t('cqFine') }; renderSitu(); return; }
  }

  /* Realistic equipment: the device dialogs run first, then the action is judged with what was set on the device. */
  if (S.real && !ro) {
    if ((id === 'shock' || id === 'sync') && !S.c.aed && S.flags.pads) { defibPanel(id === 'sync').then(r => { if (r && S && S.p === p) doAction(r.sync ? 'sync' : 'shock', { energy: r.j }); }); return; }
    if (id === 'pace' && S.flags.pads) { pacerPanel().then(r => { if (r && S && S.p === p) doAction('pace', { pace: r }); }); return; }
    if (id === 'pads' && !S.flags.pads && !S.c.aed) { padsPanel().then(r => { if (r && S && S.p === p) doAction('pads', { pads: r }); }); return; }
  }
  /* A 12-lead / printed strip is never wrong while there is a pulse: it shows P waves and QRS width clearly. */
  if (id === 'ecg12' && S.st.pulse) {
    ecgPrint();
    if (!p.need.some((it, i) => !S.done.has(i) && (it === id || (Array.isArray(it) && it.includes(id))))) { S.fb = { t: 'note', h: t('fbFine'), m: t('ecgFine') }; renderSitu(); return; }
  }
  if (ro && ro.pads) {
    const small = S.c.wt < 10;
    if (ro.pads.size !== (small ? 'ped' : 'adult')) { err(small ? t('rlPadsSmall') : t('rlPadsBig'), false, id, `${actName(id)}: ${t(ro.pads.size === 'ped' ? 'rlPadsPed' : 'rlPadsAdult')}`, 15, t('rlPadsHead')); return; }
    if (small && ro.pads.place !== 'ap') { err(t('rlPadsPlace'), false, id, `${actName(id)}: ${t('rlAL')}`, 15, t('rlPadsHead')); return; }
  }
  /* monitor leads cover a "pads" step while the child has a pulse (pads are still needed to analyze in arrest, shock, sync or pace) */
  const mt = x => x === id || (id === 'leads' && x === 'pads' && S.st.pulse);
  const idx = p.need.findIndex((it, i) => !S.done.has(i) && (mt(it) || (Array.isArray(it) && it.some(mt))));
  if (idx >= 0) {
    const pre = prereq(id); if (pre) { err(pre, false, id, null, 15, t('missingStep')); return; }
    if (id === 'hts') { htsDialog(p.hts).then(r => { if (r && S && S.p === p) complete(id, idx, `${t('cause')}: ${p.hts.ans}`); }); return; }
    const key = paramKey(id, p);
    if (ro && ro.energy != null && key) {
      if (!energyOk(key, ro.energy)) { const d = D.DOSE[key](S.c.wt); err(`${t('youGave')} ${ro.energy} J. ${t('rule')}: ${d.rule} (${ansText(key, S.c.wt)}).`, true, null, `${d.title}: ${ro.energy} J`, 35, t('rlWrongJ'), DOSE_TOPIC[key]); return; }
      complete(id, idx, `${actName(id)} ${ro.energy} J`); return;
    }
    if (ro && ro.pace) {
      if (ro.pace.rate < 80 || ro.pace.rate > 140) { err(t('rlRateBad', ro.pace.rate), false, id, `${actName(id)}: ${ro.pace.rate}/min`, 25, t('notNow')); return; }
      complete(id, idx, `${actName(id)} ${ro.pace.rate}/min \u00b7 ${ro.pace.mA} mA`); return;
    }
    if (key) {
      /* realistic: dose, then dilute the ampoule if this drug needs it, then draw up the volume */
      rxChain(id, key, p).then(r => { if (r && S && S.p === p) complete(id, idx, r); });
      return;
    }
    complete(id, idx); return;
  }
  if (p.need.some((it, i) => S.done.has(i) && Array.isArray(it) && it.includes(id))) {
    effects(id); rec(actName(id), 'ok'); tlEv(id, actName(id));
    S.fb = { t: 'note', h: t('fbCovered'), m: t('fbCoveredM') }; renderSitu(); return;
  }
  const ad = alreadyDone(id);
  if (ad) { S.fb = { t: 'note', h: t('fbAlready'), m: ad }; renderSitu(); return; }
  if (p.ok && p.ok.includes(id)) {
    const pre = prereq(id); if (pre) { err(pre, false, id, null, 15, t('missingStep')); return; }
    effects(id); rec(actName(id), 'ok'); tlEv(id, actName(id));
    S.fb = { t: 'note', h: t('fbFine'), m: `${D.OK_TEXT[id] || ''} ${t('fbFineM')}` }; renderSitu(); return;
  }
  /* Epinephrine in arrest follows the epi timer, not the cycle count: at 3 minutes or more it is due and always accepted. */
  if (id === 'epi' && !S.st.pulse && S.lastEpi !== null && S.codeT - S.lastEpi >= 180) {
    const pre = prereq(id); if (pre) { err(pre, false, id, null, 15, t('missingStep')); return; }
    const key = paramKey(id, p);
    rxChain(id, key, p).then(r => {
      if (!r || !S || S.p !== p) return;
      effects(id); rec(r, 'ok'); tlEv(id, r); Sound.ok(); flashBtn(id, 'flashok');
      S.fb = { t: 'ok', h: t('done'), m: t('epiDue') }; renderSitu();
    });
    return;
  }
  /* A drug given earlier that this step does not ask for: say so plainly instead of a generic text about the drug. */
  if (!(p.why && p.why[id]) && S.given[id] != null) { err(t('givenAgain', mShort(S.given[id])), false, id, null, 15); return; }
  /* A glucose check is never wrong in a child with a pulse. */
  /* Putting on pads or monitor leads is never wrong while they are not on yet. */
  if ((id === 'pads' && !S.flags.pads || id === 'leads' && !S.flags.leads && S.st.pulse) && !(p.why && p.why[id])) { effects(id); rec(actName(id), 'ok'); tlEv(id, actName(id)); S.fb = { t: 'note', h: t('fbFine'), m: `${D.OK_TEXT[id] || ''} ${t('fbFineM')}` }; renderSitu(); return; }
  /* H's & T's: a cause missed in an earlier cycle can be found late; otherwise reviewing them is never wrong. */
  if (id === 'hts' && !(p.why && p.why.hts)) {
    if (S.htsLate) {
      const h = S.htsLate;
      htsDialog(h).then(r => { if (!r || !S) return; S.htsLate = null; rec(`${t('cause')}: ${h.ans}`, 'ok'); tlEv('hts', h.ans); Sound.ok(); S.fb = { t: 'ok', h: t('htsLateH'), m: t('htsLateM', h.fix) }; renderSitu(); });
      return;
    }
    rec(actName(id), 'ok'); S.fb = { t: 'note', h: t('fbFine'), m: t('htsAny') }; renderSitu(); return;
  }
  /* Assessment and calling for help never hurt a child with a pulse (unless the step says why not). */
  if (['auscult', 'resp', 'shout', 'ems', 'check'].includes(id) && S.st.pulse && !(p.why && p.why[id])) { rec(actName(id), 'ok'); tlEv(id, actName(id)); S.fb = { t: 'note', h: t('fbFine'), m: `${D.OK_TEXT[id] || ''} ${t('fbFineM')}` }; renderSitu(); return; }
  if (id === 'glucose' && S.st.pulse && !(p.why && p.why.glucose)) { effects(id); rec(actName(id), 'ok'); tlEv(id, actName(id)); S.fb = { t: 'note', h: t('fbFine'), m: t('glucoseFine') }; renderSitu(); return; }
  let w = (p.why && p.why[id]) || defaultWhy(id);
  const danger = w.startsWith('!'); if (danger) w = w.slice(1);
  err(w, danger, id);
}
function err(msg, danger, id, label, pen, head, topic) {
  pen = pen ?? (danger ? 40 : 25);
  S.weak.add(topic || S.c.algo);
  S.score -= pen;
  const what = label || (id ? actName(id) : '');
  S.errs.push({ k: S.p.k, msg, danger: !!danger, what });
  rec(`\u2717 ${what}`, 'bad'); tlEv('err', what); Sound.bad();
  S.fb = { t: 'bad', h: `${head || (danger ? t('dangerous') : t('notNow'))} \u00b7 ${t('pen', pen)}`, m: S.lv >= 3 ? t('noExplain') : msg };
  if (id) flashBtn(id, 'flashbad');
  renderSitu(); updScore();
}
/* progress made: the stalled-arrest clock starts again and the rhythm recovers */
function stallReset() {
  S.stallT = 0;
  if (S.stall) { if (!S.st.pulse && S.st.rhythm === 'pea') { S.worsening = true; applySt({ hr: S.stall.hr }); S.worsening = false; } S.cq.tg = 17 + Math.random() * 3; S.stall = null; }
}
function complete(id, idx, label) {
  if (!S) return;
  stallReset();
  const p = S.p; S.done.add(idx);
  effects(id); rec(label || actName(id), 'ok'); tlEv(id, label || actName(id)); Sound.ok(); flashBtn(id, 'flashok');
  const all = p.need.every((_, i) => S.done.has(i));
  if (all && p.type !== 'cycle') { phaseDone(); return; }
  const rem = p.need.length - S.done.size;
  S.fb = { t: 'ok', h: t('done'), m: S.lv >= 3 ? (D.OK_TEXT[id] || '') : (D.OK_TEXT[id] || '') + (rem > 0 ? t('moreToGo', rem) : t('cycleAllDone')) };
  renderSitu();
}
/* Real seconds a 2-minute CPR cycle lasts on screen: more time at the easier levels. */
const cycDur = p => p.dur * [2.5, 2, 1.6][(S && S.lv || 1) - 1];
const limOf = p => (p.t || (p.type === 'q' ? 25 : 20)) * (S.lv >= 3 ? 0.75 : 1);
function scorePhase() {
  const p = S.p; if (p.type === 'cycle') return;
  const lim = limOf(p), el = (performance.now() - S.pT0) / 1000;
  S.score += Math.round(Math.max(40, 100 - Math.max(0, el - lim) * 3)); S.max += 100; updScore();
}
function phaseDone() {
  const p = S.p; S.busy = true; scorePhase();
  S.fb = { t: 'ok', h: t('correct'), m: msgOf(p, S.i), teach: S.lv >= 3 ? null : p.teach };
  if (p.teach) S.teach.push({ k: p.k, t: p.teach });
  dimCart(true);
  /* treatments take time: a bolus runs for a while (the numbers move as it goes in), a drug needs a moment to act */
  const pn = pneeds(p), inf = !p.flash && S.st.pulse ? (pn.includes('fluid') ? [t('infFluid'), 5000, true] : pn.some(a => GIVEN_IDS.has(a) && a !== 'needle') ? [t('infDrug'), 2500, false] : null) : null;
  if (inf) {
    const ms = window.__fastEnd ? 300 : inf[1];
    S.fb.inf = inf[0]; S.fb.infMs = ms;
    if (inf[2] && p.after) applySt(p.after);
    renderSitu();
    setTimeout(() => { if (!S || S.p !== p) return; if (!inf[2] && p.after) applySt(p.after); nextPhase(); }, ms);
    return;
  }
  if (p.flash) {
    const prev = { rhythm: S.st.rhythm, hr: S.st.hr };
    applySt({ rhythm: p.flash.rhythm }); renderSitu();
    setTimeout(() => { if (!S) return; applySt(p.after || prev); nextPhase(); }, p.flash.ms);
  } else {
    if (p.after) applySt(p.after);
    renderSitu();
    setTimeout(() => { if (S) nextPhase(); }, 750);
  }
}
function answerQ(i) {
  if (!S || S.busy || S.modal) return;
  const p = S.p, o = S.qopts[i]; if (!o || S.qWrong.has(i)) return;
  if (o.ok) {
    S.busy = true; rec(`${t('decision')}: ${o.t}`, 'ok'); Sound.ok(); scorePhase();
    const b = $(`[data-q="${i}"]`); if (b) b.classList.add('right');
    S.fb = { t: 'ok', h: t('correct'), m: o.t, teach: S.lv >= 3 ? null : p.teach };
    if (p.teach) S.teach.push({ k: p.k, t: p.teach });
    setTimeout(() => { if (!S) return; if (p.after) applySt(p.after); nextPhase(); }, 700);
  } else {
    S.qWrong.add(i);
    err(o.why || D.GENERIC_WHY, false, null, o.t);
  }
}
function endCycle() {
  if (!S || S.busy) return;
  const p = S.p; S.busy = true;
  const miss = p.need.filter((_, i) => !S.done.has(i));
  /* a missed cause search can still be done late, in the next steps */
  if (p.hts && miss.some(it => it === 'hts' || (Array.isArray(it) && it.includes('hts')))) S.htsLate = p.hts;
  if (p.need.length) { S.max += 100; S.score += Math.max(0, 100 - 40 * miss.length); }
  const left = Math.max(0, (S.cycEnd - performance.now()) / 1000); S.codeT += left * 120 / cycDur(p);
  if (miss.length) {
    const names = miss.map(it => Array.isArray(it) ? it.map(actName).join(t('or')) : actName(it));
    S.errs.push({ k: p.k, msg: t('notDoneCycle', names.join(', ')), what: t('missedTasks') }); S.weak.add(S.c.algo);
    miss.forEach(it => effects(Array.isArray(it) ? it[0] : it));
    rec(`\u2717 ${t('missed')}: ${names.join(', ')}`, 'bad'); tlEv('err', t('missedTasks')); Sound.bad();
    S.fb = { t: 'bad', h: t('cycleOver'), m: `${t('missed')}: ${names.join(', ')}.`, teach: S.lv >= 3 ? null : p.teach };
  } else S.fb = { t: 'ok', h: t('cycleComplete'), m: t('cycleDone'), teach: S.lv >= 3 ? null : p.teach };
  S.cq.at = null;
  if (S.cq.fat) {
    S.cq.fat = false; S.cq.tg = 17 + Math.random() * 3; S.score -= 20; S.weak.add('arrest');
    S.errs.push({ k: p.k, msg: t('cqMiss'), what: t('cqWhat') }); rec(`\u2717 ${t('cqWhat')}`, 'bad'); tlEv('err', t('cqWhat'));
    if (S.fb.t === 'ok') S.fb = { t: 'bad', h: t('cycleOver'), m: S.lv >= 3 ? t('cqWhat') : t('cqMiss'), teach: S.lv >= 3 ? null : p.teach };
  }
  if (p.teach) S.teach.push({ k: p.k, t: p.teach });
  if (p.after) applySt(p.after);
  renderSitu(); updScore();
  setTimeout(() => { if (S) nextPhase(); }, 800);
}

/* ================= Post-ROSC stabilization board ================= */
const FIO2 = [21, 30, 40, 50, 60, 80, 100];
function postInit() {
  const k = S.c.kind, nr = k === 'infant' ? 30 : k === 'teen' ? 16 : 22, lo = sbpLow(S.ageY), r = Math.random;
  const hyper = r() < 0.65, fast = r() < 0.7, hypo = r() < 0.6;
  S.post = {
    nr, lo, fi: hyper ? 6 : 2, curve: hyper ? [88, 92, 95, 97, 98, 100, 100] : [80, 84, 88, 90, 92, 95, 97],
    rate: fast ? Math.round(nr * 1.8) : Math.round(nr * 0.55), sbp: hypo ? lo - 6 - Math.floor(r() * 6) : lo + 12 + Math.floor(r() * 8),
    refr: r() < 0.5, bol: 0, vaso: false, glu: r() < 0.3 ? 38 + Math.floor(r() * 12) : 95 + Math.floor(r() * 30), gluK: false,
    temp: r() < 0.6 ? 38.3 + Math.floor(r() * 4) / 10 : 36.9 + Math.floor(r() * 4) / 10
  };
  S.st.cpr = false;
  postApply();
}
const postSpo2 = () => S.post.curve[S.post.fi];
const postCo2 = () => Math.round(40 * S.post.nr / S.post.rate);
function postApply() { const P = S.post; applySt({ spo2: postSpo2(), etco2: postCo2(), rr: P.rate, bp: `${P.sbp}/${Math.round(P.sbp * 0.56)}` }); }
/* Rows: what you set (bold, with controls) and what you measure (live from the monitor, so it responds over seconds).
   `ok` judges the true settings at handover; `live` judges what the monitor shows now (row colour at Guided level). */
function postRows() {
  const P = S.post, sp = postSpo2(), co = postCo2();
  const mSp = shownV('spo2'), mCo = shownV('co2'), n = S.nbp, nv = n.v && n.v !== 'fail' ? n.v : null;
  /* BP comes from the cuff: the last reading and its time, or the cuff pressure while it measures */
  const bpMv = !S.st.monitor ? '--' : n.busy ? `CUFF ${n.cuff}` : nv ? `${nv.s}/${nv.d} \u00b7 ${n.at}` : n.v === 'fail' ? '-?-' : '--';
  return [
    { id: 'ox', l: t('pfOx'), set: `FiO\u2082 ${FIO2[P.fi]}%`, ctl: 'fio2', ml: 'SpO\u2082', mv: mSp == null ? '--' : `${mSp}%`, tg: '94\u201399%', ok: sp >= 94 && sp <= 99, live: mSp >= 94 && mSp <= 99 },
    { id: 'vent', l: t('pfVent'), set: t('pfRateSet', P.rate), ctl: 'rate', ml: 'EtCO\u2082', mv: mCo == null ? '--' : `${mCo} mmHg`, tg: '35\u201345 mmHg', ok: co >= 35 && co <= 45, live: mCo >= 35 && mCo <= 45 },
    { id: 'bp', l: t('pfBP'), set: P.vaso ? t('pfVasoOn') : P.bol ? t('pfBol', P.bol) : '', ctl: 'nbp', hint: t('pfBPh'), ml: 'NIBP', mv: bpMv, tg: `\u2265 ${P.lo}`, ok: P.sbp >= P.lo, live: !!nv && nv.s >= P.lo },
    { id: 'glu', l: t('pfGlu'), set: '', hint: t('pfGluh'), ml: t('pfGluM'), mv: P.gluK ? `${P.glu} mg/dL` : '?', tg: '\u2265 60 mg/dL', ok: P.gluK && P.glu >= 60 },
    { id: 'temp', l: t('pfTemp'), set: '', ctl: 'cool', ml: t('pfTempM'), mv: `${P.temp.toFixed(1)} \u00b0C`, tg: '\u2264 37.5 \u00b0C', ok: P.temp <= 37.5 }
  ].map(r => Object.assign(r, { live: r.live ?? r.ok }));
}
function postHTML() {
  const lv = S.lv, pm = (k, l) => `<button class="btn sm pm" data-pf="${k}:-1" aria-label="${esc(l)} \u2212">\u2212</button><button class="btn sm pm" data-pf="${k}:1" aria-label="${esc(l)} +">+</button>`;
  return `<div class="postb"><div class="phd"><span></span><span>${esc(t('pfSetH'))}</span><span>${esc(t('pfMeasH'))}</span></div>${postRows().map(r => `<div class="prow${lv === 1 ? (r.live ? ' ok' : ' bad') : ''}" data-row="${r.id}">
    <span class="pl"><b>${esc(r.l)}</b>${lv < 3 ? `<small>${esc(t('target'))} <span dir="ltr">${esc(r.tg)}</span></small>` : ''}</span>
    <span class="ps">${r.set ? `<b dir="ltr">${esc(r.set)}</b>` : ''}${r.ctl === 'fio2' ? `<span class="pc">${pm('fio2', 'FiO\u2082')}</span>` : r.ctl === 'rate' ? `<span class="pc">${pm('rate', t('pfVent'))}</span>` : r.ctl === 'cool' ? `<span class="pc"><button class="btn sm" data-pf="cool">${esc(t('pfCool'))}</button></span>` : r.ctl === 'nbp' ? `${!r.set && lv === 1 ? `<small class="muted">${esc(r.hint)}</small>` : ''}<span class="pc"><button class="btn sm" data-pf="nbp">${esc(t('pfNbp'))}</button></span>` : !r.set && lv === 1 ? `<small class="muted">${esc(r.hint)}</small>` : ''}</span>
    <span class="pm2"><small>${esc(r.ml)}</small><b dir="ltr" data-mv="${r.id}">${esc(r.mv)}</b></span></div>`).join('')}
    <div class="row"><button class="btn primary" data-pf="go">${esc(t('pfGo'))}</button></div></div>`;
}
/* Keep the measured column in step with the monitor while the board is open. */
function postLive() {
  if (!S.post || !S.p || S.p.type !== 'post' || S.busy) return;
  postRows().forEach(r => {
    const v = $(`[data-mv="${r.id}"]`); if (v && v.textContent !== r.mv) v.textContent = r.mv;
    if (S.lv === 1) { const row = $(`[data-row="${r.id}"]`); if (row) { row.classList.toggle('ok', !!r.live); row.classList.toggle('bad', !r.live); } }
  });
}
function postCtl(c) {
  if (!S || S.busy || S.modal || !S.p || S.p.type !== 'post') return;
  const P = S.post, [k, d] = c.split(':');
  if (k === 'fio2') { P.fi = Math.max(0, Math.min(FIO2.length - 1, P.fi + +d)); Sound.click(false); rec(`FiO\u2082 ${FIO2[P.fi]}%`); }
  else if (k === 'rate') { P.rate = Math.max(6, Math.min(70, P.rate + (S.c.kind === 'infant' ? 4 : 2) * +d)); Sound.click(false); rec(t('pfRateRec', P.rate)); }
  else if (k === 'cool') {
    if (P.temp > 37.5) { P.temp = 37.2; rec(t('pfCoolRec'), 'ok'); tlEv('cool', t('pfCool')); Sound.ok(); S.fb = null; }
    else S.fb = { t: 'note', h: t('fbFine'), m: t('pfNoFever') };
  } else if (k === 'go') { postDone(); return; }
  else if (k === 'nbp') { if (S.st.monitor && !S.nbp.busy) { Sound.ensure(); nbpStart(); postLive(); } return; }
  postApply(); renderSitu();
}
/* Cart actions while stabilizing after ROSC. */
function postAct(id) {
  const P = S.post, ok = (msg, l) => { rec(l, 'ok'); tlEv(id, l); Sound.ok(); flashBtn(id, 'flashok'); S.fb = { t: 'ok', h: t('done'), m: S.lv >= 3 ? '' : msg }; postApply(); renderSitu(); };
  const pre = ['fluid', 'vaso', 'dextrose'].includes(id) && prereq(id); if (pre) { err(pre, false, id, null, 15, t('missingStep')); return; }
  if (id === 'fluid') {
    doseDialog('fluid').then(r => {
      if (!r || !S || !S.p || S.p.type !== 'post') return;
      P.bol++;
      if (P.sbp >= P.lo) { err(t('pfFluidNo'), false, id, actName(id), 15, t('notNow'), 'rosc'); return; }
      P.sbp += P.refr ? 3 : 9; ok(P.sbp >= P.lo ? t('pfFluidOk') : t('pfFluidMore'), r);
    });
    return;
  }
  if (id === 'vaso') {
    if (P.sbp >= P.lo) { err(t('pfVasoNo'), false, id, null, 15, t('notNow'), 'rosc'); return; }
    P.vaso = true; P.sbp = P.lo + 10 + Math.floor(Math.random() * 8); ok(t('pfVasoOk'), actName(id)); return;
  }
  if (id === 'glucose') { P.gluK = true; ok(`${P.glu} mg/dL`, `${actName(id)}: ${P.glu} mg/dL`); return; }
  if (id === 'dextrose') {
    if (!P.gluK) { err(D.WHY.dextrose, false, id, null, 15, t('notNow'), 'dextrose'); return; }
    if (P.glu >= 60) { err(t('pfDexNo'), false, id, null, 15, t('notNow'), 'dextrose'); return; }
    doseDialog('dextrose').then(r => { if (!r || !S || !S.p || S.p.type !== 'post') return; P.glu = 96 + Math.floor(Math.random() * 20); ok(t('pfDexOk', P.glu), r); });
    return;
  }
  if (id === 'ecg12') { ecgPrint(); return; }
  if (['cpr', 'shock', 'sync', 'epi', 'pace'].includes(id)) { err(t('pfArrestNo'), true, id, null, 40, t('dangerous'), 'rosc'); return; }
  if (['o2', 'bvm', 'airway', 'suction', 'position', 'check', 'auscult', 'pads', 'ivio', 'hts', 'resp', 'abx', 'shout', 'ems'].includes(id)) {
    const ad = alreadyDone(id); if (id !== 'hts') effects(id); S.fb = { t: 'note', h: t('fbFine'), m: ad || t('pfFine') }; renderSitu(); return;
  }
  err(t('pfNotNow'), false, id, null, 15, t('notNow'), 'rosc');
}
function postDone() {
  const p = S.p, bad = postRows().filter(r => !r.ok), MS = t('pfMiss');
  S.busy = true;
  bad.forEach(r => { S.score -= 20; S.weak.add('rosc'); S.errs.push({ k: p.k, msg: MS[r.id], what: `${r.l}: ${r.v}` }); rec(`\u2717 ${r.l}: ${r.v}`, 'bad'); tlEv('err', r.l); });
  scorePhase(); updScore();
  rec(t('pfGoRec'), bad.length ? 'bad' : 'ok');
  const teach = t('postTeach'); S.teach.push({ k: p.k, t: teach });
  S.fb = bad.length ? { t: 'bad', h: t('pfGoBad', bad.length), m: S.lv >= 3 ? bad.map(r => r.l).join(', ') : bad.map(r => MS[r.id]).join(' '), teach: S.lv >= 3 ? null : teach }
    : { t: 'ok', h: t('correct'), m: t('pfGoOk'), teach: S.lv >= 3 ? null : teach };
  if (bad.length) Sound.bad(); else Sound.ok();
  dimCart(true); renderSitu();
  setTimeout(() => { if (S) nextPhase(); }, bad.length ? 2600 : 1200);
}

/* ================= Timeline (debrief) ================= */
function tlTrack() {
  if (!S || !S.tl) return;
  const st = S.st, tl = S.tl, last = tl.seg[tl.seg.length - 1], key = st.monitor ? `${st.rhythm}|${st.pulse}` : 'off';
  if (!last || last.key !== key) {
    if (last && last.t === S.codeT) tl.seg.pop();
    tl.seg.push({ t: S.codeT, key, r: st.rhythm, hr: st.hr, p: st.pulse, mon: st.monitor });
  }
  if (st.cpr && tl.cprOn === null) tl.cprOn = S.codeT;
  if (!st.cpr && tl.cprOn !== null) { tl.cpr.push([tl.cprOn, S.codeT]); tl.cprOn = null; }
}
function tlEv(id, l) { if (S && S.tl) S.tl.ev.push({ t: S.codeT, id, l: String(l || '') }); }
const RX_SHORT = { vf: 'VF', vt: 'VT', torsades: 'TdP', asystole: 'Asys', pea: 'PEA', nsr: 'SR', stach: 'ST', sbrady: 'SB', svt: 'SVT', avb1: '1\u00b0AVB', mobitz1: 'Mobitz I', mobitz2: 'Mobitz II', avb3: 'CHB', aflutter: 'AFL', afib: 'AF', paced: 'Paced' };
const TL_TAG = { atropine: 'Atr', adenosine: 'Ado', amio: 'Amio', lido: 'Lido', procain: 'Proc', naloxone: 'Nal', dextrose: 'Dex', mag: 'Mg', fluid: 'Bolus', vaso: 'Vaso', epiim: 'Epi IM', abx: 'Abx', dexa: 'Dexa', antihist: 'Diph', albuterol: 'Salb', nebepi: 'Neb', ivio: 'IV/IO', airway: 'ETT', pace: 'Pace', needle: 'Needle', vagal: 'Vagal', pads: 'Pads', cool: 'Cool', cqswap: 'Swap', cqlow: 'CPR\u2193', worse: 'Worse' };
function timelineHTML() {
  const tl = S.tl, T = Math.max(20, S.codeT), W = 640, L = 62, X = v => L + Math.max(0, Math.min(1, v / T)) * (W - L - 14);
  const segs = tl.seg.map((s, i) => Object.assign({}, s, { i, t1: i + 1 < tl.seg.length ? tl.seg[i + 1].t : T })).filter(s => s.t1 > s.t);
  const LB = t('tlLanes');
  let h = `<text x="4" y="27" class="tll">${esc(LB[0])}</text><text x="4" y="47" class="tll">${esc(LB[1])}</text><text x="4" y="70" class="tll">${esc(LB[2])}</text><text x="4" y="134" class="tll">${esc(LB[3])}</text>`;
  segs.forEach(s => {
    const x0 = X(s.t), x1 = Math.max(x0 + 2, X(s.t1)), cls = !s.mon ? 'off' : !s.p && ['vf', 'vt', 'torsades'].includes(s.r) ? 'shk' : !s.p ? 'arr' : 'pul';
    const name = !s.mon ? '' : s.r === 'vt' && !s.p ? 'pVT' : (RX_SHORT[s.r] || s.r);
    h += `<g class="tlseg ${cls}"${s.mon ? ` data-seg="${s.i}"` : ''}><title>${mmss(s.t)}\u2013${mmss(s.t1)} ${esc(name || t('tlNoMon'))}</title><rect x="${x0}" y="16" width="${x1 - x0}" height="16" rx="3"/>${x1 - x0 > 30 && name ? `<text x="${(x0 + x1) / 2}" y="27.5" text-anchor="middle">${esc(name)}</text>` : ''}</g>`;
  });
  tl.cpr.concat(tl.cprOn !== null ? [[tl.cprOn, T]] : []).forEach(([a, b]) => { h += `<rect class="tlcpr" x="${X(a)}" y="40" width="${Math.max(2, X(b) - X(a))}" height="9" rx="2"/>`; });
  const epis = tl.ev.filter(e => e.id === 'epi');
  epis.forEach((e, i) => {
    if (!i) return;
    const a = epis[i - 1], d = e.t - a.t, ok = d >= 170 && d <= 310;
    h += `<path class="tlbr ${ok ? 'ok' : 'bad'}" d="M${X(a.t)} 96 v4 H${X(e.t)} v-4"/><text class="tlbt ${ok ? 'ok' : 'bad'}" x="${(X(a.t) + X(e.t)) / 2}" y="110" text-anchor="middle">${mShort(d)}</text>`;
  });
  const rowEnd = [-99, -99];
  tl.ev.forEach(e => {
    const x = X(e.t), tip = `<title>${mmss(e.t)} ${esc(e.l)}</title>`;
    if (e.id === 'err') { h += `<g class="tlerr">${tip}<text x="${x}" y="62" text-anchor="middle">\u2715</text></g>`; return; }
    let mark, lab;
    if (e.id === 'shock' || e.id === 'sync') { const j = /(\d+(?:\.\d+)?)\s*J/.exec(e.l); mark = `<path class="tlshock" d="M${x + 1} 56 l-5 8 h4 l-2 7 6 -9 h-4 z"/>`; lab = (e.id === 'sync' ? 'Sync ' : '') + (j ? j[1] + ' J' : '\u26a1'); }
    else if (e.id === 'epi') { mark = `<path class="tlepi" d="M${x} 57 l5 6 -5 6 -5 -6 z"/>`; lab = 'Epi'; }
    else if (TL_TAG[e.id]) { mark = `<circle class="tldot t-${e.id}" cx="${x}" cy="63" r="3.6" style="--dc:${DRUG_COL[e.id] || 'var(--mut)'}"/>`; lab = TL_TAG[e.id]; }
    else return;
    /* labels go in the first of two rows where they do not collide; otherwise only the marker (with its tooltip) */
    const w = lab.length * 5.6 + 6, r = rowEnd.findIndex(end => x - w / 2 > end);
    if (r >= 0) rowEnd[r] = x + w / 2;
    h += `<g class="tlev">${tip}${mark}${r >= 0 ? `<text x="${x}" y="${r ? 90 : 80}" text-anchor="middle">${esc(lab)}</text>` : ''}</g>`;
  });
  const line = (k, fy) => {
    let d = '', pen = false;
    tl.sm.forEach(s => { const v = s[k]; if (v == null) { pen = false; return; } d += `${pen ? 'L' : 'M'}${X(s[0]).toFixed(1)} ${fy(v).toFixed(1)} `; pen = true; });
    return d;
  };
  const yS = v => 152 - (Math.max(50, Math.min(100, v)) - 50) / 50 * 34, yC = v => 152 - Math.min(60, v) / 60 * 34;
  h += `<path class="tlref" d="M${L} ${yC(10)} H${W - 14}"/><text class="tlrt" x="${W - 12}" y="${yC(10) + 3}">10</text>`;
  h += `<path class="tlsp" d="${line(1, yS)}"/><path class="tlco" d="${line(2, yC)}"/>`;
  const step = T > 900 ? 180 : T > 420 ? 120 : T > 200 ? 60 : 30;
  for (let s = 0; s <= T + 0.5; s += step) h += `<path class="tlax" d="M${X(s)} 156 v4"/><text class="tlat" x="${X(s)}" y="170" text-anchor="middle">${mShort(s)}</text>`;
  return `<h3>${esc(t('tlTitle'))}</h3><div class="tlwrap"><svg class="tl" viewBox="0 0 ${W} 176" role="img" aria-label="${esc(t('tlTitle'))}">${h}</svg></div>
    <div class="tlkey"><span class="k shk">${esc(t('tlKey')[0])}</span><span class="k arr">${esc(t('tlKey')[1])}</span><span class="k pul">${esc(t('tlKey')[2])}</span><span class="k cpr">${esc(t('tlKey')[3])}</span><span class="k sp">SpO\u2082</span><span class="k co">EtCO\u2082</span></div>
    <p class="muted small">${esc(t('tlNote'))}</p><div class="ecgpaper tlstrip" id="tlStrip" hidden><canvas></canvas></div>`;
}

function doseDialog(key) {
  if (S.lv >= 3 && ANS[key]) return typedDose(key);
  return new Promise(res => {
    const w = S.c.wt, d = D.DOSE[key](w), opts = shuffle(d.opts);
    const m = modal(`<div class="sheet" role="dialog" aria-modal="true" data-key="${key}">
      <div class="eyebrow">${esc(S.c.age)} \u00b7 ${D.f(w)} ${t('kg')} \u00b7 ${esc(t('zoneWord', D.zoneFor(w).n))}</div>
      <h2>${esc(d.title)}</h2>
      <p class="muted">${esc(t('pickDose'))}</p>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}">${kbd(i + 1)}${esc(o.t)}</button>`).join('')}</div>
      <p class="why" id="dwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
    m.el.addEventListener('click', e => {
      const b = e.target.closest('[data-i]');
      if (b) {
        const o = opts[+b.dataset.i];
        if (o.ok) { b.classList.add('right'); setTimeout(() => { m.close(); res(d.rec); }, 320); }
        else if (!b.classList.contains('wrong')) {
          b.classList.add('wrong');
          const y = $('#dwhy', m.el); y.hidden = false; y.innerHTML = S.lv >= 3 ? esc(t('typedWrongShort')) : `${esc(o.why)}<br><span class="rule">${esc(t('rule'))}: ${esc(d.rule)}</span>`;
          err(`${o.why} ${t('rule')}: ${d.rule}.`, true, null, `${d.title}: ${o.t}`, 35, t('wrongDose'), DOSE_TOPIC[key]);
        }
      } else if (e.target.closest('[data-x]')) { m.close(); res(null); }
    });
  });
}
function typedDose(key) {
  return new Promise(res => {
    const w = S.c.wt, d = D.DOSE[key](w), unit = ANS[key](w)[1];
    let tries = 0;
    const m = modal(`<div class="sheet" role="dialog" aria-modal="true" data-key="${key}" data-typed="1">
      <div class="eyebrow">${esc(S.c.age)} \u00b7 ${D.f(w)} ${t('kg')}</div>
      <h2>${esc(d.title)}</h2>
      <p class="muted">${esc(t('typeDose'))}</p>
      <form class="typed" autocomplete="off"><input id="tdv" type="text" inputmode="decimal" dir="ltr" aria-label="${esc(t('typeDose'))}"><span class="tu" dir="ltr">${esc(unit)}</span><button class="btn primary" type="submit">${esc(t('give'))}</button></form>
      <p class="why" id="dwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-x type="button">${esc(t('cancel'))}</button></div></div>`);
    const inp = $('#tdv', m.el); setTimeout(() => inp.focus(), 40);
    $('form', m.el).addEventListener('submit', e => {
      e.preventDefault();
      const raw = (inp.value || '').replace(',', '.').trim(), x = parseFloat(raw.split(/[-\u2013]/)[0]);
      if (!raw || isNaN(x)) return;
      if (doseOk(key, w, x)) { inp.classList.add('right'); setTimeout(() => { m.close(); res(d.rec); }, 320); return; }
      tries++; inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong');
      const y = $('#dwhy', m.el); y.hidden = false;
      y.textContent = tries >= 2 ? `${t('typedWrong')} ${t('typedReveal', ansText(key, w))}` : t('typedWrong');
      err(`${t('youGave')} ${raw} ${unit}. ${t('rule')}: ${d.rule} (${ansText(key, w)}).`, true, null, `${d.title}: ${raw} ${unit}`, 35, t('wrongDose'), DOSE_TOPIC[key]);
      inp.select();
    });
    m.el.addEventListener('click', e => { if (e.target.closest('[data-x]')) { m.close(); res(null); } });
  });
}
/* ================= Realistic equipment ================= */
/* Concentration (per mL) of what is in the drawer, for drawing up volumes. */
const CONC = { epi: [0.1, 'mg'], epiim: [1, 'mg'], atropine: [0.1, 'mg'], adenosine: [3, 'mg'], amio: [50, 'mg'], lido: [20, 'mg'], procain: [100, 'mg'], naloxone: [0.4, 'mg'] };
/* Drawer contents. Labels are printed in English, like real stock. kind picks the drawing; bad = a look-alike that is wrong. */
const REAL_ITEMS = {
  drug: [
    /* stocked the way it comes from the pharmacy: one 1 mg/mL ampoule for every route */
    { act: 'epi', amp: true, kind: 'amp', cap: '#b48cff', name: 'EPINEPHrine', conc: '1 mg/mL \u00b7 1:1000', pack: '1 mg / 1 mL' },
    { act: 'atropine', kind: 'amp', cap: '#5fd38d', name: 'ATROPine', conc: '1 mg/mL', pack: '1 mg / 1 mL' },
    { act: 'adenosine', kind: 'vial', cap: '#e9eef0', name: 'ADENOSine', conc: '3 mg/mL', pack: '6 mg / 2 mL' },
    { act: 'amio', kind: 'amp', cap: '#e9eef0', name: 'AMIODarone', conc: '50 mg/mL', pack: '150 mg / 3 mL' },
    { act: 'lido', kind: 'syr', cap: '#9aa7ad', name: 'LIDOcaine 2%', conc: '20 mg/mL', pack: '100 mg / 5 mL' },
    { act: 'procain', kind: 'vial', cap: '#e9eef0', name: 'PROCAINAMIDE', conc: '100 mg/mL', pack: '1 g / 10 mL' },
    { act: 'naloxone', kind: 'amp', cap: '#64a8ff', name: 'NALOXone', conc: '0.4 mg/mL', pack: '0.4 mg / 1 mL' },
    { act: 'mag', kind: 'vial', cap: '#e9eef0', name: 'MAGNESIUM SULFATE', conc: '50% \u00b7 500 mg/mL', pack: '1 g / 2 mL' },
    { act: 'dexa', kind: 'vial', cap: '#ffb46b', name: 'DEXAMETHasone', conc: '4 mg/mL', pack: '4 mg / 1 mL' },
    { act: 'antihist', kind: 'vial', cap: '#ffb46b', name: 'DiphenhydrAMINE', conc: '50 mg/mL', pack: '50 mg / 1 mL' },
    { act: 'abx', kind: 'vial', cap: '#ff9a6b', name: 'CefTRIAXone', conc: 'powder', pack: '1 g for IV use' },
    /* look-alikes stocked in real carts, shown from Clinical level */
    { bad: 'kcl', lv: 2, kind: 'vial', cap: '#d23a4a', name: 'POTASSIUM CHLORIDE', conc: '2 mEq/mL \u00b7 CONCENTRATE', pack: 'MUST BE DILUTED' },
    { bad: 'cacl', lv: 2, kind: 'syr', cap: '#e9eef0', name: 'CALCIUM CHLORIDE 10%', conc: '100 mg/mL', pack: '1 g / 10 mL' },
    { bad: 'bicarb', lv: 2, kind: 'syr', cap: '#9fd8ff', name: 'SODIUM BICARBONATE 8.4%', conc: '1 mEq/mL', pack: '50 mEq / 50 mL' },
    { bad: 'd50', lv: 2, kind: 'syr', cap: '#ffd23f', name: '50% DEXTROSE', conc: '0.5 g/mL', pack: '25 g / 50 mL' }
  ],
  line: [
    { act: 'ivio', kind: 'io', name: 'EZ-IO', conc: 'IO driver', pack: '15 / 25 mm needles' },
    { act: 'ivio', kind: 'cann', name: 'IV CANNULA', conc: '22G / 24G', pack: 'peripheral IV' },
    { act: 'fluid', kind: 'bag', cap: '#3d8bff', name: '0.9% SODIUM CHLORIDE', conc: 'isotonic', pack: '500 mL' },
    { act: 'fluid', kind: 'bag', cap: '#35c46a', name: 'LACTATED RINGER\u2019S', conc: 'isotonic', pack: '500 mL' },
    { bad: 'd5w', kind: 'bag', cap: '#ffd23f', name: '5% DEXTROSE', conc: 'D5W', pack: '500 mL' },
    { act: 'dextrose', kind: 'bag', cap: '#ff8a2a', name: '10% DEXTROSE', conc: 'D10W \u00b7 100 mg/mL', pack: '250 mL' },
    { act: 'vaso', kind: 'pump', name: 'INFUSION PUMP', conc: 'vasoactive drip', pack: '' },
    { act: 'glucose', kind: 'gluco', name: 'GLUCOMETER', conc: 'point of care', pack: '' },
    { act: 'labs', kind: 'tubes', name: 'BLOOD TUBES', conc: 'gas \u00b7 chem \u00b7 CBC', pack: '' }
  ],
  air: [
    { act: 'o2', kind: 'nrb', name: 'NON-REBREATHER', conc: 'O\u2082 10-15 L/min', pack: 'pediatric mask' },
    { act: 'suction', kind: 'yank', name: 'YANKAUER', conc: 'suction', pack: 'max 10 s per pass' },
    { act: 'airway', kind: 'ett', name: 'ETT + LARYNGOSCOPE', conc: 'cuffed tubes', pack: '+ capnography' },
    { act: 'albuterol', kind: 'neb', cap: '#5fd38d', name: 'ALBUTEROL', conc: 'nebulizer', pack: '2.5 mg / 3 mL' },
    { act: 'nebepi', kind: 'neb', cap: '#b48cff', name: 'EPINEPHrine', conc: 'for nebulization', pack: '1 mg/mL' },
    { act: 'needle', kind: 'cath', name: '14G CATHETER', conc: 'needle decompression', pack: 'over-the-needle' }
  ]
};
function itemSVG(it) {
  const cap = it.cap || '#9aa7ad', lab = '<rect x="13" y="38" width="34" height="26" rx="2" fill="#f3f6f7"/><rect x="13" y="38" width="34" height="6" fill="' + cap + '"/>';
  switch (it.kind) {
    case 'vial': return `<svg viewBox="0 0 60 80"><rect x="18" y="6" width="24" height="9" rx="2" fill="${cap}"/><rect x="21" y="14" width="18" height="6" fill="#aab6bc"/><path d="M14 22h32v46a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="rgba(210,235,245,.35)" stroke="#d6eef8"/>${lab}<path d="M16 66h28" stroke="#d6eef8" opacity=".5"/></svg>`;
    case 'amp': return `<svg viewBox="0 0 60 80"><path d="M26 4h8v10l4 6v6h-16v-6l4-6z" fill="rgba(210,235,245,.35)" stroke="#d6eef8"/><path d="M24 20h12" stroke="${cap}" stroke-width="3"/><path d="M18 26h24v44a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z" fill="rgba(210,235,245,.35)" stroke="#d6eef8"/><rect x="18" y="40" width="24" height="22" rx="1.5" fill="#f3f6f7"/><rect x="18" y="40" width="24" height="5" fill="${cap}"/></svg>`;
    case 'syr': return `<svg viewBox="0 0 60 80"><rect x="27" y="2" width="6" height="10" rx="1" fill="#c7d3d8"/><rect x="20" y="10" width="20" height="4" rx="1" fill="#c7d3d8"/><rect x="22" y="14" width="16" height="54" rx="3" fill="rgba(210,235,245,.3)" stroke="#d6eef8"/><rect x="22" y="22" width="16" height="30" fill="#f3f6f7"/><rect x="22" y="22" width="16" height="5" fill="${cap}"/><path d="M28 68h4v6h-4z" fill="#c7d3d8"/><rect x="25" y="73" width="10" height="5" rx="1" fill="${cap}"/></svg>`;
    case 'bag': return `<svg viewBox="0 0 60 80"><rect x="25" y="2" width="10" height="6" rx="2" fill="#c7d3d8"/><path d="M10 8h40v52a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10z" fill="rgba(210,235,245,.28)" stroke="#d6eef8"/><rect x="14" y="16" width="32" height="26" rx="2" fill="#f3f6f7"/><rect x="14" y="16" width="32" height="6" fill="${cap}"/><path d="M24 70v8M36 70v8" stroke="#c7d3d8" stroke-width="3"/></svg>`;
    case 'io': return `<svg viewBox="0 0 60 80"><path d="M14 24h26a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8H30v22H18V48h-4z" fill="#d23a4a" stroke="#ff8f99"/><rect x="18" y="58" width="12" height="4" fill="#8a1f2b"/><path d="M48 36h8" stroke="#c7d3d8" stroke-width="3"/><path d="M56 36h3" stroke="#e9eef0" stroke-width="1.4"/><circle cx="58" cy="36" r="2" fill="#3d8bff"/></svg>`;
    case 'cann': return `<svg viewBox="0 0 60 80"><path d="M30 6v20" stroke="#c7d3d8" stroke-width="1.6"/><path d="M22 26h16l-2 10H24z" fill="#ffd23f"/><path d="M24 36h12v14H24z" fill="rgba(210,235,245,.4)" stroke="#d6eef8"/><path d="M27 50h6v18l-3 6-3-6z" fill="#3d8bff"/></svg>`;
    case 'pump': return `<svg viewBox="0 0 60 80"><rect x="8" y="12" width="44" height="56" rx="5" fill="#dfe6ea" stroke="#7d8f98"/><rect x="13" y="18" width="34" height="16" rx="2" fill="#062a1c"/><path d="M16 27h6l2-4 3 8 2-4h12" stroke="#3ef08f" stroke-width="1.2" fill="none"/><circle cx="18" cy="46" r="3.5" fill="#3d8bff"/><circle cx="30" cy="46" r="3.5" fill="#3ef08f"/><circle cx="42" cy="46" r="3.5" fill="#ff5d73"/><rect x="14" y="56" width="32" height="6" rx="2" fill="#9aa7ad"/></svg>`;
    case 'gluco': return `<svg viewBox="0 0 60 80"><rect x="14" y="10" width="32" height="56" rx="8" fill="#3f4b52" stroke="#5f6f7a"/><rect x="19" y="16" width="22" height="18" rx="2" fill="#cfe9d8"/><text x="30" y="29" font-family="monospace" font-size="9" text-anchor="middle" fill="#123">mg/dL</text><circle cx="30" cy="46" r="5" fill="#5f6f7a"/><rect x="26" y="64" width="8" height="12" fill="#e9eef0"/><path d="M30 70c-2 3-2 5 0 5s2-2 0-5z" fill="#e0303f"/></svg>`;
    case 'nrb': return `<svg viewBox="0 0 60 80"><path d="M16 22c0-10 6-16 14-16s14 6 14 16v12c0 10-6 16-14 16s-14-6-14-16z" fill="rgba(200,240,255,.3)" stroke="#bfefff" stroke-width="1.4"/><ellipse cx="30" cy="66" rx="12" ry="9" fill="rgba(166,240,198,.35)" stroke="#a6f0c6"/><path d="M30 50v8" stroke="#a6f0c6" stroke-width="2"/><path d="M44 28c8 2 10 12 4 20" stroke="#a6f0c6" stroke-width="1.6" fill="none"/></svg>`;
    case 'yank': return `<svg viewBox="0 0 60 80"><path d="M30 6c-10 0-12 14-6 30l6 40" stroke="#e8f6ff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 6c-10 0-12 14-6 30l6 40" stroke="#9fd8ff" stroke-width="1.5" fill="none" opacity=".6"/><rect x="38" y="44" width="16" height="30" rx="3" fill="rgba(210,235,245,.3)" stroke="#d6eef8"/><rect x="38" y="60" width="16" height="14" fill="rgba(255,120,120,.35)"/></svg>`;
    case 'ett': return `<svg viewBox="0 0 60 80"><path d="M10 10h10v8l14 40" stroke="#9aa7ad" stroke-width="5" fill="none" stroke-linejoin="round"/><circle cx="34" cy="60" r="2" fill="#ffd84a"/><path d="M44 6v52a10 10 0 0 0 10 10" stroke="#e8f6ff" stroke-width="4" fill="none"/><ellipse cx="46" cy="62" rx="4" ry="2.5" fill="rgba(140,200,255,.6)"/><rect x="41" y="2" width="6" height="6" rx="1" fill="#f3f6f7"/></svg>`;
    case 'neb': return `<svg viewBox="0 0 60 80"><path d="M18 40h24l-4 26H22z" fill="rgba(210,235,245,.3)" stroke="#d6eef8"/><path d="M20 54h20" stroke="${cap}" stroke-width="5" opacity=".8"/><path d="M30 40V28M24 28h12" stroke="#d6eef8" stroke-width="2"/><path d="M22 20c3 3 5 3 8 0s5-3 8 0M24 12c2 2 4 2 6 0s4-2 6 0" stroke="#cfe5ff" stroke-width="1.4" fill="none"/><path d="M30 66v10" stroke="#a6f0c6" stroke-width="2"/></svg>`;
    case 'cath': return `<svg viewBox="0 0 60 80"><path d="M30 4v34" stroke="#c7d3d8" stroke-width="1.6"/><path d="M26 38h8v8h-8z" fill="#ff8a2a"/><path d="M24 46h12l-1 14H25z" fill="rgba(210,235,245,.4)" stroke="#d6eef8"/><path d="M27 60h6v16h-6z" fill="#ff8a2a"/></svg>`;
    case 'tubes': return `<svg viewBox="0 0 60 80">${[['#7d8f98', 10], ['#a85cff', 24], ['#e0303f', 38]].map(([c, x]) => `<rect x="${x}" y="8" width="12" height="9" rx="2" fill="${c}"/><path d="M${x + 1} 17h10v46a5 5 0 0 1-10 0z" fill="rgba(210,235,245,.3)" stroke="#d6eef8"/><path d="M${x + 1} 40h10v23a5 5 0 0 1-10 0z" fill="#9e1f2c"/><rect x="${x + 1}" y="24" width="10" height="12" fill="#f3f6f7"/>`).join('')}</svg>`;
  }
  return '';
}
function realItemsHTML(tab) {
  const items = REAL_ITEMS[tab].filter(it => !it.lv || S.lv >= it.lv);
  return items.map((it, i) => {
    const cap = it.amp ? t('rlEpiCap') : it.act ? actName(it.act) : it.bad === 'd5w' ? t('rlD5W') : '';
    return `<button class="ritem k-${it.kind}" ${it.amp ? `data-amp="${it.act}"` : it.act ? `data-act="${it.act}"` : `data-bad="${it.bad}"`} title="${esc(cap || it.name)}"><span class="rpic">${itemSVG(it)}</span><span class="rlabel" dir="ltr" lang="en" style="--cap:${it.cap || '#9aa7ad'}"><b>${esc(it.name)}</b><i>${esc(it.conc)}</i>${it.pack ? `<i>${esc(it.pack)}</i>` : ''}</span>${S.lv < 2 && cap ? `<span class="rcap">${esc(cap)}</span>` : ''}${kbd(keyLabel(i))}</button>`;
  }).join('');
}
function realBad(key) {
  if (!S || S.busy || !S.started || S.modal || !S.p || S.p.type === 'q') return;
  if (key === 'd5w') { err(t('rlD5Wwhy'), false, null, '5% DEXTROSE', 25, t('notNow'), 'fluid'); return; }

  const it = REAL_ITEMS.drug.find(x => x.bad === key), name = it ? it.name : key, H = D.HTS;
  /* Calcium and bicarbonate do have a place: hyperkalemia, acidosis and some toxins. */
  const causes = S.c.phases.map(p => p.hts && p.hts.ans).filter(Boolean);
  if ((key === 'cacl' || key === 'bicarb') && [H[2], H[3], H[8]].some(h => causes.includes(h))) { rec(name, 'ok'); tlEv(key, name); S.fb = { t: 'note', h: t('fbFine'), m: t('rlBadHts') }; renderSitu(); return; }
  if (key === 'd50' && S.c.kind === 'teen') { S.fb = { t: 'note', h: t('fbFine'), m: t('rlD50teen') }; renderSitu(); return; }
  err(t('rlBad')[key], key === 'kcl', null, name, key === 'kcl' ? 40 : 25, key === 'kcl' ? t('dangerous') : t('notNow'), key === 'd50' ? 'dextrose' : 'doses');
}
/* Ampoules that are diluted before an IV/IO push: stock 1 mg/mL, working strength 0.1 mg/mL (1 mL + 9 mL saline). */
const DILUTE = { epi: { name: 'EPINEPHrine', cap: '#b48cff', topic: 'epi', danger: true }, atropine: { name: 'ATROPine', cap: '#5fd38d', topic: 'atropine', danger: false } };
const itemFor = id => REAL_ITEMS.drug.find(x => x.act === (id === 'epiim' ? 'epi' : id));
/* The epinephrine ampoule serves every route: choose it first, then the dose and preparation follow. */
function routeChooser() {
  if (!S || S.busy || !S.started || S.modal || !S.p || S.p.type === 'q') return;
  const it = itemFor('epi');
  const m = modal(`<div class="sheet route" role="dialog" aria-modal="true">
    <div class="duhd"><span class="rpic">${itemSVG(it)}</span><div class="rlabel big" dir="ltr" lang="en"><b>${esc(it.name)}</b><i>${esc(it.conc)}</i><i>${esc(it.pack)}</i></div></div>
    <h2>${esc(t('rtQ'))}</h2>
    <div class="opts">${[['epi', t('rtIV')], ['epiim', t('rtIM')]].map(([a, l], i) => `<button class="opt" data-rt="${a}">${kbd(i + 1)}${esc(l)}</button>`).join('')}</div>
    <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
  m.el.addEventListener('click', e => {
    const b = e.target.closest('[data-rt]');
    if (b) { m.close(); doAction(b.dataset.rt); } else if (e.target.closest('[data-x]')) m.close();
  });
}
/* Dilution of a 1 mg/mL ampoule: four ways to prepare it, one right. */
function prepDilution(id) {
  return new Promise(res => {
    const dd = DILUTE[id], it = itemFor(id);
    const opts = shuffle([
      { t: t('prMix', 9, '0.1'), ok: true },
      { t: t('prMix', 4, '0.2'), why: t('prWhy2') },
      { t: t('prMix', 99, '0.01'), why: t('prWhy01') },
      { t: t('prNone'), why: t('prWhyNone'), danger: dd.danger }
    ]);
    const m = modal(`<div class="sheet prep" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('prTitle'))}</div>
      <div class="duhd"><span class="rpic">${itemSVG(it)}</span><div class="rlabel big" dir="ltr" lang="en"><b>${esc(it.name)}</b><i>${esc(it.conc)}</i><i>${esc(it.pack)}</i></div></div>
      <p>${esc(t('prQ'))}</p>
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-pr="${i}"${o.ok ? ' data-ok="1"' : ''}>${kbd(i + 1)}${esc(o.t)}</button>`).join('')}</div>
      <p class="why" id="prwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
    m.el.addEventListener('click', e => {
      const b = e.target.closest('[data-pr]');
      if (b && !b.classList.contains('wrong') && !b.classList.contains('right')) {
        const o = opts[+b.dataset.pr];
        if (o.ok) { b.classList.add('right'); rec(`${dd.name}: ${o.t}`, 'ok'); setTimeout(() => { m.close(); res(true); }, 300); return; }
        b.classList.add('wrong'); const y = $('#prwhy', m.el); y.hidden = false; y.textContent = S.lv >= 3 ? t('typedWrongShort') : o.why;
        err(o.why, !!o.danger, null, `${dd.name}: ${o.t}`, o.danger ? 40 : 20, t('rlConcErr'), dd.topic);
      } else if (e.target.closest('[data-x]')) { m.close(); res(false); }
    });
  });
}
/* Draw-up: after the dose, how many mL from this concentration. */
function drawUp(id, key) {
  return new Promise(res => {
    const cc = CONC[id], a = ANS[key] && ANS[key](S.c.wt);
    if (!cc || !a || Array.isArray(a[0])) { res(true); return; }
    const dd = DILUTE[id], dose = a[0], ml = dose / cc[0], f = D.f;
    /* after dilution the label is the syringe you just made up */
    const it = dd ? { kind: 'syr', cap: dd.cap, name: dd.name, conc: '0.1 mg/mL', pack: t('prDiluted') } : itemFor(id);
    const typed = S.lv >= 3;
    const opts = shuffle([...new Set([f(ml), f(ml * 10), f(ml / 10), f(dose)])]).slice(0, 4);
    if (!opts.includes(f(ml))) opts[0] = f(ml);
    const m = modal(`<div class="sheet drawup" role="dialog" aria-modal="true" ${typed ? 'data-typed="1"' : ''}>
      <div class="eyebrow">${esc(t('rlDrawUp'))}</div>
      <div class="duhd"><span class="rpic">${itemSVG(it || { kind: 'vial' })}</span><div class="rlabel big" dir="ltr" lang="en"><b>${esc(it ? it.name : '')}</b><i>${esc(it ? it.conc : '')}</i><i>${esc(it ? it.pack : '')}</i></div></div>
      <p>${esc(t('rlDoseIs', f(dose) + ' ' + cc[1]))}</p>
      <p class="muted">${esc(t('rlHowMuch'))}</p>
      ${typed ? `<form class="typed" autocomplete="off"><input id="tdv" type="text" inputmode="decimal" dir="ltr"><span class="tu">mL</span><button class="btn primary" type="submit">${esc(t('rlDraw'))}</button></form>` : `<div class="opts">${opts.map((o, i) => `<button class="opt" data-ml="${o}" dir="ltr">${kbd(i + 1)}${o} mL</button>`).join('')}</div>`}
      <p class="why" id="dwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-x type="button">${esc(t('cancel'))}</button></div></div>`);
    const check = x => {
      if (Math.abs(x - ml) <= Math.max(ml * 0.1, 0.05)) { setTimeout(() => { m.close(); res(true); }, 280); return true; }
      const y = $('#dwhy', m.el); y.hidden = false; y.textContent = S.lv >= 3 ? t('typedWrongShort') : t('rlVolWhy', f(dose) + ' ' + cc[1], cc[0] + ' ' + cc[1] + '/mL', f(ml));
      err(t('rlVolErr', x, f(ml)), true, null, `${it ? it.name : ''}: ${x} mL`, 35, t('rlWrongVol'), DOSE_TOPIC[key]);
      return false;
    };
    if (typed) {
      const inp = $('#tdv', m.el); setTimeout(() => inp.focus(), 40);
      $('form', m.el).addEventListener('submit', e => { e.preventDefault(); const x = parseFloat((inp.value || '').replace(',', '.')); if (isNaN(x)) return; if (check(x)) inp.classList.add('right'); else { inp.classList.remove('wrong'); void inp.offsetWidth; inp.classList.add('wrong'); inp.select(); } });
    }
    m.el.addEventListener('click', e => {
      const b = e.target.closest('[data-ml]');
      if (b && !b.classList.contains('wrong')) { if (check(parseFloat(b.dataset.ml))) b.classList.add('right'); else b.classList.add('wrong'); }
      else if (e.target.closest('[data-x]')) { m.close(); res(false); }
    });
  });
}
/* Defibrillator: 1 select energy on the dial, 2 charge, 3 shock. SYNC is a toggle on the device. */
const ENERGIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 50, 70, 85, 100, 120, 150, 200];
function energyOk(key, j) {
  const [v] = ANS[key](S.c.wt);
  if (Array.isArray(v)) return j >= v[0] * 0.85 && j <= v[1] * 1.15;
  const near = ENERGIES.reduce((a, b) => Math.abs(b - v) < Math.abs(a - v) ? b : a);
  return j === near || Math.abs(j - v) / v <= 0.2;
}
function knobSVG(frac, label) {
  const ang = -135 + frac * 270;
  return `<svg viewBox="0 0 120 120" class="knob"><circle cx="60" cy="60" r="52" fill="#20282e" stroke="#47555f" stroke-width="2"/>${[...Array(11)].map((_, i) => { const a = (-135 + i * 27) * Math.PI / 180; return `<path d="M${60 + 44 * Math.sin(a)} ${60 - 44 * Math.cos(a)} L ${60 + 50 * Math.sin(a)} ${60 - 50 * Math.cos(a)}" stroke="#7d8f98" stroke-width="2"/>`; }).join('')}<g transform="rotate(${ang} 60 60)"><circle cx="60" cy="60" r="34" fill="#3a464f" stroke="#5f6f7a"/><rect x="57" y="28" width="6" height="22" rx="3" fill="#ffd84a"/></g><text x="60" y="66" text-anchor="middle" font-family="monospace" font-size="15" font-weight="700" fill="#e9eef0">${label}</text></svg>`;
}
function defibPanel(syncOn) {
  return new Promise(res => {
    /* the device keeps its energy and SYNC setting between uses in a case, like a real defibrillator */
    const w = S.c.wt, dev = S.dev; let ei = dev.ei ?? -1, sync = syncOn ? true : !!dev.sync, stage = 0, timer = null;
    const m = modal(`<div class="sheet wide defib" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('rlDefib'))} \u00b7 ${esc(S.c.age)} \u00b7 ${D.f(w)} ${t('kg')}</div>
      <div class="dfbody">
        <div class="dfscreen"><canvas id="dfcv"></canvas><div class="dfread"><b id="dfJ">--- J</b><span id="dfSync" class="dfsync">SYNC</span><span id="dfSt" class="dfst"></span></div></div>
        <div class="dfctl dfc3">
          <div class="dfrow"><span class="dfn">1</span><span class="dfl">${esc(t('rlEnergy'))}</span></div>
          <div class="dfdial"><button class="dfpm" data-e="-1" aria-label="-">\u2212</button><div id="dfKnob">${knobSVG(0, '---')}</div><button class="dfpm" data-e="1" aria-label="+">+</button></div>
          <button class="dfkey dfsyncb" data-sync aria-pressed="false">SYNC</button>
          <div class="dfrow"><span class="dfn">2</span><span class="dfl">${esc(t('rlCharge'))}</span></div>
          <button class="dfkey dfcharge" data-charge disabled>CHARGE</button>
          <div class="dfrow"><span class="dfn">3</span><span class="dfl">${esc(t('rlShockStep'))}</span></div>
          <button class="dfkey dfshock" data-shock disabled>\u26a1 SHOCK</button>
        </div>
      </div>
      <p class="muted small" id="dfHint"></p>
      <div class="row"><button class="btn ghost" data-x>${esc(t('rlDisarm'))}</button></div></div>`);
    const mon = new Monitor($('#dfcv', m.el), { sweep: 4 }); mon.set(monState());
    const done = r => { clearTimeout(timer); mon.destroy(); m.close(); dev.ei = ei; dev.sync = sync; res(r); };
    const hint = () => { if (S.lv > 1) return ''; const key = paramKey(sync ? 'sync' : 'shock', S.p); return key ? `${t('rlTarget')}: ${D.DOSE[key](w).rule} \u00b7 ${t('rlNearest')}` : ''; };
    const ui = () => {
      const j = ei >= 0 ? ENERGIES[ei] : null;
      $('#dfKnob', m.el).innerHTML = knobSVG(ei < 0 ? 0 : ei / (ENERGIES.length - 1), j ? j + ' J' : '---');
      $('#dfJ', m.el).textContent = (j ? j : '---') + ' J';
      $('#dfSync', m.el).classList.toggle('on', sync); $('[data-sync]', m.el).classList.toggle('on', sync); $('[data-sync]', m.el).setAttribute('aria-pressed', sync);
      $('[data-charge]', m.el).disabled = ei < 0 || stage > 0; $('[data-charge]', m.el).textContent = stage === 1 ? t('rlCharging') : 'CHARGE';
      $('[data-shock]', m.el).disabled = stage !== 2; $('[data-shock]', m.el).classList.toggle('armed', stage === 2);
      $('#dfSt', m.el).textContent = stage === 2 ? t('rlClear') : stage === 1 ? t('rlCharging') : '';
      $('#dfHint', m.el).textContent = hint();
    };
    const disarm = () => { if (stage) { clearTimeout(timer); stage = 0; } };
    m.el.addEventListener('click', e => {
      const pm = e.target.closest('[data-e]');
      if (pm) { disarm(); ei = Math.max(0, Math.min(ENERGIES.length - 1, (ei < 0 ? (+pm.dataset.e > 0 ? -1 : ENERGIES.length) : ei) + +pm.dataset.e)); Sound.click(false); ui(); return; }
      if (e.target.closest('[data-sync]')) { disarm(); sync = !sync; Sound.click(true); ui(); return; }
      if (e.target.closest('[data-charge]') && ei >= 0 && !stage) { stage = 1; Sound.charge(1.6); ui(); timer = setTimeout(() => { stage = 2; Sound.ready(); ui(); }, 1600); return; }
      if (e.target.closest('[data-shock]') && stage === 2) { done({ j: ENERGIES[ei], sync }); return; }
      if (e.target.closest('[data-x]')) done(null);
    });
    m.el.addEventListener('wheel', e => { if (!e.target.closest('.dfdial')) return; e.preventDefault(); disarm(); ei = Math.max(0, Math.min(ENERGIES.length - 1, ei + (e.deltaY > 0 ? -1 : 1))); ui(); }, { passive: false });
    ui();
  });
}
/* Transcutaneous pacer: on, rate, output up to capture, then confirm a pulse. */
function pacerPanel() {
  return new Promise(res => {
    const dev = S.dev; let on = !!dev.pon, rate = dev.rate ?? 70, mA = dev.mA ?? 0, cap = false;
    const thr = dev.thr ?? (dev.thr = 50 + 5 * Math.floor(Math.random() * 7));
    const m = modal(`<div class="sheet wide defib" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('rlPacer'))}</div>
      <div class="dfbody">
        <div class="dfscreen"><canvas id="pcv"></canvas><div class="dfread"><b id="pRate">PACER OFF</b><span id="pCap" class="dfst"></span></div></div>
        <div class="dfctl">
          <button class="dfkey" data-pon aria-pressed="false">PACER</button>
          <div class="dfrow"><span class="dfl">${esc(t('rlRate'))}</span></div>
          <div class="dfdial"><button class="dfpm" data-r="-10">\u2212</button><b class="dfval" id="pR" dir="ltr">70 ppm</b><button class="dfpm" data-r="10">+</button></div>
          <div class="dfrow"><span class="dfl">${esc(t('rlOutput'))}</span></div>
          <div class="dfdial"><button class="dfpm" data-a="-10">\u2212</button><b class="dfval" id="pA" dir="ltr">0 mA</b><button class="dfpm" data-a="10">+</button></div>
          <button class="dfkey dfcharge" data-pulse disabled>${esc(t('rlConfirm'))}</button>
        </div>
      </div>
      <p class="muted small">${S.lv === 1 ? esc(t('rlPaceHint')) : ''}</p>
      <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
    const mon = new Monitor($('#pcv', m.el), { sweep: 4 }); mon.set(monState());
    const done = r => { mon.destroy(); m.close(); Object.assign(dev, { pon: on, rate, mA }); res(r); };
    const ui = () => {
      cap = on && mA >= thr;
      mon.set(cap ? { monitor: true, rhythm: 'paced', hr: rate, pulse: true, cpr: false } : monState());
      $('#pRate', m.el).textContent = on ? `DEMAND \u00b7 ${rate} ppm` : 'PACER OFF';
      $('#pR', m.el).textContent = rate + ' ppm'; $('#pA', m.el).textContent = mA + ' mA';
      $('[data-pon]', m.el).classList.toggle('on', on); $('[data-pon]', m.el).setAttribute('aria-pressed', on);
      $('#pCap', m.el).textContent = !on ? '' : cap ? t('rlCapture') : t('rlNoCapture');
      $('#pCap', m.el).classList.toggle('ok', cap);
      $('[data-pulse]', m.el).disabled = !cap;
    };
    m.el.addEventListener('click', e => {
      if (e.target.closest('[data-pon]')) { on = !on; Sound.click(true); ui(); return; }
      const r = e.target.closest('[data-r]'); if (r) { rate = Math.max(30, Math.min(180, rate + +r.dataset.r)); Sound.click(false); ui(); return; }
      const a = e.target.closest('[data-a]'); if (a) { mA = Math.max(0, Math.min(200, mA + +a.dataset.a)); Sound.click(false); ui(); return; }
      if (e.target.closest('[data-pulse]') && cap) { done({ rate, mA }); return; }
      if (e.target.closest('[data-x]')) done(null);
    });
    ui();
  });
}
/* Pads: size by weight, then placement. */
function padsPanel() {
  return new Promise(res => {
    let size = null, place = null;
    const m = modal(`<div class="sheet" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('rlPadsTitle'))} \u00b7 ${esc(S.c.age)} \u00b7 ${D.f(S.c.wt)} ${t('kg')}</div>
      <h2>${esc(t('rlPadsQ1'))}</h2>
      <div class="padopts" data-grp="size"><button class="opt" data-v="ped"><svg viewBox="0 0 60 40"><rect x="8" y="6" width="18" height="26" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="34" y="6" width="18" height="26" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="10" y="8" width="14" height="4" fill="#ff8fb3"/><rect x="36" y="8" width="14" height="4" fill="#ff8fb3"/></svg>${esc(t('rlPadsPed'))}</button><button class="opt" data-v="adult"><svg viewBox="0 0 60 40"><rect x="2" y="2" width="26" height="36" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="32" y="2" width="26" height="36" rx="3" fill="#eef3f5" stroke="#55707d"/><rect x="4" y="4" width="22" height="5" fill="#ff7a45"/><rect x="34" y="4" width="22" height="5" fill="#ff7a45"/></svg>${esc(t('rlPadsAdult'))}</button></div>
      <h2>${esc(t('rlPadsQ2'))}</h2>
      <div class="padopts" data-grp="place"><button class="opt" data-v="al"><svg viewBox="0 0 60 60"><path d="M18 6h24l6 16v30H12V22z" fill="#d9a07a" opacity=".55"/><rect x="17" y="14" width="10" height="13" rx="2" fill="#eef3f5" stroke="#55707d"/><rect x="36" y="32" width="10" height="13" rx="2" fill="#eef3f5" stroke="#55707d"/></svg>${esc(t('rlAL'))}</button><button class="opt" data-v="ap"><svg viewBox="0 0 60 60"><path d="M18 6h24l6 16v30H12V22z" fill="#d9a07a" opacity=".55"/><rect x="24" y="22" width="12" height="14" rx="2" fill="#eef3f5" stroke="#55707d"/><rect x="40" y="40" width="16" height="16" rx="2" fill="none" stroke="#eef3f5" stroke-dasharray="3 2"/><text x="48" y="51" font-size="7" text-anchor="middle" fill="#eef3f5">back</text></svg>${esc(t('rlAP'))}</button></div>
      <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button><button class="btn primary" data-apply disabled>${esc(t('rlApply'))}</button></div></div>`);
    m.el.addEventListener('click', e => {
      const b = e.target.closest('[data-v]');
      if (b) { const g = b.parentElement.dataset.grp; $$(`[data-grp="${g}"] .opt`, m.el).forEach(x => x.classList.toggle('picked', x === b)); if (g === 'size') size = b.dataset.v; else place = b.dataset.v; $('[data-apply]', m.el).disabled = !(size && place); return; }
      if (e.target.closest('[data-apply]') && size && place) { m.close(); res({ size, place }); return; }
      if (e.target.closest('[data-x]')) { m.close(); res(null); }
    });
  });
}
/* Printed rhythm strip on ECG paper: lead II, 6 s, 25 mm/s, 10 mm/mV. */
function ecgPrint() {
  if (!S) return;
  const st = Object.assign({}, S.st);
  rec(t('ecgRec'), 'ok');
  const m = modal(`<div class="sheet wide ecgp" role="dialog" aria-modal="true"><div class="eyebrow">${esc(t('ecgTitle'))}</div><div class="ecgpaper"><canvas id="ecgc"></canvas></div><p class="muted small" dir="ltr">II \u00b7 25 mm/s \u00b7 10 mm/mV</p><div class="row"><button class="btn primary" data-x>${esc(t('backPatient'))}</button></div></div>`);
  m.el.addEventListener('click', e => { if (e.target.closest('[data-x]')) m.close(); });
  const draw = () => { const cv = $('#ecgc', m.el); if (cv && cv.isConnected && paperStrip(cv, st, 4) === false) setTimeout(draw, 250); };
  requestAnimationFrame(draw);
}
/* Draw a lead II strip on ECG paper (25 mm/s, 10 mm/mV), secs long, filling the canvas width. */
function paperStrip(cv, st, secs = 4) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth, mm = W / (secs * 25), H = Math.round(mm * 32);
  if (!(W > 20)) return false; /* not laid out yet: a zero grid step would never end */
  cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px';
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.fillStyle = '#fff6f4'; c.fillRect(0, 0, W, H);
  for (let i = 0; i * mm <= W; i++) { c.strokeStyle = i % 5 ? 'rgba(232,120,120,.25)' : 'rgba(214,70,70,.55)'; c.lineWidth = i % 5 ? 0.5 : 1; c.beginPath(); c.moveTo(i * mm, 0); c.lineTo(i * mm, H); c.stroke(); }
  for (let i = 0; i * mm <= H; i++) { c.strokeStyle = i % 5 ? 'rgba(232,120,120,.25)' : 'rgba(214,70,70,.55)'; c.lineWidth = i % 5 ? 0.5 : 1; c.beginPath(); c.moveTo(0, i * mm); c.lineTo(W, i * mm); c.stroke(); }
  const r = new Rhythm(st.rhythm, st.hr, 0.3), base = H * 0.62;
  c.strokeStyle = '#141414'; c.lineWidth = 1.3; c.lineJoin = 'round'; c.beginPath();
  for (let tt = 0; tt <= secs; tt += 0.002) { const v = st.monitor || st.pulse ? r.ecg(tt) + (st.cpr ? cprArt(tt) : 0) : 0, x = tt * 25 * mm, y = base - v * 10 * mm; if (tt === 0) c.moveTo(x, y); else c.lineTo(x, y); }
  c.stroke();
  c.fillStyle = '#141414'; c.font = `600 ${Math.max(10, mm * 3)}px monospace`; c.fillText('II', mm * 2, mm * 5);
  return true;
}
/* Free recall of the H's & T's (Clinical and Expert): what the learner types is matched to one of the 12 causes,
   in English or Hebrew, by key words. Index order is the order of D.HTS. */
const HTS_RE = [
  /hypovol|volume|dehydrat|bleed|hemorrh|haemorrh|blood loss|\u05d4\u05d9\u05e4\u05d5\u05d5\u05dc|\u05d4\u05d9\u05e4\u05d5\u05d1\u05d5\u05dc|\u05e0\u05e4\u05d7|\u05d4\u05ea\u05d9\u05d9\u05d1\u05e9|\u05d3\u05d9\u05de\u05d5\u05dd|\u05d0\u05d9\u05d1\u05d5\u05d3 \u05d3\u05dd/i,
  /hypox|oxygen|^o2$|\u05d4\u05d9\u05e4\u05d5\u05e7\u05e1|\u05d7\u05de\u05e6\u05df/i,
  /acido|hydrogen|h\+|\bph\b|\u05d7\u05de\u05e6\u05ea|\u05d0\u05e6\u05d9\u05d3\u05d5\u05d6|\u05de\u05d9\u05de\u05df/i,
  /kal|potassium|\bk\+?\b|\u05d0\u05e9\u05dc\u05d2\u05df|\u05e7\u05dc\u05de\u05d9/i,
  /glyc|glucose|sugar|\u05d2\u05dc\u05d9\u05e7|\u05e1\u05d5\u05db\u05e8/i,
  /thermi|cold|temperat|\u05ea\u05e8\u05de\u05d9|\u05e7\u05d5\u05e8|\u05d8\u05de\u05e4\u05e8\u05d8\u05d5\u05e8/i,
  /pneumo|tension|ptx|\u05d7\u05d6\u05d4 \u05d0\u05d5\u05d5\u05d9\u05e8|\u05e4\u05e0\u05d0\u05d5\u05de\u05d5/i,
  /tamponad|pericard|\u05d8\u05de\u05e4\u05d5\u05e0\u05d3|\u05e4\u05e8\u05d9\u05e7\u05e8\u05d3/i,
  /tox|poison|overdose|drug|ingest|\u05e8\u05e2\u05dc|\u05d4\u05e8\u05e2\u05dc|\u05de\u05e0\u05ea \u05d9\u05ea\u05e8|\u05ea\u05e8\u05d5\u05e4|\u05d1\u05dc\u05d9\u05e2/i,
  /pulmon|embol|\bpe\b|\u05e8\u05d9\u05d0\u05ea\u05d9|\u05ea\u05e1\u05d7\u05d9\u05e3/i,
  /coronar|infarct|\bmi\b|\u05db\u05dc\u05d9\u05dc|\u05d0\u05d5\u05d8\u05dd/i,
  /trauma|injur|\u05d8\u05e8\u05d0\u05d5\u05de|\u05d7\u05d1\u05dc\u05d4|\u05e4\u05e6\u05d9\u05e2/i
];
const HTS_ORDER = [6, 7, 8, 9, 10, 2, 3, 4, 5, 0, 1, 11];
function htsMatch(txt) {
  const s = String(txt || '').trim(); if (!s) return -1;
  const exact = D.HTS.findIndex(x => x.toLowerCase() === s.toLowerCase()); if (exact >= 0) return exact;
  for (const i of HTS_ORDER) if (HTS_RE[i].test(s)) return i;
  if (/thromb|clot|\u05ea\u05e8\u05d5\u05de\u05d1|\u05e7\u05e8\u05d9\u05e9/i.test(s)) return -2;
  return -1;
}
function htsRecall(h) {
  return new Promise(res => {
    const ans = D.HTS.indexOf(h.ans); let tries = 0;
    const m = modal(`<div class="sheet wide" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('revCauses'))}</div><h2>${esc(t('hts'))}</h2>
      <div class="clue">${esc(h.clue)}</div>
      <p class="muted">${esc(t('htsRecall'))}</p>
      <form class="typed htsform" autocomplete="off"><input id="htsv" type="text" dir="auto" aria-label="${esc(t('htsRecall'))}"><button class="btn primary" type="submit">${esc(t('htsCheck'))}</button></form>
      <div class="htsguess" id="hguess"></div>
      <p class="why" id="hwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-list>${esc(t('htsShowList'))}</button><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
    const inp = $('#htsv', m.el), y = $('#hwhy', m.el); setTimeout(() => inp.focus(), 40);
    $('form', m.el).addEventListener('submit', e => {
      e.preventDefault();
      const raw = inp.value.trim(); if (!raw) return;
      const i = htsMatch(raw); y.hidden = false; y.classList.remove('good');
      if (i === ans) { y.classList.add('good'); y.textContent = `${D.HTS[i]}. ${t('treatIt')}: ${h.fix}`; inp.disabled = true; setTimeout(() => { m.close(); res(true); }, 1500); return; }
      if (i === -2) { y.textContent = t('htsVague'); return; }
      if (i === -1) { y.textContent = t('htsUnknown'); return; }
      tries++;
      $('#hguess', m.el).insertAdjacentHTML('beforeend', `<span class="chip wrong">${esc(D.HTS[i])}</span>`);
      y.textContent = S.lv >= 3 ? t('typedWrongShort') : t('notFit', D.HTS[i]);
      err(t('notFit', D.HTS[i]), false, null, `${t('cause')}: ${D.HTS[i]}`, 15, undefined, 'hts');
      inp.select();
    });
    m.el.addEventListener('click', e => {
      if (e.target.closest('[data-list]')) {
        S.score -= 15; S.hints++; updScore(); rec(t('htsListRec'), 'bad');
        m.close(); htsDialog(h, true).then(res); return;
      }
      if (e.target.closest('[data-x]')) { m.close(); res(null); }
    });
  });
}
function htsDialog(h, listOnly) {
  if (S.lv >= 2 && !listOnly) return htsRecall(h);
  return new Promise(res => {
    const m = modal(`<div class="sheet wide" role="dialog" aria-modal="true">
      <div class="eyebrow">${esc(t('revCauses'))}</div><h2>${esc(t('hts'))}</h2>
      <div class="clue">${esc(h.clue)}</div>
      <p class="muted">${esc(t('whichCause'))}</p>
      <div class="hts">${D.HTS.map((x, i) => `<button class="opt" data-h="${i}">${esc(x)}</button>`).join('')}</div>
      <p class="why" id="hwhy" hidden></p>
      <div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
    m.el.addEventListener('click', e => {
      const b = e.target.closest('[data-h]');
      if (b) {
        const x = D.HTS[+b.dataset.h], y = $('#hwhy', m.el);
        if (x === h.ans) { b.classList.add('right'); y.hidden = false; y.style.color = 'var(--good)'; y.textContent = `${t('treatIt')}: ${h.fix}`; setTimeout(() => { m.close(); res(true); }, 1300); }
        else if (!b.classList.contains('wrong')) { b.classList.add('wrong'); y.hidden = false; y.textContent = S.lv >= 3 ? t('typedWrongShort') : t('clueNo'); err(t('notFit', x), false, null, `${t('cause')}: ${x}`, 15, undefined, 'hts'); }
      } else if (e.target.closest('[data-x]')) { m.close(); res(null); }
    });
  });
}
function peek() {
  if (!S || !S.started || S.finished) return;
  const a = D.ALGOS.find(x => x.id === S.c.algo);
  if (S.lv >= 3) return;
  S.score -= S.lv === 2 ? 40 : 20; S.hints++; updScore(); rec(t('peeked'), 'bad');
  const m = modal(`<div class="sheet wide" role="dialog" aria-modal="true"><div class="eyebrow">${esc(t('algoCard'))}</div><h2>${esc(a.name)}</h2>${mapHTML(a)}<div class="row"><button class="btn primary" data-x>${esc(t('backPatient'))}</button></div></div>`);
  m.el.addEventListener('click', e => { if (e.target.closest('[data-x]')) m.close(); });
}
function finish() {
  if (!S || S.finished) return;
  S.finished = true; S.busy = true;
  const c = S.c, pct = S.died ? 0 : S.max ? Math.max(0, Math.min(1, S.score / S.max)) : 1;
  const dangers = S.errs.filter(e => e.danger).length;
  let stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.4 ? 1 : 0;
  if (dangers >= 1) stars = Math.min(stars, 2);
  if (dangers >= 3) stars = Math.min(stars, 1);
  const Q = qualityRows();
  if (Q.some(r => !r.ok)) stars = Math.min(stars, 2);
  const prev = Store.d.best[c.id] || 0; if (stars > prev) Store.d.best[c.id] = stars;
  const was = [2, 3].map(lvUnlocked);
  Store.d.bestLv = Store.d.bestLv || {}; if (stars >= 2 && S.lv > (Store.d.bestLv[c.id] || 0)) Store.d.bestLv[c.id] = S.lv;
  const weakT = [...S.weak];
  applyWeak(weakT, c.algo, S.errs.length === 0);
  const xp = Math.round((Math.round(pct * 100) + stars * 15) * LV_XP[S.lv - 1]); Store.addXP(xp);
  [2, 3].forEach((l, k) => { if (!was[k] && lvUnlocked(l)) setTimeout(() => toast(t('lvUnlocked', t('levels')[l - 1].n)), 600); });
  if (S.died) stars = 0;
  const end = S.died ? S.p : c.phases.find(p => p.type === 'end');
  const idx = D.CASES.findIndex(x => x.id === c.id), nxt = c.gen ? null : D.CASES[(idx + 1) % D.CASES.length];
  const TP = t('topics');
  const seen = new Set(), teach = S.teach.filter(x => !seen.has(x.t) && seen.add(x.t));
  /* the algorithms this run actually went through: the case's own, then arrest and post-ROSC care if it got there */
  const algIds = [c.algo];
  if (c.algo !== 'bls' && S.m.arrestT > 0 && !S.died) algIds.push('arrest');
  if (S.post) algIds.push('rosc');
  const algs = [...new Set(algIds)].map(id => D.ALGOS.find(a => a.id === id)).filter(Boolean);
  const m = modal(`<div class="sheet wide debrief" role="dialog" aria-modal="true">
    <div class="eyebrow">${esc(t('debrief'))} \u00b7 ${esc(c.title)}</div>
    <h2 class="dbalgo">${algs.map(a => `<span style="--ac:${a.color}">${esc(a.name)}</span>`).join('<i aria-hidden="true">\u2192</i>')}</h2>
    <p>${esc(end ? end.say : '')}</p>
    <div class="score"><div class="pct">${Math.round(pct * 100)}%</div><div>${starsHTML(stars, 'bigstars')}<div class="muted" style="font-size:14px;margin-top:4px">${esc(t('codeTime'))} ${mmss(S.codeT)} \u00b7 ${esc(t('errors', S.errs.length))}${dangers ? esc(t('dangerN', dangers)) : ''} \u00b7 ${esc(t('peeks', S.hints))} \u00b7 +${xp} XP</div></div></div>
    ${S.errs.length ? `<h3>${esc(t('whatFix'))}</h3><ul>${S.errs.map(e => `<li class="bad"><em>${esc(e.k)}</em> \u00b7 ${e.what ? `<b>${esc(e.what)}</b>: ` : ''}${esc(e.msg)}</li>`).join('')}</ul>` : `<h3>${esc(t('cleanRun'))}</h3><p class="muted">${esc(t('cleanSub'))}</p>`}
    ${metricsHTML(Q)}
    ${S.tl.seg.length || S.tl.ev.length ? timelineHTML() : ''}
    ${S.labsSent ? `<h3>${esc(t('labsDbH'))}</h3><p class="muted">${esc(otherLabs())}</p><p><button class="btn sm ghost" data-gasdb>${esc(t('gasView'))}</button></p>` : ''}
    <h3>${esc(t('keyPoints'))}</h3><ul>${teach.map(x => `<li>${esc(x.t)}</li>`).join('')}</ul>
    ${weakT.length ? `<div class="weakchips"><span class="muted">${esc(t('weakTitle'))}:</span>${weakT.map(tp => `<span class="chip">${esc(TP[tp] || tp)}</span>`).join('')}<button class="btn sm" data-drill>${esc(t('drillThese'))}</button></div>` : ''}
    <div class="row"><button class="btn primary" data-again>${esc(t('again'))}</button>${c.surprise ? `<button class="btn" data-surprise>${esc(t('surpriseNext'))}</button>` : ''}<button class="btn" data-next>${esc(c.gen ? t('newRandom') : t('nextCase', nxt.title))}</button><button class="btn ghost" data-list>${esc(t('allCases'))}</button></div>
  </div>`);
  m.el.addEventListener('click', e => {
    if (e.target.closest('[data-surprise]')) go('random');
    else if (e.target.closest('[data-again]')) { if (c.gen) go('sim', Object.assign({}, c, { wt: c.baseGenWt || c.wt })); else go('sim', c.id); }
    else if (e.target.closest('[data-next]')) { if (c.gen) go('gen', c.gen); else go('sim', nxt.id); }
    else if (e.target.closest('[data-list]')) go('cases');
    else if (e.target.closest('[data-drill]')) go('recall', 'weak:' + weakT.join(','));
    else {
      const sg = e.target.closest('[data-seg]'); if (!sg) return;
      const s = S.tl.seg[+sg.dataset.seg], box = $('#tlStrip', m.el); if (!s || !box) return;
      box.hidden = false; $$('.tlseg', m.el).forEach(g => g.classList.toggle('sel', g === sg));
      paperStrip($('canvas', box), { rhythm: s.r, hr: s.hr, monitor: s.mon, pulse: s.p, cpr: false }, 4);
    }
  });
}

/* ---------------- ATLAS ---------------- */
function mapHTML(a, hl) {
  return `<div class="flow">${a.nodes.map((n, i) => {
    const following = a.nodes[i + 1] ? a.nodes[i + 1].id : null;
    const jump = n.next && n.next !== following;
    return `<div class="node ${n.k}${hl === n.id ? ' hl' : ''}"><div class="num"><span>${n.id}</span></div><div class="body">
      <h4>${esc(n.t)}</h4>${n.d ? `<p>${esc(n.d)}</p>` : ''}
      ${n.opts ? `<div class="branches">${n.opts.map(o => `<span class="branch">${esc(o.l)} ${LANG === 'he' ? '\u2190' : '\u2192'} <b>${o.to}</b></span>`).join('')}</div>` : ''}
      ${jump ? `<span class="goto">${esc(t('continueAt', n.next))}</span>` : ''}</div></div>`;
  }).join('')}</div>`;
}
function atlas() {
  app.innerHTML = `<div class="shell">${secHead(t('atlasTitle'), t('atlasSub'))}
    <div class="algos">${D.ALGOS.map(a => `<button class="algocard" style="--ac:${a.color}" data-go="algo" data-arg="${a.id}"><h4>${esc(a.name)}</h4><p>${esc(a.short)}</p><span class="chip">${esc(t('nodesChip', a.nodes.length, a.seqs.length))}</span></button>`).join('')}</div>
  </div>`;
}
function algoScreen(arg) {
  const [id, startMode] = String(arg || '').split(':');
  const a = D.ALGOS.find(x => x.id === id); if (!a) { go('atlas'); return; }
  app.innerHTML = `<div class="shell"><div class="sechead"><button class="iconbtn" data-go="atlas" aria-label="${esc(t('backAtlas'))}">${IC.back}</button><h2>${esc(a.name)}</h2>${langBtn()}<p class="sub">${esc(a.short)}</p></div>
    <div class="seg" role="tablist"><button data-m="walk">${esc(t('walk'))}</button><button data-m="map">${esc(t('map'))}</button><button data-m="build">${esc(t('rebuild'))}</button></div>
    <div id="am"></div></div>`;
  const area = $('#am');
  let walk = { cur: a.nodes[0].id, trail: [] }, build = null;
  const setMode = md => {
    $$('[data-m]').forEach(b => b.classList.toggle('on', b.dataset.m === md));
    if (md === 'map') area.innerHTML = mapHTML(a);
    if (md === 'walk') renderWalk();
    if (md === 'build') startBuild(0);
  };
  function renderWalk() {
    const n = a.nodes.find(x => x.id === walk.cur), i = a.nodes.indexOf(n);
    const nextId = n.next ?? (a.nodes[i + 1] ? a.nodes[i + 1].id : null);
    let btns;
    if (n.k === 'dec') btns = n.opts.map(o => `<button class="opt" data-to="${o.to}">${esc(o.l)}</button>`).join('');
    else if (n.k === 'end' || nextId == null) btns = `<div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-restart>${esc(t('walkAgain'))}</button><button class="btn" data-tobuild>${esc(t('rebuildMem'))}</button></div>`;
    else btns = `<button class="btn primary" data-to="${nextId}">${esc(t('next'))}</button>`;
    area.innerHTML = `<div class="walk">
      ${walk.trail.length ? `<div class="trail">${walk.trail.map(x => `<span>${x}</span>`).join('')}<span style="background:var(--raise);color:var(--fg)">${n.id}</span></div>` : ''}
      <div class="walkcard" style="border-top:3px solid ${a.color}"><div class="k">${esc(n.k === 'dec' ? t('decisionK') : n.k === 'end' ? t('endpointK') : t('actionK'))} \u00b7 ${esc(t('nodeK', n.id))}</div><h3>${esc(n.t)}</h3>${n.d ? `<p>${esc(n.d)}</p>` : ''}<div class="opts">${btns}</div></div>
      ${walk.trail.length ? `<div><button class="btn ghost" data-wback>${IC.back} ${esc(t('backStep'))}</button></div>` : ''}
    </div>`;
  }
  function startBuild(si) {
    const seq = a.seqs[si];
    build = { si, seq, placed: [], pool: shuffle(seq.steps.map((s, i) => ({ s, i }))), miss: 0 };
    renderBuild();
  }
  function renderBuild() {
    const b = build, done = b.placed.length === b.seq.steps.length;
    area.innerHTML = `<div class="rebuild">
      ${a.seqs.length > 1 ? `<div class="filters">${a.seqs.map((s, i) => `<button data-seq="${i}" class="${i === b.si ? 'on' : ''}">${esc(s.n)}</button>`).join('')}</div>` : `<div class="eyebrow">${esc(b.seq.n)}</div>`}
      <p class="muted">${esc(t('tapOrder'))} <b class="mono">${b.miss}</b></p>
      <div class="placed">${b.placed.map(i => `<div>${esc(b.seq.steps[i])}</div>`).join('')}</div>
      ${done ? `<div class="result"><div class="eyebrow">${esc(t('seqDone'))}</div><div class="big">${esc(b.miss === 0 ? t('perfect') : t('misses', b.miss))}</div><div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-seq="${b.si}">${esc(t('againShort'))}</button><button class="btn" data-mode="walk">${esc(t('walkAlgo'))}</button></div></div>`
        : `<div class="pool">${b.pool.filter(x => !b.placed.includes(x.i)).map(x => `<button class="opt" data-step="${x.i}">${esc(x.s)}</button>`).join('')}</div>`}
    </div>`;
  }
  area.addEventListener('click', e => {
    const to = e.target.closest('[data-to]');
    if (to) { walk.trail.push(walk.cur); walk.cur = +to.dataset.to; renderWalk(); return; }
    if (e.target.closest('[data-restart]')) { walk = { cur: a.nodes[0].id, trail: [] }; renderWalk(); return; }
    if (e.target.closest('[data-wback]')) { walk.cur = walk.trail.pop(); renderWalk(); return; }
    if (e.target.closest('[data-tobuild]')) { setMode('build'); return; }
    const md = e.target.closest('[data-mode]'); if (md) { setMode(md.dataset.mode); return; }
    const sq = e.target.closest('[data-seq]'); if (sq) { startBuild(+sq.dataset.seq); return; }
    const st = e.target.closest('[data-step]');
    if (st && build) {
      const i = +st.dataset.step;
      if (i === build.placed.length) {
        build.placed.push(i); Sound.ok();
        if (build.placed.length === build.seq.steps.length) { const xp = Math.max(5, 25 - 5 * build.miss); Store.addXP(xp); toast(t('plusXP', xp)); }
        renderBuild();
      } else {
        build.miss++; Sound.bad(); st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake');
        const p = area.querySelector('.muted b'); if (p) p.textContent = build.miss;
      }
    }
  });
  $$('[data-m]').forEach(b => b.addEventListener('click', () => setMode(b.dataset.m)));
  setMode(startMode || 'walk');
}

/* ---------------- RHYTHM RUSH ---------------- */
function rushScreen() {
  const deck = shuffle(D.RUSH).slice(0, 10), names = [...new Set(D.RUSH.map(x => x.a))];
  let i = 0, score = 0, streak = 0, right = 0, timer = null, item = null, t0 = 0, phase = 'name';
  app.innerHTML = `<div class="shell">${secHead(t('rushTitle'), t('rushSub'))}
    <div class="seg modeseg"><button class="on">${esc(t('rushClassic'))}</button><button data-go="sprint">${esc(t('sprintTitle'))}</button></div>
    <div class="game">
      <div class="hud"><span>${esc(t('strip'))} <b id="rI">1</b>/10</span><span>${esc(t('scoreL'))} <b id="rS">0</b></span><span class="streak">${esc(t('streak'))} <b id="rK">0</b></span><span>${esc(t('best'))} <b>${Store.d.rush || 0}</b></span></div>
      <div class="rushmon"><canvas id="rcv"></canvas><div class="ctx" id="rctx"></div></div>
      <div class="timebar"><i id="rtb" style="width:100%"></i></div>
      <div class="qbox" id="rq"></div>
    </div></div>`;
  const mon = new Monitor($('#rcv'), { sweep: 5 });
  cleanups.push(() => { mon.destroy(); clearInterval(timer); });
  const q = $('#rq');
  function nameOpts(it) {
    const same = shuffle([...new Set(D.RUSH.filter(x => x.g === it.g && x.a !== it.a).map(x => x.a))]).slice(0, 2);
    const rest = shuffle(names.filter(n => n !== it.a && !same.includes(n)));
    return shuffle([it.a, ...same, ...rest].slice(0, 4));
  }
  function round() {
    item = deck[i]; phase = 'name';
    mon.set({ monitor: true, rhythm: item.r, hr: item.hr || 60, pulse: item.p, cpr: false });
    $('#rI').textContent = i + 1;
    $('#rctx').innerHTML = `<span class="chip">${esc(item.ctx)}</span><span class="chip" style="color:${item.p ? 'var(--ecg)' : 'var(--bad)'}">${esc(item.p ? t('pulseYes') : t('pulseNo'))}</span>`;
    const opts = nameOpts(item);
    q.innerHTML = `<div class="qtext">${esc(t('nameRhythm'))}</div><div class="opts two">${opts.map(o => `<button class="opt" data-n="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
    t0 = performance.now(); clearInterval(timer);
    timer = setInterval(() => {
      const left = 15 - (performance.now() - t0) / 1000;
      $('#rtb').style.width = Math.max(0, left / 15 * 100) + '%';
      if (left <= 0) answerName(null);
    }, 100);
  }
  function answerName(n) {
    if (phase !== 'name') return; phase = 'next'; clearInterval(timer);
    const left = Math.max(0, 15 - (performance.now() - t0) / 1000), ok = n === item.a;
    if (ok) { streak++; right++; score += Math.round((100 + left * 5) * Math.min(2, 1 + 0.1 * (streak - 1))); Sound.ok(); }
    else { streak = 0; Sound.bad(); noteWeak('rhythm'); }
    $('#rS').textContent = score; $('#rK').textContent = streak;
    $$('[data-n]', q).forEach(b => { if (b.dataset.n === item.a) b.classList.add('right'); else if (b.dataset.n === n) b.classList.add('wrong'); b.disabled = true; });
    const nx = shuffle([item.nx.ok, ...item.nx.bad]);
    q.insertAdjacentHTML('beforeend', `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${esc(ok ? t('correct') : n ? t('notQuite') : t('timeUp'))}</b><span>${esc(item.a)}: ${esc(item.f)}</span></div>
      <div class="qtext">${esc(item.nx.q)}</div><div class="opts two" id="nx">${nx.map(o => `<button class="opt" data-x="${esc(o)}">${esc(o)}</button>`).join('')}</div>`);
  }
  function answerNext(x) {
    if (phase !== 'next') return; phase = 'wait';
    const ok = x === item.nx.ok; if (ok) { score += 50; Sound.ok(); } else { Sound.bad(); noteWeak('rhythm', 0.5); }
    $('#rS').textContent = score;
    $$('[data-x]', q).forEach(b => { if (b.dataset.x === item.nx.ok) b.classList.add('right'); else if (b.dataset.x === x) b.classList.add('wrong'); b.disabled = true; });
    q.insertAdjacentHTML('beforeend', `<div><button class="btn primary" id="rNext">${esc(i < deck.length - 1 ? t('nextStrip') : t('results'))}</button></div>`);
    $('#rNext').focus({ preventScroll: true });
  }
  function end() {
    clearInterval(timer);
    const best = Math.max(Store.d.rush || 0, score); const isBest = score > (Store.d.rush || 0);
    Store.d.rush = best; Store.addXP(score / 25);
    mon.set({ monitor: true, rhythm: 'nsr', hr: 100, pulse: true });
    $('#rctx').innerHTML = '';
    q.innerHTML = `<div class="result"><div class="eyebrow">${esc(isBest ? t('newBest') : t('runDone'))}</div><div class="big">${score}</div><p class="muted">${esc(t('rushRes', right, best, Math.round(score / 25)))}</p><div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-go="rush">${esc(t('playAgain'))}</button><button class="btn" data-go="home">${esc(t('home'))}</button></div></div>`;
  }
  q.addEventListener('click', e => {
    const n = e.target.closest('[data-n]'); if (n) { answerName(n.dataset.n); return; }
    const x = e.target.closest('[data-x]'); if (x) { answerNext(x.dataset.x); return; }
    if (e.target.closest('#rNext')) { i++; if (i < deck.length) round(); else end(); }
  });
  round();
}

/* ---------------- STRIP SPRINT: 60 s of printed strips, no clinical context ---------------- */
const SPRINT = [
  { r: 'nsr', g: 'n', hr: [80, 120] }, { r: 'avb1', g: 'n', hr: [70, 95] }, { r: 'stach', g: 'f', hr: [150, 190] }, { r: 'svt', g: 'f', hr: [220, 280] },
  { r: 'aflutter', g: 'f', hr: [150, 150] }, { r: 'afib', g: 'f', hr: [100, 150] }, { r: 'sbrady', g: 's', hr: [38, 52] }, { r: 'mobitz1', g: 's', hr: [80, 110] },
  { r: 'mobitz2', g: 's', hr: [80, 110] }, { r: 'avb3', g: 's', hr: [35, 50] }, { r: 'vt', g: 'w', hr: [160, 220] }, { r: 'vf', g: 'w' },
  { r: 'torsades', g: 'w' }, { r: 'paced', g: 'w', hr: [80, 110] }, { r: 'asystole', g: 'w' }
];
const rxName = r => r === 'paced' ? t('rxPaced') : ((D.RUSH.find(x => x.r === r) || {}).a || r);
function sprintScreen() {
  const LEN = 60, rx = Store.d.rx || (Store.d.rx = {});
  let left = LEN, score = 0, streak = 0, right = 0, total = 0, item = null, prev = null, timer = null, lock = false, started = false;
  const miss = {};
  app.innerHTML = `<div class="shell">${secHead(t('sprintTitle'), t('sprintSub'))}
    <div class="seg modeseg"><button data-go="rush">${esc(t('rushClassic'))}</button><button class="on">${esc(t('sprintTitle'))}</button></div>
    <div class="game">
      <div class="hud"><span>${esc(t('timeL'))} <b id="sT">${LEN}</b>s</span><span>${esc(t('scoreL'))} <b id="sS">0</b></span><span class="streak">${esc(t('streak'))} <b id="sK">0</b></span><span>${esc(t('best'))} <b>${Store.d.sprint || 0}</b></span></div>
      <div class="timebar"><i id="stb" style="width:100%"></i></div>
      <div class="ecgpaper sprintpaper"><canvas id="spc"></canvas></div>
      <div class="qbox" id="sq"><div class="result"><p class="muted">${esc(t('sprintHow'))}</p><div class="row"><button class="btn primary" id="sGo">${esc(t('sprintGo'))}</button></div></div></div>
    </div></div>`;
  const q = $('#sq'), cv = $('#spc');
  const onKey = e => { const m = /^(Digit|Numpad)([1-4])$/.exec(e.code); if (m && started && !lock) { const b = $$('[data-sp]', q)[+m[2] - 1]; if (b) { e.preventDefault(); b.click(); } } };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => { clearInterval(timer); document.removeEventListener('keydown', onKey); });
  const weight = it => { const s = rx[it.r]; return it.r === prev ? 0 : !s || !s[1] ? 2 : 1 + 4 * (1 - s[0] / s[1]); };
  function pickItem() {
    const ws = SPRINT.map(weight), sum = ws.reduce((a, b) => a + b, 0); let x = Math.random() * sum;
    for (let i = 0; i < SPRINT.length; i++) { x -= ws[i]; if (x <= 0) return SPRINT[i]; }
    return SPRINT[0];
  }
  function next() {
    const it = pickItem(), hr = it.hr ? it.hr[0] + Math.round(Math.random() * (it.hr[1] - it.hr[0])) : 0;
    item = Object.assign({}, it, { rate: hr }); prev = it.r; lock = false;
    paperStrip(cv, { rhythm: it.r, hr: hr || 60, monitor: true, pulse: true, cpr: false }, cv.clientWidth < 560 ? 4 : 6);
    const same = shuffle(SPRINT.filter(x => x.g === it.g && x.r !== it.r)).slice(0, 2), rest = shuffle(SPRINT.filter(x => x.r !== it.r && !same.includes(x)));
    const opts = shuffle([it, ...same, ...rest].slice(0, 4));
    q.innerHTML = `<div class="opts two">${opts.map((o, i) => `<button class="opt" data-sp="${o.r}">${kbd(i + 1)}${esc(rxName(o.r))}</button>`).join('')}</div><div id="sfb"></div>`;
  }
  function answer(r, b) {
    if (lock || !started) return; lock = true; total++;
    const ok = r === item.r, s = rx[item.r] || [0, 0]; rx[item.r] = [s[0] + (ok ? 1 : 0), s[1] + 1];
    if (ok) { right++; streak++; score += 100 + 10 * Math.min(10, streak - 1); Sound.ok(); b.classList.add('right'); setTimeout(() => { if (started) next(); }, 280); }
    else {
      streak = 0; miss[item.r] = (miss[item.r] || 0) + 1; noteWeak('rhythm', 0.5); Sound.bad(); b.classList.add('wrong');
      const c = $(`[data-sp="${item.r}"]`, q); if (c) c.classList.add('right');
      $('#sfb').innerHTML = `<div class="fb bad"><b>${esc(t('itWas', rxName(item.r)))}</b></div>`;
      setTimeout(() => { if (started) next(); }, 1300);
    }
    $('#sS').textContent = score; $('#sK').textContent = streak;
  }
  function end() {
    started = false; clearInterval(timer);
    const isBest = score > (Store.d.sprint || 0); Store.d.sprint = Math.max(Store.d.sprint || 0, score); Store.addXP(score / 25);
    const stats = SPRINT.filter(x => rx[x.r] && rx[x.r][1]).map(x => ({ r: x.r, p: rx[x.r][0] / rx[x.r][1], n: rx[x.r][1] })).sort((a, b) => a.p - b.p);
    q.innerHTML = `<div class="result"><div class="eyebrow">${esc(isBest ? t('newBest') : t('runDone'))}</div><div class="big">${score}</div>
      <p class="muted">${esc(t('sprintRes', right, total))}</p>
      ${Object.keys(miss).length ? `<p>${esc(t('sprintMissed'))} ${Object.keys(miss).map(r => `<span class="chip">${esc(rxName(r))}</span>`).join(' ')}</p>` : ''}
      <h3>${esc(t('sprintAcc'))}</h3><div class="rxacc">${stats.map(s => `<div class="rxa"><span>${esc(rxName(s.r))}</span><span class="wbar"><i style="width:${Math.round(s.p * 100)}%;background:${s.p >= 0.8 ? 'var(--good)' : s.p >= 0.5 ? 'var(--rr)' : 'var(--bad)'}"></i></span><b>${Math.round(s.p * 100)}%</b><small>${s.n}</small></div>`).join('')}</div>
      <div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-go="sprint">${esc(t('playAgain'))}</button><button class="btn" data-go="rush">${esc(t('rushClassic'))}</button><button class="btn ghost" data-go="home">${esc(t('home'))}</button></div></div>`;
  }
  q.addEventListener('click', e => {
    if (e.target.closest('#sGo')) {
      started = true; const t0 = performance.now(); next();
      timer = setInterval(() => { left = LEN - (performance.now() - t0) / 1000; $('#sT').textContent = Math.max(0, Math.ceil(left)); $('#stb').style.width = Math.max(0, left / LEN * 100) + '%'; if (left <= 0) end(); }, 100);
      return;
    }
    const b = e.target.closest('[data-sp]'); if (b) answer(b.dataset.sp, b);
  });
  paperStrip(cv, { rhythm: 'nsr', hr: 90, monitor: true, pulse: true }, cv.clientWidth < 560 ? 4 : 6);
}

/* ---------------- DOSE DRILL ---------------- */
function fillOpts(a, ws) {
  const out = [a];
  for (const w of ws) { if (out.length >= 4) break; if (!out.includes(w)) out.push(w); }
  const m = a.match(/^([\d.]+)( .*)$/); let k = 2;
  while (out.length < 4 && m && k < 9) { const alt = D.f(parseFloat(m[1]) * k) + m[2]; if (!out.includes(alt)) out.push(alt); k++; }
  return shuffle(out);
}
function drillScreen() {
  const N = 12; let i = 0, score = 0, right = 0, timer = null, cur = null, t0 = 0, answered = false;
  app.innerHTML = `<div class="shell">${secHead(t('drillTitle'), t('drillSub'))}
    <div class="game">
      <div class="hud"><span>${esc(t('question'))} <b id="dI">1</b>/${N}</span><span>${esc(t('scoreL'))} <b id="dS">0</b></span><span>${esc(t('best'))} <b>${Store.d.drill || 0}</b></span></div>
      <div class="timebar"><i id="dtb" style="width:100%"></i></div>
      <div class="qbox" id="dq"></div>
    </div></div>`;
  cleanups.push(() => clearInterval(timer));
  const q = $('#dq');
  function make() {
    if (Math.random() < 0.18) {
      const tp = pick(D.DRILL_AGE), pts = D.PATIENTS.filter(p => tp.ok(Math.round(p.a)) && p.a >= 1), pt = pick(pts), a = Math.round(pt.a), m = tp.m(a);
      return { pt, title: tp.q(a), a: m.a, opts: fillOpts(m.a, m.w), note: m.note, topic: 'vitals' };
    }
    const k = Math.floor(Math.random() * D.DRILL.length), tp = D.DRILL[k], pt = pick(D.PATIENTS), m = tp.m(pt.w);
    return { pt, title: tp.q, a: m.a, opts: fillOpts(m.a, m.w), note: m.note, topic: drillTopic(D_EN.DRILL[k].n) };
  }
  function round() {
    cur = make(); answered = false;
    const z = D.zoneFor(cur.pt.w);
    $('#dI').textContent = i + 1;
    q.innerHTML = `<div class="drillpt"><div class="w">${cur.pt.w}<small> ${esc(t('kg'))}</small></div><span class="zone" style="--zc:var(--z-${z.id})">${esc(z.n)}</span><span class="chip">${esc(cur.pt.age)}</span></div>
      <div class="qtext">${esc(cur.title)}</div>
      <div class="opts two">${cur.opts.map(o => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
    t0 = performance.now(); clearInterval(timer);
    timer = setInterval(() => {
      const left = 20 - (performance.now() - t0) / 1000;
      $('#dtb').style.width = Math.max(0, left / 20 * 100) + '%';
      if (left <= 0) answer(null);
    }, 100);
  }
  function answer(o) {
    if (answered) return; answered = true; clearInterval(timer);
    const left = Math.max(0, 20 - (performance.now() - t0) / 1000), ok = o === cur.a;
    if (ok) { right++; score += Math.round(100 + left * 5); Sound.ok(); } else { Sound.bad(); noteWeak(cur.topic); }
    $('#dS').textContent = score;
    $$('[data-o]', q).forEach(b => { if (b.dataset.o === cur.a) b.classList.add('right'); else if (b.dataset.o === o) b.classList.add('wrong'); b.disabled = true; });
    q.insertAdjacentHTML('beforeend', `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${esc(ok ? t('correct') : o ? t('notQuite') : t('timeUp'))}</b><span>${esc(cur.a)} \u00b7 ${esc(cur.note)}</span></div><div><button class="btn primary" id="dNext">${esc(i < N - 1 ? t('next') : t('results'))}</button></div>`);
    $('#dNext').focus({ preventScroll: true });
  }
  function end() {
    const isBest = score > (Store.d.drill || 0); Store.d.drill = Math.max(Store.d.drill || 0, score); Store.addXP(score / 25);
    q.innerHTML = `<div class="result"><div class="eyebrow">${esc(isBest ? t('newBest') : t('drillDone'))}</div><div class="big">${score}</div><p class="muted">${esc(t('drillRes', right, N, Math.round(score / 25)))}</p><div class="row" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-go="drill">${esc(t('againShort'))}</button><button class="btn" data-go="card">${esc(t('openCard'))}</button></div></div>`;
    $('#dtb').style.width = '0%';
  }
  q.addEventListener('click', e => {
    const o = e.target.closest('[data-o]'); if (o) { answer(o.dataset.o); return; }
    if (e.target.closest('#dNext')) { i++; if (i < N) round(); else end(); }
  });
  round();
}

/* ---------------- CPR BEAT ---------------- */
function cprScreen() {
  const cfg = { kind: 'child', resc: 1, metro: false };
  let run = null, timer = null, metro = null;
  const target = () => cfg.resc === 1 ? 30 : 15;
  app.innerHTML = `<div class="shell">${secHead(t('cprTitle'), t('cprSub'))}
    <div class="cprwrap">
      <div class="padzone">
        <button class="pad" id="pad" aria-label="${esc(t('compress'))}"><div class="cnt"><span id="pc"></span><small id="pl"></small></div></button>
        <button class="btn" id="breath" disabled>${esc(t('breath'))}</button>
        <svg class="gauge" viewBox="0 0 200 120" aria-label="${esc(t('gauge'))}">
          <path d="${arc(100, 108, 84, 180, 0)}" stroke="var(--panel2)" stroke-width="14" fill="none"/>
          <path d="${arc(100, 108, 84, 108, 72)}" stroke="var(--ecg)" stroke-width="14" fill="none"/>
          ${[60, 80, 100, 120, 140, 160].map(r => { const th = (180 - (r - 60) * 1.8) * Math.PI / 180; return `<text x="${100 + 64 * Math.cos(th)}" y="${108 - 64 * Math.sin(th) + 4}" text-anchor="middle" font-size="10" font-family="IBM Plex Mono, monospace" fill="var(--dim)">${r}</text>`; }).join('')}
          <line id="needle" x1="100" y1="108" x2="100" y2="34" stroke="var(--fg)" stroke-width="3" stroke-linecap="round" style="transform-origin:100px 108px;transform:rotate(-90deg);transition:transform .15s"/>
          <circle cx="100" cy="108" r="6" fill="var(--fg)"/>
          <text x="100" y="92" text-anchor="middle" font-size="18" font-weight="700" font-family="IBM Plex Mono, monospace" fill="var(--fg)" id="rateT">--</text>
        </svg>
      </div>
      <div class="panel">
        <div class="setrow"><label>${esc(t('patient'))}</label><div class="seg" id="kseg"><button data-k="infant">${esc(t('infant'))}</button><button data-k="child">${esc(t('child'))}</button></div></div>
        <div class="setrow"><label>${esc(t('rescuers'))}</label><div class="seg" id="rseg"><button data-r="1">${esc(t('one'))}</button><button data-r="2">${esc(t('two'))}</button></div></div>
        <div class="setrow"><label>${esc(t('metronome'))}</label><div class="seg" id="mseg"><button data-mt="0">${esc(t('off'))}</button><button data-mt="1">110 / min</button></div></div>
        <p class="muted" id="tech" style="font-size:14px"></p>
        <div class="kv" id="stats"></div>
        <div id="res"></div>
      </div>
    </div></div>`;
  const pad = $('#pad');
  function syncSeg() {
    $$('#kseg [data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === cfg.kind));
    $$('#rseg [data-r]').forEach(b => b.classList.toggle('on', +b.dataset.r === cfg.resc));
    $$('#mseg [data-mt]').forEach(b => b.classList.toggle('on', !!+b.dataset.mt === cfg.metro));
    $('#tech').textContent = cfg.kind === 'infant' ? t('techInfant', cfg.resc === 2) : t('techChild');
  }
  function fresh() { run = { start: null, rates: [], inR: 0, pauses: [], count: 0, total: 0, last: null, breathing: false, breaths: 0, pauseStart: null, cycles: 0, ended: false }; stats(); $('#pc').textContent = t('tap'); $('#pl').textContent = t('toStart'); $('#res').innerHTML = ''; pad.classList.remove('breathe'); $('#breath').disabled = true; }
  function curRate() { const r = run.rates.slice(-4); return r.length ? r.reduce((s, x) => s + x, 0) / r.length : null; }
  function stats() {
    const left = run.start ? Math.max(0, 60 - (performance.now() - run.start) / 1000) : 60;
    const n = run.rates.length, pct = n ? Math.round(run.inR / n * 100) : 0;
    $('#stats').innerHTML = `<span>${esc(t('timeLeft'))}</span><b>${mShort(left)}</b><span>${esc(t('comps'))}</span><b>${run.total}</b><span>${esc(t('inZone'))}</span><b>${n ? pct + '%' : '--'}</b><span>${esc(t('cycles'))}</span><b>${run.cycles}</b><span>${esc(t('longPause'))}</span><b>${run.pauses.length ? Math.max(...run.pauses).toFixed(1) + t('sec') : '--'}</b>`;
    const r = curRate();
    $('#rateT').textContent = r ? Math.round(r) : '--';
    const ang = r ? (Math.max(60, Math.min(160, r)) - 60) * 1.8 - 90 : -90;
    $('#needle').style.transform = `rotate(${ang}deg)`;
    $('#rateT').setAttribute('fill', !r ? 'var(--fg)' : r < 100 ? 'var(--rr)' : r > 120 ? 'var(--bad)' : 'var(--ecg)');
  }
  function compress() {
    if (!run || run.ended) return;
    const now = performance.now();
    if (run.breathing) { toast(t('giveFirst')); return; }
    if (!run.start) { run.start = now; clearInterval(timer); timer = setInterval(() => { stats(); if ((performance.now() - run.start) / 1000 >= 60) end(); }, 200); }
    if (run.last) {
      if (run.pauseStart) { run.pauses.push((now - run.pauseStart) / 1000); run.pauseStart = null; }
      else { const rate = 60 / ((now - run.last) / 1000); if (rate < 400) { run.rates.push(rate); if (rate >= 98 && rate <= 122) run.inR++; } }
    }
    run.last = now; run.count++; run.total++;
    pad.classList.remove('hit'); void pad.offsetWidth; pad.classList.add('hit');
    Sound.tone(220, 0.05, 'sine', 0.05);
    if (run.count >= target()) { run.breathing = true; run.breaths = 0; run.pauseStart = now; run.count = 0; run.cycles++; pad.classList.add('breathe'); $('#breath').disabled = false; $('#pc').textContent = '2'; $('#pl').textContent = t('breathsNow'); }
    else { $('#pc').textContent = run.count; $('#pl').textContent = t('ofN', target()); }
    stats();
  }
  function breath() {
    if (!run || !run.breathing || run.ended) return;
    run.breaths++; Sound.tone(330, 0.25, 'sine', 0.05);
    if (run.breaths >= 2) { run.breathing = false; pad.classList.remove('breathe'); $('#breath').disabled = true; $('#pc').textContent = '0'; $('#pl').textContent = t('ofNgo', target()); }
    else { $('#pc').textContent = '1'; $('#pl').textContent = t('moreBreath'); }
  }
  function end() {
    clearInterval(timer); run.ended = true; stats();
    const n = run.rates.length, pct = n ? Math.round(run.inR / n * 100) : 0;
    const avg = n ? Math.round(run.rates.reduce((s, x) => s + x, 0) / n) : 0;
    const longP = run.pauses.filter(p => p > 10).length;
    const sc = Math.max(0, pct - longP * 10);
    const isBest = sc > (Store.d.cpr || 0); Store.d.cpr = Math.max(Store.d.cpr || 0, sc); Store.addXP(sc / 4);
    const tip = t(!n ? 'tipNone' : avg < 100 ? 'tipSlow' : avg > 120 ? 'tipFast' : pct < 70 ? 'tipDrift' : 'tipGood');
    $('#res').innerHTML = `<div class="result"><div class="eyebrow">${esc(isBest ? t('newBest') : t('roundDone'))}</div><div class="big">${sc}%</div><p class="muted">${esc(t('cprRes', avg || '--', longP, run.cycles))}</p><p>${esc(tip)}</p><button class="btn primary" id="again">${esc(t('anotherRound'))}</button></div>`;
    $('#pc').textContent = sc + '%'; $('#pl').textContent = t('scoreWord');
  }
  function setMetro(on) {
    cfg.metro = on; clearInterval(metro); metro = null;
    if (on) { Sound.ensure(); let k = 0; metro = setInterval(() => Sound.click(k++ % 5 === 0), 60000 / 110); }
    syncSeg();
  }
  pad.addEventListener('pointerdown', e => { e.preventDefault(); compress(); });
  pad.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); compress(); } });
  $('#breath').addEventListener('click', breath);
  $('.cprwrap').addEventListener('click', e => {
    const k = e.target.closest('[data-k]'); if (k) { cfg.kind = k.dataset.k; syncSeg(); fresh(); return; }
    const r = e.target.closest('[data-r]'); if (r) { cfg.resc = +r.dataset.r; syncSeg(); fresh(); return; }
    const mt = e.target.closest('[data-mt]'); if (mt) { setMetro(!!+mt.dataset.mt); return; }
    if (e.target.closest('#again')) fresh();
  });
  const onKey = e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); compress(); }
    else if (e.key === 'b' || e.key === 'B') breath();
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => { document.removeEventListener('keydown', onKey); clearInterval(timer); clearInterval(metro); });
  syncSeg(); fresh();
}
function arc(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

/* ---------------- RAPID RECALL ---------------- */
function relTime(ms) {
  const L = t('rel'), m = Math.max(1, Math.round(ms / 60000));
  return m < 60 ? L.min(m) : m < 60 * 24 ? L.h(Math.round(m / 60)) : L.d(Math.round(m / 1440));
}
function recallScreen(arg) {
  const ALL = t('all'), DUE = t('dueChip'), WEAK = t('weakChip');
  const cats = [DUE, WEAK, ALL, ...new Set(D.CARDS.map(c => c.c))];
  let cat = DUE, weakIds = null, deck = [], i = 0, flipped = false, knew = 0;
  const a = String(arg || '');
  if (a.startsWith('weak:')) { cat = WEAK; weakIds = new Set(a.slice(5).split(',').flatMap(topicCards)); }
  app.innerHTML = `<div class="shell">${secHead(t('recallTitle'), t('recallSub'))}
    <div class="game"><div class="filters" id="cf"></div><div class="boxes" id="bx"></div><p class="muted dueinfo" id="dueInfo"></p><div id="fc"></div></div></div>`;
  const now = () => Date.now();
  const weakSet = () => weakIds || new Set(weakList().flatMap(([tp]) => topicCards(tp)));
  const poolOf = () => cat === DUE ? D.CARDS : cat === WEAK ? D.CARDS.filter(c => weakSet().has(c.id)) : D.CARDS.filter(c => cat === ALL || c.c === cat);
  const isDueC = c => { const r = cardRec(c.id); return r && r.due <= now(); };
  function boxes() {
    const pool = poolOf(), cnt = [0, 0, 0, 0, 0];
    pool.forEach(c => cnt[cardBox(c.id)]++);
    $('#bx').innerHTML = t('boxes').map((n, k) => `<div><b>${cnt[k]}</b>${n}</div>`).join('');
    $('#dueInfo').textContent = t('dueInfo', pool.filter(isDueC).length, pool.filter(c => !cardRec(c.id)).length);
    $('#cf').innerHTML = cats.map(c => `<button data-c="${esc(c)}" class="${c === cat ? 'on' : ''}">${esc(c)}</button>`).join('');
  }
  function newDeck(practice) {
    const pool = poolOf();
    const due = pool.filter(isDueC).sort((x, y) => cardBox(x.id) - cardBox(y.id) || cardRec(x.id).due - cardRec(y.id).due);
    const fresh = shuffle(pool.filter(c => !cardRec(c.id)));
    if (cat === WEAK) deck = shuffle(pool).sort((x, y) => cardBox(x.id) - cardBox(y.id)).slice(0, 10);
    else if (cat === DUE && !practice) deck = [...due, ...fresh].slice(0, 10);
    else {
      const rest = shuffle(pool.filter(c => !due.includes(c) && !fresh.includes(c))).sort((x, y) => cardBox(x.id) - cardBox(y.id));
      deck = [...due, ...fresh, ...rest].slice(0, 10);
    }
    i = 0; knew = 0; flipped = false; boxes(); show();
  }
  function show() {
    const el = $('#fc');
    if (!deck.length) {
      const next = D.CARDS.map(c => cardRec(c.id)).filter(r => r && r.due > now()).reduce((mn, r) => Math.min(mn, r.due), Infinity);
      el.innerHTML = `<div class="result"><div class="eyebrow">${esc(t('caught'))}</div><div class="big">\u2713</div>${next < Infinity ? `<p class="muted">${esc(t('nextDue', relTime(next - now())))}</p>` : ''}<button class="btn primary" data-practice>${esc(t('practice'))}</button></div>`;
      return;
    }
    if (i >= deck.length) {
      Store.addXP(knew * 2);
      el.innerHTML = `<div class="result"><div class="eyebrow">${esc(t('roundDoneR'))}</div><div class="big">${knew}/${deck.length}</div><p class="muted">${esc(t('recallRes', knew * 2))}</p><button class="btn primary" data-new>${esc(t('next10'))}</button></div>`;
      boxes(); return;
    }
    const c = deck[i];
    el.innerHTML = `<div class="flash"><button class="fcard${flipped ? ' flip' : ''}" id="card" aria-label="${esc(t('flip'))}"><div class="face"><span class="eyebrow">${esc(c.c)} \u00b7 ${i + 1}/${deck.length}</span><div class="q">${esc(c.q)}</div><span class="muted" style="font-size:13px">${esc(t('tapFlip'))}</span></div><div class="face back"><span class="eyebrow">${esc(t('answer'))}</span><div class="a">${esc(c.a)}</div><span class="muted" style="font-size:13px">${esc(c.q)}</span></div></button></div>
      <div class="row" style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn" data-miss ${flipped ? '' : 'disabled'}>${esc(t('missedIt'))}</button><button class="btn primary" data-knew ${flipped ? '' : 'disabled'}>${esc(t('knewIt'))}</button></div>`;
  }
  $('.game').addEventListener('click', e => {
    const cb = e.target.closest('[data-c]'); if (cb) { cat = cb.dataset.c; if (cat !== WEAK) weakIds = null; newDeck(); return; }
    if (e.target.closest('#card')) { flipped = !flipped; $('#card').classList.toggle('flip', flipped); $$('[data-miss],[data-knew]').forEach(b => { b.disabled = !flipped; }); return; }
    if (e.target.closest('[data-new]')) { newDeck(); return; }
    if (e.target.closest('[data-practice]')) { newDeck(true); return; }
    const k = e.target.closest('[data-knew]'), m = e.target.closest('[data-miss]');
    if (k || m) {
      const c = deck[i], b = cardBox(c.id);
      if (k) { cardSet(c.id, Math.min(4, b + 1)); knew++; Sound.ok(); weakList().forEach(([tp]) => { if (topicCards(tp).includes(c.id)) easeWeak(tp, 0.34); }); }
      else { cardSet(c.id, 0, true); Sound.bad(); }
      Store.save(); i++; flipped = false; boxes(); show();
    }
  });
  const onKey = e => {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    if (e.code === 'Space') { const cd = $('#card'); if (cd) { e.preventDefault(); cd.click(); } }
    else if (e.code === 'ArrowRight' || e.code === 'KeyK') { const b = $('[data-knew]'); if (b && !b.disabled) b.click(); }
    else if (e.code === 'ArrowLeft' || e.code === 'KeyJ') { const b = $('[data-miss]'); if (b && !b.disabled) b.click(); }
  };
  document.addEventListener('keydown', onKey); cleanups.push(() => document.removeEventListener('keydown', onKey));
  newDeck();
}

/* ---------------- EXAM ---------------- */
function examScreen() {
  const N = 25, LIMIT = 20 * 60;
  app.innerHTML = `<div class="shell">${secHead(t('examTitle'), t('examSub'))}<div class="game" id="ex"></div></div>`;
  const box = $('#ex');
  let qs = [], i = 0, ans = [], t0 = 0, timer = null, mon = null, over = false;
  const stopMon = () => { if (mon) { mon.destroy(); mon = null; } };
  cleanups.push(() => { clearInterval(timer); stopMon(); });
  const shufOpts = os => shuffle(os.map(o => ({ t: o.t, ok: !!o.ok, why: o.why || '' })));
  function build() {
    const caseQs = shuffle(D.CASES.flatMap(c => c.phases.filter(p => p.type === 'q').map(p => ({ topic: c.algo, ctx: `${c.age} \u00b7 ${c.wt} ${t('kg')}`, say: p.say, q: p.q, opts: shufOpts(p.opts), teach: p.teach || '' })))).slice(0, 11);
    const names = [...new Set(D.RUSH.map(x => x.a))], rush = shuffle(D.RUSH);
    const rhy = rush.slice(0, 4).map(it => ({ topic: 'rhythm', strip: it, ctx: `${it.ctx} \u00b7 ${it.p ? t('pulseYes') : t('pulseNo')}`, say: '', q: t('nameRhythm'), opts: shuffle([it.a, ...shuffle(names.filter(n => n !== it.a)).slice(0, 3)]).map(n => ({ t: n, ok: n === it.a, why: '' })), teach: `${it.a}: ${it.f}` }));
    const nxt = rush.slice(4, 6).map(it => ({ topic: 'rhythm', strip: it, ctx: `${it.ctx} \u00b7 ${it.a}`, say: '', q: it.nx.q, opts: shuffle([it.nx.ok, ...it.nx.bad]).map(n => ({ t: n, ok: n === it.nx.ok, why: '' })), teach: `${it.a}: ${it.f}` }));
    const dose = shuffle(Object.keys(D.DOSE)).slice(0, 8).map(k => { const pt = pick(D.PATIENTS), d = D.DOSE[k](pt.w); return { topic: DOSE_TOPIC[k] || 'doses', ctx: `${pt.age} \u00b7 ${pt.w} ${t('kg')}`, say: '', q: d.title, opts: shufOpts(d.opts), teach: `${t('rule')}: ${d.rule}` }; });
    return shuffle([...caseQs, ...rhy, ...nxt, ...dose]).slice(0, N);
  }
  function intro() {
    stopMon(); over = false;
    box.innerHTML = `<div class="result exintro"><div class="eyebrow">${esc(t('examEyebrow'))}</div><div class="big">${N}</div><ul class="how">${t('examRules').map(r => `<li>${esc(r)}</li>`).join('')}</ul><p class="muted">${esc(t('best'))}: ${Store.d.exam || 0}%</p><button class="btn primary" data-exgo>${esc(t('examStart'))}</button></div>`;
  }
  function start() { qs = build(); i = 0; ans = []; over = false; t0 = performance.now(); clearInterval(timer); timer = setInterval(clock, 250); show(); }
  function clock() {
    const left = LIMIT - (performance.now() - t0) / 1000, el = $('#exT');
    if (el) { el.textContent = mmss(left); el.parentElement.classList.toggle('late', left < 120); }
    if (left <= 0 && !over) end();
  }
  function show() {
    const q = qs[i]; stopMon();
    box.innerHTML = `<div class="hud"><span>${esc(t('question'))} <b>${i + 1}</b>/${N}</span><span class="exclock">${esc(t('timeLeft'))} <b id="exT">${mmss(LIMIT - (performance.now() - t0) / 1000)}</b></span></div>
      <div class="timebar"><i style="width:${i / N * 100}%"></i></div>
      ${q.strip ? `<div class="rushmon"><canvas id="ecv"></canvas></div>` : ''}
      <div class="qbox"><div class="exctx"><span class="chip">${esc(q.ctx)}</span></div>${q.say ? `<p class="say">${esc(q.say)}</p>` : ''}<div class="qtext">${esc(q.q)}</div>
      <div class="opts">${q.opts.map((o, k) => `<button class="opt" data-o="${k}">${kbd(k + 1)}${esc(o.t)}</button>`).join('')}</div></div>`;
    if (q.strip) { mon = new Monitor($('#ecv'), { sweep: 5 }); mon.set({ monitor: true, rhythm: q.strip.r, hr: q.strip.hr || 60, pulse: q.strip.p, cpr: false }); }
  }
  function end() {
    over = true; clearInterval(timer); stopMon();
    const res = qs.map((q, k) => ({ q, a: ans[k], ok: ans[k] !== undefined && q.opts[ans[k]].ok }));
    const right = res.filter(r => r.ok).length, pct = Math.round(right / N * 100), pass = pct >= 84;
    const isBest = pct > (Store.d.exam || 0); Store.d.exam = Math.max(Store.d.exam || 0, pct);
    const byT = {}; res.forEach(r => { const b = byT[r.q.topic] = byT[r.q.topic] || [0, 0]; b[1]++; if (r.ok) b[0]++; });
    const wrongT = [...new Set(res.filter(r => !r.ok).map(r => r.q.topic))];
    applyWeak(wrongT, null, false); Store.addXP(right * 4);
    const TP = t('topics');
    box.innerHTML = `<div class="result"><div class="eyebrow">${esc(isBest ? t('newBest') : t('examDone'))}</div><div class="big ${pass ? 'pass' : 'fail'}">${pct}%</div><p><b>${esc(pass ? t('examPass') : t('examFail'))}</b></p><p class="muted">${esc(t('examRes', right, N, right * 4))}</p></div>
      <h3 class="exh">${esc(t('byTopic'))}</h3><div class="topics">${Object.entries(byT).sort((x, y) => x[1][0] / x[1][1] - y[1][0] / y[1][1]).map(([tp, [r, n]]) => `<div class="tp"><span>${esc(TP[tp] || tp)}</span><span class="wbar ${r === n ? 'full' : ''}"><i style="width:${Math.round(r / n * 100)}%"></i></span><b>${r}/${n}</b></div>`).join('')}</div>
      ${res.some(r => !r.ok) ? `<h3 class="exh">${esc(t('reviewWrong'))}</h3><ol class="review">${res.filter(r => !r.ok).map(r => { const c = r.q.opts.find(o => o.ok), y = r.a !== undefined ? r.q.opts[r.a] : null; return `<li><div class="rq"><span class="chip">${esc(r.q.ctx)}</span> ${r.q.say ? esc(r.q.say) + ' ' : ''}<b>${esc(r.q.q)}</b></div><div class="ry">\u2717 ${y ? esc(y.t) + (y.why ? ` <small>${esc(y.why)}</small>` : '') : esc(t('noAnswer'))}</div><div class="rc">\u2713 ${esc(c.t)}</div>${r.q.teach ? `<small class="muted">${esc(r.q.teach)}</small>` : ''}</li>`; }).join('')}</ol>` : ''}
      <div class="row" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn primary" data-retake>${esc(t('retake'))}</button>${wrongT.length ? `<button class="btn" data-go="recall" data-arg="weak:${wrongT.join(',')}">${esc(t('drillWeak'))}</button>` : ''}<button class="btn ghost" data-go="home">${esc(t('home'))}</button></div>`;
    window.scrollTo(0, 0);
  }
  box.addEventListener('click', e => {
    if (e.target.closest('[data-exgo]')) { start(); return; }
    if (e.target.closest('[data-retake]')) { intro(); return; }
    const b = e.target.closest('[data-o]');
    if (b && !over && ans.length === i && qs[i]) {
      ans.push(+b.dataset.o); b.classList.add('picked'); $$('[data-o]', box).forEach(x => { x.disabled = true; });
      setTimeout(() => { if (over) return; i++; if (i < N) show(); else end(); }, 220);
    }
  });
  const onKey = e => {
    const dm = /^(Digit|Numpad)([1-9])$/.exec(e.code); if (!dm) return;
    const b = $$('[data-o]', box)[+dm[2] - 1]; if (b && !b.disabled) { e.preventDefault(); b.click(); }
  };
  document.addEventListener('keydown', onKey); cleanups.push(() => document.removeEventListener('keydown', onKey));
  intro();
}

/* ---------------- LIVE CODE (real-time helper) ---------------- */
function liveScreen() {
  const LK = 'palsResusBay.live', f = D.f;
  let w = Store.d.liveW || 20, L = null, iv = null, metro = null, wake = null, lastBeep = 0;
  cleanups.push(() => { clearInterval(iv); clearInterval(metro); try { if (wake) wake.release(); } catch (e) { /* ignore */ } });
  const now = () => Date.now();
  const el = () => Math.max(0, (now() - L.t0) / 1000);
  const saveL = () => { try { localStorage.setItem(LK, JSON.stringify(L)); } catch (e) { /* storage unavailable */ } };
  const dz = () => ({ epi: f(Math.min(0.01 * w, 1)), epiMl: f(Math.min(0.1 * w, 10)), amio: f(Math.min(5 * w, 300)), lido: f(Math.min(w, 100)) });
  const jl = n => t('lvJ', n, f(2 * w), f(4 * w), f(10 * w));
  const logE = txt => { L.log.push([el(), txt]); saveL(); };
  const snap = () => { const c = Object.assign({}, L); delete c.undo; delete c.log; L.undo.push({ s: JSON.stringify(c), n: L.log.length }); if (L.undo.length > 40) L.undo.shift(); };
  function setup() {
    let saved = null; try { saved = JSON.parse(localStorage.getItem(LK) || 'null'); } catch (e) { saved = null; }
    if (saved && (saved.ended || now() - saved.t0 > 3 * 3600e3)) saved = null;
    app.innerHTML = `<div class="shell">${secHead(t('liveTitle'), t('liveSub'))}
      <div class="lvwarn">${IC.flag}<span>${esc(t('liveWarn'))}</span></div>
      ${saved ? `<div class="lvresume"><span>${esc(t('liveResumeQ', new Date(saved.t0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))}</span><button class="btn primary" id="lvRes">${esc(t('liveResume'))}</button><button class="btn ghost" id="lvDiscard">${esc(t('liveDiscard'))}</button></div>` : ''}
      <div class="ccin"><div class="field"><label for="lvW">${esc(t('weightKg'))}</label><input id="lvW" type="number" inputmode="decimal" min="2" max="100" step="0.5" value="${w}"></div>
        <div class="field"><label for="lvA">${esc(t('ageY'))}</label><input id="lvA" type="number" inputmode="decimal" min="0" max="18" step="0.25" placeholder="-"></div><button class="btn" id="lvEst">${esc(t('estimate'))}</button></div>
      <div class="zonepick" id="lvZ" style="margin-top:12px">${D.ZONES.map(z => `<button data-z="${z.id}" style="--zc:var(--z-${z.id})">${z.min}-${z.max}</button>`).join('')}</div>
      <div class="lvpre" id="lvPre"></div>
      <button class="btn primary lvstart" id="lvGo">${IC.live} ${esc(t('liveStart'))}</button></div>`;
    const pre = () => { const d = dz(); $('#lvPre').innerHTML = `<span>${esc(t('lvEpiShort'))} <b dir="ltr">${d.epi} mg = ${d.epiMl} mL</b></span><span>${esc(t('lvShockShort'))} <b dir="ltr">${f(2 * w)} \u2192 ${f(4 * w)} J</b></span><span>${esc(t('lvAmioShort'))} <b dir="ltr">${d.amio} mg</b></span>`; $$('#lvZ [data-z]').forEach(b => b.classList.toggle('on', b.dataset.z === D.zoneFor(w).id)); };
    pre();
    $('#lvW').addEventListener('input', e => { const v = parseFloat(e.target.value); if (v > 0) { w = v; pre(); } });
    $('#lvEst').addEventListener('click', () => { const a = parseFloat($('#lvA').value); if (!(a >= 0)) return; const est = a < 1 ? (a * 12) / 2 + 4 : a <= 5 ? 2 * a + 8 : Math.min(70, 3 * a + 7); w = Math.round(est * 2) / 2; $('#lvW').value = w; pre(); toast(t('estimated', w)); });
    $('#lvZ').addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (!b) return; w = D.ZONES.find(z => z.id === b.dataset.z).mid; $('#lvW').value = w; pre(); });
    $('#lvGo').addEventListener('click', () => {
      Sound.ensure(); Store.d.liveW = w; Store.save(false);
      L = { t0: now(), w, cyc0: now(), log: [], shocks: 0, epi: 0, lastEpi: null, amio: 0, lido: 0, rhythm: null, needShock: false, ivio: false, airway: false, rosc: false, hts: [], undo: [] };
      logE(t('lvLogStart', f(w))); run();
    });
    if (saved) {
      $('#lvRes').addEventListener('click', () => { Sound.ensure(); L = saved; w = L.w; run(); });
      $('#lvDiscard').addEventListener('click', () => { try { localStorage.removeItem(LK); } catch (e) { /* ignore */ } setup(); });
    }
  }
  function run() {
    saveL();
    const d = dz();
    app.innerHTML = `<div class="live">
      <div class="lvtop"><button class="iconbtn" data-go="home" aria-label="${esc(t('backHome'))}">${IC.back}</button><div class="lvclk"><small>${esc(t('code'))}</small><b id="lvClock">00:00</b></div><span class="zone" style="--zc:var(--z-${D.zoneFor(L.w).id})">${f(L.w)} ${esc(t('kg'))}</span><span class="sp"></span><button class="btn ghost sm" data-lv="undo">${esc(t('undo'))}</button><button class="btn sm" data-lv="end">${esc(t('liveEnd'))}</button></div>
      <div class="lvnext" id="lvNext" aria-live="polite"></div>
      <div class="lvtimers">
        <button class="lvtimer" data-lv="check" id="lvCyc"><small>${esc(t('lvCycle'))}</small><b id="lvCycT" dir="ltr">2:00</b><span>${esc(t('lvCheckBtn'))}</span><i class="lvbar"><i id="lvCycBar"></i></i></button>
        <button class="lvtimer" data-lv="epi" id="lvEpi"><small>${esc(t('lvEpiSince'))}</small><b id="lvEpiT" dir="ltr">-</b><span>${esc(t('lvEpiBtn'))}</span><span class="lvdose" dir="ltr">${d.epi} mg = ${d.epiMl} mL</span></button>
      </div>
      <div class="lvbtns">
        <button class="lvb shock" data-lv="shock"><b>${esc(t('lvShock'))} <span id="lvShockN"></span></b><small id="lvShockJ"></small></button>
        <button class="lvb" data-lv="amio"><b>${esc(t('lvAmio'))}</b><small dir="ltr">5 mg/kg = ${d.amio} mg</small></button>
        <button class="lvb" data-lv="lido"><b>${esc(t('lvLido'))}</b><small dir="ltr">1 mg/kg = ${d.lido} mg</small></button>
        <button class="lvb" data-lv="ivio" id="lvIv"><b>IV / IO</b><small></small></button>
        <button class="lvb" data-lv="airway" id="lvAw"><b>${esc(t('lvAirway'))}</b><small></small></button>
        <button class="lvb" data-lv="metro" id="lvMet"><b>${esc(t('metronome'))}</b><small dir="ltr">110/min</small></button>
        <button class="lvb rosc" data-lv="rosc"><b>ROSC</b><small>${esc(t('lvRoscS'))}</small></button>
      </div>
      <details class="lvhts"><summary>${esc(t('hts'))} <span id="lvHtsN"></span></summary><div class="lvhtsg">${D.HTS.map((h, k) => `<button data-h="${k}">${esc(h)}</button>`).join('')}</div></details>
      <div class="lvlog"><div class="lvloghd"><h3>${esc(t('lvLog'))}</h3><button class="btn ghost sm" data-lv="copy">${esc(t('lvCopy'))}</button></div><ol id="lvLog"></ol></div>
    </div>`;
    const root = $('.live');
    root.addEventListener('click', e => {
      const h = e.target.closest('[data-h]');
      if (h) { snap(); const k = +h.dataset.h, j = L.hts.indexOf(k); if (j >= 0) L.hts.splice(j, 1); else { L.hts.push(k); logE(`${t('lvLogHts')}: ${D.HTS[k]}`); } saveL(); renderL(); return; }
      const b = e.target.closest('[data-lv]'); if (!b) return;
      act(b.dataset.lv);
    });
    clearInterval(iv); iv = setInterval(tickL, 250); tickL(); renderL();
    try { if (navigator.wakeLock) navigator.wakeLock.request('screen').then(x => { wake = x; }).catch(() => {}); } catch (e) { /* not supported */ }
  }
  function act(k) {
    const d = dz();
    if (k === 'check') {
      if (L.rosc || L.ended) return;
      const m = modal(`<div class="sheet" role="dialog" aria-modal="true"><h2>${esc(t('lvCheckQ'))}</h2><div class="opts lvchk"><button class="opt shock" data-r="shock">${kbd(1)}${esc(t('lvShockable'))}</button><button class="opt" data-r="non">${kbd(2)}${esc(t('lvNon'))}</button><button class="opt rosc" data-r="rosc">${kbd(3)}${esc(t('lvPulse'))}</button></div><div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button></div></div>`);
      m.el.addEventListener('click', e => {
        const r = e.target.closest('[data-r]');
        if (r) { snap(); const v = r.dataset.r; logE(t('lvLogCheck')[v]); L.cyc0 = now(); if (v === 'rosc') { L.rosc = true; logE(t('lvLogRosc')); } else { L.rhythm = v; L.needShock = v === 'shock'; } m.close(); renderL(); }
        else if (e.target.closest('[data-x]')) m.close();
      });
      return;
    }
    if (k === 'undo') { const u = L.undo.pop(); if (!u) return; Object.assign(L, JSON.parse(u.s)); L.log.length = u.n; saveL(); renderL(); return; }
    if (k === 'copy') { copyLog(); return; }
    if (k === 'metro') {
      Sound.ensure();
      if (metro) { clearInterval(metro); metro = null; } else { let n = 0; metro = setInterval(() => Sound.click(n++ % 30 === 0), 60000 / 110); }
      renderL(); return;
    }
    if (k === 'end') {
      const m = modal(`<div class="sheet" role="dialog" aria-modal="true"><h2>${esc(t('lvEndQ'))}</h2><p class="muted">${esc(t('lvEndSub'))}</p><div class="row"><button class="btn" data-copy>${esc(t('lvCopy'))}</button><button class="btn ghost" data-x>${esc(t('cancel'))}</button><button class="btn primary" data-endok>${esc(t('liveEnd'))}</button></div></div>`);
      m.el.addEventListener('click', e => {
        if (e.target.closest('[data-copy]')) copyLog();
        else if (e.target.closest('[data-x]')) m.close();
        else if (e.target.closest('[data-endok]')) { logE(t('lvLogEnd')); L.ended = true; saveL(); clearInterval(metro); metro = null; m.close(); go('home'); }
      });
      return;
    }
    if (L.ended) return;
    snap();
    if (k === 'shock') { L.shocks++; L.needShock = false; L.cyc0 = now(); logE(t('lvLogShock', L.shocks, jl(L.shocks))); Sound.zap(); }
    else if (k === 'epi') { L.epi++; L.lastEpi = now(); logE(t('lvLogEpi', L.epi, d.epi)); }
    else if (k === 'amio') { L.amio++; logE(t('lvLogAmio', L.amio, d.amio)); if (L.amio > 3) toast(t('lvAmioMax')); }
    else if (k === 'lido') { L.lido++; logE(t('lvLogLido', L.lido, d.lido)); }
    else if (k === 'ivio') { if (L.ivio) { L.undo.pop(); return; } L.ivio = true; logE(t('lvLogIv')); }
    else if (k === 'airway') { if (L.airway) { L.undo.pop(); return; } L.airway = true; logE(t('lvLogAw')); }
    else if (k === 'rosc') { if (L.rosc) { L.undo.pop(); return; } L.rosc = true; logE(t('lvLogRosc')); }
    saveL(); renderL();
  }
  function logText() {
    const st = new Date(L.t0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [t('lvHeader', f(L.w), st), ...L.log.map(([s, x]) => `${mmss(s)}  ${x}`)].join('\n');
  }
  function copyLog() {
    const txt = logText();
    const fallback = () => { const m = modal(`<div class="sheet" role="dialog" aria-modal="true"><h2>${esc(t('lvLog'))}</h2><textarea class="lvta" readonly>${esc(txt)}</textarea><div class="row"><button class="btn primary" data-x>${esc(t('lvDone'))}</button></div></div>`); const ta = $('textarea', m.el); ta.focus(); ta.select(); m.el.addEventListener('click', e => { if (e.target.closest('[data-x]')) m.close(); }); };
    try { navigator.clipboard.writeText(txt).then(() => toast(t('copied')), fallback); } catch (e) { fallback(); }
  }
  function nextItems() {
    const d = dz(), N = t('lvN');
    if (L.rosc) return N.rosc;
    if (!L.rhythm) return N.start;
    const epiDue = L.lastEpi === null || (now() - L.lastEpi) / 1000 >= 180, out = [];
    if (L.rhythm === 'shock') {
      out.push(L.needShock ? N.shockNow(jl(L.shocks + 1)) : N.cpr);
      if (!L.ivio) out.push(N.access);
      if (L.shocks >= 2 && epiDue) out.push(N.epi(d.epi, d.epiMl));
      if (L.shocks >= 3 && L.amio + L.lido === 0) out.push(N.anti(d.amio, d.lido));
    } else {
      out.push(N.cpr);
      if (!L.ivio) out.push(N.access);
      if (epiDue) out.push(N.epi(d.epi, d.epiMl));
      if (!L.airway) out.push(N.airway);
    }
    out.push(N.hts);
    return out;
  }
  function renderL() {
    if (!$('#lvNext')) return;
    $('#lvNext').innerHTML = `<ol>${nextItems().map(x => `<li>${esc(x)}</li>`).join('')}</ol>`;
    $('#lvNext').classList.toggle('shocknow', !!L.needShock && !L.rosc);
    $('#lvShockN').textContent = '#' + (L.shocks + 1); $('#lvShockJ').textContent = jl(L.shocks + 1);
    $('#lvIv small').textContent = L.ivio ? `\u2713 ${t('lvIn')}` : '';
    $('#lvAw small').textContent = L.airway ? `\u2713 ${t('lvPlaced')}` : '';
    $('#lvIv').classList.toggle('on', L.ivio); $('#lvAw').classList.toggle('on', L.airway); $('#lvMet').classList.toggle('on', !!metro);
    $('.lvb.rosc').classList.toggle('on', L.rosc);
    $('#lvHtsN').textContent = L.hts.length ? `(${L.hts.length}/${D.HTS.length})` : '';
    $$('.lvhtsg [data-h]').forEach(b => b.classList.toggle('on', L.hts.includes(+b.dataset.h)));
    $('#lvLog').innerHTML = L.log.slice().reverse().map(([s, x]) => `<li><span dir="ltr">${mmss(s)}</span>${esc(x)}</li>`).join('');
    tickL();
  }
  function tickL() {
    if (!L || !$('#lvClock')) return;
    $('#lvClock').textContent = mmss(el());
    const cyc = $('#lvCyc'), ep = $('#lvEpi');
    if (L.rosc || L.ended) { $('#lvCycT').textContent = '-'; cyc.classList.remove('due'); $('#lvCycBar').style.width = '0%'; }
    else {
      const left = 120 - (now() - L.cyc0) / 1000;
      $('#lvCycT').textContent = left >= 0 ? mShort(left) : '+' + mShort(-left);
      $('#lvCycBar').style.width = Math.min(100, (1 - left / 120) * 100) + '%';
      cyc.classList.toggle('due', left <= 0);
      if (left <= 0 && now() - lastBeep > 15000) { lastBeep = now(); Sound.alarm(); try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) { /* ignore */ } toast(t('lvCheckDue')); }
    }
    if (L.lastEpi === null) { $('#lvEpiT').textContent = '-'; ep.classList.remove('warn', 'due'); }
    else { const since = (now() - L.lastEpi) / 1000; $('#lvEpiT').textContent = mShort(since); ep.classList.toggle('warn', since >= 180 && since < 300 && !L.rosc); ep.classList.toggle('due', since >= 300 && !L.rosc); }
  }
  setup();
}

/* ---------------- REPORT (wording / error reports, saved to the artifact db) ---------------- */
function reportDialog() {
  const ctx = [CUR.name + (CUR.arg && typeof CUR.arg !== 'object' ? ':' + CUR.arg : ''), S && S.c ? `case ${S.c.id} \u00b7 step ${S.i + 1}${S.p && S.p.k ? ' (' + S.p.k + ')' : ''}` : '', 'lang ' + LANG].filter(Boolean).join(' \u00b7 ');
  const m = modal(`<div class="sheet" role="dialog" aria-modal="true"><h2>${esc(t('reportTitle'))}</h2><p class="muted">${esc(t('reportSub'))}</p><textarea class="rpta" id="rpT" placeholder="${esc(t('reportPh'))}"></textarea><p class="muted small" dir="ltr">${esc(ctx)}</p><div class="row"><button class="btn ghost" data-x>${esc(t('cancel'))}</button><button class="btn primary" data-send>${esc(t('send'))}</button></div></div>`);
  setTimeout(() => { const ta = $('#rpT'); if (ta) ta.focus(); }, 40);
  m.el.addEventListener('click', async e => {
    if (e.target.closest('[data-x]')) { m.close(); return; }
    if (!e.target.closest('[data-send]')) return;
    const text = ($('#rpT').value || '').trim(); if (!text) return;
    const doc = { text: text.slice(0, 4000), ctx, lang: LANG, situ: (($('#situ') || {}).innerText || '').slice(0, 600), at: new Date().toISOString() };
    m.close();
    try {
      const db = Sync.db || (window.claude && window.claude.use ? await window.claude.use('db') : null);
      if (!db) throw new Error('no db');
      await db.collection('reports').add(doc); toast(t('reportSent'));
    } catch (er) {
      try { await navigator.clipboard.writeText(`[PALS report] ${doc.ctx}\n${doc.text}`); } catch (e2) { /* ignore */ }
      toast(t('reportCopied'));
    }
  });
}
document.addEventListener('click', e => { if (e.target.closest('[data-report]')) reportDialog(); });

/* ---------------- CODE CARD ---------------- */
function codeCard() {
  let w = 20, age = 6;
  app.innerHTML = `<div class="shell">${secHead(t('cardTitle'), t('cardSub'))}
    <div class="ccin">
      <div class="field"><label for="ccW">${esc(t('weightKg'))}</label><input id="ccW" type="number" inputmode="decimal" min="2" max="80" step="0.5" value="${w}"></div>
      <div class="field"><label for="ccA">${esc(t('ageY'))}</label><input id="ccA" type="number" inputmode="decimal" min="0" max="18" step="0.25" value="${age}"></div>
      <button class="btn" id="ccEst">${esc(t('estimate'))}</button>
    </div>
    <div class="zonepick" id="zp" style="margin-top:12px">${D.ZONES.map(z => `<button data-z="${z.id}" style="--zc:var(--z-${z.id})" title="${esc(t('zoneTitle', z.n, z.min, z.max))}">${z.min}-${z.max}</button>`).join('')}</div>
    <div id="ccOut"></div></div>`;
  const out = $('#ccOut'), f = D.f, RW = t('rows');
  function row(k, val) { const r = RW[k]; return `<tr><td>${esc(r[0])}<small>${esc(r[1])}</small></td><td>${val}</td></tr>`; }
  function render() {
    const z = D.zoneFor(w);
    $$('#zp [data-z]').forEach(b => b.classList.toggle('on', b.dataset.z === z.id));
    const ap = age >= 1 && age <= 10 ? `${70 + 2 * Math.floor(age)} mmHg` : age < 1 / 12 ? '60 mmHg' : age < 1 ? '70 mmHg' : '90 mmHg';
    const ett = age >= 1 ? `${f(Math.round((age / 4 + 3.5) * 2) / 2)} \u00b7 ${f(Math.round((age / 4 + 4) * 2) / 2)}<small>${esc(RW.cuff)}</small>` : '\u2014';
    const vrow = D.VITALS.find(v => age <= v.max) || D.VITALS[D.VITALS.length - 1];
    const infant = age < 1, VH = t('vtHead');
    out.innerHTML = `<div class="ccgrid">
      <div class="cc" style="--cc:var(--accent)"><h3>${esc(t('ccArrest'))}</h3><table>
        ${row('epi', `${f(Math.min(0.01 * w, 1))} mg<small>${f(Math.min(0.1 * w, 10))} mL</small>`)}
        ${row('epiET', `${f(Math.min(0.1 * w, 2.5))} mg`)}
        ${row('defib', `${f(2 * w)} \u2192 ${f(4 * w)} J<small>${esc(RW.defibMax(f(10 * w)))}</small>`)}
        ${row('amioArr', `${f(Math.min(5 * w, 300))} mg`)}
        ${row('lido', `${f(Math.min(w, 100))} mg`)}
      </table></div>
      <div class="cc" style="--cc:var(--bp)"><h3>${esc(t('ccRhythm'))}</h3><table>
        ${row('adeno', `${f(Math.min(0.1 * w, 6))} \u2192 ${f(Math.min(0.2 * w, 12))} mg`)}
        ${row('sync', `${f(0.5 * w)}-${f(w)} \u2192 ${f(2 * w)} J`)}
        ${row('atropine', `${f(D.clamp(0.02 * w, 0.1, 0.5))} mg`)}
        ${row('amioPulse', `${f(Math.min(5 * w, 300))} mg`)}
        ${row('procain', `${f(15 * w)} mg`)}
        ${row('mag', `${f(20 * w)}-${f(Math.min(50 * w, 2000))} mg`)}
      </table></div>
      <div class="cc" style="--cc:var(--spo2)"><h3>${esc(t('ccFluids'))}</h3><table>
        ${row('bolus', `${f(20 * w)} mL`)}
        ${row('cardioBolus', `${f(5 * w)}-${f(10 * w)} mL`)}
        ${row('d10', `${f(5 * w)}-${f(10 * w)} mL`)}
        ${row('d25', `${f(2 * w)}-${f(4 * w)} mL`)}
        ${row('bicarb', `${f(Math.min(w, 50))} mEq`)}
        ${row('urine', `\u2265 ${f(w)} mL/h`)}
      </table></div>
      <div class="cc" style="--cc:var(--rr)"><h3>${esc(t('ccAirway'))}</h3><table>
        ${row('epiIM', `${f(Math.min(0.01 * w, 0.5))} mg`)}
        ${row('naloxone', `${f(w <= 20 ? 0.1 * w : 2)} mg`)}
        ${row('ett', ett)}
        ${row(infant ? 'cprInf' : 'cprChild', `${infant ? '\u22484' : '\u22485'} cm \u00b7 100-120<small>${esc(RW.cprSub)}</small>`)}
        ${row('breaths', esc(RW.breathsV))}
        ${row('hypo', ap)}
      </table></div>
    </div>
    <div class="cc" style="--cc:var(--ecg);margin-top:12px"><h3>${esc(t('ccVitals'))}</h3><div class="tblwrap"><table class="vt"><thead><tr>${VH.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>
      ${D.VITALS.map(v => `<tr class="${v === vrow ? 'me' : ''}"><td>${esc(v.n)}</td><td>${v.hrA}</td><td>${v.hrS}</td><td>${v.sbp}</td><td>${v.dbp}</td><td>${esc(v.hypo)}</td></tr>`).join('')}
    </tbody></table></div></div>`;
  }
  $('#ccW').addEventListener('input', e => { const v = parseFloat(e.target.value); if (v > 0) { w = v; render(); } });
  $('#ccA').addEventListener('input', e => { const v = parseFloat(e.target.value); if (v >= 0) { age = v; render(); } });
  $('#ccEst').addEventListener('click', () => {
    const est = age < 1 ? (age * 12) / 2 + 4 : age <= 5 ? 2 * age + 8 : Math.min(70, 3 * age + 7);
    w = Math.round(est * 2) / 2; $('#ccW').value = w; render(); toast(t('estimated', w));
  });
  $('#zp').addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (!b) return; const z = D.ZONES.find(x => x.id === b.dataset.z); w = z.mid; $('#ccW').value = w; render(); });
  render();
}

const SCREENS = { home, cases, sim: simScreen, sprint: sprintScreen, random: () => simScreen(surpriseCase()), gen: type => simScreen(genCase(type)), atlas, algo: algoScreen, rush: rushScreen, drill: drillScreen, cpr: cprScreen, recall: recallScreen, card: codeCard, exam: examScreen, live: liveScreen };
go('home');
Sync.init();
/* test hook for automated play-throughs (only with ?debug in the URL) */
if (/[?&]debug/.test(location.search)) window.__pals = { worsen: () => worsen(), get S() { return S; }, get D() { return D; }, doAction, answerQ, endCycle, go, Store, patientSVG, ANS, ENERGIES, CONC, postCtl, FIO2, estWt, roundWt, Monitor, htsMatch };
})();
