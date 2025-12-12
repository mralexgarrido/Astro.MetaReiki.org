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

export const generateInterpretation = (
    planet: string,
    sign: string,
    house: number,
    rulerName: string,
    rulerHouse: number
): string => {
    return `Con el ${planet} en ${sign} en la Casa ${house}, hay una energía ${SIGN_ADJECTIVES[sign] || 'única'} ${PLANET_MEANINGS[planet] || 'operando'} en el área de ${HOUSE_THEMES[house].toLowerCase().split(',')[0]}. El regente de esta casa, ${rulerName}, se encuentra en la Casa ${rulerHouse}, lo que sugiere que los asuntos de la Casa ${house} servirán a o dependerán de los temas de la Casa ${rulerHouse} (${HOUSE_THEMES[rulerHouse].toLowerCase().split(',')[0]}).`;
};