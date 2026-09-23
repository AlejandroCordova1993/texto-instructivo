import React from 'react';
import { PencilLine } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { TeoriaSection } from './Teoria';
import { teoriaDe } from '../data/teoria';

const STATUS_LABEL = { done: 'Completada', started: 'En curso', todo: 'Sin empezar' };

export function SectionWrapper({
  id, step, monoTag, title, subtitle, objective, duration, points, tasks,
  activacion, practiceTag = 'La práctica', practiceTitle = 'Ahora aplícalo tú',
  children, className = '', bg = 'bg-paper-warm',
}) {
  const { moduleStatus } = useStudent();
  const theory = teoriaDe(id);
  const status = moduleStatus?.[id] || 'todo';

  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${bg} ${className}`}>
      <div className="mx-auto max-w-stage">
        <header className="border-b-2 border-deep-blue pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[.11em]">
            <p className="text-inst-blue">{step ? `Etapa ${step}` : 'Etapa'}{monoTag ? ` · ${monoTag}` : ''}</p>
            <p className="text-muted">{STATUS_LABEL[status]}</p>
          </div>
          <h1 id={`${id}-title`} className="mt-4 max-w-reading font-sans text-3xl font-bold leading-tight tracking-tight text-deep-blue sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 max-w-reading text-base leading-relaxed text-charcoal sm:text-lg">{subtitle}</p>}
          {(duration || points) && <p className="mt-4 font-mono text-xs font-semibold text-muted">{duration}{duration && points ? ' · ' : ''}{points}</p>}
        </header>

        {objective && <div className="border-b border-line py-5">
          <p className="text-xs font-bold uppercase tracking-[.11em] text-inst-blue">Al terminar podrás</p>
          <p className="mt-1 max-w-reading text-base leading-relaxed text-charcoal">{objective}</p>
        </div>}

        {tasks?.length > 0 && <details className="border-b border-line py-3 text-sm no-print">
          <summary className="min-h-9 cursor-pointer font-semibold text-deep-blue">Qué harás en esta etapa</summary>
          <ol className="list-decimal space-y-1 pl-5 leading-relaxed text-charcoal">{tasks.map((task) => <li key={task}>{task}</li>)}</ol>
        </details>}

        {activacion}
        {theory && <TeoriaSection moduleId={id} />}

        {theory ? <section aria-labelledby={`${id}-practice-title`} className="mt-6">
          <header className="border-t-2 border-t-active-blue px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex items-start gap-3">
              <span className="icon-chip" aria-hidden="true"><PencilLine className="h-5 w-5" /></span>
              <div>
                <p className="mono-label mono-label--plain mb-1">{practiceTag === 'La práctica' ? practiceTag : `La práctica · ${practiceTag}`}</p>
                <h2 id={`${id}-practice-title`} className="font-sans text-xl font-bold text-deep-blue sm:text-2xl">{practiceTitle}</h2>
              </div>
            </div>
            <details className="mt-5 border-y border-line py-3 text-sm no-print">
              <summary className="min-h-9 cursor-pointer font-semibold text-deep-blue">Consultar las ideas clave mientras practicas</summary>
              <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-charcoal">{theory.resumen.map((point) => <li key={point}>{point}</li>)}</ul>
            </details>
          </header>
          <div className="mt-5 border-t border-line bg-paper-pure px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </section> : children}
      </div>
    </section>
  );
}
