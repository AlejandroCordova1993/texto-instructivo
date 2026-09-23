import test from 'node:test';
import assert from 'node:assert/strict';
import * as workshop from '../src/lib/workshop.js';

const readyText = 'Inicialmente se revisa el equipo y se asegura el puesto. Posteriormente se ejecuta la maniobra y finalmente se detiene la máquina. ';

function completedProgress(attempts = 1) {
  return {
    forensicAnswers: Object.fromEntries([1, 2, 3, 4].map((id) => [id, { isCorrect: true, attempts }])),
    antiComodinAnswers: Object.fromEntries([1, 2, 3, 4, 5, 6].map((id) => [id, { isCorrect: true, attempts }])),
    verbalExerciseAnswer: 'unificar',
    verbalAttempts: attempts,
    sequenceOrder: ['a', 'b', 'c', 'd'],
    sequenceCompleted: true,
    sequenceChecks: attempts,
    safetySheet: {
      selectedEpp: ['gafas'],
      paragraph1: 'Se inspecciona el área, el estado de la máquina, las protecciones y el equipo de protección antes de iniciar cualquier maniobra. '.repeat(2),
      paragraph2: readyText.repeat(2),
    },
  };
}

const meta = { antiComodinCount: 6, requiredEpp: ['gafas'], trapEpp: ['guantes-inadecuados'] };

test('las cinco actividades suman exactamente 10 puntos al primer intento', () => {
  assert.equal(typeof workshop.calculateScores, 'function');
  assert.deepEqual(workshop.calculateScores(completedProgress(), meta), {
    forensic: 2, antiComodin: 2, verbal: 2, sequence: 2, safetySheet: 2, total: 10,
  });
});

test('un acierto al segundo intento conserva la actividad pero reduce solo sus cuatro criterios de respuesta', () => {
  assert.equal(typeof workshop.calculateScores, 'function');
  const progress = completedProgress(2);
  assert.deepEqual(workshop.calculateScores(progress, meta), {
    forensic: 1, antiComodin: 1, verbal: 1, sequence: 1, safetySheet: 2, total: 6,
  });
  assert.equal(workshop.getModuleStatus(progress, { flawsCount: 4, antiComodinCount: 6 }).sequence, 'done');
});

test('reiniciar el orden no borra una secuencia ya validada ni sus intentos', () => {
  assert.equal(typeof workshop.resetSequenceProgress, 'function');
  const progress = completedProgress(2);
  const after = workshop.resetSequenceProgress(progress);
  assert.equal(after.sequenceCompleted, true);
  assert.equal(after.sequenceChecks, 2);
  assert.deepEqual(after.sequenceOrder, ['a', 'b', 'c', 'd']);
  assert.equal(workshop.calculateScores(after, meta).sequence, 1);
});

test('reiniciar un orden aún incorrecto limpia solo el orden, no los intentos', () => {
  assert.equal(typeof workshop.resetSequenceProgress, 'function');
  const progress = { ...completedProgress(2), sequenceCompleted: false };
  const after = workshop.resetSequenceProgress(progress);
  assert.deepEqual(after.sequenceOrder, []);
  assert.equal(after.sequenceChecks, 2);
});

test('«desde luego» no recibe crédito como conector de secuencia', () => {
  assert.deepEqual(workshop.countConnectors('Desde luego, hay que revisar la pieza. Finalmente se detiene la máquina.'), ['finalmente']);
});
