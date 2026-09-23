import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { TabBar } from './TabBar';
import { KeyIdea, Callout, StepHeading } from './Didactics';
import {
  Check, X, Lock, Split, Ban, FileWarning, ThumbsDown, ShieldCheck, Gauge,
} from 'lucide-react';
import { Termino } from './Glosario';

const VICES = [
  {
    Icon: Split,
    term: 'Ambigüedad',
    text: 'La orden admite dos lecturas. El operario duda o resuelve con su propio criterio.',
    accent: 'border-t-danger',
    tone: 'danger',
  },
  {
    Icon: Ban,
    term: 'Contradicción',
    text: 'Dos mandatos se anulan entre sí: intervenir una máquina sin cortarle la energía.',
    accent: 'border-t-inst-blue',
  },
  {
    Icon: FileWarning,
    term: 'Vacío de información',
    text: 'Falta un paso crítico previo: EPP, inspección, anclaje o parada de emergencia.',
    accent: 'border-t-active-blue',
  },
];

/* Estado de una respuesta. Se comunica con etiqueta + icono + peso, nunca
 * solo con color: el rojo está reservado al peligro físico. */
function AnswerFlag({ isCorrect, attempts }) {
  if (isCorrect) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-ok-bg px-2.5 py-1 font-mono text-label uppercase tracking-label text-inst-blue">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Correcto{attempts > 1 ? ` · intento ${attempts}` : ''}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-review-bg px-2.5 py-1 font-mono text-label uppercase tracking-label text-charcoal">
      <X className="h-3.5 w-3.5" aria-hidden="true" />
      Vuelve a intentarlo
    </span>
  );
}

export function ForensicLab() {
  const { specialty, progress, submitForensicAnswer, submitAntiComodin } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { forensicComparison, flawsCases, antiComodin } = specialtyData;

  const [activeTab, setActiveTab] = useState('comparativa');

  const forensicAnswers = progress.forensicAnswers || {};
  const antiComodinAnswers = progress.antiComodinAnswers || {};

  const solvedFlaws = Object.values(forensicAnswers).filter((a) => a.isCorrect).length;
  const solvedTerms = Object.values(antiComodinAnswers).filter((a) => a.isCorrect).length;
  const standardization = Math.round((solvedTerms / antiComodin.length) * 100);

  return (
    <SectionWrapper
      id="forensic"
      step="02"
      monoTag="Análisis forense y precisión lingüística"
      title="Caza los vicios que se cuelan en un protocolo"
      subtitle="Compara una instrucción imprecisa con un modelo de redacción más claro. Después, encuentra los errores por tu cuenta."
      objective="Podrás identificar ambigüedades, contradicciones y datos omitidos, y reemplazar palabras vagas por nombres precisos."
      duration="12 minutos"
      points="4 de los 10 puntos"
      tasks={[
        'Comparas un aviso informal con un modelo didáctico de redacción.',
        `Diagnosticas ${flawsCases.length} instrucciones defectuosas.`,
        `Normalizas ${antiComodin.length} expresiones de taller.`,
      ]}
    >
      <TabBar
        label="Actividades del módulo 02"
        value={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'comparativa', label: 'Ver la diferencia' },
          { id: 'vicios', label: 'Caza de vicios', badge: `${solvedFlaws}/${flawsCases.length}` },
          { id: 'anticomodines', label: 'Filtro anti-comodín', badge: `${solvedTerms}/${antiComodin.length}` },
        ]}
      />

      {/* ---------- 1. Ejemplo contrastado ---------- */}
      {activeTab === 'comparativa' && (
        <div id="panel-comparativa" role="tabpanel" aria-labelledby="tab-comparativa" className="animate-settleIn">
          <Callout tone="aviso" title="Lee los dos y busca la diferencia">
            Es el mismo procedimiento escrito dos veces. Uno se pegó en la pared por
            costumbre; el otro se reescribió para ser más claro. Fíjate en qué desaparece cuando se
            elimina la suposición.
          </Callout>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="card border-t-2 border-t-danger">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="icon-chip icon-chip--danger">
                  <ThumbsDown className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="px-2.5 py-1 font-mono text-label uppercase tracking-label text-danger-ink">
                  {forensicComparison.versionA.badge}
                </span>
              </div>

              <h3 className="font-sans text-lg font-bold text-deep-blue">
                {forensicComparison.versionA.title}
              </h3>

              <blockquote className="mt-4 border-l-2 border-line bg-paper-card p-4 font-serif text-base italic leading-relaxed text-charcoal">
                {forensicComparison.versionA.text}
              </blockquote>

              <div className="mt-5 border-t border-line pt-4">
                <p className="mono-label mono-label--plain mb-2 text-danger-ink">Qué falla</p>
                <ul className="space-y-1.5 text-sm leading-relaxed text-charcoal">
                  <li>Expresiones vagas: «más o menos», «una altura buena».</li>
                  <li>Términos comodín: «aparato», «las cosas».</li>
                  <li>Instrucciones que contradicen la norma de seguridad.</li>
                </ul>
              </div>
            </article>

            <article className="card border-t-2 border-t-inst-blue">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="icon-chip">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="px-2.5 py-1 font-mono text-label uppercase tracking-label text-inst-blue">
                  {forensicComparison.versionB.badge}
                </span>
              </div>

              <h3 className="font-sans text-lg font-bold text-deep-blue">
                {forensicComparison.versionB.title}
              </h3>

              <ol className="mt-4 divide-y divide-line border-y border-line">
                {forensicComparison.versionB.steps.map((step, idx) => (
                  <li key={step.phase} className="flex gap-3 py-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center border border-inst-blue font-mono text-label text-inst-blue"
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="mono-label mono-label--plain mb-1">{step.phase}</p>
                      <p className="text-base leading-relaxed text-charcoal">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      )}

      {/* ---------- 2. Los tres vicios ---------- */}
      {activeTab === 'vicios' && (
        <div id="panel-vicios" role="tabpanel" aria-labelledby="tab-vicios" className="animate-settleIn">
          {/* Recordatorio compacto. La explicación de cada vicio está
              arriba, en la teoría, y a un toque en «Repasar la teoría». */}
          <ul className="mb-10 flex flex-wrap gap-2">
            {VICES.map(({ Icon, term }) => (
              <li
                key={term}
                className="inline-flex items-center gap-2 border border-line bg-paper-card px-3 py-2 text-sm font-medium text-charcoal"
              >
                <Icon className="h-4 w-4 shrink-0 text-inst-blue" aria-hidden="true" />
                <Termino term={term}>{term}</Termino>
              </li>
            ))}
          </ul>

          <StepHeading
            number="1"
            title="Diagnostica cada instrucción"
            hint="Puedes reintentar: el primer acierto vale más."
            trailing={<p className="meta-pill">{solvedFlaws} de {flawsCases.length} resueltos</p>}
          />

          <ol className="space-y-5">
            {flawsCases.map((c, idx) => {
              const answer = forensicAnswers[c.id];
              const isAnswered = answer !== undefined;
              const isLocked = answer?.isCorrect === true;

              return (
                <li key={c.id} className={`card ${isLocked ? 'border-inst-blue' : ''}`}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center border font-mono text-sm font-bold ${
                          isLocked ? 'border-inst-blue bg-inst-blue text-white' : 'border-line text-mineral'
                        }`}
                      >
                        {isLocked ? <Check className="h-4 w-4" /> : idx + 1}
                      </span>
                      <span className="mono-label mono-label--plain">
                        Caso {idx + 1} de {flawsCases.length}
                      </span>
                    </span>
                    {isAnswered && <AnswerFlag isCorrect={answer.isCorrect} attempts={answer.attempts} />}
                  </div>

                  <blockquote className="max-w-reading border-l-2 border-line bg-paper-card p-4 font-serif text-lg italic leading-relaxed text-charcoal">
                    {c.phrase}
                  </blockquote>

                  <fieldset className="mt-5" disabled={isLocked}>
                    <legend className="mb-3 font-sans text-base font-semibold text-deep-blue">
                      ¿Qué vicio tiene esta instrucción?
                    </legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {c.options.map((opt) => {
                        const isPicked = answer?.answer === opt;
                        const showAsCorrect = isPicked && answer.isCorrect;
                        const showAsWrong = isPicked && !answer.isCorrect;
                        return (
                          <button
                            key={opt}
                            type="button"
                            aria-pressed={isPicked}
                            onClick={() => submitForensicAnswer(c.id, opt, opt === c.correct)}
                            className={`flex min-h-[3.25rem] items-center justify-between gap-2 border px-4 py-3 text-left font-sans text-base transition-colors disabled:cursor-not-allowed ${
                              showAsCorrect
                                ? 'border-inst-blue bg-ok-bg font-bold text-inst-blue'
                                : showAsWrong
                                  ? 'border-review-border bg-review-bg font-semibold text-charcoal'
                                  : 'border-line bg-paper-card text-charcoal hover:border-mineral disabled:opacity-50'
                            }`}
                          >
                            <span>{opt}</span>
                            {showAsCorrect && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                            {showAsWrong && <X className="h-4 w-4 shrink-0 text-mineral" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {isAnswered && (
                    <div
                      role="status"
                      className={`mt-5 max-w-reading animate-settleIn border-l-2 bg-paper-card p-4 ${
                        answer.isCorrect ? 'border-inst-blue' : 'border-charcoal'
                      }`}
                    >
                      <p className="mono-label mono-label--plain mb-1.5">
                        {answer.isCorrect ? 'Explicación del instructor' : 'Pista del instructor'}
                      </p>
                      <p className="text-base leading-relaxed text-charcoal">
                        {answer.isCorrect ? c.feedbackCorrecto : c.feedbackIncorrecto}
                      </p>
                    </div>
                  )}

                  {isLocked && (
                    <p className="mt-4 inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-label text-mineral">
                      <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      Respuesta registrada
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* ---------- 3. Filtro anti-comodín ---------- */}
      {activeTab === 'anticomodines' && (
        <div id="panel-anticomodines" role="tabpanel" aria-labelledby="tab-anticomodines" className="animate-settleIn">
          <div className="card-quiet mb-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="icon-chip">
                  <Gauge className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="max-w-reading">
                  <h3 className="font-sans text-lg font-bold text-deep-blue">
                    Cuánto de tu léxico ya es normado
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-mineral">
                    «La vaina» y «el fierro» son{' '}
                    <Termino term="palabra comodín">palabras comodín</Termino>: se entienden
                    entre compañeros y se pierden en un manual. Cambia cada expresión por el
                    término que nombra la pieza y su función.
                  </p>
                </div>
              </div>
              <p className="font-mono text-3xl font-bold tabular-nums text-deep-blue">
                {standardization}<span className="text-lg text-mineral">%</span>
              </p>
            </div>

            <div
              role="progressbar"
              aria-valuenow={standardization}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Léxico normado"
              className="mt-5 h-2.5 w-full border border-line bg-paper-pure"
            >
              <div
                className="h-full bg-inst-blue transition-[width] duration-500 ease-out"
                style={{ width: `${standardization}%` }}
              />
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {antiComodin.map((item) => {
              const answer = antiComodinAnswers[item.id];
              const isAnswered = answer !== undefined;
              const isLocked = answer?.isCorrect === true;

              return (
                <li key={item.id} className={`card ${isLocked ? 'border-inst-blue' : ''}`}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-sm text-mineral line-through decoration-signal-red decoration-2">
                      «{item.vague}»
                    </p>
                    {isAnswered && <AnswerFlag isCorrect={answer.isCorrect} attempts={answer.attempts} />}
                  </div>

                  <fieldset disabled={isLocked}>
                    <legend className="mb-3 font-sans text-base font-semibold text-deep-blue">
                      Sustitúyelo por el término técnico
                    </legend>
                    <div className="space-y-2">
                      {item.options.map((option) => {
                        const isPicked = answer?.answer === option;
                        const showAsCorrect = isPicked && answer.isCorrect;
                        const showAsWrong = isPicked && !answer.isCorrect;
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={isPicked}
                            onClick={() => submitAntiComodin(item.id, option, option === item.correct)}
                            className={`flex min-h-[3.25rem] w-full items-center justify-between gap-2 border px-4 py-3 text-left font-sans text-base transition-colors disabled:cursor-not-allowed ${
                              showAsCorrect
                                ? 'border-inst-blue bg-ok-bg font-bold text-inst-blue'
                                : showAsWrong
                                  ? 'border-review-border bg-review-bg font-semibold text-charcoal'
                                  : 'border-line bg-paper-card text-charcoal hover:border-mineral disabled:opacity-50'
                            }`}
                          >
                            <span>{option}</span>
                            {showAsCorrect && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                            {showAsWrong && <X className="h-4 w-4 shrink-0 text-mineral" aria-hidden="true" />}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {isAnswered && !answer.isCorrect && (
                    <p role="status" className="mt-4 animate-settleIn border-l-2 border-charcoal bg-paper-card p-4 text-base leading-relaxed text-charcoal">
                      «{answer.answer}» describe la pieza por su aspecto o su tamaño, no
                      por su función. Busca la opción que un proveedor entendería sin verla.
                    </p>
                  )}

                  {isLocked && (
                    <p className="mt-4 border-l-2 border-inst-blue bg-ok-bg p-4 text-base leading-relaxed text-charcoal">
                      <strong className="text-inst-blue">{item.correct}:</strong> {item.context}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <KeyIdea>
        Los tres vicios se detectan con la misma pregunta: <strong>¿esto se puede
        entender de otra manera?</strong> Si la respuesta es sí, todavía no está
        listo para colgarse en la pared del taller.
      </KeyIdea>
    </SectionWrapper>
  );
}
