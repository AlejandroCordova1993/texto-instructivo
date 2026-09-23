import React from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { KeyIdea, Callout, StepHeading } from './Didactics';
import { Check, X, Megaphone, BookMarked, ClipboardList, ArrowRightLeft } from 'lucide-react';
import { Termino } from './Glosario';

const MODES = [
  {
    id: 'imperativo',
    Icon: Megaphone,
    label: 'Imperativo',
    title: 'Orden directa',
    blurb: 'Le habla al operador que está en faena: «Ajuste», «Limpie», «Accione».',
    where: 'Carteles de seguridad y protocolos de emergencia.',
    accent: 'border-t-inst-blue',
  },
  {
    id: 'infinitivo',
    Icon: BookMarked,
    label: 'Infinitivo',
    title: 'Norma general',
    blurb: 'Verbo neutro, terminado en -ar, -er, -ir: «Ajustar», «Limpiar», «Accionar».',
    where: 'Manuales de fabricante y checklists.',
    accent: 'border-t-active-blue',
  },
  {
    id: 'impersonal',
    Icon: ClipboardList,
    label: 'Impersonal con «se»',
    title: 'Registro de auditoría',
    blurb: 'Quita a la persona y deja el proceso: «Se ajusta», «Se limpia», «Se acciona».',
    where: 'Informes de peritaje y control de calidad.',
    accent: 'border-t-deep-blue',
  },
];

export function VerbalModes() {
  const { specialty, progress, setVerbalMode, submitVerbalExercise } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { verbalModes } = specialtyData;

  const currentMode = progress.verbalMode || 'infinitivo';
  const selectedModeData = verbalModes[currentMode];
  const activeMode = MODES.find((m) => m.id === currentMode);
  const answer = progress.verbalExerciseAnswer;
  const solved = answer === 'unificar';

  return (
    <SectionWrapper
      id="verbal"
      step="03"
      monoTag="Formas verbales en las instrucciones"
      title="Mantén un mismo modo verbal"
      subtitle="Compara imperativo, infinitivo e impersonal, y usa la forma elegida a lo largo del procedimiento."
      objective="Reconocer tres formas verbales de las instrucciones y mantener una misma forma a lo largo de un procedimiento."
      duration="8 minutos"
      points="2 de los 10 puntos"
      tasks={[
        'Comparas las tres formas verbales sobre la misma orden.',
        'Detectas un cambio de forma verbal en un ejemplo.',
        'Eliges la corrección que exige la norma.',
      ]}
    >
      {/* --- A. Los tres modos, manipulables --- */}
      <StepHeading
        number="A"
        title="La misma orden, en tres registros"
        hint="Toca cada tarjeta: la frase de abajo se reescribe en ese modo."
        id="modos-title"
      />

      <div role="radiogroup" aria-labelledby="modos-title" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setVerbalMode(mode.id)}
              className={`card-pick gap-0 border-t-2 ${isActive ? mode.accent : 'border-t-line'}`}
            >
              <span className="mb-4 flex items-start justify-between gap-3">
                <span className={isActive ? 'icon-chip border-inst-blue bg-inst-blue text-white' : 'icon-chip'}>
                  <mode.Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span
                  className={`px-2 py-0.5 font-mono text-label uppercase tracking-label ${
                    isActive ? 'bg-inst-blue text-white' : 'border border-line text-mineral'
                  }`}
                >
                  {isActive ? 'Activo' : 'Ver'}
                </span>
              </span>
              <span className="mono-label mono-label--plain mb-1">{mode.label}</span>
              <span className="block font-sans text-lg font-bold text-deep-blue">{mode.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-mineral">{mode.blurb}</span>
              <span className="mt-3 block border-t border-line pt-3 text-sm text-mineral">
                <strong className="text-charcoal">Se usa en:</strong> {mode.where}
              </span>
            </button>
          );
        })}
      </div>

      {/* Resultado de la manipulación: el transformador en vivo */}
      <div className="card-deep mt-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label mono-label--dark">
            Acción evaluada · {verbalModes.action}
          </p>
          <p className="inline-flex items-center gap-2 border border-white/25 px-2.5 py-1 font-mono text-label uppercase tracking-label text-dim">
            <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Modo {activeMode?.label}
          </p>
        </div>

        <p
          aria-live="polite"
          className="border-l-2 border-signal-red bg-white/10 px-5 py-4 font-mono text-base font-medium leading-relaxed text-white sm:text-lg"
        >
          {selectedModeData?.text}
        </p>

        <p className="mt-4 max-w-reading text-sm leading-relaxed text-dim">
          <strong className="text-white">Dónde se usa:</strong> {selectedModeData?.usage}
        </p>
      </div>

      {/* --- B. Consistencia verbal --- */}
      <div className="mt-8">
        <StepHeading
          number="B"
          title="Usa una misma forma verbal"
          hint="Elige una forma para todo el documento: no alternes entre imperativo, infinitivo e impersonal."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          {/* Columna Izquierda: El caso con falla */}
          <article className="card border-t-2 border-t-danger p-5 sm:p-6">
            <span className="icon-chip icon-chip--danger mb-4">
              <X className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mono-label mono-label--plain mb-2 text-danger-ink">
              Fragmento con ruptura de estilo
            </p>
            <blockquote className="border-l-2 border-line bg-paper-card p-4 font-serif text-base italic leading-relaxed text-charcoal">
              {verbalModes.exercise.inconsistent}
            </blockquote>
            <p className="mt-4 text-sm leading-relaxed text-mineral">
              <strong className="text-charcoal">Falla diagnosticada:</strong>{' '}
              {verbalModes.exercise.problem}
            </p>
          </article>

          {/* Columna Derecha: Tarjeta unificada de corrección y norma */}
          <div className="card border-t-2 border-t-inst-blue p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 font-mono text-label uppercase tracking-label font-bold text-inst-blue">
                <span className="flex h-5 w-5 items-center justify-center border border-inst-blue bg-inst-blue text-white font-mono text-xs">
                  ✓
                </span>
                Corrección y norma técnica
              </p>
              <span className="font-mono text-xs text-mineral">Consistencia</span>
            </div>

            <p className="mb-4 text-xs leading-relaxed text-mineral">
              En un procedimiento técnico, alternar entre «Accione» y «Accionar» puede hacer menos clara la secuencia. Mantén una misma forma verbal.
            </p>

            <fieldset disabled={solved}>
              <legend className="mb-3 font-sans text-sm sm:text-base font-semibold text-deep-blue">
                ¿Qué cambio mantiene la misma forma verbal?
              </legend>

              <div className="space-y-2">
                {[
                  {
                    key: 'unificar',
                    text: 'Usar la misma forma verbal en todos los pasos del procedimiento.',
                  },
                  {
                    key: 'alternar',
                    text: 'Dejar la mezcla para que el texto sea más variado y dinámico de leer.',
                  },
                ].map(({ key, text }) => {
                  const isPicked = answer === key;
                  const isRight = key === 'unificar';
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={isPicked}
                      onClick={() => submitVerbalExercise(key)}
                      className={`flex w-full items-start justify-between gap-3 border p-3 text-left font-sans text-xs sm:text-sm leading-relaxed transition-colors disabled:cursor-not-allowed ${
                        isPicked && isRight
                          ? 'border-inst-blue bg-ok-bg font-semibold text-inst-blue'
                          : isPicked
                            ? 'border-review-border bg-review-bg text-charcoal'
                            : 'border-line bg-paper-card text-charcoal hover:border-mineral disabled:opacity-50'
                      }`}
                    >
                      <span>{text}</span>
                      {isPicked && (isRight
                        ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-inst-blue" aria-hidden="true" />
                        : <X className="mt-0.5 h-4 w-4 shrink-0 text-mineral" aria-hidden="true" />)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {answer && (
              <p
                role="status"
                className={`mt-4 animate-settleIn border-l-2 p-3.5 text-xs sm:text-sm leading-relaxed text-charcoal ${
                  solved ? 'border-inst-blue bg-ok-bg' : 'border-danger-border bg-danger-bg'
                }`}
              >
                {solved
                  ? 'Correcto. Mantener la misma forma verbal facilita la lectura de los pasos.'
                  : 'Todavía no. Busca la opción que mantiene la misma forma verbal en todos los pasos.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <KeyIdea>
        Elige una forma verbal para el <strong>documento completo</strong> y
        mantenla desde el primer paso hasta el cierre.
      </KeyIdea>
    </SectionWrapper>
  );
}
