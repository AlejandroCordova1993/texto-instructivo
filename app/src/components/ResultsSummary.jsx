import React, { useEffect, useRef, useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { KeyIdea, Callout } from './Didactics';
import { Printer, RotateCcw, ArrowRight, Check, Trophy } from 'lucide-react';
import { getDraftReadiness } from '../lib/workshop';

const CRITERIA = [
  { key: 'forensic', label: 'Problemas de redacción', module: '02', anchor: '#forensic' },
  { key: 'antiComodin', label: 'Uso de términos precisos', module: '02', anchor: '#forensic' },
  { key: 'verbal', label: 'Consistencia de modos verbales', module: '03', anchor: '#verbal' },
  { key: 'sequence', label: 'Cohesión con conectores', module: '04', anchor: '#sequence' },
  { key: 'safetySheet', label: 'Estructura del texto instructivo', module: '05', anchor: '#safety-sheet' },
];

function levelFor(total) {
  if (total >= 9) return { title: 'Muy buen dominio', note: 'Revisa una vez más la claridad de tu texto antes de entregarlo.' };
  if (total >= 7) return { title: 'Buen avance', note: 'Ya aplicas varios criterios; usa el desglose para afinar los restantes.' };
  if (total >= 5) return { title: 'En desarrollo', note: 'Vuelve a los criterios señalados y mejora tu trabajo.' };
  return { title: 'En proceso', note: 'Lee la retroalimentación y continúa las actividades pendientes.' };
}

function ConfirmReset({ onCancel, onConfirm }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-deep-blue/90 backdrop-blur-sm no-print">
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={ref}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reset-title"
          aria-describedby="reset-desc"
          className="w-full max-w-md border border-line bg-paper-card p-6"
        >
          <h3 id="reset-title" className="mb-2 font-sans text-xl font-bold text-deep-blue">
            ¿Reiniciar esta especialidad?
          </h3>
          <p id="reset-desc" className="mb-6 text-sm leading-relaxed text-mineral">
            Se borran tus respuestas y <strong className="text-charcoal">los dos párrafos que
            escribiste</strong> en esta carrera. Tu avance en la otra especialidad no se toca.
            Si aún no imprimiste tu texto, hazlo antes.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="border border-line bg-paper-pure px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-mineral"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-deep-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-inst-blue"
            >
              Sí, reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Línea para rellenar a mano en el documento impreso. */
function FillLine({ label }) {
  return (
    <div>
      <dt className="font-mono text-label uppercase tracking-label text-mineral">{label}</dt>
      <dd className="mt-2 border-b border-charcoal pb-1">
        <span className="sr-only">(para completar a mano)</span>
        <span aria-hidden="true">&nbsp;</span>
      </dd>
    </div>
  );
}

export function ResultsSummary() {
  const { specialty, scores, progress, resetProgress, markResultsReviewed } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { mainMachine, name: specialtyName } = specialtyData;

  const [confirming, setConfirming] = useState(false);

  const total = scores.total || 0;
  const level = levelFor(total);
  const pending = CRITERIA.filter((c) => scores[c.key] < 2);
  const draft = getDraftReadiness(progress.safetySheet, specialtyData.safetyEquipments);

  useEffect(() => { markResultsReviewed(); }, [markResultsReviewed]);

  const today = new Date().toLocaleDateString('es-EC', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <SectionWrapper
      id="results"
      step="06"
      monoTag="Evaluación formativa y entrega"
      title="Revisa tu puntaje y tu texto"
      subtitle="Aquí ves los puntos de tus actividades y del texto instructivo. Si falta algo, vuelve a la etapa correspondiente antes de imprimir."
    >
      {/* Rúbrica — no se imprime */}
      <div className="no-print">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Marcador */}
          <div className="card-deep flex flex-col justify-between">
            <div>
              <span className="icon-chip icon-chip--deep mb-5">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mono-label mono-label--dark mb-3">Calificación formativa</p>
              <p className="font-mono text-5xl font-bold tabular-nums leading-none text-white">
                {total.toFixed(1)}
                <span className="text-2xl font-normal text-dim"> / 10</span>
              </p>
              <p className="mt-5 font-sans text-lg font-bold text-white">{level.title}</p>
              <p className="mt-1.5 text-base leading-relaxed text-dim">{level.note}</p>
            </div>

            <div
              role="progressbar"
              aria-valuenow={total}
              aria-valuemin={0}
              aria-valuemax={10}
              aria-label="Puntaje total"
              className="mt-7 h-2.5 w-full border border-white/25"
            >
              <div
                className="h-full bg-signal-red transition-[width] duration-500 ease-out"
                style={{ width: `${(total / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Desglose */}
          <div className="card">
            <h3 className="mb-4 font-sans text-lg font-bold text-deep-blue">
              Desglose por criterio
            </h3>
            <ul className="divide-y divide-line border-y border-line">
              {CRITERIA.map(({ key, label, module, anchor }) => {
                const value = scores[key];
                const done = value >= 2;
                return (
                  <li key={key} className="flex items-center justify-between gap-4 py-3.5">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-label ${
                          done ? 'border-inst-blue bg-inst-blue text-white' : 'border-line text-mineral'
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : module}
                      </span>
                      <span className="truncate text-base text-charcoal">{label}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-base font-bold tabular-nums text-deep-blue">
                        {value.toFixed(1)}<span className="font-normal text-mineral">/2</span>
                      </span>
                      {!done && (
                        <a
                          href={anchor}
                          className="inline-flex items-center gap-1 border-b border-active-blue/40 pb-0.5 font-sans text-sm font-medium text-active-blue transition-colors hover:border-active-blue"
                        >
                          Revisar
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="sr-only"> al módulo {module}</span>
                        </a>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            {pending.length > 0 && (
              <p className="mt-5 text-base leading-relaxed text-mineral">
                En <strong className="text-charcoal">{pending.length}</strong>{' '}
                {pending.length === 1 ? 'criterio obtuviste' : 'criterios obtuviste'} menos de 2 puntos.
                Puedes revisar esas etapas; una actividad terminada puede conservar menos puntos por intentos anteriores.
              </p>
            )}
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-mineral">
              El puntaje comprueba respuestas y requisitos de estructura. Tu docente debe revisar la claridad y la pertinencia técnica del texto.
            </p>
          </div>
        </div>

        {!draft.ready && <div className="mt-8 border-t-2 border-inst-red bg-paper-card px-5 py-4 text-sm leading-relaxed">
          <p className="font-bold text-deep-blue">Antes de imprimir, completa tu texto instructivo en la etapa 05:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-charcoal">
            {!draft.checks.epp && <li>Selecciona el equipo de protección necesario, sin elementos ajenos al procedimiento.</li>}
            {!draft.checks.preparation && <li>Redacta al menos 120 caracteres sobre seguridad e inspección.</li>}
            {!draft.checks.procedure && <li>Redacta al menos 120 caracteres sobre el procedimiento.</li>}
            {!draft.checks.connectors && <li>Incluye dos conectores temporales distintos en el procedimiento.</li>}
          </ul>
          <a href="#safety-sheet" className="mt-3 inline-flex min-h-11 items-center font-bold text-inst-blue underline">Volver a mi texto</a>
        </div>}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!draft.ready}
            className="flex min-h-[3.25rem] items-center gap-2.5 bg-deep-blue px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-inst-blue disabled:cursor-not-allowed disabled:bg-mineral"
          >
            <Printer className="h-5 w-5" aria-hidden="true" />
            Imprimir mi texto instructivo (1 hoja)
          </button>

          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex min-h-[2.75rem] items-center gap-2 border-b border-mineral/50 py-1 text-sm font-medium text-mineral transition-colors hover:border-charcoal hover:text-charcoal"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reiniciar esta especialidad
          </button>
        </div>

        <div className="mt-6">
          <Callout tone="aviso" title="Antes de imprimir">
            Solo se imprime tu texto instructivo, no las actividades del taller.{' '}
            <strong className="text-charcoal">Escribe tu nombre y tu curso a mano</strong> en
            las líneas del documento.
          </Callout>
        </div>
      </div>

      {/* ------------------------------------------------------------------
          DOCUMENTO IMPRIMIBLE
          Única raíz que llega al papel (ver @media print en index.css).
          ------------------------------------------------------------------ */}
      {draft.ready && <article
        id="ficha-imprimible"
        className="mt-12 border-2 border-charcoal bg-paper-pure p-6 text-charcoal sm:p-10 print-page-break"
      >
        <header className="mb-8 border-b-2 border-charcoal pb-5 text-center">
          <p className="font-mono text-label uppercase tracking-label text-charcoal">Lengua y Literatura · Bachillerato Técnico</p>
          <h2 className="mt-1.5 font-sans text-xl font-bold uppercase tracking-tight text-deep-blue sm:text-2xl">
            Mi texto instructivo
          </h2>
          <p className="mt-1 font-serif text-sm italic text-mineral">
            Ejercicio de redacción; no sustituye el manual del equipo ni la supervisión docente
          </p>
          <p className="mt-3 inline-block border border-charcoal px-3 py-1 font-mono text-label font-medium uppercase tracking-label print-keep-ink">
            Trabajo del estudiante
          </p>
        </header>

        {/* Nombre y curso se completan a mano sobre el papel. */}
        <dl className="mb-8 grid grid-cols-1 gap-x-8 gap-y-5 border-y border-line py-5 sm:grid-cols-2">
          <FillLine label="Nombre del estudiante" />
          <FillLine label="Curso y paralelo" />
          <div>
            <dt className="font-mono text-label uppercase tracking-label text-mineral">Especialidad técnica</dt>
            <dd className="mt-1 font-sans text-base font-bold text-deep-blue">{specialtyName}</dd>
          </div>
          <div>
            <dt className="font-mono text-label uppercase tracking-label text-mineral">Fecha de emisión</dt>
            <dd className="mt-1 font-sans text-base font-bold text-deep-blue">{today}</dd>
          </div>
        </dl>

        <section className="mb-7">
          <h4 className="mb-2 border-b border-line pb-1 font-mono text-label font-medium uppercase tracking-label text-deep-blue">
            1. Equipo asignado y calificación formativa
          </h4>
          <p className="text-sm leading-relaxed">
            <strong>Máquina o dispositivo:</strong> {mainMachine}
          </p>
          <p className="text-sm leading-relaxed">
            <strong>Modo verbal elegido:</strong>{' '}
            <span className="font-mono uppercase">{progress.safetySheet?.verbalModeChosen || 'infinitivo'}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            <strong>Calificación formativa:</strong>{' '}
            <span className="font-mono font-bold tabular-nums">{total.toFixed(1)} / 10.0</span>
            {' '}— {level.title}
          </p>
          <p className="mt-1 font-mono text-xs text-mineral">
            {CRITERIA.map(({ key, module }) => `${module}: ${scores[key].toFixed(1)}`).join(' · ')}
          </p>
        </section>

        <section className="mb-7">
          <h4 className="mb-2 border-b border-line pb-1 font-mono text-label font-medium uppercase tracking-label text-deep-blue">
            2. Seguridad previa, EPP e inspección del área
          </h4>
          <p className="font-serif text-sm leading-relaxed">
            {progress.safetySheet?.paragraph1 || (
              <span className="italic text-mineral">
                (Sin completar. Redacta el párrafo 1 en el módulo 05 para que aparezca aquí.)
              </span>
            )}
          </p>
        </section>

        <section className="mb-10">
          <h4 className="mb-2 border-b border-line pb-1 font-mono text-label font-medium uppercase tracking-label text-deep-blue">
            3. Secuencia operativa y protocolo de parada segura
          </h4>
          <p className="font-serif text-sm leading-relaxed">
            {progress.safetySheet?.paragraph2 || (
              <span className="italic text-mineral">
                (Sin completar. Redacta el párrafo 2 en el módulo 05 para que aparezca aquí.)
              </span>
            )}
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8 border-t border-line pt-10 text-center sm:grid-cols-2">
          <div>
            <div className="mx-auto mb-1.5 w-full max-w-[12rem] border-b border-charcoal" />
            <p className="font-sans text-sm font-bold text-deep-blue">Firma del estudiante</p>
            <p className="font-mono text-label uppercase tracking-label text-mineral">Autor del texto</p>
          </div>
          <div>
            <div className="mx-auto mb-1.5 w-full max-w-[12rem] border-b border-charcoal" />
            <p className="font-sans text-sm font-bold text-deep-blue">Docente / instructor de taller</p>
            <p className="font-mono text-label uppercase tracking-label text-mineral">Área de Lengua y Literatura / Técnica</p>
          </div>
        </div>

        <p className="mt-8 border-t border-line pt-4 text-center font-mono text-label uppercase tracking-label text-mineral">
          Documento de práctica pedagógica · No es un protocolo oficial de seguridad
        </p>
      </article>}

      <KeyIdea title="Antes de usar un equipo">
        Escribir instrucciones claras ayuda a que otra persona comprenda el orden
        y las condiciones de una tarea. Tu texto muestra cómo organizas esas
        ideas; antes de operar un equipo, consulta siempre su manual y a tu docente.
      </KeyIdea>

      {confirming && (
        <ConfirmReset
          onCancel={() => setConfirming(false)}
          onConfirm={() => { resetProgress(); setConfirming(false); }}
        />
      )}
    </SectionWrapper>
  );
}
