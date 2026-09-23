import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { calculateScores, getModuleStatus, resetSequenceProgress } from '../lib/workshop';

export { CONNECTOR_LIST, countConnectors } from '../lib/workshop';

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
  resultsReviewed: false,
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

  const metaRef = useRef({});
  const registerMeta = useCallback((meta) => {
    metaRef.current = { ...metaRef.current, ...meta };
  }, []);

  const mutate = useCallback((fn) => {
    setBook((prev) => {
      const current = prev[specialty];
      const next = fn(current);
      if (next === current) return prev;
      next.scores = calculateScores(next, metaRef.current);
      return { ...prev, [specialty]: next };
    });
  }, [specialty]);

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
    mutate(resetSequenceProgress);
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

  const markResultsReviewed = useCallback(() => {
    mutate((p) => p.resultsReviewed ? p : { ...p, resultsReviewed: true });
  }, [mutate]);

  const moduleStatus = useMemo(() => {
    const data = SPECIALTIES_DATA[specialty];
    return getModuleStatus(progress, {
      flawsCount: data.flawsCases.length,
      antiComodinCount: data.antiComodin.length,
      safetyEquipments: data.safetyEquipments,
    });
  }, [progress, specialty]);

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
        markResultsReviewed,
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
