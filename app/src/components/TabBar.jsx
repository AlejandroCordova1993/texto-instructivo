import React, { useRef } from 'react';

/* Una sola implementación de pestañas para todo el taller.
 *
 * Antes había tres formas distintas de "elegir uno" (botón con anillo,
 * div clicable, pestaña subrayada) y ninguna respondía al teclado.
 * Esta expone role=tablist y navegación con flechas.
 */
export function TabBar({ tabs, value, onChange, label }) {
  const refs = useRef([]);

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === value);
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="mb-10 flex gap-6 overflow-x-auto border-b border-line no-scrollbar"
    >
      {tabs.map((tab, i) => {
        const isActive = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            type="button"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap border-b-2 pb-3 pt-1 font-sans text-base transition-colors ${
              isActive
                ? 'border-deep-blue font-bold text-deep-blue'
                : 'border-transparent font-medium text-mineral hover:text-charcoal'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span
                className={`px-2 py-0.5 font-mono text-label tabular-nums ${
                  isActive ? 'bg-deep-blue text-white' : 'bg-line text-charcoal'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
