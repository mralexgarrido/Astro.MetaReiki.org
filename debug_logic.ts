// services/astronomyService.ts - Temporary fix for tsx execution
// We need to check if we are in a node environment where import * as Astronomy works differently
// But easier: I will modify the file to support CommonJS fallback or just assume the browser env works.

// Actually, I can fix the debug script to MOCK the `astronomy-engine` if I just want to test the LOT LOGIC.
// But calculateChart calls calculateAscendant which calls Astronomy.
// I will create a DUPLICATE of calculateHermeticLots in the debug script and test IT directly.

import { PlanetId, PlanetPosition } from './types';

// Copied from astronomyService.ts
const normalizeDegrees = (deg: number): number => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

// Copied from astronomyService.ts
const calculateHermeticLots = (
  isDayChart: boolean,
  ascendant: number,
  planets: PlanetPosition[],
  ascSign: number
) => {

  const getPos = (id: PlanetId) => planets.find(p => p.id === id)?.longitude || 0;

  const sun = getPos(PlanetId.Sun);
  const moon = getPos(PlanetId.Moon);
  const mercury = getPos(PlanetId.Mercury);
  const venus = getPos(PlanetId.Venus);
  const mars = getPos(PlanetId.Mars);
  const jupiter = getPos(PlanetId.Jupiter);
  const saturn = getPos(PlanetId.Saturn);

  // Lot Formulas
  let fortune: number;
  let spirit: number;

  if (isDayChart) {
    // Day: Asc + Moon - Sun
    fortune = normalizeDegrees(ascendant + moon - sun);
    // Day: Asc + Sun - Moon
    spirit = normalizeDegrees(ascendant + sun - moon);
  } else {
    // Night: Asc + Sun - Moon
    fortune = normalizeDegrees(ascendant + sun - moon);
    // Night: Asc + Moon - Sun
    spirit = normalizeDegrees(ascendant + moon - sun);
  }

  return { fortune, spirit };
};

// Test Case 1: Day Chart
// Asc = 100. Sun = 90 (House 12, Day). Moon = 200.
// Fortune (Day) = Asc + Moon - Sun = 100 + 200 - 90 = 210.
// Spirit (Day) = Asc + Sun - Moon = 100 + 90 - 200 = -10 -> 350.

const dayPlanets = [
    { id: PlanetId.Sun, longitude: 90 },
    { id: PlanetId.Moon, longitude: 200 }
] as PlanetPosition[];

const dayRes = calculateHermeticLots(true, 100, dayPlanets, 0);
console.log("Day Test:");
console.log(`Fortune: ${dayRes.fortune} (Expected 210)`);
console.log(`Spirit: ${dayRes.spirit} (Expected 350)`);

// Test Case 2: Night Chart
// Asc = 100. Sun = 200 (House 4ish, Night). Moon = 300.
// Fortune (Night) = Asc + Sun - Moon = 100 + 200 - 300 = 0.
// Spirit (Night) = Asc + Moon - Sun = 100 + 300 - 200 = 200.

const nightPlanets = [
    { id: PlanetId.Sun, longitude: 200 },
    { id: PlanetId.Moon, longitude: 300 }
] as PlanetPosition[];

const nightRes = calculateHermeticLots(false, 100, nightPlanets, 0);
console.log("\nNight Test:");
console.log(`Fortune: ${nightRes.fortune} (Expected 0)`);
console.log(`Spirit: ${nightRes.spirit} (Expected 200)`);

if (dayRes.fortune === 210 && nightRes.fortune === 0) {
    console.log("\nSUCCESS: Logic is Correct.");
} else {
    console.log("\nFAILURE: Logic is Incorrect.");
}
