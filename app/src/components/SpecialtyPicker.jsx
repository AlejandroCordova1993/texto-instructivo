import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { Wrench, Cog, ArrowRight, ShieldAlert, PenLine, ListOrdered } from 'lucide-react';

const CAREERS = [
  {
    id: 'automotriz',
    Icon: Wrench,
    blurb: 'Vas a trabajar sobre un caso real de elevador hidráulico: pernos de culata, zapatas de chasis y circuitos del vehículo.',
  },
  {
    id: 'industrial',
    Icon: Cog,
    blurb: 'Vas a trabajar sobre mecanizado de precisión (torno, fresa, micrómetro) y construcciones metálicas (soldadura SMAW/MIG, corte de perfiles y planos técnicos).',
  },
];

const PROMISES = [
  { Icon: ShieldAlert, text: 'Vas a ver cómo una frase ambigua termina en un accidente de taller.' },
  { Icon: PenLine, text: 'Vas a aprender a escribir órdenes técnicas que no se malinterpretan.' },
  { Icon: ListOrdered, text: 'Vas a emitir tu propia Ficha de Operación Segura para entregar.' },
];

/* Pantalla de entrada.
 *
 * Ya no se pide nombre ni curso: el estudiante escribe su nombre a mano en
 * la ficha impresa. Lo único que el taller necesita para personalizar el
 * contenido es la carrera, así que esa es la única decisión de esta pantalla.
 */
export function SpecialtyPicker() {
  const { specialty, chooseSpecialty } = useStudent();
  const [picked, setPicked] = useState(specialty || 'automotriz');

  return (
    <main className="flex min-h-screen flex-col justify-center bg-paper-warm px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-brand">
        <p className="mono-label mb-5">Bachillerato Técnico · Lengua y Literatura</p>

        <h1 className="max-w-4xl font-sans text-3xl font-bold leading-tight tracking-tight text-deep-blue sm:text-4xl lg:text-5xl">
          Taller de Texto Instructivo
        </h1>

        <p className="mt-5 max-w-reading font-serif text-lg italic leading-relaxed text-mineral sm:text-xl">
          Una instrucción mal escrita no es una falta de ortografía: es un dedo
          aplastado. Aquí aprendes a escribirlas bien.
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-y border-line py-7 sm:grid-cols-3">
          {PROMISES.map(({ Icon, text }) => (
            <li key={text} className="flex gap-3">
              <span className="icon-chip">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-relaxed text-charcoal">{text}</span>
            </li>
          ))}
        </ul>

        <section aria-labelledby="picker-title" className="mt-12">
          <h2 id="picker-title" className="font-sans text-xl font-bold text-deep-blue">
            ¿En qué taller trabajas?
          </h2>
          <p className="mt-1.5 max-w-reading text-base text-mineral">
            Todos los ejemplos, casos y ejercicios se adaptan a la carrera que elijas.
            Puedes cambiarla después sin perder tu avance.
          </p>

          <div role="radiogroup" aria-labelledby="picker-title" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {CAREERS.map(({ id, Icon, blurb }) => {
              const data = SPECIALTIES_DATA[id];
              const isActive = picked === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setPicked(id)}
                  className="card-pick gap-4 p-5 sm:p-6"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className={isActive ? 'icon-chip border-inst-blue bg-inst-blue text-white' : 'icon-chip'}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={`px-2 py-0.5 font-mono text-label uppercase tracking-label ${
                        isActive ? 'bg-inst-blue text-white' : 'border border-line text-mineral'
                      }`}
                    >
                      {isActive ? 'Elegida' : 'Elegir'}
                    </span>
                  </span>

                  <span className="block font-sans text-lg font-bold text-deep-blue">
                    {data.name}
                  </span>
                  <span className="block text-base leading-relaxed text-mineral">{blurb}</span>
                  <span className="mt-1 block border-t border-line pt-3 font-mono text-label uppercase tracking-label text-mineral">
                    Máquina: {data.mainMachine}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <button
              type="button"
              onClick={() => chooseSpecialty(picked)}
              className="group inline-flex min-h-[3.25rem] items-center justify-center gap-2.5 bg-deep-blue px-8 py-4 text-base font-bold text-white transition-colors hover:bg-inst-blue"
            >
              Empezar el taller
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <p className="text-sm text-mineral">
              Tu avance se guarda en este equipo. Al final imprimes tu ficha y
              escribes tu nombre a mano.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
