import React from 'react';
import { Target, Clock, Award, Lightbulb, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

/* Piezas didácticas reutilizables.
 *
 * Cada módulo sigue la misma secuencia de eventos de instrucción, y estos
 * componentes son los que la hacen visible:
 *   objetivo → activación → contenido → práctica → retroalimentación → cierre
 *
 * Que la estructura se repita módulo a módulo no es monotonía: es lo que
 * permite que el estudiante deje de gastar atención en averiguar dónde está
 * y la gaste en la tarea.
 */

/** Organizador previo: qué vas a poder hacer, cuánto dura, cuánto vale. */
export function ObjectiveCard({ objective, duration, points, tasks }) {
  return (
    <div className="card-deep mb-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-reading">
          <p className="mono-label mono-label--dark mb-3">Al terminar este módulo</p>
          <p className="flex gap-3 font-serif text-lg leading-relaxed text-white sm:text-xl">
            <Target className="mt-1.5 h-5 w-5 shrink-0 text-signal-red" aria-hidden="true" />
            <span>{objective}</span>
          </p>
        </div>

        <ul className="flex shrink-0 flex-wrap gap-2 sm:flex-col">
          <li className="inline-flex items-center gap-1.5 border border-white/25 px-2.5 py-1 font-mono text-label uppercase tracking-label text-dim">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {duration}
          </li>
          <li className="inline-flex items-center gap-1.5 border border-white/25 px-2.5 py-1 font-mono text-label uppercase tracking-label text-dim">
            <Award className="h-3.5 w-3.5" aria-hidden="true" />
            {points}
          </li>
        </ul>
      </div>

      {tasks?.length > 0 && (
        <ol className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-white/20 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task, i) => (
            <li key={task} className="flex gap-3 text-sm leading-relaxed text-paper-warm">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center border border-white/30 font-mono text-label text-white"
              >
                {i + 1}
              </span>
              {task}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/** Cierre del módulo: una sola idea, la que debe quedar. */
export function KeyIdea({ children, title = 'Idea clave' }) {
  return (
    <aside className="mt-14 border-t-2 border-inst-blue bg-ok-bg p-5 sm:p-6">
      <p className="mb-3 flex items-center gap-2.5 font-sans text-base font-bold text-inst-blue">
        <Lightbulb className="h-5 w-5" aria-hidden="true" />
        {title}
      </p>
      <p className="max-w-reading text-base leading-relaxed text-charcoal">{children}</p>
    </aside>
  );
}

const CALLOUT_STYLES = {
  aviso: { Icon: Info, box: 'border-line bg-paper-card', ink: 'text-charcoal', chip: 'text-inst-blue' },
  peligro: { Icon: AlertTriangle, box: 'border-danger-border bg-danger-bg', ink: 'text-charcoal', chip: 'text-danger-ink' },
  logro: { Icon: CheckCircle2, box: 'border-inst-blue bg-ok-bg', ink: 'text-charcoal', chip: 'text-inst-blue' },
};

/** Nota al margen con ancla visual. Tono = tipo, no solo color. */
export function Callout({ tone = 'aviso', title, children }) {
  const { Icon, box, ink, chip } = CALLOUT_STYLES[tone] || CALLOUT_STYLES.aviso;
  return (
    <div className={`border p-4 sm:p-5 ${box}`}>
      <p className={`mb-2 flex items-center gap-2 font-sans text-base font-bold ${chip}`}>
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {title}
      </p>
      <div className={`max-w-reading text-base leading-relaxed ${ink}`}>{children}</div>
    </div>
  );
}

/** Tarjeta de concepto: icono + nombre + definición. Codificación dual. */
export function ConceptCard({ Icon, term, children, accent = 'border-t-inst-blue', tone }) {
  const chipClass = tone === 'danger' ? 'icon-chip icon-chip--danger' : 'icon-chip';
  return (
    <article className={`card border-t-2 ${accent}`}>
      <span className={`${chipClass} mb-4`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h4 className="font-sans text-base font-bold text-deep-blue">{term}</h4>
      <p className="mt-2 text-sm leading-relaxed text-mineral">{children}</p>
    </article>
  );
}

/** Encabezado de paso dentro de una actividad guiada. */
export function StepHeading({ number, title, hint, id, trailing }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        {number && (
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-inst-blue bg-inst-blue font-mono text-sm font-bold text-white"
          >
            {number}
          </span>
        )}
        <div>
          <h3 id={id} className="font-sans text-xl font-bold text-deep-blue">{title}</h3>
          {hint && <p className="mt-1 max-w-reading text-sm text-mineral">{hint}</p>}
        </div>
      </div>
      {trailing}
    </div>
  );
}
