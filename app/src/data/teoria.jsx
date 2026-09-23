import React from 'react';
import { Termino } from '../components/Glosario';

/* Teoría del taller.
 *
 * Contenido tomado del documento de teoría del docente (Temas 1 y 2,
 * semanas 2 y 3), respetando sus definiciones, ejemplos y tablas.
 *
 * Cada módulo expone:
 *   intro    — el porqué, en una frase.
 *   bloques  — el desarrollo. Tipos: 'concepto' | 'lista' | 'tabla' | 'formula'.
 *   resumen  — 3 a 5 puntos para consultar DURANTE la práctica, sin
 *              volver a leer todo. Es lo que aparece en el panel de repaso.
 *   dcd      — referencia curricular, para el docente.
 */

export const TEORIA = {
  intro: {
    titulo: 'Qué es un texto instructivo-técnico',
    dcd: 'Ref. LL.5.3.1',
    intro: 'Antes de detectar errores hay que saber qué se espera de este tipo de texto y para qué existe.',
    bloques: [
      {
        tipo: 'concepto',
        titulo: 'Definición y propósito operativo',
        texto: 'Un texto instructivo o técnico orienta las acciones del lector paso a paso para realizar una tarea mecánica, eléctrica o de montaje sin márgenes de error. No busca entretener ni convencer: busca que la maniobra se ejecute igual la haga quien la haga.',
      },
      {
        tipo: 'lista',
        titulo: 'Las dos funciones del lenguaje que lo sostienen',
        items: [
          {
            term: 'Función apelativa',
            def: 'Es la predominante. Dirige la conducta del operador: le dice qué hacer, en qué orden y bajo qué condición.',
            ejemplo: 'Desconecte el borne negativo antes de intervenir el alternador.',
          },
          {
            term: 'Función referencial',
            def: 'Comunica hechos, magnitudes y procedimientos de forma objetiva, sin valoraciones personales.',
            ejemplo: 'Aplique un par de apriete de 90 lb-pie en secuencia cruzada.',
          },
        ],
      },
    ],
    resumen: [
      'Orienta paso a paso una tarea técnica, sin margen de error.',
      'Función apelativa: dirige la conducta del operador.',
      'Función referencial: comunica hechos y medidas con objetividad.',
      'Se juzga por cuántas lecturas admite, no por cómo suena.',
    ],
  },

  forensic: {
    titulo: 'Precisión lingüística: vicios y léxico',
    dcd: 'Ref. LL.5.3.1',
    intro: 'Hay tres formas típicas en que una instrucción falla, y una causa de fondo: el vocabulario que sirve para todo y no nombra nada.',
    bloques: [
      {
        tipo: 'lista',
        titulo: 'Los tres vicios de redacción que provocan accidentes',
        items: [
          {
            term: 'Ambigüedad',
            def: 'Cuando una orden puede interpretarse de dos o más formas distintas.',
            ejemplo: '«Gire la palanca suavemente» → ¿hacia la izquierda o la derecha? ¿cuántos grados?',
          },
          {
            term: 'Contradicción',
            def: 'Cuando dos afirmaciones del mismo texto se anulan mutuamente.',
            ejemplo: '«Mantenga la máquina encendida mientras cambia la broca», frente a «Desconecte la energía antes de intervenir la herramienta».',
          },
          {
            term: 'Vacío de información',
            def: 'Omisión de un paso crítico o de una condición de seguridad previa.',
            ejemplo: 'Decir «Encienda la fresadora» sin especificar antes «Verifique que la guarda de seguridad esté colocada y use gafas».',
          },
        ],
      },
      {
        tipo: 'tabla',
        titulo: 'Léxico técnico frente a términos comodín',
        nota: 'En el taller se elimina el vocabulario ambiguo o informal y se sustituye por terminología exacta.',
        encabezados: ['Se elimina', 'Se sustituye por'],
        filas: [
          ['«esa pieza», «el aparato»', 'husillo, carro portaherramientas, contactor'],
          ['«la vaina», «la cosa»', 'manómetro, disyuntor, zapata de apoyo'],
          ['«hacer», «poner»', 'acoplar, desenergizar, calibrar'],
        ],
      },
    ],
    resumen: [
      'Ambigüedad: admite dos lecturas.',
      'Contradicción: dos órdenes que se anulan.',
      'Vacío: falta un paso crítico de seguridad.',
      'Comodín fuera: husillo, contactor, manómetro, calibrar, desenergizar.',
    ],
  },

  verbal: {
    titulo: 'Rasgos gramaticales del texto técnico',
    dcd: 'Ref. LL.5.3.1',
    intro: 'La instrucción técnica admite tres formas verbales. Ninguna es incorrecta: lo incorrecto es mezclarlas en un mismo documento.',
    bloques: [
      {
        tipo: 'lista',
        titulo: 'Las tres formas verbales de instrucción',
        items: [
          {
            term: 'Modo imperativo',
            def: 'Expresa una orden técnica directa a quien está operando.',
            ejemplo: 'Ajuste la tuerca. Limpie la bancada. Accione el interruptor.',
          },
          {
            term: 'Infinitivo',
            def: 'Expresa la acción en forma neutra, como norma general.',
            ejemplo: 'Ajustar la tuerca. Limpiar la bancada. Accionar el interruptor.',
          },
          {
            term: 'Impersonal con «se»',
            def: 'Estilo formal de manual de fábrica: el foco pasa al proceso, no a la persona.',
            ejemplo: 'Se ajusta la tuerca. Se verifica la presión.',
          },
        ],
      },
      {
        tipo: 'concepto',
        titulo: 'La regla de la consistencia',
        texto: 'Un documento técnico adopta un solo modo verbal desde el primer paso hasta el cierre. Mezclarlos obliga al operario a detenerse para decidir si dos formulaciones distintas son la misma orden, y ese medio segundo, con una máquina encendida, es el que cuesta.',
      },
    ],
    resumen: [
      'Imperativo: «Ajuste la tuerca» — orden directa, carteles y emergencias.',
      'Infinitivo: «Ajustar la tuerca» — norma general, manuales y checklists.',
      'Impersonal: «Se ajusta la tuerca» — informes y auditorías.',
      'Elige uno y sostenlo en todo el documento.',
    ],
  },

  sequence: {
    titulo: 'Cohesión cronológica',
    dcd: 'Ref. LL.5.4.7',
    intro: 'Un procedimiento no es una lista de frases sueltas: es un flujo continuo donde cada conector indica en qué fase del trabajo estás.',
    bloques: [
      {
        tipo: 'concepto',
        titulo: 'El párrafo de secuencia técnica',
        texto: 'Es la unidad textual que describe una operación industrial en un flujo continuo y ordenado, asegurando que el técnico ejecute los pasos en la secuencia temporal requerida para evitar averías o accidentes.',
      },
      {
        tipo: 'tabla',
        titulo: 'Conectores lógicos de orden cronológico',
        nota: 'Permiten enlazar las acciones evitando oraciones sueltas.',
        encabezados: ['Fase', 'Función en el taller', 'Conectores'],
        filas: [
          ['Inicio / preparación', 'Prepara el entorno y la seguridad previa', 'Inicialmente, en primer lugar, para comenzar, antes de operar'],
          ['Desarrollo / ejecución', 'Describe la secuencia operativa principal', 'A continuación, posteriormente, seguidamente, luego'],
          ['Cierre / verificación', 'Finaliza la tarea y ordena el puesto', 'Finalmente, por último, al concluir la operación'],
        ],
      },
      {
        tipo: 'concepto',
        titulo: '¿Conectores o numeración (1, 2, 3...)?',
        texto: (
          <>
            En los textos instructivos técnicos existen dos maneras estándar de ordenar los pasos: 1) Listas numeradas (1, 2, 3...) o viñetas, habituales en checklists, <Termino term="hojas sop">hojas SOP</Termino> y manuales de fabricante; y 2) Párrafo continuo con conectores cronológicos (inicialmente, posteriormente, finalmente), propio de especificaciones e informes formales. Ambos métodos son válidos y complementarios.
          </>
        ),
      },
    ],
    resumen: [
      'Inicio: inicialmente, en primer lugar, antes de operar.',
      'Desarrollo: a continuación, posteriormente, seguidamente, luego.',
      'Cierre: finalmente, por último, al concluir la operación.',
      'El conector marca la fase; por eso «finalmente» no va en el paso dos.',
      'El orden puede señalarse con conectores o con números (1, 2, 3...): ambos son válidos en el taller.',
    ],
  },

  'safety-sheet': {
    titulo: 'Estructura del texto instructivo final',
    dcd: 'Ref. LL.5.4.7',
    intro: 'Vas a redactar un texto instructivo técnico en dos párrafos. El primero prepara la tarea; el segundo ordena las acciones y el cierre.',
    bloques: [
      {
        tipo: 'lista',
        titulo: 'Los dos párrafos obligatorios',
        items: [
          {
            term: 'Párrafo 1 — Inspección, EPP y preparación',
            def: 'Detalla el equipo de protección personal requerido (gafas, botas, guantes) y la verificación del estado de la máquina antes del encendido.',
          },
          {
            term: 'Párrafo 2 — Ejecución y cierre',
            def: 'Describe las maniobras unidas con conectores cronológicos, terminando con la parada del equipo y el aseo del puesto.',
          },
        ],
      },
      {
        tipo: 'formula',
        titulo: 'Fórmula del proceso',
        pasos: [
          'Conector inicial',
          'Inspección y EPP',
          'Conector de avance',
          'Maniobra técnica',
          'Conector de cierre',
          'Parada y limpieza',
        ],
      },
      {
        tipo: 'concepto',
        titulo: 'Cómo se escribe cada paso',
        texto: 'Un solo verbo de acción por paso, el nombre exacto del componente y la condición de seguridad. El patrón es: verbo de acción + componente exacto + condición o parámetro.',
      },
    ],
    resumen: [
      'Párrafo 1: EPP + inspección previa de la máquina.',
      'Párrafo 2: maniobra con conectores + parada y limpieza.',
      'Fórmula: conector → EPP → conector → maniobra → conector → cierre.',
      'Un verbo de acción por paso, con el componente exacto.',
    ],
  },
};

export function teoriaDe(moduleId) {
  return TEORIA[moduleId] || null;
}
