/** @type {import('tailwindcss').Config} */

/*  Sistema de identidad HUMAN / SYSTEM — Alejandro Córdova
 *  Fuente de verdad: manual_marca_sistema_diseno_alejandro_cordova.md
 *  y sistema_diseno_cordova.css (raíz de Proyectos).
 *
 *  Reglas heredadas del manual que este archivo hace cumplir:
 *   · Proporción de color 70 / 20 / 10, con el rojo señal por debajo del 3%.
 *   · Radios de 0. Sin sombras difusas. Estructura por líneas de 1px.
 *   · Microetiqueta mono de 12px, tracking 0.08em, con punto rojo de 6px.
 *   · Sin degradados.
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          warm: '#F3F1EA',   // fondo dominante (~70%)
          card: '#FAF9F5',   // superficie elevada apenas
          deep: '#E8E5DC',   // escalón de papel para zonas de revisión
          pure: '#FFFFFF',   // superficies de lectura y entrada
        },
        charcoal: '#101820',
        deep: {
          blue: '#071B33',   // pausas estructurales (~20%)
        },
        inst: {
          blue: '#123C69',
        },
        active: {
          blue: '#2367D1',
        },
        mineral: '#5C636C',
        // Texto secundario sobre azul profundo. El manual lo fija en
        // .mono-label.dark; mide 6.87:1 sobre #071B33.
        dim: '#A3ABB6',
        line: '#D7D9D6',

        /* Rojo señal: reservado a PELIGRO FÍSICO y a los puntos de 6px.
         * Nunca como fondo de bloque ni como "respuesta incorrecta". */
        signal: {
          red: '#D83A32',
        },

        /* Estados semánticos. La diferencia entre acierto y error se
         * comunica con etiqueta + icono + peso, no solo con color. */
        ok: {
          DEFAULT: '#123C69',
          bg: '#E7EEF4',
          border: '#AFC0D1',
        },
        review: {
          DEFAULT: '#101820',
          bg: '#E8E5DC',
          border: '#C3C0B5',
        },
        danger: {
          DEFAULT: '#D83A32',      // solo gráfico: puntos, iconos, bordes
          ink: '#A32219',          // texto de peligro; 6.64:1 sobre papel
          bg: '#FBE9E7',
          border: '#E4A6A0',
        },
      },

      fontFamily: {
        sans: ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },

      /* Escala tipográfica con piso de 12px.
       * El aula es un laboratorio con monitores de 1366x768 y un proyector,
       * así que el cuerpo sube a 17px y los metadatos no bajan de 13px. */
      fontSize: {
        label: ['0.75rem', { lineHeight: '1.1rem', letterSpacing: '0.08em' }], // microetiqueta mono
        xs: ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px — metadatos
        sm: ['0.9375rem', { lineHeight: '1.5rem' }],    // 15px — apoyo
        base: ['1.0625rem', { lineHeight: '1.65rem' }], // 17px — cuerpo
        lg: ['1.25rem', { lineHeight: '1.8rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.75rem', { lineHeight: '2.9rem' }],
        '5xl': ['3.5rem', { lineHeight: '3.6rem' }],
      },

      letterSpacing: {
        label: '0.08em',
      },

      /* Radios de 0 por manual de marca. `full` sobrevive solo para los
       * puntos rojos de 6px, que el manual exige circulares. */
      borderRadius: {
        none: '0',
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px',
      },

      /* Sin sombras difusas (anti-patrón declarado en el manual).
       * La profundidad se construye con líneas de 1px y escalones de papel. */
      boxShadow: {
        none: 'none',
        DEFAULT: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      },

      maxWidth: {
        brand: '1280px',   // retícula del manual
        stage: '72rem',    // retícula amplia para teoría y práctica, sin llegar al ancho de marca
        reading: '68ch',   // medida de lectura para los pasajes en serif
      },

      keyframes: {
        // Entra desde una posición ya legible: si el observador falla,
        // el contenido queda visible igual.
        riseIn: {
          '0%': { opacity: '0.001', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        settleIn: {
          '0%': { opacity: '0.001', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      animation: {
        // Curva exponencial de salida, no `ease` por defecto.
        riseIn: 'riseIn 520ms cubic-bezier(0.16, 1, 0.3, 1) both',
        settleIn: 'settleIn 220ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
