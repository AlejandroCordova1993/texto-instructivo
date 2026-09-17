import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStudent, CONNECTOR_LIST, countConnectors } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { KeyIdea, Callout, StepHeading } from './Didactics';
import { Check, AlertTriangle, Lightbulb, BookOpen, HardHat, PenLine, Megaphone, BookMarked, Info, ShieldAlert, FileText, ListOrdered } from 'lucide-react';
import { Termino } from './Glosario';

const STARTERS = {
  automotriz: {
    p1: ['Antes de intervenir el elevador…', 'El técnico debe colocarse…', 'Se inspecciona el área verificando…'],
    p2: ['Inicialmente, centrar…', 'Posteriormente, accionar…', 'Finalmente, verificar…'],
  },
  industrial: {
    p1: ['Antes de iniciar la soldadura y el mecanizado…', 'El estudiante debe equiparse con…', 'Se inspecciona el área de trabajo verificando…'],
    p2: ['Inicialmente, interpretar el plano técnico…', 'Posteriormente, aplicar el cordón de soldadura…', 'Finalmente, desalojar la escoria…'],
  },
};

const MODELS = {
  automotriz: {
    p1: 'Antes de intervenir el elevador hidráulico de dos columnas, el técnico debe colocarse el overol de trabajo, las botas punta de acero dieléctricas, las gafas de policarbonato y los guantes de nitrilo. En primer lugar, se inspecciona visualmente el área de maniobra, verificando la ausencia de derrames de lubricante y comprobando el estado de las zapatas de goma.',
    p2: 'Inicialmente, centrar el vehículo entre las columnas del elevador y ubicar las zapatas de goma en los puntos de apoyo del chasis. Posteriormente, accionar el pulsador de ascenso de forma continua hasta la altura de trabajo y asentar sobre las trabas mecánicas. Finalmente, verificar la estabilidad lateral del automotor y registrar la tarea en la bitácora.',
  },
  industrial: {
    p1: 'Antes de iniciar las operaciones de soldadura y mecanizado de perfiles estructurales, el estudiante debe colocarse el overol de trabajo, las botas con puntera de acero, las polainas, el delantal de cuero de descarne y la careta fotosensible con filtro DIN 11. En primer lugar, se inspecciona el puesto de trabajo, verificando la ausencia de solventes inflamables en el suelo, asegurando una ventilación adecuada contra humos metálicos y comprobando que los cables del equipo de soldadura no presenten fisuras ni empalmes expuestos.',
    p2: 'Inicialmente, interpretar las cotas del plano técnico, cortar los perfiles de acero al milímetro con la tronzadora y biselar los bordes con la amoladora angular. Posteriormente, fijar las piezas con prensas de banco, graduar la máquina a 90 amperios y depositar el cordón de soldadura continuo con electrodo E6011 manteniendo el arco corto. Finalmente, retirar la escoria con el martillo picador usando gafas de protección, verificar la tolerancia geométrica con el calibrador pie de rey y registrar la labor en la bitácora técnica.',
  },
};

/* Andamiaje graduado.
 *
 * Dos niveles de ayuda, en orden creciente: primero frases de arranque
 * (el estudiante sigue escribiendo), y solo después el modelo completo.
 * Ninguno rellena el campo: copiar y pegar no enseña a redactar.
 */
function Scaffold({ starters, model, className = '' }) {
  const [level, setLevel] = useState(null);

  return (
    <div className={`card p-5 sm:p-6 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-mineral">
          <Lightbulb className="h-3.5 w-3.5 text-signal-red" aria-hidden="true" />
          Guía y modelos de apoyo
        </p>
        <span className="font-mono text-xs text-mineral">¿Te trabaste?</span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-mineral">
        Consulta disparadores de redacción o un modelo de referencia para desbloquear tu escritura sin copiar.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={level === 'starters'}
          onClick={() => setLevel(level === 'starters' ? null : 'starters')}
          className={`inline-flex min-h-[2.5rem] items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-colors ${
            level === 'starters'
              ? 'border-inst-blue bg-ok-bg text-inst-blue'
              : 'border-line bg-paper-card text-charcoal hover:border-mineral'
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
          Dame frases de arranque
        </button>

        <button
          type="button"
          aria-pressed={level === 'model'}
          onClick={() => setLevel(level === 'model' ? null : 'model')}
          className={`inline-flex min-h-[2.5rem] items-center gap-2 border px-3.5 py-2 text-xs font-semibold transition-colors ${
            level === 'model'
              ? 'border-inst-blue bg-ok-bg text-inst-blue'
              : 'border-line bg-paper-card text-charcoal hover:border-mineral'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          Muéstrame un ejemplo completo
        </button>
      </div>

      {level === 'starters' && (
        <ul className="mt-4 animate-settleIn space-y-2 border-t border-line pt-4">
          {starters.map((s) => (
            <li key={s} className="flex gap-2.5 font-serif text-sm italic text-charcoal">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal-red" />
              {s}
            </li>
          ))}
        </ul>
      )}

      {level === 'model' && (
        <div className="mt-4 animate-settleIn border-t border-line pt-4">
          <p className="max-w-reading font-serif text-sm italic leading-relaxed text-charcoal">
            {model}
          </p>
          <p className="mt-3 text-xs text-mineral">
            Es un ejemplo, no una plantilla. Escríbelo con tus palabras y con tu
            máquina: copiarlo tal cual no cuenta como redacción tuya.
          </p>
        </div>
      )}
    </div>
  );
}

/** Criterios visibles y en vivo: el estudiante ve qué le falta mientras escribe. */
function Criteria({ items }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {items.map(({ label, met }) => (
        <li
          key={label}
          className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-label uppercase tracking-label ${
            met ? 'border-inst-blue bg-ok-bg text-inst-blue' : 'border-line bg-paper-pure text-mineral'
          }`}
        >
          <span
            aria-hidden="true"
            className={`flex h-3.5 w-3.5 items-center justify-center border ${
              met ? 'border-inst-blue bg-inst-blue text-white' : 'border-mineral'
            }`}
          >
            {met && <Check className="h-2.5 w-2.5" />}
          </span>
          {label}
          <span className="sr-only">{met ? ' cumplido' : ' pendiente'}</span>
        </li>
      ))}
    </ul>
  );
}

export function SafetySheetBuilder() {
  const { specialty, progress, updateSafetySheet, toggleEpp } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { safetyEquipments, mainMachine } = specialtyData;

  const sheet = progress.safetySheet || {};
  const selectedEpp = sheet.selectedEpp || [];
  const paragraph1 = sheet.paragraph1 || '';
  const paragraph2 = sheet.paragraph2 || '';
  const verbalModeChosen = sheet.verbalModeChosen || 'infinitivo';

  const starters = STARTERS[specialty] || STARTERS.automotriz;
  const models = MODELS[specialty] || MODELS.automotriz;

  const requiredCount = safetyEquipments.filter((e) => e.required).length;
  const requiredPicked = safetyEquipments.filter((e) => e.required && selectedEpp.includes(e.id)).length;
  const trapsPicked = safetyEquipments.filter((e) => !e.required && selectedEpp.includes(e.id));

  const detected = countConnectors(paragraph2);
  const ready = paragraph1.trim().length >= 120 && paragraph2.trim().length >= 120 && detected.length >= 2;

  const [pasteAlert, setPasteAlert] = useState(false);

  const handlePaste = (e) => {
    e.preventDefault();
    setPasteAlert(true);
    setTimeout(() => setPasteAlert(false), 6000);
  };

  return (
    <SectionWrapper
      id="safety-sheet"
      step="05"
      monoTag="Taller de redacción guiada"
      title="Escribe tu Ficha de Operación Segura"
      subtitle="Todo lo anterior aterriza aquí: dos párrafos que se imprimen y se entregan."
      objective="Podrás redactar un procedimiento técnico completo: equipo de protección, inspección previa y secuencia operativa enlazada con conectores."
      duration="15 minutos"
      points="2 de los 10 puntos"
      tasks={[
        'Eliges el equipo de protección correcto del puesto.',
        'Redactas el párrafo de inspección previa.',
        'Redactas la secuencia operativa con conectores.',
      ]}
    >
      <Callout tone="aviso" title={`Tu equipo: ${mainMachine}`}>
        No hay botón de guardar: todo lo que escribas se guarda solo en este
        equipo, a medida que escribes.
      </Callout>

      {/* Guía general de la actividad */}
      <div className="card mt-6 border-l-4 border-l-inst-blue bg-ok-bg/30 p-5">
        <div className="mb-2 flex items-center gap-2 font-mono text-label uppercase tracking-label text-inst-blue font-bold">
          <Info className="h-4 w-4" aria-hidden="true" />
          ¿Cómo completar tu Ficha de Operación Segura (FOS-01)?
        </div>
        <p className="text-sm text-charcoal leading-relaxed">
          Esta es la evaluación práctica final. Vas a elaborar la ficha técnica oficial que normará el uso seguro de tu máquina (<strong>{mainMachine}</strong>). Para completarla con éxito, realiza estos 4 pasos en orden:
        </p>
        <ol className="mt-3 grid grid-cols-1 gap-2.5 text-xs text-charcoal sm:grid-cols-2 lg:grid-cols-4 font-sans">
          <li className="border border-line bg-paper-pure p-3">
            <span className="font-mono font-bold text-inst-blue block mb-1">Paso 1: EPP</span>
            Selecciona únicamente el equipo de protección obligatorio (cuidado con los prohibidos).
          </li>
          <li className="border border-line bg-paper-pure p-3">
            <span className="font-mono font-bold text-inst-blue block mb-1">Paso 2: Párrafo 1</span>
            Escribe qué EPP te colocas y qué condiciones de seguridad revisas en el puesto antes de encender.
          </li>
          <li className="border border-line bg-paper-pure p-3">
            <span className="font-mono font-bold text-inst-blue block mb-1">Paso 3: Modo verbal</span>
            Elige si redactarás en Infinitivo (cortar, fijar) o Imperativo (corte, fije).
          </li>
          <li className="border border-line bg-paper-pure p-3">
            <span className="font-mono font-bold text-inst-blue block mb-1">Paso 4: Párrafo 2</span>
            Describe la operación en 3 fases usando conectores o numerando pasos (1, 2, 3...), con al menos 2 conectores de orden.
          </li>
        </ol>
      </div>

      {/* --- Paso 1: EPP --- */}
      <section aria-labelledby="epp-title" className="mt-12">
        <StepHeading
          number="1"
          id="epp-title"
          title={<>Elige el <Termino term="epp">equipo de protección</Termino></>}
          hint="Ojo: en la lista hay equipos que NO deben usarse en este puesto. Elegirlos resta."
          trailing={
            <p className={`meta-pill ${requiredPicked === requiredCount ? 'meta-pill--done' : ''}`}>
              <HardHat className="h-3.5 w-3.5" aria-hidden="true" />
              {requiredPicked} de {requiredCount} obligatorios
            </p>
          }
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safetyEquipments.map((epp) => {
            const isSelected = selectedEpp.includes(epp.id);
            const isTrapPicked = isSelected && !epp.required;
            return (
              <li key={epp.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isSelected}
                  onClick={() => toggleEpp(epp.id)}
                  className={`flex h-full w-full flex-col justify-between border p-4 text-left transition-colors ${
                    isTrapPicked
                      ? 'border-danger bg-danger-bg'
                      : isSelected
                        ? 'border-inst-blue bg-ok-bg'
                        : 'border-line bg-paper-pure hover:border-mineral'
                  }`}
                >
                  <span className="mb-3 flex items-start justify-between gap-3">
                    <span className="font-sans text-base font-semibold text-deep-blue">
                      {epp.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center border ${
                        isTrapPicked
                          ? 'border-danger bg-danger text-white'
                          : isSelected
                            ? 'border-inst-blue bg-inst-blue text-white'
                            : 'border-line'
                      }`}
                    >
                      {isTrapPicked && <AlertTriangle className="h-3.5 w-3.5" />}
                      {isSelected && !isTrapPicked && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </span>
                  <span className={`block text-sm leading-relaxed ${epp.required ? 'text-mineral' : 'text-danger-ink'}`}>
                    {epp.reason}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {trapsPicked.length > 0 && (
          <div role="status" className="mt-5 animate-settleIn">
            <Callout tone="peligro" title="Cuidado con lo que marcaste">
              Seleccionaste {trapsPicked.length === 1 ? 'un equipo prohibido' : `${trapsPicked.length} equipos prohibidos`} en
              este puesto. Vuelve a leer la razón que aparece debajo de cada tarjeta roja.
            </Callout>
          </div>
        )}
      </section>

      {/* --- Paso 2: Párrafo 1 --- */}
      <section aria-labelledby="p1-title" className="mt-12">
        <StepHeading
          number="2"
          id="p1-title"
          title="Párrafo 1: inspección del área y EPP"
          hint="¿Qué te pones y qué revisas antes de encender la máquina?"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="card lg:col-span-7">
            {/* Caja de instrucciones específicas */}
            <div className="mb-4 border border-line bg-paper-pure p-4">
              <p className="mb-2 flex items-center gap-2 font-mono text-label font-bold uppercase tracking-label text-inst-blue">
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                Instrucciones exactas para redactar este párrafo:
              </p>
              <p className="mb-2 text-xs leading-relaxed text-charcoal">
                Redacta un texto continuo con tus propias palabras (mínimo 120 caracteres) respondiendo a estos 2 puntos clave:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 font-sans text-xs leading-relaxed text-charcoal">
                <li>
                  <strong className="text-deep-blue">Equipo de protección obligatorio:</strong> Menciona los EPP que seleccionaste en el Paso 1 (por ejemplo: {specialty === 'automotriz' ? 'overol de trabajo, botas punta de acero dieléctricas, gafas de policarbonato y guantes de nitrilo' : 'overol de trabajo, botas con puntera de acero, delantal de cuero, guantes y careta fotosensible'}).
                </li>
                <li>
                  <strong className="text-deep-blue">Inspección del entorno y la máquina:</strong> Explica qué verificas en el área antes de encender o maniobrar ({specialty === 'automotriz' ? 'ausencia de derrames de aceite en el suelo, estado de las zapatas de goma del elevador y cables sin fisuras' : 'piso libre de solventes inflamables, adecuada ventilación y cables del equipo sin fisuras ni empalmes expuestos'}).
                </li>
              </ol>
            </div>

            <label htmlFor="parrafo-1" className="mb-2 flex items-center gap-2 font-mono text-label uppercase tracking-label text-mineral">
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              Tu redacción (escribe directamente con el teclado)
            </label>
            <textarea
              id="parrafo-1"
              rows={6}
              value={paragraph1}
              onChange={(e) => updateSafetySheet({ paragraph1: e.target.value })}
              onPaste={handlePaste}
              onDrop={handlePaste}
              aria-describedby="p1-criterios p1-nota-pegar"
              placeholder="Ejemplo de inicio: Antes de operar la máquina, el técnico debe colocarse... Luego, se inspecciona el área verificando..."
              className="w-full border border-line bg-paper-card p-4 font-serif text-base leading-relaxed text-charcoal placeholder:text-mineral/70 focus:border-active-blue"
            />
            <p id="p1-nota-pegar" className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-danger-ink">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Pegado de texto desactivado: redacta directamente con el teclado para validar tu evaluación individual.
            </p>
            {pasteAlert && (
              <div
                role="alert"
                className="mt-2.5 flex items-start gap-2.5 border-2 border-danger bg-danger-bg p-3 font-sans text-xs text-danger-ink animate-settleIn"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <div className="flex-1">
                  <strong className="block font-bold">¡Acción bloqueada! El pegado de texto no está permitido</strong>
                  <span>Esta actividad evalúa tu redacción técnica individual. Escribe tu procedimiento directamente con el teclado.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasteAlert(false)}
                  className="px-1 font-bold text-danger hover:underline"
                  aria-label="Cerrar aviso"
                >
                  ✕
                </button>
              </div>
            )}
            <div id="p1-criterios" className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <Criteria
                items={[
                  { label: 'Tiene cuerpo (120+)', met: paragraph1.trim().length >= 120 },
                  { label: 'Nombra el EPP', met: paragraph1.trim().length >= 40 },
                ]}
              />
              <p className="font-mono text-xs tabular-nums text-mineral">
                {paragraph1.length} caracteres
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Scaffold starters={starters.p1} model={models.p1} />
          </div>
        </div>
      </section>

      {/* --- Paso 3: Modo verbal --- */}
      <section aria-labelledby="mode-title" className="mt-12">
        <StepHeading
          number="3"
          id="mode-title"
          title="Elige el modo verbal del procedimiento"
          hint="El que elijas aquí es el que tendrás que sostener en todo el párrafo 4."
        />

        <p className="mb-4 max-w-reading text-xs leading-relaxed text-charcoal">
          <strong>¿Por qué debes elegirlo?</strong> La redacción técnica industrial exige uniformidad gramatical estricta. Si seleccionas <strong>Infinitivo</strong>, todas las acciones de tu procedimiento deben terminar en <em>-ar, -er, -ir</em> (ej. centrar, ajustar, verificar). Si seleccionas <strong>Imperativo</strong>, formularás órdenes directas al operario (ej. centre, ajuste, verifique). <strong>No mezcles ambos modos</strong> dentro de tu procedimiento.
        </p>

        <div role="radiogroup" aria-labelledby="mode-title" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { id: 'infinitivo', Icon: BookMarked, label: 'Infinitivo', example: 'Centrar, calibrar, accionar' },
            { id: 'imperativo', Icon: Megaphone, label: 'Imperativo', example: 'Centre, calibre, accione' },
          ].map(({ id, Icon, label, example }) => {
            const isActive = verbalModeChosen === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => updateSafetySheet({ verbalModeChosen: id })}
                className="card-pick flex-row items-center gap-4"
              >
                <span className={isActive ? 'icon-chip border-inst-blue bg-inst-blue text-white' : 'icon-chip'}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-sans text-base font-bold text-deep-blue">{label}</span>
                  <span className="block font-mono text-sm text-mineral">{example}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- Paso 4: Párrafo 2 --- */}
      <section aria-labelledby="p2-title" className="mt-12">
        <StepHeading
          number="4"
          id="p2-title"
          title="Párrafo 2: secuencia operativa y cierre seguro"
          hint="Enlaza los pasos con conectores: inicialmente… posteriormente… finalmente."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          <div className="card lg:col-span-7">
            {/* Recordatorio de modo verbal activo */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <span className="font-mono text-xs uppercase tracking-label text-mineral">Modo verbal elegido en Paso 3:</span>
              <span className="inline-flex items-center gap-1.5 border border-inst-blue bg-ok-bg px-2.5 py-1 font-mono text-xs font-bold text-inst-blue">
                {verbalModeChosen === 'infinitivo' ? 'INFINITIVO (verbos en -ar, -er, -ir)' : 'IMPERATIVO (órdenes directas al operario)'}
              </span>
            </div>

            {/* Caja de instrucciones específicas */}
            <div className="mb-4 border border-line bg-paper-pure p-4">
              <p className="mb-2 flex items-center gap-2 font-mono text-label font-bold uppercase tracking-label text-inst-blue">
                <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                Instrucciones exactas para la secuencia operativa:
              </p>
              <p className="mb-2 text-xs leading-relaxed text-charcoal">
                Describe paso a paso la operación de tu máquina (<strong>{mainMachine}</strong>) estructurada en 3 momentos claros y enlazada con <strong>al menos 2 conectores cronológicos</strong>:
              </p>
              <div className="space-y-2 font-sans text-xs leading-relaxed text-charcoal">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 font-mono font-bold text-inst-blue">1. Fase de Inicio:</span>
                  <span>
                    Comienza con un conector inicial (ej. <em>«Inicialmente»</em> o <em>«En primer lugar»</em>) y explica la preparación ({specialty === 'automotriz' ? 'centrar el vehículo entre las columnas del elevador y ubicar las zapatas en los puntos de apoyo del chasis' : 'interpretar las cotas del plano técnico, cortar los perfiles de acero y fijar las piezas con prensas de banco'}).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 font-mono font-bold text-inst-blue">2. Maniobra Central:</span>
                  <span>
                    Continúa con un conector de proceso (ej. <em>«Posteriormente»</em> o <em>«A continuación»</em>) y detalla la acción técnica principal ({specialty === 'automotriz' ? 'accionar el pulsador de ascenso de forma continua hasta la altura de trabajo y asentar sobre las trabas mecánicas de seguridad' : 'graduar la máquina a los parámetros requeridos y depositar el cordón de soldadura continuo manteniendo el arco corto'}).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="shrink-0 font-mono font-bold text-inst-blue">3. Cierre Seguro:</span>
                  <span>
                    Finaliza con un conector de cierre (ej. <em>«Finalmente»</em> o <em>«Por último»</em>) y describe la comprobación, limpieza del puesto ({specialty === 'automotriz' ? 'verificar la estabilidad lateral del automotor y registrar la tarea en la bitácora técnica' : 'retirar la escoria o virutas con protección ocular, verificar la tolerancia geométrica con el calibrador y asentar la tarea en la bitácora técnica'}).
                  </span>
                </div>
              </div>

              {/* Nota pedagógica sobre numeración (1, 2, 3...) vs conectores */}
              <div className="mt-3 border-t border-line/60 pt-2.5">
                <p className="font-mono text-xs font-bold uppercase tracking-label text-deep-blue flex items-center gap-1.5">
                  <ListOrdered className="h-3.5 w-3.5 text-inst-blue shrink-0" aria-hidden="true" />
                  ¿Conectores o numeración (1, 2, 3...)?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal">
                  En los textos instructivos de taller, el orden se puede señalar tanto con <strong>numeración directa (1, 2, 3...)</strong> como mediante <strong>conectores cronológicos (Inicialmente... Posteriormente... Finalmente...)</strong> en párrafo continuo. Ambos métodos son válidos en la industria. En esta actividad puedes redactar en bloque o numerar tus oraciones (ej. <em>«1. Inicialmente, fijar... 2. Posteriormente, accionar... 3. Finalmente, desconectar...»</em>), asegurándote de incorporar al menos 2 conectores de orden.
                </p>
              </div>

              <p className="mt-2.5 border-t border-line/60 pt-2 font-mono text-[11px] text-inst-blue">
                ★ <strong>Regla de oro:</strong> Recuerda mantener de inicio a fin el modo <strong>{verbalModeChosen.toUpperCase()}</strong> ({verbalModeChosen === 'infinitivo' ? 'centrar, cortar, accionar, verificar' : 'centre, corte, accione, verifique'}).
              </p>
            </div>

            <label htmlFor="parrafo-2" className="mb-2 flex items-center gap-2 font-mono text-label uppercase tracking-label text-mineral">
              <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
              Tu redacción (escribe directamente con el teclado)
            </label>
            <textarea
              id="parrafo-2"
              rows={7}
              value={paragraph2}
              onChange={(e) => updateSafetySheet({ paragraph2: e.target.value })}
              onPaste={handlePaste}
              onDrop={handlePaste}
              aria-describedby="p2-criterios conectores-detectados p2-nota-pegar"
              placeholder="Ejemplo: Inicialmente, fijar la pieza... Posteriormente, accionar la máquina... Finalmente, limpiar y registrar... (También puedes numerar: 1. Inicialmente... 2. Posteriormente... 3. Finalmente...)"
              className="w-full border border-line bg-paper-card p-4 font-serif text-base leading-relaxed text-charcoal placeholder:text-mineral/70 focus:border-active-blue"
            />
            <p id="p2-nota-pegar" className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-danger-ink">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Pegado de texto desactivado: redacta directamente con el teclado para validar tu evaluación individual.
            </p>
            {pasteAlert && (
              <div
                role="alert"
                className="mt-2.5 flex items-start gap-2.5 border-2 border-danger bg-danger-bg p-3 font-sans text-xs text-danger-ink animate-settleIn"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <div className="flex-1">
                  <strong className="block font-bold">¡Acción bloqueada! El pegado de texto no está permitido</strong>
                  <span>Esta actividad evalúa tu redacción técnica individual. Escribe tu procedimiento directamente con el teclado.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasteAlert(false)}
                  className="px-1 font-bold text-danger hover:underline"
                  aria-label="Cerrar aviso"
                >
                  ✕
                </button>
              </div>
            )}
            <div id="p2-criterios" className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <Criteria
                items={[
                  { label: 'Tiene cuerpo (120+)', met: paragraph2.trim().length >= 120 },
                  { label: '2 conectores distintos', met: detected.length >= 2 },
                ]}
              />
              <p className="font-mono text-xs tabular-nums text-mineral">
                {paragraph2.length} caracteres
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div id="conectores-detectados" className="card p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 font-mono text-label uppercase tracking-label text-mineral">
                  <span className="h-2 w-2 rounded-full bg-inst-blue" aria-hidden="true" />
                  Conectores en tu redacción
                </p>
                <span className="font-mono text-xs font-bold text-inst-blue">
                  {detected.length} en uso
                </span>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {CONNECTOR_LIST.map((c) => {
                  const found = detected.includes(c);
                  return (
                    <li
                      key={c}
                      className={`px-2 py-0.5 font-mono text-xs transition-colors ${
                        found
                          ? 'bg-inst-blue font-bold text-white shadow-xs'
                          : 'border border-line bg-paper-card text-mineral/70'
                      }`}
                    >
                      {c}
                    </li>
                  );
                })}
              </ul>
            </div>

            <Scaffold starters={starters.p2} model={models.p2} />
          </div>
        </div>
      </section>

      {/* --- Estado de la ficha --- */}
      <div className="mt-12">
        {ready ? (
          <Callout tone="logro" title="Tu ficha está lista">
            Ya puedes verla e imprimirla en el módulo 06. Todo quedó guardado en
            este equipo.
          </Callout>
        ) : (
          <Callout tone="aviso" title="Sigue redactando">
            Cuando los dos párrafos tengan cuerpo y el segundo enlace al menos dos
            conectores, la ficha queda completa. Las etiquetas de arriba te dicen
            qué falta.
          </Callout>
        )}
      </div>

      <KeyIdea>
        Una ficha de operación segura no es una <Termino term="bitácora">bitácora</Termino> de
        lo que hiciste: es{' '}
        <strong>un conjunto de órdenes que otra persona podría seguir</strong> sin
        que tú estés al lado para aclarar nada.
      </KeyIdea>

      {/* Notificación flotante de bloqueo de pegado */}
      {pasteAlert && typeof document !== 'undefined' && createPortal(
        <aside
          role="alert"
          aria-live="assertive"
          className="fixed bottom-20 right-5 z-[70] flex max-w-md items-start gap-3 border-2 border-danger bg-paper-pure p-4 shadow-2xl animate-settleIn"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-danger text-white">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="font-sans text-sm font-bold text-danger-ink">
              Acción no permitida: Pegado de texto desactivado
            </p>
            <p className="text-xs leading-relaxed text-charcoal">
              Esta actividad evalúa tu propia redacción técnica. Debes redactar el procedimiento directamente con el teclado.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPasteAlert(false)}
            aria-label="Cerrar aviso"
            className="ml-2 text-mineral hover:text-charcoal text-xs font-mono font-bold"
          >
            ✕
          </button>
        </aside>,
        document.body
      )}
    </SectionWrapper>
  );
}
