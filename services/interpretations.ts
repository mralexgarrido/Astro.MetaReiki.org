// Imports for Definitions (Keep synchronous as they are small and used in constants)
import definitions from './interpretations/data/definitions.json';

// Import Loader functions
import {
    loadPlanetData,
    loadPointData,
    loadRulerData,
    loadProfectionData,
    loadLotData,
    loadReturnData,
    loadAscTransitData,
    loadMaleficRemedies,
    loadBeneficHarmonization,
    loadBlogLinks
} from './loader.ts';

// --- DEFINITIONS EXPORTS ---
// Cast to any to avoid strict index signature mismatches with JSON
const defs = definitions as any;

export const HOUSE_THEMES = defs.HOUSE_THEMES as Record<number, string>;
export const HOUSE_DEFINITIONS = defs.HOUSE_DEFINITIONS as Record<number, string>;
export const PLANET_MEANINGS = defs.PLANET_MEANINGS as Record<string, string>;
export const SIGN_ADJECTIVES = defs.SIGN_ADJECTIVES as Record<string, string>;

// --- ASYNC INTERPRETATION FUNCTIONS ---

export const getRulerInterpretationAsync = async (sourceHouse: number, targetHouse: number): Promise<string> => {
    const sourceData = await loadRulerData(sourceHouse);
    if (sourceData) {
        return sourceData[targetHouse.toString()] || "Interpretación no disponible.";
    }
    return "Interpretación no disponible.";
};

// Deprecated: Synchronous access is removed. Components must use hooks or async.
// Keeping a stub if needed for type compatibility during migration, but ideally we remove it.
export const getRulerInterpretation = (sourceHouse: number, targetHouse: number): string => {
    console.warn("getRulerInterpretation called synchronously. This function is deprecated. Use useRulerInterpretation hook.");
    return "Cargando...";
};

export const generateInterpretationAsync = async (
    planet: string,
    sign: string,
    house: number
): Promise<string> => {
    // 1. Check if it's a Point (Ascendant/MC)
    const pointData = await loadPointData(planet);
    if (pointData) {
        return pointData[sign] || `Interpretación no disponible para ${planet} en ${sign}.`;
    }

    // 2. Check if it's a Planet
    const planetData = await loadPlanetData(planet);
    if (planetData) {
        const planetSignData = planetData[sign];
        if (planetSignData) {
            return planetSignData[house.toString()] || `Interpretación no disponible para ${planet} en ${sign} casa ${house}.`;
        }
    }

    return `Interpretación no disponible para ${planet} en ${sign} casa ${house}.`;
};

// Deprecated
export const generateInterpretation = (
    planet: string,
    sign: string,
    house: number,
    rulerName: string,
    rulerHouse: number
): string => {
    console.warn("generateInterpretation called synchronously. This function is deprecated. Use usePlanetInterpretation hook.");
    return "Cargando...";
};

export const generateProfectionInterpretationAsync = async (
    timeLord: string,
    houseNumber: number,
    signName: string,
    isDayChart: boolean = true
): Promise<string> => {
    const houseData = await loadProfectionData(houseNumber);

    if (!houseData) {
        return `Interpretación de profección no disponible para la Casa ${houseNumber}.`;
    }

    const sectSuffix = isDayChart ? 'Day' : 'Night';
    const key = `${signName}_${sectSuffix}`;

    return houseData[key] || `Interpretación de profección no disponible para ${signName} (${sectSuffix}) en Casa ${houseNumber}.`;
};

// Deprecated
export const generateProfectionInterpretation = (
    timeLord: string,
    houseNumber: number,
    signName: string,
    isDayChart: boolean = true
): string => {
    console.warn("generateProfectionInterpretation called synchronously. Use useProfectionInterpretation hook.");
    return "Cargando...";
};

export const generateLotInterpretationAsync = async (
    lotKey: string,
    signName: string,
    houseNumber: number
): Promise<string> => {
    const lotData = await loadLotData(lotKey);
    if (lotData && lotData[signName]) {
        return lotData[signName][houseNumber.toString()] || "";
    }
    return "";
};

export const generateLotInterpretation = (
    lotKey: string,
    signName: string,
    houseNumber: number
): string => {
    console.warn("generateLotInterpretation called synchronously. Use useLotInterpretation hook.");
    return "";
};

export const generateReturnInterpretation = async (
    planetId: string,
    signId: number,
    house: number
): Promise<string> => {
    const signs = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
    const signName = signs[signId];

    const data = await loadReturnData(planetId);
    if (data && data[signName]) {
        let text = data[signName][house.toString()] || "Descripción detallada próximamente.";
        text = text.replace('{sign}', signName).replace('{house}', house.toString());
        return text;
    }
    return "Descripción detallada próximamente.";
};

export const getHarmonizationRemedyAsync = async (
    planetName: string,
    house: number,
    signName: string
): Promise<string> => {
    const malefics = await loadMaleficRemedies() as any;
    if (malefics && malefics[planetName]) {
        const planetData = malefics[planetName];
        if (planetData[house.toString()]) {
             return planetData[house.toString()][signName] || "Remedio no disponible.";
        }
    }

    const benefics = await loadBeneficHarmonization() as any;
    if (benefics && benefics[planetName]) {
        const planetData = benefics[planetName];
        if (planetData[house.toString()]) {
             return planetData[house.toString()][signName] || "Armonización no disponible.";
        }
    }
    return "";
};

// Deprecated
export const getHarmonizationRemedy = (
    planetName: string,
    house: number,
    signName: string
): string => {
    console.warn("getHarmonizationRemedy called synchronously. Use Async version.");
    return "Cargando...";
};


export const getBlogLinkAsync = async (
    planetName: string,
    signName: string
): Promise<string | undefined> => {
    const links = await loadBlogLinks() as any;
    if (links && links[planetName]) {
        return links[planetName][signName];
    }
    return undefined;
};

// Deprecated
export const getBlogLink = (
    planetName: string,
    signName: string
): string | undefined => {
    console.warn("getBlogLink called synchronously.");
    return undefined;
};

export const generateAscendantTransitInterpretation = async (
    planetId: string,
    signId: number
): Promise<string> => {
    const signs = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
    const signName = signs[signId];

    const data = await loadAscTransitData(planetId);
    if (data && data[signName]) {
        let text = data[signName]["1"] || "Descripción detallada próximamente.";
        text = text.replace('{sign}', signName);
        return text;
    }
    return "Descripción detallada próximamente.";
};
