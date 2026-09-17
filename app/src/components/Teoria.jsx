import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, X, ArrowUp, GraduationCap } from 'lucide-react';
import { teoriaDe } from '../data/teoria';
import { Termino } from './Glosario';

/* Teoría y práctica en paralelo.
 *
 * Dos piezas que comparten el mismo contenido:
 *
 *  · TeoriaSection — el desarrollo completo, antes de la práctica.
 *  · RepasoFlotante — el resumen, disponible MIENTRAS se practica, para
 *    que consultar la regla no obligue a abandonar el ejercicio y perder
 *    el hilo. Ahí está lo «paralelo»: la teoría no se cierra al empezar
 *    a practicar, queda a un toque.
 */

function Concepto({ titulo, texto }) {
  return (
    <div className="border-t border-line pt-5">
      <h4 className="font-sans text-base font-bold text-deep-blue">{titulo}</h4>
      <p className="mt-2 max-w-reading text-base leading-relaxed text-charcoal">{texto}</p>
    </div>
  );
}

function ListaConceptos({ titulo, items }) {
  return (
    <div className="border-t border-line pt-5">
      <h4 className="mb-4 font-sans text-base font-bold text-deep-blue">{titulo}</h4>
      <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map(({ term, def, ejemplo }) => (
          <div key={term} className="card-quiet">
            <dt className="font-sans text-base font-bold text-inst-blue">
              <Termino term={term}>{term}</Termino>
            </dt>
            <dd className="mt-2 text-base leading-relaxed text-charcoal">
              {def}
              {ejemplo && (
                <span className="mt-3 block border-l-2 border-line pl-4 font-serif text-sm italic leading-relaxed text-mineral">
                  {ejemplo}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Tabla({ titulo, nota, encabezados, filas }) {
  return (
    <div className="border-t border-line pt-5">
      <h4 className="font-sans text-base font-bold text-deep-blue">{titulo}</h4>
      {nota && <p className="mt-2 max-w-reading text-base leading-relaxed text-charcoal">{nota}</p>}

      {/* Escritorio: tabla. Móvil: tarjetas apiladas, nunca scroll lateral. */}
      <div className="mt-4 hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-y border-line">
              {encabezados.map((h) => (
                <th key={h} scope="col" className="py-3 pr-6 font-mono text-label uppercase tracking-label text-mineral">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filas.map((fila) => (
              <tr key={fila[0]}>
                {fila.map((celda, i) => (
                  <td
                    key={celda}
                    className={`py-3.5 pr-6 align-top text-base leading-relaxed ${
                      i === 0 ? 'font-semibold text-deep-blue' : 'text-charcoal'
                    }`}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 space-y-3 md:hidden">
        {filas.map((fila) => (
          <li key={fila[0]} className="card-quiet">
            <p className="font-sans text-base font-bold text-deep-blue">{fila[0]}</p>
            {fila.slice(1).map((celda, i) => (
              <p key={celda} className="mt-2 text-base leading-relaxed text-charcoal">
                <span className="mono-label mono-label--plain mb-1 block">{encabezados[i + 1]}</span>
                {celda}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Formula({ titulo, pasos }) {
  return (
    <div className="border-t border-line pt-5">
      <h4 className="mb-4 font-sans text-base font-bold text-deep-blue">{titulo}</h4>
      <ol className="flex flex-wrap items-stretch gap-2">
        {pasos.map((paso, i) => (
          <li key={paso} className="flex items-center gap-2">
            <span className="border border-inst-blue bg-ok-bg px-3 py-2 text-sm font-medium text-inst-blue">
              {paso}
            </span>
            {i < pasos.length - 1 && (
              <span aria-hidden="true" className="font-mono text-mineral">→</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Bloque de teoría completo, antes de la práctica. */
export function TeoriaSection({ moduleId }) {
  const teoria = teoriaDe(moduleId);
  if (!teoria) return null;

  return (
    <section id={`teoria-${moduleId}`} aria-labelledby={`teoria-${moduleId}-titulo`} className="anchor-offset mb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="icon-chip">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="mono-label mono-label--plain mb-1">La teoría</p>
            <h3 id={`teoria-${moduleId}-titulo`} className="font-sans text-xl font-bold text-deep-blue">
              {teoria.titulo}
            </h3>
          </div>
        </div>
        {teoria.dcd && (
          <p className="meta-pill" title="Referencia curricular para el docente">
            {teoria.dcd}
          </p>
        )}
      </div>

      {teoria.intro && (
        <p className="mb-7 max-w-reading font-serif text-lg italic leading-relaxed text-mineral">
          {teoria.intro}
        </p>
      )}

      <div className="space-y-7">
        {teoria.bloques.map((b, i) => {
          if (b.tipo === 'concepto') return <Concepto key={i} {...b} />;
          if (b.tipo === 'lista') return <ListaConceptos key={i} {...b} />;
          if (b.tipo === 'tabla') return <Tabla key={i} {...b} />;
          if (b.tipo === 'formula') return <Formula key={i} {...b} />;
          return null;
        })}
      </div>
    </section>
  );
}

/* Panel de repaso: el resumen de la teoría, disponible durante la práctica. */
function RepasoPanel({ moduleId, onClose }) {
  const teoria = teoriaDe(moduleId);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby="repaso-titulo"
      tabIndex={-1}
      className="on-deep fixed inset-x-0 bottom-0 z-[60] max-h-[70vh] overflow-y-auto border-t-2 border-signal-red bg-deep-blue p-5 text-paper-warm no-print sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-h-[70vh] sm:w-[22rem] sm:border sm:border-dim/40 sm:border-t-2 sm:border-t-signal-red"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mono-label mono-label--dark mb-1">Repaso rápido</p>
          <h2 id="repaso-titulo" className="font-sans text-base font-bold text-white">
            {teoria.titulo}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar el repaso"
          className="-m-1 p-1 text-dim transition-colors hover:text-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <ul className="space-y-3">
        {teoria.resumen.map((punto) => (
          <li key={punto} className="flex gap-2.5 text-sm leading-relaxed text-paper-warm">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal-red" />
            {punto}
          </li>
        ))}
      </ul>

      <a
        href={`#teoria-${moduleId}`}
        onClick={onClose}
        className="mt-5 inline-flex items-center gap-2 border-b border-dim/60 pb-0.5 text-sm font-medium text-white transition-colors hover:border-white"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        Ver la teoría completa
      </a>
    </div>,
    document.body
  );
}

/** Botón flotante que abre el repaso. Solo aparece dentro de su módulo. */
export function RepasoFlotante({ moduleId, visible }) {
  const [open, setOpen] = useState(false);
  const teoria = teoriaDe(moduleId);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  if (!teoria || !visible) return null;

  return (
    <>
      {!open && createPortal(
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[55] flex min-h-[3rem] items-center gap-2.5 border border-white/25 bg-deep-blue px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-inst-blue no-print on-deep"
        >
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          Repasar la teoría
        </button>,
        document.body
      )}

      {open && <RepasoPanel moduleId={moduleId} onClose={() => setOpen(false)} />}
    </>
  );
}
