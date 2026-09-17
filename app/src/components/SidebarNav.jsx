import React, { useEffect, useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import {
  Wrench,
  Cog,
  RefreshCw,
  RotateCcw,
  X,
  Check,
  PanelLeftClose,
  ChevronRight,
} from 'lucide-react';

export const MODULES = [
  { id: 'intro', step: '01', label: 'El impacto', sublabel: 'Estudio de caso' },
  { id: 'forensic', step: '02', label: 'Lab forense', sublabel: 'Precisión lingüística' },
  { id: 'verbal', step: '03', label: 'Modos verbales', sublabel: 'Sintaxis y estilo' },
  { id: 'sequence', step: '04', label: 'Secuencia', sublabel: 'Conectores' },
  { id: 'safety-sheet', step: '05', label: 'Ficha técnica', sublabel: 'Constructor FOS-01' },
  { id: 'results', step: '06', label: 'Tu resultado', sublabel: 'Rúbrica y certificación' },
];

/* Detecta qué módulo está en pantalla mediante IntersectionObserver */
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
      { rootMargin: '-35% 0px -35% 0px', threshold: [0, 0.25, 0.5] }
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
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
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
          className="w-full max-w-md border border-line bg-paper-card p-6 text-charcoal shadow-2xl"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SidebarNav({ isOpen, onToggle }) {
  const { specialty, setSpecialty, scores, startOver, moduleStatus } = useStudent();
  const [showSwitch, setShowSwitch] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const activeId = useActiveSection();

  const currentSpecialty = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const SpecialtyIcon = specialty === 'automotriz' ? Wrench : Cog;
  const doneCount = MODULES.filter((m) => moduleStatus[m.id] === 'done').length;
  const totalScore = scores.total || 0;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onToggle(false);
    }
  };

  return (
    <>
      {/* Backdrop para móviles */}
      {isOpen && (
        <div
          onClick={() => onToggle(false)}
          className="fixed inset-0 z-40 bg-deep-blue/80 backdrop-blur-xs lg:hidden no-print"
          aria-hidden="true"
        />
      )}

      {/* Barra lateral principal */}
      <aside
        id="courseSidebar"
        aria-label="Navegación del taller"
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/15 bg-deep-blue text-paper-warm shadow-2xl transition-transform duration-300 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabecera institucional del Sidebar */}
        <div className="border-b border-white/15 px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <span className="mono-label mono-label--dark text-[0.68rem] tracking-wider text-dim">
              Bachillerato Técnico
            </span>
            <button
              type="button"
              onClick={() => onToggle(false)}
              aria-label="Ocultar barra lateral"
              className="inline-flex h-8 w-8 items-center justify-center border border-white/20 bg-white/5 text-dim transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white"
            >
              <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <h1 className="mt-2 font-sans text-lg font-bold leading-tight tracking-tight text-white">
            Taller de Texto Instructivo
          </h1>
          <p className="mt-0.5 font-mono text-[0.7rem] text-dim">
            Lengua y Literatura · 1.° BT
          </p>
        </div>

        {/* Tarjeta de Especialidad Activa */}
        <div className="border-b border-white/15 bg-white/[0.03] p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <span className="icon-chip icon-chip--deep mt-0.5 shrink-0">
                <SpecialtyIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-dim">
                  Taller activo
                </span>
                <p className="font-sans text-xs font-bold leading-snug text-white">
                  {currentSpecialty.shortName || currentSpecialty.name}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSwitch(true)}
            className="mt-3 flex w-full items-center justify-between border border-white/20 bg-white/10 px-3 py-1.5 font-mono text-xs text-dim transition-colors hover:border-white/40 hover:bg-white/20 hover:text-white"
          >
            <span>Cambiar especialidad</span>
            <RefreshCw className="h-3.5 w-3.5 text-dim" aria-hidden="true" />
          </button>
        </div>

        {/* Marcador de Progreso y Puntaje */}
        <div className="border-b border-white/15 bg-white/[0.02] px-5 py-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-dim">Módulos</span>
            <span className="font-mono font-bold text-white">
              {doneCount}<span className="text-dim">/6</span>
            </span>
          </div>

          {/* Micro-barra de progreso */}
          <div className="mt-1.5 h-1.5 w-full overflow-hidden bg-white/10">
            <div
              className="h-full bg-inst-blue transition-all duration-500"
              style={{ width: `${(doneCount / 6) * 100}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="font-mono text-dim">Puntaje actual</span>
            <span className="font-mono font-bold text-active-blue">
              {totalScore.toFixed(1)} <span className="text-dim">/ 10 pts</span>
            </span>
          </div>
        </div>

        {/* Lista de navegación vertical (Índice de Módulos) */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-3"
          aria-label="Módulos del taller"
        >
          <p className="mb-2 px-2 font-mono text-[0.65rem] uppercase tracking-wider text-dim">
            Ruta formativa
          </p>

          <ul className="space-y-1">
            {MODULES.map(({ id, step, label, sublabel }) => {
              const isCurrent = activeId === id;
              const isDone = moduleStatus[id] === 'done';

              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={handleLinkClick}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`group flex items-center justify-between border px-3 py-2.5 text-xs transition-all ${
                      isCurrent
                        ? 'border-active-blue bg-white/15 font-semibold text-white shadow-xs'
                        : 'border-transparent text-dim hover:border-white/10 hover:bg-white/5 hover:text-paper-warm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center font-mono text-[0.68rem] ${
                          isDone
                            ? 'bg-inst-blue font-bold text-white'
                            : isCurrent
                            ? 'border border-active-blue text-active-blue'
                            : 'border border-white/25 text-dim'
                        }`}
                      >
                        {isDone ? (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          step
                        )}
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate font-sans text-xs text-white">
                          {label}
                        </span>
                        <span className="block truncate font-mono text-[0.65rem] text-dim">
                          {sublabel}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                        isCurrent
                          ? 'text-active-blue translate-x-0.5'
                          : 'text-dim/40 opacity-0 group-hover:opacity-100'
                      }`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pie del Sidebar: Reiniciar sesión */}
        <div className="border-t border-white/15 p-4">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center justify-center gap-2 border border-white/20 bg-white/5 px-3 py-2 font-sans text-xs text-dim transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Empezar de nuevo</span>
          </button>
        </div>
      </aside>

      {/* Modal: Cambio de Especialidad */}
      {showSwitch && (
        <Dialog labelledBy="switch-title" onClose={() => setShowSwitch(false)}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="mono-label mb-1">Taller técnico</p>
              <h2
                id="switch-title"
                className="font-sans text-xl font-bold text-deep-blue"
              >
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
                  onClick={() => {
                    setSpecialty(id);
                    setShowSwitch(false);
                  }}
                  className="card-pick flex-row items-start gap-3 w-full text-left"
                >
                  <span
                    className={
                      isActive
                        ? 'icon-chip border-inst-blue bg-inst-blue text-white'
                        : 'icon-chip'
                    }
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-sans text-base font-bold text-deep-blue">
                      {data.name}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-mineral">
                      {data.mainMachine}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Dialog>
      )}

      {/* Modal: Confirmar Reinicio */}
      {confirmReset && (
        <Dialog
          role="alertdialog"
          labelledBy="reset-title"
          onClose={() => setConfirmReset(false)}
        >
          <p className="mono-label mb-3">Equipo compartido</p>
          <h2
            id="reset-title"
            className="mb-2 font-sans text-xl font-bold text-deep-blue"
          >
            ¿Limpiar las respuestas del taller?
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-mineral">
            Úsalo si otra persona va a sentarse en esta máquina. Se borrará tu
            avance en <strong className="text-charcoal">{currentSpecialty.name}</strong> y
            los dos párrafos que escribiste. La otra carrera no se toca.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="border border-line bg-paper-pure px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-mineral"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                startOver();
                setConfirmReset(false);
              }}
              className="bg-deep-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-inst-blue"
            >
              Sí, empezar de nuevo
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
