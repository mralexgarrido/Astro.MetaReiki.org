import ruler1 from './interpretations/data/ruler_1.json';
import ruler2 from './interpretations/data/ruler_2.json';
import ruler3 from './interpretations/data/ruler_3.json';
import ruler4 from './interpretations/data/ruler_4.json';
import ruler5 from './interpretations/data/ruler_5.json';
import ruler6 from './interpretations/data/ruler_6.json';
import ruler7 from './interpretations/data/ruler_7.json';
import ruler8 from './interpretations/data/ruler_8.json';
import ruler9 from './interpretations/data/ruler_9.json';
import ruler10 from './interpretations/data/ruler_10.json';
import ruler11 from './interpretations/data/ruler_11.json';
import ruler12 from './interpretations/data/ruler_12.json';

export const HOUSE_THEMES: Record<number, string> = {
    1: "La identidad, el cuerpo físico, la apariencia y la primera impresión que das al mundo.",
    2: "Recursos personales, dinero, posesiones materiales, autoestima y valores.",
    3: "Comunicación, hermanos, vecinos, viajes cortos, aprendizaje temprano y entorno local.",
    4: "Hogar, familia, raíces, ancestros, vida privada y el padre/madre.",
    5: "Creatividad, autoexpresión, romance, hijos, placer, juegos y riesgos.",
    6: "Salud, rutinas diarias, trabajo, servicio, mascotas y obligaciones.",
    7: "Relaciones comprometidas, matrimonio, socios comerciales y enemigos declarados.",
    8: "Transformación, muerte, renacimiento, recursos compartidos, herencias y deudas.",
    9: "Filosofía, creencias, educación superior, viajes largos, leyes y espiritualidad.",
    10: "Carrera, reputación, estatus social, logros públicos y figuras de autoridad.",
    11: "Amigos, grupos, redes, esperanzas, sueños futuros y comunidad.",
    12: "El inconsciente, aislamiento, secretos, karma, espiritualidad y enemigos ocultos."
};

export const HOUSE_DEFINITIONS: Record<number, string> = {
    1: "La Casa 1 (Ascendente) representa el 'Yo'. Gobierna tu cuerpo físico, tu vitalidad, tu apariencia y cómo inicias las cosas.",
    2: "La Casa 2 representa lo que posees. Gobierna tus finanzas personales, tus bienes materiales y tu sentido de autovaloración.",
    3: "La Casa 3 representa tu mente concreta. Gobierna la comunicación, el intercambio de información y tu relación con el entorno inmediato.",
    4: "La Casa 4 representa tus cimientos. Gobierna tu hogar, tu vida doméstica, tus padres y tu mundo interior emocional.",
    5: "La Casa 5 representa tu alegría. Gobierna tus creaciones, romances, pasatiempos y todo aquello que te hace sentir vivo.",
    6: "La Casa 6 representa tu deber. Gobierna tu trabajo diario, tu salud física y cómo sirves a los demás.",
    7: "La Casa 7 representa al 'Otro'. Gobierna todas las relaciones uno a uno, compromisos formales y proyecciones.",
    8: "La Casa 8 representa la fusión. Gobierna lo que compartes con otros (dinero, intimidad), así como las crisis y transformaciones profundas.",
    9: "La Casa 9 representa la búsqueda de sentido. Gobierna tus horizontes mentales y físicos, la educación superior y tu filosofía de vida.",
    10: "La Casa 10 (Medio Cielo) representa tu cumbre. Gobierna tu profesión, tu vocación y cómo eres visto por la sociedad.",
    11: "La Casa 11 representa tus alianzas. Gobierna tus amistades, los grupos a los que perteneces y tus aspiraciones a largo plazo.",
    12: "La Casa 12 representa la disolución. Gobierna lo que está oculto, el subconsciente, el retiro y la conexión con el todo."
};

export const PLANET_MEANINGS: Record<string, string> = {
    'Sol': "iluminando la esencia vital y el propósito",
    'Luna': "aportando necesidades emocionales e instintivas",
    'Mercurio': "activando los procesos mentales y comunicativos",
    'Venus': "atrayendo armonía, placer y conexión",
    'Marte': "inyectando energía, acción y deseo",
    'Júpiter': "expandiendo, otorgando fe y abundancia",
    'Saturno': "estructurando, limitando y madurando",
    'Urano': "innovando y trayendo cambios repentinos",
    'Neptuno': "disolviendo límites e inspirando sueños",
    'Plutón': "transformando profundamente y empoderando",
    'Nodo Norte': "señalando el camino del destino y el crecimiento",
    'Nodo Sur': "revelando talentos innatos y patrones kármicos",
    'Ascendente': "marcando el camino de vida",
    'Medio Cielo': "definiendo la meta profesional"
};

export const SIGN_ADJECTIVES: Record<string, string> = {
    'Aries': "audaz, directa e iniciadora",
    'Tauro': "estable, sensual y perseverante",
    'Géminis': "curiosa, adaptable y versátil",
    'Cáncer': "protectora, intuitiva y emocional",
    'Leo': "expresiva, creativa y radiante",
    'Virgo': "analítica, servicial y detallista",
    'Libra': "diplomática, estética y equilibrada",
    'Escorpio': "intensa, profunda y estratégica",
    'Sagitario': "aventurera, optimista y filosófica",
    'Capricornio': "ambiciosa, disciplinada y pragmática",
    'Acuario': "original, humanitaria e independiente",
    'Piscis': "compasiva, soñadora y espiritual"
};

// --- RICH INTERPRETATION DATA ---

const MODALITY_INTRO: Record<string, string> = {
    'Angular': "Este es un año crucial, marcado por la acción y el cambio visible. Los temas centrales de tu vida toman el escenario principal.",
    'Succedent': "Este es un año de estabilización y desarrollo. Es momento de consolidar lo iniciado y nutrir tus recursos.",
    'Cadent': "Este es un año de transición, aprendizaje y ajuste. Es ideal para la introspección, la preparación y el cambio de perspectiva."
};

const PROFECTION_ARCHETYPES: Record<string, { day: string, night: string }> = {
    'Sol': {
        day: "Como Señor del Tiempo en tu carta diurna, el Sol brilla con fuerza benéfica. Es un año para liderar, ser visto y clarificar tu propósito vital. Tienes el viento a favor para afirmar tu identidad.",
        night: "Aunque es una carta nocturna, el Sol trae luz a la oscuridad. Este año ilumina áreas ocultas, exigiendo autenticidad. Puede sentirse intenso, como un reflector potente sobre temas que preferirías mantener privados."
    },
    'Luna': {
        day: "En una carta diurna, la Luna trae un enfoque necesario pero a veces fluctuante sobre tus necesidades. Es un año para escuchar a tu cuerpo y emociones, aunque el mundo exterior te exija pragmatismo.",
        night: "Como luminaria principal de tu secta nocturna, la Luna es una aliada poderosa. Este año fluye con intuición y soporte emocional. Confía en tus instintos; te guiarán a puertos seguros y nutridos."
    },
    'Mercurio': {
        day: "Mercurio se adapta a la luz del día agudizando tu intelecto para la estrategia y el comercio. Es un año de gran actividad mental, negociación y movimiento rápido. Mantén la claridad.",
        night: "Bajo el manto de la noche, Mercurio profundiza. Este año favorece la investigación, los secretos y el entendimiento psicológico. Tu mente buscará respuestas en lo profundo más que en lo evidente."
    },
    'Venus': {
        day: "En el día, Venus suaviza las aristas. Aunque no es su reino principal, trae diplomacia y estética a tus esfuerzos visibles. Es un año para buscar alianzas estratégicas y presentar tu mejor cara.",
        night: "¡Venus reina en la noche! Como benéfica de la secta, este año promete alivio, placer y conexiones genuinas. Es un tiempo excelente para el amor, el arte y la reconciliación. Disfruta la armonía."
    },
    'Marte': {
        day: "Marte es el 'maléfico' de la secta diurna, lo que puede traer fricción. Este año sentirás urgencia y calor. Evita el conflicto innecesario; canaliza esta energía volcánica en trabajo duro y ambición.",
        night: "En la noche, la espada de Marte protege. Tienes la capacidad de cortar con lo que no sirve y luchar por lo que amas con precisión quirúrgica. Es un año de valentía constructiva y logros directos."
    },
    'Júpiter': {
        day: "¡El Gran Benéfico está en su salsa! En una carta diurna, Júpiter abre puertas, trae mentores y expande tu visión. Es un año de fe y oportunidades doradas. Di sí a la aventura.",
        night: "Júpiter sigue siendo afortunado en la noche, pero su ayuda es más sutil o espiritual. Este año ofrece crecimiento interior, protección invisible y sabiduría filosófica más que ganancias materiales obvias."
    },
    'Saturno': {
        day: "Saturno es el 'maléfico' constructivo del día. Te pedirá disciplina, pero recompensará tu esfuerzo con estructuras duraderas. Es un año de madurez, construcción lenta y autoridad ganada.",
        night: "En la noche, Saturno puede sentirse pesado. Es el desafío principal de la secta. Este año podrías enfrentar límites, retrasos o soledad. Paciencia: estas pruebas están forjando tu resiliencia."
    },
    // Modern planets fallbacks
    'Urano': { day: "Un año de disrupción eléctrica.", night: "Un año de liberación súbita." },
    'Neptuno': { day: "Un año de disolución y sueños.", night: "Un año de inspiración mística." },
    'Plutón': { day: "Un año de transformación radical.", night: "Un año de empoderamiento profundo." },
};

const HOUSE_ACTION_VERBS: Record<number, string> = {
    1: "redefinir quién eres y cómo te presentas al mundo",
    2: "evaluar y potenciar tus recursos y valores",
    3: "conectar, aprender y moverte en tu entorno",
    4: "echar raíces y atender tu vida privada",
    5: "crear, amar y arriesgarte por lo que te apasiona",
    6: "organizar, sanar y servir con eficiencia",
    7: "comprometerte, negociar y ver al otro",
    8: "transformar, compartir y gestionar crisis",
    9: "expandir tu mente, viajar y buscar la verdad",
    10: "alcanzar metas, liderar y construir tu legado",
    11: "colaborar, soñar y reunirte con tu tribu",
    12: "soltar, meditar y cerrar ciclos kármicos"
};

const RULER_INTERPRETATIONS: Record<number, Record<string, string>> = {
    1: ruler1,
    2: ruler2,
    3: ruler3,
    4: ruler4,
    5: ruler5,
    6: ruler6,
    7: ruler7,
    8: ruler8,
    9: ruler9,
    10: ruler10,
    11: ruler11,
    12: ruler12
};

export const getRulerInterpretation = (sourceHouse: number, targetHouse: number): string => {
    const sourceData = RULER_INTERPRETATIONS[sourceHouse];
    if (sourceData) {
        return sourceData[targetHouse.toString()] || "Interpretación no disponible.";
    }
    return "Interpretación no disponible.";
};

export const generateInterpretation = (
    planet: string,
    sign: string,
    house: number,
    rulerName: string,
    rulerHouse: number
): string => {
    return `Con el ${planet} en ${sign} en la Casa ${house}, hay una energía ${SIGN_ADJECTIVES[sign] || 'única'} ${PLANET_MEANINGS[planet] || 'operando'} en el área de ${HOUSE_THEMES[house].toLowerCase().split(',')[0]}. El regente de esta casa, ${rulerName}, se encuentra en la Casa ${rulerHouse}, lo que sugiere que los asuntos de la Casa ${house} servirán a o dependerán de los temas de la Casa ${rulerHouse} (${HOUSE_THEMES[rulerHouse].toLowerCase().split(',')[0]}).`;
};

export const generateProfectionInterpretation = (
    timeLord: string,
    houseNumber: number,
    signName: string,
    isDayChart: boolean = true // Default to day if unknown, though we should pass it
): string => {
    // 1. Determine Modality
    const isAngular = [1, 4, 7, 10].includes(houseNumber);
    const isSuccedent = [2, 5, 8, 11].includes(houseNumber);
    const modalityText = isAngular ? MODALITY_INTRO['Angular'] : (isSuccedent ? MODALITY_INTRO['Succedent'] : MODALITY_INTRO['Cadent']);

    // 2. Determine Archetype based on Sect
    const sectKey = isDayChart ? 'day' : 'night';
    const lordText = PROFECTION_ARCHETYPES[timeLord]?.[sectKey] || PROFECTION_ARCHETYPES[timeLord]?.day || `La energía de ${timeLord} será predominante.`;

    // 3. Assemble Narrative
    // Structure: [Modality Intro] [House Action]. [Time Lord Description] [Sign Flavor].

    return `${modalityText} Este año activa la Casa ${houseNumber}, invitándote a ${HOUSE_ACTION_VERBS[houseNumber]}. ${lordText} Todo esto se tiñe con la cualidad ${SIGN_ADJECTIVES[signName]} de ${signName}.`;
};
