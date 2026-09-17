import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

const StudentContext = createContext();

const STORAGE_KEY = 'taller_texto_instructivo_v3';
// Claves de versiones anteriores: se purgan al reiniciar para que no quede
// avance huérfano en los equipos del laboratorio.
const LEGACY_KEYS = [
  'taller_texto_instructivo_v2',
  'taller_texto_instructivo_v1',
];

const SPECIALTY_IDS = ['automotriz', 'industrial'];

// Ya no se pide nombre ni curso: el estudiante escribe su nombre a mano en
// la ficha impresa. Lo único que el taller necesita saber es la carrera.
const INITIAL_SESSION = {
  specialty: 'automotriz',
  hasChosen: false,
};

const emptyProgress = () => ({
  introAnswered: null,      // activación de conocimientos previos
  caseAnalysisAnswer: null, // análisis del informe de contingencia
  forensicAnswers: {},      // { [caseId]: { answer, isCorrect, attempts } }
  antiComodinAnswers: {},
  verbalMode: 'infinitivo',
  verbalExerciseAnswer: null,
  verbalAttempts: 0,
  sequenceOrder: [],
  sequenceCompleted: false,
  sequenceChecks: 0,
  safetySheet: {
    selectedEpp: [],
    verbalModeChosen: 'infinitivo',
    paragraph1: '',
    paragraph2: '',
  },
  scores: {
    forensic: 0,
    antiComodin: 0,
    verbal: 0,
    sequence: 0,
    safetySheet: 0,
    total: 0,
  },
});

const emptyBook = () => ({
  automotriz: emptyProgress(),
  industrial: emptyProgress(),
});

/* El crédito depende del intento. Se puede reintentar para aprender, pero
 * repetir a ciegas ya no garantiza el puntaje completo. */
const attemptFactor = (attempts) => {
  if (attempts <= 1) return 1;
  if (attempts === 2) return 0.5;
  return 0.25;
};

const CONNECTORS = [
  'inicialmente', 'en primer lugar', 'antes de operar',
  'posteriormente', 'seguidamente', 'a continuación', 'luego',
  'finalmente', 'por último', 'al concluir',
];

export const CONNECTOR_LIST = CONNECTORS;

export const countConnectors = (text = '') => {
  const lower = text.toLowerCase();
  return CONNECTORS.filter((c) => lower.includes(c));
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

// Rellena cualquier campo que falte, para que una copia guardada por una
// versión anterior nunca reviente el render.
function hydrateBook(raw) {
  const base = emptyBook();
  if (!raw) return base;
  for (const id of SPECIALTY_IDS) {
    const src = raw[id];
    if (!src) continue;
    base[id] = {
      ...base[id],
      ...src,
      forensicAnswers: src.forensicAnswers || {},
      antiComodinAnswers: src.antiComodinAnswers || {},
      safetySheet: { ...base[id].safetySheet, ...(src.safetySheet || {}) },
      scores: { ...base[id].scores, ...(src.scores || {}) },
    };
  }
  return base;
}

export function StudentProvider({ children }) {
  const [session, setSession] = useState(() =>
    ({ ...INITIAL_SESSION, ...readJSON(`${STORAGE_KEY}_session`, {}) })
  );

  const [book, setBook] = useState(() =>
    hydrateBook(readJSON(`${STORAGE_KEY}_progress`, null))
  );

  const specialty = SPECIALTY_IDS.includes(session.specialty) ? session.specialty : 'automotriz';
  const progress = book[specialty];

  /* Escritura diferida: el módulo 05 tiene dos campos largos y cada
   * pulsación serializaba todo el avance. */
  const writeTimer = useRef(null);
  useEffect(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(session));
        localStorage.setItem(`${STORAGE_KEY}_progress`, JSON.stringify(book));
      } catch (e) {
        console.warn('No se pudo guardar el avance en este equipo.', e);
      }
    }, 400);
    return () => clearTimeout(writeTimer.current);
  }, [session, book]);

  // Ante un cierre brusco (se va la luz en el laboratorio), vaciar al salir.
  useEffect(() => {
    const flush = () => {
      try {
        localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(session));
        localStorage.setItem(`${STORAGE_KEY}_progress`, JSON.stringify(book));
      } catch { /* almacenamiento no disponible */ }
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, [session, book]);

  const recalc = useCallback((p, meta) => {
    const forensic = Object.values(p.forensicAnswers).reduce(
      (sum, a) => sum + (a.isCorrect ? 0.5 * attemptFactor(a.attempts) : 0), 0
    );

    const perItem = 2 / (meta?.antiComodinCount || 6);
    const antiComodin = Object.values(p.antiComodinAnswers).reduce(
      (sum, a) => sum + (a.isCorrect ? perItem * attemptFactor(a.attempts) : 0), 0
    );

    const verbal = p.verbalExerciseAnswer === 'unificar'
      ? 2 * attemptFactor(p.verbalAttempts)
      : 0;

    const sequence = p.sequenceCompleted ? 2 * attemptFactor(p.sequenceChecks) : 0;

    let safetySheet = 0;
    const required = meta?.requiredEpp || [];
    const traps = meta?.trapEpp || [];
    const picked = p.safetySheet.selectedEpp || [];
    if (required.length) {
      const allRequired = required.every((id) => picked.includes(id));
      const noTraps = !picked.some((id) => traps.includes(id));
      if (allRequired && noTraps) safetySheet += 1;
      else if (allRequired) safetySheet += 0.5;
    }
    const p1 = (p.safetySheet.paragraph1 || '').trim();
    const p2 = (p.safetySheet.paragraph2 || '').trim();
    const connectors = countConnectors(p2);
    if (p1.length >= 120 && p2.length >= 120 && connectors.length >= 2) safetySheet += 1;
    else if (p1.length >= 40 && p2.length >= 40 && connectors.length >= 1) safetySheet += 0.5;

    const round = (n) => Number(n.toFixed(2));
    const scores = {
      forensic: round(Math.min(2, forensic)),
      antiComodin: round(Math.min(2, antiComodin)),
      verbal: round(Math.min(2, verbal)),
      sequence: round(Math.min(2, sequence)),
      safetySheet: round(Math.min(2, safetySheet)),
      total: 0,
    };
    scores.total = Number(
      Math.min(10, scores.forensic + scores.antiComodin + scores.verbal + scores.sequence + scores.safetySheet)
        .toFixed(1)
    );
    return scores;
  }, []);

  const metaRef = useRef({});
  const registerMeta = useCallback((meta) => {
    metaRef.current = { ...metaRef.current, ...meta };
  }, []);

  const mutate = useCallback((fn) => {
    setBook((prev) => {
      const current = prev[specialty];
      const next = fn(current);
      if (next === current) return prev;
      next.scores = recalc(next, metaRef.current);
      return { ...prev, [specialty]: next };
    });
  }, [specialty, recalc]);

  /* --- Sesión --- */

  const chooseSpecialty = (id) => {
    setSession({
      specialty: SPECIALTY_IDS.includes(id) ? id : 'automotriz',
      hasChosen: true,
    });
  };

  const setSpecialty = (id) => {
    if (!SPECIALTY_IDS.includes(id)) return;
    setSession((prev) => ({ ...prev, specialty: id }));
  };

  // Un laboratorio de cómputo es un equipo compartido: hace falta una forma
  // de dejarlo limpio para el siguiente estudiante.
  const startOver = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_session`);
      localStorage.removeItem(`${STORAGE_KEY}_progress`);
      for (const key of LEGACY_KEYS) {
        localStorage.removeItem(`${key}_session`);
        localStorage.removeItem(`${key}_student`);
        localStorage.removeItem(`${key}_progress`);
      }
    } catch { /* almacenamiento no disponible */ }
    setBook(emptyBook());
    setSession({ ...INITIAL_SESSION });
  };

  /* --- Actividades --- */

  const answerIntro = (key) => {
    mutate((p) => (p.introAnswered ? p : { ...p, introAnswered: key }));
  };

  const answerCaseAnalysis = (key) => {
    mutate((p) => (p.caseAnalysisAnswer ? p : { ...p, caseAnalysisAnswer: key }));
  };

  const submitForensicAnswer = (caseId, answer, isCorrect) => {
    mutate((p) => {
      const prev = p.forensicAnswers[caseId];
      if (prev?.isCorrect) return p;
      const attempts = (prev?.attempts || 0) + 1;
      return {
        ...p,
        forensicAnswers: { ...p.forensicAnswers, [caseId]: { answer, isCorrect, attempts } },
      };
    });
  };

  const submitAntiComodin = (termId, answer, isCorrect) => {
    mutate((p) => {
      const prev = p.antiComodinAnswers[termId];
      if (prev?.isCorrect) return p;
      const attempts = (prev?.attempts || 0) + 1;
      return {
        ...p,
        antiComodinAnswers: { ...p.antiComodinAnswers, [termId]: { answer, isCorrect, attempts } },
      };
    });
  };

  const setVerbalMode = (mode) => mutate((p) => ({ ...p, verbalMode: mode }));

  const submitVerbalExercise = (answerKey) => {
    mutate((p) => {
      if (p.verbalExerciseAnswer === 'unificar') return p;
      return { ...p, verbalExerciseAnswer: answerKey, verbalAttempts: (p.verbalAttempts || 0) + 1 };
    });
  };

  const setSequenceOrder = (orderedIds) => {
    mutate((p) => (p.sequenceCompleted ? p : { ...p, sequenceOrder: orderedIds }));
  };

  const checkSequence = (orderedIds, isCorrect) => {
    mutate((p) => {
      if (p.sequenceCompleted) return p;
      return {
        ...p,
        sequenceOrder: orderedIds,
        sequenceCompleted: isCorrect,
        sequenceChecks: (p.sequenceChecks || 0) + 1,
      };
    });
  };

  const resetSequence = () => {
    mutate((p) => ({
      ...p,
      sequenceOrder: null,
      sequenceCompleted: false,
    }));
  };

  const updateSafetySheet = (data) => {
    mutate((p) => ({ ...p, safetySheet: { ...p.safetySheet, ...data } }));
  };

  const toggleEpp = (eppId) => {
    mutate((p) => {
      const current = p.safetySheet.selectedEpp || [];
      const next = current.includes(eppId)
        ? current.filter((id) => id !== eppId)
        : [...current, eppId];
      return { ...p, safetySheet: { ...p.safetySheet, selectedEpp: next } };
    });
  };

  const resetProgress = () => {
    setBook((prev) => ({ ...prev, [specialty]: emptyProgress() }));
  };

  /* Estado de cada módulo, para el indicador de avance del encabezado.
   * 'done' | 'started' | 'todo' — el estudiante necesita ver dónde va. */
  const moduleStatus = useMemo(() => {
    const s = progress.scores;
    const state = (score, max, started) =>
      score >= max * 0.999 ? 'done' : (started ? 'started' : 'todo');

    const p1 = (progress.safetySheet.paragraph1 || '').trim();
    const p2 = (progress.safetySheet.paragraph2 || '').trim();

    return {
      intro: (progress.introAnswered && progress.caseAnalysisAnswer) ? 'done' : (progress.introAnswered || progress.caseAnalysisAnswer ? 'started' : 'todo'),
      forensic: state(
        s.forensic + s.antiComodin, 4,
        Object.keys(progress.forensicAnswers).length + Object.keys(progress.antiComodinAnswers).length > 0
      ),
      verbal: state(s.verbal, 2, progress.verbalExerciseAnswer !== null),
      sequence: state(s.sequence, 2, (progress.sequenceChecks || 0) > 0),
      'safety-sheet': state(
        s.safetySheet, 2,
        (progress.safetySheet.selectedEpp || []).length > 0 || p1.length > 0 || p2.length > 0
      ),
      results: s.total > 0 ? 'started' : 'todo',
    };
  }, [progress]);

  return (
    <StudentContext.Provider
      value={{
        session,
        specialty,
        hasChosen: session.hasChosen,
        progress,
        scores: progress.scores,
        moduleStatus,
        registerMeta,
        chooseSpecialty,
        setSpecialty,
        startOver,
        answerIntro,
        answerCaseAnalysis,
        submitForensicAnswer,
        submitAntiComodin,
        setVerbalMode,
        submitVerbalExercise,
        setSequenceOrder,
        checkSequence,
        resetSequence,
        updateSafetySheet,
        toggleEpp,
        resetProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent debe usarse dentro de un StudentProvider');
  }
  return context;
}
