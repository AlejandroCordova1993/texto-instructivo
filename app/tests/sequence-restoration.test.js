import test from 'node:test';
import assert from 'node:assert/strict';
import { restoreSequenceSteps } from '../src/lib/workshop.js';

const steps = [
  { id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' },
];

test('restaura el orden guardado al volver a una secuencia completada', () => {
  assert.deepEqual(
    restoreSequenceSteps(steps, ['s2', 's1', 's4', 's3']).map((step) => step.id),
    ['s2', 's1', 's4', 's3'],
  );
});

test('descarta un orden guardado incompleto o con pasos repetidos', () => {
  assert.deepEqual(restoreSequenceSteps(steps, ['s2']).map((step) => step.id), ['s1', 's2', 's3', 's4']);
  assert.deepEqual(
    restoreSequenceSteps(steps, ['s2', 's2', 's4', 's3']).map((step) => step.id),
    ['s1', 's2', 's3', 's4'],
  );
});
