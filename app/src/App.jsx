import React, { useEffect, useState } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import { SidebarNav } from './components/SidebarNav';
import { SpecialtyPicker } from './components/SpecialtyPicker';
import { IntroSection } from './components/IntroSection';
import { ForensicLab } from './components/ForensicLab';
import { VerbalModes } from './components/VerbalModes';
import { SequenceConnectors } from './components/SequenceConnectors';
import { SafetySheetBuilder } from './components/SafetySheetBuilder';
import { ResultsSummary } from './components/ResultsSummary';
import { SPECIALTIES_DATA } from './data/curriculumData';
import { Siren, SearchCheck, Type, ListOrdered, FileSignature, Award, Check, ArrowRight, PanelLeft, ArrowLeft } from 'lucide-react';

const ROUTE = [
  { id: 'intro', step: '01', Icon: Siren, title: 'El impacto', goal: 'Ves qué pasa cuando una orden admite dos lecturas.' },
  { id: 'forensic', step: '02', Icon: SearchCheck, title: 'Lab forense', goal: 'Cazas los tres vicios y cambias las palabras comodín.' },
  { id: 'verbal', step: '03', Icon: Type, title: 'Modos verbales', goal: 'Eliges imperativo o infinitivo y lo sostienes.' },
  { id: 'sequence', step: '04', Icon: ListOrdered, title: 'Secuencia', goal: 'Ordenas un procedimiento y lo unes con conectores.' },
  { id: 'safety-sheet', step: '05', Icon: FileSignature, title: 'Tu ficha', goal: 'Redactas los dos párrafos de tu documento.' },
  { id: 'results', step: '06', Icon: Award, title: 'Tu resultado', goal: 'Revisas tu desempeño e imprimes la ficha.' },
];

function Workshop() {
  const { specialty, registerMeta, moduleStatus } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* El cálculo del puntaje necesita saber cuántos ítems tiene la
   * especialidad activa y qué EPP son trampa. */
  useEffect(() => {
    registerMeta({
      antiComodinCount: specialtyData.antiComodin.length,
      requiredEpp: specialtyData.safetyEquipments.filter((e) => e.required).map((e) => e.id),
      trapEpp: specialtyData.safetyEquipments.filter((e) => !e.required).map((e) => e.id),
    });
  }, [specialtyData, registerMeta]);

  return (
    <div className="min-h-screen bg-paper-warm text-charcoal print:pl-0">
      <a
        href="#intro"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-deep-blue focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Saltar al contenido
      </a>

      {/* Botones flotantes para abrir sidebar o volver a recursos cuando esté oculto */}
      <div
        className={`fixed left-4 top-4 z-40 items-center gap-2 no-print ${
          sidebarOpen ? 'hidden' : 'flex'
        }`}
      >
        <a
          href="../../recursos.html"
          aria-label="Volver al catálogo de recursos"
          className="inline-flex items-center gap-1.5 border border-white/20 bg-deep-blue/95 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm transition-all hover:bg-inst-blue hover:border-white/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Recursos</span>
        </a>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Mostrar menú del taller"
          className="inline-flex items-center gap-2 border border-white/20 bg-deep-blue/95 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm transition-all hover:bg-inst-blue hover:border-white/40"
        >
          <PanelLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Índice del taller</span>
        </button>
      </div>

      {/* Barra lateral izquierda */}
      <SidebarNav isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Contenedor principal con margen izquierdo dinámico */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-300 ease-in-out print:pl-0 ${
          sidebarOpen ? 'lg:pl-[280px]' : 'pl-0'
        }`}
      >

      {/* Portada: la ruta completa, visible antes de empezar. Saber cuántas
          paradas tiene el camino baja la carga de entrar en la primera. */}
      <section className="on-deep border-b border-white/15 bg-deep-blue px-4 py-14 text-paper-warm sm:px-6 sm:py-16 lg:px-8 no-print">
        <div className="mx-auto max-w-brand">
          <p className="mono-label mono-label--dark mb-5">
            Tu taller · {specialtyData.name}
          </p>

          <h1 className="max-w-3xl font-sans text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            El texto instructivo en el taller técnico
          </h1>

          <p className="mt-5 max-w-reading font-serif text-lg italic leading-relaxed text-dim">
            Seis paradas, unos cuarenta minutos, y al final un documento firmado
            por ti. Trabajarás sobre {specialtyData.mainMachine.toLowerCase()}.
          </p>

          <ol className="mt-10 grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {ROUTE.map(({ id, step, Icon, title, goal }) => {
              const isDone = moduleStatus[id] === 'done';
              return (
                <li key={id} className="bg-deep-blue">
                  <a
                    href={`#${id}`}
                    className="group flex h-full gap-4 p-5 transition-colors hover:bg-white/5"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
                        isDone ? 'border-inst-blue bg-inst-blue text-white' : 'border-white/25 bg-white/10 text-white'
                      }`}
                    >
                      {isDone
                        ? <Check className="h-5 w-5" aria-hidden="true" />
                        : <Icon className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-label text-dim">{step}</span>
                        <span className="font-sans text-base font-bold text-white">{title}</span>
                        <ArrowRight
                          className="h-4 w-4 shrink-0 text-dim opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-dim">{goal}</span>
                      {isDone && <span className="sr-only"> (completado)</span>}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <main className="grow">
        <IntroSection />
        <ForensicLab />
        <VerbalModes />
        <SequenceConnectors />
        <SafetySheetBuilder />
        <ResultsSummary />
      </main>

      <footer className="on-deep border-t border-white/15 bg-deep-blue px-4 py-10 text-paper-warm sm:px-6 lg:px-8 no-print">
        <div className="mx-auto flex max-w-brand flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-base font-bold text-white">
              Taller de Texto Instructivo
            </p>
            <p className="mt-1 text-sm text-dim">
              Quito, Ecuador · Área de Lengua y Literatura y Formación Técnica
            </p>
          </div>
          <p className="text-xs text-dim">
            Sistema de identidad <em>Human / System</em> — Alejandro Córdova
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
}

function AppContent() {
  const { hasChosen } = useStudent();
  return hasChosen ? <Workshop /> : <SpecialtyPicker />;
}

export default function App() {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}
