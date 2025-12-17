export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  timezone: string;
}

export interface BirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: LocationData;
}

export enum PlanetId {
  Sun = 'Sol',
  Moon = 'Luna',
  Mercury = 'Mercurio',
  Venus = 'Venus',
  Mars = 'Marte',
  Jupiter = 'Júpiter',
  Saturn = 'Saturno',
  Uranus = 'Urano',
  Neptune = 'Neptuno',
  Pluto = 'Plutón',
  Chiron = 'Quirón',
  NorthNode = 'Nodo Norte',
  SouthNode = 'Nodo Sur',
  Ascendant = 'Ascendente',
  Midheaven = 'Medio Cielo'
}

export interface PlanetPosition {
  id: PlanetId;
  name: string;
  longitude: number; // 0-360
  speed: number;
  isRetrograde: boolean;
  signId: number; // 0-11 (Aries=0)
  house: number; // 1-12
  symbol: string;
  dignity?: 'Domicilio' | 'Exaltación' | 'Detrimento' | 'Caída';
}

export interface RulerInfo {
  name: string;
  type: 'Tradicional' | 'Moderno' | 'Único';
  house: number;
}

export interface HouseData {
  houseNumber: number;
  signId: number;
  signName: string;
  degreeStart: number;
  rulers: RulerInfo[];
  theme: string;
}

export interface ProfectionData {
  age: number;
  houseNumber: number;
  signId: number;
  ruler: string;
  timeLord: string;
  theme: string;
}

export interface HermeticLot {
  key: string;
  name: string;
  longitude: number;
  signId: number;
  house: number;
  symbol: string; // e.g., '⊗' for Fortune
  meaning: string;
}

export interface ChartData {
  name: string;
  birthDate: string; // ISO String or similar
  planets: PlanetPosition[];
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  houses: HouseData[]; 
  profection: ProfectionData;
  hermeticLots: HermeticLot[];
  zodiacOffset: number;
  isDayChart: boolean;
}

export interface TransitEvent {
  date: string; // ISO or 'Month YYYY'
  planetName: string; // e.g., 'Saturno'
  type: string; // e.g., 'Retorno de Saturno'
  signId: number;
  house: number;
  description?: string;
}

interface ZodiacSignDef {
  id: number;
  name: string;
  symbol: string;
  element: string;
  rulers: { name: string; type: 'Tradicional' | 'Moderno' | 'Único' }[];
}

export const ZODIAC_SIGNS: ZodiacSignDef[] = [
  { id: 0, name: 'Aries', symbol: '♈', element: 'Fuego', rulers: [{ name: 'Marte', type: 'Único' }] },
  { id: 1, name: 'Tauro', symbol: '♉', element: 'Tierra', rulers: [{ name: 'Venus', type: 'Único' }] },
  { id: 2, name: 'Géminis', symbol: '♊', element: 'Aire', rulers: [{ name: 'Mercurio', type: 'Único' }] },
  { id: 3, name: 'Cáncer', symbol: '♋', element: 'Agua', rulers: [{ name: 'Luna', type: 'Único' }] },
  { id: 4, name: 'Leo', symbol: '♌', element: 'Fuego', rulers: [{ name: 'Sol', type: 'Único' }] },
  { id: 5, name: 'Virgo', symbol: '♍', element: 'Tierra', rulers: [{ name: 'Mercurio', type: 'Único' }] },
  { id: 6, name: 'Libra', symbol: '♎', element: 'Aire', rulers: [{ name: 'Venus', type: 'Único' }] },
  { id: 7, name: 'Escorpio', symbol: '♏', element: 'Agua', rulers: [{ name: 'Marte', type: 'Tradicional' }, { name: 'Plutón', type: 'Moderno' }] },
  { id: 8, name: 'Sagitario', symbol: '♐', element: 'Fuego', rulers: [{ name: 'Júpiter', type: 'Único' }] },
  { id: 9, name: 'Capricornio', symbol: '♑', element: 'Tierra', rulers: [{ name: 'Saturno', type: 'Único' }] },
  { id: 10, name: 'Acuario', symbol: '♒', element: 'Aire', rulers: [{ name: 'Saturno', type: 'Tradicional' }, { name: 'Urano', type: 'Moderno' }] },
  { id: 11, name: 'Piscis', symbol: '♓', element: 'Agua', rulers: [{ name: 'Júpiter', type: 'Tradicional' }, { name: 'Neptuno', type: 'Moderno' }] },
];

export interface ConditionDetail {
  description: string;
  score: number;
  type: 'Positive' | 'Negative';
}

export interface ScoredPlanet {
  planetId: PlanetId;
  planetName: string;
  baseScore: number;
  totalScore: number;
  conditionSummary: string;
  status: string; // 'Potente', 'Impedido', 'Desconectado', 'Difícil', 'Constructivo', 'Moderado'
  house?: number;
  isAvertedToLight: boolean;
  scoreDescription?: string;
  alternateSuggestion?: {
    planetName: string;
    score: number;
    reason: string;
  };
  details: ConditionDetail[];
}

export interface PositiveNegativeAnalysis {
  sect: string; // 'Diurna' | 'Nocturna'
  sectLight: string; // 'Sol' | 'Luna'
  mostPositive: ScoredPlanet;
  mostNegative: ScoredPlanet;
  otherBenefic: ScoredPlanet;
  otherMalefic: ScoredPlanet;
}