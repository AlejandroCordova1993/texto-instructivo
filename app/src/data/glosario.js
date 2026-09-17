/* Glosario del taller.
 *
 * Patrón adaptado del Taller de Ensayo Argumentativo: un diccionario
 * central en vez de definiciones sueltas por componente, para que el mismo
 * término signifique siempre lo mismo en todo el recurso.
 *
 * Cada entrada:
 *   def      — definición en lenguaje de estudiante, una o dos frases.
 *   ejemplo  — opcional. Un caso concreto de taller; es lo que hace que la
 *              definición se entienda de verdad.
 */

export const GLOSARIO = {
  'ambigüedad': {
    def: 'Defecto de una instrucción que admite dos o más lecturas distintas. El operario duda o resuelve con su propio criterio.',
    ejemplo: '«Suba el carro hasta una altura buena»: cada técnico entiende una altura distinta.',
  },
  'contradicción': {
    def: 'Defecto en el que dos órdenes del mismo texto se anulan entre sí, de modo que cumplir una obliga a incumplir la otra.',
    ejemplo: '«Mantenga la llave en contacto mientras desconecta el borne»: la norma eléctrica exige lo contrario.',
  },
  'vacío de información': {
    def: 'Defecto por omisión: la instrucción es clara, pero se salta un paso crítico previo de seguridad.',
    ejemplo: '«Proceda a purgar los frenos» sin mencionar los caballetes de soporte ni las gafas.',
  },
  'función apelativa': {
    def: 'Función del lenguaje que busca dirigir la conducta de quien lee. No sugiere ni dialoga: ordena una maniobra.',
    ejemplo: '«Desconecte el borne negativo antes de intervenir el alternador.»',
  },
  'función referencial': {
    def: 'Función del lenguaje que comunica hechos y magnitudes con objetividad, sin valoraciones personales.',
    ejemplo: '«Aplique un par de apriete de 90 lb-pie en secuencia cruzada.»',
  },
  'imperativo': {
    def: 'Modo verbal que da una orden directa a quien está operando la máquina.',
    ejemplo: 'Ajuste, limpie, accione.',
  },
  'infinitivo': {
    def: 'Forma verbal neutra, terminada en -ar, -er o -ir. Es el estándar de los manuales de fabricante.',
    ejemplo: 'Ajustar, limpiar, accionar.',
  },
  'impersonal': {
    def: 'Construcción con «se» que quita a la persona y deja el foco en el proceso. Propia de informes y auditorías.',
    ejemplo: 'Se ajusta, se limpia, se acciona.',
  },
  'conector cronológico': {
    def: 'Palabra o expresión que marca en qué fase del procedimiento estás y enlaza un paso con el siguiente.',
    ejemplo: 'Inicialmente… Posteriormente… Finalmente…',
  },
  'palabra comodín': {
    def: 'Término vago que sirve para cualquier cosa y por eso no nombra ninguna. Se entiende entre compañeros y se pierde en un manual.',
    ejemplo: '«El aparato», «la vaina», «la cosa esa».',
  },
  'epp': {
    def: 'Equipo de Protección Personal: todo lo que el operario lleva puesto para no lesionarse en el puesto de trabajo.',
    ejemplo: 'Overol, botas punta de acero, gafas de policarbonato, guantes de nitrilo.',
  },
  'protocolo': {
    def: 'Secuencia fija y escrita de pasos que hay que seguir siempre igual para ejecutar una tarea sin improvisar.',
  },
  'bitácora': {
    def: 'Registro escrito donde se anota cada intervención hecha sobre una máquina: qué se hizo, cuándo y quién.',
  },
  'torque': {
    def: 'Fuerza de giro que se aplica al apretar un perno, medida en newton-metro (N·m) o libra-pie (lb-pie). Se mide con torquímetro; no se calcula a pulso.',
    ejemplo: '90 lb-pie en secuencia cruzada, no «durito con la mano».',
  },
  'tolerancia': {
    def: 'Margen de error permitido en una medida. Fuera de ese margen, la pieza se rechaza.',
  },
  'dieléctrico': {
    def: 'Material que no conduce la electricidad. Un calzado dieléctrico protege al operario de una descarga.',
  },
  'estandarizar': {
    def: 'Fijar una única forma correcta de nombrar o hacer algo, para que todos en el taller entiendan lo mismo.',
  },
  'cota': {
    def: 'Medida exacta indicada en un plano o instrucción, siempre con su unidad.',
    ejemplo: '«Elevar a 1,70 m», no «a una altura buena».',
  },
  'mecanizado': {
    def: 'Proceso de fabricación por corte o desgaste de metal para lograr una forma geométrica exacta con tolerancias milimétricas o micrométricas.',
    ejemplo: 'Torneado, fresado, taladrado y rectificado de piezas.',
  },
  'construcciones metálicas': {
    def: 'Área técnica enfocada en el diseño, corte, conformado y unión soldada de perfiles y planchas de acero para armar estructuras y soportes.',
    ejemplo: 'Fabricación de vigas, armazones estructurales y ductos.',
  },
  'soldadura smaw': {
    def: 'Soldadura manual por arco eléctrico con electrodo metálico revestido (Shielded Metal Arc Welding). Es el proceso base para unir estructuras metálicas.',
    ejemplo: 'Unión de perfiles ASTM A36 con electrodo E6011 a 90 A.',
  },
  'electrodo revestido': {
    def: 'Varilla metálica consumible recubierta de fundente que conduce corriente, crea el arco voltaico y genera gas protector sobre el baño de fusión.',
    ejemplo: 'AWS E6011 (alta penetración) o AWS E7018 (bajo hidrógeno).',
  },
  'bisel': {
    def: 'Corte en ángulo mecanizado en las aristas de una plancha o perfil para facilitar la penetración profunda del cordón de soldadura.',
    ejemplo: 'Bisel en V a 60° con talón de 2 mm.',
  },
  'escoria': {
    def: 'Capa vítrea protectora que solidifica sobre el cordón de soldadura al enfriarse; debe removerse con martillo picador usando gafas de seguridad.',
  },
  'conformado': {
    def: 'Deformación plástica controlada de planchas y perfiles metálicos para darles forma sin arrancar viruta.',
    ejemplo: 'Plegado en prensa hidráulica, rolado de chapas y curvado de tubos.',
  },
  'calibrador vernier': {
    def: 'Instrumento de medición directa con escala de nonio para medir interiores, exteriores y profundidades con precisión de 0,05 mm o 0,02 mm.',
  },
  'micrómetro': {
    def: 'Instrumento de medición de alta precisión basado en un tornillo micrométrico, capaz de medir centésimas y milésimas de milímetro (micras).',
    ejemplo: 'Medición del diámetro de un eje para ajuste con rodamiento.',
  },
  'plano técnico': {
    def: 'Representación gráfica normalizada en 2D o 3D con vistas, cotas, tolerancias y símbolos AWS que especifica con exactitud cómo fabricar una estructura.',
  },
  'hojas sop': {
    titulo: 'Hojas SOP (Procedimiento Operativo Estandarizado)',
    def: 'Documentos breves y visuales fijados junto a la máquina que detallan paso a paso cómo ejecutar una tarea de forma segura, uniforme y sin errores (del inglés Standard Operating Procedure).',
    ejemplo: 'Hoja SOP plastificada con los pasos numerados del 1 al 5 para encendido, calibración y parada de emergencia.',
  },
  'sop': {
    titulo: 'SOP (Standard Operating Procedure)',
    def: 'Procedimiento Operativo Estandarizado: guía técnica oficial que establece la secuencia exacta de pasos para realizar un trabajo en el taller o fábrica con idéntica calidad y seguridad.',
    ejemplo: 'Checklist o protocolo de mantenimiento fijado en el puesto de trabajo.',
  },
};

/** Busca una entrada sin importar mayúsculas ni espacios sobrantes. */
export function buscarTermino(term = '') {
  return GLOSARIO[term.trim().toLowerCase()] || null;
}
