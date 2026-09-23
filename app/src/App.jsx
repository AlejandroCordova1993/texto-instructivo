import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Menu } from 'lucide-react';
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
import { STAGES } from './lib/workshop';

const STAGE_COMPONENTS = {
  intro: IntroSection,
  forensic: ForensicLab,
  verbal: VerbalModes,
  sequence: SequenceConnectors,
  'safety-sheet': SafetySheetBuilder,
  results: ResultsSummary,
};

function stageFromHash() {
  const id = window.location.hash.slice(1);
  return STAGES.some((stage) => stage.id === id) ? id : STAGES[0].id;
}

function Workshop() {
  const { specialty, registerMeta, scores } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const [activeId, setActiveId] = useState(stageFromHash);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    registerMeta({
      antiComodinCount: specialtyData.antiComodin.length,
      requiredEpp: specialtyData.safetyEquipments.filter((item) => item.required).map((item) => item.id),
      trapEpp: specialtyData.safetyEquipments.filter((item) => !item.required).map((item) => item.id),
    });
  }, [specialtyData, registerMeta]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      const id = window.location.hash.slice(1);
      if (STAGES.some((stage) => stage.id === id)) setActiveId(id);
    };
    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeId]);

  const navigate = useCallback((id) => {
    if (!STAGES.some((stage) => stage.id === id)) return;
    setActiveId(id);
    window.history.pushState(null, '', `#${id}`);
    setMenuOpen(false);
  }, []);

  const index = Math.max(0, STAGES.findIndex((stage) => stage.id === activeId));
  const stage = STAGES[index];
  const StageComponent = STAGE_COMPONENTS[stage.id];

  return (
    <div className="min-h-screen bg-paper-warm text-charcoal">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-deep-blue focus:px-4 focus:py-3 focus:text-white">
        Saltar al contenido
      </a>
      <SidebarNav activeId={stage.id} isOpen={!isMobile || menuOpen} onToggle={setMenuOpen} onNavigate={navigate} />
      <div className="lg:pl-[280px] print:pl-0">
        <div className="sticky top-0 z-30 flex min-h-[4.25rem] items-center justify-between gap-3 border-b border-line bg-paper-card px-4 lg:hidden no-print">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir etapas del taller" aria-expanded={menuOpen} aria-controls="courseSidebar" className="inline-flex min-h-11 items-center gap-2 font-sans text-sm font-bold text-deep-blue">
            <Menu className="h-5 w-5" aria-hidden="true" /> Etapas
          </button>
          <p aria-live="polite" className="font-mono text-sm font-bold tabular-nums text-deep-blue">Puntaje {scores.total.toFixed(1)} / 10</p>
        </div>
        <main id="contenido" tabIndex={-1} className="min-h-screen">
          <div className="border-b border-line bg-paper-card px-4 py-3 sm:px-6 lg:px-8 no-print">
            <div className="mx-auto flex max-w-stage flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[.12em] text-muted">
              <span>Taller de texto instructivo</span>
              <span>{stage.group} · Etapa {index + 1} de {STAGES.length}</span>
            </div>
          </div>
          <StageComponent />
          <nav aria-label="Avanzar entre etapas" className="mx-auto flex max-w-stage flex-col gap-3 border-t border-line px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-0 no-print">
            {index > 0 ? (
              <button type="button" onClick={() => navigate(STAGES[index - 1].id)} className="inline-flex min-h-11 items-center gap-2 text-left text-sm font-bold text-deep-blue hover:underline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Anterior: {STAGES[index - 1].label}
              </button>
            ) : <span />}
            {index < STAGES.length - 1 ? (
              <button type="button" onClick={() => navigate(STAGES[index + 1].id)} className="inline-flex min-h-11 items-center justify-end gap-2 text-right text-sm font-bold text-deep-blue hover:underline">
                Siguiente: {STAGES[index + 1].label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : <p className="max-w-sm text-sm text-muted">Puedes volver a cualquier etapa para mejorar tu trabajo y tu puntaje.</p>}
          </nav>
        </main>
      </div>
    </div>
  );
}

function AppContent() {
  const { hasChosen } = useStudent();
  return hasChosen ? <Workshop /> : <SpecialtyPicker />;
}

export default function App() {
  return <StudentProvider><AppContent /></StudentProvider>;
}
