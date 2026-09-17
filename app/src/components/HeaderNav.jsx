import React, { useEffect, useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { Wrench, Cog, RefreshCw, RotateCcw, X, Check } from 'lucide-react';

const MODULES = [
  { id: 'intro', step: '01', label: 'Impacto' },
  { id: 'forensic', step: '02', label: 'Lab forense' },
  { id: 'verbal', step: '03', label: 'Modos verbales' },
  { id: 'sequence', step: '04', label: 'Secuencia' },
  { id: 'safety-sheet', step: '05', label: 'Ficha técnica' },
  { id: 'results', step: '06', label: 'Tu resultado' },
];

/* Marca cuál de los seis módulos está en pantalla. */
function useActiveSection() {
  const [activeId, setActiveId] = useState('intro');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5] }
    );
    MODULES.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return activeId;
}

function Dialog({ labelledBy, children, onClose, role = 'dialog' }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-deep-blue/90 backdrop-blur-sm no-print">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={ref}
          role={role}
          aria-modal="true"
          aria-labelledby={labelledBy}
          className="w-full max-w-md border border-line bg-paper-card p-6 text-charcoal"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function HeaderNav() {
  const { specialty, setSpecialty, scores, startOver, moduleStatus } = useStudent();
  const [showSwitch, setShowSwitch] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const activeId = useActiveSection();

  const currentSpecialty = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const SpecialtyIcon = specialty === 'automotriz' ? Wrench : Cog;
  const done = MODULES.filter((m) => moduleStatus[m.id] === 'done').length;

  return (
    <>
      <header className="on-deep sticky top-0 z-40 border-b border-white/15 bg-deep-blue text-paper-warm no-print">
        <div className="mx-auto max-w-brand px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="icon-chip icon-chip--deep">
                <SpecialtyIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="mono-label mono-label--dark">Bachillerato Técnico</p>
                <p className="truncate font-sans text-base font-bold text-white">
                  Taller de Texto Instructivo
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setShowSwitch(true)}
                className="group flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-left transition-colors hover:bg-white/20"
              >
                <span className="hidden sm:block">
                  <span className="block font-mono text-label text-dim">Tu taller</span>
                  <span className="block text-sm font-semibold text-white">{currentSpecialty.name}</span>
                </span>
                <span className="text-sm font-semibold text-white sm:hidden">
                  {currentSpecialty.shortName}
                </span>
                <RefreshCw
                  className="h-4 w-4 text-dim transition-transform duration-300 group-hover:rotate-180"
                  aria-hidden="true"
                />
              </button>

              {/* Avance y puntaje juntos: responden a la misma pregunta. */}
              <p className="flex items-center gap-3 border border-line bg-paper-card px-3 py-2">
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono text-label text-mineral">Módulos</span>
                  <span className="font-mono text-base font-bold tabular-nums text-deep-blue">
                    {done}<span className="text-mineral">/6</span>
                  </span>
                </span>
                <span aria-hidden="true" className="h-5 w-px bg-line" />
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono text-label text-mineral">Puntaje</span>
                  <span className="font-mono text-base font-bold tabular-nums text-deep-blue">
                    {scores.total.toFixed(1)}<span className="text-mineral">/10</span>
                  </span>
                </span>
              </p>

              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 border border-white/25 px-3 py-2 text-xs font-medium text-dim transition-colors hover:border-white/50 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Empezar de nuevo</span>
                <span className="sr-only sm:hidden">Empezar de nuevo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ruta de aprendizaje: dónde estoy, qué llevo hecho, qué falta. */}
        <nav aria-label="Ruta del taller" className="border-t border-white/15 bg-deep-blue">
          <ol className="mx-auto flex max-w-brand items-stretch gap-1 overflow-x-auto px-4 no-scrollbar sm:px-6 lg:px-8">
            {MODULES.map(({ id, step, label }) => {
              const isActive = activeId === id;
              const isDone = moduleStatus[id] === 'done';
              const isStarted = moduleStatus[id] === 'started';
              return (
                <li key={id} className="shrink-0">
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-3 transition-colors ${
                      isActive
                        ? 'border-signal-red text-white'
                        : 'border-transparent text-dim hover:text-white'
                    }`}
                  >
                    {/* Piso tipografico del sistema: 12px. El indicador crece
                        a 24px para que el numero quepa sin bajar de ahi. */}
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-label ${
                        isDone
                          ? 'border-inst-blue bg-inst-blue text-white'
                          : 'border-white/25 text-dim'
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : step}
                    </span>
                    <span className="font-mono text-xs">{label}</span>
                    <span className="sr-only">
                      {isDone ? ' (completado)' : isStarted ? ' (en curso)' : ' (sin empezar)'}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      {showSwitch && (
        <Dialog labelledBy="switch-title" onClose={() => setShowSwitch(false)}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="mono-label mb-2">Cambiar de taller</p>
              <h2 id="switch-title" className="font-sans text-xl font-bold text-deep-blue">
                Elige tu especialidad
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowSwitch(false)}
              aria-label="Cerrar"
              className="p-1.5 text-mineral transition-colors hover:text-charcoal"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <p className="mb-5 text-sm leading-relaxed text-mineral">
            Cada carrera guarda su propio avance por separado. Puedes ir y volver
            sin perder lo que ya resolviste en la otra.
          </p>

          <div className="space-y-3">
            {['automotriz', 'industrial'].map((id) => {
              const data = SPECIALTIES_DATA[id];
              const Icon = id === 'automotriz' ? Wrench : Cog;
              const isActive = specialty === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => { setSpecialty(id); setShowSwitch(false); }}
                  className="card-pick flex-row items-start gap-3"
                >
                  <span className={isActive ? 'icon-chip border-inst-blue bg-inst-blue text-white' : 'icon-chip'}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-sans text-base font-bold text-deep-blue">{data.name}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-mineral">
                      {data.mainMachine}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Dialog>
      )}

      {confirmReset && (
        <Dialog role="alertdialog" labelledBy="reset-title" onClose={() => setConfirmReset(false)}>
          <p className="mono-label mb-3">Equipo compartido</p>
          <h2 id="reset-title" className="mb-2 font-sans text-xl font-bold text-deep-blue">
            ¿Empezar de nuevo?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-mineral">
            Se borra todo tu avance de este equipo —incluidos los párrafos que
            escribiste— para que el siguiente estudiante empiece limpio.{' '}
            <strong className="text-charcoal">Imprime tu ficha antes de salir</strong>:
            no se puede recuperar.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="border border-line bg-paper-pure px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-mineral"
            >
              Seguir trabajando
            </button>
            <button
              type="button"
              onClick={() => { startOver(); setConfirmReset(false); }}
              className="bg-deep-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-inst-blue"
            >
              Sí, borrar y empezar
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
