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
      // 2nd sign (index diff 1)
      // 6th sign (index diff 5)
      // 8th sign (index diff 7)
      // 12th sign (index diff 11)
      else if (signDist === 1 || signDist === 5 || signDist === 7 || signDist === 11) {
          score -= 10;
          details.push({ description: `Aversión a la Luz (${light.name}) - Desconectado`, score: -10, type: 'Negative' });
          isAvertedToLight = true;
      }
  }

  // --- A. Essential Dignity ---
  const signId = planet.signId;
  const rulerId = getTraditionalRuler(signId);

  // Domicile (+15)
  if (rulerId === planet.id) {
    score += 15;
    details.push({ description: 'Domicilio', score: 15, type: 'Positive' });
  }
  // Mutual Reception by Domicile (+5)
  else {
    // Check if the ruler of the current sign is in a sign ruled by the current planet
    const rulerPlanet = getPlanetById(chart.planets, rulerId);
    if (rulerPlanet) {
      const rulerOfRulerId = getTraditionalRuler(rulerPlanet.signId);
      if (rulerOfRulerId === planet.id) {
        score += 5;
        details.push({ description: 'Recepción Mutua', score: 5, type: 'Positive' });
      }
    }
  }

  // Exaltation (+10) & Fall (-15)
  // Sun: Exalt Aries(0), Fall Libra(6)
  // Moon: Exalt Taurus(1), Fall Scorpio(7)
  // Mercury: Exalt Virgo(5), Fall Pisces(11)
  // Venus: Exalt Pisces(11), Fall Virgo(5)
  // Mars: Exalt Cap(9), Fall Cancer(3)
  // Jupiter: Exalt Cancer(3), Fall Cap(9)
  // Saturn: Exalt Libra(6), Fall Aries(0)

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
  // If no other dignity (Domicile, Exaltation, Mutual Reception)
  const hasDignity = (rulerId === planet.id) || (exaltations[planet.id] === signId) || details.some(d => d.description === 'Recepción Mutua');
  // Note: Peregrine usually means NO essential dignity. It doesn't care about debility.
  // If it has detriment but no dignity, it is peregrine AND detriment? Some say yes, some say peregrine is lack of ANY dignity.
  // We will check if it has any positive dignity score added so far.
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
    // Exception: 9th House is Joy of Sun -> treat as +5?
    // Prompt: "If planet is in the 9th House, treat as +5" (The "Joy of the Sun" place - generalized rule or specific?)
    // Prompt text: "Cadent... EXCEPTION: If planet is in the 9th House, treat as +5"
    if (house === 9) {
      score += 5;
      details.push({ description: 'Casa 9 (Gozo del Sol)', score: 5, type: 'Positive' });
    } else {
      score -= 5;
      details.push({ description: 'Casa Cadente', score: -5, type: 'Negative' });
    }
  }

  // --- C. Planetary Joys ---
  // Mercury: 1, Moon: 3, Venus: 5, Mars: 6, Sun: 9, Jupiter: 11, Saturn: 12
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
  if (sun && planet.id !== PlanetId.Sun) { // Sun doesn't have solar phase relative to itself
    const dist = angleDiff(planet.longitude, sun.longitude);

    // Cazimi: < 0°17'
    if (dist < (17/60)) {
      score += 15;
      details.push({ description: 'Cazimi', score: 15, type: 'Positive' });
    }
    // Combust: < 8° (if not Cazimi)
    else if (dist < 8) {
      score -= 15;
      details.push({ description: 'Combusto', score: -15, type: 'Negative' });
    }
    // Under Beams: < 15° (if not Combust)
    else if (dist < 15) {
      score -= 5;
      details.push({ description: 'Bajo los Rayos', score: -5, type: 'Negative' });
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

  // Helper to check aspect
  // Whole Sign Aspect AND within 3 degrees
  // Whole Sign: difference in Sign ID (0-11)
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
    // If planet is Candidate. other is Malefic.
    // other is in 10th sign from planet.
    // (other.signId - planet.signId) == 9 (Wait. 1st is 0 distance? No. 1st is same. 2nd is +1. 10th is +9.)
    // Example: Aries(0). 10th is Capricorn(9). 9-0 = 9. Correct.
    if (type === 'SuperiorSquare' && signDist === 9) isWholeSignMatch = true;

    if (!isWholeSignMatch) return false;

    // 2. Check Degree Orb (<= 3)
    const orb = angleDiff(planet.longitude, other.longitude);
    return orb <= 3;
  };

  // Maltreatment (Malefics)
  malefics.forEach(maleficId => {
    if (maleficId === planet.id) return; // Don't check against self
    const malefic = getPlanetById(chart.planets, maleficId);
    if (!malefic) return;

    // 1. Overcoming (Superior Square) -15
    if (checkAspect(malefic, 'SuperiorSquare')) {
      score -= 15;
      details.push({ description: `Dominado por ${malefic.name} (Cuadratura Superior)`, score: -15, type: 'Negative' });
    }
    // 2. Opposition -10
    else if (checkAspect(malefic, 'Opposition')) {
      score -= 10;
      details.push({ description: `Oposición de ${malefic.name}`, score: -10, type: 'Negative' });
    }
    // 3. Conjunction -10
    else if (checkAspect(malefic, 'Conjunction')) {
      score -= 10;
      details.push({ description: `Conjunción con ${malefic.name}`, score: -10, type: 'Negative' });
    }
  });

  // Enclosure (Besiegement) -20
  // Candidate between Mars and Saturn (by Sign).
  // "Flanked by them in adjacent signs".
  // Means: Mars in Sign X-1, Cand in X, Saturn in X+1 (or vice versa).
  const mars = getPlanetById(chart.planets, PlanetId.Mars);
  const saturn = getPlanetById(chart.planets, PlanetId.Saturn);
  if (mars && saturn && planet.id !== PlanetId.Mars && planet.id !== PlanetId.Saturn) {
    const pSign = planet.signId;
    const mSign = mars.signId;
    const sSign = saturn.signId;

    const prevSign = (pSign - 1 + 12) % 12;
    const nextSign = (pSign + 1) % 12;

    const flanked1 = (mSign === prevSign && sSign === nextSign);
    const flanked2 = (sSign === prevSign && mSign === nextSign);

    if (flanked1 || flanked2) {
      score -= 20;
      details.push({ description: 'Asedio (Encierro entre Maléficos)', score: -20, type: 'Negative' });
    }
  }

  // Bonification (Benefics)
  benefics.forEach(beneficId => {
    if (beneficId === planet.id) return;
    const benefic = getPlanetById(chart.planets, beneficId);
    if (!benefic) return;

    // 1. Conjunction +10
    if (checkAspect(benefic, 'Conjunction')) {
      score += 10;
      details.push({ description: `Conjunción con ${benefic.name}`, score: 10, type: 'Positive' });
    }
    // 2. Trine +5
    else if (checkAspect(benefic, 'Trine')) {
      score += 5;
      details.push({ description: `Trígono de ${benefic.name}`, score: 5, type: 'Positive' });
    }
    // 3. Superior Square +8 (Benefic in 10th sign from Candidate)
    else if (checkAspect(benefic, 'SuperiorSquare')) {
      score += 8;
      details.push({ description: `Dominio de ${benefic.name} (Cuadratura Superior)`, score: 8, type: 'Positive' });
    }
  });

  return {
    planetId: planet.id,
    planetName: planet.name,
    baseScore: 50,
    totalScore: score,
    conditionSummary: '', // Will be set later
    status: '', // Will be set later
    isAvertedToLight,
    details
  };
};

export const analyzePositiveNegative = (chart: ChartData): PositiveNegativeAnalysis => {
  const isDay = chart.isDayChart;
  const sectLight = isDay ? PlanetId.Sun : PlanetId.Moon;

  // Candidates
  // Day: Jupiter (Pos), Mars (Neg)
  // Night: Venus (Pos), Saturn (Neg)

  const posId = isDay ? PlanetId.Jupiter : PlanetId.Venus;
  const negId = isDay ? PlanetId.Mars : PlanetId.Saturn;

  const posPlanet = getPlanetById(chart.planets, posId);
  const negPlanet = getPlanetById(chart.planets, negId);

  if (!posPlanet || !negPlanet) {
    throw new Error("Planets missing from chart data");
  }

  const posResult = calculateConditionScore(posPlanet, chart);
  const negResult = calculateConditionScore(negPlanet, chart);

  // Logic Rules for Output Summary

  // Positive Planet Logic
  if (posResult.isAvertedToLight) {
    posResult.status = 'Desconectado / Oculto';
    posResult.conditionSummary = 'Aversión a la Luz';
    posResult.scoreDescription = `Aunque es el benéfico de la secta, ${posResult.planetName} está en "Aversión" a la Luz de la Secta (${sectLight}). No puede "ver" al líder del equipo, lo que hace que su ayuda sea difícil de acceder, oculta o desconectada de los propósitos vitales principales.`;
  } else if (posResult.totalScore < 40) {
    posResult.status = 'Impedido';
    posResult.conditionSummary = 'Debilitado';
    posResult.scoreDescription = `Aunque es el benéfico de la secta, ${posResult.planetName} enfrenta dificultades significativas en esta carta. Su capacidad para brindar ayuda está restringida o condicionada.`;
  } else {
    posResult.status = 'Potente';
    posResult.conditionSummary = posResult.totalScore > 60 ? 'Muy Dignificado' : 'Favorable';
    posResult.scoreDescription = posResult.totalScore > 60
      ? `¡Excelente condición! ${posResult.planetName} está extremadamente fuerte y capaz de manifestar sus mejores cualidades sin obstáculos.`
      : `${posResult.planetName} se encuentra en buena condición y funciona como una fuente estable de beneficios y crecimiento.`;
  }

  // Check Alternate Benefic if Impeded OR Averted
  if (posResult.status === 'Impedido' || posResult.status === 'Desconectado / Oculto') {
      const altPosId = isDay ? PlanetId.Venus : PlanetId.Jupiter;
      const altPosPlanet = getPlanetById(chart.planets, altPosId);
      if (altPosPlanet) {
        const altResult = calculateConditionScore(altPosPlanet, chart);
        // Suggest if Alternate > 60 or Alternate > Primary + 20
        // Or simply if Alternate is NOT averted and Primary IS averted
        if ((!altResult.isAvertedToLight && posResult.isAvertedToLight) || altResult.totalScore > 60 || altResult.totalScore > (posResult.totalScore + 20)) {
          posResult.alternateSuggestion = {
            planetName: altResult.planetName,
            score: altResult.totalScore,
            reason: `Dado que ${posResult.planetName} está ${posResult.status.toLowerCase()}, ${altResult.planetName} podría actuar como una fuente de apoyo más confiable en esta carta.`
          };
        }
      }
  }

  // Negative Planet Logic
  if (negResult.totalScore > 60) {
    negResult.status = 'Constructivo / Domesticado';
    negResult.conditionSummary = 'Dignificado';
    negResult.scoreDescription = `Aunque es un maléfico, ${negResult.planetName} tiene recursos excepcionales. Esto sugiere que los desafíos que presenta son constructivos: impulsan la ambición, la disciplina y llevan al éxito a través del esfuerzo.`;
  } else if (negResult.totalScore < 40) {
    negResult.status = 'Difícil';
    negResult.conditionSummary = 'Maltratado';
    negResult.scoreDescription = `${negResult.planetName} está en una posición debilitada o conflictiva. Es probable que sea una fuente de fricción, retrasos o desafíos que requieren mucha paciencia para gestionar.`;
  } else {
    negResult.status = 'Moderado';
    negResult.conditionSummary = 'Promedio';
    negResult.scoreDescription = `${negResult.planetName} presenta un comportamiento estándar. Sus desafíos son manejables y dependen del contexto específico de los tránsitos y periodos.`;
  }

  return {
    sect: isDay ? 'Diurna' : 'Nocturna',
    sectLight,
    mostPositive: posResult,
    mostNegative: negResult
  };
};
