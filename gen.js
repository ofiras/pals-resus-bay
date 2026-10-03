/* PALS Resus Bay \u2014 random case generator. Builds engine-compatible cases (same shape as PALS.CASES) from the
   algorithm rules, so every run has a new weight, age, rhythm path and cause. Text comes from the language's `gen` dictionary. */
window.PALS_GEN = (() => {
  const SHOCKABLE = ['vf', 'vt'];
  const isShock = r => SHOCKABLE.includes(r);
  /* Reversible causes for the arrest generator. h = index into PALS.HTS; act = the cart action that treats it (if any).
     pl = indices into the language's `places` (0 ED, 1 ward, 2 PICU, 3 urgent care) that fit the story;
     oh = the arrest happened out of hospital, so CPR is already running on arrival. */
  const CAUSES = {
    hypoxia: { h: 1, act: 'airway', rh: ['asystole', 'pea', 'pea'], ages: [0.2, 1.5], pl: [0, 1, 2] },
    hypovol: { h: 0, act: 'fluid', rh: ['pea', 'asystole'], ages: [0.3, 6], pl: [0, 3] },
    tension: { h: 6, act: 'needle', rh: ['pea'], ages: [1, 15], pl: [2] },
    toxins: { h: 8, act: null, rh: ['vf', 'vt', 'pea'], ages: [1.5, 15], pl: [0, 3] },
    kalemia: { h: 3, act: null, rh: ['vf', 'vt', 'pea'], ages: [4, 16], pl: [0], oh: true },
    hypoglyc: { h: 4, act: 'dextrose', rh: ['pea', 'asystole'], ages: [3, 15], pl: [0], oh: true },
    hypotherm: { h: 5, act: null, rh: ['vf', 'asystole'], ages: [2, 14], pl: [0], oh: true },
    acidosis: { h: 2, act: null, rh: ['pea', 'asystole'], ages: [3, 16], pl: [0, 3] },
    tamponade: { h: 7, act: null, rh: ['pea'], ages: [0.5, 14], pl: [1, 2] },
    thrombPE: { h: 9, act: null, rh: ['pea', 'pea', 'asystole'], ages: [13, 16], pl: [0, 1] },
    thrombMI: { h: 10, act: null, rh: ['vf', 'vt', 'pea'], ages: [2, 8], pl: [0, 1] },
    trauma: { h: 11, act: 'fluid', rh: ['pea', 'asystole'], ages: [4, 15], pl: [0], oh: true }
  };

  function make(type, D, G, R) {
    R = R || Math.random;
    const pick = a => a[Math.floor(R() * a.length)];
    const rint = (a, b) => a + Math.floor(R() * (b - a + 1));
    /* age in years -> {label, wt, kind, years}. kind 'infant' (drawing, ventilation rate) covers 1-23 months; decisions that
       follow the PALS definition of an infant (under 1 year) test y < 1 instead. Rounding never yields "12-month-old" or "24-month-old". */
    function patient(lo, hi, sex) {
      let y = lo + R() * (hi - lo), label, wt, kind;
      if (y < 11.5 / 12) { const m = Math.max(1, Math.round(y * 12)); y = m / 12; label = G.age.m(m, sex); wt = m / 2 + 4; kind = 'infant'; }
      else if (y < 23.5 / 12) { const m = Math.round(y * 12); y = m / 12; label = m === 12 ? G.age.y(1, sex) : G.age.m(m, sex); wt = 2 * y + 8; kind = 'infant'; }
      else { y = Math.round(y); label = G.age.y(y, sex); wt = y <= 5 ? 2 * y + 8 : 3 * y + 7; kind = y >= 11 ? 'teen' : 'child'; }
      wt = wt * (0.9 + R() * 0.2);
      wt = wt < 10 ? Math.round(wt * 2) / 2 : Math.round(wt);
      return { label, wt, kind, y };
    }
    const sbpLow = y => y < 1 / 12 ? 60 : y < 1 ? 70 : y <= 10 ? 70 + 2 * Math.floor(y) : 90;
    const bpStr = (s, gap) => `${s}/${Math.max(20, s - gap)}`;

    if (type === 'tachy') return tachy();
    if (type === 'brady') return brady();
    return arrest();

    /* ---------------- cardiac arrest ---------------- */
    function arrest() {
      const keys = Object.keys(CAUSES), ck = pick(keys), cz = CAUSES[ck], CT = G.causes[ck];
      const pt = patient(cz.ages[0], cz.ages[1], CT.sex);
      const r0 = pick(cz.rh), peaHr = rint(45, 110);
      const findStart = !cz.oh && R() < 0.45;
      const nChecks = 3 + (R() < 0.5 ? 1 : 0);
      const seq = [r0];
      for (let k = 1; k < nChecks; k++) {
        const prev = seq[k - 1];
        if (R() < 0.72) seq.push(prev);
        else if (isShock(prev)) seq.push(pick(['asystole', 'pea', prev === 'vf' ? 'vt' : 'vf']));
        else seq.push(cz.rh.some(isShock) ? pick(cz.rh.filter(isShock)) : (prev === 'pea' ? 'asystole' : 'pea'));
      }
      const causeCyc = Math.min(2, nChecks - 1);
      const rhythmSt = r => r === 'pea' ? { rhythm: 'pea', hr: peaHr } : r === 'vt' ? { rhythm: 'vt', hr: rint(180, 230) } : { rhythm: r, hr: 0 };
      const phases = [];
      const st = { access: false, epi: 0, lastEpiCyc: -9, shocks: 0, anti: 0 };
      const W = G.w;
      if (findStart) {
        phases.push({ k: G.a.checkK, say: G.a.checkSay, need: ['check'], ok: ['resp', 'shout', 'ems'], why: { cpr: W.checkFirst }, msg: G.a.checkMsg, after: { pulse: false }, teach: G.a.checkTeach, t: 12 });
        phases.push({ k: G.a.cprK, say: G.a.cprSay, need: ['cpr'], why: { bvm: W.cprFirst, pads: W.cprFirst, ivio: W.cprFirst }, msg: G.a.cprMsg, teach: G.a.cprTeach(pt.y < 1), t: 8 });
        phases.push({ k: G.a.teamK, say: G.a.teamSay, need: [['o2', 'bvm'], 'pads'], ok: ['ivio'], why: { epi: W.noAccessYet, shock: W.analyzeFirst }, msg: G.a.teamMsg, teach: G.a.teamTeach, t: 14 });
      } else {
        phases.push({ k: G.a.takeK, say: G.a.takeSay, need: [['o2', 'bvm'], 'pads'], ok: ['ivio'], why: { cpr: W.cprRunning, epi: W.noAccessYet, shock: W.analyzeFirst }, msg: G.a.teamMsg, teach: G.a.teamTeach, t: 14 });
      }
      for (let k = 0; k < nChecks; k++) {
        const r = seq[k], changed = k === 0 || r !== seq[k - 1], sh = isShock(r);
        phases.push({ k: G.a.rcK(k + 1), say: k === 0 ? G.a.rcSay0 : G.a.rcSay, set: rhythmSt(r), need: ['rhythm'], why: { shock: W.analyzeFirst, epi: W.analyzeFirst }, msg: changed ? G.a.rcMsg : G.a.still(G.a.rShort[r]), hm: !changed, after: { alarm: true }, t: 10 });
        if (changed) {
          const names = ['vf', 'vt', 'asystole', 'pea'];
          phases.push({ type: 'q', k: G.a.idK, hs: true, say: G.a.idSay[r](peaHr), q: G.a.idQ, opts: names.map(n => n === r ? { t: G.a.rName[n], ok: true } : { t: G.a.rName[n], why: G.a.rWhy[r] }), teach: sh ? G.a.idTeachS : G.a.idTeachN });
        }
        if (sh) {
          st.shocks++;
          phases.push({ k: G.a.shockK(st.shocks), hs: true, say: G.a.shockSay(G.a.rShort[r]), need: ['shock'], why: { epi: W.shockFirst, amio: W.shockFirst, lido: W.shockFirst, sync: W.syncVF, cpr: W.shockNow, check: W.shockNow }, msg: G.a.shockMsg, after: st.shocks > 1 ? { cpr: true } : undefined, teach: G.a.shockTeach[Math.min(st.shocks, 3) - 1], t: 12 });
          if (st.shocks === 1) phases.push({ k: G.a.resumeK, say: G.a.resumeSayS, need: ['cpr'], why: { check: W.noPulseCheck, rhythm: W.noPulseCheck }, msg: G.a.resumeMsg, teach: G.a.resumeTeach, t: 8 });
        } else {
          /* No shock was given here. PEA is an organized rhythm, so confirming the absent pulse is acceptable; asystole has nothing to feel. */
          phases.push({ k: G.a.resumeK, hs: true, say: G.a.resumeSayN, need: ['cpr'], ok: r === 'pea' ? ['check'] : undefined, why: r === 'pea' ? { shock: W.shockNon, atropine: W.atropine } : { shock: W.shockNon, check: W.noCheckAsys, atropine: W.atropine }, msg: G.a.resumeMsg, t: 8 });
        }
        /* the 2-minute cycle */
        const need = [], ok = ['airway', 'o2', 'bvm', 'glucose', 'suction'], why = { atropine: W.atropine }, dose = {};
        const due = st.epi === 0 || k - st.lastEpiCyc >= 2;
        /* "Epinephrine after the 2nd shock" only delays the FIRST dose. Once epinephrine has started (e.g. PEA that turned
           into VF), it stays due every 3-5 min whatever the rhythm. */
        if (due && (!sh || st.shocks >= 2 || st.epi > 0)) { need.push('epi'); st.epi++; st.lastEpiCyc = k; }
        else why.epi = sh && st.shocks < 2 && st.epi === 0 ? W.epiAfter2 : W.epiTooSoon;
        if (sh && st.shocks >= 3 && st.anti === 0) { need.push(['amio', 'lido']); dose.amio = 'amioArrest'; st.anti++; }
        else if (!sh) { why.amio = W.antiNon; why.lido = W.antiNon; }
        else if (st.shocks < 3) { why.amio = W.antiAfter3; why.lido = W.antiAfter3; }
        else { ok.push('amio', 'lido'); dose.amio = 'amioArrest'; }
        /* Access is required in the first cycle (the engine counts it automatically if it was already placed earlier). */
        if (!st.access) { need.unshift('ivio'); st.access = true; } else ok.push('ivio');
        if (!sh) why.shock = W.shockNon;
        let hts;
        if (k === causeCyc) {
          need.push('hts'); if (cz.act) need.push(cz.act);
          hts = { clue: CT.clue, ans: D.HTS[cz.h], fix: CT.fix };
        } else {
          if (cz.act && !ok.includes(cz.act)) ok.push(cz.act);
          ok.push('hts'); /* thinking about H's & T's is right in every cycle; the clue comes in the cause cycle */
        }
        const teach = sh ? G.a.cycTeachS[Math.min(st.shocks, 3) - 1] : G.a.cycTeachN;
        phases.push({ type: 'cycle', k: G.a.cycK(k + 1), say: k === causeCyc ? G.a.cycSayCause : G.a.cycSay, dur: Math.max(8, 8 + 4 * need.length), need, ok, why, dose, hts, teach });
      }
      const rh = rint(110, 160);
      phases.push({ k: G.a.rcK(nChecks + 1), hs: true, say: G.a.roscSay(rh), set: { cpr: false, rhythm: rh > (pt.y < 1 ? 180 : pt.kind === 'teen' ? 100 : 140) ? 'stach' : 'nsr', hr: rh, etco2: 36 }, need: ['check'], why: { cpr: W.organizedPulse, shock: W.organizedNoShock, rhythm: W.organizedPulse }, msg: G.a.roscMsg, after: { pulse: true, alarm: false, bp: bpStr(sbpLow(pt.y) - 6, 32), spo2: 93, skin: 'pale', look: G.a.roscLook }, teach: G.a.roscTeach, t: 10 });
      const posts = G.a.post.slice(), chosen = [];
      while (chosen.length < 1 && posts.length) chosen.push(posts.splice(Math.floor(R() * posts.length), 1)[0]);
      chosen.forEach(pq => phases.push({ type: 'q', k: G.a.postK, say: pq.say, q: pq.q, opts: pq.opts, teach: pq.teach }));
      phases.push({ type: 'end', say: G.a.endSay });
      return {
        id: 'gen-arrest', gen: 'arrest', title: G.title.arrest, group: G.group, algo: 'arrest', age: pt.label, ageY: pt.y, wt: pt.wt, kind: pt.kind, diff: 3,
        place: G.places[pick(cz.pl)] + (findStart ? '' : G.lead),
        brief: (findStart ? G.a.briefFind : G.a.briefCPR)(G.who(pt.label, CT.sex), CT.story),
        init: Object.assign({ monitor: false, pulse: false, rr: 0, cpr: !findStart, skin: 'grey', look: findStart ? G.a.lookFind : G.a.lookCPR }, rhythmSt(r0)),
        phases
      };
    }

    /* ---------------- tachycardia with a pulse ---------------- */
    function tachy() {
      const kind = pick(['svt', 'svt', 'vt', 'stach']), unstable = kind !== 'stach' && R() < 0.5;
      const T = G.t, sex = pick(['m', 'f']);
      const pt = kind === 'vt' ? patient(4, 16, sex) : kind === 'svt' ? (R() < 0.5 ? patient(0.1, 0.9, sex) : patient(2, 14, sex)) : patient(0.5, 6, sex);
      /* PALS rate cut-offs (sinus usually <220 in infants and <180 in children; SVT at or above) use the PALS infant age: under 1 year */
      const inf = pt.y < 1;
      const hr = kind === 'svt' ? (inf ? rint(230, 290) : rint(190, 240)) : kind === 'vt' ? rint(170, 220) : (inf ? rint(180, 205) : rint(150, 175));
      const low = sbpLow(pt.y), rhythm = kind === 'stach' ? 'stach' : kind;
      const sbp = unstable ? low - rint(4, 12) : low + rint(18, 30);
      const init = { monitor: false, rhythm, hr, pulse: true, spo2: unstable ? 92 : 97, rr: inf ? 50 : pt.kind === 'teen' ? 22 : 30, bp: bpStr(sbp, 34), skin: unstable ? 'mottled' : kind === 'stach' ? 'pale' : 'pink', look: kind === 'stach' ? T.lookDry : unstable ? T.lookUnstable : T.lookStable };
      const W = G.w, phases = [];
      phases.push({ k: T.monK, hm: true, say: T.monSay, need: ['pads'], ok: ['o2', 'ivio', 'ecg12'], why: { adenosine: W.lookFirst, sync: W.lookFirst, vagal: W.lookFirst }, msg: T.monMsg[kind](hr), t: 12 });
      const names = ['stach', 'svt', 'vt'];
      phases.push({ type: 'q', k: T.idK, hs: true, say: T.monMsg[kind](hr), q: T.idQ, opts: names.map(n => n === kind ? { t: T.rName[n], ok: true } : { t: T.rName[n], why: T.rWhy[kind] }), teach: T.idTeach });
      if (kind === 'stach') {
        phases.push({ type: 'q', k: T.planK, hs: true, say: T.stachSay, q: T.planQ, opts: T.stachOpts, teach: T.stachTeach });
        phases.push({ k: T.causeK, say: T.causeSay, need: ['ivio', 'fluid'], ok: ['o2', 'glucose'], why: { adenosine: T.noAdeno, sync: '!' + T.noSync }, msg: T.fluidMsg, after: { hr: hr - 30, bp: bpStr(low + 24, 34), skin: 'pink', look: T.lookBetter }, teach: T.fluidTeach, t: 18 });
      } else {
        phases.push({ type: 'q', k: T.perfK, say: unstable ? T.perfSayU(init.bp) : T.perfSayS(init.bp), q: T.perfQ, opts: [{ t: T.perfYes, ok: unstable, why: unstable ? undefined : T.perfWhyS }, { t: T.perfNo, ok: !unstable, why: unstable ? T.perfWhyU : undefined }], teach: T.perfTeach });
        const after = { rhythm: 'nsr', hr: inf ? 150 : 110, bp: bpStr(low + 22, 34), skin: 'pink', look: T.lookBetter, spo2: 98 };
        if (kind === 'svt' && !unstable) {
          phases.push({ k: T.vagalK, hs: true, say: T.vagalSay, need: ['vagal'], ok: ['ivio', 'o2', 'ecg12'], why: { adenosine: T.vagalFirst, sync: T.stableNoShock, shock: '!' + T.pulseSync }, msg: T.vagalMsg, teach: inf ? T.vagalTeachI : T.vagalTeachC, t: 14 });
          phases.push({ k: T.adenoK, say: T.adenoSay, need: ['ivio', 'adenosine'], ok: ['ecg12'], why: { sync: T.stableNoShock, amio: T.adenoFirst, shock: '!' + T.pulseSync }, msg: T.adenoMsg, flash: { rhythm: 'asystole', ms: 1800 }, after, teach: T.adenoTeach, t: 20 });
        } else if (kind === 'svt') {
          phases.push({ k: T.convK, hs: true, say: T.convSayU, need: [['adenosine', 'sync']], ok: ['ivio', 'o2'], why: { vagal: T.noDelay, shock: '!' + T.pulseSync, amio: T.adenoFirst }, msg: T.convMsg, flash: { rhythm: 'asystole', ms: 1400 }, after, teach: T.convTeachU, t: 16 });
        } else if (!unstable) {
          phases.push({ type: 'q', k: T.planK, hs: true, say: T.vtSayS, q: T.planQ, opts: T.vtOptsS, teach: T.vtTeachS });
          phases.push({ k: T.drugK, say: T.drugSay, need: ['ivio', ['amio', 'procain']], ok: ['ecg12', 'o2', 'adenosine'], why: { sync: T.stableNoShock, shock: '!' + T.pulseSync, lido: T.lidoArrest, atropine: T.noAtropine }, msg: T.drugMsg, after, teach: T.drugTeach, t: 20 });
        } else {
          phases.push({ k: T.convK, hs: true, say: T.convSayVT, need: ['sync'], ok: ['ivio', 'o2'], why: { shock: '!' + T.pulseSync, amio: T.convFirst, adenosine: T.convFirst, procain: T.convFirst }, msg: T.convMsg, flash: { rhythm: 'asystole', ms: 900 }, after, teach: T.convTeachVT, t: 14 });
        }
      }
      phases.push({ type: 'end', say: T.endSay[kind] });
      return { id: 'gen-tachy', gen: 'tachy', title: G.title.tachy, group: G.group, algo: 'tachy', age: pt.label, ageY: pt.y, wt: pt.wt, kind: pt.kind, diff: 2, place: G.places[pick(kind === 'svt' ? [0, 3] : [0, 1, 3])], brief: T.brief[kind](G.who(pt.label, sex), sex), init, phases };
    }

    /* ---------------- bradycardia with a pulse ---------------- */
    function brady() {
      const cause = pick(['hypoxia', 'hypoxia', 'block', 'vagal']), B = G.b, sex = pick(['m', 'f']);
      const pt = cause === 'block' ? patient(2, 14, sex) : patient(0.1, 6, sex);
      const rhythm = cause === 'block' ? pick(['avb3', 'avb3', 'mobitz2']) : 'sbrady', hr = rint(42, 55), low = sbpLow(pt.y);
      const init = { monitor: false, rhythm, hr, pulse: true, spo2: cause === 'hypoxia' ? 78 : 93, rr: cause === 'hypoxia' ? 8 : 24, bp: bpStr(low - rint(4, 10), 30), skin: 'mottled', look: cause === 'hypoxia' ? B.lookHypoxia : B.lookShock };
      const W = G.w, phases = [];
      const first = cause === 'hypoxia' ? ['bvm', 'pads'] : ['o2', 'pads'];
      phases.push({ k: B.abcK, say: B.abcSay[cause], need: first, ok: ['position', 'ivio', 'suction', 'o2'].filter(a => !first.includes(a) && !(cause === 'vagal' && a === 'suction')), why: { atropine: B.ventFirst, epi: B.ventFirst, pace: B.ventFirst, cpr: B.notYetCpr, suction: B.stopSuction }, msg: B.abcMsg, after: cause === 'hypoxia' ? { spo2: 92 } : undefined, teach: B.abcTeach, t: 14 });
      const names = ['sbrady', 'avb1', 'mobitz2', 'avb3'];
      phases.push({ type: 'q', k: B.idK, hs: true, say: B.idSay[rhythm](hr), q: B.idQ, opts: names.map(n => n === rhythm ? { t: B.rName[n], ok: true } : { t: B.rName[n], why: B.rWhy[rhythm] }), teach: B.idTeach });
      phases.push({ type: 'q', k: B.nextK, say: B.nextSay(hr), q: B.nextQ, opts: B.nextOpts, teach: B.nextTeach, after: { cpr: true } });
      const need = ['ivio', 'epi'];
      if (cause !== 'hypoxia') need.push('atropine');
      phases.push({ type: 'cycle', k: B.cycK, say: cause === 'hypoxia' ? B.cycSayH : B.cycSayA, dur: 16, need, ok: ['airway', 'bvm', 'glucose'], why: { shock: '!' + B.noShock, sync: '!' + B.noShock, amio: B.noAmio, adenosine: B.noAdeno }, teach: cause === 'hypoxia' ? B.cycTeachH : B.cycTeachA, after: cause === 'block' ? undefined : { cpr: false, rhythm: 'nsr', hr: pt.kind === 'infant' ? 140 : 105, spo2: 96, bp: bpStr(low + 20, 32), skin: 'pale', look: B.lookBetter } });
      /* HR < 60 with poor perfusion persists after the drugs, so compressions continue until pacing captures with a pulse. */
      if (cause === 'block') phases.push({ k: B.paceK, hs: true, say: B.paceSay(hr, rhythm), need: ['pace'], ok: ['ecg12'], why: { atropine: B.paceNow, epi: B.paceNow }, msg: B.paceMsg, after: { cpr: false, rhythm: 'paced', hr: 100, bp: bpStr(low + 18, 32), skin: 'pale', look: B.lookPaced }, teach: B.paceTeach, t: 14 });
      phases.push({ type: 'end', say: B.endSay[cause] });
      return { id: 'gen-brady', gen: 'brady', title: G.title.brady, group: G.group, algo: 'brady', age: pt.label, ageY: pt.y, wt: pt.wt, kind: pt.kind, diff: 2, place: G.places[pick(cause === 'block' ? [0, 1] : [0, 1, 2])], brief: B.brief[cause](G.who(pt.label, sex), sex), init, phases };
    }
  }
  return { make, CAUSES };
})();
