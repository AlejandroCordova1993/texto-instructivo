// Repositorio Curricular y Léxico Técnico Ecuatoriano
// 1.º de Bachillerato Técnico

export const SPECIALTIES_DATA = {
  automotriz: {
    id: 'automotriz',
    name: 'Electromecánica Automotriz',
    shortName: 'Automotriz',
    motto: 'Diagnóstico eléctrico, tren de rodaje y seguridad en el taller mecánico automotriz',
    mainMachine: 'Elevador hidráulico de dos columnas (Cap. 3500 kg)',
    scenario: 'Taller de alineación, fosa y mantenimiento mecánico vehicular',
    badgeColor: 'bg-inst-blue text-white',
    
    // Módulo 1: Caso de Impacto
    accidentCase: {
      headline: 'Colapso de un vehículo SUV por apoyo excéntrico y trabas mecánicas no aseguradas',
      cause: 'El operador impartió la instrucción verbal imprecisa: "Dale para arriba hasta una buena altura y acomoda los brazos más o menos por abajo", omitiendo verificar las zapatas en los largueros del compacto y sin comprobar el anclaje de las trabas mecánicas.',
      consequence: 'Al subir a 1.70 m, el vehículo venció el centro de gravedad y cayó lateralmente. Destrucción de la carrocería, rotura de brazos del elevador y peligro inminente de aplastamiento para el técnico en fosa.',
      lesson: 'Una instrucción ambigua en un taller automotriz no es un error de ortografía: es un riesgo vital y una pérdida de miles de dólares.',
      question: {
        prompt: 'A la luz de este accidente, analiza la orden: «Dale para arriba hasta una buena altura y acomoda los brazos más o menos por abajo». ¿Cuál de las dos funciones del lenguaje falló y causó el colapso?',
        options: [
          {
            key: 'referencial',
            label: 'Falló la función referencial: la orden no comunicó datos objetivos verificables (omitió la cota exacta de elevación en metros y la posición de los largueros del chasis).',
            isCorrect: true,
            feedback: '¡Exacto! La función referencial es la que aporta datos medibles, cotas y hechos objetivos. Al decir "una buena altura" y "más o menos", el operador improvisó sobre suposiciones y el vehículo cayó.'
          },
          {
            key: 'apelativa',
            label: 'Falló la función apelativa: el operador debió dar la orden con un tono de voz más autoritario y enérgico.',
            isCorrect: false,
            feedback: 'No. En un taller técnico el problema no es el volumen de la voz ni el mando, sino la falta de datos técnicos precisos y comprobables (función referencial).'
          }
        ]
      }
    },

    // Módulo 2: Comparativa A/B
    forensicComparison: {
      versionA: {
        title: 'Versión A — Aviso informal y ambiguo (Riesgo Crítico)',
        badge: 'PELIGROSO / NO ESTANDARIZADO',
        text: 'Para subir ese carro con el aparato de las columnas, primero vean que el seguro ese esté puesto más o menos. Después le dan al botón para que suba hasta una altura buena y acomodan los brazos por debajo por cualquier lado. Si se mueve raro o hace un ruido feo, bájenlo un poco o desconéctenlo rápido para que no pase nada malo. Cuando terminen, dejen las cosas por ahí cerca y avisen que ya.'
      },
      versionB: {
        title: 'Versión B — Protocolo Operativo Estándar (Norma Técnica)',
        badge: 'NORMA TÉCNICA ESTANDARIZADA',
        steps: [
          {
            phase: 'Inspección previa',
            text: 'Verifique que los brazos de elevación estén replegados y que las trabas mecánicas de seguridad de ambas columnas engranen sin desgaste.'
          },
          {
            phase: 'Posicionamiento del vehículo',
            text: 'Centre el vehículo entre las columnas y ubique las zapatas de goma en los puntos de apoyo del chasis o largueros del compacto, nunca sobre el piso o partes plásticas.'
          },
          {
            phase: 'Elevación controlada',
            text: 'Accione el pulsador de ascenso de forma continua hasta la altura de trabajo y descienda ligeramente hasta que el vehículo quede asentado sobre las trabas mecánicas de seguridad.'
          },
          {
            phase: 'Protocolo de emergencia',
            text: 'Ante movimientos irregulares, ruidos anómalos o fuga de líquido hidráulico, presione la seta de parada de emergencia, evacúe la zona bajo el vehículo y corte la energía.'
          },
          {
            phase: 'Finalización segura',
            text: 'Descienda el elevador por completo, repliegue los brazos telescópicos, despeje las herramientas al carro organizador y registre la novedad en la bitácora del taller.'
          }
        ]
      }
    },

    // Vicios de Redacción para detectar
    flawsCases: [
      {
        id: 1,
        phrase: '"Suba el carro hasta una altura buena y acomode los brazos por donde quepa."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Ambigüedad',
        feedbackCorrecto: '"¿Una altura buena?" y "por donde quepa" son órdenes subjetivas. El manual debe especificar la cota en metros y los puntos de apoyo exactos del chasis.',
        feedbackIncorrecto: 'Todavía no. Mira las palabras «una altura buena» y «por donde quepa»: la orden no se contradice ni omite un paso, pero cada técnico la entiende distinto. Eso es AMBIGÜEDAD. El manual debe fijar la cota en metros y los puntos de apoyo exactos del chasis.'
      },
      {
        id: 2,
        phrase: '"Mantenga la llave en contacto mientras desconecta el borne positivo de la batería con la mano descubierta."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Contradicción',
        feedbackCorrecto: 'Es una contradicción mortal: la norma eléctrica exige cortar el switch de encendido y desconectar primero el borne negativo antes de intervenir el circuito.',
        feedbackIncorrecto: 'Todavía no. Aquí no falta información ni sobra interpretación: hay dos órdenes que se anulan entre sí. Dejar la llave en contacto y a la vez manipular el borne es una CONTRADICCIÓN. La norma eléctrica exige cortar el switch y soltar primero el borne negativo.'
      },
      {
        id: 3,
        phrase: '"Proceda a purgar los frenos de las ruedas delanteras."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Vacío de información',
        feedbackCorrecto: 'Omite pasos críticos previos: colocar caballetes de soporte, verificar nivel de líquido DOT 4 en el depósito y utilizar gafas para evitar salpicaduras cáusticas.',
        feedbackIncorrecto: 'Todavía no. La frase es clara y no se contradice; el problema es lo que NO dice. Falta el paso previo de seguridad, así que es un VACÍO DE INFORMACIÓN: caballetes de soporte, nivel de líquido DOT 4 y gafas contra salpicaduras cáusticas.'
      },
      {
        id: 4,
        phrase: '"Ajuste los pernos de la culata con fuerza normal."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Ambigüedad',
        feedbackCorrecto: 'La "fuerza normal" no existe en mecánica de precisión: los pernos de culata requieren torquímetro con valor exacto en N·m o lb-pie y apriete en cruz.',
        feedbackIncorrecto: 'Todavía no. La orden está completa y es coherente, pero «fuerza normal» no significa nada medible: es AMBIGÜEDAD. En mecánica de precisión los pernos de culata llevan torquímetro, valor exacto en N·m o lb-pie y apriete en cruz.'
      }
    ],

    // Módulo 2: Filtro Anti-Comodines (Léxico Técnico Ecuador)
    antiComodin: [
      {
        id: 'c1',
        vague: 'el aparato de las columnas',
        options: ['la máquina del patio', 'elevador hidráulico de dos columnas', 'el elevador grandote'],
        correct: 'elevador hidráulico de dos columnas',
        context: 'Nombre estandarizado del equipo automotriz según normas de taller.'
      },
      {
        id: 'c2',
        vague: 'la cosa esa donde se asienta',
        options: ['zapata de apoyo de elastómero', 'el taco de madera', 'la base esa'],
        correct: 'zapata de apoyo de elastómero',
        context: 'Componente vulcanizado de soporte que impide el deslizamiento del chasis.'
      },
      {
        id: 'c3',
        vague: 'apretarle durito con la mano',
        options: ['meterle fuerza con el tubo', 'darle hasta que tope', 'torquear a 90 lb-pie con llave dinamométrica'],
        correct: 'torquear a 90 lb-pie con llave dinamométrica',
        context: 'Calibración exacta de apriete para evitar desprendimiento de ruedas o rotura de pernos.'
      },
      {
        id: 'c4',
        vague: 'la vaina de los cables',
        options: ['el mazo de conductores con bornera', 'los alambres esos', 'el enredo eléctrico'],
        correct: 'el mazo de conductores con bornera',
        context: 'Terminología automotriz para arneses y puntos de conexión eléctrica.'
      },
      {
        id: 'c5',
        vague: 'darle al botón para que suba',
        options: ['aplastar la cosa verde', 'accionar el pulsador de ascenso', 'hundir el switch'],
        correct: 'accionar el pulsador de ascenso',
        context: 'Verbo operativo preciso para control electrohidráulico.'
      },
      {
        id: 'c6',
        vague: 'dejar las cosas por ahí cerca',
        options: ['botar las herramientas en el suelo', 'organizar el instrumental en el carro portaherramientas', 'poner por el rincón'],
        correct: 'organizar el instrumental en el carro portaherramientas',
        context: 'Cumplimiento de orden y limpieza (metodología 5S en taller automotriz).'
      }
    ],

    // Módulo 3: Modos Verbales
    verbalModes: {
      action: 'Inspección de nivel y fuga de líquido en el sistema de frenos',
      imperativo: {
        text: 'Inspeccione el depósito de líquido de frenos y desenergice el circuito antes de retirar el sensor de nivel.',
        usage: 'Instrucción directa y perentoria para el técnico operador en servicio activo.'
      },
      infinitivo: {
        text: 'Inspeccionar el depósito de líquido de frenos y desenergizar el circuito antes de retirar el sensor de nivel.',
        usage: 'Enunciado neutro estandarizado para manuales de fabricante, catálogos y checklists.'
      },
      impersonal: {
        text: 'Se inspecciona el depósito de líquido de frenos y se desenergiza el circuito antes de retirar el sensor de nivel.',
        usage: 'Registro formal de auditoría de calidad, procedimientos homologados y hojas de servicio.'
      },
      exercise: {
        inconsistent: '1. Desconectar la batería. 2. Afloje los pernos de la rueda en cruz. 3. Se retira el tambor con extractor.',
        problem: 'Mezcla arbitraria de Infinitivo (Desconectar), Imperativo (Afloje) e Impersonal (Se retira).',
        correctChoice: 'Unificar a un solo modo verbal en todo el procedimiento para mantener la coherencia estilística técnica.'
      }
    },

    // Módulo 4: Secuencia y Conectores
    sequenceActivity: {
      title: 'Procedimiento de Cambio Seguro de Pastillas de Freno',
      steps: [
        { id: 's1', originalOrder: 2, text: 'Afloje los pernos de rueda en cruz con torquímetro y eleve el vehículo apoyando sobre caballetes de seguridad.' },
        { id: 's2', originalOrder: 1, text: 'Verifique el freno de mano, instale calzas en las ruedas traseras y desconecte el borne negativo de la batería.' },
        { id: 's3', originalOrder: 4, text: 'Compruebe la presión del pedal de freno, verifique la ausencia de fugas en el cáliper y anote en la bitácora.' },
        { id: 's4', originalOrder: 3, text: 'Desmonte el cáliper de freno, reemplace las pastillas desgastadas e inspeccione el espesor del disco con micrómetro.' }
      ],
      correctOrder: ['s2', 's1', 's4', 's3'],
      connectors: [
        { stepIndex: 0, phase: 'Inicio', recommended: 'Inicialmente' },
        { stepIndex: 1, phase: 'Desarrollo', recommended: 'Posteriormente' },
        { stepIndex: 2, phase: 'Continuación', recommended: 'Seguidamente' },
        { stepIndex: 3, phase: 'Cierre', recommended: 'Finalmente' }
      ]
    },

    // Módulo 5: EPPs y Constructor de Ficha
    safetyEquipments: [
      { id: 'epp1', name: 'Overol de trabajo sin cremalleras metálicas expuestas', required: true, reason: 'Protección corporal sin rayar la carrocería ni generar arcos eléctricos.' },
      { id: 'epp2', name: 'Botas punta de acero dieléctricas', required: true, reason: 'Protección contra aplastamiento por piezas pesadas y descargas de batería.' },
      { id: 'epp3', name: 'Gafas de seguridad de policarbonato', required: true, reason: 'Barrera contra salpicaduras de líquido de frenos cáustico y partículas en fosa.' },
      { id: 'epp4', name: 'Guantes de nitrilo para hidrocarburos', required: true, reason: 'Resistencia química ante aceites, refrigerantes y combustibles.' },
      { id: 'epp5', name: 'Guantes de lana o tela holgada', required: false, reason: 'PELIGROSO: absorben solventes inflamables y pierden adherencia.' },
      { id: 'epp6', name: 'Calzado deportivo con suela de lona', required: false, reason: 'PROHIBIDO: no ofrece protección mecánica ni dieléctrica ante aceites en el piso.' }
    ]
  },

  industrial: {
    id: 'industrial',
    name: 'Mecánica Industrial (Mecanizado y Construcciones Metálicas)',
    shortName: 'Mecanizado y Construcciones Metálicas',
    motto: 'Mecanizado de precisión geométrica y Construcciones Metálicas (soldadura SMAW/MIG/TIG, conformado y planos técnicos)',
    mainMachine: 'Torno paralelo, fresadora, soldadora eléctrica (SMAW/MIG) y equipos de corte/conformado',
    scenario: 'Talleres de Mecanizado por Arranque de Viruta y Construcciones Metálicas (Soldadura, calderería y conformado)',
    badgeColor: 'bg-active-blue text-white',

    // Módulo 1: Caso de Impacto
    accidentCase: {
      headline: 'Proyección violenta de la llave del mandril en torno paralelo por omisión de protocolo',
      cause: 'Durante la práctica de mecanizado, un estudiante novato fijó un tocho de acero SAE 1020 en el plato de tres mordazas, pero dejó la llave de apriete colocada en el mandril mientras escuchaba una orden informal de su compañero: "Dale a la palanca para ver si gira suave".',
      consequence: 'Al embragar el husillo a 750 RPM para iniciar el cilindrado, la llave salió eyectada como un proyectil a más de 120 km/h, pulverizando la pantalla de policarbonato y fracturando el carro portaherramientas.',
      lesson: 'En mecanizado y máquinas rotativas, la regla de oro es inviolable: ¡JAMÁS deje la llave colocada en el plato! El texto instructivo debe advertir esta condición previa de forma explícita y no negociable.',
      question: {
        prompt: 'A la luz de este accidente, analiza la orden: «Dale a la palanca para ver si gira suave». ¿Qué función o elemento indispensable del texto técnico se omitió antes de accionar la máquina?',
        options: [
          {
            key: 'referencial',
            label: 'Falló la función referencial y la condición previa: no constató el estado físico de la máquina (retirar la llave del mandril antes de operar).',
            isCorrect: true,
            feedback: '¡Exacto! El texto instructivo debe basarse en hechos y condiciones físicas comprobables (función referencial). Omitir verificar que la llave fue retirada del plato antes de dar la orden de arranque es una negligencia letal.'
          },
          {
            key: 'apelativa',
            label: 'Falló la función apelativa: la orden debió decir "accione el embrague" en lugar de "dale a la palanca".',
            isCorrect: false,
            feedback: 'No. Aunque "dale a la palanca" es informal, la causa mortal del accidente fue omitir la verificación física previa (función referencial de seguridad).'
          }
        ]
      }
    },

    // Módulo 2: Comparativa A/B (Construcciones Metálicas y Soldadura)
    forensicComparison: {
      versionA: {
        title: 'Versión A — Aviso informal y ambiguo (Peligro de Falla Estructural y Accidente)',
        badge: 'PELIGROSO / NO ESTANDARIZADO',
        text: 'Para armar esa estructura con los fierros en L, primero córtenle al ojo con la amoladora y suéldenle con cualquier electrodo que encuentren por ahí. Échenle bastante chispa para que pegue bien duro y si queda chueco le dan unos martillazos. Al final piquen la escoria con cualquier desarmador sin ponerse la careta y dejen los cables botados en el piso.'
      },
      versionB: {
        title: 'Versión B — Protocolo Operativo Estándar (Norma Técnica y AWS)',
        badge: 'NORMA TÉCNICA ESTANDARIZADA',
        steps: [
          {
            phase: 'Lectura de planos y trazado',
            text: 'Interprete las cotas en el plano mecánico y trace las longitudes sobre el perfil angular ASTM A36 con rayador y escuadra de taller.'
          },
          {
            phase: 'Corte y biselado',
            text: 'Fije el perfil en la mordaza de la tronzadora para el corte en frío y prepare el bisel de unión a 60° con la amoladora angular portando pantalla facial.'
          },
          {
            phase: 'Alineación y apuntalado',
            text: 'Ensamble las piezas en la mesa de soldadura con prensas de banco, verifique la escuadra y aplique puntos de soldadura provisionales en los extremos.'
          },
          {
            phase: 'Soldadura y control de arco',
            text: 'Regule la máquina a 90 A, deposite el cordón de soldadura continuo con electrodo E6011 manteniendo el arco corto y desaloje la escoria con martillo picador y gafas de seguridad.'
          },
          {
            phase: 'Control de calidad y orden',
            text: 'Verifique la tolerancia dimensional con calibrador vernier, recoja los cables portaelectrodo y registre la tarea en la bitácora técnica.'
          }
        ]
      }
    },

    // Vicios de Redacción para detectar (Equilibrio Mecanizado y Construcciones Metálicas)
    flawsCases: [
      {
        id: 1,
        phrase: '"Apriete el tocho de acero más o menos duro en el plato y dele una velocidad regular al torno."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Ambigüedad',
        feedbackCorrecto: 'En mecanizado no existe "más o menos duro" ni "velocidad regular": el apriete requiere llave de mandril autocentrante y la velocidad de giro se calcula estrictamente en RPM según la velocidad de corte (Vc) del material.',
        feedbackIncorrecto: 'Todavía no. Nada se contradice ni se omite: el problema es que «más o menos duro» y «velocidad regular» admiten cualquier lectura subjetiva. Eso es AMBIGÜEDAD. Las RPM se calculan con fórmula matemática.'
      },
      {
        id: 2,
        phrase: '"Pique la escoria caliente del cordón de soldadura directamente con el cincel sin colocarse la careta ni las gafas de protección."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Contradicción',
        feedbackCorrecto: 'Contradice directamente las normas de seguridad del taller: al enfriarse, la escoria vítrea salta proyectada a gran velocidad y temperatura; el desalojo exige gafas de protección obligatorias.',
        feedbackIncorrecto: 'Todavía no. La orden es clara en lo que pide, pero choca de frente con las normas de seguridad. Es una CONTRADICCIÓN: picar escoria sin protección ocular garantiza esquirlas en la córnea.'
      },
      {
        id: 3,
        phrase: '"Encienda el equipo de soldadura y proceda a unir las vigas de la estructura metálica."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Vacío de información',
        feedbackCorrecto: 'Gravísimo vacío de información: omite la preparación de biseles, el tipo de electrodo normado (E6011/E7018), la regulación de amperaje según el plano y la verificación de ausencia de solventes inflamables en el área.',
        feedbackIncorrecto: 'Todavía no. La acción de encender y soldar es coherente, pero falta toda la información previa indispensable: electrodo, amperaje, bisel y seguridad contra incendios. Eso es un VACÍO DE INFORMACIÓN.'
      },
      {
        id: 4,
        phrase: '"Desbaste el diámetro del eje metálico a ojo de buen cubero hasta que entre en el rodamiento."',
        options: ['Ambigüedad', 'Contradicción', 'Vacío de información'],
        correct: 'Ambigüedad',
        feedbackCorrecto: 'En mecanizado de precisión el "ojo de buen cubero" no existe: los ajustes mecánicos para rodamientos exigen control dimensional con calibrador vernier o micrómetro con tolerancia de centésimas de milímetro.',
        feedbackIncorrecto: 'Todavía no. No hay contradicción ni paso omitido: «a ojo de buen cubero» simplemente no es una medida técnica admisible. Eso es AMBIGÜEDAD. Se debe indicar la cota y tolerancia milimétrica.'
      }
    ],

    // Módulo 2: Filtro Anti-Comodines (Mecanizado y Construcciones Metálicas)
    antiComodin: [
      {
        id: 'c1',
        vague: 'el fierro ese en L para armar la estructura',
        options: ['el fierro doblado', 'perfil angular de acero estructural ASTM A36', 'la varilla pesada'],
        correct: 'perfil angular de acero estructural ASTM A36',
        context: 'Identificación normalizada del perfil estructural según especificación de planos técnicos.'
      },
      {
        id: 'c2',
        vague: 'el palito gris para soldar',
        options: ['electrodo revestido AWS E6011 / E7018', 'la varilla eléctrica', 'el alambre con pasta'],
        correct: 'electrodo revestido AWS E6011 / E7018',
        context: 'Consumible normalizado para soldadura por arco eléctrico (SMAW).'
      },
      {
        id: 'c3',
        vague: 'la llavecita para apretar el plato',
        options: ['llave de mandril o de plato autocentrante', 'la palanquita del torno', 'el fierro en cruz'],
        correct: 'llave de mandril o de plato autocentrante',
        context: 'Herramienta de apriete manual de mayor criticidad de seguridad en el torno.'
      },
      {
        id: 'c4',
        vague: 'la máquina de disco para cortar a pulso',
        options: ['la cortadora rápida', 'amoladora angular de 7" con disco de corte abrasivo', 'la sierra de mano'],
        correct: 'amoladora angular de 7" con disco de corte abrasivo',
        context: 'Herramienta electroportátil de corte y desbaste para construcciones metálicas.'
      },
      {
        id: 'c5',
        vague: 'esa agua blanca para que no se caliente la cuchilla',
        options: ['agua con jabón', 'taladrina / emulsión refrigerante soluble de corte', 'aceite quemado'],
        correct: 'taladrina / emulsión refrigerante soluble de corte',
        context: 'Fluido industrial formulado para disipar el calor y lubricar la herramienta de corte en el torno.'
      },
      {
        id: 'c6',
        vague: 'el aparato de fierro para medir el grueso',
        options: ['la regla de metal', 'calibrador pie de rey (vernier) o micrómetro de exteriores', 'la cinta métrica'],
        correct: 'calibrador pie de rey (vernier) o micrómetro de exteriores',
        context: 'Instrumento metrológico para control de tolerancias al milímetro y micrómetro.'
      }
    ],

    // Módulo 3: Modos Verbales
    verbalModes: {
      action: 'Preparación de junta y cebado de arco en soldadura eléctrica (SMAW)',
      imperativo: {
        text: 'Limpie la junta de metal con cepillo de alambre, regule el amperaje a 90 A y cebe el arco manteniendo el electrodo a 3 mm.',
        usage: 'Orden directa e imperativa para el operario frente a la máquina de soldar.'
      },
      infinitivo: {
        text: 'Limpiar la junta de metal con cepillo de alambre, regular el amperaje a 90 A y cebar el arco manteniendo el electrodo a 3 mm.',
        usage: 'Instrucción neutral normalizada para manuales de taller y especificaciones de procedimiento de soldadura (WPS).'
      },
      impersonal: {
        text: 'Se limpia la junta de metal con cepillo de alambre, se regula el amperaje a 90 A y se ceba el arco manteniendo el electrodo a 3 mm.',
        usage: 'Descripción en tercera persona para informes de inspección estructural y control de aseguramiento de calidad ISO.'
      },
      exercise: {
        inconsistent: '1. Limpiar el perfil metálico con amoladora. 2. Regule el inversor a 90 A. 3. Se deposita el cordón de soldadura.',
        problem: 'Ruptura de estilo al mezclar Infinitivo (Limpiar), Imperativo (Regule) e Impersonal (Se deposita).',
        correctChoice: 'Sostener el mismo modo verbal desde el primer hasta el último paso del protocolo técnico.'
      }
    },

    // Módulo 4: Secuencia y Conectores
    sequenceActivity: {
      title: 'Procedimiento de Fabricación y Unión Soldada de Perfiles (Mecanizado y Construcción Metálica)',
      steps: [
        { id: 's1', originalOrder: 2, text: 'Corte el perfil con la tronzadora al milímetro y desbaste el bisel a 60° con la amoladora angular.' },
        { id: 's2', originalOrder: 1, text: 'Interprete las cotas en el plano técnico y trace las medidas sobre el perfil de acero con rayador y escuadra.' },
        { id: 's3', originalOrder: 4, text: 'Retire la escoria con el martillo picador portando gafas protectoras y verifique las dimensiones con el calibrador vernier.' },
        { id: 's4', originalOrder: 3, text: 'Fije las piezas en la mesa con prensas en C, regule el equipo a 90 A y deposite el cordón con electrodo E6011.' }
      ],
      correctOrder: ['s2', 's1', 's4', 's3'],
      connectors: [
        { stepIndex: 0, phase: 'Inicio', recommended: 'Inicialmente' },
        { stepIndex: 1, phase: 'Desarrollo', recommended: 'A continuación' },
        { stepIndex: 2, phase: 'Ejecución', recommended: 'Seguidamente' },
        { stepIndex: 3, phase: 'Cierre', recommended: 'Finalmente' }
      ]
    },

    // Módulo 5: EPPs y Constructor de Ficha (Mecanizado y Construcciones Metálicas)
    safetyEquipments: [
      { id: 'epp1', name: 'Careta fotosensible para soldar (filtro DIN 10-12) y pantalla facial de esmerilar', required: true, reason: 'Protección visual crítica contra radiación ultravioleta/infrarroja del arco y proyección de esquirlas en el corte.' },
      { id: 'epp2', name: 'Guantes de cuero de descarne tipo mosquetero para soldadura y corte', required: true, reason: 'Protección contra quemaduras por calor radiante y cantos vivos metálicos. (¡Prohibidos en torno y fresadora por riesgo de atrapamiento rotativo!)' },
      { id: 'epp3', name: 'Delantal de cuero de descarne (coleto) y polainas', required: true, reason: 'Barrera incombustible contra chispas incandescentes y gotas de metal líquido al soldar o amolar.' },
      { id: 'epp4', name: 'Botas de seguridad de cuero con puntera de acero', required: true, reason: 'Protección ante aplastamiento por caída de perfiles pesados, tochos de acero o herramientas de banco.' },
      { id: 'epp5', name: 'Gafas de seguridad de policarbonato con protección lateral', required: true, reason: 'Protección ocular permanente en el taller durante mecanizado, esmerilado y picado de escoria.' },
      { id: 'epp6', name: 'Ropa sintética inflamable o prendas holgadas con cordones', required: false, reason: '¡TERMINANTEMENTE PROHIBIDO! Se funde con las chispas quemando la piel y genera riesgo mortal de atrapamiento en máquinas rotativas.' }
    ]
  }
};
