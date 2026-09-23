import React, { useState } from 'react';
import { ArrowLeft, Check, RotateCcw, X } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { STAGES } from '../lib/workshop';

export function SidebarNav({ activeId, isOpen, onToggle, onNavigate }) {
  const { specialty, setSpecialty, scores, startOver, moduleStatus } = useStudent();
  const [confirmReset, setConfirmReset] = useState(false);
  const doneCount = STAGES.filter((stage) => moduleStatus[stage.id] === 'done').length;
  const groups = ['Comprende', 'Practica', 'Produce'];

  return (
    <>
      {isOpen && <button type="button" onClick={() => onToggle(false)} aria-label="Cerrar menú de etapas" className="fixed inset-0 z-40 bg-deep-blue/60 lg:hidden no-print" />}
      <aside id="courseSidebar" aria-label="Etapas del taller" aria-hidden={!isOpen} inert={!isOpen} className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/15 bg-deep-blue text-white transition-transform duration-200 lg:translate-x-0 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="border-b border-white/20 px-5 py-2">
          <div className="flex items-center justify-between gap-3">
            <a href="../../recursos.html" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-white hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Recursos</a>
            <button type="button" onClick={() => onToggle(false)} aria-label="Cerrar menú de etapas" className="inline-flex h-11 w-11 items-center justify-center text-white lg:hidden"><X className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          <p className="text-sm font-bold leading-tight">Taller de texto instructivo</p>
          <p className="text-[.7rem] text-white/75">Lengua y Literatura · Bachillerato Técnico</p>
        </div>

        <div className="border-b border-white/20 px-5 py-3">
          <label htmlFor="specialty-switch" className="block text-xs font-semibold text-white/80">Ejemplos del taller</label>
          <select id="specialty-switch" value={specialty} onChange={(event) => { setSpecialty(event.target.value); onNavigate('intro'); }} className="mt-2 w-full min-h-11 border border-white/40 bg-deep-blue px-2 text-sm font-semibold text-white focus:outline-2 focus:outline-offset-2 focus:outline-white">
            {Object.entries(SPECIALTIES_DATA).map(([id, data]) => <option key={id} value={id}>{data.shortName || data.name}</option>)}
          </select>
          <p className="mt-1 text-[.7rem] text-white/75">El avance se guarda por especialidad.</p>
        </div>

        <div className="border-b border-white/20 px-5 py-3" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-white/75">Puntaje actual</p>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-white">{scores.total.toFixed(1)} <span className="text-base text-white/75">/ 10</span></p>
          <p className="mt-1 text-xs text-white/80">Etapas completadas: {doneCount} de {STAGES.length}</p>
        </div>

        <nav aria-label="Ruta de aprendizaje" className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {groups.map((group) => <div key={group} className="mb-2">
            <p className="px-3 pb-1 text-[.68rem] font-bold uppercase tracking-[.15em] text-white/65">{group}</p>
            <ol>
              {STAGES.filter((stage) => stage.group === group).map((stage) => {
                const current = activeId === stage.id;
                const done = moduleStatus[stage.id] === 'done';
                return <li key={stage.id}>
                  <button type="button" onClick={() => onNavigate(stage.id)} aria-current={current ? 'step' : undefined} className={`flex min-h-10 w-full items-center gap-3 border-l-[3px] px-3 py-1.5 text-left text-sm leading-tight transition-colors ${current ? 'border-inst-red bg-white/15 font-bold text-white' : 'border-transparent text-white/80 hover:bg-white/10 hover:text-white'}`}>
                    <span className="w-5 shrink-0 font-mono text-xs">{done ? <Check className="h-4 w-4" aria-label="Completada" /> : stage.number}</span>
                    <span>{stage.label}</span>
                  </button>
                </li>;
              })}
            </ol>
          </div>)}
        </nav>

        <div className="border-t border-white/20 px-5 py-3">
          {!confirmReset ? <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex min-h-11 items-center gap-2 text-xs text-white/85 hover:text-white"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Empezar de nuevo</button> : <div className="text-xs leading-relaxed"><p>Se borrarán las respuestas de {SPECIALTIES_DATA[specialty].name} en este equipo.</p><div className="mt-2 flex gap-3"><button type="button" onClick={() => setConfirmReset(false)} className="min-h-11 underline">Cancelar</button><button type="button" onClick={() => { startOver(); setConfirmReset(false); onNavigate('intro'); }} className="min-h-11 font-bold underline">Borrar respuestas</button></div></div>}
        </div>
      </aside>
    </>
  );
}
