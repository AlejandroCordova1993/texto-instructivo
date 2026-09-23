export const STAGES = [
  { id: 'intro', number: '01', group: 'Comprende', label: 'Una orden ambigua', description: 'Por qué importa escribir con precisión', minutes: '8 min', points: 'Sin puntaje' },
  { id: 'forensic', number: '02', group: 'Comprende', label: 'Detecta errores', description: 'Ambigüedades, contradicciones y vacíos', minutes: '12 min', points: 'Hasta 4 puntos' },
  { id: 'verbal', number: '03', group: 'Practica', label: 'Modos verbales', description: 'Una forma verbal para todo el texto', minutes: '8 min', points: 'Hasta 2 puntos' },
  { id: 'sequence', number: '04', group: 'Practica', label: 'Ordena los pasos', description: 'Una secuencia que se pueda seguir', minutes: '8 min', points: 'Hasta 2 puntos' },
  { id: 'safety-sheet', number: '05', group: 'Produce', label: 'Escribe tu texto', description: 'Texto instructivo final: preparación y procedimiento', minutes: '15 min', points: 'Hasta 2 puntos' },
  { id: 'results', number: '06', group: 'Produce', label: 'Revisa y entrega', description: 'Puntaje, mejoras y texto imprimible', minutes: '5 min', points: 'Resumen' },
];

export function restoreSequenceSteps(steps, savedOrder) {
  if (!Array.isArray(savedOrder) || savedOrder.length !== steps.length) return [...steps];
  const byId = new Map(steps.map((step) => [step.id, step]));
  if (new Set(savedOrder).size !== steps.length) return [...steps];
  const restored = savedOrder.map((id) => byId.get(id));
  return restored.every(Boolean) ? restored : [...steps];
}

export const CONNECTOR_LIST = [
  'inicialmente', 'en primer lugar', 'antes de operar',
  'posteriormente', 'seguidamente', 'a continuación', 'luego',
  'finalmente', 'por último', 'al concluir',
];

const CONNECTOR_PATTERNS = CONNECTOR_LIST.map(
  (connector) => new RegExp(`(?<![\\p{L}\\p{N}])${connector}(?![\\p{L}\\p{N}])`, 'u')
);

export function countConnectors(text = '') {
  const lower = text.toLocaleLowerCase('es').replace(/\bdesde\s+luego\b/gu, ' ');
  return CONNECTOR_LIST.filter((_, index) => CONNECTOR_PATTERNS[index].test(lower));
}

const attemptFactor = (attempts) => {
  if (attempts <= 1) return 1;
  if (attempts === 2) return 0.5;
  return 0.25;
};

export function calculateScores(progress, meta = {}) {
  const forensic = Object.values(progress.forensicAnswers || {}).reduce(
    (sum, answer) => sum + (answer.isCorrect ? 0.5 * attemptFactor(answer.attempts) : 0), 0
  );
  const perItem = 2 / (meta.antiComodinCount || 6);
  const antiComodin = Object.values(progress.antiComodinAnswers || {}).reduce(
    (sum, answer) => sum + (answer.isCorrect ? perItem * attemptFactor(answer.attempts) : 0), 0
  );
  const verbal = progress.verbalExerciseAnswer === 'unificar'
    ? 2 * attemptFactor(progress.verbalAttempts)
    : 0;
  const sequence = progress.sequenceCompleted
    ? 2 * attemptFactor(progress.sequenceChecks)
    : 0;

  const sheet = progress.safetySheet || {};
  const picked = sheet.selectedEpp || [];
  const required = meta.requiredEpp || [];
  const traps = meta.trapEpp || [];
  let safetySheet = 0;
  if (required.length) {
    const allRequired = required.every((id) => picked.includes(id));
    const noTraps = !picked.some((id) => traps.includes(id));
    if (allRequired && noTraps) safetySheet += 1;
    else if (allRequired) safetySheet += 0.5;
  }
  const paragraph1 = (sheet.paragraph1 || '').trim();
  const paragraph2 = (sheet.paragraph2 || '').trim();
  const connectors = countConnectors(paragraph2);
  if (paragraph1.length >= 120 && paragraph2.length >= 120 && connectors.length >= 2) safetySheet += 1;
  else if (paragraph1.length >= 40 && paragraph2.length >= 40 && connectors.length >= 1) safetySheet += 0.5;

  const round = (value) => Number(value.toFixed(2));
  const scores = {
    forensic: round(Math.min(2, forensic)),
    antiComodin: round(Math.min(2, antiComodin)),
    verbal: round(Math.min(2, verbal)),
    sequence: round(Math.min(2, sequence)),
    safetySheet: round(Math.min(2, safetySheet)),
    total: 0,
  };
  scores.total = Number(Math.min(10, scores.forensic + scores.antiComodin + scores.verbal + scores.sequence + scores.safetySheet).toFixed(1));
  return scores;
}

export function resetSequenceProgress(progress) {
  if (progress.sequenceCompleted) return progress;
  return { ...progress, sequenceOrder: [] };
}

export function getDraftReadiness(sheet = {}, equipment = []) {
  const selected = sheet.selectedEpp || [];
  const required = equipment.filter((item) => item.required).map((item) => item.id);
  const excluded = equipment.filter((item) => !item.required).map((item) => item.id);
  const paragraph1 = (sheet.paragraph1 || '').trim();
  const paragraph2 = (sheet.paragraph2 || '').trim();
  const connectors = countConnectors(paragraph2);
  const checks = {
    epp: required.length > 0 && required.every((id) => selected.includes(id)) && !excluded.some((id) => selected.includes(id)),
    preparation: paragraph1.length >= 120,
    procedure: paragraph2.length >= 120,
    connectors: connectors.length >= 2,
  };

  return { checks, ready: Object.values(checks).every(Boolean), connectors };
}

export function getModuleStatus(progress, { flawsCount = 0, antiComodinCount = 0, safetyEquipments = [] } = {}) {
  const forensic = Object.values(progress.forensicAnswers || {});
  const vocabulary = Object.values(progress.antiComodinAnswers || {});
  const sheet = progress.safetySheet || {};
  const hasDraft = Boolean(sheet.paragraph1?.trim() || sheet.paragraph2?.trim() || sheet.selectedEpp?.length);
  const draft = getDraftReadiness(sheet, safetyEquipments);
  const state = (done, started) => done ? 'done' : started ? 'started' : 'todo';

  return {
    intro: state(Boolean(progress.introAnswered && progress.caseAnalysisAnswer), Boolean(progress.introAnswered || progress.caseAnalysisAnswer)),
    forensic: state(
      flawsCount > 0 && antiComodinCount > 0 &&
        forensic.filter((answer) => answer.isCorrect).length >= flawsCount &&
        vocabulary.filter((answer) => answer.isCorrect).length >= antiComodinCount,
      forensic.length + vocabulary.length > 0,
    ),
    verbal: state(progress.verbalExerciseAnswer === 'unificar', progress.verbalExerciseAnswer != null),
    sequence: state(Boolean(progress.sequenceCompleted), Boolean(progress.sequenceOrder?.length || progress.sequenceChecks)),
    'safety-sheet': state(draft.ready, hasDraft),
    results: state(Boolean(progress.resultsReviewed && draft.ready), Boolean(progress.resultsReviewed || hasDraft)),
  };
}
