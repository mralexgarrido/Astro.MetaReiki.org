// Imports for Rulers
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

// Imports for Planets
import sol from './interpretations/data/sol.json';
import luna from './interpretations/data/luna.json';
import mercurio from './interpretations/data/mercurio.json';
import venus from './interpretations/data/venus.json';
import marte from './interpretations/data/marte.json';
import jupiter from './interpretations/data/jupiter.json';
import saturno from './interpretations/data/saturno.json';
import urano from './interpretations/data/urano.json';
import neptuno from './interpretations/data/neptuno.json';
import pluton from './interpretations/data/pluton.json';
import quiron from './interpretations/data/quiron.json';
import nodo_norte from './interpretations/data/nodo_norte.json';
import nodo_sur from './interpretations/data/nodo_sur.json';

// Imports for Returns
import return_saturn from './interpretations/data/returns/saturn.json';
import return_jupiter from './interpretations/data/returns/jupiter.json';
import return_uranus from './interpretations/data/returns/uranus.json';
import return_nodes from './interpretations/data/returns/nodes.json';

// Imports for Lots
import fortune from './interpretations/data/fortune.json';
import spirit from './interpretations/data/spirit.json';
import eros from './interpretations/data/eros.json';
import necessity from './interpretations/data/necessity.json';
import courage from './interpretations/data/courage.json';
import victory from './interpretations/data/victory.json';
import nemesis from './interpretations/data/nemesis.json';

// Imports for Points
import ascendente from './interpretations/data/ascendente.json';
import medio_cielo from './interpretations/data/medio_cielo.json';

// Imports for Profections
import profection1 from './interpretations/data/profections/profection_house_1.json';
import profection2 from './interpretations/data/profections/profection_house_2.json';
import profection3 from './interpretations/data/profections/profection_house_3.json';
import profection4 from './interpretations/data/profections/profection_house_4.json';
import profection5 from './interpretations/data/profections/profection_house_5.json';
import profection6 from './interpretations/data/profections/profection_house_6.json';
import profection7 from './interpretations/data/profections/profection_house_7.json';
import profection8 from './interpretations/data/profections/profection_house_8.json';
import profection9 from './interpretations/data/profections/profection_house_9.json';
import profection10 from './interpretations/data/profections/profection_house_10.json';
import profection11 from './interpretations/data/profections/profection_house_11.json';
import profection12 from './interpretations/data/profections/profection_house_12.json';

// Import Definitions
import definitions from './interpretations/data/definitions.json';

// --- DEFINITIONS EXPORTS ---
// Cast to any to avoid strict index signature mismatches with JSON
const defs = definitions as any;

export const HOUSE_THEMES = defs.HOUSE_THEMES as Record<number, string>;
export const HOUSE_DEFINITIONS = defs.HOUSE_DEFINITIONS as Record<number, string>;
export const PLANET_MEANINGS = defs.PLANET_MEANINGS as Record<string, string>;
export const SIGN_ADJECTIVES = defs.SIGN_ADJECTIVES as Record<string, string>;


// --- DATA MAPPINGS ---
// We use 'any' casting here because TypeScript's strict index signature checks
// struggle with specific JSON structures being assigned to generic Records.
// The structure is validated logically by the usage.

const LOT_DATA: Record<string, any> = {
    'fortune': fortune,
    'spirit': spirit,
    'eros': eros,
    'necessity': necessity,
    'courage': courage,
    'victory': victory,
    'nemesis': nemesis
};

const PLANET_DATA: Record<string, any> = {
    'Sol': sol,
    'Luna': luna,
    'Mercurio': mercurio,
    'Venus': venus,
    'Marte': marte,
    'Júpiter': jupiter,
    'Saturno': saturno,
    'Urano': urano,
    'Neptuno': neptuno,
    'Plutón': pluton,
    'Quirón': quiron,
    'Nodo Norte': nodo_norte,
    'Nodo Sur': nodo_sur,
};

const RETURN_DATA: Record<string, any> = {
    'Sol': null,
    'Luna': null,
    'Mercurio': null,
    'Venus': null,
    'Marte': null,
    'Júpiter': return_jupiter,
    'Saturno': return_saturn,
    'Urano': return_uranus,
    'Neptuno': null,
    'Plutón': null,
    'Quirón': null,
    'Nodo Norte': return_nodes,
    'Nodo Sur': null,
};

const POINT_DATA: Record<string, any> = {
    'Ascendente': ascendente,
    'Medio Cielo': medio_cielo
};

const RULER_INTERPRETATIONS: Record<number, any> = {
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

const PROFECTION_DATA: Record<number, any> = {
    1: profection1,
    2: profection2,
    3: profection3,
    4: profection4,
    5: profection5,
    6: profection6,
    7: profection7,
    8: profection8,
    9: profection9,
    10: profection10,
    11: profection11,
    12: profection12
};


// --- INTERPRETATION FUNCTIONS ---

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
    rulerName: string, // Kept for signature compatibility but unused
    rulerHouse: number // Kept for signature compatibility but unused
): string => {
    // 1. Check if it's a Point (Ascendant/MC) - these files are keyed by Sign only
    if (POINT_DATA[planet]) {
        return POINT_DATA[planet][sign] || `Interpretación no disponible para ${planet} en ${sign}.`;
    }

    // 2. Check if it's a Planet - these files are keyed by Sign -> House
    if (PLANET_DATA[planet]) {
        const planetSignData = PLANET_DATA[planet][sign];
        if (planetSignData) {
            return planetSignData[house.toString()] || `Interpretación no disponible para ${planet} en ${sign} casa ${house}.`;
        }
    }

    // 3. Fallback
    return `Interpretación no disponible para ${planet} en ${sign} casa ${house}.`;
};

export const generateProfectionInterpretation = (
    timeLord: string,
    houseNumber: number,
    signName: string,
    isDayChart: boolean = true
): string => {
    const houseData = PROFECTION_DATA[houseNumber];

    if (!houseData) {
        return `Interpretación de profección no disponible para la Casa ${houseNumber}.`;
    }

    // Keys in JSON are like "Aries_Day", "Aries_Night"
    const sectSuffix = isDayChart ? 'Day' : 'Night';
    const key = `${signName}_${sectSuffix}`;

    return houseData[key] || `Interpretación de profección no disponible para ${signName} (${sectSuffix}) en Casa ${houseNumber}.`;
};

export const generateLotInterpretation = (
    lotKey: string,
    signName: string,
    houseNumber: number
): string => {
    const lotData = LOT_DATA[lotKey];
    if (lotData && lotData[signName]) {
        return lotData[signName][houseNumber.toString()] || "";
    }
    return "";
};

export const generateReturnInterpretation = (
    planetId: string,
    signId: number,
    house: number
): string => {
    // Map PlanetId (enum) to data keys if necessary, or just use Spanish names
    // PlanetId enum values are Spanish names e.g. 'Saturno'

    // signId to Name
    const signs = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
    const signName = signs[signId];

    const data = RETURN_DATA[planetId];
    if (data && data[signName]) {
        let text = data[signName][house.toString()] || "Descripción detallada próximamente.";
        // Interpolate {sign} and {house}
        text = text.replace('{sign}', signName).replace('{house}', house.toString());
        return text;
    }
    return "Descripción detallada próximamente.";
};
