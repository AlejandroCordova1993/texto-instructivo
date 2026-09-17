import React, { useEffect, useRef, useState } from 'react';
import { Check, PencilLine } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { ObjectiveCard } from './Didactics';
import { TeoriaSection, RepasoFlotante } from './Teoria';
import { teoriaDe } from '../data/teoria';

/* Entrada al aparecer + seguimiento de visibilidad.
 *
 * `revealed` se dispara una vez y deja el contenido visible para siempre:
 * si el observador falla —o el estudiante imprime— el contenido sigue ahí.
 * `inView` cambia en los dos sentidos, y es lo que decide si el botón de
 * repaso flotante corresponde a este módulo.
 */
function useSectionVisibility() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
        setInView(entry.isIntersecting);
      },
      { rootMargin: '-25% 0px -25% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, revealed, inView];
}

const STATUS_LABEL = {
  done: 'Completado',
  started: 'En curso',
  todo: 'Sin empezar',
};

export function SectionWrapper({
  id,
  step,
  monoTag,
  title,
  subtitle,
  objective,
  duration,
  points,
  tasks,
  activacion,
  practiceTag = 'La práctica',
  practiceTitle = 'Ahora aplícalo tú',
  children,
  className = '',
  bg = 'bg-paper-warm',
}) {
  const [ref, revealed, inView] = useSectionVisibility();
  const { moduleStatus } = useStudent();
  const status = moduleStatus?.[id] || 'todo';
  const hasTheory = !!teoriaDe(id);

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={`anchor-offset border-b border-line px-4 py-14 sm:px-6 sm:py-20 lg:px-8 ${bg} ${className}`}
    >
      <div className={`mx-auto max-w-brand ${revealed ? 'animate-riseIn' : ''}`}>
        <header className="mb-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              {step && (
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-deep-blue font-mono text-lg font-bold text-deep-blue"
                >
                  {step}
                </span>
              )}
              {monoTag && <p className="mono-label">{monoTag}</p>}
            </div>

            <p className={`meta-pill ${status === 'done' ? 'meta-pill--done' : ''}`}>
              {status === 'done' && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
              <span className="sr-only">Estado del módulo: </span>
              {STATUS_LABEL[status]}
            </p>
          </div>

          {title && (
            <>
              <h2
                id={`${id}-title`}
                className="max-w-reading font-sans text-2xl font-bold tracking-tight text-deep-blue sm:text-3xl lg:text-4xl"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="mt-3 max-w-reading font-serif text-base italic leading-relaxed text-mineral sm:text-lg">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </header>

        {objective && (
          <ObjectiveCard
            objective={objective}
            duration={duration}
            points={points}
            tasks={tasks}
          />
        )}

        {/* Activación de conocimientos previos: va ANTES de la teoría.
            Predecir y luego confrontar fija mejor que leer lo ya explicado. */}
        {activacion}

        {/* Primero la teoría, después la práctica. El botón flotante
            mantiene la teoría al alcance mientras se practica. */}
        {hasTheory && <TeoriaSection moduleId={id} />}

        {hasTheory && (
          <div className="mb-10 flex items-center gap-3 border-t-2 border-charcoal pt-5">
            <span className="icon-chip">
              <PencilLine className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="mono-label mono-label--plain mb-1">{practiceTag}</p>
              <p className="font-sans text-xl font-bold text-deep-blue">
                {practiceTitle}
              </p>
            </div>
          </div>
        )}

        {children}
      </div>

      {hasTheory && <RepasoFlotante moduleId={id} visible={inView} />}
    </section>
  );
}
