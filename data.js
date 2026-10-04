/* PALS Resus Bay \u2014 content. Source: PALS Provider Handbook (Disque, 2025 guidelines). */
window.PALS = (() => {
  const f = n => {
    if (n >= 100) return String(Math.round(n));
    if (n >= 10) return String(Math.round(n * 10) / 10);
    return String(Math.round(n * 100) / 100);
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const ZONES = [
    { id: 'grey', n: 'Grey', min: 3, max: 5, mid: 4 },
    { id: 'pink', n: 'Pink', min: 6, max: 7, mid: 6.5 },
    { id: 'red', n: 'Red', min: 8, max: 9, mid: 8.5 },
    { id: 'purple', n: 'Purple', min: 10, max: 11, mid: 10.5 },
    { id: 'yellow', n: 'Yellow', min: 12, max: 14, mid: 13 },
    { id: 'white', n: 'White', min: 15, max: 18, mid: 16.5 },
    { id: 'blue', n: 'Blue', min: 19, max: 23, mid: 21 },
    { id: 'orange', n: 'Orange', min: 24, max: 29, mid: 26.5 },
    { id: 'green', n: 'Green', min: 30, max: 36, mid: 33 }
  ];
  const zoneFor = w => ZONES.find(z => w >= z.min - 0.5 && w <= z.max + 0.5) || (w > 36 ? { id: 'adult', n: 'Adult-size', min: 37, max: 999 } : { id: 'grey', n: 'Grey', min: 3, max: 5 });

  /* ---------- crash cart ---------- */
  const ACTIONS = [
    { id: 'cpr', g: 'bed', n: 'Start CPR', s: 'Push hard, push fast' },
    { id: 'bvm', g: 'bed', n: 'Bag-mask ventilation', s: '1 breath every 2\u20133 s' },
    { id: 'check', g: 'bed', n: 'Check pulse & breathing', s: 'No more than 10 s' },
    { id: 'position', g: 'bed', n: 'Open airway', s: 'Head-tilt chin-lift' },
    { id: 'resp', g: 'bed', n: 'Check responsiveness', s: 'Tap & shout' },
    { id: 'shout', g: 'bed', n: 'Shout for help', s: 'Anyone nearby?' },
    { id: 'ems', g: 'bed', n: 'Activate EMS / code', s: 'Call + get AED' },
    { id: 'auscult', g: 'bed', n: 'Examine chest', s: 'Look, listen, feel' },
    { id: 'vagal', g: 'bed', n: 'Vagal maneuver', s: 'Ice to face \u00b7 Valsalva' },
    { id: 'hts', g: 'bed', n: "Hunt H's & T's", s: 'Reversible causes' },
    { id: 'history', g: 'bed', n: 'Ask for the history', s: 'Parent \u00b7 bystander \u00b7 nurse' },
    { id: 'leads', g: 'mon', n: 'Monitor leads + SpO\u2082', s: 'ECG \u00b7 pulse ox \u00b7 BP cuff' },
    { id: 'pads', g: 'mon', n: 'Defibrillator pads', s: 'Monitor + shock \u00b7 AED' },
    { id: 'rhythm', g: 'mon', n: 'Analyze rhythm', s: 'Pause CPR < 10 s' },
    { id: 'shock', g: 'mon', n: 'Defibrillate', s: 'Unsynchronized' },
    { id: 'sync', g: 'mon', n: 'Synchronized cardioversion', s: 'Has a pulse' },
    { id: 'pace', g: 'mon', n: 'Pacing', s: 'Transcutaneous' },
    { id: 'ecg12', g: 'mon', n: '12-lead ECG', s: 'QRS width, P waves' },
    { id: 'epi', g: 'drug', n: 'Epinephrine IV/IO', s: '0.1 mg/mL' },
    { id: 'epiim', g: 'drug', n: 'Epinephrine IM', s: '1 mg/mL \u00b7 thigh' },
    { id: 'atropine', g: 'drug', n: 'Atropine', s: 'IV/IO' },
    { id: 'adenosine', g: 'drug', n: 'Adenosine', s: 'Rapid push + flush' },
    { id: 'amio', g: 'drug', n: 'Amiodarone', s: 'IV/IO' },
    { id: 'lido', g: 'drug', n: 'Lidocaine', s: 'IV/IO' },
    { id: 'procain', g: 'drug', n: 'Procainamide', s: 'IV/IO' },
    { id: 'naloxone', g: 'drug', n: 'Naloxone', s: 'Opioid reversal' },
    { id: 'dextrose', g: 'drug', n: 'Dextrose', s: 'Hypoglycemia' },
    { id: 'mag', g: 'drug', n: 'Magnesium sulfate', s: 'Torsades \u00b7 asthma' },
    { id: 'abx', g: 'drug', n: 'Antibiotics', s: 'Broad-spectrum' },
    { id: 'dexa', g: 'drug', n: 'Dexamethasone', s: 'Corticosteroid' },
    { id: 'antihist', g: 'drug', n: 'Diphenhydramine', s: 'Antihistamine' },
    { id: 'ivio', g: 'line', n: 'IV / IO access', s: 'IO if IV is slow' },
    { id: 'fluid', g: 'line', n: 'Fluid bolus', s: 'Isotonic crystalloid' },
    { id: 'vaso', g: 'line', n: 'Vasoactive infusion', s: 'Epi / norepi drip' },
    { id: 'glucose', g: 'line', n: 'Check glucose', s: 'Point of care' },
    { id: 'labs', g: 'line', n: 'Blood gas & labs', s: 'Gas in ~30 s \u00b7 labs later' },
    { id: 'o2', g: 'air', n: 'Oxygen', s: 'High-flow / blow-by' },
    { id: 'suction', g: 'air', n: 'Suction', s: 'Max 10 s per pass' },
    { id: 'airway', g: 'air', n: 'Advanced airway', s: 'ETT / SGA + capno' },
    { id: 'albuterol', g: 'air', n: 'Albuterol neb', s: 'Bronchodilator' },
    { id: 'nebepi', g: 'air', n: 'Nebulized epinephrine', s: 'Upper airway swelling' },
    { id: 'needle', g: 'air', n: 'Needle decompression', s: 'Tension pneumothorax' }
  ];
  /* Hands-on actions sit at the patient; equipment sits on the crash cart like a real one: the monitor/defibrillator
     on top, then numbered drawers (1 drugs, 2 IV/IO & fluids, 3 airway & breathing). */
  const GROUPS = [
    { id: 'bed', n: 'At the patient', full: 'At the patient: hands-on' },
    { id: 'mon', n: 'Defibrillator', full: 'Monitor / defibrillator (on top of the cart)' },
    { id: 'drug', n: 'Drugs', full: 'Drawer 1 \u00b7 Drugs' },
    { id: 'line', n: 'IV / IO', full: 'Drawer 2 \u00b7 IV / IO, fluids, pump' },
    { id: 'air', n: 'Airway', full: 'Drawer 3 \u00b7 Airway & breathing (O\u2082 and suction on the side)' }
  ];
  const NEEDS_IO = ['epi', 'atropine', 'adenosine', 'amio', 'lido', 'procain', 'fluid', 'abx', 'vaso', 'mag', 'dextrose'];
  const NEEDS_PADS = ['rhythm', 'shock', 'sync', 'pace'];

  const OK_TEXT = {
    resp: 'Responsiveness checked.', shout: 'You shout for help.', ems: 'Emergency response activated.',
    check: 'Pulse and breathing checked.', rhythm: 'Hands off. Rhythm analyzed.', ecg12: '12-lead recorded.', leads: 'ECG leads, pulse oximeter and BP cuff on. The monitor is reading.',
    history: 'History taken.', labs: 'Blood gas and labs sent.',
    auscult: 'Chest examined.', glucose: 'Glucose checked.', hts: 'Reversible causes reviewed.',
    position: 'Airway opened.', suction: 'Airway suctioned.', o2: 'Oxygen on.', bvm: 'Bag-mask ventilation with 100% O2.',
    airway: 'Advanced airway placed, capnography on.', albuterol: 'Albuterol nebulizer running.', nebepi: 'Nebulized epinephrine running.',
    needle: 'Needle decompression done.', cpr: 'Compressions started.', pads: 'Pads and monitor on.',
    ivio: 'Vascular access in.', fluid: 'Fluid bolus running.', shock: 'Shock delivered.', sync: 'Synchronized shock delivered.',
    pace: 'Pacing started.', vagal: 'Vagal maneuver done.', epi: 'Epinephrine in.', epiim: 'IM epinephrine in the thigh.',
    atropine: 'Atropine in.', adenosine: 'Adenosine pushed and flushed.', amio: 'Amiodarone in.', lido: 'Lidocaine in.',
    procain: 'Procainamide running.', naloxone: 'Naloxone given.', dextrose: 'Dextrose given.', abx: 'Antibiotics in.',
    dexa: 'Dexamethasone given.', antihist: 'Diphenhydramine given.', vaso: 'Vasoactive infusion started.', mag: 'Magnesium running.'
  };

  /* Default feedback when an action is not what the moment needs. "!" marks a dangerous choice. */
  const WHY = {
    shock: '!Unsynchronized shocks are only for VF or pulseless VT.',
    sync: '!Synchronized cardioversion is for a tachyarrhythmia WITH a pulse and poor perfusion.',
    adenosine: 'Adenosine is for SVT (narrow, regular, very fast).',
    atropine: 'Atropine is for bradycardia from vagal tone or a primary AV block. Not this moment.',
    amio: 'Amiodarone is for shock-refractory VF/pVT or wide-complex tachycardia with expert input.',
    lido: 'Lidocaine is an alternative to amiodarone for shock-refractory VF/pVT.',
    procain: 'Procainamide is for stable wide-complex or refractory tachycardia, with expert input.',
    pace: 'Pacing is for bradycardia (for example complete heart block) that does not respond to drugs.',
    vagal: 'Vagal maneuvers are for stable SVT.',
    needle: '!Needle decompression is only for a tension pneumothorax.',
    naloxone: 'Naloxone reverses opioids. Nothing here points to opioids.',
    dextrose: 'Check the glucose before treating it.',
    epiim: 'IM epinephrine is the first treatment for anaphylaxis. That is not the problem here.',
    nebepi: 'Nebulized epinephrine is for upper airway swelling such as croup.',
    albuterol: 'Albuterol treats lower airway bronchospasm (wheeze).',
    vaso: 'Vasoactive infusions come after fluids fail, or after ROSC for persistent shock.',
    mag: 'Magnesium is for torsades de pointes or refractory asthma.',
    abx: 'Antibiotics are for suspected infection or sepsis.',
    dexa: 'Steroids are for croup and asthma, and only an adjunct in anaphylaxis.',
    antihist: 'Antihistamines are only an adjunct in allergic reactions.',
    hts: "Good habit, but not the step in front of you right now. Look for reversible causes once the immediate priorities are done, or when treatment is not working.",
    glucose: 'Checking glucose matters in a sick child, but it is not the priority this second.',
    ecg12: 'A 12-lead is useful, but it is not the priority right now.',
    leads: 'In cardiac arrest put on defibrillator pads: they show the rhythm and let you shock.'
  };
  const GENERIC_WHY = 'Not the priority right now. Ask yourself what the algorithm calls for at this exact step.';

  /* ---------- weight-based dose pickers ---------- */
  const DOSE = {
    epi: w => {
      const mg = Math.min(0.01 * w, 1);
      return { title: 'Epinephrine IV/IO', rule: '0.01 mg/kg \u00b7 0.1 mg/mL \u00b7 max 1 mg', rec: `Epinephrine ${f(mg)} mg IV/IO`, opts: [
        { t: `${f(mg)} mg (${f(mg * 10)} mL of 0.1 mg/mL)`, ok: true },
        { t: `${f(0.1 * w)} mg (${f(w)} mL of 0.1 mg/mL)`, why: '10\u00d7 overdose. 0.1 mg/kg is the endotracheal dose, never IV.' },
        { t: `${+(0.001 * w).toFixed(3)} mg (${f(0.01 * w)} mL of 0.1 mg/mL)`, why: '10\u00d7 too low. IV/IO epinephrine is 0.01 mg/kg.' },
        { t: `${f(Math.min(0.05 * w, 5))} mg (${f(Math.min(0.5 * w, 50))} mL of 0.1 mg/mL)`, why: '5\u00d7 overdose. IV/IO epinephrine is 0.01 mg/kg, capped at 1 mg.' }
      ] };
    },
    epiim: w => {
      const mg = Math.min(0.01 * w, 0.5);
      return { title: 'Epinephrine IM', rule: '0.01 mg/kg of 1 mg/mL \u00b7 lateral thigh', rec: `Epinephrine ${f(mg)} mg IM`, opts: [
        { t: `${f(mg)} mg IM, ${f(mg)} mL of 1 mg/mL`, ok: true },
        { t: `${f(mg)} mg IV push, ${f(mg)} mL of 1 mg/mL`, why: 'An IV bolus in a child with a pulse risks dangerous arrhythmias. Anaphylaxis gets IM first.' },
        { t: `${f(0.1 * w)} mg IM, ${f(0.1 * w)} mL of 1 mg/mL`, why: '10\u00d7 overdose. IM epinephrine is 0.01 mg/kg (max 0.5 mg).' },
        { t: `${+(mg / 10).toFixed(3)} mg IM, ${+(mg / 10).toFixed(3)} mL of 1 mg/mL`, why: '10\u00d7 too low. IM epinephrine is 0.01 mg/kg (max 0.5 mg).' }
      ] };
    },
    atropine: w => {
      const mg = clamp(0.02 * w, 0.1, 0.5);
      return { title: 'Atropine IV/IO', rule: '0.02 mg/kg \u00b7 min 0.1 mg \u00b7 max single dose 0.5 mg', rec: `Atropine ${f(mg)} mg IV/IO`, opts: [
        { t: `${f(mg)} mg`, ok: true },
        { t: `${f(clamp(0.002 * w, 0.01, 0.05))} mg`, why: 'Doses under 0.1 mg can cause paradoxical bradycardia.' },
        { t: `${f(0.01 * w)} mg`, why: 'That is the epinephrine mg/kg. Atropine is 0.02 mg/kg.' },
        { t: '2 mg', why: 'Above the 0.5 mg maximum single dose.' }
      ].filter((o, i, a) => a.findIndex(x => x.t === o.t) === i) };
    },
    adeno1: w => {
      const mg = Math.min(0.1 * w, 6);
      return { title: 'Adenosine, first dose', rule: '0.1 mg/kg rapid push + flush \u00b7 max 6 mg', rec: `Adenosine ${f(mg)} mg rapid IV`, opts: [
        { t: `${f(mg)} mg rapid push + flush`, ok: true },
        { t: `${f(mg)} mg slow push over 2 min`, why: 'Adenosine lasts seconds. It must be a rapid push with an immediate flush.' },
        { t: `${f(Math.min(0.2 * w, 12))} mg rapid push + flush`, why: '0.2 mg/kg is the second dose.' },
        { t: `${f(0.01 * w)} mg rapid push + flush`, why: '10\u00d7 too low. First dose is 0.1 mg/kg.' }
      ] };
    },
    adeno2: w => {
      const mg = Math.min(0.2 * w, 12);
      return { title: 'Adenosine, second dose', rule: '0.2 mg/kg rapid push + flush \u00b7 max 12 mg', rec: `Adenosine ${f(mg)} mg rapid IV`, opts: [
        { t: `${f(mg)} mg rapid push + flush`, ok: true },
        { t: `${f(Math.min(0.1 * w, 6))} mg rapid push + flush`, why: 'That repeats the first dose. The second dose doubles to 0.2 mg/kg (max 12 mg).' },
        { t: `${f(Math.min(0.4 * w, 24))} mg rapid push + flush`, why: 'Too much: the second dose is 0.2 mg/kg, max 12 mg.' },
        { t: `${f(0.02 * w)} mg rapid push + flush`, why: '10\u00d7 too low. The second dose is 0.2 mg/kg.' }
      ].filter((o, i, a) => a.findIndex(x => x.t === o.t) === i) };
    },
    amio: w => {
      const mg = Math.min(5 * w, 300);
      return { title: 'Amiodarone (patient has a pulse)', rule: '5 mg/kg over 20\u201360 min \u00b7 max 300 mg', rec: `Amiodarone ${f(mg)} mg over 20\u201360 min`, opts: [
        { t: `${f(mg)} mg IV over 20\u201360 min`, ok: true },
        { t: `${f(mg)} mg rapid IV push`, why: 'With a pulse, a rapid push causes hypotension. Infuse over 20\u201360 minutes.' },
        { t: `${f(15 * w)} mg IV over 20\u201360 min`, why: '15 mg/kg is the procainamide dose.' },
        { t: `${f(0.5 * w)} mg IV over 20\u201360 min`, why: '10\u00d7 too low. Amiodarone is 5 mg/kg.' }
      ] };
    },
    amioArrest: w => {
      const mg = Math.min(5 * w, 300);
      return { title: 'Amiodarone (cardiac arrest)', rule: '5 mg/kg bolus \u00b7 may repeat to 3 doses', rec: `Amiodarone ${f(mg)} mg IV/IO bolus`, opts: [
        { t: `${f(mg)} mg IV/IO bolus`, ok: true },
        { t: `${f(2.5 * w)} mg IV/IO bolus`, why: 'Half the dose. Amiodarone in arrest is 5 mg/kg (max 300 mg).' },
        { t: `${f(15 * w)} mg IV/IO bolus`, why: '15 mg/kg is procainamide, and not an arrest drug.' },
        { t: `${f(w)} mg IV/IO bolus`, why: '1 mg/kg is the lidocaine dose.' }
      ].filter((o, i, a) => a.findIndex(x => x.t === o.t) === i) };
    },
    lido: w => {
      const mg = Math.min(w, 100);
      return { title: 'Lidocaine IV/IO', rule: '1 mg/kg \u00b7 max 100 mg', rec: `Lidocaine ${f(mg)} mg IV/IO`, opts: [
        { t: `${f(mg)} mg IV/IO`, ok: true },
        { t: `${f(5 * w)} mg IV/IO`, why: '5 mg/kg is the amiodarone dose.' },
        { t: `${f(0.1 * w)} mg IV/IO`, why: '10\u00d7 too low.' }
      ] };
    },
    procain: w => {
      const mg = 15 * w;
      return { title: 'Procainamide', rule: '15 mg/kg over 30\u201360 min \u00b7 not with amiodarone', rec: `Procainamide ${f(mg)} mg over 30\u201360 min`, opts: [
        { t: `${f(mg)} mg over 30\u201360 min`, ok: true },
        { t: `${f(mg)} mg + amiodarone ${f(5 * w)} mg together`, why: 'Do not routinely give amiodarone and procainamide together.' },
        { t: `${f(5 * w)} mg over 30\u201360 min`, why: '5 mg/kg is the amiodarone dose.' },
        { t: `${f(mg)} mg rapid push`, why: 'Procainamide is infused over 30\u201360 minutes.' }
      ] };
    },
    naloxone: w => {
      const mg = w <= 20 ? 0.1 * w : 2;
      return { title: 'Naloxone', rule: '0.1 mg/kg if <5 y or \u226420 kg \u00b7 otherwise 2 mg \u00b7 max 2 mg', rec: `Naloxone ${f(mg)} mg`, opts: [
        { t: `${f(mg)} mg IV/IO/IM/IN`, ok: true },
        { t: `${f(mg / 10)} mg IV/IO/IM/IN`, why: '10\u00d7 too low for full reversal in an overdose. Low 1\u20135 mcg/kg doses are for therapeutic opioid side effects.' },
        { t: `${f(mg * 10)} mg IV/IO/IM/IN`, why: 'Too high: the maximum single dose is 2 mg.' }
      ] };
    },
    dextrose: w => ({ title: 'Dextrose', rule: '0.5\u20131 g/kg \u00b7 D10W 5\u201310 mL/kg (D25W 2\u20134 mL/kg)', rec: `D10W ${f(5 * w)}\u2013${f(10 * w)} mL`, opts: [
      { t: `D10W ${f(5 * w)}\u2013${f(10 * w)} mL`, ok: true },
      { t: `D50W ${f(5 * w)} mL push`, why: '5\u00d7 overdose: that is the D10W volume drawn up as D50W (2.5 g/kg). D50W is only for adolescents, at 1\u20132 mL/kg. Use D10W 5\u201310 mL/kg (or D25W 2\u20134 mL/kg).' },
      { t: `D10W ${f(w)}\u2013${f(2 * w)} mL`, why: 'Too little: 0.1\u20130.2 g/kg. Aim for 0.5\u20131 g/kg (D10W 5\u201310 mL/kg).' },
      { t: `D10W ${f(20 * w)}\u2013${f(30 * w)} mL`, why: 'Far too much: 2\u20133 g/kg. Aim for 0.5\u20131 g/kg (D10W 5\u201310 mL/kg).' }
    ] }),
    fluid: w => ({ title: 'Fluid bolus', rule: '20 mL/kg isotonic crystalloid over 5\u201310 min', rec: `NS/LR ${f(20 * w)} mL bolus`, opts: [
      { t: `${f(20 * w)} mL NS/LR over 5\u201310 min`, ok: true },
      { t: `${f(5 * w)} mL NS/LR over 20 min`, why: 'A small, slow 5\u201310 mL/kg bolus is for cardiogenic shock.' },
      { t: `${f(60 * w)} mL NS/LR over 5\u201310 min`, why: 'Give 20 mL/kg, then reassess before repeating.' },
      { t: `${f(20 * w)} mL D5W over 5\u201310 min`, why: 'Use isotonic crystalloid (normal saline or Lactated Ringer\u2019s) for volume.' }
    ] }),
    fluidCard: w => ({ title: 'Fluid bolus (cardiogenic shock)', rule: '5\u201310 mL/kg over 10\u201320 min, then reassess', rec: `NS/LR ${f(5 * w)}\u2013${f(10 * w)} mL over 10\u201320 min`, opts: [
      { t: `${f(5 * w)}\u2013${f(10 * w)} mL NS/LR over 10\u201320 min`, ok: true },
      { t: `${f(20 * w)} mL NS/LR over 5\u201310 min`, why: 'The standard fast 20 mL/kg can flood a failing heart. Cardiogenic shock gets 5\u201310 mL/kg slowly.' },
      { t: `${f(40 * w)} mL NS/LR over 10\u201320 min`, why: 'Dangerous in cardiogenic shock: pulmonary edema. Give 5\u201310 mL/kg and reassess.' },
      { t: `${f(5 * w)}\u2013${f(10 * w)} mL D5W over 10\u201320 min`, why: 'Use isotonic crystalloid (NS or LR) for volume.' }
    ] }),
    mag: w => ({ title: 'Magnesium sulfate', rule: '20\u201350 mg/kg over 10\u201320 min \u00b7 max 2 g', rec: `Magnesium ${f(20 * w)}\u2013${f(Math.min(50 * w, 2000))} mg`, opts: [
      { t: `${f(20 * w)}\u2013${f(Math.min(50 * w, 2000))} mg over 10\u201320 min`, ok: true },
      { t: `${f(2 * w)} mg over 10\u201320 min`, why: '10\u00d7 too low.' },
      { t: `${f(Math.min(100 * w, 4000))} mg over 10\u201320 min`, why: 'Twice the dose: magnesium is 20\u201350 mg/kg, max 2 g.' }
    ] }),
    shock1: w => ({ title: 'Defibrillation, 1st shock', rule: '2 J/kg', rec: `Shock ${f(2 * w)} J`, opts: [
      { t: `${f(2 * w)} J`, ok: true },
      { t: `${f(4 * w)} J`, why: '4 J/kg is the second shock.' },
      { t: `${f(0.5 * w)}\u2013${f(w)} J`, why: '0.5\u20131 J/kg is synchronized cardioversion energy.' },
      { t: `${f(10 * w)} J`, why: '10 J/kg is the ceiling, not the start.' }
    ] }),
    shock2: w => ({ title: 'Defibrillation, 2nd shock', rule: '4 J/kg', rec: `Shock ${f(4 * w)} J`, opts: [
      { t: `${f(4 * w)} J`, ok: true },
      { t: `${f(2 * w)} J`, why: 'Escalate: the second shock is 4 J/kg.' },
      { t: `${f(10 * w)} J`, why: 'Second shock is 4 J/kg. Later shocks may go up to 10 J/kg.' },
      { t: `${f(w)} J`, why: 'Too low. Second shock is 4 J/kg.' }
    ] }),
    shock3: w => ({ title: 'Defibrillation, later shocks', rule: '\u22654 J/kg \u00b7 max 10 J/kg or adult dose', rec: `Shock ${f(4 * w)} J`, opts: [
      { t: `${f(4 * w)} J`, ok: true },
      { t: `${f(2 * w)} J`, why: 'Do not de-escalate. Subsequent shocks are \u22654 J/kg.' },
      { t: `${f(15 * w)} J`, why: 'Above the maximum of 10 J/kg (or the adult dose).' },
      { t: `${f(w)} J`, why: 'Too low. Subsequent shocks are \u22654 J/kg.' }
    ] }),
    sync1: w => ({ title: 'Synchronized cardioversion, 1st', rule: '0.5\u20131 J/kg', rec: `Sync ${f(0.5 * w)}\u2013${f(w)} J`, opts: [
      { t: `${f(0.5 * w)}\u2013${f(w)} J, SYNC on`, ok: true },
      { t: `${f(0.5 * w)}\u2013${f(w)} J, SYNC off`, why: 'There is a pulse. An unsynchronized shock can land on the T wave and cause VF.' },
      { t: `${f(2 * w)}\u2013${f(4 * w)} J, SYNC on`, why: 'Far too much. Start at 0.5\u20131 J/kg.' },
      { t: `${f(0.1 * w)}\u2013${f(0.2 * w)} J, SYNC on`, why: 'Too low. Start at 0.5\u20131 J/kg.' }
    ] }),
    sync2: w => ({ title: 'Synchronized cardioversion, escalate', rule: '2 J/kg', rec: `Sync ${f(2 * w)} J`, opts: [
      { t: `${f(2 * w)} J, SYNC on`, ok: true },
      { t: `${f(0.5 * w)} J, SYNC on`, why: 'If the first attempt fails, increase to 2 J/kg.' },
      { t: `${f(4 * w)} J, SYNC on`, why: '4 J/kg is defibrillation escalation. Cardioversion goes to 2 J/kg.' },
      { t: `${f(2 * w)} J, SYNC off`, why: 'Still has a pulse: keep SYNC on.' }
    ] })
  };

  const HTS = ['Hypovolemia', 'Hypoxia', 'Hydrogen ion (acidosis)', 'Hypo/hyperkalemia', 'Hypoglycemia', 'Hypothermia', 'Tension pneumothorax', 'Tamponade (cardiac)', 'Toxins', 'Thrombosis (pulmonary)', 'Thrombosis (coronary)', 'Trauma'];

  /* ---------- cases ---------- */
  const CASES = [
    {
      id: 'pool', title: 'Backyard Pool', group: 'Real-life BLS', algo: 'bls', age: '4-year-old', wt: 16, kind: 'child', diff: 1, aed: true, field: true,
      place: 'Family barbecue \u00b7 you are a bystander',
      brief: 'You pull a 4-year-old out of the pool. Nobody else is outside, and your phone is charging in the house. There is an AED at the clubhouse next door.',
      init: { monitor: false, rhythm: 'vf', hr: 0, pulse: false, rr: 0, skin: 'cyan', look: 'Limp, wet, lips blue' },
      phases: [
        { k: 'Responsiveness', say: 'The child is limp on the pool deck. The scene is safe.', need: ['resp'], why: { check: 'Tap and shout first. If the child responds, the plan changes.', cpr: 'Confirm unresponsiveness first. Tap and shout takes two seconds.' }, msg: 'No response.', teach: 'Tap the shoulder and shout. For an infant, tap the sole of the foot.', t: 12 },
        { k: 'Call out', say: 'No response.', need: ['shout'], why: { ems: 'Your phone is inside. Shout first: someone may come and fetch help while you stay.', check: 'Shout for help first, then check breathing and pulse.' }, msg: 'Silence. Nobody comes.', teach: 'Shout for help at once. If someone comes, send them to call EMS and get the AED.', t: 10 },
        { k: 'Breathing + pulse', say: 'Still alone.', need: ['check'], why: { cpr: 'Check breathing and pulse first, for no more than 10 seconds.' }, msg: 'One gasp every few seconds. No pulse you are sure of.', teach: 'Look for breathing and feel the carotid or femoral pulse at the same time, for no more than 10 seconds.', t: 12 },
        { type: 'q', k: 'Gasping', say: 'Occasional gasps. No definite pulse.', q: 'What do you do?', opts: [
          { t: 'Start CPR at 30:2; call EMS after 2 minutes', ok: true },
          { t: 'Start CPR at 15:2; call EMS after 2 minutes', why: '15:2 is for two rescuers. A lone rescuer uses 30:2 at any age.' },
          { t: 'Leave to call EMS first, then start CPR at 30:2', why: 'Alone with an unwitnessed arrest, give 2 minutes of CPR before leaving: children usually arrest from hypoxia. With a phone at hand, call on speaker while you start.' },
          { t: 'Recovery position, call EMS, recheck breathing', why: 'Gasping (agonal breathing) is not effective breathing. Gasping with no definite pulse is cardiac arrest: start CPR.' }
        ], teach: 'Gasping is not breathing. Alone with an unwitnessed arrest: 30:2 for 2 minutes, then call.', after: { cpr: true } },
        { type: 'cycle', k: '2 min of CPR', say: 'About 5 cycles of 30:2. Push hard (1/3 of the chest, about 5 cm), push fast (100\u2013120/min), let the chest recoil fully.', dur: 9, need: [], teach: 'High-quality CPR: 100\u2013120/min, 1/3 chest depth, full recoil, minimal pauses, no over-ventilation. Drowning is a hypoxic arrest: give breaths in every cycle, never compression-only CPR.' },
        { pauseOk: true, k: 'Get help', say: 'Two minutes done. Still nobody around.', set: { cpr: false }, need: ['ems'], why: { cpr: 'You have done 2 minutes. Now leave briefly: call EMS and grab the AED, then come straight back.', shout: 'You tried that. Now go and call EMS yourself, and get the AED.' }, msg: 'The dispatcher is on speaker. You sprint back with the AED.', teach: 'Lone rescuer, unwitnessed: 2 min of CPR, then call EMS and get the AED, then resume CPR.', t: 12 },
        { pauseOk: true, k: 'AED on', say: 'You are back with the AED.', need: ['pads'], ok: ['cpr'], why: { shock: 'Pads on first, then let the AED analyze.' }, msg: 'AED switched on. Pads on the chest.', teach: 'Turn the AED on first, then expose and dry the chest, then attach the pads.', t: 14 },
        { pauseOk: true, type: 'q', k: 'Pad placement', say: 'The kit has pediatric pads.', q: 'Where do the pads go on this 4-year-old?', opts: [
          { t: 'Upper right chest and lower left side; front-back if they would touch', ok: true },
          { t: 'Upper right chest and lower left side, overlapping if the chest is small', why: 'Pads must never touch or overlap: the current arcs between them instead of crossing the heart. On a small chest, go front and back.' },
          { t: 'Both pads side by side across the front, centered on the sternum', why: 'Side-by-side pads miss most of the heart and may touch. Use upper right chest + lower left side, or front + back.' }
        ], teach: 'Pads must never touch. Small chest: one on the front, one on the back.' },
        { k: 'Analyze', say: 'AED: "Analyzing heart rhythm. Do not touch the patient."', set: { monitor: true }, need: ['rhythm'], why: { cpr: 'Hands off while the AED analyzes.', shock: 'Let the AED analyze first. It will tell you if a shock is advised.' }, msg: 'AED: "Shock advised. Charging."', t: 10 },
        { k: 'Shock', say: 'AED: "Shock advised. Stand clear."', set: { alarm: true }, need: ['shock'], why: { cpr: 'Shock first, then CPR immediately.', check: "!Don't delay the shock to feel for a pulse." }, msg: 'Shock delivered.', teach: 'Make sure nobody is touching the child, then press shock.', t: 10 },
        { k: 'Resume CPR', say: 'The AED says: "Shock delivered."', need: ['cpr'], why: { check: 'Resume CPR at once. No pulse check now: the AED re-analyzes in 2 minutes.', rhythm: 'Resume CPR at once. The AED re-analyzes in 2 minutes.', shock: 'One shock, then CPR at once. The AED re-analyzes in 2 minutes.' }, msg: 'Compressions restarted within seconds.', teach: 'After a shock: CPR immediately for 2 minutes. The rhythm check comes later.', t: 8 },
        { type: 'cycle', k: 'CPR until EMS', say: 'Sirens are getting closer. Keep going until EMS takes over.', dur: 8, need: [] },
        { type: 'end', set: { cpr: false, rhythm: 'nsr', hr: 118, pulse: true, spo2: 91, rr: 14, skin: 'pale', alarm: false, look: 'Coughing, moving' }, say: 'EMS takes over. After the next analysis the child coughs and moves: return of spontaneous circulation.' }
      ]
    },
    {
      id: 'choke', title: 'Restaurant Choking', group: 'Real-life BLS', algo: 'bls', age: '7-month-old', wt: 8, kind: 'infant', diff: 1, field: true,
      place: 'Restaurant \u00b7 you are the nearest adult',
      brief: 'A 7-month-old in a high chair is coughing on a piece of food. A few seconds later the coughing goes silent.',
      init: { monitor: false, rhythm: 'stach', hr: 170, pulse: true, rr: 0, skin: 'cyan', look: 'Silent, panicked, lips turning blue' },
      phases: [
        { type: 'q', k: 'Recognize', say: 'Mouth open. No cry, no sound, no effective cough.', q: 'How severe is this?', opts: [
          { t: 'Severe obstruction: start back slaps and chest thrusts', ok: true },
          { t: 'Mild obstruction: stay close and let the baby cough', why: 'A silent infant who cannot cry or cough has a severe obstruction. Coughing only helps when it is forceful and noisy.' }
        ], teach: 'Can cry or cough forcefully: mild, watch closely. Silent, no cry, no cough: severe.' },
        { type: 'q', k: 'Relieve', say: 'You lift the baby out of the high chair.', q: 'Which technique?', opts: [
          { t: 'Head down: 5 back slaps, then 5 chest thrusts', ok: true },
          { t: 'Head down: 5 back slaps, then 5 abdominal thrusts', why: 'No abdominal thrusts under 1 year: risk of liver injury. Infants get back slaps and chest thrusts.' },
          { t: 'Sitting up: 5 back slaps, then a blind finger sweep', why: 'Blind sweeps can push the object deeper; remove it only if you see it. Keep the head lower than the chest.' },
          { t: 'Sitting up: 5 back slaps, then 5 chest thrusts', why: 'Right maneuvers, wrong position. Keep the head lower than the chest, supported on your forearm, so gravity helps.' }
        ], teach: 'Infant under 1 year: head lower than chest, 5 back slaps between the shoulder blades, then 5 chest thrusts on the lower half of the sternum.' },
        { type: 'q', k: 'Goes limp', say: 'After several rounds the baby goes limp and stops responding.', set: { skin: 'grey', look: 'Limp, unresponsive', hr: 60 }, q: 'Now what?', opts: [
          { t: 'Start CPR; look in the mouth before each set of breaths', ok: true },
          { t: 'Keep back slaps and chest thrusts until the object is out', why: 'Once the infant is unresponsive, switch to CPR. Compressions generate more pressure and may expel the object.' },
          { t: 'Start CPR; do a finger sweep before each set of breaths', why: 'Blind sweeps can push the object deeper. Look in the mouth and remove it only if you see it.' }
        ], teach: 'Unresponsive choking infant: CPR. Before each set of breaths, look in the mouth and remove the object only if you see it.', after: { cpr: true } },
        { type: 'q', k: 'Ratio', say: 'A waiter is on the phone with EMS. You are the only one doing CPR.', q: 'Technique and ratio as a single rescuer?', opts: [
          { t: '2-thumb encircling hands, 30:2, about 4 cm deep', ok: true },
          { t: '2-thumb encircling hands, 15:2, about 4 cm deep', why: '15:2 is for two rescuers. A lone rescuer uses 30:2 at any age.' },
          { t: '2-thumb encircling hands, 30:2, about 2 cm deep', why: 'Too shallow. Compress at least one third of the chest depth: about 4 cm in an infant.' }
        ], teach: 'Infant (2025): two-thumb encircling hands for one or two rescuers; the heel of one hand if you cannot encircle the chest. The 2-finger technique is no longer recommended. Depth about 4 cm (1/3 of the chest), 100\u2013120/min. One rescuer 30:2.' },
        { type: 'end', set: { cpr: false, hr: 150, pulse: true, rr: 30, skin: 'pale', look: 'Crying!' }, say: 'On the third look you see the piece of food and flick it out. The baby gasps, then cries. EMS takes over.' }
      ]
    },
    {
      id: 'party', title: 'Birthday Party', group: 'Real-life BLS', algo: 'bls', age: '5-year-old', wt: 18, kind: 'child', diff: 1, field: true,
      place: 'Birthday party \u00b7 you are a guest',
      brief: 'At a birthday party a 5-year-old is eating grapes while running around. Suddenly he stops, grabs his throat and looks at you in panic.',
      init: { monitor: false, rhythm: 'stach', hr: 150, pulse: true, rr: 0, skin: 'cyan', look: 'Hands at his throat \u00b7 silent \u00b7 lips turning blue' },
      phases: [
        { type: 'q', k: 'Recognize', say: 'He grabs his throat. He cannot speak, cough or cry.', q: 'What is happening?', opts: [
          { t: 'Severe airway obstruction: give abdominal thrusts', ok: true },
          { t: 'Mild airway obstruction: encourage him to cough', why: 'He cannot speak, cough or make a sound: that is a severe obstruction. Coughing only helps when it is forceful and noisy.' },
          { t: 'Anaphylaxis: use his epinephrine auto-injector', why: 'Sudden silence while eating, with no hives or swelling, is choking. Relieve the obstruction first.' }
        ], teach: 'The universal choking sign: hands at the throat. Unable to speak, cough or breathe means a severe obstruction.' },
        { type: 'q', k: 'Technique', say: 'You kneel behind him and wrap your arms around his waist.', q: 'Where and how do you push?', opts: [
          { t: 'Fist above the navel, below the breastbone; quick inward-upward thrusts', ok: true },
          { t: 'Fist on the lower breastbone; slow, steady inward squeezes', why: 'That is the chest-thrust position, used for infants and for pregnant or very obese patients. In a child, the fist goes above the navel and below the breastbone, with quick inward-upward thrusts.' },
          { t: 'Fist above the navel, below the breastbone; one thrust, then look in the mouth', why: 'Keep giving thrusts until the object comes out or he becomes unresponsive. Do not stop to look between thrusts.' }
        ], teach: 'Child over 1 year: abdominal thrusts (Heimlich), repeated until the object is expelled or the child becomes unresponsive.' },
        { k: 'Goes limp', say: 'After several thrusts he goes limp. You lower him to the floor. Other parents are close by.', set: { hr: 50, skin: 'grey', look: 'Limp \u00b7 unresponsive \u00b7 not breathing' }, need: [['shout', 'ems']], why: { cpr: 'Shout first: one sentence gets a parent calling EMS while you start CPR.', check: 'Get help moving first, then start CPR.' }, msg: 'A parent is calling EMS on speaker.', teach: 'Unresponsive choking child: shout for help and have someone call EMS, then start CPR.', t: 10 },
        { k: 'CPR', say: 'He is unresponsive and not breathing.', need: ['cpr'], why: { check: 'An unresponsive choking child needs CPR at once: compressions may push the object out.', resp: 'He is already unresponsive. Start CPR.' }, msg: 'Compressions started, 30:2.', after: { cpr: true }, teach: 'Unresponsive choking child: start CPR right away. Compressions raise the pressure in the chest and may expel the object.', t: 10 },
        { type: 'q', k: 'Breaths', say: 'After 30 compressions you open his mouth to give breaths.', q: 'What do you do before each set of breaths?', opts: [
          { t: 'Look in the mouth; remove the object only if you see it', ok: true },
          { t: 'Sweep a finger blindly through the back of the throat', why: 'Blind finger sweeps can push the object deeper. Remove it only if you can see it.' },
          { t: 'Skip the breaths: compressions only until EMS arrives', why: 'A choking arrest is a hypoxic arrest. Keep giving breaths after each look in the mouth.' }
        ], teach: 'Choking CPR: before each set of breaths, open the mouth and look. Remove the object only if you see it. Then 2 breaths and continue 30:2.' },
        { type: 'end', set: { cpr: false, hr: 130, pulse: true, rr: 26, skin: 'pale', look: 'Coughing \u00b7 crying' }, say: 'On the second look you see the grape and flick it out. He coughs, gasps and starts to cry. EMS takes over.' }
      ]
    },
    {
      id: 'court', title: 'Collapse on the Court', group: 'Real-life BLS', algo: 'bls', age: '13-year-old', wt: 45, kind: 'teen', diff: 2, aed: true, field: true,
      place: 'School gym \u00b7 you are a parent in the stands',
      brief: 'During a basketball game a 13-year-old suddenly collapses on the court. Nobody touched him. There is an AED in the gym lobby.',
      init: { monitor: false, rhythm: 'vf', hr: 0, pulse: false, rr: 0, skin: 'grey', look: 'Collapsed on the court \u00b7 gasping' },
      phases: [
        { k: 'Responsiveness', say: 'He collapsed mid-run. You reach him first. The scene is safe.', need: ['resp'], why: { cpr: 'Confirm unresponsiveness first: tap and shout takes two seconds.' }, msg: 'No response.', teach: 'Tap the shoulder and shout.', t: 10 },
        { k: 'Activate', say: 'No response. Teammates crowd around.', need: [['shout', 'ems']], why: { check: 'Get help moving first: point at one person to call EMS and another to fetch the AED.' }, msg: 'The coach calls EMS on speaker. A teammate sprints for the AED.', teach: 'A witnessed sudden collapse is probably cardiac: call EMS and get the AED at once.', t: 10 },
        { k: 'Breathing + pulse', say: 'Help is on the way.', need: ['check'], why: { cpr: 'Check breathing and pulse first, for no more than 10 seconds.' }, msg: 'An occasional gasp. No pulse.', teach: 'Check breathing and the carotid pulse together, for no more than 10 seconds.', t: 12 },
        { type: 'q', k: 'Gasping', say: 'An occasional gasp. No pulse.', q: 'What now?', opts: [
          { t: 'Start CPR now: gasping without a pulse is cardiac arrest', ok: true },
          { t: 'Recovery position: he is still breathing on his own', why: 'Gasping (agonal breathing) is not breathing. Gasping with no pulse is cardiac arrest: start CPR.' },
          { t: 'Wait for the AED, then analyze before compressing', why: 'Never wait for the AED. Start compressions now and attach it as soon as it arrives.' }
        ], teach: 'Gasping is a sign of cardiac arrest, not of breathing.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR', say: 'Compressions running, 30:2. Push hard, push fast, let the chest recoil.', dur: 8, need: [], teach: 'Adolescent: at least 5 cm deep, 100\u2013120/min, full recoil, minimal pauses.' },
        { pauseOk: true, k: 'AED arrives', say: 'The teammate is back with the AED.', need: ['pads'], ok: ['cpr'], why: { shock: 'Pads on first, then let the AED analyze.' }, msg: 'AED on. Adult pads on the chest while compressions continue.', teach: 'Adolescents get adult pads and the adult energy. Keep compressing while the pads go on.', t: 12 },
        { k: 'Analyze', say: 'AED: "Analyzing heart rhythm. Do not touch the patient."', set: { monitor: true }, need: ['rhythm'], why: { cpr: 'Hands off while the AED analyzes.', shock: 'Let the AED analyze first. It will tell you if a shock is advised.' }, msg: 'AED: "Shock advised. Charging."', t: 10 },
        { k: 'Shock', say: 'AED: "Stand clear. Press the flashing button."', set: { alarm: true }, need: ['shock'], why: { cpr: 'Shock first, then CPR immediately.', check: "!Don't delay the shock to feel for a pulse." }, msg: 'Shock delivered.', teach: 'Make sure nobody is touching him, then press shock.', t: 10 },
        { k: 'Resume CPR', say: 'AED: "Shock delivered. Begin CPR."', need: ['cpr'], why: { check: 'No pulse check now: 2 minutes of CPR, then the AED re-analyzes.', rhythm: 'CPR first. The AED re-analyzes in 2 minutes.' }, msg: 'Compressions restarted within seconds.', teach: 'After a shock: CPR immediately for 2 minutes.', t: 8 },
        { type: 'q', k: 'Swap', say: 'Two minutes pass. Your arms are burning and a teammate offers to take over.', q: 'When should rescuers swap compressors?', opts: [
          { t: 'Every 2 minutes, during the AED analysis, in under 5 seconds', ok: true },
          { t: 'Only when the compressor feels too tired to continue', why: 'Compression quality drops before rescuers notice they are tired. Swap every 2 minutes, during the analysis.' },
          { t: 'Every 5 minutes, right after a shock is delivered', why: 'Quality falls after about 2 minutes. Swap every 2 minutes, during the analysis pause, in under 5 seconds.' }
        ], teach: 'Swap compressors every 2 minutes (or sooner if tired), at the rhythm analysis, in under 5 seconds.' },
        { type: 'end', set: { cpr: false, rhythm: 'nsr', hr: 110, pulse: true, rr: 16, skin: 'pale', alarm: false, look: 'Moving \u00b7 groaning' }, say: 'At the next analysis the AED says no shock is advised. He moves and groans. EMS takes over and takes him to a cardiac center.' }
      ]
    },
    {
      id: 'crib', title: 'Quiet Crib', group: 'Cardiac arrest', algo: 'arrest', age: '10-month-old', wt: 9, kind: 'infant', diff: 2,
      place: 'Pediatric ward \u00b7 you and a nurse',
      brief: "A parent screams for help: their 10-month-old, admitted with bronchiolitis, isn't breathing. You reach the crib first. A nurse is right behind you.",
      init: { monitor: false, rhythm: 'sbrady', hr: 40, pulse: true, rr: 0, skin: 'mottled', look: 'Floppy, grey-blue, not breathing' },
      phases: [
        { k: 'Responsiveness', say: 'The infant lies still in the crib.', need: ['resp'], msg: 'No response to a tap on the foot.', teach: 'Infant: tap the sole of the foot and shout.', t: 10 },
        { k: 'Activate', say: 'Unresponsive. The nurse is beside you.', need: [['ems', 'shout']], why: { check: 'Get help moving first. One sentence: "Call the code team, bring the defibrillator."' }, msg: 'Nurse: "Calling the code team and bringing the defibrillator!"', teach: 'With a second rescuer: send them to activate the emergency response and get the defibrillator while you assess.', t: 10 },
        { k: 'Pulse check', say: 'Help is on the way.', need: ['check'], msg: 'Not breathing. Brachial pulse about 40/min. Skin mottled.', teach: 'Infant pulse: brachial artery, inside of the upper arm. No more than 10 seconds.', t: 12 },
        { type: 'q', k: 'HR 40', say: 'Not breathing. Brachial pulse about 40/min. Mottled.', q: 'What now?', opts: [
          { t: 'Start CPR now: HR under 60 with poor perfusion', ok: true },
          { t: 'Breaths only; compress only if the pulse is lost', why: 'Compressions start at HR under 60/min with poor perfusion, not only when the pulse is gone.' },
          { t: 'Get the monitor on first, then decide on CPR', why: 'Do not delay CPR for equipment. A palpated pulse under 60/min with poor perfusion is enough to start.' }
        ], teach: 'HR under 60/min with poor perfusion despite oxygenation and ventilation: start CPR.' },
        { type: 'q', k: 'Technique', say: 'The nurse is back with a bag-mask.', q: 'Two rescuers, infant. Technique and ratio?', opts: [
          { t: '2-thumb encircling hands, 15:2', ok: true },
          { t: '2-thumb encircling hands, 30:2', why: '30:2 is for a lone rescuer. With two rescuers, infants and children get 15:2.' },
          { t: '2-thumb encircling hands, 3:1', why: '3:1 is the newborn (delivery room) ratio. Beyond the newborn period, two rescuers use 15:2.' },
          { t: '2 fingers on the sternum, 15:2', why: 'The 2-finger technique is no longer recommended (2025). Use 2-thumb encircling, or the heel of one hand if you cannot encircle the chest.' }
        ], teach: 'Two rescuers: 15:2, two-thumb encircling hands, depth about 4 cm, 100\u2013120/min.', after: { cpr: true } },
        { k: 'Team arrives', say: 'CPR is running. The code team rolls in the cart.', need: [['o2', 'bvm'], 'pads'], ok: ['ivio', 'suction', 'position'], why: { epi: 'Not yet: first oxygen, ventilation and the monitor/defibrillator.' }, msg: 'Bag-mask with 100% oxygen. Pads on.', after: { rhythm: 'asystole', hr: 0, pulse: false }, teach: 'Arrest step 1: start CPR, give oxygen, attach the monitor/defibrillator.', t: 16 },
        { k: 'Rhythm check', say: 'Monitor connected. Time for a rhythm check.', set: { rhythm: 'asystole', hr: 0, pulse: false, alarm: true }, need: ['rhythm'], msg: 'A flat line.', t: 10 },
        { type: 'q', k: 'Flat line', say: 'The monitor shows a flat line.', q: 'Before you call it asystole\u2026', opts: [
          { t: 'Check leads and gain, confirm in a second lead', ok: true },
          { t: 'Give one 2 J/kg shock in case it is fine VF', why: 'Asystole is not shockable, and a shock only interrupts CPR. Confirm with leads, gain and a second lead first.' },
          { t: 'Pause CPR for 30 seconds and watch the rhythm', why: 'Pauses in compressions must stay under 10 seconds. Confirm the rhythm with leads and gain during that short check.' }
        ], teach: 'Flat line: make sure it is real (leads, gain, power, second lead). Then treat it as asystole.' },
        { type: 'q', k: 'Non-shockable', say: 'Confirmed asystole.', q: 'Plan?', opts: [
          { t: 'Resume CPR, get IV/IO, epinephrine 0.01 mg/kg every 3\u20135 min', ok: true },
          { t: 'Resume CPR, get IV/IO, atropine 0.02 mg/kg, then epinephrine', why: 'Atropine is not part of the pediatric cardiac arrest algorithm. Give epinephrine 0.01 mg/kg IV/IO every 3\u20135 min.' },
          { t: 'Resume CPR, get IV/IO, epinephrine 0.1 mg/kg every 3\u20135 min', why: '0.1 mg/kg is ten times the IV/IO dose (that is the endotracheal dose). IV/IO epinephrine is 0.01 mg/kg.' }
        ], teach: 'Non-shockable (asystole/PEA): CPR plus epinephrine as soon as possible, then every 3\u20135 min.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR + epinephrine', say: 'CPR cycle running. Get access and give the first drug.', dur: 16, need: ['ivio', 'epi'], ok: ['airway'], why: { amio: 'Amiodarone is for shockable rhythms (VF/pVT).', atropine: 'Atropine is not part of the arrest algorithm.', shock: '!Asystole is not shockable.' }, teach: 'IO is fast and works for every resuscitation drug. Epinephrine 0.01 mg/kg = 0.1 mL/kg of 0.1 mg/mL.' },
        { type: 'q', k: 'PEA', say: 'Rhythm check: slow organized complexes. No pulse.', set: { cpr: false, rhythm: 'pea', hr: 48 }, q: 'This is\u2026', opts: [
          { t: 'PEA: continue CPR and give epinephrine', ok: true },
          { t: 'ROSC: stop CPR and check blood pressure', why: 'Organized complexes without a pulse are PEA. ROSC requires a palpable pulse, so keep compressing.' },
          { t: 'Bradycardia with a pulse: give atropine', why: 'There is no pulse, so this is PEA, not bradycardia. Stay in the arrest algorithm: CPR and epinephrine.' },
          { t: 'Shockable rhythm: shock 2 J/kg, then CPR', why: 'PEA is non-shockable. Continue CPR, give epinephrine every 3\u20135 min and look for reversible causes.' }
        ], teach: 'PEA = organized electrical activity without a palpable pulse. Non-shockable.', after: { cpr: true } },
        { type: 'cycle', k: 'Cause + airway', say: 'CPR continues. Find the cause and secure the airway. Repeat epinephrine every 3\u20135 minutes: watch the epi timer.', dur: 20, need: ['hts', 'airway'], ok: ['epi', 'suction', 'position'], hts: { clue: 'Admitted with bronchiolitis. Found apneic. During bagging the chest barely rises. SpO2 unreadable.', ans: 'Hypoxia', fix: 'Secure the airway and ventilate effectively.' }, why: { shock: '!PEA is not shockable.' }, teach: 'Pediatric arrest is usually respiratory. With an advanced airway: continuous compressions, 1 breath every 2\u20133 s.' },
        { k: 'ROSC?', say: 'Rhythm check: sinus rhythm at 150. Look at the capnography.', set: { cpr: false, rhythm: 'nsr', hr: 150, etco2: 38 }, need: ['check'], why: { cpr: 'An organized rhythm with a sudden EtCO2 rise: feel for a pulse first.' }, msg: 'Strong brachial pulse!', after: { pulse: true, spo2: 92, alarm: false, skin: 'pale', look: 'Color returning' }, teach: 'A sudden rise in EtCO2 is often the first sign of ROSC.', t: 10 },
        { type: 'q', k: 'Post-ROSC', say: 'ROSC.', q: 'What oxygen target now?', opts: [
          { t: 'Aim for SpO2 94\u201399%', ok: true },
          { t: 'Aim for SpO2 100%', why: 'Avoid hyperoxia after ROSC: it adds oxidative injury. Wean oxygen to keep SpO2 94\u201399%.' },
          { t: 'Aim for SpO2 88\u201392%', why: '88\u201392% is a target for chronic lung disease, not post-arrest care. Avoid hypoxemia: aim for 94\u201399%.' }
        ], teach: 'Post-ROSC: SpO2 94\u201399%, PaCO2 35\u201345, treat hypotension, avoid fever, check glucose.' },
        { type: 'end', set: { spo2: 96 }, say: 'The infant is stabilized and transferred to the PICU.' }
      ]
    },
    {
      id: 'pitch', title: 'Collapse on the Pitch', group: 'Cardiac arrest', algo: 'arrest', age: '9-year-old', wt: 30, kind: 'child', diff: 3,
      place: 'ED resus bay \u00b7 you lead the team',
      brief: 'EMS rushes in with a 9-year-old who collapsed during a soccer game. Bystanders started CPR right away. Compressions are ongoing.',
      init: { monitor: false, rhythm: 'vf', hr: 0, pulse: false, rr: 0, cpr: true, skin: 'grey', look: 'Unresponsive \u00b7 CPR in progress' },
      phases: [
        { k: 'Take over', say: 'Compressions are ongoing as you take over.', need: [['o2', 'bvm'], 'pads'], ok: ['ivio'], why: { cpr: 'CPR is already running. Now: oxygen and the monitor/defibrillator.', epi: 'Not yet. First: oxygen and the monitor/defibrillator. In a shockable rhythm the shock comes before any drug.', shock: 'Not yet: finish oxygen and pads, then pause for a rhythm check. Shock only a rhythm you have analyzed.' }, msg: 'Bag-mask with 100% oxygen. Pads on.', teach: 'Step 1: start CPR, give oxygen, attach the monitor/defibrillator.', t: 14 },
        { k: 'Rhythm check', say: 'Pads connected. Pause compressions for a rhythm check.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Compressions paused.', after: { alarm: true }, t: 10 },
        { type: 'q', k: 'VF', say: 'Hands off. Look at the monitor.', q: 'What do you see?', opts: [
          { t: 'Ventricular fibrillation: shockable', ok: true },
          { t: 'Asystole with artifact: non-shockable', why: 'Chaotic, irregular waves are VF, not artifact over a flat line. VF is shockable: defibrillate.' },
          { t: 'VT with a pulse: synchronized shock', why: 'There are no organized complexes and no pulse: this is VF. Defibrillate unsynchronized.' }
        ], teach: 'Shockable: VF and pulseless VT. Non-shockable: asystole and PEA.' },
        { k: 'Shock 1', say: 'VF. The defibrillator is charged.', need: ['shock'], why: { epi: 'Shock first. In VF, epinephrine comes after the 2nd shock.', sync: '!VF has no R waves to sync to. Defibrillate unsynchronized.', cpr: 'It is already charged: everyone clear, shock now. Compressions restart right after the shock.' }, msg: 'Shock delivered.', teach: 'First shock: 2 J/kg.', t: 12 },
        { k: 'Resume CPR', say: 'The shock is done. The team looks at you.', need: ['cpr'], why: { check: 'No pulse check after a shock. CPR immediately.', rhythm: 'CPR immediately for 2 minutes before the next analysis.', shock: 'One shock, then 2 minutes of CPR before the next rhythm check.' }, msg: 'CPR resumed.', t: 8 },
        { type: 'cycle', k: 'CPR + access', say: 'CPR for 2 minutes. What does this cycle add?', dur: 12, need: ['ivio'], why: { epi: 'In VF, epinephrine comes after the 2nd shock. Use this cycle for access.', amio: 'Amiodarone comes after the 3rd shock.', shock: 'Shocks happen at rhythm checks, every 2 minutes.' }, teach: 'Shockable pathway: shock, then CPR 2 min + IV/IO.' },
        { k: 'Check 2', say: '2 minutes are up.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Still VF.', t: 8 },
        { k: 'Shock 2', say: 'Still VF.', need: ['shock'], msg: 'Shock delivered. CPR resumes immediately.', after: { cpr: true }, teach: 'Second shock: 4 J/kg.', t: 12 },
        { type: 'cycle', k: 'Epinephrine', say: 'CPR for 2 minutes.', dur: 14, need: ['epi'], ok: ['airway'], why: { amio: 'Amiodarone comes after the 3rd shock. Now: epinephrine.', lido: 'Lidocaine, like amiodarone, comes after the 3rd shock. Now: epinephrine.' }, teach: 'After the 2nd shock: epinephrine 0.01 mg/kg every 3\u20135 min, consider an advanced airway.' },
        { k: 'Check 3', say: 'Rhythm check.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.', amio: 'Rhythm check first. The antiarrhythmic goes in during the CPR after the 3rd shock.', lido: 'Rhythm check first. The antiarrhythmic goes in during the CPR after the 3rd shock.' }, msg: 'VF persists.', t: 8 },
        { k: 'Shock 3', say: 'Still VF.', need: ['shock'], why: { amio: 'Shock first. The antiarrhythmic goes in during the CPR right after this shock.', lido: 'Shock first. The antiarrhythmic goes in during the CPR right after this shock.' }, msg: 'Shock delivered. CPR resumes.', after: { cpr: true }, teach: 'Subsequent shocks: at least 4 J/kg, maximum 10 J/kg or the adult dose.', t: 12 },
        { type: 'cycle', k: 'Antiarrhythmic', say: 'CPR for 2 minutes. Give the antiarrhythmic, and work out why this happened.', dur: 20, need: [['amio', 'lido'], 'hts'], dose: { amio: 'amioArrest' }, ok: ['epi', 'airway'], hts: { clue: 'A teammate admits they dared him this morning, and he swallowed "a handful" of his grandmother\u2019s heart pills.', ans: 'Toxins', fix: 'Poison center, specific antidotes.' }, teach: 'After the 3rd shock: amiodarone 5 mg/kg bolus (or lidocaine 1 mg/kg). Treat reversible causes.' },
        { k: 'Check 4', say: 'Rhythm check: organized narrow complexes at 120.', set: { cpr: false, rhythm: 'nsr', hr: 120, alarm: false }, need: ['check'], why: { shock: '!Organized rhythm: check for a pulse. Never shock it.', cpr: 'Organized rhythm: check for a pulse first, no more than 10 s.' }, msg: 'Carotid pulse present. Check the BP on the monitor.', after: { pulse: true, bp: '84/50', spo2: 93, skin: 'pale', look: 'Unresponsive \u00b7 pulse present' }, t: 10 },
        { type: 'q', k: 'Post-ROSC', say: 'ROSC.', q: 'Which post-ROSC plan is right?', opts: [
          { t: 'SpO2 94\u201399%, PaCO2 35\u201345, treat hypotension, avoid fever, check glucose', ok: true },
          { t: 'SpO2 94\u201399%, PaCO2 25\u201330, treat hypotension, avoid fever, check glucose', why: 'PaCO2 25\u201330 is hyperventilation: it lowers cerebral blood flow. Aim for a normal PaCO2 (35\u201345).' },
          { t: 'SpO2 100% (FiO2 1.0), PaCO2 35\u201345, treat hypotension, avoid fever, check glucose', why: 'Hyperoxia harms the post-arrest brain. Titrate oxygen to SpO2 94\u201399%.' }
        ], teach: 'Post-ROSC: optimize ventilation and oxygenation, treat shock (epi/norepi/dopamine if hypotensive), glucose, temperature, seizures.' },
        { type: 'end', say: 'He is transferred to the PICU. Your team gathers for a five-minute debrief.' }
      ]
    },
    {
      id: 'pea', title: 'Dry and Silent', group: 'Cardiac arrest', algo: 'arrest', age: '11-month-old', wt: 8, kind: 'infant', diff: 3,
      place: 'Emergency department \u00b7 you lead the team',
      brief: 'An 11-month-old with a week of watery diarrhea arrives in her father\u2019s arms, grey and limp. As you take her, she stops breathing.',
      init: { monitor: false, rhythm: 'stach', hr: 150, pulse: true, rr: 0, skin: 'grey', look: 'Limp \u00b7 sunken eyes \u00b7 not breathing' },
      phases: [
        { k: 'Pulse check', say: 'Unresponsive and not breathing. You shout and the team comes running.', need: ['check'], ok: ['ems', 'shout', 'resp'], why: { cpr: 'Check the pulse first, for no more than 10 seconds.' }, msg: 'No brachial pulse.', after: { pulse: false }, teach: 'Infant: check breathing and the brachial pulse together, for no more than 10 seconds.', t: 10 },
        { k: 'Start CPR', say: 'No pulse.', need: ['cpr'], why: { bvm: 'Compressions first: no pulse means CPR now.', pads: 'Start compressions first. The team attaches the pads while you compress.', ivio: 'CPR first. Access comes during CPR.' }, msg: 'Two-thumb encircling compressions, 15:2 with a nurse bagging.', teach: 'No pulse: start CPR at once. Two rescuers: 15:2, two-thumb encircling hands.', t: 8 },
        { k: 'Team', say: 'CPR is running.', need: [['o2', 'bvm'], 'pads'], ok: ['ivio'], why: { epi: 'Not yet. First: oxygen and the monitor/defibrillator, so you know the rhythm.' }, msg: 'Bagging with 100% oxygen. Pads on.', after: { rhythm: 'pea', hr: 110 }, teach: 'Arrest step 1: CPR, oxygen, monitor/defibrillator.', t: 14 },
        { k: 'Rhythm check', say: 'Pause compressions for a rhythm check.', need: ['rhythm'], msg: 'Organized narrow complexes at 110.', after: { alarm: true }, t: 10 },
        { type: 'q', k: 'Rhythm', say: 'Narrow complexes at 110. No brachial pulse.', q: 'This is\u2026', opts: [
          { t: 'PEA: CPR plus epinephrine IV/IO', ok: true },
          { t: 'ROSC: start post-cardiac arrest care', why: 'An organized rhythm without a pulse is PEA. Only a palpable pulse means ROSC.' },
          { t: 'Sinus tachycardia: fluid bolus', why: 'There is no pulse, so this is cardiac arrest, not sinus tachycardia. Start CPR.' },
          { t: 'Pulseless VT: shock 2 J/kg', why: 'Narrow complexes at 110 without a pulse are PEA, not VT. PEA is non-shockable: CPR and epinephrine.' }
        ], teach: 'PEA: organized electrical activity without a pulse. Non-shockable: CPR and epinephrine as soon as possible.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR + epinephrine', say: 'CPR resumes. Get access and give the first drug.', dur: 16, need: ['ivio', 'epi'], ok: ['fluid', 'airway'], why: { shock: '!PEA is not shockable.', atropine: 'Atropine is not part of the arrest algorithm.', amio: 'Antiarrhythmics are for VF/pVT.' }, teach: 'Non-shockable: epinephrine 0.01 mg/kg IV/IO as soon as possible, then every 3\u20135 minutes.' },
        { type: 'cycle', k: 'Find the cause', say: 'Next cycle. Why did this infant arrest? Find the cause and treat it.', dur: 20, need: ['hts', 'fluid'], ok: ['glucose', 'airway', 'epi'], hts: { clue: 'A week of watery diarrhea. Sunken eyes and fontanelle. No wet diaper for a day. Bagging moves the chest well.', ans: 'Hypovolemia', fix: 'Fluid bolus: 20 mL/kg isotonic crystalloid, repeat as needed.' }, why: { shock: '!PEA is not shockable.' }, teach: "PEA: hunt the H's & T's. In children, hypoxia and hypovolemia are the most common reversible causes. Repeat epinephrine every 3\u20135 minutes (about every other cycle): watch the epi timer." },
        { k: 'ROSC?', say: 'Rhythm check: narrow complexes at 150. Look at the capnography.', set: { cpr: false, rhythm: 'stach', hr: 150, etco2: 35 }, need: ['check'], why: { cpr: 'Organized rhythm and a jump in EtCO2: check for a pulse first.', shock: '!Organized rhythm: never shock it. Check for a pulse.' }, msg: 'Brachial pulse present!', after: { pulse: true, alarm: false, bp: '58/30', spo2: 90, skin: 'mottled', look: 'ROSC \u00b7 not breathing \u00b7 CRT 5 s' }, teach: 'A sudden rise in EtCO2 is often the first sign of ROSC.', t: 10 },
        { k: 'Post-ROSC: breathing', say: 'ROSC. She is not breathing on her own, and her lips are dusky.', need: [['airway', 'bvm']], ok: ['glucose', 'o2', 'fluid'], why: { vaso: 'Hypovolemia needs volume first. Add a vasoactive only if shock persists after fluid boluses.' }, msg: 'Ventilation secured, capnography on, oxygen titrated.', after: { spo2: 96, etco2: 40, rr: 30 }, teach: 'Post-ROSC step 1: optimize ventilation and oxygenation. SpO2 94\u201399%, PaCO2 35\u201345. Avoid hyperventilation.', t: 16 },
        { type: 'q', k: 'Persistent shock?', say: 'Mottled, CRT 5 s. Look at the monitor.', q: 'Is she in shock after ROSC?', opts: [
          { t: 'Yes: hypotensive shock, systolic below 70', ok: true },
          { t: 'No: a palpable pulse means she is stable', why: 'A pulse is not enough. 58 systolic is below the infant limit of 70, with signs of poor perfusion.' },
          { t: 'Yes: compensated shock, BP still acceptable', why: 'Compensated shock means a normal systolic BP. 58 is below the infant limit of 70: this is hypotensive shock.' }
        ], teach: 'Post-ROSC hypotension worsens brain injury. Treat it right away.' },
        { k: 'Treat hypotension', say: 'Hypotensive shock after ROSC, from hypovolemia.', need: ['fluid'], ok: ['vaso', 'glucose'], msg: 'Another bolus running.', after: { bp: '74/42', hr: 138, skin: 'pale', look: 'CRT 3 s \u00b7 ventilated' }, teach: 'Post-ROSC hypotension: 10\u201320 mL/kg boluses; add epinephrine, dopamine or norepinephrine if it persists.', t: 14 },
        { k: 'Brain + metabolism', say: 'Her color and CRT are improving. Now protect the brain.', need: ['glucose'], ok: ['ecg12'], why: { dextrose: 'Check first, then treat.' }, msg: 'Glucose 110 mg/dL. Temperature 37.9 \u00b0C.', teach: 'Post-ROSC: check glucose and electrolytes, treat seizures, avoid fever.', t: 12 },
        { type: 'q', k: 'Temperature', say: 'Temperature 37.9 \u00b0C and rising. She is still comatose.', q: 'Temperature plan?', opts: [
          { t: 'Treat it: keep core temperature at or below 37.5 \u00b0C', ok: true },
          { t: 'Culture first: treat fever only if infection is proven', why: 'After arrest, fever worsens brain injury whatever its cause. Send cultures, but control temperature now.' },
          { t: 'Wait: give an antipyretic only above 38.5 \u00b0C', why: 'There is no safe fever threshold after arrest. Keep core temperature at or below 37.5 \u00b0C.' }
        ], teach: 'Post-ROSC: avoid fever; in a comatose child consider targeted temperature management. Then expert consult and PICU transfer.' },
        { type: 'end', say: 'She is transferred to the PICU with her parents beside her. Your team gathers to debrief.' }
      ]
    },
    {
      id: 'dialysis', title: 'Missed Dialysis', group: 'Cardiac arrest', algo: 'arrest', age: '10-year-old', wt: 28, kind: 'child', diff: 3,
      place: 'ED triage \u00b7 you lead the team',
      brief: 'A 10-year-old on hemodialysis has missed his last two sessions. In triage he says his legs feel weak, then slumps over in the chair. He is already on the triage monitor.',
      flags: { leads: true },
      init: { monitor: true, rhythm: 'vt', hr: 180, pulse: false, spo2: null, rr: 0, skin: 'grey', look: 'Slumped \u00b7 unresponsive', alarm: true },
      phases: [
        { k: 'Pulse check', say: 'He slumps in the chair. The monitor alarms.', need: ['check'], ok: ['shout', 'ems', 'resp'], why: { cpr: 'Check for a pulse first, for no more than 10 seconds.', shock: 'Confirm the arrest first: no pulse, no breathing, in under 10 seconds.' }, msg: 'No pulse. Not breathing.', teach: 'Check breathing and the central pulse together, for no more than 10 seconds.', t: 10 },
        { k: 'Start CPR', say: 'No pulse.', need: ['cpr'], ok: ['ems', 'shout'], why: { pads: 'Compressions first. The pads go on while CPR runs.', epi: 'CPR first. Drugs come later.' }, msg: 'Compressions started. The team rushes in.', teach: 'No pulse: start CPR at once.', t: 8 },
        { k: 'Team', say: 'CPR is running.', need: [['o2', 'bvm'], 'pads'], ok: ['ivio'], why: { epi: 'Not yet: oxygen and pads first, then a rhythm check.', shock: 'Pads on first, then a rhythm check before any shock.' }, msg: 'Bagging with 100% oxygen. Pads on.', teach: 'Arrest step 1: CPR, oxygen, monitor/defibrillator.', t: 14 },
        { k: 'Rhythm check', say: 'Pause compressions for a rhythm check.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Compressions paused.', t: 10 },
        { type: 'q', k: 'Rhythm', say: 'Hands off. Look at the monitor.', q: 'What do you see?', opts: [
          { t: 'Pulseless ventricular tachycardia: shockable', ok: true },
          { t: 'Ventricular tachycardia with a pulse: synchronized shock', why: 'He has no pulse. Pulseless VT is treated like VF: unsynchronized defibrillation.' },
          { t: 'Wide-complex PEA: non-shockable, epinephrine', why: 'A fast, regular wide-complex rhythm without a pulse is pulseless VT, and it is shockable.' }
        ], teach: 'Shockable: VF and pulseless VT. Non-shockable: asystole and PEA.' },
        { k: 'Shock 1', say: 'Pulseless VT. The defibrillator is charged.', need: ['shock'], why: { sync: '!He has no pulse: defibrillate unsynchronized.', epi: 'Shock first. In a shockable rhythm, epinephrine comes after the 2nd shock.', cpr: 'It is charged: everyone clear, shock now. CPR restarts right after.' }, msg: 'Shock delivered. CPR resumes.', after: { cpr: true }, teach: 'First shock: 2 J/kg.', t: 12 },
        { type: 'cycle', k: 'Access + cause', say: 'CPR for 2 minutes. Get access, and think about why a dialysis patient arrests.', dur: 18, need: ['ivio', 'hts'], ok: ['airway'], hts: { clue: 'Kidney failure on dialysis, two missed sessions, leg weakness just before he collapsed. The triage ECG had tall, peaked T waves.', ans: 'Hypo/hyperkalemia', fix: 'Calcium IV/IO now, then sodium bicarbonate and insulin with glucose; dialysis once stable.' }, why: { epi: 'In a shockable rhythm, epinephrine comes after the 2nd shock.', amio: 'Amiodarone comes after the 3rd shock.', shock: 'Shocks happen at rhythm checks, every 2 minutes.' }, teach: 'Hyperkalemic arrest: give calcium early, alongside standard CPR, shocks and epinephrine.' },
        { k: 'Check 2', say: '2 minutes are up.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Still pulseless VT.', t: 8 },
        { k: 'Shock 2', say: 'Still pulseless VT.', need: ['shock'], why: { sync: '!Still no pulse: unsynchronized.' }, msg: 'Shock delivered. CPR resumes.', after: { cpr: true }, teach: 'Second shock: 4 J/kg.', t: 12 },
        { type: 'cycle', k: 'Epinephrine', say: 'CPR for 2 minutes. Calcium is going in.', dur: 14, need: ['epi'], ok: ['airway'], why: { amio: 'Amiodarone comes after the 3rd shock. Now: epinephrine.' }, teach: 'After the 2nd shock: epinephrine 0.01 mg/kg every 3\u20135 minutes.' },
        { k: 'Check 3', say: 'Rhythm check: organized narrow complexes. Look at the capnography.', set: { cpr: false, rhythm: 'nsr', hr: 100, etco2: 36, alarm: false }, need: ['check'], why: { shock: '!Organized rhythm: never shock it. Check for a pulse.', cpr: 'Organized rhythm: check for a pulse first.' }, msg: 'Carotid pulse present!', after: { pulse: true, bp: '86/50', spo2: 94, rr: 0, skin: 'pale', look: 'ROSC \u00b7 unresponsive' }, teach: 'A sudden rise in EtCO2 is often the first sign of ROSC.', t: 10 },
        { type: 'q', k: 'Potassium', say: 'ROSC. His potassium is still very high.', q: 'What keeps the potassium from stopping his heart again?', opts: [
          { t: 'Calcium, insulin with glucose, bicarbonate; then urgent dialysis', ok: true },
          { t: 'Calcium, then furosemide and a potassium-free fluid bolus', why: 'A child in kidney failure makes little urine, so a diuretic will not clear the potassium. Shift it into the cells with insulin and glucose and bicarbonate, then dialyze.' },
          { t: 'An amiodarone infusion to prevent the VT from coming back', why: 'The VT came from the high potassium. Treat the potassium: an antiarrhythmic does not fix the cause.' }
        ], teach: 'Hyperkalemia: calcium protects the heart within minutes; insulin with glucose, bicarbonate and albuterol shift potassium into cells; dialysis removes it.' },
        { type: 'end', say: 'Dialysis starts within the hour. His potassium falls and the ECG returns to normal.' }
      ]
    },
    {
      id: 'twist', title: 'Startled Awake', group: 'Cardiac arrest', algo: 'arrest', age: '15-year-old', wt: 55, kind: 'teen', diff: 3,
      place: 'Emergency department',
      brief: 'A 15-year-old fainted this morning when her alarm clock rang. She feels fine now and wants to go home. She is on the monitor in a cubicle.',
      flags: { leads: true },
      init: { monitor: true, rhythm: 'nsr', hr: 78, pulse: true, spo2: 98, rr: 16, bp: '112/70', skin: 'pink', look: 'Alert \u00b7 embarrassed about fainting' },
      phases: [
        { k: '12-lead', say: 'She feels fine. She fainted when her alarm clock rang, and once before at a swimming lesson.', need: ['ecg12'], ok: ['ivio', 'o2', 'auscult'], why: { pads: 'She is alert with a normal rhythm on the monitor. Get the 12-lead to look at the intervals first.' }, msg: 'Sinus rhythm. QTc 560 ms.', teach: 'Fainting triggered by a sudden noise, exercise or swimming: think long QT syndrome and get a 12-lead.', t: 14 },
        { type: 'q', k: 'Long QT', say: 'The 12-lead shows a long QT interval.', q: 'Why does this matter?', opts: [
          { t: 'Long QT can trigger torsades de pointes and sudden death', ok: true },
          { t: 'Long QT matters only if she takes QT-prolonging drugs', why: 'Congenital long QT can cause torsades on its own, often triggered by noise, exercise or swimming. Her faint is a warning.' },
          { t: 'Long QT is harmless once the faint has fully passed', why: 'Fainting with a long QT is a red flag for torsades de pointes and sudden death.' }
        ], teach: 'A long QT with fainting is a warning: keep her on the monitor with a defibrillator close.' },
        { k: 'Collapse', say: 'A phone rings loudly at the nursing station. She stiffens and slumps. The monitor alarms.', set: { rhythm: 'torsades', hr: 0, pulse: false, spo2: null, rr: 0, alarm: true, skin: 'grey', look: 'Unresponsive \u00b7 not breathing' }, need: ['check'], ok: ['shout', 'ems'], why: { cpr: 'Check for a pulse first, for no more than 10 seconds.', shock: 'Confirm the arrest first: no pulse, no breathing, in under 10 seconds.' }, msg: 'No pulse.', t: 10 },
        { k: 'CPR + pads', say: 'No pulse.', need: ['cpr', 'pads'], ok: ['shout', 'ems', 'o2', 'bvm'], why: { epi: 'Not now: CPR and the defibrillator first.', mag: 'Soon. CPR and pads first, then a rhythm check.' }, msg: 'Compressions running. Pads on.', teach: 'Arrest: start CPR and attach the defibrillator.', t: 12 },
        { k: 'Rhythm check', say: 'Pads on. Pause for a rhythm check.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Compressions paused.', t: 8 },
        { type: 'q', k: 'Rhythm', say: 'Hands off. Look at the monitor.', q: 'What is it, and what changes because of it?', opts: [
          { t: 'Pulseless torsades: shock it, then give magnesium', ok: true },
          { t: 'Coarse VF: shock it, then amiodarone after the 3rd shock', why: 'The complexes twist around the baseline: torsades. Shock it like VF, but avoid amiodarone and procainamide, which prolong the QT. Give magnesium.' },
          { t: 'Polymorphic VT with a pulse: synchronized cardioversion', why: 'She has no pulse, so defibrillate unsynchronized. Polymorphic VT cannot be reliably synchronized anyway.' }
        ], teach: 'Torsades de pointes: a polymorphic VT that twists around the baseline. Without a pulse: defibrillate, then magnesium.' },
        { k: 'Shock', say: 'Torsades without a pulse. Charged.', need: ['shock'], why: { sync: '!She has no pulse, and polymorphic VT cannot be synchronized. Defibrillate.', mag: 'Shock first, then magnesium during CPR.' }, msg: 'Shock delivered. CPR resumes.', after: { cpr: true }, teach: 'First shock: 2 J/kg.', t: 10 },
        { type: 'cycle', k: 'Magnesium', say: 'CPR for 2 minutes. Get access and give the drug for this rhythm.', dur: 16, need: ['ivio', 'mag'], ok: ['airway', 'bvm'], why: { amio: '!Amiodarone prolongs the QT and can worsen torsades. Give magnesium.', procain: '!Procainamide prolongs the QT. Avoid it in torsades.', epi: 'In a shockable rhythm epinephrine comes after the 2nd shock. Magnesium is the drug for torsades.' }, teach: 'Torsades: magnesium sulfate 25\u201350 mg/kg IV/IO (max 2 g), pushed over a few minutes in arrest.' },
        { k: 'Check 2', say: 'Rhythm check: organized narrow complexes.', set: { cpr: false, rhythm: 'nsr', hr: 96, alarm: false }, need: ['check'], why: { shock: '!Organized rhythm: check for a pulse, never shock it.', cpr: 'Organized rhythm: check for a pulse first.' }, msg: 'Radial pulse present!', after: { pulse: true, bp: '98/60', spo2: 95, rr: 14, skin: 'pale', look: 'ROSC \u00b7 groaning' }, t: 10 },
        { type: 'q', k: 'From now on', say: 'ROSC. She is starting to move.', q: 'Which drugs should she avoid from now on?', opts: [
          { t: 'Drugs that prolong the QT, such as macrolides and ondansetron', ok: true },
          { t: 'Beta-blockers, because they raise her risk of torsades', why: 'Beta-blockers are the main long-term treatment for long QT syndrome.' },
          { t: 'Magnesium and potassium, because they set off the arrhythmia', why: 'Low magnesium and potassium promote torsades. Keep both in the high-normal range.' }
        ], teach: 'Long QT: avoid QT-prolonging drugs, keep potassium and magnesium high-normal, start a beta-blocker, consider an ICD.' },
        { type: 'end', say: 'She goes to the PICU. Cardiology starts a beta-blocker and plans an implanted defibrillator.' }
      ]
    },
    {
      id: 'slow', title: 'Tiring Toddler', group: 'Bradycardia', algo: 'brady', age: '2-year-old', wt: 12, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: 'A 2-year-old with two days of pneumonia has been working hard to breathe. The nurse calls you: "She\'s getting sleepy and her heart rate is dropping."',
      init: { monitor: false, rhythm: 'sbrady', hr: 52, pulse: true, spo2: 78, rr: 8, bp: '64/38', skin: 'mottled', look: 'Responds to pain only \u00b7 mottled \u00b7 CRT 5 s' },
      phases: [
        { type: 'q', k: 'Red flag', say: 'Her respiratory rate fell from 60 to 8 over the last 10 minutes.', q: 'What does the slowing breathing mean?', opts: [
          { t: 'Exhaustion: respiratory arrest is close', ok: true },
          { t: 'Improvement: her work of breathing is easing', why: 'A falling rate after a period of distress, with poor responsiveness, signals fatigue and impending arrest.' },
          { t: 'Sleep: a normal rate for a sleeping toddler', why: 'A toddler normally breathes about 22\u201337/min. Even asleep, a rate of 8 is far too slow, and she responds only to pain. RR 8 is respiratory failure.' }
        ], teach: 'Respiratory failure: slow or irregular breathing, poor effort, bradycardia, decreased responsiveness, cyanosis.' },
        { k: 'Ventilate', say: 'Breathing slowly and shallowly, lips dusky. Her pulse feels slow.', need: ['bvm'], ok: ['position', 'o2', 'pads', 'suction', 'ivio'], why: { epi: 'Hypoxia is the #1 cause of bradycardia in children. Oxygenate and ventilate first.', atropine: 'Hypoxia is driving this bradycardia. Ventilate first.', cpr: 'She has a pulse. Ventilate with oxygen first; CPR if HR stays under 60 with poor perfusion despite that.' }, msg: 'Bag-mask with 100% O2. Good chest rise.', teach: 'Bradycardia in children is most often caused by hypoxia. Support airway and breathing before anything else.', t: 14 },
        { k: 'Monitor', say: 'Bagging with good chest rise.', need: ['pads'], ok: ['ivio'], why: { cpr: 'Ventilation has only just started. Give it about 30 seconds, then reassess: CPR if HR stays under 60 with poor perfusion.' }, msg: 'Monitor on: sinus bradycardia.', teach: 'Attach the monitor: rhythm, SpO2, blood pressure.', t: 12 },
        { type: 'q', k: 'Still slow', say: 'After 30 seconds of effective ventilation with 100% O2: still mottled, CRT 5 s. Look at the monitor.', set: { hr: 50, spo2: 88, bp: '60/34' }, q: 'Next step?', opts: [
          { t: 'Start CPR: chest compressions and ventilation', ok: true },
          { t: 'Continue bag-mask ventilation for 2 more minutes', why: 'HR under 60 with poor perfusion despite effective oxygenation and ventilation needs CPR now. Do not wait.' },
          { t: 'Give atropine 0.02 mg/kg IV before compressions', why: 'Compressions come first when HR stays under 60 with poor perfusion. Epinephrine is the first drug; atropine is for vagal tone or a primary AV block.' }
        ], teach: 'Bradycardia rule: HR under 60/min + poor perfusion despite O2 and ventilation means CPR.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR + epinephrine', say: 'CPR with ventilation. The bradycardia persists: get access and give the first-line drug.', dur: 14, need: ['ivio', 'epi'], why: { atropine: 'Epinephrine is first-line for symptomatic bradycardia. Atropine is for vagal causes or primary AV block.', adenosine: '!Adenosine slows AV conduction: the opposite of what she needs.' }, teach: 'Epinephrine 0.01 mg/kg IV/IO, repeat every 3\u20135 min.' },
        { type: 'q', k: 'Atropine?', say: 'Pulse check: a good pulse, and she is pinking up. CPR stops.', set: { cpr: false, rhythm: 'nsr', hr: 118, spo2: 95, bp: '88/52', skin: 'pale', look: 'Pinking up \u00b7 CRT 3 s' }, q: 'When would atropine be the better first drug?', opts: [
          { t: 'Increased vagal tone (e.g. intubation) or primary AV block', ok: true },
          { t: 'Hypoxic bradycardia from respiratory failure, as in this child', why: 'Hypoxic bradycardia: oxygenate and ventilate, then CPR and epinephrine if HR stays under 60.' },
          { t: 'Bradycardia under 60 that persists despite good CPR', why: 'Bradycardia with poor perfusion despite oxygenation, ventilation and CPR calls for epinephrine first.' }
        ], teach: 'Atropine 0.02 mg/kg (min 0.1 mg, max single dose 0.5 mg), may repeat once.' },
        { type: 'end', say: 'She is intubated and moved to the PICU. Her heart rate stays normal now that she is well oxygenated.' }
      ]
    },
    {
      id: 'block', title: 'Post-op Heart Block', group: 'Bradycardia', algo: 'brady', age: '6-year-old', wt: 20, kind: 'child', diff: 3,
      place: 'Cardiac ward',
      brief: 'A 6-year-old, three days after heart surgery, says she feels dizzy. She is alert and answering questions.',
      init: { monitor: false, rhythm: 'avb3', hr: 38, pulse: true, spo2: 95, rr: 22, bp: '88/54', skin: 'pale', look: 'Dizzy \u00b7 pale \u00b7 alert \u00b7 CRT 2 s' },
      phases: [
        { k: 'Support', say: 'Her pulse is slow and she feels dizzy, but she is alert and her BP is normal for age.', need: ['o2', 'pads'], ok: ['ivio', 'position'], why: { cpr: 'Not yet: she is alert with a normal BP for age, so there is no cardiopulmonary compromise. With a pulse, CPR is for HR under 60 with hypotension, altered mental status or shock despite oxygen and ventilation. Watch her closely.', atropine: 'Not yet: she is alert with a normal BP for age, so no drug is needed now. If she deteriorates: CPR if HR stays under 60, epinephrine, atropine for a primary AV block, and pacing.' }, msg: 'Oxygen on. Monitor attached.', teach: 'Identify and treat the cause: airway, O2, monitor, BP, SpO2, IV/IO, 12-lead.', t: 14 },
        { k: '12-lead', say: 'The monitor shows a slow, odd-looking rhythm. She is still alert.', need: ['ecg12'], ok: ['ivio'], why: { cpr: 'Not yet: she is alert with a normal BP for age, so there is no cardiopulmonary compromise. Use the time to define the rhythm.', atropine: 'Not yet: she is alert with a normal BP for age. Define the rhythm first; drugs are for bradycardia with cardiopulmonary compromise.' }, msg: 'P waves march at 100/min. Wide QRS at 38/min. No relationship between them.', t: 12 },
        { type: 'q', k: 'Rhythm', say: 'P waves at 100, QRS at 38, completely dissociated.', q: 'Rhythm?', opts: [
          { t: 'Third-degree (complete) AV block', ok: true },
          { t: 'Second-degree type I (Wenckebach)', why: 'Wenckebach shows a PR interval that lengthens until a beat drops. Here there is no PR relationship at all.' },
          { t: 'Second-degree AV block type II', why: 'Type II has a constant PR with occasional dropped beats. Here P and QRS are independent.' },
          { t: 'Marked sinus bradycardia', why: 'Sinus bradycardia has a P before every QRS with a fixed PR. Here the atrial rate is 100 and the QRS rate 38.' }
        ], teach: 'Complete heart block: P waves and QRS complexes are not coordinated.' },
        { type: 'q', k: 'Unresponsive', say: 'She stops responding. Weak central pulse, mottled.', set: { hr: 34, bp: '54/30', skin: 'mottled', look: 'Unresponsive \u00b7 mottled' }, q: 'Next?', opts: [
          { t: 'Start CPR, then epinephrine 0.01 mg/kg IV/IO', ok: true },
          { t: 'Atropine first; start CPR only if the pulse is lost', why: 'CPR starts when HR is under 60 with poor perfusion despite oxygenation and ventilation, even with a pulse. Atropine can follow for a primary AV block.' },
          { t: 'Transcutaneous pacing first; CPR if capture fails', why: 'Pacing may help a complete AV block, but HR under 60 with poor perfusion needs CPR now. Do not delay compressions for pacing.' }
        ], teach: 'CPR if HR is under 60 with poor perfusion despite oxygenation and ventilation.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR + epinephrine', say: 'CPR running.', dur: 13, need: ['ivio', 'epi'], ok: ['atropine', 'bvm'], teach: 'Epinephrine 0.01 mg/kg IV/IO every 3\u20135 min for persistent bradycardia. Atropine 0.02 mg/kg may be added for a primary AV block.' },
        { k: 'Atropine', say: 'Pulse check: weak pulse, still complete heart block. Moaning, mottled.', set: { cpr: false, hr: 40, bp: '64/38', look: 'Moaning \u00b7 mottled' }, need: ['cpr', 'atropine'], ok: ['bvm'], why: { epi: 'Epinephrine went in a minute ago; the next dose is due in 3\u20135 min. For a primary AV block, add the other drug.', adenosine: '!Adenosine blocks AV conduction. Dangerous in heart block.', pace: 'Pacing is coming. First try the drug suited to a primary AV block.' }, msg: 'CPR resumed and atropine in. No real change.', after: { hr: 42 }, teach: 'HR still under 60 with poor perfusion: resume CPR. Atropine is indicated for a primary AV block or increased vagal tone.', t: 20 },
        { k: 'Pace', say: 'CPR continues. The bradycardia persists despite epinephrine and atropine.', need: ['pace'], why: { atropine: 'You may repeat atropine once, but it is not working. Move to the definitive fix.' }, msg: 'Pacing at 100/min with capture: a pulse with every spike. Compressions stop.', after: { cpr: false, rhythm: 'paced', hr: 100, bp: '92/56', skin: 'pale', look: 'Waking up' }, teach: 'Pacing (with sedation) for complete heart block or sinus node dysfunction that does not respond to drugs. Get expert consultation.', t: 14 },
        { type: 'end', say: 'Cardiology places a temporary transvenous pacing wire. She is talking again.' }
      ]
    },
    {
      id: 'apnea', title: 'Bronchiolitis Pause', group: 'Bradycardia', algo: 'brady', age: '6-week-old', wt: 4, kind: 'infant', diff: 2,
      place: 'Pediatric ward \u00b7 night shift',
      brief: 'A 6-week-old admitted with bronchiolitis has had short breathing pauses. Now the monitor alarms: she is pale and has stopped breathing.',
      flags: { leads: true },
      init: { monitor: true, rhythm: 'sbrady', hr: 74, pulse: true, spo2: 80, rr: 4, bp: '64/38', skin: 'grey', look: 'Breathing pause \u00b7 limp \u00b7 thick nasal secretions' },
      phases: [
        { k: 'Airway', say: 'She has stopped breathing. Thick secretions fill her nose.', need: ['position', 'suction'], ok: ['resp', 'o2'], why: { epi: 'Hypoxia is driving this. Airway and breathing first.', atropine: 'Hypoxia is driving this. Airway and breathing first.', cpr: 'She has a pulse. Open the airway and ventilate first; CPR if the heart rate stays under 60 with poor perfusion despite that.' }, msg: 'Airway open, nose and mouth suctioned. Still not breathing.', teach: 'Young infants breathe through the nose: secretions alone can block the airway. Position the head neutral and suction.', t: 12 },
        { k: 'Ventilate', say: 'Still not breathing. Her pulse feels slower.', set: { hr: 62 }, need: ['bvm'], ok: ['o2'], why: { cpr: 'She has a pulse. Ventilate with oxygen first and reassess in 30 seconds.', epi: 'Ventilate first: most infant bradycardia is hypoxic.', atropine: 'Ventilate first: most infant bradycardia is hypoxic.' }, msg: 'Bag-mask with 100% oxygen. The chest rises with each breath. Look at the monitor.', after: { rhythm: 'stach', hr: 150, spo2: 95, rr: 40, bp: '78/48', skin: 'pale', look: 'Breathing again \u00b7 pinking up' }, teach: 'Infant bradycardia: ventilate with oxygen first. The heart rate usually recovers within seconds.', t: 12 },
        { type: 'q', k: 'Why', say: 'Look at the monitor. She is pinking up.', q: 'Why did the heart rate recover?', opts: [
          { t: 'Ventilation reversed the hypoxia that was slowing her heart', ok: true },
          { t: 'Bagging triggered a reflex that speeds up the heart', why: 'Airway stimulation triggers vagal reflexes, which slow the heart. The rate rose because oxygen reached the heart muscle.' },
          { t: 'The slow rate was a monitor artifact from her movement', why: 'She was grey, apneic and had a slow pulse: real hypoxic bradycardia, which ventilation reversed.' }
        ], teach: 'Hypoxia is the most common cause of bradycardia in children. Oxygenation and ventilation come first.' },
        { k: 'Check', say: 'She is breathing on her own again, but she has not fed for hours.', need: ['glucose'], ok: ['o2', 'ivio'], why: { dextrose: 'Check first, then treat.' }, msg: 'Glucose 82 mg/dL.', teach: 'Check glucose in every sick infant.', t: 12 },
        { type: 'q', k: 'Plan', say: 'Twenty minutes later she has another short pause.', q: 'What does she need now?', opts: [
          { t: 'PICU: continuous monitoring and respiratory support', ok: true },
          { t: 'Hourly nebulized albuterol on the ward', why: 'Bronchodilators do not help bronchiolitis, and they do nothing for apnea. Recurrent apnea needs intensive care.' },
          { t: 'Discharge home with a home apnea monitor', why: 'A young infant with recurrent apnea needs intensive care, with high-flow, CPAP or ventilation ready.' }
        ], teach: 'Apnea in young infants with bronchiolitis (especially under 2 months): admit to intensive care.' },
        { type: 'end', say: 'She goes to the PICU on high-flow oxygen, with CPAP ready if the pauses continue.' }
      ]
    },
    {
      id: 'tube', title: 'Tube Trouble', group: 'Bradycardia', algo: 'brady', age: '4-year-old', wt: 16, kind: 'child', diff: 3,
      place: 'ED resus bay \u00b7 intubation in progress',
      brief: 'A 4-year-old with severe pneumonia is being intubated. She is sedated, monitored and has an IV. The first attempt failed; the second is under way.',
      flags: { leads: true, io: true },
      init: { monitor: true, rhythm: 'nsr', hr: 120, pulse: true, spo2: 96, rr: 0, bp: '96/60', skin: 'pink', look: 'Sedated \u00b7 laryngoscope in' },
      phases: [
        { k: 'Stop', say: 'The laryngoscope is in. The pulse oximeter tone suddenly drops in pitch and slows.', set: { rhythm: 'sbrady', hr: 48, spo2: 90, bp: '70/40', skin: 'pale' }, need: ['bvm'], ok: ['o2'], why: { airway: 'Stop this attempt: the heart rate is falling. Oxygenate first and try again later.', atropine: 'First take the blade out and oxygenate. Then decide on a drug.', cpr: 'She has a pulse and you have just removed the trigger. Ventilate with oxygen first; CPR if the heart rate stays under 60 with poor perfusion.' }, msg: 'Blade out. Bag-mask with 100% oxygen.', after: { spo2: 97 }, teach: 'Any fall in heart rate or saturation during laryngoscopy: stop, take the blade out, ventilate with oxygen.', t: 10 },
        { type: 'q', k: 'Cause', say: 'Her oxygen is back up but her pulse is still slow and weak. Look at the monitor.', q: 'What most likely caused this?', opts: [
          { t: 'Vagal stimulation from the laryngoscope', ok: true },
          { t: 'Hypoxia from the long intubation attempt', why: 'Hypoxia is the most common cause, but her saturation is normal again and the rate is still slow. Laryngoscopy is a strong vagal trigger.' },
          { t: 'Complete heart block caused by the sedative', why: 'There is a P wave before every QRS: this is sinus bradycardia. Sedatives do not cause complete heart block.' }
        ], teach: 'Bradycardia during laryngoscopy or suctioning: think vagal stimulation, as well as hypoxia.' },
        { k: 'Drug', say: 'Vagal bradycardia, still poorly perfused despite good oxygenation.', need: ['atropine'], ok: ['bvm', 'o2'], why: { epi: 'Epinephrine is first-line for bradycardia from hypoxia or ischemia. For a vagal cause, atropine is the drug.', adenosine: '!Adenosine blocks the AV node: dangerous in bradycardia.', cpr: 'She is oxygenated and has a pulse. Give the drug for vagal bradycardia; start CPR if the heart rate stays under 60 with poor perfusion.' }, msg: 'Atropine in. The heart rate climbs. Look at the monitor.', after: { rhythm: 'stach', hr: 132, bp: '98/62', skin: 'pink' }, teach: 'Atropine 0.02 mg/kg IV/IO (max single dose 0.5 mg) for bradycardia from vagal tone or a primary AV block. It may be repeated once.', t: 14 },
        { type: 'q', k: 'Next attempt', say: 'Stable again. The team prepares for another attempt.', q: 'What lowers the risk on the next attempt?', opts: [
          { t: 'Full preoxygenation, atropine ready, most experienced operator', ok: true },
          { t: 'A shorter preoxygenation, so that the attempt starts sooner', why: 'Preoxygenation buys time before the saturation falls. Never shorten it.' },
          { t: 'A longer attempt, keeping the blade in until the tube passes', why: 'Stop any attempt that drops the heart rate or saturation, and keep attempts short (about 30 seconds).' }
        ], teach: 'Safe intubation: preoxygenate, have atropine and suction ready, use the most experienced operator, stop if the heart rate or saturation falls.' },
        { k: 'Intubate', say: 'Second attempt, with the most experienced operator.', need: ['airway'], ok: ['bvm', 'o2'], msg: 'Tube in. Capnography shows a square waveform.', after: { etco2: 40, rr: 24, look: 'Intubated \u00b7 sedated' }, teach: 'Confirm the tube with waveform capnography and clinical signs.', t: 12 },
        { type: 'end', say: 'She goes to the PICU intubated and stable.' }
      ]
    },
    {
      id: 'svt', title: 'Racing Baby', group: 'Tachycardia', algo: 'tachy', age: '4-month-old', wt: 6, kind: 'infant', diff: 2,
      place: 'Emergency department',
      brief: 'Parents bring their 4-month-old: "He was fine this morning, then suddenly started breathing fast and won\'t feed."',
      init: { monitor: false, rhythm: 'svt', hr: 280, pulse: true, spo2: 96, rr: 50, bp: '78/50', skin: 'pale', look: 'Alert \u00b7 fussy \u00b7 CRT 2 s' },
      phases: [
        { k: 'Monitor', say: 'He is fussy but alert. The pulse is too fast to count.', need: ['pads'], ok: ['o2', 'ivio', 'ecg12'], why: { vagal: 'Monitor first: identify the rhythm before treating it. A vagal maneuver comes once you have confirmed stable SVT.', adenosine: 'Monitor first: identify the rhythm before giving any drug. In stable SVT, a vagal maneuver comes before adenosine.' }, msg: 'Monitor on: narrow-complex tachycardia at 280.', t: 12 },
        { type: 'q', k: 'Rhythm', say: 'Narrow QRS, rate 280, no visible P waves, no beat-to-beat variation. Abrupt onset.', q: 'Rhythm?', opts: [
          { t: 'Supraventricular tachycardia (SVT)', ok: true },
          { t: 'Sinus tachycardia (compensatory)', why: 'Infant sinus tachycardia is usually under 220, with visible P waves and a rate that varies. This is fixed at 280 with abrupt onset.' },
          { t: 'Ventricular tachycardia, monomorphic', why: 'The QRS is narrow (0.09 s or less). VT is a wide-complex rhythm.' },
          { t: 'Atrial fibrillation with rapid rate', why: 'Atrial fibrillation is irregularly irregular. This rhythm is regular with no beat-to-beat variation.' }
        ], teach: 'SVT: infant 220 or more, child 180 or more, absent or abnormal P waves, fixed rate, abrupt onset.' },
        { type: 'q', k: 'Stable?', say: 'Alert, CRT 2 s, pink lips. Look at the monitor.', q: 'Is there cardiopulmonary compromise?', opts: [
          { t: 'No: start with vagal maneuvers', ok: true },
          { t: 'Yes: synchronized cardioversion', why: 'Compromise means hypotension, acutely altered mental status or signs of shock. He has none, so start with vagal maneuvers.' }
        ], teach: 'Compromise = hypotension, acutely altered mental status, or signs of shock.' },
        { k: 'Vagal', say: 'Stable SVT.', need: ['vagal'], ok: ['ivio', 'o2', 'ecg12'], why: { adenosine: 'Soon, but in a stable infant try a vagal maneuver first, while getting access.', sync: 'He is stable. No shock needed.' }, msg: 'Ice-water bag on the face for 15 seconds. Still SVT.', teach: 'Infants: ice to the face. No carotid massage, no pressure on the eyes. Older children: Valsalva, blowing through a straw.', t: 14 },
        { k: 'Adenosine 1', say: 'The vagal maneuver failed.', need: ['ivio', 'adenosine'], why: { amio: 'Adenosine first for SVT.', sync: 'He is not unstable. No shock yet.', vagal: 'The vagal maneuver already failed. Do not delay adenosine with repeated attempts.' }, msg: 'Rapid push and flush\u2026 a brief pause\u2026 SVT returns.', flash: { rhythm: 'asystole', ms: 2200 }, teach: 'Adenosine 0.1 mg/kg (max 6 mg) as a rapid push with an immediate saline flush. Run a rhythm strip.', t: 20 },
        { k: 'Adenosine 2', say: 'Back in SVT at 280.', need: ['adenosine'], why: { vagal: 'Vagal maneuvers already failed. Give the second adenosine dose now.', amio: 'Give the second, larger adenosine dose (0.2 mg/kg) first. Amiodarone or procainamide only with expert consultation if adenosine fails.', sync: 'He is stable. Give the second adenosine dose first.' }, msg: 'Rapid push and flush\u2026 pause\u2026 sinus rhythm at 150!', flash: { rhythm: 'asystole', ms: 2000 }, after: { rhythm: 'nsr', hr: 150, look: 'Calm \u00b7 feeding' }, teach: 'Second dose: 0.2 mg/kg (max 12 mg).', t: 16 },
        { type: 'q', k: 'What if', say: 'Converted. One more question.', q: 'If he had been lethargic and hypotensive, what would you have done?', opts: [
          { t: 'Synchronized cardioversion 0.5\u20131 J/kg, then 2 J/kg', ok: true },
          { t: 'Defibrillation (unsynchronized) 2 J/kg, then 4 J/kg', why: 'He has a pulse. Use synchronized cardioversion at 0.5\u20131 J/kg, then 2 J/kg.' },
          { t: 'Amiodarone 5 mg/kg IV over 20 min, then reassess', why: 'Unstable SVT needs synchronized cardioversion without delay. Adenosine only if IV access is ready and it causes no delay.' }
        ], teach: 'Unstable SVT: synchronized cardioversion 0.5\u20131 J/kg, then 2 J/kg. Sedate if possible, but do not delay.' },
        { type: 'end', say: 'He feeds, falls asleep, and cardiology reviews his ECG.' }
      ]
    },
    {
      id: 'recess', title: 'Pale at Recess', group: 'Tachycardia', algo: 'tachy', age: '8-year-old', wt: 25, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: 'An 8-year-old with known WPW was brought from school with a racing heart. EMS already placed an IV. He is getting harder to wake.',
      flags: { io: true },
      init: { monitor: false, rhythm: 'svt', hr: 250, pulse: true, spo2: 93, rr: 30, bp: '68/40', skin: 'pale', look: 'Drowsy \u00b7 cool hands \u00b7 CRT 4 s' },
      phases: [
        { k: 'Monitor', say: 'Racing pulse, drowsy, cool hands.', need: ['pads', 'o2'], ok: ['ecg12'], why: { sync: 'Pads and monitor first: you cannot synchronize until the pads are on and the rhythm is on the screen.', adenosine: 'Monitor first: confirm a narrow, regular tachycardia before adenosine.' }, msg: 'Narrow-complex tachycardia at 250.', t: 12 },
        { type: 'q', k: 'Compromise?', say: 'Narrow QRS, very fast. Drowsy, cool hands. Look at the monitor.', q: 'Stable or unstable?', opts: [
          { t: 'Unstable: hypotension and altered mental status', ok: true },
          { t: 'Stable: that BP is still normal for an 8-year-old', why: 'Lower limit at 8 years: 70 + 2\u00d78 = 86 mmHg systolic. 68 is hypotensive, and drowsiness is altered mental status.' }
        ], teach: 'Hypotension, age 1\u201310: systolic under 70 + (2 \u00d7 age in years).' },
        { k: 'Cardiovert', say: 'Unstable SVT. Pads on, IV in.', need: ['sync'], ok: ['adenosine', 'vagal'], why: { shock: '!He has a pulse. An unsynchronized shock can trigger VF. Use SYNC.' }, msg: 'Synchronized shock delivered. Still SVT.', teach: 'Synchronized cardioversion 0.5\u20131 J/kg. Sedate if possible, but do not delay. While you prepare, a vagal maneuver or adenosine (IV ready) is fine if it causes no delay.', t: 16 },
        { k: 'Escalate', say: 'No change after the first synchronized shock.', need: ['sync'], ok: ['adenosine', 'vagal'], why: { shock: '!He still has a pulse. Keep SYNC on.' }, msg: 'Synchronized shock: sinus rhythm at 110!', flash: { rhythm: 'asystole', ms: 1200 }, after: { rhythm: 'nsr', hr: 110, bp: '96/60', look: 'Waking up' }, teach: 'If not effective, increase to 2 J/kg.', t: 14 },
        { type: 'end', say: 'He wakes up asking for his backpack. Cardiology will plan an ablation.' }
      ]
    },
    {
      id: 'teen', title: 'Wide and Fast', group: 'Tachycardia', algo: 'tachy', age: '12-year-old', wt: 40, kind: 'teen', diff: 3,
      place: 'Emergency department',
      brief: 'A 12-year-old who had myocarditis last year comes in with palpitations. She is alert, talking, and a little pale.',
      init: { monitor: false, rhythm: 'vt', hr: 200, pulse: true, spo2: 96, rr: 22, bp: '104/66', skin: 'pale', look: 'Alert \u00b7 anxious \u00b7 CRT 2 s' },
      phases: [
        { k: 'Workup', say: 'Fast regular pulse. She is talking to you.', need: ['pads', 'ecg12'], ok: ['o2', 'ivio'], why: { adenosine: 'Define the rhythm first with the monitor and a 12-lead. Adenosine is considered only for a regular, monomorphic wide-complex tachycardia, with expert input.' }, msg: 'Regular wide-complex tachycardia. QRS 0.14 s, rate 200, monomorphic.', t: 16 },
        { type: 'q', k: 'Rhythm', say: 'Wide QRS (0.14 s), regular, rate 200.', q: 'Working diagnosis?', opts: [
          { t: 'Ventricular tachycardia (VT)', ok: true },
          { t: 'SVT with aberrant conduction', why: 'Aberrancy is uncommon in children. A wide-QRS tachycardia is treated as VT until proven otherwise.' },
          { t: 'Sinus tachycardia, wide QRS', why: 'A fixed, regular rate of 200 is not sinus. Assume VT until proven otherwise.' }
        ], teach: 'Wide QRS (over 0.09 s) tachycardia = VT until proven otherwise.' },
        { type: 'q', k: 'Stable VT', say: 'Alert and talking, CRT 2 s.', q: 'She is stable. Plan?', opts: [
          { t: 'Expert consult; adenosine if regular and monomorphic; then amiodarone or procainamide', ok: true },
          { t: 'Unsynchronized shock at 2 J/kg, then an amiodarone load of 5 mg/kg over 20\u201360 min', why: 'She has a pulse and is stable. An unsynchronized shock is only for pulseless VT or VF.' },
          { t: 'Amiodarone 5 mg/kg plus procainamide 15 mg/kg, run together over 30\u201360 minutes', why: 'Do not routinely combine amiodarone and procainamide: both prolong QT and cause hypotension. Choose one, with expert consultation.' }
        ], teach: 'Stable wide-complex tachycardia: expert consultation, antiarrhythmic infused slowly.' },
        { k: 'Antiarrhythmic', say: 'Cardiology on the phone agrees: start an antiarrhythmic.', need: ['ivio', ['amio', 'procain']], ok: ['adenosine', 'o2'], msg: 'Infusion running.', teach: 'Adenosine may be tried first if the rhythm is regular and monomorphic. Then amiodarone 5 mg/kg over 20\u201360 min, or procainamide 15 mg/kg over 30\u201360 min. Never both routinely.', t: 22 },
        { type: 'q', k: 'Deteriorates', say: 'Ten minutes in she turns grey and confused. Still VT with a pulse.', set: { bp: '70/40', skin: 'grey', look: 'Confused \u00b7 grey \u00b7 CRT 5 s', spo2: 91 }, q: 'What changed?', opts: [
          { t: 'Unstable VT with a pulse: synchronized cardioversion', ok: true },
          { t: 'Pulseless VT: unsynchronized defibrillation at 2 J/kg', why: 'She still has a pulse. Use synchronized cardioversion (0.5\u20131 J/kg, then 2 J/kg).' },
          { t: 'Stable VT: complete the antiarrhythmic infusion first', why: 'Grey, confused and BP 70/40 is cardiopulmonary compromise. Cardiovert now rather than waiting for the drug.' }
        ], teach: 'Any tachycardia with a pulse plus compromise: synchronized cardioversion.' },
        { k: 'Sync 1', say: 'Unstable VT with a pulse.', need: ['sync'], ok: ['o2', 'adenosine'], why: { shock: '!She has a pulse: synchronized, not unsynchronized.' }, msg: 'Synchronized shock. Still VT.', teach: 'Unstable VT with a pulse: synchronized cardioversion 0.5\u20131 J/kg.', t: 14 },
        { k: 'Sync 2', say: 'No change.', need: ['sync'], ok: ['o2', 'adenosine'], msg: 'Shock delivered\u2026 the rhythm degenerates. No pulse!', after: { rhythm: 'vf', pulse: false, hr: 0, bp: null, spo2: null, alarm: true, look: 'Unresponsive \u00b7 no pulse' }, teach: 'Escalate synchronized cardioversion to 2 J/kg.', t: 12 },
        { type: 'q', k: 'SYNC trap', say: 'VF on the monitor. The defibrillator is still in SYNC mode.', q: 'What happens if you press shock now?', opts: [
          { t: 'It may not fire: no R waves to sync to. Turn SYNC off and shock', ok: true },
          { t: 'It fires normally: SYNC only delays it slightly. Shock as is', why: 'In VF there are no R waves to sync to, so many devices will not discharge. Turn SYNC off, then defibrillate.' },
          { t: 'It fires at reduced energy. Raise the energy and keep SYNC on', why: 'You set the energy and SYNC does not lower it. The problem is the device waiting for an R wave: turn SYNC off.' }
        ], teach: 'Moving from cardioversion to defibrillation: turn SYNC off.' },
        { k: 'Defibrillate', say: 'SYNC off. VF.', need: ['shock'], ok: ['cpr'], why: { sync: '!SYNC mode will not fire in VF.' }, msg: 'Shock delivered.', teach: 'VF/pulseless VT: 2 J/kg, unsynchronized.', t: 10 },
        { k: 'CPR', say: 'The shock is done.', need: ['cpr'], why: { check: 'Resume CPR immediately. No pulse check right after a shock.', rhythm: 'CPR first: 2 minutes before the next rhythm check.' }, msg: 'Compressions running.', t: 8 },
        { type: 'cycle', k: 'CPR', say: 'Two minutes of CPR.', dur: 9, need: [], ok: ['bvm'] },
        { k: 'Rhythm check', say: 'Rhythm check: organized complexes at 96.', set: { cpr: false, rhythm: 'nsr', hr: 96, alarm: false }, need: [['check', 'rhythm']], why: { shock: '!Organized rhythm. Check for a pulse instead.' }, msg: 'Pulse present! Check the BP on the monitor.', after: { pulse: true, bp: '90/54', spo2: 94, skin: 'pale', look: 'Moaning' }, t: 10 },
        { type: 'end', say: 'ROSC. She goes to the PICU with cardiology on board.' }
      ]
    },
    {
      id: 'fever', title: 'Hot and Fast', group: 'Tachycardia', algo: 'tachy', age: '18-month-old', wt: 11, kind: 'infant', diff: 1,
      place: 'Emergency department',
      brief: 'An 18-month-old with a day of high fever is fussy and pulling at her left ear. The triage nurse is worried about the heart rate.',
      init: { monitor: false, rhythm: 'stach', hr: 190, pulse: true, spo2: 97, rr: 40, bp: '94/56', skin: 'flushed', look: 'Fussy but consolable \u00b7 hot \u00b7 CRT 2 s \u00b7 40.1 \u00b0C' },
      phases: [
        { k: 'Monitor', say: 'Hot, fussy, fast pulse. She settles on her mother\u2019s lap.', need: ['pads'], ok: ['ecg12', 'o2', 'glucose'], why: { adenosine: 'Monitor first: identify the rhythm before any drug.', vagal: 'Monitor first: identify the rhythm before treating it.' }, msg: 'Narrow-complex tachycardia with a P wave before every QRS. The rate dips when she settles.', t: 12 },
        { type: 'q', k: 'Rhythm', say: 'Narrow QRS, a P wave before every QRS, a rate that falls when she settles and rises when she cries.', q: 'Rhythm?', opts: [
          { t: 'Sinus tachycardia from fever', ok: true },
          { t: 'Supraventricular tachycardia (SVT)', why: 'SVT in a toddler is usually 180\u2013220 or more, with no visible P waves and a fixed rate. P waves and a varying rate mean sinus tachycardia.' },
          { t: 'Atrial flutter with 2:1 block', why: 'Flutter gives a sawtooth baseline and a fixed rate. Here the P waves are normal and the rate varies.' }
        ], teach: 'Sinus tachycardia: P waves present, rate varies with activity, gradual onset, and a cause (fever, pain, fear, dehydration).' },
        { type: 'q', k: 'Treatment', say: 'Sinus tachycardia. Alert, CRT 2 s, warm hands.', q: 'What brings the heart rate down?', opts: [
          { t: 'Treat the fever, pain and thirst; recheck the rate', ok: true },
          { t: 'Adenosine 0.1 mg/kg rapid push to slow the rate', why: 'Adenosine does not convert sinus tachycardia: it causes a brief pause and the rate comes straight back. Treat the cause.' },
          { t: 'Synchronized cardioversion at 0.5 J/kg under sedation', why: 'Cardioversion does not treat sinus tachycardia and puts her at risk. Treat the cause.' }
        ], teach: 'Sinus tachycardia is a symptom. Treat the cause, not the rhythm.' },
        { k: 'Source', say: 'Find the source of the fever.', need: ['auscult'], ok: ['glucose', 'ecg12'], msg: 'Chest clear. Throat red. Left eardrum red and bulging.', teach: 'Search for the source of fever: ears, throat, chest, urine, skin, meninges.', t: 12 },
        { type: 'end', set: { hr: 140 }, say: 'After an antipyretic and a drink, her heart rate settles. She goes home with treatment for an ear infection.' }
      ]
    },
    {
      id: 'peanut', title: 'Peanut Panic', group: 'Shock', algo: 'shock', age: '6-year-old', wt: 20, kind: 'child', diff: 2,
      place: 'School nurse office, then ED',
      brief: 'A 6-year-old ate a cookie at a birthday party. Ten minutes later: hives, swollen lips, noisy breathing, and he says he feels "weird".',
      init: { monitor: false, rhythm: 'stach', hr: 160, pulse: true, spo2: 91, rr: 36, bp: '72/40', skin: 'flushed', look: 'Hives \u00b7 swollen lips \u00b7 stridor and wheeze' },
      phases: [
        { type: 'q', k: 'Recognize', say: 'Hives, lip swelling, stridor, wheeze, a fast weak pulse.', q: "What's going on?", opts: [
          { t: 'Anaphylaxis with distributive shock', ok: true },
          { t: 'Acute asthma exacerbation with hives', why: 'Wheeze plus hives, lip swelling, stridor and hypotension after a food exposure is anaphylaxis, not asthma.' },
          { t: 'Isolated angioedema, not anaphylaxis', why: 'Stridor, wheeze and hypotension mean more than one organ system is involved: this is anaphylaxis with shock.' }
        ], teach: 'Anaphylactic shock is a distributive shock: vessels dilate and leak.' },
        { k: 'First drug', say: 'Anaphylaxis.', need: ['epiim'], ok: ['o2', 'position', 'ems'], why: { epi: '!An IV bolus in a child with a pulse risks arrhythmias. Give IM epinephrine first.', antihist: 'Antihistamines are adjuncts. They do not treat airway swelling or shock. IM epinephrine first.', albuterol: 'Albuterol helps the wheeze, not the shock or the swelling. IM epinephrine first.', dexa: 'Steroids are slow adjuncts. IM epinephrine first.', fluid: 'Fluids will be needed, but IM epinephrine comes first.', nebepi: 'Nebulized epinephrine may ease the lip and airway swelling, but it does not treat the shock. IM epinephrine first.' }, msg: 'IM epinephrine into the lateral thigh. The stridor settles.', after: { look: 'Hives \u00b7 lips less swollen \u00b7 no stridor \u00b7 wheeze' }, teach: 'IM epinephrine 0.01 mg/kg (1 mg/mL, max 0.5 mg) into the lateral thigh is the first and most important treatment. Repeat every 5\u201315 minutes as needed.', t: 12 },
        { k: 'Support', say: 'Epinephrine is in. Next: support and access.', need: ['o2', 'pads', 'ivio'], ok: ['position', 'fluid'], why: { epiim: 'The first dose went in a minute ago. Repeat IM epinephrine every 5\u201315 minutes if shock or airway swelling persist or come back.' }, msg: 'O2 on, monitor on, IV in.', after: { spo2: 96 }, t: 18 },
        { k: 'Volume', say: 'The stridor is gone. Look at the monitor.', set: { bp: '76/44', hr: 150 }, need: ['fluid'], why: { epiim: 'He is responding to the first dose (HR falling, BP rising). Now give volume for the leak; repeat IM epinephrine if he worsens or has not improved 5\u201315 minutes after the first dose.', albuterol: 'The wheeze is next, but he is still hypotensive: volume first.' }, msg: 'Bolus running. Watch for crackles: the capillaries are leaky.', after: { bp: '86/52' }, teach: 'Isotonic fluid 20 mL/kg, given with care: leaky capillaries make pulmonary edema likely.', t: 16 },
        { k: 'Wheeze', say: 'Pulses are stronger. Still wheezing.', need: ['albuterol'], ok: ['antihist', 'dexa'], why: { epiim: 'The first dose is working: BP is back in the normal range. Repeat IM epinephrine if shock or airway swelling return.' }, msg: 'Albuterol nebulizer running. The wheeze eases.', teach: 'Albuterol for bronchospasm. Antihistamines and steroids are adjuncts.', t: 14 },
        { type: 'q', k: 'Relapse', say: 'Ten minutes later the stridor returns, he turns pale and his pulse weakens.', set: { bp: '72/40', skin: 'pale', look: 'Stridor again \u00b7 pale' }, q: 'Next?', opts: [
          { t: 'Second dose of IM epinephrine 0.01 mg/kg', ok: true },
          { t: 'IV epinephrine bolus of 0.01 mg/kg', why: 'That is the arrest dose. An IV bolus in a child with a pulse risks arrhythmias and severe hypertension. Repeat IM; if refractory, start an infusion.' },
          { t: 'IV diphenhydramine and methylprednisolone', why: 'Antihistamines and steroids are adjuncts: they do not reverse shock or airway swelling, and steroids take hours. Repeat IM epinephrine.' }
        ], teach: 'Repeat IM epinephrine every 5\u201315 minutes as needed. Shock that persists despite IM doses and fluid needs an epinephrine infusion, with PICU help.' },
        { type: 'end', say: 'The second IM dose works. He is admitted for observation: reactions can return hours later.' }
      ]
    },
    {
      id: 'sepsis', title: 'Febrile and Floppy', group: 'Shock', algo: 'shock', age: '8-month-old', wt: 8, kind: 'infant', diff: 3,
      place: 'Emergency department',
      brief: 'An 8-month-old with a day of fever is "not himself": floppy, not feeding, with cold hands despite a temperature of 39.8 \u00b0C.',
      flags: { leads: true },
      init: { monitor: true, rhythm: 'stach', hr: 190, pulse: true, spo2: 93, rr: 52, bp: '66/32', skin: 'mottled', look: 'Lethargic \u00b7 cold mottled legs \u00b7 CRT 5 s \u00b7 39.8 \u00b0C' },
      phases: [
        { type: 'q', k: 'Shock type', say: 'Fever, a racing heart, weak pulses, cold mottled skin, CRT 5 s, lethargic.', q: 'What kind of shock?', opts: [
          { t: 'Cold septic shock, hypotensive', ok: true },
          { t: 'Cold septic shock, still compensated', why: 'The infant lower limit is 70 mmHg systolic. 66 is hypotensive.' },
          { t: 'Cardiogenic shock, hypotensive', why: 'Fever, no cardiac history and cold mottled skin point to sepsis. Crackles or a big liver would make you reconsider.' }
        ], teach: 'Hypotension in infants (1\u201312 months): systolic under 70 mmHg.' },
        { k: 'Basics', say: 'Septic shock.', need: ['o2', 'pads', 'ivio'], ok: ['glucose', 'fluid', 'abx'], msg: 'O2 on, monitor on. IV failed twice, so an IO is in.', teach: 'Go to IO if IV access is not quick. Anything that goes in a vein can go in the bone.', t: 18 },
        { k: 'Bolus', say: 'IO in.', need: ['fluid'], ok: ['glucose', 'abx'], msg: '20 mL/kg pushed over 5\u201310 min.', after: { bp: '72/38', hr: 180 }, teach: 'Septic shock: isotonic crystalloid in 10\u201320 mL/kg boluses, each over 5\u201310 minutes, with reassessment after every bolus (stop if crackles or a big liver appear).', t: 14 },
        { k: 'Two urgent things', say: 'Bolus done. Two more time-critical steps.', need: ['glucose', 'abx'], ok: ['fluid'], why: { dextrose: 'Check the glucose before treating it.' }, msg: 'Antibiotics in. Glucose: 45 mg/dL.', teach: 'Antibiotics as soon as possible, within the first hour of septic shock (blood culture first only if it causes no delay). Check glucose in every sick child.', t: 18 },
        { k: 'Hypoglycemia', say: 'Glucose 45 mg/dL.', need: ['dextrose'], ok: ['fluid'], msg: 'Dextrose in. Recheck: 70 mg/dL.', teach: 'Hypoglycemia is 60 mg/dL or less. Dextrose 0.5\u20131 g/kg: D10W 5\u201310 mL/kg.', t: 14 },
        { type: 'q', k: 'Reassess', say: 'Before the next bolus you reassess.', q: 'What makes you stop pushing fluids?', opts: [
          { t: 'New crackles and an enlarging liver', ok: true },
          { t: 'Falling heart rate and a shorter CRT', why: 'A falling HR and faster CRT mean he is responding. Stop for overload signs: crackles, hepatomegaly, more work of breathing.' },
          { t: 'A cumulative total of 40 mL/kg given', why: 'There is no fixed volume cap. Reassess after each bolus and stop when overload signs appear.' }
        ], teach: 'Reassess after every bolus: HR, BP, CRT, mental status, urine, lungs, liver.' },
        { type: 'q', k: 'Refractory', say: 'After 60 mL/kg: still cold mottled extremities, CRT 5 s. Look at the monitor.', set: { bp: '64/30' }, q: 'Fluid-refractory cold shock. Which vasoactive?', opts: [
          { t: 'Epinephrine infusion', ok: true },
          { t: 'Milrinone infusion', why: 'Milrinone is an inodilator: it lowers the blood pressure further in an infant who is already hypotensive. Start epinephrine (or norepinephrine).' },
          { t: 'Another 20 mL/kg bolus', why: 'He has had 60 mL/kg and is still hypotensive and cold: the shock is fluid-refractory. Start a vasoactive infusion now; IV or IO is fine until there is a central line.' }
        ], teach: 'Fluid-refractory septic shock: start epinephrine or norepinephrine (PALS: either is reasonable) through the IV/IO without waiting for a central line. Epinephrine suits cold, low-output shock; norepinephrine suits warm, vasodilated shock. Consider stress-dose hydrocortisone if shock persists despite vasoactives.' },
        { type: 'end', set: { bp: '78/44' }, say: 'On an epinephrine infusion his perfusion improves. He goes to the PICU.' }
      ]
    },
    {
      id: 'crash', title: 'Seatbelt Sign', group: 'Shock', algo: 'shock', age: '14-year-old', wt: 50, kind: 'teen', diff: 3,
      place: 'Trauma bay',
      brief: 'A 14-year-old passenger from a car crash. Seatbelt bruise across the chest. More breathless by the minute.',
      init: { monitor: false, rhythm: 'stach', hr: 150, pulse: true, spo2: 85, rr: 40, bp: '80/50', skin: 'pale', look: 'Agitated \u00b7 neck veins distended' },
      phases: [
        { k: 'Basics', say: 'Fast breathing, distended neck veins.', need: ['o2', 'pads'], ok: ['ivio', 'auscult'], why: { needle: 'Examine the chest first: trachea, breath sounds, percussion. It takes seconds and confirms the side.', fluid: 'Wait: distended neck veins mean this is not simple blood loss. Examine the chest first.' }, msg: 'High-flow oxygen, monitor on.', t: 12 },
        { k: 'Examine', say: 'Still struggling to breathe on oxygen.', need: ['auscult'], ok: ['ivio'], why: { fluid: 'Find out why first. The exam takes 10 seconds.', airway: 'Look at the chest first.', needle: 'Examine first: it takes seconds and tells you which side to decompress.' }, msg: 'Trachea deviated to the left. No breath sounds on the right. Right chest hyper-resonant.', teach: 'Look, listen, feel: tracheal position, breath sounds, percussion, neck veins.', t: 14 },
        { type: 'q', k: 'Diagnosis', say: 'Trachea pushed left, absent right breath sounds, distended neck veins, hypotension.', q: 'Diagnosis?', opts: [
          { t: 'Tension pneumothorax', ok: true },
          { t: 'Cardiac tamponade', why: 'Tamponade gives muffled heart sounds and pulsus paradoxus, with equal breath sounds and a midline trachea.' },
          { t: 'Massive hemothorax', why: 'A massive hemothorax also silences one side, but blood loss flattens the neck veins and the chest is dull. Distended veins with tracheal shift = tension pneumothorax.' }
        ], teach: 'Tension pneumothorax is a clinical diagnosis. Do not wait for an X-ray.' },
        { k: 'Decompress', say: 'Tension pneumothorax.', need: ['needle'], why: { fluid: 'Fluids will not fix an obstruction. Decompress.', airway: 'Positive pressure can make a tension worse. Decompress first.' }, msg: 'A hiss of air. He breathes more easily. Look at the monitor.', after: { spo2: 95, bp: '104/66', hr: 118, rr: 26, look: 'Calmer \u00b7 color returning' }, teach: 'Needle decompression on the affected side (2nd intercostal space, mid-clavicular line; in teens the 4th\u20135th space just anterior to the mid-axillary line is an alternative), then a chest tube.', t: 12 },
        { k: 'Next', say: 'Stabilizing.', need: ['ivio'], ok: ['fluid'], why: { needle: 'Already decompressed and improving. Next comes a chest tube; repeat the needle only if signs of tension return.' }, msg: 'Two large-bore IVs in.', teach: 'Trauma: look for bleeding too. Crystalloid 20 mL/kg boluses; if hemorrhagic shock persists after 20\u201340 mL/kg, give blood early (PRBC 10 mL/kg) rather than more crystalloid.', t: 12 },
        { type: 'end', say: 'Chest tube placed. He goes to CT for the rest of the trauma survey.' }
      ]
    },
    {
      id: 'tummy', title: 'Tummy Bug', group: 'Shock', algo: 'shock', age: '3-year-old', wt: 15, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: 'A 3-year-old with two days of vomiting and diarrhea. Sleepy, dry lips, no wet diaper since last night.',
      init: { monitor: false, rhythm: 'stach', hr: 175, pulse: true, spo2: 98, rr: 34, bp: '88/54', skin: 'pale', look: 'Sleepy \u00b7 dry lips \u00b7 cool hands \u00b7 CRT 4 s' },
      phases: [
        { k: 'Monitor', say: 'Fast heart rate.', need: ['pads'], ok: ['o2', 'ivio', 'glucose', 'fluid'], msg: 'Narrow-complex tachycardia with visible P waves. The rate varies when she is roused.', t: 12 },
        { type: 'q', k: 'Rhythm', say: 'Narrow QRS, P waves visible, a variable rate.', q: 'Rhythm?', opts: [
          { t: 'Sinus tachycardia: treat the cause', ok: true },
          { t: 'SVT: give adenosine 0.1 mg/kg rapid IV', why: 'Child SVT is usually 180 or more, with no P waves and a fixed rate. Here P waves are present and the rate varies.' }
        ], teach: 'Sinus tachycardia: treat the cause (fever, pain, hypovolemia), not the rhythm.' },
        { type: 'q', k: 'Shock?', say: 'Look at the monitor. CRT 4 s, cool hands, sleepy.', q: 'Shock status?', opts: [
          { t: 'Compensated hypovolemic shock', ok: true },
          { t: 'Decompensated hypovolemic shock', why: 'Lower limit at 3 years: 70 + 2\u00d73 = 76 mmHg. 88 is still normal, so the shock is compensated.' },
          { t: 'No shock: BP is normal for age', why: 'Tachycardia, slow CRT, cool skin and drowsiness mean shock, even with a normal BP.' }
        ], teach: 'Children compensate: blood pressure stays normal until late. Tachycardia and poor perfusion come first.' },
        { k: 'Volume', say: 'Compensated hypovolemic shock.', need: ['ivio', 'fluid'], ok: ['o2', 'glucose'], msg: '20 mL/kg of normal saline running.', after: { hr: 150, bp: '92/58', look: 'Sleepy \u00b7 dry lips \u00b7 cool hands \u00b7 CRT 3 s' }, teach: 'Isotonic crystalloid (NS or LR) 20 mL/kg over 5\u201310 min; reassess after each bolus and repeat as needed.', t: 18 },
        { k: 'Sugar', say: 'Bolus done. Still sleepy.', need: ['glucose'], ok: ['fluid'], why: { dextrose: 'Check first, then treat.' }, msg: 'Glucose 52 mg/dL.', t: 12 },
        { k: 'Treat', say: 'Glucose 52 mg/dL.', need: ['dextrose'], ok: ['fluid'], msg: 'Dextrose in. She wakes up and asks for juice.', after: { hr: 132, bp: '96/60', look: 'Awake \u00b7 CRT 2 s', skin: 'pink' }, teach: 'Hypoglycemia is 60 mg/dL or less: give dextrose 0.5\u20131 g/kg (D10W 5\u201310 mL/kg), then recheck.', t: 14 },
        { type: 'q', k: 'Endpoint', say: 'Looking better.', q: 'Which urine output shows adequate perfusion for her?', opts: [
          { t: '1 mL/kg per hour or more', ok: true },
          { t: '0.5 mL/kg per hour or more', why: '0.5 mL/kg/h is the adolescent and adult target. In infants and young children aim for 1 mL/kg/h or more.' },
          { t: '2 mL/kg per day or more', why: 'That is per day, not per hour: under 0.1 mL/kg/h, close to anuria. Target 1 mL/kg/h or more.' }
        ], teach: 'Shock goals: normal HR and BP for age, CRT under 2 s, normal mental status, urine 1 mL/kg/h or more.' },
        { type: 'end', say: 'Rehydrated and drinking. She goes to the ward.' }
      ]
    },
    {
      id: 'heart', title: 'Tired Heart', group: 'Shock', algo: 'shock', age: '5-year-old', wt: 18, kind: 'child', diff: 3,
      place: 'Emergency department',
      brief: 'A 5-year-old had a cold last week. Now she is breathless, pale and vomiting, and could not climb the stairs at home.',
      init: { monitor: false, rhythm: 'stach', hr: 170, pulse: true, spo2: 91, rr: 48, bp: '82/64', skin: 'grey', look: 'Grunting \u00b7 cool clammy hands \u00b7 CRT 4 s' },
      phases: [
        { k: 'Basics', say: 'Grunting, fast breathing, cool hands.', need: ['o2', 'pads'], ok: ['ivio', 'ecg12', 'auscult', 'glucose'], why: { fluid: 'Not yet: get the basics on and examine her before deciding on fluid.', vaso: 'An inotrope may well be needed, but first get the basics on and examine her.' }, msg: 'Oxygen on, monitor on. Narrow-complex tachycardia with P waves.', t: 14 },
        { k: 'Examine', say: 'Still grunting on oxygen. Before any fluid, examine her.', need: ['auscult'], ok: ['ivio', 'glucose', 'ecg12'], why: { fluid: '!Examine first. If the heart is failing, a big bolus can push her into pulmonary edema.', vaso: 'Examine first: the exam tells you whether this is a failing pump.' }, msg: 'Crackles at both bases, trachea midline. A gallop rhythm. Liver edge 4 cm below the ribs. Neck veins full.', teach: 'In shock, look for signs of a failing heart before giving fluid: crackles, gallop, big liver, distended neck veins.', t: 14 },
        { type: 'q', k: 'Shock type', say: 'Grunting, crackles, gallop, big liver, cool skin, no fever, after a viral illness.', q: 'What kind of shock?', opts: [
          { t: 'Cardiogenic shock (myocarditis)', ok: true },
          { t: 'Hypovolemic shock (vomiting)', why: 'Vomiting fits, but crackles, a big liver and full neck veins mean fluid in the wrong place, not too little fluid.' },
          { t: 'Septic shock (viral sepsis)', why: 'There is no fever, and crackles, hepatomegaly and a gallop point to a failing pump rather than vasodilation or leak.' },
          { t: 'Obstructive shock (tension pneumothorax)', why: 'Breath sounds are equal and the trachea is midline. Bilateral crackles and a gallop point to a weak heart muscle.' }
        ], teach: 'Cardiogenic vs hypovolemic: both breathe fast, but cardiogenic shock has a much higher work of breathing (grunting, flaring), crackles, a big liver and distended neck veins.' },
        { k: 'Careful volume', say: 'Cardiogenic shock. She has vomited all day and barely drunk, so she may also be low on volume: a cautious fluid trial is reasonable.', need: ['ivio', 'fluid'], dose: { fluid: 'fluidCard' }, ok: ['glucose', 'vaso'], msg: 'A small bolus runs slowly while you watch her lungs and liver.', after: { bp: '84/64', look: 'Grunting \u00b7 crackles unchanged' }, teach: 'Cardiogenic shock: if fluid is needed, 5\u201310 mL/kg over 10\u201320 minutes, then reassess. Never the standard fast 20 mL/kg.', t: 20 },
        { type: 'q', k: 'Reassess', say: 'After the small bolus: crackles unchanged, liver the same, still cool and grey.', q: 'Next step?', opts: [
          { t: 'Stop fluids; start an inotrope; call cardiology/PICU', ok: true },
          { t: 'Push another 20 mL/kg NS bolus, then recheck the BP', why: 'No response to the small bolus and persistent crackles mean the heart cannot handle more volume; more fluid worsens pulmonary edema. Support contractility instead.' },
          { t: 'Give adenosine 0.1 mg/kg rapid IV push for the tachycardia', why: 'This is sinus tachycardia (P waves, variable rate) compensating for a weak heart. Do not slow it down; support contractility.' }
        ], teach: 'Cardiogenic shock: support contractility with inotropes (for example epinephrine, dobutamine, milrinone) and get a pediatric cardiologist or intensivist early.' },
        { k: 'Support the pump', say: 'Start the inotrope.', need: ['vaso'], ok: ['ecg12', 'glucose'], why: { fluid: 'Her lungs are already wet. No more fluid now.' }, msg: 'Low-dose epinephrine infusion running. Cardiology is on the way.', after: { bp: '92/62', hr: 150, look: 'Less grunting \u00b7 CRT 3 s', skin: 'pale' }, teach: 'Watch for arrhythmias: myocarditis can cause VT or heart block.', t: 14 },
        { type: 'end', say: 'An echo shows a poorly squeezing heart. She goes to the PICU under cardiology.' }
      ]
    },
    {
      id: 'dka', title: 'Sweet Breath', group: 'Shock', algo: 'shock', age: '11-year-old', wt: 32, kind: 'child', diff: 3,
      place: 'Emergency department',
      brief: 'An 11-year-old has been drinking and urinating a lot for two weeks and has lost weight. Today she is vomiting, has belly pain and is drowsy.',
      init: { monitor: false, rhythm: 'stach', hr: 140, pulse: true, spo2: 98, rr: 34, bp: '104/64', skin: 'pale', look: 'Drowsy \u00b7 deep sighing breaths \u00b7 dry lips \u00b7 CRT 3 s' },
      phases: [
        { k: 'Basics', say: 'Drowsy, breathing deeply and fast, dry lips, a sweet smell on her breath.', need: ['pads', 'glucose'], ok: ['o2', 'ivio'], why: { dextrose: '!Check the glucose before giving any sugar.', fluid: 'Monitor and a glucose check first, then access and fluid.' }, msg: 'Monitor on. Glucose reads HI: over 500 mg/dL.', teach: 'Check glucose in every sick child.', t: 16 },
        { type: 'q', k: 'Breathing', say: 'Deep, sighing breaths, fruity breath, glucose over 500. The chest is clear.', q: 'Why is she breathing like this?', opts: [
          { t: 'To compensate for metabolic acidosis (DKA)', ok: true },
          { t: 'Because of lung tissue disease (pneumonia)', why: 'Her chest is clear and her saturation is normal. Deep, regular (Kussmaul) breathing blows off CO2 to offset the acidosis.' },
          { t: 'Because anxiety is making her hyperventilate', why: 'She is drowsy, not anxious, with very high glucose. This is Kussmaul breathing from diabetic ketoacidosis.' }
        ], teach: 'Kussmaul breathing: deep, regular breaths that compensate for metabolic acidosis.' },
        { type: 'q', k: 'Shock?', say: 'Fast pulse, CRT 3 s, cool hands. Look at the monitor.', q: 'Shock status?', opts: [
          { t: 'Compensated hypovolemic shock', ok: true },
          { t: 'Hypotensive hypovolemic shock', why: 'From 10 years the lower systolic limit is 90 mmHg. Hers is above that, so the shock is compensated.' },
          { t: 'No shock: her blood pressure is normal', why: 'Tachycardia, cool hands and slow CRT mean shock even with a normal blood pressure.' }
        ], teach: 'DKA causes hypovolemia from osmotic diuresis and vomiting.' },
        { k: 'Fluid', say: 'Compensated shock from DKA.', need: ['ivio', 'fluid'], ok: ['o2'], why: { dextrose: '!Her glucose is already over 500.', vaso: 'Volume first: this is fluid loss.' }, msg: 'Isotonic bolus running, then you reassess.', after: { hr: 124, look: 'Drowsy \u00b7 CRT 2 s' }, teach: 'DKA with shock: isotonic fluid 10\u201320 mL/kg, then reassess. Replace the rest of the deficit slowly, over 24\u201348 hours.', t: 18 },
        { type: 'q', k: 'Insulin', say: 'The bolus is in and her perfusion is better.', q: 'How should insulin be started?', opts: [
          { t: 'An infusion of 0.05\u20130.1 unit/kg/h after fluids, with no bolus', ok: true },
          { t: 'An IV bolus of 0.1 unit/kg, followed by the same infusion', why: 'An insulin bolus drops glucose and osmolality too fast and raises the risk of cerebral edema. Start the infusion without a bolus.' },
          { t: 'Subcutaneous insulin every 4 hours instead of an infusion', why: 'In DKA with shock, absorption from under the skin is unreliable. Use a low-dose IV infusion.' }
        ], teach: 'DKA insulin: IV infusion 0.05\u20130.1 unit/kg/h, no bolus, started after the first hour of fluids.' },
        { type: 'q', k: 'Headache', say: 'Four hours later she complains of a bad headache and becomes confused. Look at the monitor.', set: { rhythm: 'sbrady', hr: 58, bp: '136/88', look: 'Headache \u00b7 confused' }, q: 'What do you suspect?', opts: [
          { t: 'Cerebral edema: mannitol or hypertonic saline now', ok: true },
          { t: 'Fluid overload: give furosemide and restrict fluids', why: 'Headache and confusion with a falling heart rate and rising blood pressure (the Cushing response) mean cerebral edema. Treat it with hyperosmolar therapy now.' },
          { t: 'Hypoglycemia from insulin: give a dextrose bolus', why: 'Check the glucose, but a headache with a slowing heart rate and rising blood pressure means cerebral edema. Treat it now.' }
        ], teach: 'DKA cerebral edema: headache, confusion, slowing heart rate, rising blood pressure. Give mannitol 0.5\u20131 g/kg or 3% saline, raise the head and call the PICU.' },
        { type: 'end', set: { rhythm: 'nsr', hr: 96, bp: '112/70', look: 'Awake \u00b7 headache easing' }, say: 'Hypertonic saline works. She goes to the PICU and recovers fully.' }
      ]
    },
    {
      id: 'bike', title: 'Handlebar', group: 'Shock', algo: 'shock', age: '8-year-old', wt: 26, kind: 'child', diff: 2,
      place: 'Trauma bay',
      brief: 'An 8-year-old fell off his bike onto the handlebars an hour ago. He walked home, but now he is pale and holding the left side of his belly.',
      init: { monitor: false, rhythm: 'stach', hr: 160, pulse: true, spo2: 97, rr: 32, bp: '78/48', skin: 'pale', look: 'Pale \u00b7 anxious \u00b7 handlebar bruise on the upper belly \u00b7 CRT 4 s' },
      phases: [
        { k: 'Basics', say: 'Pale and anxious, holding his left side. A round bruise on his upper belly.', need: ['o2', 'pads'], ok: ['ivio', 'auscult'], why: { fluid: 'Get oxygen and the monitor on, then access.', vaso: '!Vasopressors do not replace lost blood.' }, msg: 'Oxygen on, monitor on.', teach: 'Trauma: airway, breathing, circulation, with control of any obvious bleeding.', t: 14 },
        { k: 'Access', say: 'Fast weak pulse, cool hands.', need: ['ivio'], ok: ['auscult', 'glucose'], msg: 'Two IVs in. Blood sent for crossmatch.', teach: 'Trauma with shock: two large-bore IVs, or IO if IV is not quick. Send a crossmatch early.', t: 14 },
        { type: 'q', k: 'Shock?', say: 'Look at the monitor. CRT 4 s, anxious. Chest clear, neck veins flat.', q: 'Shock type and severity?', opts: [
          { t: 'Hypotensive hemorrhagic shock', ok: true },
          { t: 'Compensated hemorrhagic shock', why: 'The lower limit at 8 years is 70 + 2\u00d78 = 86 mmHg. He is below it, so the shock is hypotensive.' },
          { t: 'Obstructive shock from chest trauma', why: 'Breath sounds are equal, neck veins are flat and the bruise is on the belly. This is blood loss.' }
        ], teach: 'A handlebar injury can tear the spleen, liver or bowel. Hypotension means a large blood loss.' },
        { k: 'Volume', say: 'Hypotensive hemorrhagic shock.', need: ['fluid'], ok: ['o2'], why: { vaso: '!Vasopressors do not replace lost blood.', epi: 'He has a pulse. Volume is the treatment.' }, msg: 'Warm isotonic crystalloid running.', after: { hr: 152, bp: '82/50' }, teach: 'Hemorrhagic shock: one 20 mL/kg isotonic crystalloid bolus, then reassess, and give blood early.', t: 14 },
        { type: 'q', k: 'Still shocked', say: 'After the bolus he is still pale and cool. Look at the monitor.', q: 'Next?', opts: [
          { t: 'Packed red cells 10 mL/kg and call the surgeon', ok: true },
          { t: 'Two more 20 mL/kg crystalloid boluses first', why: 'He has not responded to crystalloid. Give blood early: more crystalloid dilutes his clotting factors and red cells.' },
          { t: 'Start an epinephrine infusion for the pressure', why: 'Vasopressors do not replace lost blood. Give blood and get the bleeding stopped.' }
        ], teach: 'Hemorrhagic shock that persists after 20\u201340 mL/kg crystalloid: packed red cells 10 mL/kg, and surgical control.' },
        { type: 'end', set: { hr: 128, bp: '94/58' }, say: 'Blood is running. A CT shows a torn spleen. He goes to the PICU for close observation, with the surgeons involved.' }
      ]
    },
    {
      id: 'pills', title: "Grandma's Pills", group: 'Respiratory', algo: 'resp', age: '3-year-old', wt: 14, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: "A 3-year-old was found drowsy next to an open bottle of grandma's oxycodone. Breathing is slow and snoring.",
      init: { monitor: false, rhythm: 'nsr', hr: 88, pulse: true, spo2: 84, rr: 6, bp: '90/56', skin: 'cyan', look: 'Responds to pain only \u00b7 pinpoint pupils \u00b7 snoring' },
      phases: [
        { k: 'Airway', say: 'Snoring, slow breaths.', need: ['position'], ok: ['suction', 'o2'], why: { bvm: 'Open the airway first, then ventilate.', naloxone: 'Good thought, but airway and breathing come first. Open the airway.' }, msg: 'The snoring stops.', teach: 'Head-tilt chin-lift (jaw thrust if trauma). Suction secretions.', t: 10 },
        { k: 'Breathing', say: 'Airway open. Breathing slowly and shallowly, lips blue.', need: ['bvm'], ok: ['o2', 'pads'], why: { o2: 'Oxygen alone is not enough at a rate of 6. She needs assisted ventilation.', naloxone: 'Naloxone comes next, but she is hypoxic now. Ventilate first: bagging works at once, naloxone takes minutes.' }, msg: 'Bag-mask ventilation, 1 breath every 2\u20133 s. The chest rises with each breath.', after: { spo2: 94 }, teach: 'Ineffective breathing with a pulse: ventilate, 1 breath every 2\u20133 seconds.', t: 12 },
        { k: 'Antidote', say: 'Bagging continues. A CNS cause of respiratory failure.', need: ['naloxone'], ok: ['pads', 'ivio', 'glucose'], msg: 'Naloxone given.', after: { rr: 22, look: 'Waking \u00b7 crying', skin: 'pink', spo2: 97 }, teach: 'Naloxone 0.1 mg/kg if under 5 y or 20 kg or less, max 2 mg; 2 mg if older or heavier. IV, IO, IM or IN.', t: 14 },
        { type: 'q', k: 'Disposition', say: 'She wakes up crying and breathing on her own.', q: 'Plan?', opts: [
          { t: 'Keep on monitor: naloxone may wear off before the oxycodone', ok: true },
          { t: 'Discharge home: she is awake, crying and breathing normally', why: 'Naloxone is short-acting and oxycodone can outlast it, so breathing can slow again. Keep her monitored and re-dose naloxone if needed.' }
        ], teach: 'Respiratory failure from a CNS cause (overdose, head injury): support breathing, give antidotes.' },
        { type: 'end', say: 'She is observed overnight. Grandma buys a lockbox.' }
      ]
    },
    {
      id: 'croup', title: 'Barking Seal', group: 'Respiratory', algo: 'resp', age: '18-month-old', wt: 11, kind: 'infant', diff: 1,
      place: 'Emergency department \u00b7 2 a.m.',
      brief: 'An 18-month-old with a cold now has a barking cough and a harsh noise on every breath in, even sitting calmly.',
      init: { monitor: false, rhythm: 'stach', hr: 160, pulse: true, spo2: 93, rr: 44, bp: '92/58', skin: 'pale', look: "Stridor at rest \u00b7 retractions \u00b7 anxious on parent's lap" },
      phases: [
        { type: 'q', k: 'Category', say: 'Inspiratory stridor at rest, barking cough.', q: 'Where is the problem?', opts: [
          { t: 'Upper airway obstruction', ok: true },
          { t: 'Lower airway obstruction', why: 'Lower airway obstruction gives an expiratory wheeze. Inspiratory stridor and a barking cough mean the upper airway.' },
          { t: 'Lung tissue disease', why: 'Lung tissue disease gives grunting and crackles. Stridor means the upper airway.' }
        ], teach: 'Stridor: upper airway. Wheeze: lower airway. Grunting or crackles: lung tissue. Irregular or slow breathing: CNS.' },
        { k: 'Calm oxygen', say: 'Upper airway obstruction. Every touch upsets her.', need: ['o2'], ok: ['pads'], why: { nebepi: 'Right drug, but it is the next step. First get blow-by oxygen on calmly: she is hypoxemic (SpO2 93%).', dexa: 'Right drug, but it is the next step. First get blow-by oxygen on calmly: she is hypoxemic (SpO2 93%).', bvm: 'She is moving air. Bagging would upset her and worsen the obstruction.', airway: 'Not now. Agitation and instrumentation can worsen an upper airway obstruction.', suction: 'No secretions to clear. It would only upset her.' }, msg: "Blow-by oxygen on the parent's lap.", after: { spo2: 95 }, teach: 'Keep the child calm in a position of comfort. Agitation worsens upper airway obstruction.', t: 12 },
        { k: 'Treat', say: 'Blow-by oxygen is on. Still stridor at rest.', need: ['dexa', 'nebepi'], ok: ['pads'], why: { albuterol: 'Albuterol treats lower airway bronchospasm, not swelling below the vocal cords.', epiim: 'IM epinephrine is for anaphylaxis. Croup gets nebulized epinephrine.' }, msg: 'Dexamethasone given. Nebulized epinephrine running.', after: { look: 'Quiet breathing \u00b7 calm and alert', spo2: 97, rr: 30 }, teach: 'Croup: dexamethasone; nebulized epinephrine for moderate to severe; oxygen (heliox); intubate if failing.', t: 16 },
        { type: 'end', say: 'The stridor settles. She is observed for a few hours in case it comes back.' }
      ]
    },
    {
      id: 'wheeze', title: 'Silent Chest', group: 'Respiratory', algo: 'resp', age: '7-year-old', wt: 24, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: 'A 7-year-old with known asthma has used her inhaler every hour since lunch. Now she can only speak in single words.',
      init: { monitor: false, rhythm: 'stach', hr: 150, pulse: true, spo2: 88, rr: 44, bp: '112/70', skin: 'pale', look: 'Tripod position \u00b7 single words \u00b7 loud wheeze' },
      phases: [
        { type: 'q', k: 'Category', say: 'Expiratory wheeze, long expirations, sitting in a tripod position.', q: 'Where is the problem?', opts: [
          { t: 'Lower airway obstruction', ok: true },
          { t: 'Upper airway obstruction', why: 'Upper airway obstruction gives inspiratory stridor. An expiratory wheeze with long expirations means the lower airway.' },
          { t: 'Lung tissue disease', why: 'Grunting and crackles suggest lung tissue disease. This is a wheeze.' },
          { t: 'Disordered control of breathing', why: 'CNS problems give slow or irregular breathing. She is breathing fast and hard.' }
        ], teach: 'Stridor: upper airway. Wheeze: lower airway. Grunting or crackles: lung tissue. Slow or irregular: CNS.' },
        { k: 'First moves', say: 'Severe asthma attack. Fighting for every breath.', need: ['o2', 'albuterol'], ok: ['pads', 'ivio'], why: { airway: 'Not yet. Intubating an asthmatic is high risk. Start with oxygen and bronchodilators.', bvm: 'She is breathing on her own. Oxygen and bronchodilators first.', nebepi: 'Nebulized epinephrine is for upper airway swelling. Asthma gets albuterol.', dexa: 'Steroids come right after this. Oxygen and albuterol first: bronchodilators work in minutes, steroids take hours.' }, msg: 'Oxygen on. Albuterol with ipratropium nebulizing.', after: { spo2: 91 }, teach: 'Lower airway: oxygen, nebulized albuterol and ipratropium bromide, corticosteroids, magnesium sulfate if refractory.', t: 14 },
        { k: 'Steroid', say: 'Nebulizer running. What else goes in early?', need: ['dexa'], ok: ['pads', 'ivio', 'auscult', 'albuterol'], why: { abx: 'Nothing points to infection. Steroids treat the airway inflammation.', antihist: 'Antihistamines do not treat asthma.' }, msg: 'Corticosteroid given.', teach: 'Give corticosteroids early: they take hours to work.', t: 14 },
        { type: 'q', k: 'Danger sign', say: 'Twenty minutes later she is drowsy and her lips are blue. The wheeze has gone quiet.', set: { spo2: 86, rr: 20, skin: 'cyan', look: 'Drowsy \u00b7 almost silent chest' }, q: 'The wheeze has gone quiet. What does that mean?', opts: [
          { t: 'Worsening: so little air moves that failure is near', ok: true },
          { t: 'Improving: the bronchospasm is easing with treatment', why: 'A silent chest with drowsiness and falling SpO2 means almost no air movement. It is an ominous sign, not improvement.' },
          { t: 'Stable: she is sleeping off the exhaustion of the attack', why: 'Drowsiness in a child who was working hard to breathe, with SpO2 86%, means respiratory failure is near.' }
        ], teach: 'Respiratory failure signs: falling level of consciousness, a falling RR or effort, poor air movement, cyanosis.' },
        { k: 'Escalate', say: 'Respiratory failure is close. Get access and give the next drug.', need: ['ivio', 'mag'], ok: ['pads', 'albuterol', 'epiim', 'bvm'], why: { airway: 'Give the drugs first and call the most experienced airway provider. Intubation in asthma is a last resort.' }, msg: 'Magnesium sulfate running.', after: { spo2: 92, rr: 30, skin: 'pale', look: 'More alert \u00b7 wheeze louder again (air is moving)' }, teach: 'Refractory asthma: magnesium sulfate 20\u201350 mg/kg IV over 10\u201320 min (max 2 g). Subcutaneous epinephrine is another option.', t: 20 },
        { type: 'q', k: 'If she tires', say: 'She improves, but the team plans for the worst.', q: 'If she needs bag-mask ventilation, how do you bag an asthmatic?', opts: [
          { t: 'Slow rate, small breaths, long time to exhale', ok: true },
          { t: 'Fast rate, small breaths to wash out the CO2', why: 'Fast bagging traps air, drops the BP and can cause a pneumothorax. Use a slow rate and give time to exhale.' },
          { t: 'Slow rate, large breaths to open tight airways', why: 'Big breaths overinflate trapped lungs. Give just enough to see the chest rise, and allow full exhalation.' }
        ], teach: 'Bagging in asthma: small breaths, slow rate, long expiration. Sudden deterioration on the bag: think air trapping or pneumothorax.' },
        { type: 'end', say: 'She is admitted to the PICU on continuous albuterol and is talking in full sentences by morning.' }
      ]
    },
    {
      id: 'lungs', title: 'Grunting Toddler', group: 'Respiratory', algo: 'resp', age: '2-year-old', wt: 12, kind: 'child', diff: 2,
      place: 'Emergency department',
      brief: 'A 2-year-old with three days of high fever and cough. Now breathing fast, grunting with every breath, and refusing to drink.',
      init: { monitor: false, rhythm: 'stach', hr: 168, pulse: true, spo2: 87, rr: 56, bp: '94/58', skin: 'pale', look: 'Grunting \u00b7 nasal flaring \u00b7 retractions \u00b7 39.6 \u00b0C' },
      phases: [
        { type: 'q', k: 'Category', say: 'Grunting, crackles over the right lower chest, high fever. No stridor, no wheeze.', q: 'Where is the problem?', opts: [
          { t: 'Lung tissue disease', ok: true },
          { t: 'Lower airway obstruction', why: 'There is no wheeze. Grunting and focal crackles point to lung tissue.' },
          { t: 'Upper airway obstruction', why: 'There is no stridor or barking cough. Grunting and focal crackles point to lung tissue.' }
        ], teach: 'Grunting is the child trying to keep collapsing alveoli open: a sign of lung tissue disease such as pneumonia.' },
        { type: 'q', k: 'Distress or failure?', say: 'On room air: fast breathing, grunting, dusky lips, but alert and crying.', q: 'Respiratory distress or respiratory failure?', opts: [
          { t: 'Respiratory distress: give oxygen now, reassess often', ok: true },
          { t: 'Respiratory failure: begin bag-mask ventilation now', why: 'She is alert, crying and moving air. That is distress, not failure. Start oxygen and watch closely for signs of failure.' },
          { t: 'Mild distress: oral antibiotics and outpatient follow-up', why: 'Hypoxemia (SpO2 87%), grunting and a rate of 56 are serious. She needs oxygen and close monitoring in hospital.' }
        ], teach: 'Failure signs: very fast or too slow breathing, poor air movement, falling level of consciousness, cyanosis despite oxygen.' },
        { k: 'Oxygen', say: 'Respiratory distress with hypoxemia.', need: ['o2'], ok: ['pads', 'position', 'suction'], why: { bvm: 'She is breathing effectively. Start with oxygen.', airway: 'Not now. She is in distress, not failure.', albuterol: 'No wheeze. Albuterol treats bronchospasm.' }, msg: 'High-flow oxygen on.', after: { spo2: 92 }, teach: 'Respiratory distress: position of comfort, oxygen, monitor SpO2, suction secretions if needed.', t: 12 },
        { k: 'Treat the cause', say: 'Still grunting on oxygen. Febrile and dry.', need: ['ivio', 'abx'], ok: ['pads', 'glucose', 'fluid'], why: { dexa: 'Steroids are for croup, asthma and anaphylaxis, not pneumonia.', nebepi: 'Nebulized epinephrine is for upper airway swelling.' }, msg: 'IV in. Antibiotics running.', teach: 'Bacterial pneumonia: antibiotics. Common causes: Streptococcus pneumoniae, Mycoplasma, Haemophilus influenzae, Chlamydia.', t: 18 },
        { k: 'Tiring', say: 'An hour later she is limp and quiet, breathing slowly and shallowly, and blue despite high-flow oxygen.', set: { spo2: 82, rr: 14, hr: 180, skin: 'cyan', look: 'Limp \u00b7 barely responds \u00b7 shallow breaths' }, need: ['bvm'], ok: ['position', 'suction', 'pads'], why: { o2: 'Oxygen is already on and she is still hypoxic with slow, shallow breaths. She needs assisted ventilation.', airway: 'Bag-mask first. It buys time while the team prepares to intubate.' }, msg: 'Bag-mask ventilation, 1 breath every 2\u20133 s. The chest rises with each breath.', after: { spo2: 94, hr: 150, skin: 'pale' }, teach: 'Respiratory failure: assist with a bag-mask, 1 breath every 2\u20133 seconds (20\u201330/min), then consider an advanced airway.', t: 12 },
        { type: 'q', k: 'Confirm the tube', say: 'She needs ongoing ventilation. The team prepares to intubate.', q: 'How do you confirm the tube is in the trachea?', opts: [
          { t: 'Waveform EtCO2 plus chest rise and breath sounds', ok: true },
          { t: 'Tube misting plus chest rise and breath sounds', why: 'Misting and clinical signs can mislead, including in esophageal intubation. Confirm with waveform capnography plus clinical signs.' },
          { t: 'Rising SpO2 plus a chest X-ray to confirm position', why: 'SpO2 can stay up for minutes after an esophageal intubation, and an X-ray shows depth but is too slow. Waveform capnography confirms placement now.' }
        ], teach: 'Confirm an advanced airway with waveform capnography and clinical signs. Then 1 breath every 2\u20133 seconds.' },
        { k: 'Intubate', say: 'Ready to intubate.', need: ['airway'], ok: ['pads'], msg: 'Tube in. Capnography shows a square waveform.', after: { spo2: 96, etco2: 44, rr: 24, look: 'Intubated \u00b7 sedated' }, t: 12 },
        { type: 'end', say: 'She goes to the PICU on the ventilator and recovers over the next week.' }
      ]
    },
    {
      id: 'sugar', title: 'Sleepy Sugar', group: 'Systematic approach', algo: 'approach', age: '2-year-old', wt: 12, kind: 'child', diff: 1,
      place: 'Emergency department',
      brief: 'A 2-year-old with a stomach bug has eaten almost nothing for a day. This morning her parents could barely wake her.',
      init: { monitor: false, rhythm: 'stach', hr: 150, pulse: true, spo2: 96, rr: 28, bp: '90/56', skin: 'pale', look: 'Responds only to pain \u00b7 sweaty \u00b7 limp' },
      phases: [
        { type: 'q', k: 'First look', say: 'Pale, sweaty, limp, responds only to pain. She is breathing regularly.', q: 'What does your first look tell you?', opts: [
          { t: 'Sick child: act now and go through ABCDE', ok: true },
          { t: 'Not sick: probably sleepy, observe for a while', why: 'Responding only to pain is a big drop in consciousness. Treat it as an emergency.' },
          { t: 'Cardiac arrest: start CPR straight away', why: 'She is breathing and has a pulse. Go through ABCDE quickly.' }
        ], teach: 'First impression: consciousness, breathing, color. Then evaluate (ABCDE), identify, intervene.' },
        { k: 'A + B', say: 'Airway: soft snoring. Breathing regular, lips a little pale.', need: ['position', 'o2'], ok: ['suction', 'pads'], why: { bvm: 'She is breathing on her own. Open the airway and give oxygen.', airway: 'Not needed: positioning opens her airway.' }, msg: 'Airway open, oxygen on.', teach: 'A: open and keep the airway open. B: oxygen, watch breathing.', t: 12 },
        { k: 'C', say: 'Fast pulse, CRT 3 s, cool hands.', need: ['pads', 'ivio'], ok: ['fluid'], msg: 'Monitor on, IV in.', teach: 'C: heart rate, rhythm, pulses, CRT, blood pressure, and access.', t: 14 },
        { k: 'D', say: 'Disability: responds only to pain. Pupils equal and reactive.', need: ['glucose'], ok: ['fluid'], why: { dextrose: 'Check first, then treat.' }, msg: 'Glucose 32 mg/dL.', teach: 'D: AVPU, pupils, and always the glucose.', t: 12 },
        { k: 'Treat', say: 'Glucose 32 mg/dL.', need: ['dextrose'], ok: ['fluid'], msg: 'Dextrose in. She opens her eyes and cries.', after: { hr: 128, skin: 'pink', look: 'Awake \u00b7 crying' }, teach: 'Hypoglycemia: dextrose 0.5\u20131 g/kg (D10W 5\u201310 mL/kg), then recheck.', t: 14 },
        { type: 'q', k: 'Recheck', say: 'She is awake and asking for her mother.', q: 'What next?', opts: [
          { t: 'Recheck glucose in 15 minutes; start a dextrose infusion', ok: true },
          { t: 'Discharge once she has finished a cup of juice', why: 'She has not eaten for a day and may drop again. Start a dextrose infusion and recheck.' },
          { t: 'Give a second dextrose bolus now to prevent a relapse', why: 'Recheck before giving more. Prevent relapse with a continuous dextrose infusion.' }
        ], teach: 'After treating hypoglycemia: recheck in about 15 minutes, give a dextrose-containing infusion, and look for the cause.' },
        { type: 'end', say: 'Her glucose stays normal on a dextrose drip. She is admitted to find out why she dropped so low.' }
      ]
    },
    {
      id: 'head', title: 'Monkey Bars', group: 'Systematic approach', algo: 'approach', age: '6-year-old', wt: 20, kind: 'child', diff: 3,
      place: 'Emergency department',
      brief: 'A 6-year-old fell from the monkey bars and hit her head. She cried at once and seemed fine, but over the last hour she has become harder to wake.',
      init: { monitor: false, rhythm: 'sbrady', hr: 56, pulse: true, spo2: 92, rr: 10, bp: '138/84', skin: 'pale', look: 'Responds only to pain \u00b7 right pupil large and sluggish \u00b7 irregular breathing' },
      phases: [
        { k: 'Airway', say: 'Snoring, irregular breaths. A large swelling over the right side of her head.', need: ['position'], ok: ['suction', 'o2'], why: { bvm: 'Open the airway first, then ventilate.' }, msg: 'Jaw thrust with the neck kept in line. The snoring stops.', teach: 'Head injury: open the airway with a jaw thrust, keep the neck in line.', t: 10 },
        { k: 'Breathing', say: 'Airway open. Breathing slowly and irregularly, lips dusky.', need: ['bvm'], ok: ['o2', 'pads'], why: { o2: 'Oxygen alone is not enough: she is hypoventilating. Assist her breathing.' }, msg: 'Bag-mask ventilation with oxygen at a normal rate.', after: { spo2: 98 }, teach: 'Avoid hypoxia and high CO2: both raise intracranial pressure.', t: 12 },
        { k: 'Monitor', say: 'Bagging well.', need: ['pads'], ok: ['ivio', 'glucose'], why: { atropine: 'Find out why the heart is slow first.' }, msg: 'Monitor on.', t: 10 },
        { type: 'q', k: 'Pattern', say: 'Look at the monitor. Irregular breathing, one large pupil.', q: 'What does this combination mean?', opts: [
          { t: 'Raised intracranial pressure: herniation is threatening', ok: true },
          { t: 'Spinal shock from an injury to the neck', why: 'Spinal shock gives a low blood pressure. Here it is high, with a slow pulse, irregular breathing and a blown pupil: raised intracranial pressure.' },
          { t: 'Vagal bradycardia: treat it with atropine', why: 'A slow pulse with high blood pressure and irregular breathing is the Cushing response to raised intracranial pressure. Atropine does not treat it.' }
        ], teach: 'Cushing triad: slow heart rate, high blood pressure, irregular breathing. With a dilating pupil, brain herniation is imminent.' },
        { type: 'q', k: 'Act', say: 'Signs of impending herniation.', q: 'What do you do right now?', opts: [
          { t: 'Head up 30\u00b0, hypertonic saline or mannitol, call neurosurgery', ok: true },
          { t: 'Atropine for the slow pulse, then wait for the CT scan', why: 'The slow pulse is a response to raised pressure in the skull. Lower the intracranial pressure and call neurosurgery now.' },
          { t: 'Furosemide and fluid restriction, then wait for the CT', why: 'Hypotension and dehydration worsen brain injury. Use hyperosmolar therapy and get neurosurgery now.' }
        ], teach: 'Impending herniation: head up 30\u00b0, hyperosmolar therapy (3% saline or mannitol), brief mild hyperventilation only as a bridge, neurosurgery.' },
        { k: 'Access', say: 'Hyperosmolar therapy needs access.', need: ['ivio'], ok: ['glucose'], msg: 'IV in. Hypertonic saline running. Neurosurgery is on the way.', after: { rhythm: 'nsr', hr: 84, bp: '118/70', rr: 18 }, t: 14 },
        { type: 'end', say: 'The CT shows an epidural hematoma. She goes straight to theatre and wakes up the next day.' }
      ]
    },
    {
      id: 'winter', title: 'Winter Night', group: 'Long cases', algo: 'brady', age: '3-month-old', wt: 5, kind: 'infant', diff: 3,
      place: 'Emergency department \u00b7 night shift',
      brief: 'A 3-month-old born at 34 weeks has had a cold for three days. Tonight he is breathing fast, grunting, and has taken half his usual feeds.',
      init: { monitor: false, rhythm: 'stach', hr: 178, pulse: true, spo2: 86, rr: 72, bp: '78/46', skin: 'pale', look: 'Grunting \u00b7 nasal flaring \u00b7 retractions' },
      phases: [
        { type: 'q', k: 'First look', say: 'Grunting with every breath, deep retractions, pale. He looks at you but does not cry.', q: 'What does your first look tell you?', opts: [
          { t: 'Severe respiratory distress, close to failure: act now', ok: true },
          { t: 'Mild distress: observe him and offer a feed', why: 'Grunting, deep retractions and poor feeding in a young infant are severe distress. He needs treatment now.' },
          { t: 'Cardiac arrest: start chest compressions', why: 'He is breathing, moving and has a pulse. Support his breathing first.' }
        ], teach: 'Grunting is an infant keeping his small airways open. With retractions and poor feeding it means severe distress.' },
        { k: 'Airway and oxygen', say: 'His nose is blocked with thick secretions.', need: ['suction', 'o2'], ok: ['pads', 'position', 'history'], why: { bvm: 'He is still breathing for himself. Clear the nose and give oxygen first.', airway: 'Not yet: clear the nose and give oxygen first.' }, msg: 'Thick secretions cleared from the nose. Oxygen on.', after: { spo2: 91 }, teach: 'Young infants breathe through the nose: suction and oxygen are the first treatment of bronchiolitis.', t: 14 },
        { k: 'Monitor', say: 'A little pinker on oxygen.', need: ['pads'], ok: ['ivio', 'auscult', 'history'], msg: 'Monitor on: sinus tachycardia at 178.', t: 12 },
        { k: 'Examine', say: 'Look at the monitor, then at the chest.', need: ['auscult'], ok: ['ivio', 'history', 'glucose'], msg: 'Fine crackles and wheeze on both sides, long expiration. The liver is not enlarged.', teach: 'Wheeze, crackles and a long expiration point to the lower airways.', t: 12 },
        { k: 'Story and gas', say: 'Ask the mother what happened, and send a blood gas.', need: ['history', 'labs'], ok: ['ivio', 'glucose'], msg: 'Born at 34 weeks. Three days of a cold, half his feeds today. Gas: pH 7.22, pCO\u2082 68.', teach: 'A rising pCO\u2082 in a tachypneic infant means he is tiring. Prematurity and age under 3 months are the risk factors for apnea in bronchiolitis.', t: 18 },
        { k: 'Ventilate', say: 'Twenty minutes later the grunting stops. He is quiet, with long pauses between breaths.', set: { rr: 10, spo2: 74, hr: 96, rhythm: 'sbrady', skin: 'cyan', look: 'Limp \u00b7 breathing pauses \u00b7 lips blue' }, need: ['bvm'], ok: ['position', 'suction', 'ivio'], why: { cpr: 'He has a pulse above 60. Ventilate with oxygen first; CPR if the rate stays under 60 with poor perfusion despite that.', epi: 'Hypoxia is driving the slow pulse. Ventilate first.', atropine: 'Hypoxia is driving the slow pulse. Ventilate first.', airway: 'Bag him first: it is faster, and he needs oxygen now.' }, msg: 'Bag-mask with 100% oxygen. The chest rises.', teach: 'A quiet child after a period of distress is an exhausted child. Bradycardia in an infant is hypoxia until proven otherwise.', t: 12 },
        { type: 'q', k: 'Still slow', say: 'After 30 seconds of good ventilation he is mottled, CRT 5 s. Look at the monitor.', set: { hr: 54, spo2: 80, bp: '52/30', skin: 'mottled', look: 'Limp \u00b7 unresponsive \u00b7 mottled' }, q: 'Next step?', opts: [
          { t: 'Start CPR: compressions with ventilation', ok: true },
          { t: 'Keep bagging for two more minutes, then reassess', why: 'A rate under 60 with poor perfusion despite effective ventilation needs compressions now.' },
          { t: 'Give atropine first, and compress if it fails', why: 'Compressions come first. Epinephrine is the first drug; atropine is for vagal tone or a primary AV block.' }
        ], teach: 'HR under 60/min with poor perfusion despite oxygen and ventilation: start CPR.', after: { cpr: true } },
        { type: 'cycle', k: 'CPR + epinephrine', say: 'CPR with ventilation. Get access and give the first drug.', dur: 14, need: ['ivio', 'epi'], ok: ['glucose'], why: { atropine: 'Epinephrine is first-line for bradycardia with poor perfusion.', adenosine: '!Adenosine slows conduction: the opposite of what he needs.' }, teach: 'Epinephrine 0.01 mg/kg IV/IO, repeat every 3\u20135 minutes.' },
        { k: 'Check', say: 'Two minutes are up. Pause and check.', set: { cpr: false, rhythm: 'pea', hr: 40 }, need: ['check'], why: { shock: '!Organized complexes are never shocked. Check for a pulse.' }, msg: 'Slow wide complexes at 40. No brachial pulse.', after: { pulse: false, rr: 0, alarm: true, skin: 'grey', look: 'Unresponsive \u00b7 no pulse' }, t: 10 },
        { type: 'q', k: 'Rhythm', say: 'Organized complexes at 40. No pulse.', q: 'This is\u2026', opts: [
          { t: 'PEA: CPR and epinephrine, look for the cause', ok: true },
          { t: 'Bradycardia with a pulse: give atropine', why: 'There is no pulse: this is cardiac arrest. Organized activity without a pulse is PEA.' },
          { t: 'A shockable rhythm: defibrillate at 2 J/kg', why: 'Organized complexes without a pulse are PEA, which is not shockable.' }
        ], teach: 'Untreated hypoxic bradycardia ends in PEA or asystole. Non-shockable: CPR, epinephrine, reversible causes.', after: { cpr: true } },
        { type: 'cycle', k: 'Airway + cause', say: 'CPR resumes. Secure the airway, and work out why he arrested.', dur: 20, need: ['airway', 'hts'], ok: ['epi', 'fluid', 'glucose'], hts: { clue: 'A premature infant with bronchiolitis who tired, then stopped breathing before his heart slowed. Blood gas pCO\u2082 68.', ans: 'Hypoxia', fix: 'Secure the airway and ventilate with 100% oxygen.' }, why: { shock: '!PEA is not shockable.' }, teach: 'In children hypoxia is the most common reversible cause. An advanced airway lets you ventilate without pausing compressions.' },
        { type: 'cycle', k: 'Epinephrine', say: 'Next cycle. Watch the epinephrine timer.', dur: 14, need: ['epi'], ok: ['glucose', 'fluid'], why: { shock: '!PEA is not shockable.', atropine: 'Atropine is not part of the arrest algorithm.' }, teach: 'Repeat epinephrine every 3\u20135 minutes, about every other cycle.' },
        { k: 'ROSC?', say: 'Rhythm check: narrow complexes at 150. Look at the capnography.', set: { cpr: false, rhythm: 'stach', hr: 150, etco2: 38 }, need: ['check'], why: { cpr: 'Organized rhythm and a jump in EtCO\u2082: check for a pulse first.', shock: '!Organized rhythm: never shock it. Check for a pulse.' }, msg: 'Brachial pulse present.', after: { pulse: true, alarm: false, bp: '62/36', spo2: 91, skin: 'pale', look: 'ROSC \u00b7 sedated \u00b7 ventilated' }, teach: 'A sudden rise in EtCO\u2082 is often the first sign of ROSC.', t: 10 },
        { type: 'end', say: 'He goes to the PICU on a ventilator. Five days later he is breathing on his own and feeding again.' }
      ]
    },
    {
      id: 'storm', title: 'After the Flu', group: 'Long cases', algo: 'tachy', age: '14-year-old', wt: 50, kind: 'teen', diff: 3,
      place: 'Emergency department',
      brief: 'A 14-year-old who had a flu-like illness last week walks in with chest pain and a racing heart. On the way from triage she turns pale and confused.',
      init: { monitor: false, rhythm: 'vt', hr: 210, pulse: true, spo2: 93, rr: 30, bp: '74/48', skin: 'pale', look: 'Confused \u00b7 sweaty \u00b7 CRT 4 s' },
      phases: [
        { k: 'Basics', say: 'Pale, sweaty and confused. Her pulse is fast and weak.', need: ['o2', 'pads'], ok: ['ivio', 'ecg12', 'history'], why: { adenosine: 'Monitor first: identify the rhythm before giving any drug.', sync: 'Pads first: you cannot cardiovert without them, and you need to see the rhythm.', vagal: 'Monitor first: identify the rhythm before treating it.' }, msg: 'Oxygen on. Monitor on: a wide-complex tachycardia at 210.', t: 14 },
        { type: 'q', k: 'Rhythm', say: 'Wide QRS, regular, rate 210, no P waves.', q: 'Rhythm?', opts: [
          { t: 'Ventricular tachycardia with a pulse', ok: true },
          { t: 'Supraventricular tachycardia (SVT)', why: 'SVT usually has a narrow QRS. A wide, regular tachycardia in a sick child is VT until proven otherwise.' },
          { t: 'Sinus tachycardia from pain and fever', why: 'Sinus tachycardia has P waves, a narrow QRS and a rate that varies, and in a teenager it rarely exceeds 180.' }
        ], teach: 'Wide QRS (over 0.09 s) and regular: treat as VT.' },
        { type: 'q', k: 'Stable?', say: 'Confused, CRT 4 s. Look at the blood pressure.', q: 'What does she need?', opts: [
          { t: 'Unstable: synchronized cardioversion now', ok: true },
          { t: 'Stable: adenosine and an expert consult', why: 'Hypotension and confusion mean compromise. An unstable tachycardia with a pulse needs synchronized cardioversion.' },
          { t: 'Pulseless: unsynchronized defibrillation', why: 'She has a pulse. An unsynchronized shock can turn VT into VF: synchronize.' }
        ], teach: 'Compromise = hypotension, acutely altered mental status, or signs of shock.' },
        { k: 'Cardiovert', say: 'Unstable VT with a pulse.', need: ['sync'], ok: ['ivio'], why: { shock: '!She has a pulse: synchronize the shock.', adenosine: 'She is unstable: do not delay cardioversion for a drug.', amio: 'She is unstable: electricity first.', procain: 'She is unstable: electricity first.' }, msg: 'Synchronized shock\u2026 sinus tachycardia at 130.', after: { rhythm: 'stach', hr: 130, bp: '88/54', look: 'Drowsy \u00b7 CRT 3 s' }, teach: 'Synchronized cardioversion 0.5\u20131 J/kg, then 2 J/kg. Sedate first only if it causes no delay.', t: 16 },
        { k: 'Access, story, bloods', say: 'Sinus rhythm for now. Get access, the story and bloods.', need: ['ivio', 'history', 'labs'], ok: ['ecg12', 'glucose'], why: { fluid: 'Find out why first: a failing heart does not tolerate a large bolus.' }, msg: 'IV in. A week of fever and muscle aches, breathless on the stairs since yesterday, no medicines or drugs. Troponin very high, K 4.1, lactate 4.8.', teach: 'A viral illness, then chest pain, breathlessness and a ventricular arrhythmia: think myocarditis.', t: 20 },
        { type: 'q', k: 'Circulation', say: 'BP 88/54, CRT 3 s. Her liver edge is 3 cm down and there are crackles at both bases.', q: 'How do you support her circulation?', opts: [
          { t: 'A small bolus of 5\u201310 mL/kg slowly, then reassess; early inotrope', ok: true },
          { t: 'Boluses of 20 mL/kg pushed fast, up to three', why: 'A big liver and crackles mean a failing pump. Large fast boluses will flood her lungs.' },
          { t: 'Nothing for now: the rhythm is fixed', why: 'She is still poorly perfused, and the heart muscle is inflamed. She needs careful support and a cardiology and PICU team.' }
        ], teach: 'Cardiogenic shock: small boluses of 5\u201310 mL/kg over 10\u201320 minutes, stop if crackles or the liver get worse, early inotrope and expert help.' },
        { k: 'Collapse', say: 'While you are on the phone to cardiology she slumps. The monitor alarms.', set: { rhythm: 'vf', hr: 0, pulse: false, rr: 0, skin: 'grey', look: 'Unresponsive \u00b7 not breathing', alarm: true }, need: ['cpr'], ok: ['check', 'resp', 'shout'], why: { shock: 'Start compressions while the defibrillator charges; the shock comes next.', sync: '!There are no R waves to synchronize to, and no pulse.', epi: 'Compressions and a shock come before any drug.' }, msg: 'Compressions started. The defibrillator is charging.', teach: 'Unresponsive with VF on the monitor: CPR at once and a shock as soon as the defibrillator is ready.', t: 8 },
        { k: 'Shock 1', say: 'Chaotic waves on the monitor. Charged.', need: ['shock'], why: { sync: '!VF has no R waves to sync to. Defibrillate unsynchronized.', epi: 'Shock first. In VF, epinephrine comes after the 2nd shock.' }, msg: 'Shock delivered. CPR resumes immediately.', after: { cpr: true }, teach: 'First shock: 2 J/kg.', t: 12 },
        { type: 'cycle', k: 'CPR + ventilation', say: 'CPR for 2 minutes. Someone has to breathe for her.', dur: 12, need: ['bvm'], why: { epi: 'In VF, epinephrine comes after the 2nd shock.', amio: 'Amiodarone comes after the 3rd shock.', shock: 'Shocks happen at rhythm checks, every 2 minutes.' }, teach: 'Shockable pathway: shock, then 2 minutes of CPR with ventilation.' },
        { k: 'Check 2', say: '2 minutes are up.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'Still VF.', t: 8 },
        { k: 'Shock 2', say: 'Still VF.', need: ['shock'], msg: 'Shock delivered. CPR resumes immediately.', after: { cpr: true }, teach: 'Second shock: 4 J/kg.', t: 12 },
        { type: 'cycle', k: 'Epinephrine', say: 'CPR for 2 minutes.', dur: 14, need: ['epi'], ok: ['airway'], why: { amio: 'Amiodarone comes after the 3rd shock. Now: epinephrine.', lido: 'Lidocaine, like amiodarone, comes after the 3rd shock. Now: epinephrine.' }, teach: 'After the 2nd shock: epinephrine 0.01 mg/kg every 3\u20135 minutes; consider an advanced airway.' },
        { k: 'Check 3', say: 'Rhythm check.', need: ['rhythm'], why: { shock: 'Analyze first: pause, read the rhythm, then shock.' }, msg: 'VF persists.', t: 8 },
        { k: 'Shock 3', say: 'Still VF.', need: ['shock'], msg: 'Shock delivered. CPR resumes.', after: { cpr: true }, teach: 'Subsequent shocks: at least 4 J/kg, maximum 10 J/kg or the adult dose.', t: 12 },
        { type: 'cycle', k: 'Antiarrhythmic', say: 'CPR for 2 minutes. Give the antiarrhythmic.', dur: 16, need: [['amio', 'lido']], dose: { amio: 'amioArrest' }, ok: ['epi', 'airway'], teach: 'After the 3rd shock: amiodarone 5 mg/kg bolus (or lidocaine 1 mg/kg). In myocarditis that does not respond, call the ECMO team early.' },
        { k: 'ROSC?', say: 'Rhythm check: organized narrow complexes at 124.', set: { cpr: false, rhythm: 'stach', hr: 124, alarm: false }, need: ['check'], why: { shock: '!Organized rhythm: check for a pulse. Never shock it.', cpr: 'Organized rhythm: check for a pulse first, no more than 10 s.' }, msg: 'Carotid pulse present.', after: { pulse: true, bp: '80/50', spo2: 93, skin: 'pale', look: 'ROSC \u00b7 unresponsive' }, t: 10 },
        { type: 'end', say: 'She goes to the PICU on an epinephrine infusion, with the ECMO team standing by. Myocarditis is confirmed the next day.' }
      ]
    },
    {
      id: 'squeeze', title: 'Tight Chest', group: 'Long cases', algo: 'resp', age: '8-year-old', wt: 26, kind: 'child', diff: 3,
      place: 'Emergency department',
      brief: 'An 8-year-old with asthma has been getting worse since last night. His inhaler no longer helps and he can only speak in single words.',
      init: { monitor: false, rhythm: 'stach', hr: 160, pulse: true, spo2: 84, rr: 44, bp: '104/62', skin: 'pale', look: 'Tripod position \u00b7 single words \u00b7 loud wheeze' },
      phases: [
        { k: 'First treatment', say: 'Sitting forward, pulling at every breath, wheeze you can hear from the door.', need: ['o2', 'albuterol'], ok: ['pads', 'history', 'auscult'], why: { bvm: 'He is breathing for himself. Oxygen and a bronchodilator first.', airway: 'Intubating an asthmatic is a last resort. Oxygen and a bronchodilator first.', nebepi: 'Nebulized epinephrine is for upper airway swelling. His problem is in the lower airways.' }, msg: 'Oxygen on, back-to-back nebulizers running.', after: { spo2: 89 }, teach: 'Severe asthma: oxygen and back-to-back salbutamol (with ipratropium).', t: 14 },
        { k: 'Monitor + access', say: 'The nebulizer is running.', need: ['pads', 'ivio'], ok: ['history', 'auscult'], msg: 'Monitor on, IV in.', t: 14 },
        { k: 'Second line', say: 'Still working hard after the first nebulizers. What goes in through the IV?', need: ['dexa', 'mag'], ok: ['albuterol', 'history'], why: { abx: 'Nothing points to infection.', antihist: 'Antihistamines do not treat asthma.', fluid: 'He is not in shock. Treat the airways.' }, msg: 'Steroid in. Magnesium running over 20 minutes.', teach: 'Early steroid in every severe attack. Magnesium sulfate 25\u201350 mg/kg IV over 15\u201330 minutes when the first nebulizers are not enough.', t: 18 },
        { k: 'Story and gas', say: 'Ask his father for the story, and send a blood gas.', need: ['history', 'labs'], ok: ['albuterol', 'auscult'], msg: 'Known asthma, two PICU admissions, ran out of his preventer inhaler a week ago. No allergies. Gas: pH 7.28, pCO\u2082 52.', teach: 'A fast-breathing asthmatic should have a low pCO\u2082. A normal or high value means he is tiring.', t: 18 },
        { type: 'q', k: 'Quiet chest', say: 'Thirty minutes later he is drowsy. The wheeze has almost gone and he breathes 18 times a minute.', set: { rr: 18, spo2: 80, hr: 150, skin: 'cyan', look: 'Drowsy \u00b7 almost silent chest' }, q: 'What does the quiet chest mean?', opts: [
          { t: 'Almost no air is moving: respiratory failure', ok: true },
          { t: 'The treatment is working: continue the nebulizers', why: 'A child who improves becomes more alert and pinker. Drowsy, blue and quiet means almost no air is moving.' },
          { t: 'He is exhausted and asleep: let him rest', why: 'Drowsiness with falling saturation is hypoxia and a rising CO\u2082, not sleep.' }
        ], teach: 'The silent chest is the most dangerous sign in asthma.' },
        { k: 'Take over', say: 'Respiratory failure.', need: ['bvm'], ok: ['epiim', 'albuterol'], why: { cpr: 'He has a pulse. Breathe for him.', airway: 'Bag him first while the team prepares the tube and drugs.' }, msg: 'Slow bagging with a long time to breathe out.', after: { spo2: 86 }, teach: 'Bag an asthmatic slowly: a low rate and a long expiration, or air gets trapped.', t: 12 },
        { k: 'Intubate', say: 'He is not improving with the bag. The team is ready.', need: ['airway'], ok: ['fluid'], msg: 'Intubated with a cuffed tube. The capnography trace slopes up like a shark fin.', after: { spo2: 93, rr: 16, hr: 146, skin: 'pale', look: 'Intubated \u00b7 sedated' }, teach: 'After intubation: slow rate, long expiratory time, accept a high CO\u2082.', t: 16 },
        { k: 'Sudden drop', say: 'Five minutes later the saturation falls, the bag becomes very stiff and the heart rate drops.', set: { spo2: 70, hr: 70, rhythm: 'sbrady', bp: '60/30', skin: 'grey', look: 'Intubated \u00b7 neck veins distended' }, need: ['auscult'], ok: ['suction'], why: { needle: 'Examine first: it takes seconds and tells you which side.', epi: 'Find out why first. The exam takes ten seconds.', fluid: 'Find out why first. The exam takes ten seconds.', atropine: 'This is not a vagal problem. Examine the chest.' }, msg: 'The tube is at the same depth and clear to suction. No breath sounds on the left, trachea pushed to the right.', teach: 'A ventilated child who suddenly gets worse: DOPE. Displaced tube, Obstructed tube, Pneumothorax, Equipment failure.', t: 12 },
        { k: 'Pulse gone', say: 'Before you reach for the needle the complexes slow, and the pulse is gone.', set: { hr: 44, rhythm: 'pea', pulse: false, rr: 0, alarm: true, look: 'Unresponsive \u00b7 no pulse' }, need: ['cpr'], ok: ['check'], why: { shock: '!PEA is not shockable.', needle: 'Start compressions now; the needle goes in during this cycle.' }, msg: 'Compressions started.', teach: 'No pulse: compressions first, then treat the cause within the cycle.', t: 8 },
        { type: 'cycle', k: 'Treat the cause', say: 'CPR is running. Give the first drug, name the cause and treat it.', dur: 22, need: ['epi', 'hts', 'needle'], ok: ['fluid'], hts: { clue: 'Severe asthma, just intubated and ventilated with positive pressure. No breath sounds on the left, trachea pushed to the right, distended neck veins.', ans: 'Tension pneumothorax', fix: 'Needle decompression, then a chest drain.' }, why: { shock: '!PEA is not shockable.', atropine: 'Atropine is not part of the arrest algorithm.' }, teach: 'Tension pneumothorax: needle decompression in the 2nd intercostal space, midclavicular line (or the 4th\u20135th space, anterior axillary line), then a chest drain.' },
        { k: 'ROSC?', say: 'Rhythm check: narrow complexes at 140. Look at the capnography.', set: { cpr: false, rhythm: 'stach', hr: 140, etco2: 44 }, need: ['check'], why: { cpr: 'Organized rhythm and a jump in EtCO\u2082: check for a pulse first.', shock: '!Organized rhythm: never shock it. Check for a pulse.' }, msg: 'Carotid pulse present. Air hissed out through the needle.', after: { pulse: true, alarm: false, bp: '86/50', spo2: 92, skin: 'pale', look: 'ROSC \u00b7 intubated \u00b7 sedated' }, teach: 'Treating the cause is what brings the pulse back in PEA.', t: 10 },
        { type: 'end', say: 'A chest drain goes in and he is transferred to the PICU. He is extubated two days later.' }
      ]
    }
  ];

  /* ---------- algorithms ---------- */
  const ALGOS = [
    {
      id: 'bls', name: 'Pediatric BLS', short: 'Recognize, call, compress, shock', color: 'var(--ecg)',
      nodes: [
        { id: 1, k: 'act', t: 'Scene safe? Check responsiveness', d: 'Tap and shout. Infant: tap the sole of the foot.' },
        { id: 2, k: 'act', t: 'Shout for help', d: 'Send someone to activate EMS and get the AED. Witnessed sudden collapse and alone: call and get the AED first.' },
        { id: 3, k: 'act', t: 'Check breathing and pulse together', d: 'No more than 10 seconds. Infant: brachial. Child: carotid or femoral. Gasping is not breathing.' },
        { id: 4, k: 'dec', t: 'What did you find?', opts: [{ l: 'Breathing + pulse', to: 13 }, { l: 'Pulse, no normal breathing', to: 5 }, { l: 'No pulse (or unsure)', to: 6 }] },
        { id: 5, k: 'act', t: 'Rescue breathing', d: '1 breath every 2\u20133 s. If HR under 60 with poor perfusion: start CPR. Recheck pulse every 2 min.', next: 6, note: 'Only if HR < 60 with poor perfusion' },
        { id: 6, k: 'act', t: 'Start CPR', d: 'One rescuer 30:2, two rescuers 15:2. Rate 100\u2013120. Depth 1/3 of the chest (\u22484 cm infant, \u22485 cm child). Full recoil. Minimal pauses.' },
        { id: 7, k: 'act', t: 'Alone and unwitnessed: call after 2 min', d: 'After about 5 cycles, call EMS (speakerphone) and get the AED.' },
        { id: 8, k: 'act', t: 'AED arrives: on, pads, analyze', d: 'Pediatric pads if available (adult pads otherwise). Pads must not touch: front + back on small chests.' },
        { id: 9, k: 'dec', t: 'Shockable rhythm?', opts: [{ l: 'Yes', to: 10 }, { l: 'No', to: 11 }] },
        { id: 10, k: 'act', t: 'One shock, then CPR immediately', d: 'Resume CPR for 2 minutes right after the shock. No pulse check.', next: 12 },
        { id: 11, k: 'act', t: 'CPR immediately for 2 minutes', d: 'Analyze every 2 minutes.' },
        { id: 12, k: 'end', t: 'Continue until ALS takes over or the child moves', d: 'Rotate compressors every 2 minutes.' },
        { id: 13, k: 'end', t: 'Monitor until EMS arrives', d: 'Keep reassessing.' }
      ],
      seqs: [
        { n: 'Lone rescuer, unwitnessed', steps: ['Tap and shout', 'Shout for help', 'Check breathing + pulse (\u226410 s)', 'CPR 30:2 for 2 minutes', 'Call EMS and get the AED', 'Turn on AED, attach pads', 'Shock if advised, then CPR at once'] },
        { n: 'AED steps', steps: ['Turn the AED on', 'Expose and dry the chest', 'Attach pads (not touching)', 'Plug in the connector', 'Stand clear while it analyzes', 'Shock if advised', 'Resume CPR for 2 minutes'] },
        { n: 'Closed-loop talk', steps: ['Leader gives a clear assignment', 'Member repeats it back with eye contact', 'Member reports when done, with the result', 'Leader listens and confirms'] }
      ]
    },
    {
      id: 'approach', name: 'Systematic Approach', short: 'First look, ABCDE, history, reassess', color: 'var(--spo2)',
      nodes: [
        { id: 1, k: 'act', t: 'First impression from the door', d: 'Appearance, work of breathing, skin color. Alert, interactive children are rarely critically ill.' },
        { id: 2, k: 'dec', t: 'Responsive?', opts: [{ l: 'Yes', to: 6 }, { l: 'No', to: 3 }] },
        { id: 3, k: 'dec', t: 'Breathing effectively? Adequate pulse (\u226560)?', opts: [{ l: 'Breathing + pulse', to: 6 }, { l: 'Pulse, poor breathing', to: 4 }, { l: 'No/inadequate pulse', to: 5 }] },
        { id: 4, k: 'act', t: 'Rescue breathing', d: 'Ventilate, then diagnose and treat. Gasping counts as ineffective breathing.', next: 6 },
        { id: 5, k: 'end', t: 'Start CPR: go to Cardiac Arrest', d: 'Low threshold: if they cannot ventilate or perfuse on their own, take over.' },
        { id: 6, k: 'act', t: 'A \u00b7 Airway', d: 'Open and clear? Maintainable with positioning, suction, OPA/NPA? Or advanced airway needed?' },
        { id: 7, k: 'act', t: 'B \u00b7 Breathing', d: 'Rate too fast/slow? Effort: flaring, retractions, head bobbing, grunting. Sounds: stridor, wheeze, crackles. SpO2.' },
        { id: 8, k: 'act', t: 'C \u00b7 Circulation', d: 'HR and rhythm, BP, central vs peripheral pulses, CRT (>2 s is slow), skin color and temperature.' },
        { id: 9, k: 'act', t: 'D \u00b7 Disability', d: 'AVPU, pediatric GCS, pupils, glucose.' },
        { id: 10, k: 'act', t: 'E \u00b7 Exposure', d: 'Look for trauma, burns, rash, petechiae. Then cover and warm: children lose heat fast.' },
        { id: 11, k: 'act', t: 'Secondary survey', d: 'SPAM history (Signs & symptoms, Past history, Allergies, Medications) and a head-to-toe exam.' },
        { id: 12, k: 'end', t: 'Identify and go to the right algorithm', d: 'Respiratory distress/failure, shock, bradycardia, tachycardia, arrest. Evaluate, identify, intervene, then reassess.' }
      ],
      seqs: [{ n: 'Primary assessment', steps: ['Airway', 'Breathing', 'Circulation', 'Disability', 'Exposure', 'Secondary survey (SPAM)'] }]
    },
    {
      id: 'resp', name: 'Respiratory Distress', short: 'Distress vs failure, 4 categories', color: 'var(--rr)',
      nodes: [
        { id: 1, k: 'dec', t: 'Distress or failure?', opts: [{ l: 'Distress', to: 3 }, { l: 'Failure', to: 2 }] },
        { id: 2, k: 'act', t: 'Failure: ventilate now', d: 'Slow breathing, poor effort, bradycardia, unresponsive, cyanotic. Open the airway, bag-mask with 100% O2, prepare an advanced airway.', next: 3 },
        { id: 3, k: 'act', t: 'Initial management', d: 'Position of comfort, airway support, suction, oxygen, SpO2 and monitor, IV/IO, nebulizers as indicated.' },
        { id: 4, k: 'dec', t: 'Which category?', opts: [{ l: 'Upper airway (stridor)', to: 5 }, { l: 'Lower airway (wheeze)', to: 6 }, { l: 'Lung tissue (grunt/crackles)', to: 7 }, { l: 'CNS (irregular/slow)', to: 8 }] },
        { id: 5, k: 'end', t: 'Upper airway', d: 'Croup: dexamethasone, nebulized epinephrine, O2/heliox. Anaphylaxis: IM epinephrine, albuterol, antihistamine. Foreign body: obstruction relief, never a blind sweep.' },
        { id: 6, k: 'end', t: 'Lower airway', d: 'Asthma: albuterol \u00b1 ipratropium, corticosteroids, magnesium, epinephrine. Bronchiolitis: suction, nebulizers, support.' },
        { id: 7, k: 'end', t: 'Lung tissue disease', d: 'Pneumonia: antibiotics, support breathing. Pulmonary edema: diuretics, inotropes, ventilation support.' },
        { id: 8, k: 'end', t: 'CNS', d: 'Overdose: naloxone or antidotes, support breathing. Head trauma: support ventilation, reduce ICP, neurosurgery.' }
      ],
      seqs: [{ n: 'Least to most invasive (croup)', steps: ['Oxygen', 'Dexamethasone', 'Nebulized epinephrine', 'Intubate', 'Tracheostomy'] }]
    },
    {
      id: 'brady', name: 'Bradycardia with a Pulse', short: 'Oxygenate, CPR <60, epi, atropine, pace', color: 'var(--spo2)',
      nodes: [
        { id: 1, k: 'act', t: 'Identify and treat the cause', d: 'Support airway and breathing, O2 if hypoxemic, monitor, BP, SpO2, IV/IO, 12-lead. Hypoxia is the most common cause.' },
        { id: 2, k: 'dec', t: 'Cardiopulmonary compromise?', d: 'Hypotension, acutely altered mental status, signs of shock.', opts: [{ l: 'No', to: 3 }, { l: 'Yes', to: 4 }] },
        { id: 3, k: 'end', t: 'Support ABCs, observe, consult', d: 'Monitor and observe. Consider specialist consultation.' },
        { id: 4, k: 'act', t: 'CPR if HR under 60 with poor perfusion', d: 'Despite oxygenation and ventilation.' },
        { id: 5, k: 'dec', t: 'Bradycardia persists?', opts: [{ l: 'No', to: 3 }, { l: 'Yes', to: 6 }] },
        { id: 6, k: 'act', t: 'Epinephrine', d: '0.01 mg/kg IV/IO every 3\u20135 min (ET 0.1 mg/kg).' },
        { id: 7, k: 'act', t: 'Atropine for vagal tone or primary AV block', d: '0.02 mg/kg, may repeat once. Minimum 0.1 mg, maximum single dose 0.5 mg.' },
        { id: 8, k: 'act', t: 'Consider pacing', d: 'Especially complete heart block or sinus node dysfunction. Treat underlying causes. Expert consult.' },
        { id: 9, k: 'end', t: 'Pulseless? Go to Cardiac Arrest', d: '' }
      ],
      seqs: [{ n: 'Symptomatic bradycardia', steps: ['Support airway, O2, ventilation', 'Monitor, BP, SpO2, IV/IO', 'CPR if HR < 60 with poor perfusion', 'Epinephrine 0.01 mg/kg', 'Atropine (vagal or AV block)', 'Pacing'] }]
    },
    {
      id: 'tachy', name: 'Tachycardia with a Pulse', short: 'Narrow vs wide, stable vs not', color: 'var(--bp)',
      nodes: [
        { id: 1, k: 'act', t: 'Identify and treat the cause', d: 'Airway, O2 if hypoxemic, monitor, BP, SpO2, IV/IO, 12-lead.' },
        { id: 2, k: 'dec', t: 'QRS duration?', opts: [{ l: 'Narrow \u22640.09 s', to: 3 }, { l: 'Wide >0.09 s', to: 8 }] },
        { id: 3, k: 'dec', t: 'Sinus tach or SVT?', d: 'Sinus: P waves, variable rate, infant <220, child <180, known cause. SVT: no P, fixed rate, infant \u2265220, child \u2265180, abrupt onset.', opts: [{ l: 'Probable sinus tach', to: 4 }, { l: 'Probable SVT', to: 5 }] },
        { id: 4, k: 'end', t: 'Search for and treat the cause', d: 'Fever, pain, hypovolemia, hypoxia.' },
        { id: 5, k: 'dec', t: 'Cardiopulmonary compromise?', opts: [{ l: 'No', to: 6 }, { l: 'Yes', to: 7 }] },
        { id: 6, k: 'end', t: 'Vagal maneuvers, then adenosine', d: 'Ice to the face (infant), Valsalva (child). Adenosine 0.1 mg/kg rapid push (max 6), then 0.2 mg/kg (max 12).' },
        { id: 7, k: 'end', t: 'Synchronized cardioversion', d: '0.5\u20131 J/kg, then 2 J/kg. Sedate if possible. Adenosine may be tried if IV is ready, without delaying.' },
        { id: 8, k: 'dec', t: 'Possible VT. Compromise?', opts: [{ l: 'Yes', to: 9 }, { l: 'No', to: 10 }] },
        { id: 9, k: 'end', t: 'Synchronized cardioversion', d: '0.5\u20131 J/kg, then 2 J/kg.' },
        { id: 10, k: 'end', t: 'Expert consultation', d: 'Adenosine if regular and monomorphic. Amiodarone 5 mg/kg over 20\u201360 min OR procainamide 15 mg/kg over 30\u201360 min, not both.' }
      ],
      seqs: [{ n: 'Stable SVT', steps: ['Monitor + 12-lead', 'Vagal maneuver', 'IV/IO access', 'Adenosine 0.1 mg/kg', 'Adenosine 0.2 mg/kg', 'Expert consult or cardioversion'] }]
    },
    {
      id: 'shock', name: 'Shock', short: 'Recognize early, type, targeted fix', color: 'var(--bp)',
      nodes: [
        { id: 1, k: 'act', t: 'Recognize early', d: 'Tachycardia first. CRT over 2 s, weak pulses, cool mottled skin, low urine output, decreased consciousness. BP can still be normal (compensated).' },
        { id: 2, k: 'act', t: 'Hypotension thresholds', d: 'Neonate <60 \u00b7 infant <70 \u00b7 1\u201310 y <70 + (2 \u00d7 age) \u00b7 over 10 y <90 mmHg systolic.' },
        { id: 3, k: 'act', t: 'All shock', d: 'O2, monitor, IV/IO, glucose. Goals: normal HR/BP for age, CRT under 2 s, normal mental status, urine \u22651 mL/kg/h.' },
        { id: 4, k: 'dec', t: 'Which type?', opts: [{ l: 'Hypovolemic', to: 5 }, { l: 'Distributive', to: 6 }, { l: 'Cardiogenic', to: 7 }, { l: 'Obstructive', to: 8 }] },
        { id: 5, k: 'end', t: 'Hypovolemic', d: '20 mL/kg isotonic crystalloid over 5\u201310 min, repeat and reassess. Hemorrhage: 3 mL per 1 mL lost, packed red cells early.' },
        { id: 6, k: 'end', t: 'Distributive', d: 'Septic: 20 mL/kg boluses with reassessment, antibiotics ASAP, vasoactive if fluid-refractory (cold: epinephrine, warm: norepinephrine). Anaphylaxis: IM epinephrine first. Neurogenic: fluids, then vasopressors.' },
        { id: 7, k: 'end', t: 'Cardiogenic', d: 'Cautious 5\u201310 mL/kg over 10\u201320 min. Inotropes (milrinone, dobutamine). Expert consult. Fluids are not the main fix.' },
        { id: 8, k: 'end', t: 'Obstructive', d: 'Tension pneumothorax: needle decompression, chest tube. Tamponade: pericardiocentesis. Ductal-dependent lesion: prostaglandin E1. PE: supportive care; anticoagulation or fibrinolysis with expert input.' }
      ],
      seqs: [{ n: 'Hypovolemic shock', steps: ['O2 + monitor', 'IV/IO access', 'Bolus 20 mL/kg over 5\u201310 min', 'Reassess perfusion and lungs', 'Repeat bolus if needed', 'Check and correct glucose'] }]
    },
    {
      id: 'arrest', name: 'Cardiac Arrest', short: 'Shockable vs non-shockable loops', color: 'var(--accent)',
      nodes: [
        { id: 1, k: 'act', t: 'Start CPR \u00b7 oxygen \u00b7 monitor/defibrillator', d: 'Activate the emergency response.' },
        { id: 2, k: 'dec', t: 'Shockable rhythm?', opts: [{ l: 'Yes: VF / pVT', to: 3 }, { l: 'No: asystole / PEA', to: 9 }] },
        { id: 3, k: 'act', t: 'Shock 2 J/kg', d: 'Resume CPR immediately.' },
        { id: 4, k: 'act', t: 'CPR 2 min \u00b7 IV/IO', d: '' },
        { id: 5, k: 'dec', t: 'Shockable?', opts: [{ l: 'Yes', to: 6 }, { l: 'No', to: 12 }] },
        { id: 6, k: 'act', t: 'Shock 4 J/kg', d: '' },
        { id: 7, k: 'act', t: 'CPR 2 min \u00b7 epinephrine every 3\u20135 min \u00b7 consider advanced airway', d: 'Epinephrine 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL), max 1 mg.' },
        { id: 8, k: 'dec', t: 'Shockable?', opts: [{ l: 'Yes', to: 13 }, { l: 'No', to: 12 }] },
        { id: 9, k: 'act', t: 'CPR 2 min \u00b7 IV/IO \u00b7 epinephrine as soon as possible', d: 'Then every 3\u20135 min. Consider an advanced airway.' },
        { id: 10, k: 'dec', t: 'Shockable?', opts: [{ l: 'Yes', to: 6 }, { l: 'No', to: 11 }] },
        { id: 11, k: 'act', t: "CPR 2 min \u00b7 treat reversible causes (H's & T's)", d: 'Then back to the rhythm check.', next: 10 },
        { id: 12, k: 'end', t: 'Not shockable now', d: 'Asystole/PEA: go to 11. Organized rhythm: check pulse. Pulse + ROSC signs: post-cardiac arrest care.' },
        { id: 13, k: 'act', t: 'Shock \u22654 J/kg (max 10 J/kg or adult dose)', d: '' },
        { id: 14, k: 'act', t: "CPR 2 min \u00b7 amiodarone or lidocaine \u00b7 H's & T's", d: 'Amiodarone 5 mg/kg bolus (up to 3 doses) or lidocaine 1 mg/kg.', next: 8 }
      ],
      seqs: [
        { n: 'Shockable pathway', steps: ['CPR + O2 + monitor/defib', 'Shock 2 J/kg', 'CPR 2 min + IV/IO', 'Shock 4 J/kg', 'CPR 2 min + epinephrine', 'Shock \u22654 J/kg', "CPR + amiodarone/lidocaine + H's & T's"] },
        { n: 'Non-shockable pathway', steps: ['CPR + O2 + monitor', 'Asystole or PEA confirmed', 'Epinephrine as soon as IV/IO is in', 'CPR 2 minutes', 'Rhythm check', "CPR + epinephrine q3\u20135 min + H's & T's"] }
      ]
    },
    {
      id: 'rosc', name: 'Post-ROSC Care', short: 'Oxygen, pressure, brain, cause', color: 'var(--co2)',
      nodes: [
        { id: 1, k: 'act', t: 'Optimize ventilation and oxygenation', d: 'Titrate FiO2 to SpO2 94\u201399%. PaCO2 35\u201345. Consider advanced airway with waveform capnography. Avoid hyperventilation.' },
        { id: 2, k: 'dec', t: 'Persistent shock?', opts: [{ l: 'Hypotensive', to: 3 }, { l: 'Normotensive', to: 4 }] },
        { id: 3, k: 'act', t: 'Hypotensive shock', d: 'Epinephrine, dopamine, norepinephrine. Consider 10\u201320 mL/kg boluses.', next: 5 },
        { id: 4, k: 'act', t: 'Normotensive shock', d: 'Dobutamine, dopamine, epinephrine, milrinone.' },
        { id: 5, k: 'act', t: 'Brain and metabolism', d: 'Treat seizures and hypoglycemia. Blood gas, electrolytes, calcium. Avoid fever. Comatose: consider targeted temperature management.' },
        { id: 6, k: 'act', t: 'Find and treat the cause', d: "Reversible causes (H's & T's), labs, imaging." },
        { id: 7, k: 'end', t: 'Expert consult and transfer', d: 'PICU or tertiary center. Keep the family informed and supported.' }
      ],
      seqs: [{ n: 'Post-ROSC priorities', steps: ['Secure airway, SpO2 94\u201399%', 'Normal PaCO2 35\u201345', 'Treat hypotension', 'Glucose and electrolytes', 'Avoid fever, treat seizures', 'Transfer to PICU'] }]
    }
  ];

  /* ---------- rhythm rush ---------- */
  const RUSH = [
    { r: 'nsr', hr: 100, p: true, g: 'normal', ctx: '5-year-old, playing, well perfused', a: 'Normal sinus rhythm', f: 'P before every QRS, normal rate for age.', nx: { q: 'Action?', ok: 'No treatment: normal rhythm for age', bad: ['Vagal maneuver to slow the rate', 'Fluid bolus 20 mL/kg, then recheck', 'Adenosine 0.1 mg/kg rapid IV push'] } },
    { r: 'stach', hr: 170, p: true, g: 'fastn', ctx: 'Toddler, 39.5 \u00b0C, crying', a: 'Sinus tachycardia', f: 'P waves present, rate varies, child under 180.', nx: { q: 'Best response?', ok: 'Antipyretic and fluids, then reassess the HR', bad: ['Adenosine 0.1 mg/kg, then reassess the HR', 'Ice to the face, then adenosine if it persists', 'Synchronized cardioversion 0.5\u20131 J/kg'] } },
    { r: 'sbrady', hr: 45, p: true, g: 'slow', ctx: 'Infant, SpO2 80%, mottled', a: 'Sinus bradycardia', f: 'Normal complexes, slow rate.', nx: { q: 'First priority?', ok: 'Bag-mask with 100% O2; CPR if HR stays < 60', bad: ['Atropine 0.02 mg/kg IV before ventilating', 'Transcutaneous pacing as the first step', 'Fluid bolus 20 mL/kg, then reassess heart rate'] } },
    { r: 'svt', hr: 280, p: true, g: 'fastn', ctx: '4-month-old, alert, pink, normal BP', a: 'Supraventricular tachycardia (SVT)', f: 'Narrow, no P waves, fixed rate \u2265220 (infant).', nx: { q: 'Stable. Next?', ok: 'Ice to the face, then adenosine 0.1 mg/kg', bad: ['Synchronized cardioversion 0.5\u20131 J/kg first', 'Amiodarone 5 mg/kg over 20\u201360 min first', 'Adenosine 0.1 mg/kg by slow IV infusion'] } },
    { r: 'svt', hr: 240, p: true, g: 'fastn', ctx: '7-year-old, hypotensive, confused', a: 'Supraventricular tachycardia (SVT)', f: 'Narrow, no P waves, fixed rate \u2265180 (child).', nx: { q: 'Unstable. Next?', ok: 'Synchronized cardioversion 0.5\u20131 J/kg', bad: ['Unsynchronized defibrillation 2 J/kg', 'Synchronized cardioversion starting at 4 J/kg', 'Amiodarone 5 mg/kg IV over 20\u201360 min'] } },
    { r: 'vt', hr: 200, p: false, g: 'wide', ctx: 'Collapsed, no pulse', a: 'Ventricular tachycardia', f: 'Wide, regular, fast. No pulse: pulseless VT.', nx: { q: 'Pulseless. Next?', ok: 'Defibrillate 2 J/kg, resume CPR at once', bad: ['Synchronized cardioversion 0.5\u20131 J/kg', 'Amiodarone 5 mg/kg bolus before shocking', 'Defibrillate 2 J/kg, then check the pulse'] } },
    { r: 'vt', hr: 190, p: true, g: 'wide', ctx: 'Teen with a pulse, BP 70/40, confused', a: 'Ventricular tachycardia', f: 'Wide (>0.09 s), regular, monomorphic.', nx: { q: 'Next?', ok: 'Synchronized cardioversion 0.5\u20131 J/kg', bad: ['Unsynchronized defibrillation 2 J/kg', 'Amiodarone 5 mg/kg IV over 20\u201360 min', 'Fluid bolus 20 mL/kg, then reassess BP'] } },
    { r: 'vf', hr: 0, p: false, g: 'arrest', ctx: 'Unresponsive, no pulse', a: 'Ventricular fibrillation', f: 'Chaotic, no organized complexes.', nx: { q: 'Next?', ok: 'Shock 2 J/kg, then resume CPR at once', bad: ['Epinephrine 0.01 mg/kg, then shock', 'Shock 2 J/kg, then check rhythm and pulse', 'Three stacked shocks, then start CPR'] } },
    { r: 'asystole', hr: 0, p: false, g: 'arrest', ctx: 'Unresponsive, no pulse, leads checked', a: 'Asystole', f: 'Flat line, confirmed in a second lead.', nx: { q: 'Next?', ok: 'CPR, epinephrine 0.01 mg/kg IV/IO now', bad: ['Shock 2 J/kg, since it could be fine VF', 'CPR, atropine 0.02 mg/kg IV/IO now', 'CPR, epinephrine 0.1 mg/kg IV/IO now'] } },
    { r: 'pea', hr: 55, p: false, g: 'arrest', ctx: 'Organized complexes, no pulse', a: 'Pulseless electrical activity (PEA)', f: 'Any organized rhythm without a pulse.', nx: { q: 'Next?', ok: 'CPR + epinephrine; search for H\'s & T\'s', bad: ['Shock 2 J/kg, then CPR for 2 minutes', 'CPR + atropine; search for H\'s & T\'s', 'Synchronized cardioversion, then resume CPR'] } },
    { r: 'avb1', hr: 90, p: true, g: 'slow', ctx: 'Asymptomatic, PR 0.30 s', a: '1st-degree AV block', f: 'Every P conducts, but the PR is longer than 0.20 s.', nx: { q: 'Action?', ok: 'Observe; no acute treatment needed', bad: ['Atropine 0.02 mg/kg to shorten the PR', 'Transcutaneous pacing as a precaution', 'Epinephrine infusion, then repeat ECG'] } },
    { r: 'mobitz1', hr: 60, p: true, g: 'slow', ctx: 'Sleeping teen, asymptomatic', a: '2nd-degree AV block type I (Wenckebach)', f: 'PR lengthens until a QRS drops.', nx: { q: 'Action?', ok: 'Observe: vagal tone during sleep', bad: ['Atropine 0.02 mg/kg, then reassess', 'Prepare transcutaneous pacing now', 'Epinephrine 0.01 mg/kg IV now'] } },
    { r: 'mobitz2', hr: 100, p: true, g: 'slow', ctx: 'Post-op child, dizzy', a: '2nd-degree AV block type II', f: 'Constant PR with sudden dropped QRS complexes.', nx: { q: 'Concern?', ok: 'Risk of complete block: pads on, ready pacing', bad: ['Benign vagal effect: observe on the ward', 'Likely dehydration: fluid bolus and observe', 'Pain and anxiety: analgesia, repeat the ECG later'] } },
    { r: 'avb3', hr: 40, p: true, g: 'slow', ctx: 'Post-op, hypotensive', a: '3rd-degree (complete) AV block', f: 'P waves and QRS complexes march independently.', nx: { q: 'Drugs fail. Next?', ok: 'Start pacing; cardiology consult', bad: ['Adenosine 0.1 mg/kg rapid push', 'Synchronized cardioversion 0.5 J/kg', 'Atropine every 3\u20135 min until HR rises'] } },
    { r: 'aflutter', hr: 150, p: true, g: 'fastn', ctx: 'Teen after heart surgery, stable', a: 'Atrial flutter', f: 'Sawtooth flutter waves.', nx: { q: 'Stable. Next?', ok: 'Cardiology consult; continuous ECG monitoring', bad: ['Unsynchronized shock 2 J/kg now', 'Atropine 0.02 mg/kg to speed conduction', 'Amiodarone and procainamide together'] } },
    { r: 'afib', hr: 130, p: true, g: 'fastn', ctx: 'Teen, palpitations, stable', a: 'Atrial fibrillation', f: 'Irregularly irregular, no P waves.', nx: { q: 'Stable. Next?', ok: 'Cardiology consult; check electrolytes', bad: ['Unsynchronized shock 2 J/kg now', 'Adenosine 0.2 mg/kg rapid push to convert', 'Vagal maneuver, then repeat ECG'] } },
    { r: 'torsades', hr: 0, p: false, g: 'wide', ctx: 'Long QT history, collapsed, no pulse', a: 'Torsades de pointes', f: 'Polymorphic VT twisting around the baseline.', nx: { q: 'Pulseless. Next?', ok: 'Shock 2 J/kg, CPR; magnesium 20\u201350 mg/kg', bad: ['Synchronized cardioversion, then magnesium', 'Shock 2 J/kg, CPR; calcium chloride 20 mg/kg', 'Magnesium 20\u201350 mg/kg IV, then CPR'] } }
  ];

  /* ---------- dose drill ---------- */
  const PATIENTS = [
    { age: '4 months', a: 0.33, w: 6 }, { age: '9 months', a: 0.75, w: 9 }, { age: '1 year', a: 1, w: 10 },
    { age: '2 years', a: 2, w: 12 }, { age: '3 years', a: 3, w: 14 }, { age: '4 years', a: 4, w: 16 },
    { age: '6 years', a: 6, w: 20 }, { age: '8 years', a: 8, w: 25 }, { age: '10 years', a: 10, w: 32 }, { age: '12 years', a: 12, w: 40 }
  ];
  const uniq = arr => arr.filter((x, i) => arr.indexOf(x) === i);
  const DRILL = [
    { n: 'Epinephrine (arrest), mg', q: 'Epinephrine IV/IO for cardiac arrest?', m: (w) => ({ a: `${f(Math.min(0.01 * w, 1))} mg`, w: [`${f(0.1 * w)} mg`, `${f(0.001 * w)} mg`, '1 mg'], note: '0.01 mg/kg, max 1 mg' }) },
    { n: 'Epinephrine (arrest), mL', q: 'Epinephrine 0.1 mg/mL: how many mL for arrest?', m: (w) => ({ a: `${f(Math.min(0.1 * w, 10))} mL`, w: [`${f(0.01 * w)} mL`, `${f(w)} mL`, `${f(0.5 * w)} mL`], note: '0.1 mL/kg of 0.1 mg/mL' }) },
    { n: 'Epinephrine ET', q: 'Epinephrine via endotracheal tube?', m: (w) => ({ a: `${f(Math.min(0.1 * w, 2.5))} mg`, w: [`${f(0.01 * w)} mg`, `${f(w)} mg`, `${f(0.03 * w)} mg`], note: '0.1 mg/kg (max 2.5 mg)' }) },
    { n: 'First shock', q: 'First defibrillation energy?', m: (w) => ({ a: `${f(2 * w)} J`, w: [`${f(4 * w)} J`, `${f(w)} J`, `${f(10 * w)} J`], note: '2 J/kg' }) },
    { n: 'Second shock', q: 'Second defibrillation energy?', m: (w) => ({ a: `${f(4 * w)} J`, w: [`${f(2 * w)} J`, `${f(10 * w)} J`, `${f(3 * w)} J`], note: '4 J/kg' }) },
    { n: 'Sync cardioversion', q: 'First synchronized cardioversion?', m: (w) => ({ a: `${f(0.5 * w)}\u2013${f(w)} J`, w: [`${f(2 * w)}\u2013${f(4 * w)} J`, `${f(0.1 * w)}\u2013${f(0.2 * w)} J`, `${f(4 * w)} J`], note: '0.5\u20131 J/kg, then 2 J/kg' }) },
    { n: 'Adenosine 1st', q: 'Adenosine, first dose?', m: (w) => ({ a: `${f(Math.min(0.1 * w, 6))} mg`, w: [`${f(Math.min(0.2 * w, 12))} mg`, `${f(0.01 * w)} mg`, `${f(Math.min(0.1 * w, 6) * 10)} mg`], note: '0.1 mg/kg rapid push, max 6 mg' }) },
    { n: 'Adenosine 2nd', q: 'Adenosine, second dose?', m: (w) => ({ a: `${f(Math.min(0.2 * w, 12))} mg`, w: [`${f(Math.min(0.1 * w, 6))} mg`, `${f(0.02 * w)} mg`, `${f(0.4 * w)} mg`], note: '0.2 mg/kg rapid push, max 12 mg' }) },
    { n: 'Atropine', q: 'Atropine for bradycardia?', m: (w) => ({ a: `${f(clamp(0.02 * w, 0.1, 0.5))} mg`, w: [`${f(0.002 * w)} mg`, `${f(0.2 * w)} mg`, '1 mg'], note: '0.02 mg/kg, min 0.1, max single 0.5 mg' }) },
    { n: 'Amiodarone (arrest)', q: 'Amiodarone bolus in VF?', m: (w) => ({ a: `${f(Math.min(5 * w, 300))} mg`, w: [`${f(15 * w)} mg`, `${f(0.5 * w)} mg`, `${f(w)} mg`], note: '5 mg/kg, max 300 mg' }) },
    { n: 'Lidocaine', q: 'Lidocaine in VF?', m: (w) => ({ a: `${f(Math.min(w, 100))} mg`, w: [`${f(5 * w)} mg`, `${f(0.1 * w)} mg`, `${f(3 * w)} mg`], note: '1 mg/kg' }) },
    { n: 'Fluid bolus', q: 'Isotonic fluid bolus for shock?', m: (w) => ({ a: `${f(20 * w)} mL`, w: [`${f(5 * w)} mL`, `${f(60 * w)} mL`, `${f(2 * w)} mL`], note: '20 mL/kg over 5\u201310 min' }) },
    { n: 'Cardiogenic bolus', q: 'Fluid bolus in cardiogenic shock?', m: (w) => ({ a: `${f(5 * w)}\u2013${f(10 * w)} mL`, w: [`${f(20 * w)}\u2013${f(40 * w)} mL`, `${f(w)}\u2013${f(2 * w)} mL`, `${f(60 * w)} mL`], note: '5\u201310 mL/kg over 10\u201320 min' }) },
    { n: 'D10W', q: 'D10W for hypoglycemia?', m: (w) => ({ a: `${f(5 * w)}\u2013${f(10 * w)} mL`, w: [`${f(w)}\u2013${f(2 * w)} mL`, `${f(20 * w)}\u2013${f(40 * w)} mL`, '50 mL of D50'], note: '0.5\u20131 g/kg = 5\u201310 mL/kg D10W' }) },
    { n: 'Naloxone', q: 'Naloxone for opioid overdose?', m: (w) => { const a = w <= 20 ? 0.1 * w : 2; return { a: `${f(a)} mg`, w: [`${f(a / 10)} mg`, `${f(a * 5)} mg`, `${f(0.01 * w * 0.5)} mg`], note: '0.1 mg/kg (<5 y or \u226420 kg), else 2 mg; max 2 mg' }; } },
    { n: 'Epinephrine IM', q: 'Epinephrine IM for anaphylaxis (1 mg/mL)?', m: (w) => ({ a: `${f(Math.min(0.01 * w, 0.5))} mg`, w: [`${f(0.1 * w)} mg`, `${f(0.001 * w)} mg`, '1 mg'], note: '0.01 mg/kg IM, lateral thigh' }) },
    { n: 'Procainamide', q: 'Procainamide infusion?', m: (w) => ({ a: `${f(15 * w)} mg`, w: [`${f(5 * w)} mg`, `${f(1.5 * w)} mg`, `${f(50 * w)} mg`], note: '15 mg/kg over 30\u201360 min' }) },
    { n: 'Sodium bicarbonate', q: 'Sodium bicarbonate?', m: (w) => ({ a: `${f(Math.min(w, 50))} mEq`, w: [`${f(10 * w)} mEq`, `${f(0.1 * w)} mEq`, `${f(3 * w)} mEq`], note: '1 mEq/kg slow, max 50 mEq' }) }
  ];
  const DRILL_AGE = [
    { n: 'Hypotension threshold', q: a => `Systolic BP below which a ${a}-year-old is hypotensive?`, m: a => ({ a: `${70 + 2 * a} mmHg`, w: uniq([`${90} mmHg`, `${70 + a} mmHg`, `${60 + 2 * a} mmHg`, `${80 + 2 * a} mmHg`, `${50 + 2 * a} mmHg`]).filter(x => x !== `${70 + 2 * a} mmHg`).slice(0, 3), note: '70 + (2 \u00d7 age) for ages 1\u201310' }), ok: a => a >= 1 && a <= 10 },
    { n: 'ETT size', q: a => `Cuffed endotracheal tube size for a ${a}-year-old?`, m: a => ({ a: `${f(a / 4 + 3.5)} mm`, w: uniq([`${f(a / 4 + 5)} mm`, `${f(a / 2 + 3.5)} mm`, `${f(a / 4 + 2)} mm`, `${f(a / 4 + 6)} mm`]).slice(0, 3), note: 'Cuffed: (age \u00f7 4) + 3.5 \u00b7 uncuffed: (age \u00f7 4) + 4. Standard formula, not from the handbook.' }), ok: a => a >= 2 }
  ];

  /* ---------- flashcards ---------- */
  const CARDS = [
    ['BLS', 'Compression rate?', '100\u2013120 per minute'],
    ['BLS', 'Compression depth, infant and child?', '1/3 of the chest depth: about 4 cm (1.5 in) in infants, about 5 cm (2 in) in children'],
    ['BLS', 'Compression-to-breath ratio, one rescuer?', '30:2 (infant and child)'],
    ['BLS', 'Ratio with two rescuers?', '15:2'],
    ['BLS', 'Pulse check site in an infant?', 'Brachial artery, inside of the upper arm (femoral also acceptable)'],
    ['BLS', 'Pulse check site in a child?', 'Carotid or femoral'],
    ['BLS', 'Longest allowed pulse check?', '10 seconds'],
    ['BLS', 'Alone, unwitnessed collapse: when do you call EMS?', 'After about 2 minutes (5 cycles) of CPR'],
    ['BLS', 'Alone, witnessed sudden collapse: first step?', 'Call EMS and get the AED, then start CPR'],
    ['BLS', 'Pulse present but not breathing: breath rate?', '1 breath every 2\u20133 seconds'],
    ['BLS', 'Pulse present but HR under 60 with poor perfusion?', 'Start CPR'],
    ['BLS', 'Infant compressions with two rescuers?', 'Two-thumb encircling hands'],
    ['BLS', 'Is gasping effective breathing?', 'No. Agonal gasps mean not breathing: start CPR'],
    ['BLS', 'AED pad placement on a child?', 'Upper right chest and lower left side; if they would touch, front and back'],
    ['BLS', 'No pediatric pads available?', 'Use adult pads, making sure they do not touch'],
    ['BLS', 'Right after an AED shock?', 'Resume CPR immediately for 2 minutes; no pulse check'],
    ['BLS', 'Infant choking, silent, cannot cough?', '5 back slaps + 5 chest thrusts, repeat. No abdominal thrusts under 1 year'],
    ['BLS', 'Blind finger sweeps?', 'Never. Remove an object only if you can see it'],
    ['Assess', 'ABCDE?', 'Airway, Breathing, Circulation, Disability, Exposure'],
    ['Assess', 'AVPU?', 'Alert, responds to Voice, responds to Pain, Unresponsive'],
    ['Assess', 'SPAM (secondary survey history)?', 'Signs & symptoms, Past medical history, Allergies, Medications'],
    ['Assess', 'Normal capillary refill?', '2 seconds or less'],
    ['Assess', 'Hypotension, ages 1\u201310?', 'Systolic under 70 + (2 \u00d7 age in years)'],
    ['Assess', 'Hypotension, infant (1\u201312 months)?', 'Systolic under 70 mmHg'],
    ['Assess', 'Hypotension, neonate?', 'Systolic under 60 mmHg'],
    ['Assess', 'Hypotension, over 10 years?', 'Systolic under 90 mmHg'],
    ['Assess', 'Hypoxemia in a child (room air)?', 'SpO2 under 94%'],
    ['Assess', 'Hypoglycemia threshold?', '60 mg/dL or less'],
    ['Assess', 'Normal awake HR, child 2\u201310 y (handbook)?', '60\u2013140'],
    ['Assess', 'Normal awake HR, 3 months to 1 year (handbook)?', '100\u2013190'],
    ['Resp', 'Stridor suggests?', 'Upper airway obstruction (croup, foreign body, anaphylaxis)'],
    ['Resp', 'Wheeze suggests?', 'Lower airway obstruction (asthma, bronchiolitis)'],
    ['Resp', 'Grunting suggests?', 'Lung tissue disease (pneumonia, pulmonary edema)'],
    ['Resp', 'Breathing slows after a period of distress. Meaning?', 'Impending respiratory arrest'],
    ['Resp', 'Head bobbing in an infant?', 'A sign of respiratory distress'],
    ['Resp', 'Longest suction attempt?', '10 seconds, then give oxygen'],
    ['Resp', 'OPA sizing and rule?', 'Corner of the mouth to the earlobe. Only with no cough or gag reflex'],
    ['Resp', 'NPA sizing and rule?', 'Nose tip to earlobe. OK with an intact gag. Caution in facial fractures'],
    ['Resp', 'Croup treatments?', 'Dexamethasone, nebulized epinephrine, oxygen (heliox); intubate if failing'],
    ['Resp', 'Asthma treatments?', 'Albuterol \u00b1 ipratropium, corticosteroids, magnesium sulfate, epinephrine'],
    ['Resp', 'How long to squeeze each bag-mask breath?', 'Over 1 second, just until the chest rises'],
    ['Resp', 'E-C clamp?', 'Thumb and index make a C on the mask; the other three fingers (E) lift the jaw into the mask'],
    ['Brady', 'Most common cause of pediatric bradycardia?', 'Hypoxia'],
    ['Brady', 'Bradycardia: when do you start CPR?', 'HR under 60 with poor perfusion despite oxygenation and ventilation'],
    ['Brady', 'First-line drug for symptomatic bradycardia?', 'Epinephrine 0.01 mg/kg IV/IO every 3\u20135 min'],
    ['Brady', 'Atropine dose?', '0.02 mg/kg, min 0.1 mg, max single dose 0.5 mg; may repeat once'],
    ['Brady', 'Why a minimum atropine dose?', 'Under 0.1 mg can cause paradoxical bradycardia'],
    ['Brady', 'When is atropine preferred?', 'Increased vagal tone or a primary AV block'],
    ['Brady', 'Complete heart block, drugs fail?', 'Pacing plus expert consultation'],
    ['Tachy', 'Narrow vs wide QRS cutoff?', 'Narrow 0.09 s or less; wide over 0.09 s'],
    ['Tachy', 'Sinus tach vs SVT rate, infant?', 'Sinus usually under 220; SVT usually 220 or more'],
    ['Tachy', 'Sinus tach vs SVT rate, child?', 'Sinus usually under 180; SVT usually 180 or more'],
    ['Tachy', 'Stable SVT, first step?', 'Vagal maneuvers (ice to the face in infants)'],
    ['Tachy', 'Adenosine doses?', '0.1 mg/kg (max 6 mg), then 0.2 mg/kg (max 12 mg), rapid push with flush'],
    ['Tachy', 'Synchronized cardioversion energy?', '0.5\u20131 J/kg, then 2 J/kg'],
    ['Tachy', 'Wide-complex tachycardia is ___ until proven otherwise.', 'VT'],
    ['Tachy', 'Stable wide-complex: drugs?', 'Amiodarone 5 mg/kg over 20\u201360 min OR procainamide 15 mg/kg over 30\u201360 min, not both; expert consult'],
    ['Tachy', 'Torsades de pointes drug?', 'Magnesium sulfate 20\u201350 mg/kg (max 2 g)'],
    ['Shock', 'Four types of shock?', 'Hypovolemic, distributive, cardiogenic, obstructive'],
    ['Shock', 'Most common type of shock in children?', 'Hypovolemic'],
    ['Shock', 'Standard fluid bolus?', '20 mL/kg isotonic crystalloid over 5\u201310 min, then reassess'],
    ['Shock', 'Cardiogenic shock bolus?', '5\u201310 mL/kg over 10\u201320 min, cautiously'],
    ['Shock', 'Hemorrhage crystalloid ratio?', '3 mL crystalloid per 1 mL blood lost; packed red cells early if no response'],
    ['Shock', 'First treatment for anaphylaxis?', 'IM epinephrine'],
    ['Shock', 'Septic shock: cold vs warm vasoactive?', 'Cold: epinephrine. Warm: norepinephrine'],
    ['Shock', 'Tension pneumothorax treatment?', 'Needle decompression, then a chest tube'],
    ['Shock', 'Cardiac tamponade clues and treatment?', 'Muffled heart sounds, pulsus paradoxus; pericardiocentesis'],
    ['Shock', 'Urine output goal?', '1 mL/kg/h or more (larger children over 30 mL/h)'],
    ['Shock', 'Earliest sign of compensated shock?', 'Tachycardia'],
    ['Shock', 'Neurogenic shock clue?', 'Hypotension with an inappropriately slow heart rate'],
    ['Shock', 'Warm vs cold distributive shock?', 'Warm: flushed skin, wide pulse pressure. Cold: pale, vasoconstricted, narrow pulse pressure'],
    ['Arrest', 'Shockable rhythms?', 'VF and pulseless VT'],
    ['Arrest', 'Non-shockable rhythms?', 'Asystole and PEA'],
    ['Arrest', 'Defibrillation energies?', '2 J/kg, then 4 J/kg, then 4 J/kg or more (max 10 J/kg or adult dose)'],
    ['Arrest', 'Arrest epinephrine dose?', '0.01 mg/kg IV/IO (0.1 mL/kg of 0.1 mg/mL), max 1 mg, every 3\u20135 min'],
    ['Arrest', 'Endotracheal epinephrine dose?', '0.1 mg/kg'],
    ['Arrest', 'Non-shockable: when is the first epinephrine?', 'As soon as IV/IO access is available'],
    ['Arrest', 'Shockable: when is the first epinephrine?', 'After the 2nd shock'],
    ['Arrest', 'Amiodarone in arrest?', '5 mg/kg bolus; may repeat up to 2 more times for refractory VF/pVT'],
    ['Arrest', 'Lidocaine in arrest?', '1 mg/kg IV/IO'],
    ['Arrest', "The H's?", 'Hypovolemia, Hypoxia, H+ (acidosis), Hypo/hyperkalemia, Hypoglycemia, Hypothermia'],
    ['Arrest', "The T's?", 'Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary and coronary), Trauma'],
    ['Arrest', 'Breaths with an advanced airway?', '1 every 2\u20133 s (20\u201330/min), with continuous compressions'],
    ['Arrest', 'Swap compressors every\u2026?', '2 minutes'],
    ['Arrest', 'Preferred drug route order?', 'IV, then IO, then ET'],
    ['Arrest', 'Usual cause of pediatric arrest?', 'Respiratory failure or shock. Sudden VF is under 10%'],
    ['Arrest', 'A flat line on the monitor: first step?', 'Check leads, gain and power; confirm in a second lead'],
    ['ROSC', 'Post-ROSC SpO2 target?', '94\u201399%'],
    ['ROSC', 'Post-ROSC PaCO2 target?', '35\u201345 mmHg'],
    ['ROSC', 'Hypotensive shock after ROSC: drugs?', 'Epinephrine, dopamine, norepinephrine'],
    ['ROSC', 'Normotensive shock after ROSC: drugs?', 'Dobutamine, dopamine, epinephrine, milrinone'],
    ['ROSC', 'Comatose after ROSC?', 'Consider targeted temperature management (32\u201334 \u00b0C in the handbook); always avoid fever'],
    ['Team', 'Closed-loop communication?', 'Leader gives a clear order, member repeats it back, member reports when done, leader confirms'],
    ['Team', 'IO contraindications?', 'Fracture, bony malformation, infection at the insertion site'],
    ['Team', 'IO site in young children?', 'Proximal tibia, below the tibial tuberosity'],
    ['Team', 'Can every IV drug go IO?', 'Yes, without dose adjustment'],
    ['Shock', 'Fluid bolus in cardiogenic shock?', '5\u201310 mL/kg over 10\u201320 min, then reassess. Support contractility with inotropes; call an expert early'],
    ['Shock', 'Cardiogenic vs hypovolemic shock: key clues?', 'Cardiogenic: much higher work of breathing (grunting, flaring), crackles, big liver, distended neck veins'],
    ['Shock', 'Obstructive shock: four causes?', 'Tension pneumothorax, cardiac tamponade, ductal-dependent heart lesions, pulmonary embolism'],
    ['Resp', 'Asthma: first-line treatment?', 'Oxygen, nebulized albuterol + ipratropium, early corticosteroids'],
    ['Resp', 'Refractory asthma drug and dose?', 'Magnesium sulfate 20\u201350 mg/kg IV over 10\u201320 min (max 2 g)'],
    ['Resp', 'Wheeze goes quiet and the child is drowsy?', 'Ominous: almost no air movement. Impending respiratory failure'],
    ['Resp', 'Grunting suggests?', 'Lung tissue disease (e.g. pneumonia): the child is trying to keep alveoli open'],
    ['ROSC', 'Post-ROSC hypotension: what do you do?', 'Treat it right away: 10\u201320 mL/kg boluses, then epinephrine, dopamine or norepinephrine'],
    ['BLS', 'Infant compression technique (2025)?', 'Two-thumb encircling hands for one or two rescuers; heel of one hand if you cannot encircle the chest (no more 2-finger technique)']
  ].map(([c, q, a], i) => ({ id: 'k' + i, c, q, a }));

  /* Normal vitals (handbook Table 5) */
  const VITALS = [
    { n: 'Neonate', max: 0.08, hrA: '85\u2013190', hrS: '80\u2013160', sbp: '60\u201375', dbp: '30\u201345', hypo: '< 60' },
    { n: '1 month', max: 0.13, hrA: '85\u2013190', hrS: '80\u2013160', sbp: '70\u201395', dbp: '35\u201355', hypo: '< 70' },
    { n: '2 months', max: 0.21, hrA: '85\u2013190', hrS: '80\u2013160', sbp: '70\u201395', dbp: '40\u201360', hypo: '< 70' },
    { n: '3 months', max: 0.4, hrA: '100\u2013190', hrS: '75\u2013160', sbp: '80\u2013100', dbp: '45\u201365', hypo: '< 70' },
    { n: '6 months', max: 0.9, hrA: '100\u2013190', hrS: '75\u2013160', sbp: '85\u2013105', dbp: '45\u201370', hypo: '< 70' },
    { n: '1 year', max: 1.9, hrA: '100\u2013190', hrS: '75\u2013160', sbp: '85\u2013105', dbp: '40\u201360', hypo: '< 72' },
    { n: '2 years', max: 2.4, hrA: '100\u2013140', hrS: '60\u201390', sbp: '85\u2013105', dbp: '40\u201365', hypo: '< 74' },
    { n: 'Child 2\u201310 y', max: 10.4, hrA: '60\u2013140', hrS: '60\u201390', sbp: '95\u2013115', dbp: '55\u201375', hypo: '< 70 + 2\u00d7age' },
    { n: 'Adolescent', max: 99, hrA: '60\u2013100', hrS: '50\u201390', sbp: '110\u2013130', dbp: '65\u201385', hypo: '< 90' }
  ];

  return { f, clamp, ZONES, zoneFor, ACTIONS, GROUPS, NEEDS_IO, NEEDS_PADS, OK_TEXT, WHY, GENERIC_WHY, DOSE, HTS, CASES, ALGOS, RUSH, PATIENTS, DRILL, DRILL_AGE, CARDS, VITALS };
})();
