import React from 'react';
import { useStudent } from '../context/StudentContext';
import { SPECIALTIES_DATA } from '../data/curriculumData';
import { SectionWrapper } from './SectionWrapper';
import { KeyIdea, StepHeading } from './Didactics';
import { Termino, GlosarioHint } from './Glosario';
import { Siren, Stethoscope, HardHat, MapPin, CheckCircle2, HelpCircle } from 'lucide-react';

/* Activación de conocimientos previos.
 *
 * Antes de mostrar la teoría, el estudiante apuesta. Predecir y luego
 * confrontar la predicción fija el aprendizaje mucho mejor que leer el
 * caso ya explicado. Ninguna opción "pierde": las tres reciben respuesta.
 */
const GUESSES = [
  {
    key: 'pregunto',
    label: 'El técnico preguntó antes de tocar nada.',
    reply: 'Preguntar sería una buena decisión. El problema del ejemplo es que la orden no da un criterio verificable; quien la lea podría interpretarla de otra manera.',
  },
  {
    key: 'distinto',
    label: 'Cada técnico entendió una altura distinta.',
    reply: 'Exacto. «Una altura buena» significa una cosa para quien lleva veinte años y otra para quien lleva dos semanas. La orden no está mal escrita por fea: está mal escrita porque admite dos lecturas.',
  },
  {
    key: 'nada',
    label: 'Nada, se entiende igual.',
    reply: 'Parece clara hasta que dos personas interpretan «altura buena» de manera distinta. Lee el caso simulado y localiza el dato que falta.',
  },
];

function Activacion() {
  const { progress, answerIntro } = useStudent();
  const guess = progress.introAnswered;
  const guessData = GUESSES.find((g) => g.key === guess);

  return (
    <div className="card-quiet mb-14">
      <StepHeading
        number="?"
        title="Antes de empezar: arriesga una respuesta"
        hint="No hay penalización. Solo quiero saber qué piensas ahora."
        id="intro-activacion"
      />

      <blockquote className="mb-6 max-w-reading border-l-2 border-line bg-paper-pure p-5 font-serif text-lg italic leading-relaxed text-charcoal">
        «Suba el carro hasta una altura buena y acomode los brazos por donde quepa.»
      </blockquote>

      <fieldset disabled={!!guess}>
        <legend className="mb-3 font-sans text-base font-semibold text-deep-blue">
          En este caso simulado, ¿qué podría pasar con esta orden?
        </legend>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {GUESSES.map(({ key, label }) => {
            const isPicked = guess === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={isPicked}
                onClick={() => answerIntro(key)}
                className={`flex min-h-[3.5rem] items-center border px-4 py-3 text-left font-sans text-base transition-colors disabled:cursor-not-allowed ${
                  isPicked
                    ? 'border-inst-blue bg-ok-bg font-semibold text-inst-blue'
                    : 'border-line bg-paper-pure text-charcoal hover:border-mineral disabled:opacity-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {guessData && (
        <div role="status" className="mt-5 animate-settleIn border-t-2 border-inst-blue bg-paper-pure p-5">
          <p className="mb-2 flex items-center gap-2 font-sans text-base font-bold text-inst-blue">
            <Stethoscope className="h-5 w-5" aria-hidden="true" />
            Respuesta del instructor
          </p>
          <p className="max-w-reading text-base leading-relaxed text-charcoal">{guessData.reply}</p>
        </div>
      )}
    </div>
  );
}

function CaseAnalysis({ question }) {
  const { progress, answerCaseAnalysis } = useStudent();
  const picked = progress.caseAnalysisAnswer;
  const pickedOption = question?.options?.find((o) => o.key === picked);

  if (!question) return null;

  return (
    <div className="card border-t-2 border-t-inst-blue p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 font-mono text-label uppercase tracking-label font-bold text-inst-blue">
          <span className="flex h-5 w-5 items-center justify-center border border-inst-blue bg-inst-blue text-white font-mono text-xs">
            !
          </span>
          Pregunta de análisis
        </p>
        <span className="font-mono text-xs text-mineral">Diagnóstico técnico</span>
      </div>

      <h4 className="font-sans text-base sm:text-lg font-bold text-deep-blue mb-1">
        ¿Qué falló en la orden?
      </h4>
      <p className="text-xs text-mineral mb-4">
        Aplica las funciones del lenguaje (apelativa y referencial) que estudiaste en la teoría.
      </p>

      <div className="mb-4 border-l-2 border-inst-blue bg-paper-card p-3.5 font-serif text-sm sm:text-base leading-relaxed text-charcoal">
        {question.prompt}
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {question.options.map((opt) => {
          const isSelected = picked === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => answerCaseAnalysis(opt.key)}
              className={`flex min-h-[3.25rem] items-start gap-3 border p-3.5 text-left font-sans text-xs sm:text-sm leading-relaxed transition-all ${
                isSelected
                  ? opt.isCorrect
                    ? 'border-inst-blue bg-ok-bg font-semibold text-inst-blue'
                    : 'border-danger-border bg-danger-bg text-charcoal'
                  : 'border-line bg-paper-pure hover:border-mineral text-charcoal'
              }`}
            >
              <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border font-mono text-[0.65rem] ${
                isSelected
                  ? opt.isCorrect ? 'border-inst-blue bg-inst-blue text-white' : 'border-danger-border bg-danger-border text-white'
                  : 'border-line bg-paper-card text-mineral'
              }`}>
                {isSelected ? (opt.isCorrect ? '✓' : '✗') : ''}
              </span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {pickedOption && (
        <div
          role="status"
          className={`mt-4 animate-settleIn border-t-2 p-4 ${
            pickedOption.isCorrect ? 'border-inst-blue bg-ok-bg' : 'border-danger-border bg-danger-bg'
          }`}
        >
          <p className={`mb-1.5 flex items-center gap-2 font-sans text-xs sm:text-sm font-bold ${
            pickedOption.isCorrect ? 'text-inst-blue' : 'text-danger-ink'
          }`}>
            {pickedOption.isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Análisis técnico acertado
              </>
            ) : (
              <>
                <HelpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Observación del instructor
              </>
            )}
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-charcoal">
            {pickedOption.feedback}
          </p>
        </div>
      )}
    </div>
  );
}

export function IntroSection() {
  const { specialty } = useStudent();
  const specialtyData = SPECIALTIES_DATA[specialty] || SPECIALTIES_DATA.automotriz;
  const { accidentCase, scenario } = specialtyData;

  return (
    <SectionWrapper
      id="intro"
      step="01"
      monoTag="Marco operativo y seguridad industrial"
      title="Por qué una instrucción mal escrita hace daño"
      subtitle="Tu reto es escribir instrucciones que otra persona pueda seguir sin adivinar. Comienza por detectar lo que falta en una orden ambigua."
      objective="Podrás explicar con un caso simulado por qué una orden técnica ambigua supone un riesgo, y reconocer las funciones del lenguaje que usa un manual."
      duration="8 minutos"
      points="Sin puntaje"
      practiceTag="Caso simulado"
      practiceTitle="Analiza una orden ambigua"
      tasks={[
        'Predices qué pasó con una orden ambigua.',
        'Estudias qué es un texto instructivo y para qué existe.',
        'Analizas un escenario simulado y respondes la pregunta de interpretación.',
      ]}
      activacion={
        <>
          <GlosarioHint />
          <Activacion />
        </>
      }
    >
      {/* Práctica en Workbench de 2 columnas: Informe a la izquierda | Diagnóstico a la derecha */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Columna Izquierda: Informe de contingencia y regla técnica */}
        <article className="card border-t-2 border-t-danger lg:col-span-7 p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <span className="icon-chip icon-chip--danger">
              <Siren className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="mono-label mono-label--plain text-danger-ink">
                Escenario simulado · {specialtyData.shortName}
              </p>
              <h3 className="mt-1 font-sans text-lg sm:text-xl font-bold leading-snug text-deep-blue">
                {accidentCase.headline}
              </h3>
            </div>
          </div>

          <dl className="divide-y divide-line border-y border-line my-4">
            <div className="py-3.5">
              <dt className="mono-label mono-label--plain mb-1 text-danger-ink">
                Causa lingüística
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-charcoal">
                {accidentCase.cause}
              </dd>
            </div>
            <div className="py-3.5">
              <dt className="mono-label mono-label--plain mb-1">
                Consecuencia en el taller
              </dt>
              <dd className="text-sm sm:text-base leading-relaxed text-charcoal">
                {accidentCase.consequence}
              </dd>
            </div>
          </dl>

          <p className="flex items-center gap-2 text-xs text-mineral mb-5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span><strong className="text-charcoal">Puesto:</strong> {scenario}</span>
          </p>

          {/* Lección técnica integrada al pie del informe */}
          <div className="border-t border-line pt-4">
            <div className="border border-line bg-paper-card p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <HardHat className="h-4 w-4 text-inst-blue shrink-0" aria-hidden="true" />
                <p className="font-sans text-xs sm:text-sm font-bold text-deep-blue">
                  La regla de la precisión absoluta
                </p>
              </div>
              <p className="font-serif text-xs sm:text-sm italic leading-relaxed text-charcoal mb-3">
                {accidentCase.lesson}
              </p>
              <div className="border-t border-line/60 pt-2.5">
                <p className="mono-label mono-label--plain text-[0.65rem] uppercase tracking-wider text-mineral mb-1.5">
                  Toda orden técnica debe llevar:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-charcoal">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-deep-blue font-mono text-[0.65rem] font-bold text-deep-blue">1</span>
                    Acción unívoca
                  </span>
                  <span className="flex items-center gap-1.5 text-charcoal">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-deep-blue font-mono text-[0.65rem] font-bold text-deep-blue">2</span>
                    Componente exacto
                  </span>
                  <span className="flex items-center gap-1.5 text-charcoal">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-deep-blue font-mono text-[0.65rem] font-bold text-deep-blue">3</span>
                    Condición previa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Columna Derecha: Pregunta de análisis interactiva */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <CaseAnalysis question={accidentCase.question} />
        </div>
      </div>

      <KeyIdea>
        Un texto instructivo no se juzga por bonito, sino por <strong>cuántas
        lecturas admite</strong>. A eso se le llama <Termino term="ambigüedad">ambigüedad</Termino>.
        Si admite dos, hay que precisar la acción, el componente o la condición
        antes de ponerla en práctica.
      </KeyIdea>
    </SectionWrapper>
  );
}
