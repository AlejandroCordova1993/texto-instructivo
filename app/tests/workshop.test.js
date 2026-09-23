import test from 'node:test';
import assert from 'node:assert/strict';

const workshop = await import('../src/lib/workshop.js');

test('un módulo practicado se considera terminado aunque el primer intento haya reducido los puntos', () => {
  assert.equal(typeof workshop.getModuleStatus, 'function');
  const progress = {
    introAnswered: 'distinto',
    caseAnalysisAnswer: 'referencial',
    forensicAnswers: Object.fromEntries([1, 2, 3, 4].map((id) => [id, { isCorrect: true, attempts: 2 }])),
    antiComodinAnswers: Object.fromEntries([1, 2, 3, 4, 5, 6].map((id) => [`c${id}`, { isCorrect: true, attempts: 2 }])),
    verbalExerciseAnswer: 'unificar',
    sequenceCompleted: true,
    safetySheet: { selectedEpp: [], paragraph1: '', paragraph2: '' },
    scores: { forensic: 1, antiComodin: 1, verbal: 1, sequence: 1, safetySheet: 0, total: 4 },
  };

  const status = workshop.getModuleStatus(progress, { flawsCount: 4, antiComodinCount: 6 });
  assert.equal(status.forensic, 'done');
  assert.equal(status.verbal, 'done');
  assert.equal(status.sequence, 'done');
  assert.equal(progress.scores.total, 4);
});

test('la ficha solo queda preparada para revisión si incluye EPP, ambos párrafos y dos conectores', () => {
  assert.equal(typeof workshop.getDraftReadiness, 'function');
  const equipment = [
    { id: 'gafas', required: true },
    { id: 'botas', required: true },
    { id: 'guantes-sueltos', required: false },
  ];
  const paragraph1 = 'Antes de usar la máquina, reviso el área, el estado del equipo y las condiciones de seguridad; luego describo el equipo de protección que necesito. '.repeat(2);
  const paragraph2 = 'Inicialmente reviso los puntos de apoyo. Posteriormente sigo la maniobra indicada y compruebo cada condición. Finalmente detengo el equipo y ordeno el puesto. '.repeat(2);

  assert.equal(workshop.getDraftReadiness({ selectedEpp: ['gafas'], paragraph1, paragraph2 }, equipment).ready, false);
  assert.equal(workshop.getDraftReadiness({ selectedEpp: ['gafas', 'botas', 'guantes-sueltos'], paragraph1, paragraph2 }, equipment).ready, false);
  assert.equal(workshop.getDraftReadiness({ selectedEpp: ['gafas', 'botas'], paragraph1, paragraph2: 'Accionar la máquina y cerrar la tarea.'.repeat(5) }, equipment).ready, false);
  assert.equal(workshop.getDraftReadiness({ selectedEpp: ['gafas', 'botas'], paragraph1, paragraph2 }, equipment).ready, true);
});
