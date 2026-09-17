import React, { useEffect, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { KeyIdea, Callout, StepHeading } from './Didactics';
import { ArrowUp, ArrowDown, RotateCcw, Check, PlayCircle, Cog, SquareCheck, Lightbulb, PencilLine } from 'lucide-react';
import { Termino } from './Glosario';

const PHASES = [
  {
    Icon: PlayCircle,
    name: 'Inicio · preparación',
    blurb: 'Prepara el entorno, el EPP y la máquina antes del encendido.',
    connectors: ['Inicialmente', 'En primer lugar', 'Antes de operar'],
    accent: 'border-t-inst-blue',
  },
  {
    Icon: Cog,
    name: 'Desarrollo · maniobra',
    blurb: 'Describe la secuencia principal de mecanizado o intervención.',
    connectors: ['Posteriormente', 'Seguidamente', 'A continuación'],
    accent: 'border-t-active-blue',
  },
  {
    Icon: SquareCheck,
    name: 'Cierre · parada segura',
    blurb: 'Termina la operación, asegura el equipo y ordena el puesto.',
    connectors: ['Finalmente', 'Por último', 'Al concluir la faena'],
    accent: 'border-t-deep-blue',
  },
];

export function SequenceConnectors() {
  const { specialty, progress, setSequenceOrder, checkSequence, resetSequence } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { sequenceActivity } = specialtyData;

  const [stepsOrder, setStepsOrder] = useState(() => {
    const saved = progress.sequenceOrder;
    if (saved?.length === sequenceActivity.steps.length) {
      const rebuilt = saved.map((id) => sequenceActivity.steps.find((s) => s.id === id));
      if (rebuilt.every(Boolean)) return rebuilt;
    }
    return [...sequenceActivity.steps];
  });

  // `null` = aún no ha comprobado. Evita mostrar "incorrecto" de entrada.
  const [verdict, setVerdict] = useState(progress.sequenceCompleted ? 'ok' : null);

  useEffect(() => {
    setStepsOrder([...sequenceActivity.steps]);
    setVerdict(progress.sequenceCompleted ? 'ok' : null);
  }, [specialty]); // eslint-disable-line react-hooks/exhaustive-deps

  const isCompleted = progress.sequenceCompleted;

  const moveStep = (from, to) => {
    if (to < 0 || to >= stepsOrder.length || isCompleted) return;
    const updated = [...stepsOrder];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setStepsOrder(updated);
    setVerdict(null); // reordenar no puntúa; solo comprobar puntúa
    setSequenceOrder(updated.map((s) => s.id));
  };

  const handleCheck = () => {
    const ids = stepsOrder.map((s) => s.id);
    const isCorrect = JSON.stringify(ids) === JSON.stringify(sequenceActivity.correctOrder);
    checkSequence(ids, isCorrect);
    setVerdict(isCorrect ? 'ok' : 'retry');
  };

  const handleReset = () => {
    setStepsOrder([...sequenceActivity.steps]);
    setVerdict(null);
    resetSequence?.();
  };

  return (
    <SectionWrapper
      id="sequence"
      step="04"
      monoTag="Cohesión textual y párrafos de secuencia"
      title="De cuatro órdenes sueltas a un procedimiento"
      subtitle="Un procedimiento no es una lista de frases. Ordena los pasos y míralos convertirse en un párrafo."
      objective="Podrás ordenar cronológicamente las fases de un procedimiento y enlazarlas con el conector temporal que corresponde a cada una."
      duration="8 minutos"
      points="2 de los 10 puntos"
      tasks={[
        'Estudias los conectores de cada fase del trabajo.',
        'Ordenas los cuatro pasos de un procedimiento real.',
        'Lees el párrafo que armaste sin darte cuenta.',
      ]}
    >
      {/* Barra compacta de fases (evita scroll vertical excesivo) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-line bg-paper-card px-4 py-2.5">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-mineral">
          Guía de fases:
        </span>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-charcoal">
            <span className="h-2 w-2 rounded-full bg-inst-blue" aria-hidden="true" />
            <strong className="text-deep-blue">Inicio:</strong> Inicialmente, en primer lugar
          </span>
          <span className="flex items-center gap-1.5 text-charcoal">
            <span className="h-2 w-2 rounded-full bg-active-blue" aria-hidden="true" />
            <strong className="text-deep-blue">Desarrollo:</strong> A continuación, seguidamente
          </span>
          <span className="flex items-center gap-1.5 text-charcoal">
            <span className="h-2 w-2 rounded-full bg-deep-blue" aria-hidden="true" />
            <strong className="text-deep-blue">Cierre:</strong> Finalmente, por último
          </span>
        </div>
      </div>

      {/* Cabecera del paso */}
      <StepHeading
        number="1"
        title={sequenceActivity.title}
        hint="Ordena los pasos cronológicamente con las flechas. Observa a la derecha cómo se ensambla el texto continuo."
        trailing={
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-[2.5rem] items-center gap-2 border border-line bg-paper-pure px-3.5 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-mineral"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reiniciar orden
          </button>
        }
      />

      {/* Grid de 2 columnas: Columna izquierda (Actividad) | Columna derecha (Resultado y Aprendizaje) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Columna Izquierda: Los 4 pasos interactivos */}
        <div className="lg:col-span-7 space-y-3">
          <ol className="space-y-2.5" aria-label="Pasos del procedimiento">
            {stepsOrder.map((step, idx) => (
              <li
                key={step.id}
                className={`card flex items-center justify-between gap-3 p-3.5 transition-all ${
                  isCompleted ? 'border-inst-blue bg-ok-bg/60' : 'hover:border-mineral'
                }`}
              >
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-sm font-bold ${
                      isCompleted
                        ? 'border-inst-blue bg-inst-blue text-white'
                        : 'border-deep-blue bg-paper-pure text-deep-blue'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="border border-active-blue/40 bg-paper-pure px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-active-blue whitespace-nowrap">
                    {sequenceActivity.connectors[idx].recommended}
                  </span>
                </div>

                <p className="grow text-sm leading-relaxed text-charcoal">
                  {step.text}
                </p>

                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    disabled={idx === 0 || isCompleted}
                    onClick={() => moveStep(idx, idx - 1)}
                    aria-label={`Subir el paso ${idx + 1}`}
                    className="flex h-8 w-8 items-center justify-center border border-line bg-paper-pure text-deep-blue transition-colors hover:border-mineral hover:bg-paper-card disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === stepsOrder.length - 1 || isCompleted}
                    onClick={() => moveStep(idx, idx + 1)}
                    aria-label={`Bajar el paso ${idx + 1}`}
                    className="flex h-8 w-8 items-center justify-center border border-line bg-paper-pure text-deep-blue transition-colors hover:border-mineral hover:bg-paper-card disabled:cursor-not-allowed disabled:opacity-25"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ol>

          {/* Barra de control y comprobación */}
          <div className="mt-4 flex flex-wrap items-center gap-3 pt-1">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleCheck}
                className="min-h-[2.75rem] bg-deep-blue px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-inst-blue"
              >
                Comprobar orden
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 border border-inst-blue bg-ok-bg px-4 py-2 font-sans text-xs font-bold text-inst-blue">
                <Check className="h-4 w-4" aria-hidden="true" />
                ¡Secuencia cronológica verificada!
              </div>
            )}

            {progress.sequenceChecks > 0 && !isCompleted && (
              <p className="meta-pill text-xs">Intentos: {progress.sequenceChecks}</p>
            )}
          </div>

          {verdict === 'retry' && (
            <div className="mt-3 animate-settleIn">
              <Callout tone="aviso" title="El orden temporal no coincide con el taller">
                Piensa en la secuencia física real: primero se interpreta el plano y se traza,
                después se ejecuta el corte y biselado, luego se suelda y finalmente se pica la
                escoria y se controla la medida. Reordena y vuelve a comprobar.
              </Callout>
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel de Síntesis y Aprendizaje en tiempo real */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          {/* Tarjeta: Mira lo que acabas de escribir / Vista en tiempo real */}
          <div
            className={`border p-5 transition-all ${
              isCompleted
                ? 'border-t-4 border-inst-blue bg-ok-bg shadow-sm'
                : 'border-line bg-paper-card'
            }`}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <p
                className={`flex items-center gap-2 font-sans text-sm font-bold ${
                  isCompleted ? 'text-inst-blue' : 'text-deep-blue'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PencilLine className="h-4 w-4 text-mineral" aria-hidden="true" />
                )}
                {isCompleted ? 'Mira lo que acabas de escribir' : 'Párrafo técnico en vivo'}
              </p>
              <span
                className={`font-mono text-[0.65rem] uppercase tracking-wider px-2 py-0.5 border ${
                  isCompleted
                    ? 'border-inst-blue bg-inst-blue text-white'
                    : 'border-line bg-paper-pure text-mineral'
                }`}
              >
                {isCompleted ? 'Validado' : 'Vista previa'}
              </span>
            </div>

            <p className="mb-3 text-xs leading-relaxed text-mineral">
              {isCompleted
                ? 'Ya no son cuatro órdenes sueltas. Con los conectores puestos, es un procedimiento que se lee de corrido:'
                : 'A medida que mueves los pasos, los conectores enlazan las acciones en un párrafo continuo:'}
            </p>

            <blockquote className="border-l-2 border-inst-blue bg-paper-pure p-4 font-serif text-sm leading-relaxed text-charcoal shadow-xs">
              {stepsOrder.map((step, i) => (
                <React.Fragment key={step.id}>
                  <strong className="font-sans font-bold text-inst-blue">
                    {sequenceActivity.connectors[i].recommended}
                  </strong>
                  {', '}
                  {step.text.charAt(0).toLowerCase() + step.text.slice(1).replace(/\.$/, '')}
                  {i < stepsOrder.length - 1 ? '. ' : '.'}{' '}
                </React.Fragment>
              ))}
            </blockquote>
          </div>

          {/* Tarjeta: Lo que acabas de aprender */}
          <div className="border border-active-blue/30 bg-active-blue/5 p-4">
            <p className="mb-1.5 flex items-center gap-1.5 font-sans text-xs font-bold text-deep-blue">
              <Lightbulb className="h-4 w-4 text-active-blue" aria-hidden="true" />
              Lo que acabas de aprender
            </p>
            <p className="text-xs leading-relaxed text-charcoal">
              El <Termino term="conector cronológico">conector cronológico</Termino> no es un adorno: <strong>marca en qué fase del trabajo estás</strong> (inicio, desarrollo o cierre). Por eso «finalmente» no puede aparecer en el paso dos.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
