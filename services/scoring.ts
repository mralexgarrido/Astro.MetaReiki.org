import { ChartData, PlanetId, PlanetPosition, ScoredPlanet, PositiveNegativeAnalysis, ConditionDetail, ZODIAC_SIGNS } from '../types';

// Helper to normalize degrees
const normalizeDegrees = (deg: number): number => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

// Calculate smallest difference between two angles (0-180)
const angleDiff = (a: number, b: number): number => {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;
  return diff;
};

// Get Traditional Ruler for a sign
const getTraditionalRuler = (signId: number): PlanetId => {
  // Aries (0): Mars
  // Taurus (1): Venus
  // Gemini (2): Mercury
  // Cancer (3): Moon
  // Leo (4): Sun
  // Virgo (5): Mercury
  // Libra (6): Venus
  // Scorpio (7): Mars
  // Sagittarius (8): Jupiter
  // Capricorn (9): Saturn
  // Aquarius (10): Saturn
  // Pisces (11): Jupiter
  const rulers = [
    PlanetId.Mars, PlanetId.Venus, PlanetId.Mercury, PlanetId.Moon, PlanetId.Sun, PlanetId.Mercury,
    PlanetId.Venus, PlanetId.Mars, PlanetId.Jupiter, PlanetId.Saturn, PlanetId.Saturn, PlanetId.Jupiter
  ];
  return rulers[signId];
};

const getPlanetById = (planets: PlanetPosition[], id: PlanetId): PlanetPosition | undefined => {
  return planets.find(p => p.id === id);
};

export const calculateConditionScore = (planet: PlanetPosition, chart: ChartData): ScoredPlanet => {
  const details: ConditionDetail[] = [];
  let score = 50; // Base Score
  let isAvertedToLight = false;

  // --- Helper: Check Aspect (Local Scope) ---
  const checkAspect = (other: PlanetPosition, type: 'Conjunction' | 'Opposition' | 'Trine' | 'Square' | 'SuperiorSquare'): boolean => {
    // 1. Check Whole Sign relation
    let signDist = (other.signId - planet.signId + 12) % 12;
    let isWholeSignMatch = false;

    if (type === 'Conjunction' && signDist === 0) isWholeSignMatch = true;
    if (type === 'Opposition' && signDist === 6) isWholeSignMatch = true;
    if (type === 'Trine' && (signDist === 4 || signDist === 8)) isWholeSignMatch = true;

    // Square: 3 or 9
    if (type === 'Square' && (signDist === 3 || signDist === 9)) isWholeSignMatch = true;

    // Superior Square (Overcoming): Malefic is in 10th sign FROM Candidate.
    if (type === 'SuperiorSquare' && signDist === 9) isWholeSignMatch = true;

    if (!isWholeSignMatch) return false;

    // 2. Check Degree Orb (<= 3)
    const orb = angleDiff(planet.longitude, other.longitude);
    return orb <= 3;
  };

  // --- Step 2G: Relationship to Domicile Lord (The Host) ---
  const signId = planet.signId;
  const rulerId = getTraditionalRuler(signId);
  const rulerPlanet = getPlanetById(chart.planets, rulerId);

  // Skip if planet is in its own domicile (already handled by Essential Dignity, ruler is itself)
  if (rulerPlanet && rulerId !== planet.id) {
    // Check Whole Sign Aspect from Ruler TO Planet
    // Distance from Ruler to Planet
    // Wait, aspect type is symmetric for Conj/Opp/Trine/Sextile.
    // Check sign distance
    const signDist = (planet.signId - rulerPlanet.signId + 12) % 12;

    // Conjunction (0) -> +5
    if (signDist === 0) {
      score += 5;
      details.push({ description: `El Anfitrión (${rulerPlanet.name}) está Presente`, score: 5, type: 'Positive' });
    }
    // Trine (4, 8) or Sextile (2, 10) -> +3
    else if (signDist === 4 || signDist === 8 || signDist === 2 || signDist === 10) {
      score += 3;
      details.push({ description: `Apoyo del Anfitrión (${rulerPlanet.name})`, score: 3, type: 'Positive' });
    }
    // Opposition (6) or Square (3, 9) -> +0 (Neutral)
    else if (signDist === 6 || signDist === 3 || signDist === 9) {
      // No score change
    }
    // Aversion (1, 5, 7, 11) -> -5
    else {
       score -= 5;
       details.push({ description: `Sin apoyo del Anfitrión (${rulerPlanet.name}) - Aversión`, score: -5, type: 'Negative' });
    }
  }


  // --- Step 2F: Relationship to Sect Light (Witnessing) ---
  // Identify Sect Light
  const isDay = chart.isDayChart;
  const lightId = isDay ? PlanetId.Sun : PlanetId.Moon;
  const light = getPlanetById(chart.planets, lightId);

  if (light) {
      // Calculate Whole Sign relation
      const signDist = (planet.signId - light.signId + 12) % 12;

      // Conjunction (0), Trine (4, 8), Sextile (2, 10) -> +10
      if (signDist === 0 || signDist === 4 || signDist === 8 || signDist === 2 || signDist === 10) {
          score += 10;
          details.push({ description: `Testigo de la Luz (${light.name}) - Fuerte Alianza`, score: 10, type: 'Positive' });
      }
      // Square (3, 9), Opposition (6) -> +5
      else if (signDist === 3 || signDist === 9 || signDist === 6) {
          score += 5;
          details.push({ description: `Testigo de la Luz (${light.name}) - Contacto Tenso`, score: 5, type: 'Positive' });
      }
      // Aversion (1, 5, 7, 11) -> -10 (Actually 2nd, 6th, 8th, 12th signs)
      else if (signDist === 1 || signDist === 5 || signDist === 7 || signDist === 11) {
          score -= 10;
          details.push({ description: `Aversión a la Luz (${light.name}) - Desconectado`, score: -10, type: 'Negative' });
          isAvertedToLight = true;
      }
  }

  // --- A. Essential Dignity ---
  // Domicile (+15)
  if (rulerId === planet.id) {
    score += 15;
    details.push({ description: 'Domicilio', score: 15, type: 'Positive' });
  }
  // Mutual Reception by Domicile (+5)
  else {
    // Check if the ruler of the current sign is in a sign ruled by the current planet
    if (rulerPlanet) {
      const rulerOfRulerId = getTraditionalRuler(rulerPlanet.signId);
      if (rulerOfRulerId === planet.id) {
        score += 5;
        details.push({ description: 'Recepción Mutua', score: 5, type: 'Positive' });
      }
    }
  }

  // Exaltation (+10) & Fall (-15)
  const exaltations: Record<string, number> = {
    [PlanetId.Sun]: 0, [PlanetId.Moon]: 1, [PlanetId.Mercury]: 5,
    [PlanetId.Venus]: 11, [PlanetId.Mars]: 9, [PlanetId.Jupiter]: 3, [PlanetId.Saturn]: 6
  };
  const falls: Record<string, number> = {
    [PlanetId.Sun]: 6, [PlanetId.Moon]: 7, [PlanetId.Mercury]: 11,
    [PlanetId.Venus]: 5, [PlanetId.Mars]: 3, [PlanetId.Jupiter]: 9, [PlanetId.Saturn]: 0
  };

  if (exaltations[planet.id] === signId) {
    score += 10;
    details.push({ description: 'Exaltación', score: 10, type: 'Positive' });
  }
  if (falls[planet.id] === signId) {
    score -= 15;
    details.push({ description: 'Caída', score: -15, type: 'Negative' });
  }

  // Detriment (-10) -> Opposite to Domicile
  const detriments: Record<string, number[]> = {
    [PlanetId.Sun]: [10], // Aq
    [PlanetId.Moon]: [9], // Cap
    [PlanetId.Mercury]: [8, 11], // Sag, Pis
    [PlanetId.Venus]: [0, 7], // Ari, Sco
    [PlanetId.Mars]: [1, 6], // Tau, Lib
    [PlanetId.Jupiter]: [2, 5], // Gem, Vir
    [PlanetId.Saturn]: [3, 4] // Can, Leo
  };
  if (detriments[planet.id]?.includes(signId)) {
    score -= 10;
    details.push({ description: 'Detrimento', score: -10, type: 'Negative' });
  }

  // Peregrine (-5)
  const hasDignity = (rulerId === planet.id) || (exaltations[planet.id] === signId) || details.some(d => d.description === 'Recepción Mutua');
  if (!hasDignity) {
    score -= 5;
    details.push({ description: 'Peregrino', score: -5, type: 'Negative' });
  }

  // --- B. Accidental Dignity (House) ---
  const house = planet.house;
  // Angular (1, 4, 7, 10): +10
  if ([1, 4, 7, 10].includes(house)) {
    score += 10;
    details.push({ description: 'Casa Angular', score: 10, type: 'Positive' });
  }
  // Succedent (2, 5, 8, 11): 0
  // Cadent (3, 6, 9, 12): -5
  else if ([3, 6, 9, 12].includes(house)) {
    if (house === 9) {
      score += 5;
      details.push({ description: 'Casa 9 (Gozo del Sol)', score: 5, type: 'Positive' });
    } else {
      score -= 5;
      details.push({ description: 'Casa Cadente', score: -5, type: 'Negative' });
    }
  }

  // --- C. Planetary Joys ---
  const joys: Record<string, number> = {
    [PlanetId.Mercury]: 1,
    [PlanetId.Moon]: 3,
    [PlanetId.Venus]: 5,
    [PlanetId.Mars]: 6,
    [PlanetId.Sun]: 9,
    [PlanetId.Jupiter]: 11,
    [PlanetId.Saturn]: 12
  };
  if (joys[planet.id] === house) {
    score += 10;
    details.push({ description: 'Gozo Planetario', score: 10, type: 'Positive' });
  }

  // --- D. Solar Phase ---
  const sun = getPlanetById(chart.planets, PlanetId.Sun);
  if (sun && planet.id !== PlanetId.Sun) {
    const dist = angleDiff(planet.longitude, sun.longitude);

    // Chariot Check: Is planet in its own Domicile or Exaltation?
    const isInChariot = (rulerId === planet.id) || (exaltations[planet.id] === signId);

    // Cazimi: < 0°17'
    const CAZIMI_LIMIT = 17/60;
    if (dist <= CAZIMI_LIMIT) {
      score += 15;
      details.push({ description: 'Cazimi', score: 15, type: 'Positive' });
    }
    // Combust: < 8° (if not Cazimi)
    else if (dist < 8) {
      if (isInChariot) {
         details.push({ description: 'Combusto (Protegido por Carroza)', score: 0, type: 'Positive' });
      } else {
         score -= 10;
         details.push({ description: 'Combusto', score: -10, type: 'Negative' });
      }
    }
    // Under the Beams: < 15° (if not Combust)
    else if (dist < 15) {
      if (isInChariot) {
         details.push({ description: 'Bajo los Rayos (Protegido por Carroza)', score: 0, type: 'Positive' });
      } else {
         score -= 5;
         details.push({ description: 'Bajo los Rayos', score: -5, type: 'Negative' });
      }
    }
  }

  // Retrograde (-10) - Only Mercury, Venus, Mars, Jupiter, Saturn
  if ([PlanetId.Mercury, PlanetId.Venus, PlanetId.Mars, PlanetId.Jupiter, PlanetId.Saturn].includes(planet.id)) {
    if (planet.isRetrograde) {
      score -= 10;
      details.push({ description: 'Retrógrado', score: -10, type: 'Negative' });
    }
  }

  // --- E. Bonification & Maltreatment (Aspects) ---
  const benefics = [PlanetId.Venus, PlanetId.Jupiter];
  const malefics = [PlanetId.Mars, PlanetId.Saturn];

  // Maltreatment (Malefics)
  malefics.forEach(maleficId => {
    if (maleficId === planet.id) return;
    const malefic = getPlanetById(chart.planets, maleficId);
    if (!malefic) return;

    if (checkAspect(malefic, 'SuperiorSquare')) {
      score -= 15;
      details.push({ description: `Dominado por ${malefic.name} (Cuadratura Superior)`, score: -15, type: 'Negative' });
    }
    else if (checkAspect(malefic, 'Opposition')) {
      score -= 10;
      details.push({ description: `Oposición de ${malefic.name}`, score: -10, type: 'Negative' });
    }
    else if (checkAspect(malefic, 'Conjunction')) {
      score -= 10;
      details.push({ description: `Conjunción con ${malefic.name}`, score: -10, type: 'Negative' });
    }
  });

  // Enclosure (Besiegement) -20
  const mars = getPlanetById(chart.planets, PlanetId.Mars);
  const saturn = getPlanetById(chart.planets, PlanetId.Saturn);
  if (mars && saturn && planet.id !== PlanetId.Mars && planet.id !== PlanetId.Saturn) {
    let isBesieged = false;
    const pSign = planet.signId;
    const mSign = mars.signId;
    const sSign = saturn.signId;
    const prevSign = (pSign - 1 + 12) % 12;
    const nextSign = (pSign + 1) % 12;
    const flanked1 = (mSign === prevSign && sSign === nextSign);
    const flanked2 = (sSign === prevSign && mSign === nextSign);
    if (flanked1 || flanked2) isBesieged = true;
    if (!isBesieged && pSign === mSign && pSign === sSign) {
       const pDeg = planet.longitude;
       const mDeg = mars.longitude;
       const sDeg = saturn.longitude;
       const minMal = Math.min(mDeg, sDeg);
       const maxMal = Math.max(mDeg, sDeg);
       if (pDeg > minMal && pDeg < maxMal) {
         isBesieged = true;
       }
    }
    if (isBesieged) {
      score -= 20;
      details.push({ description: 'Asedio (Encierro entre Maléficos)', score: -20, type: 'Negative' });
    }
  }

  // Bonification (Benefics)
  benefics.forEach(beneficId => {
    if (beneficId === planet.id) return;
    const benefic = getPlanetById(chart.planets, beneficId);
    if (!benefic) return;

    if (checkAspect(benefic, 'Conjunction')) {
      score += 10;
      details.push({ description: `Conjunción con ${benefic.name}`, score: 10, type: 'Positive' });
    }
    else if (checkAspect(benefic, 'Trine')) {
      score += 5;
      details.push({ description: `Trígono de ${benefic.name}`, score: 5, type: 'Positive' });
    }
    else if (checkAspect(benefic, 'SuperiorSquare')) {
      score += 8;
      details.push({ description: `Dominio de ${benefic.name} (Cuadratura Superior)`, score: 8, type: 'Positive' });
    }
  });

  // --- Special Exception for Mercury (Step 2G Special) ---
  // If planet is Venus or Jupiter, check if Conjunct Mercury.
  // Treat Mercury as a Benefic (+10).
  if (planet.id === PlanetId.Venus || planet.id === PlanetId.Jupiter) {
      const mercury = getPlanetById(chart.planets, PlanetId.Mercury);
      if (mercury) {
          // Check Conjunction with Orb <= 3
          // Re-use checkAspect logic locally or inline
          const orb = angleDiff(planet.longitude, mercury.longitude);
          const signDist = (mercury.signId - planet.signId + 12) % 12;

          if (signDist === 0 && orb <= 3) {
             score += 10;
             details.push({ description: `Bonificación por Mercurio (Actuando como Benéfico)`, score: 10, type: 'Positive' });
          }
      }
  }

  return {
    planetId: planet.id,
    planetName: planet.name,
    baseScore: 50,
    totalScore: score,
    conditionSummary: '',
    status: '',
    house: planet.house,
    signName: ZODIAC_SIGNS[planet.signId].name,
    isAvertedToLight,
    details
  };
};

export const analyzePositiveNegative = (chart: ChartData): PositiveNegativeAnalysis => {
  const isDay = chart.isDayChart;
  const sectLight = isDay ? PlanetId.Sun : PlanetId.Moon;

  const posId = isDay ? PlanetId.Jupiter : PlanetId.Venus;
  const negId = isDay ? PlanetId.Mars : PlanetId.Saturn;

  // Secondary planets
  const otherPosId = isDay ? PlanetId.Venus : PlanetId.Jupiter;
  const otherNegId = isDay ? PlanetId.Saturn : PlanetId.Mars;

  const posPlanet = getPlanetById(chart.planets, posId);
  const negPlanet = getPlanetById(chart.planets, negId);
  const otherPosPlanet = getPlanetById(chart.planets, otherPosId);
  const otherNegPlanet = getPlanetById(chart.planets, otherNegId);

  if (!posPlanet || !negPlanet || !otherPosPlanet || !otherNegPlanet) {
    throw new Error("Planets missing from chart data");
  }

  const posResult = calculateConditionScore(posPlanet, chart);
  const negResult = calculateConditionScore(negPlanet, chart);
  const otherPosResult = calculateConditionScore(otherPosPlanet, chart);
  const otherNegResult = calculateConditionScore(otherNegPlanet, chart);

  // Helper to assign status
  const assignStatus = (p: ScoredPlanet, isBenefic: boolean, isMain: boolean) => {
      if (isBenefic) {
          if (p.isAvertedToLight) {
              p.status = 'Desconectado / Oculto';
              p.conditionSummary = 'Aversión a la Luz';
              p.scoreDescription = `Aunque es ${isMain ? 'el benéfico de la secta' : 'un benéfico'}, ${p.planetName} está en "Aversión" a la Luz de la Secta. No puede "ver" al líder, dificultando su ayuda.`;
          } else if (p.totalScore < 40) {
              p.status = 'Impedido';
              p.conditionSummary = 'Debilitado';
              p.scoreDescription = `${p.planetName} enfrenta dificultades significativas. Su capacidad para brindar ayuda está restringida.`;
          } else {
              p.status = 'Potente';
              p.conditionSummary = p.totalScore > 60 ? 'Muy Dignificado' : 'Favorable';
              p.scoreDescription = p.totalScore > 60
                  ? `¡Excelente condición! ${p.planetName} está muy fuerte y capaz de manifestar sus mejores cualidades.`
                  : `${p.planetName} se encuentra en buena condición y funciona como una fuente estable de beneficios.`;
          }
      } else {
          // Malefic
           if (p.totalScore > 60) {
            p.status = 'Constructivo / Domesticado';
            p.conditionSummary = 'Dignificado';
            p.scoreDescription = `Aunque es un maléfico, ${p.planetName} tiene recursos excepcionales. Sus desafíos son constructivos y disciplinados.`;
          } else if (p.totalScore < 40) {
            p.status = 'Difícil';
            p.conditionSummary = 'Maltratado';
            p.scoreDescription = `${p.planetName} está debilitado o conflictivo. Es probable que sea una fuente de fricción o desafíos.`;
          } else {
            p.status = 'Moderado';
            p.conditionSummary = 'Promedio';
            p.scoreDescription = `${p.planetName} presenta un comportamiento estándar. Sus desafíos son manejables.`;
          }
      }
  };

  // Assign statuses
  assignStatus(posResult, true, true);
  // Re-override specifically for Main Positive to match original detail
  if (posResult.isAvertedToLight) {
    posResult.scoreDescription = `Aunque es el benéfico de la secta, ${posResult.planetName} está en "Aversión" a la Luz de la Secta (${sectLight}). No puede "ver" al líder del equipo, lo que hace que su ayuda sea difícil de acceder, oculta o desconectada de los propósitos vitales principales.`;
  }

  assignStatus(negResult, false, true);

  assignStatus(otherPosResult, true, false);
  otherPosResult.scoreDescription += " (Benéfico contrario a la secta).";

  assignStatus(otherNegResult, false, false);
  otherNegResult.scoreDescription += " (Maléfico de la secta).";

  // Check Alternate Benefic
  if (posResult.status === 'Impedido' || posResult.status === 'Desconectado / Oculto') {
      if ((!otherPosResult.isAvertedToLight && posResult.isAvertedToLight) || otherPosResult.totalScore > 60 || otherPosResult.totalScore > (posResult.totalScore + 20)) {
          posResult.alternateSuggestion = {
            planetName: otherPosResult.planetName,
            score: otherPosResult.totalScore,
            reason: `Dado que ${posResult.planetName} está ${posResult.status.toLowerCase()}, ${otherPosResult.planetName} podría actuar como una fuente de apoyo más confiable en esta carta.`
          };
      }
  }

  return {
    sect: isDay ? 'Diurna' : 'Nocturna',
    sectLight,
    mostPositive: posResult,
    mostNegative: negResult,
    otherBenefic: otherPosResult,
    otherMalefic: otherNegResult
  };
};