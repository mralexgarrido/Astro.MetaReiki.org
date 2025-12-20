// services/loader.ts

// Dynamic Import Map for Planets
const planetMap: Record<string, () => Promise<any>> = {
  'Sol': () => import('./interpretations/data/sol.json'),
  'Luna': () => import('./interpretations/data/luna.json'),
  'Mercurio': () => import('./interpretations/data/mercurio.json'),
  'Venus': () => import('./interpretations/data/venus.json'),
  'Marte': () => import('./interpretations/data/marte.json'),
  'Júpiter': () => import('./interpretations/data/jupiter.json'),
  'Saturno': () => import('./interpretations/data/saturno.json'),
  'Urano': () => import('./interpretations/data/urano.json'),
  'Neptuno': () => import('./interpretations/data/neptuno.json'),
  'Plutón': () => import('./interpretations/data/pluton.json'),
  'Quirón': () => import('./interpretations/data/quiron.json'),
  'Nodo Norte': () => import('./interpretations/data/nodo_norte.json'),
  'Nodo Sur': () => import('./interpretations/data/nodo_sur.json'),
};

// Map for Points
const pointMap: Record<string, () => Promise<any>> = {
  'Ascendente': () => import('./interpretations/data/ascendente.json'),
  'Medio Cielo': () => import('./interpretations/data/medio_cielo.json'),
};

// Map for Rulers
const rulerMap: Record<number, () => Promise<any>> = {
  1: () => import('./interpretations/data/ruler_1.json'),
  2: () => import('./interpretations/data/ruler_2.json'),
  3: () => import('./interpretations/data/ruler_3.json'),
  4: () => import('./interpretations/data/ruler_4.json'),
  5: () => import('./interpretations/data/ruler_5.json'),
  6: () => import('./interpretations/data/ruler_6.json'),
  7: () => import('./interpretations/data/ruler_7.json'),
  8: () => import('./interpretations/data/ruler_8.json'),
  9: () => import('./interpretations/data/ruler_9.json'),
  10: () => import('./interpretations/data/ruler_10.json'),
  11: () => import('./interpretations/data/ruler_11.json'),
  12: () => import('./interpretations/data/ruler_12.json'),
};

// Map for Lots
const lotMap: Record<string, () => Promise<any>> = {
    'fortune': () => import('./interpretations/data/fortune.json'),
    'spirit': () => import('./interpretations/data/spirit.json'),
    'eros': () => import('./interpretations/data/eros.json'),
    'necessity': () => import('./interpretations/data/necessity.json'),
    'courage': () => import('./interpretations/data/courage.json'),
    'victory': () => import('./interpretations/data/victory.json'),
    'nemesis': () => import('./interpretations/data/nemesis.json')
};

// Map for Profections
const profectionMap: Record<number, () => Promise<any>> = {
    1: () => import('./interpretations/data/profections/profection_house_1.json'),
    2: () => import('./interpretations/data/profections/profection_house_2.json'),
    3: () => import('./interpretations/data/profections/profection_house_3.json'),
    4: () => import('./interpretations/data/profections/profection_house_4.json'),
    5: () => import('./interpretations/data/profections/profection_house_5.json'),
    6: () => import('./interpretations/data/profections/profection_house_6.json'),
    7: () => import('./interpretations/data/profections/profection_house_7.json'),
    8: () => import('./interpretations/data/profections/profection_house_8.json'),
    9: () => import('./interpretations/data/profections/profection_house_9.json'),
    10: () => import('./interpretations/data/profections/profection_house_10.json'),
    11: () => import('./interpretations/data/profections/profection_house_11.json'),
    12: () => import('./interpretations/data/profections/profection_house_12.json'),
};

// Map for Returns
const returnMap: Record<string, () => Promise<any>> = {
    'Júpiter': () => import('./interpretations/data/returns/jupiter.json'),
    'Saturno': () => import('./interpretations/data/returns/saturn.json'),
    'Urano': () => import('./interpretations/data/returns/uranus.json'),
    'Nodo Norte': () => import('./interpretations/data/returns/nodes.json'),
};

// Map for Ascendant Transits
const ascTransitMap: Record<string, () => Promise<any>> = {
    'Júpiter': () => import('./interpretations/data/transits/ascendant/jupiter.json'),
    'Saturno': () => import('./interpretations/data/transits/ascendant/saturn.json'),
    'Urano': () => import('./interpretations/data/transits/ascendant/uranus.json'),
    'Neptuno': () => import('./interpretations/data/transits/ascendant/neptune.json'),
    'Plutón': () => import('./interpretations/data/transits/ascendant/pluto.json'),
};

// Generic Loader Helper
// The 'default' export of a JSON module is the JSON object itself
const loadData = async (loader: (() => Promise<any>) | undefined) => {
    if (!loader) return null;
    const module = await loader();
    return module.default || module;
};

// Exported Loaders
export const loadPlanetData = (planet: string) => loadData(planetMap[planet]);
export const loadPointData = (point: string) => loadData(pointMap[point]);
export const loadRulerData = (house: number) => loadData(rulerMap[house]);
export const loadLotData = (lot: string) => loadData(lotMap[lot]);
export const loadProfectionData = (house: number) => loadData(profectionMap[house]);
export const loadReturnData = (planet: string) => loadData(returnMap[planet]);
export const loadAscTransitData = (planet: string) => loadData(ascTransitMap[planet]);

// Helper for Remedios
// These are single files, but fairly large.
export const loadMaleficRemedies = async () => {
    const mod = await import('./interpretations/data/malefico-remedios.json');
    return mod.default || mod;
};

export const loadBeneficHarmonization = async () => {
    const mod = await import('./interpretations/data/benefico-armonizacion.json');
    return mod.default || mod;
};

// Blog Links are small enough to keep? Maybe load them too.
export const loadBlogLinks = async () => {
    const mod = await import('./interpretations/data/blog_links.json');
    return mod.default || mod;
};
