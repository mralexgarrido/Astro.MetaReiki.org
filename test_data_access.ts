import { generateInterpretation, generateProfectionInterpretation, getRulerInterpretation, HOUSE_THEMES } from './services/interpretations.ts';
import { getMedicalInfo } from './services/medicalAstrology.ts';

console.log("--- TEST START ---");

// Test 1: Planet Interpretation (Sol in Aries House 1)
console.log("\n1. Planet Interpretation (Sol, Aries, 1):");
console.log(generateInterpretation('Sol', 'Aries', 1, 'Marte', 1));

// Test 2: Point Interpretation (Ascendente in Tauro)
console.log("\n2. Point Interpretation (Ascendente, Tauro):");
console.log(generateInterpretation('Ascendente', 'Tauro', 1, 'Venus', 1));

// Test 3: Profection (House 1, Aries, Day)
console.log("\n3. Profection (House 1, Aries, Day):");
console.log(generateProfectionInterpretation('Marte', 1, 'Aries', true));

// Test 4: Ruler Interpretation (House 1 -> House 5)
console.log("\n4. Ruler Interpretation (1 -> 5):");
console.log(getRulerInterpretation(1, 5));

// Test 5: Medical Info (Aries - 0)
console.log("\n5. Medical Info (Aries):");
console.log(JSON.stringify(getMedicalInfo(0), null, 2));

// Test 6: Definitions
console.log("\n6. Definitions (House 1 Theme):");
console.log(HOUSE_THEMES[1]);

console.log("\n--- TEST END ---");
