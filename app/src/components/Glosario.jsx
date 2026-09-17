import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BookA, X } from 'lucide-react';
import { buscarTermino } from '../data/glosario';

/* Término de glosario.
 *
 * Patrón tomado del Taller de Ensayo Argumentativo (un diccionario central
 * en vez de definiciones sueltas), con tres correcciones:
 *
 *  1. Se abre con CLIC, no con hover. En una tablet del laboratorio el
 *     hover no existe, así que la mitad de los estudiantes no vería nada.
 *  2. Es un <button> real: llega el teclado y lo anuncia el lector de
 *     pantalla. Escape cierra.
 *  3. El cuadro se dibuja en un portal con posición fija y se ajusta para
 *     no salirse de la pantalla. Dentro de una tarjeta con overflow, un
 *     popover absoluto se recorta.
 */
export function Termino({ term, children }) {
  const entry = buscarTermino(term);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();

  // Si el término no está en el glosario, no se marca: mejor sin subrayado
  // que con un subrayado que no lleva a ninguna parte.
  if (!entry) return <>{children || term}</>;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline items-baseline gap-1 border-b-2 border-dotted border-active-blue font-medium text-inst-blue transition-colors hover:border-solid hover:text-active-blue"
      >
        {children || term}
        <BookA className="ml-1 inline h-3.5 w-3.5 -translate-y-px text-active-blue" aria-hidden="true" />
        <span className="sr-only"> — ver definición</span>
      </button>

      {open && (
        <Popover
          id={panelId}
          term={term}
          entry={entry}
          triggerRef={triggerRef}
          panelRef={panelRef}
          pos={pos}
          setPos={setPos}
          onClose={() => {
            setOpen(false);
            triggerRef.current?.focus();
          }}
        />
      )}
    </>
  );
}

function Popover({ id, term, entry, triggerRef, panelRef, pos, setPos, onClose }) {
  // Posición fija calculada desde el disparador y limitada a la ventana.
  useLayoutEffect(() => {
    const place = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      const p = panelRef.current?.getBoundingClientRect();
      if (!t) return;
      const width = p?.width || 320;
      const height = p?.height || 160;
      const margin = 12;

      let left = t.left + t.width / 2 - width / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

      /* Encima del término si cabe; si no, debajo. */
      const topLimit = margin;
      const actualHeight = panelRef.current?.offsetHeight || p?.height || height;
      const spaceAbove = t.top - topLimit - 8;
      const spaceBelow = window.innerHeight - t.bottom - margin - 8;

      let top;
      if (spaceBelow >= actualHeight) {
        top = t.bottom + 8;
      } else if (spaceAbove >= actualHeight) {
        top = t.top - actualHeight - 8;
      } else {
        top = spaceBelow >= spaceAbove ? t.bottom + 8 : t.top - actualHeight - 8;
      }

      top = Math.max(margin, Math.min(top, Math.max(margin, window.innerHeight - actualHeight - margin)));

      setPos({ left, top });
    };

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [triggerRef, panelRef, setPos]);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    const onPointer = (e) => {
      if (panelRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [onClose, panelRef, triggerRef]);

  return createPortal(
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-label={`Glosario: ${term}`}
      tabIndex={-1}
      style={{
        position: 'fixed',
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        width: 'min(21rem, calc(100vw - 1.5rem))',
        maxHeight: 'calc(100vh - 2rem)',
        overflowY: 'auto',
      }}
      className="on-deep z-[70] animate-settleIn border border-dim/40 bg-deep-blue p-4 text-paper-warm no-print"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="mono-label mono-label--dark">Glosario</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar definición"
          className="-m-1 p-1 text-dim transition-colors hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className={`font-sans text-base font-bold text-white ${entry.titulo ? '' : 'capitalize'}`}>
        {entry.titulo || term}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-paper-warm">{entry.def}</p>

      {entry.ejemplo && (
        <p className="mt-3 border-t border-white/20 pt-3 font-serif text-sm italic leading-relaxed text-dim">
          {entry.ejemplo}
        </p>
      )}
    </div>,
    document.body
  );
}

/** Aviso de que las palabras subrayadas se pueden tocar. */
export function GlosarioHint() {
  return (
    <p className="mb-8 inline-flex items-center gap-2 border border-line bg-paper-card px-3 py-2 text-sm text-mineral">
      <BookA className="h-4 w-4 shrink-0 text-active-blue" aria-hidden="true" />
      Las palabras <span className="border-b-2 border-dotted border-active-blue font-medium text-inst-blue">subrayadas así</span> abren su definición al tocarlas.
    </p>
  );
}
