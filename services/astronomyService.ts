import * as Astronomy from 'astronomy-engine';
import { BirthData, ChartData, PlanetId, PlanetPosition, ZODIAC_SIGNS, HouseData, ProfectionData, RulerInfo, HermeticLot, TransitEvent } from '../types';
import { HOUSE_THEMES } from './interpretations';
import { toDate } from 'date-fns-tz';
import { calculateChironPosition } from './swissephService';
import { generateReturnInterpretation, generateAscendantTransitInterpretation } from './interpretations';

// Helper to normalize degrees to 0-360
const normalizeDegrees = (deg: number): number => {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
};

const calculateSect = (ascendantDeg: number, sunDeg: number): boolean => {
  // A simple approximation for Day Chart: Sun is above the horizon (House 7-12).
  // In Whole Sign, if Sun is in House 7, 8, 9, 10, 11, 12 relative to Ascendant Sign.
  // More precisely: If Sun is between Ascendant and Descendant (going via MC).

  // Normalize everything so ASC is 0
  let sunRel = normalizeDegrees(sunDeg - ascendantDeg);

  // If Sun is in the upper hemisphere (180 to 360 degrees from ASC)
  // Wait, ASC is rising. MC is ~270 relative to ASC. DSC is 180.
  // So Sun is above horizon if it is between 180 (DSC) and 360/0 (ASC).
  // Yes, roughly 180-360 relative to ASC means it's setting or has set?
  // No. ASC is East. DSC is West.
  // Sun at 0 (ASC) is rising.
  // Sun at 90 (IC) is midnight (Night).
  // Sun at 180 (DSC) is setting.
  // Sun at 270 (MC) is noon (Day).
  // So Day is 180 -> 360 (or 0).

  return sunRel >= 180;
};

// Calculate Ascendant
const calculateAscendant = (date: Date, lat: number, lng: number): number => {
  const dateObj = new Astronomy.AstroTime(date);
  const gmst = Astronomy.SiderealTime(dateObj); 
  const lstHours = (gmst + lng / 15.0) % 24;
  const ramc = (lstHours * 15.0) * (Math.PI / 180.0); 
  
  const t = (dateObj.tt - 2451545.0) / 36525.0;
  const eps = (23.4392911 - (46.8150 * t + 0.00059 * t * t - 0.001813 * t * t * t) / 3600.0) * (Math.PI / 180.0);
  const latitudeRad = lat * (Math.PI / 180.0);

  const num = Math.cos(ramc);
  const den = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(latitudeRad) * Math.sin(eps));
  
  let ascRad = Math.atan2(num, den);
  let ascDeg = normalizeDegrees(ascRad * (180.0 / Math.PI));
  
  return ascDeg;
};

const calculateMidheaven = (date: Date, lng: number): number => {
  const dateObj = new Astronomy.AstroTime(date);
  const gmst = Astronomy.SiderealTime(dateObj);
  const lstHours = (gmst + lng / 15.0) % 24;
  const ramc = (lstHours * 15.0) * (Math.PI / 180.0); 
  
  const t = (dateObj.tt - 2451545.0) / 36525.0;
  const eps = (23.4392911 - (46.8150 * t) / 3600.0) * (Math.PI / 180.0);

  const mcRad = Math.atan2(Math.tan(ramc), Math.cos(eps));
  let mcDeg = normalizeDegrees(mcRad * (180.0 / Math.PI));

  const ramcDeg = normalizeDegrees(lstHours * 15.0);
  if (Math.abs(ramcDeg - mcDeg) > 90 && Math.abs(ramcDeg - mcDeg) < 270) {
      mcDeg = normalizeDegrees(mcDeg + 180);
  }

  return mcDeg;
}

const getSign = (longitude: number) => {
  return Math.floor(longitude / 30);
};

// Chiron calculation replaced by SwissEPH

// Calculate Osculating True Node from Moon's Position and Velocity vectors
const calculateNodesVector = (date: Date) => {
  // Use a small time delta to approximate the instantaneous velocity vector of the Moon relative to the Ecliptic
  // This derives the node from the actual geometry of the Moon's orbit in the current reference frame.
  
  const getMoonEclipticPos = (t: Astronomy.AstroTime) => {
    // GeoVector gives J2000 Equatorial
    const vec = Astronomy.GeoVector(Astronomy.Body.Moon, t, true);
    // Ecliptic gives us coordinates in the Ecliptic of Date (Tropical)
    return Astronomy.Ecliptic(vec);
  };

  const toCartesian = (ecl: {elon: number, elat: number}) => {
     const rad = Math.PI / 180;
     const lambda = ecl.elon * rad;
     const beta = ecl.elat * rad;
     // Unit sphere is sufficient for direction
     return {
        x: Math.cos(beta) * Math.cos(lambda),
        y: Math.cos(beta) * Math.sin(lambda),
        z: Math.sin(beta)
     };
  };

  const time0 = new Astronomy.AstroTime(date);
  // Calculate position 2 minutes later to establish orbital plane normal
  const time1 = time0.AddDays(2.0 / 1440.0); 

  const pos0 = toCartesian(getMoonEclipticPos(time0));
  const pos1 = toCartesian(getMoonEclipticPos(time1));

  // Orbital Plane Normal = Pos0 x Pos1 (Cross Product)
  const normal = {
     x: pos0.y * pos1.z - pos0.z * pos1.y,
     y: pos0.z * pos1.x - pos0.x * pos1.z,
     z: pos0.x * pos1.y - pos0.y * pos1.x
  };

  // The Ascending Node vector is the intersection of the Orbital Plane and the Ecliptic Plane (z=0).
  // NodeVector = (0,0,1) x Normal = (-Ny, Nx, 0)
  // This vector points towards the Ascending Node.
  const nodeX = -normal.y;
  const nodeY = normal.x;

  let nodeLongRad = Math.atan2(nodeY, nodeX);
  let nodeLongDeg = normalizeDegrees(nodeLongRad * 180 / Math.PI);

  const southNodeDeg = normalizeDegrees(nodeLongDeg + 180);

  return {
     north: { longitude: nodeLongDeg, speed: -0.05 }, // Average retrograde motion
     south: { longitude: southNodeDeg, speed: -0.05 }
  };
};

// Essential Dignities Table
const getDignity = (planetId: PlanetId, signId: number): 'Domicilio' | 'Exaltación' | 'Detrimento' | 'Caída' | undefined => {
  // Map sign ID to Name for readability
  // 0:Aries, 1:Taurus, 2:Gemini, 3:Cancer, 4:Leo, 5:Virgo, 6:Libra, 7:Scorpio, 8:Sag, 9:Cap, 10:Aq, 11:Pisces
  
  switch(planetId) {
    case PlanetId.Sun:
      if (signId === 4) return 'Domicilio'; // Leo
      if (signId === 0) return 'Exaltación'; // Aries
      if (signId === 10) return 'Detrimento'; // Aquarius
      if (signId === 6) return 'Caída'; // Libra
      break;
    case PlanetId.Moon:
      if (signId === 3) return 'Domicilio'; // Cancer
      if (signId === 1) return 'Exaltación'; // Taurus
      if (signId === 9) return 'Detrimento'; // Capricorn
      if (signId === 7) return 'Caída'; // Scorpio
      break;
    case PlanetId.Mercury:
      if (signId === 2 || signId === 5) return 'Domicilio'; // Gemini, Virgo
      if (signId === 5) return 'Exaltación'; // Virgo
      if (signId === 8 || signId === 11) return 'Detrimento'; // Sagittarius, Pisces
      if (signId === 11) return 'Caída'; // Pisces
      break;
    case PlanetId.Venus:
      if (signId === 1 || signId === 6) return 'Domicilio'; // Taurus, Libra
      if (signId === 11) return 'Exaltación'; // Pisces
      if (signId === 7 || signId === 0) return 'Detrimento'; // Scorpio, Aries
      if (signId === 5) return 'Caída'; // Virgo
      break;
    case PlanetId.Mars:
      if (signId === 0 || signId === 7) return 'Domicilio'; // Aries, Scorpio
      if (signId === 9) return 'Exaltación'; // Capricorn
      if (signId === 6 || signId === 1) return 'Detrimento'; // Libra, Taurus
      if (signId === 3) return 'Caída'; // Cancer
      break;
    case PlanetId.Jupiter:
      if (signId === 8 || signId === 11) return 'Domicilio'; // Sagittarius, Pisces
      if (signId === 3) return 'Exaltación'; // Cancer
      if (signId === 2 || signId === 5) return 'Detrimento'; // Gemini, Virgo
      if (signId === 9) return 'Caída'; // Capricorn
      break;
    case PlanetId.Saturn:
      if (signId === 9 || signId === 10) return 'Domicilio'; // Capricorn, Aquarius
      if (signId === 6) return 'Exaltación'; // Libra
      if (signId === 3 || signId === 4) return 'Detrimento'; // Cancer, Leo
      if (signId === 0) return 'Caída'; // Aries
      break;
      
    // Modern Planets Dignities (Common Assignments)
    case PlanetId.Uranus:
      if (signId === 10) return 'Domicilio'; // Aquarius
      if (signId === 7) return 'Exaltación'; // Scorpio
      if (signId === 4) return 'Detrimento'; // Leo
      if (signId === 1) return 'Caída'; // Taurus
      break;
    case PlanetId.Neptune:
      if (signId === 11) return 'Domicilio'; // Pisces
      // Exaltation debated (Cancer/Leo). Omitted to avoid confusion or stick to domicile.
      if (signId === 5) return 'Detrimento'; // Virgo
      break;
    case PlanetId.Pluto:
      if (signId === 7) return 'Domicilio'; // Scorpio
      // Exaltation debated (Aries/Pisces).
      if (signId === 1) return 'Detrimento'; // Taurus
      break;
      
    // Nodes
    case PlanetId.NorthNode:
      if (signId === 2) return 'Exaltación'; // Gemini (Traditional)
      if (signId === 8) return 'Caída'; // Sagittarius
      break;
    case PlanetId.SouthNode:
      if (signId === 8) return 'Exaltación'; // Sagittarius (Traditional)
      if (signId === 2) return 'Caída'; // Gemini
      break;
  }
  return undefined;
};

export const calculateProfectionByAge = (age: number, ascSignId: number): ProfectionData => {
  const housesAdvanced = age % 12;
  const houseNumber = housesAdvanced + 1;
  const signId = (ascSignId + housesAdvanced) % 12;
  
  const sign = ZODIAC_SIGNS[signId];
  const rulerName = sign.rulers.find(r => r.type === 'Tradicional' || r.type === 'Único')?.name || sign.rulers[0].name;

  return {
    age,
    houseNumber,
    signId,
    ruler: rulerName,
    timeLord: rulerName,
    theme: HOUSE_THEMES[houseNumber]
  };
};

const calculateProfection = (birthDate: Date, ascSignId: number): ProfectionData => {
  const now = new Date();

  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
      age--;
  }

  return calculateProfectionByAge(age, ascSignId);
};

const calculateHermeticLots = (
  isDayChart: boolean,
  ascendant: number,
  planets: PlanetPosition[],
  ascSign: number
): HermeticLot[] => {

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

  // Other Lots depend on Spirit and Fortune
  // 3. Eros
  // Day: Asc + Venus - Spirit | Night: Asc + Spirit - Venus
  const eros = isDayChart
      ? normalizeDegrees(ascendant + venus - spirit)
      : normalizeDegrees(ascendant + spirit - venus);

  // 4. Necessity (Necesidad)
  // Day: Asc + Fortune - Mercury | Night: Asc + Mercury - Fortune
  const necessity = isDayChart
      ? normalizeDegrees(ascendant + fortune - mercury)
      : normalizeDegrees(ascendant + mercury - fortune);

  // 5. Courage (Coraje/Atrevimiento)
  // Day: Asc + Fortune - Mars | Night: Asc + Mars - Fortune
  const courage = isDayChart
      ? normalizeDegrees(ascendant + fortune - mars)
      : normalizeDegrees(ascendant + mars - fortune);

  // 6. Victory (Victoria)
  // Day: Asc + Jupiter - Spirit | Night: Asc + Spirit - Jupiter
  const victory = isDayChart
      ? normalizeDegrees(ascendant + jupiter - spirit)
      : normalizeDegrees(ascendant + spirit - jupiter);

  // 7. Nemesis
  // Day: Asc + Fortune - Saturn | Night: Asc + Saturn - Fortune
  const nemesis = isDayChart
      ? normalizeDegrees(ascendant + fortune - saturn)
      : normalizeDegrees(ascendant + saturn - fortune);

  const createLot = (key: string, name: string, lon: number, symbol: string, defaultMeaning: string): HermeticLot => {
    const signId = getSign(lon);
    // Calculate Whole Sign House relative to Ascendant
    // Asc Sign is ascSign.
    // House = (LotSign - AscSign + 12) % 12 + 1
    const house = (signId - ascSign + 12) % 12 + 1;
    const signName = ZODIAC_SIGNS[signId].name;

    // Generate interpretation from data files
    const meaning = generateLotInterpretation(key, signName, house) || defaultMeaning;

    return { key, name, longitude: lon, signId, house, symbol, meaning };
  };

  return [
    createLot('fortune', 'Fortuna', fortune, '⊗', 'Salud, cuerpo, prosperidad y circunstancias materiales.'),
    createLot('spirit', 'Espíritu', spirit, '⊙', 'Voluntad, acción, carrera y lo que hacemos activamente.'),
    createLot('eros', 'Eros', eros, '♥', 'Deseos, apetitos, amor y relaciones sociales.'),
    createLot('necessity', 'Necesidad', necessity, '⚗', 'Limitaciones, obligaciones, luchas inevitables.'),
    createLot('courage', 'Coraje', courage, '⚔', 'Audacia, acción atrevida, y toma de riesgos.'),
    createLot('victory', 'Victoria', victory, '♛', 'Éxito, logros, y la superación de obstáculos.'),
    createLot('nemesis', 'Némesis', nemesis, '⚖', 'Causas de infortunio, obstáculos y enemigos ocultos.')
  ];
};

import { generateLotInterpretation } from './interpretations';

export const calculateChart = async (birthData: BirthData): Promise<ChartData> => {
  // Construct Date object considering timezone
  // Format YYYY-MM-DDTHH:mm:00
  const dateTimeStr = `${birthData.date}T${birthData.time}:00`;

  // Use date-fns-tz to parse the time in the given timezone to a proper Date object (UTC)
  // If timezone is present, use it. Otherwise assume local (or fallback to UTC if strictly desired, but usually Local is what users mean if TZ is unknown).
  // Note: OpenMeteo provides TZ. If it's missing, 'UTC' fallback in UI.
  let date: Date;
  if (birthData.location.timezone) {
      date = toDate(dateTimeStr, { timeZone: birthData.location.timezone });
  } else {
      date = new Date(dateTimeStr); // Fallback to system local or whatever was default
  }

  const lat = birthData.location.latitude;
  const lng = birthData.location.longitude;

  const ascLongitude = calculateAscendant(date, lat, lng);
  const mcLongitude = calculateMidheaven(date, lng);
  const ascSign = getSign(ascLongitude);
  
  const ascendant: PlanetPosition = {
    id: PlanetId.Ascendant,
    name: 'Ascendente',
    longitude: ascLongitude,
    speed: 0,
    isRetrograde: false,
    signId: ascSign,
    house: 1,
    symbol: 'ASC'
  };

  const midheaven: PlanetPosition = {
    id: PlanetId.Midheaven,
    name: 'Medio Cielo',
    longitude: mcLongitude,
    speed: 0,
    isRetrograde: false,
    signId: getSign(mcLongitude),
    house: normalizeDegrees(getSign(mcLongitude) - ascSign + 1 + 12) % 12 || 12,
    symbol: 'MC'
  };

  // Calculate Planets
  const celestialBodies = [
    { id: PlanetId.Sun, astroName: Astronomy.Body.Sun, name: 'Sol', symbol: '☉' },
    { id: PlanetId.Moon, astroName: Astronomy.Body.Moon, name: 'Luna', symbol: '☽' },
    { id: PlanetId.Mercury, astroName: Astronomy.Body.Mercury, name: 'Mercurio', symbol: '☿' },
    { id: PlanetId.Venus, astroName: Astronomy.Body.Venus, name: 'Venus', symbol: '♀' },
    { id: PlanetId.Mars, astroName: Astronomy.Body.Mars, name: 'Marte', symbol: '♂' },
    { id: PlanetId.Jupiter, astroName: Astronomy.Body.Jupiter, name: 'Júpiter', symbol: '♃' },
    { id: PlanetId.Saturn, astroName: Astronomy.Body.Saturn, name: 'Saturno', symbol: '♄' },
    { id: PlanetId.Uranus, astroName: Astronomy.Body.Uranus, name: 'Urano', symbol: '♅' },
    { id: PlanetId.Neptune, astroName: Astronomy.Body.Neptune, name: 'Neptuno', symbol: '♆' },
    { id: PlanetId.Pluto, astroName: Astronomy.Body.Pluto, name: 'Plutón', symbol: '♇' },
  ];

  const planets: PlanetPosition[] = celestialBodies.map(body => {
    const time = new Astronomy.AstroTime(date);
    const vector = Astronomy.GeoVector(body.astroName, time, true);
    const ecliptic = Astronomy.Ecliptic(vector);
    
    const longDeg = ecliptic.elon;
    const signId = getSign(longDeg);
    const house = (signId - ascSign + 12) % 12 + 1;
    
    // Retrograde Check
    const timeLater = time.AddDays(0.01);
    const vectorLater = Astronomy.GeoVector(body.astroName, timeLater, true);
    const eclipticLater = Astronomy.Ecliptic(vectorLater);
    let speed = eclipticLater.elon - ecliptic.elon; 
    if (speed < -350) speed += 360;
    
    // Calculate Dignity
    const dignity = getDignity(body.id, signId);

    return {
      id: body.id,
      name: body.name,
      longitude: longDeg,
      speed,
      isRetrograde: speed < 0,
      signId,
      house,
      symbol: body.symbol,
      dignity
    };
  });

  // Calculate Nodes (Osculating True Node)
  const nodes = calculateNodesVector(date);
  
  // North Node
  const nnSign = getSign(nodes.north.longitude);
  planets.push({
    id: PlanetId.NorthNode,
    name: 'Nodo Norte',
    longitude: nodes.north.longitude,
    speed: nodes.north.speed,
    isRetrograde: true, 
    signId: nnSign,
    house: (nnSign - ascSign + 12) % 12 + 1,
    symbol: '☊',
    dignity: getDignity(PlanetId.NorthNode, nnSign)
  });

  // South Node
  const snSign = getSign(nodes.south.longitude);
  planets.push({
    id: PlanetId.SouthNode,
    name: 'Nodo Sur',
    longitude: nodes.south.longitude,
    speed: nodes.south.speed,
    isRetrograde: true,
    signId: snSign,
    house: (snSign - ascSign + 12) % 12 + 1,
    symbol: '☋',
    dignity: getDignity(PlanetId.SouthNode, snSign)
  });

  // Calculate Chiron using Swiss Ephemeris
  try {
      const chironLon = await calculateChironPosition(date);
      // Determine retrograde by checking next hour? Or trust swisseph speed?
      // swe_calc_ut returns speed in index 3. But my helper returns only lon.
      // I'll update helper if I need speed.
      // For now, let's calculate next hour to be consistent with others if I don't change helper signature.
      // Or better, update helper.
      // I'll calculate next hour here for simplicity.
      const chironLonNext = await calculateChironPosition(new Date(date.getTime() + 3600000));

      let chironSpeed = chironLonNext - chironLon;
      if (chironSpeed < -300) chironSpeed += 360;
      if (chironSpeed > 300) chironSpeed -= 360;

      const chironSign = getSign(chironLon);
      planets.push({
        id: PlanetId.Chiron,
        name: 'Quirón',
        longitude: chironLon,
        speed: chironSpeed,
        isRetrograde: chironSpeed < 0,
        signId: chironSign,
        house: (chironSign - ascSign + 12) % 12 + 1,
        symbol: '⚷'
      });
  } catch (e) {
      console.error("Failed to calculate Chiron:", e);
      // Optional: Add fallback or skip Chiron
  }

  // Calculate Whole Sign House details
  const houses: HouseData[] = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIndex = (ascSign + i) % 12;
    const sign = ZODIAC_SIGNS[signIndex];
    
    // Find Ruler Position(s)
    const rulersInfo: RulerInfo[] = sign.rulers.map(rulerDef => {
        const planet = planets.find(p => p.name === rulerDef.name);
        return {
            name: rulerDef.name,
            type: rulerDef.type,
            house: planet ? planet.house : 0
        };
    });

    return {
      houseNumber: houseNum,
      signId: signIndex,
      signName: sign.name,
      degreeStart: signIndex * 30,
      rulers: rulersInfo,
      theme: HOUSE_THEMES[houseNum]
    };
  });

  const profection = calculateProfection(date, ascSign);
  const sun = planets.find(p => p.id === PlanetId.Sun);
  const isDayChart = sun ? calculateSect(ascLongitude, sun.longitude) : true;

  const hermeticLots = calculateHermeticLots(isDayChart, ascLongitude, planets, ascSign);

  return {
    name: birthData.name,
    birthDate: dateTimeStr, // Store the input date string
    planets,
    ascendant,
    midheaven,
    houses,
    profection,
    hermeticLots,
    zodiacOffset: ascSign * 30,
    isDayChart
  };
};

export const calculateKeyReturns = async (birthData: BirthData): Promise<TransitEvent[]> => {
  const events: TransitEvent[] = [];

  // Parse birth date (UTC)
  const dateTimeStr = `${birthData.date}T${birthData.time}:00`;
  let birthDate: Date;
  if (birthData.location.timezone) {
      birthDate = toDate(dateTimeStr, { timeZone: birthData.location.timezone });
  } else {
      birthDate = new Date(dateTimeStr);
  }

  // Helper to calculate longitude difference (-180 to 180)
  const getDiff = (target: number, current: number) => {
      let d = current - target;
      while (d <= -180) d += 360;
      while (d > 180) d -= 360;
      return d;
  };

  // Helper to get formatted date
  const formatMonthYear = (d: Date) => {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Calculate Natal Positions (J2000 or Date? Astronomy Engine uses J2000 usually, but Ecliptic gives Date)
  // We need to use consistent frame. Astronomy.GeoVector + Ecliptic gives Tropical of Date.
  // We will use that for both natal and transit to be consistent.

  const getNatalPos = (body: Astronomy.Body) => {
      const time = new Astronomy.AstroTime(birthDate);
      const vec = Astronomy.GeoVector(body, time, true);
      return Astronomy.Ecliptic(vec).elon;
  };

  const natalSaturn = getNatalPos(Astronomy.Body.Saturn);
  const natalJupiter = getNatalPos(Astronomy.Body.Jupiter);
  const natalUranus = getNatalPos(Astronomy.Body.Uranus);

  // Node is tricky, use the helper
  const nodes = calculateNodesVector(birthDate);
  const natalNode = nodes.north.longitude;

  // Calculate Natal Ascendant
  const natalAsc = calculateAscendant(birthDate, birthData.location.latitude, birthData.location.longitude);
  const natalAscSign = getSign(natalAsc);

  // Define Targets for calculation
  interface Tracker {
      name: string;
      id: PlanetId;
      body: Astronomy.Body | null;
      natalLong: number | null; // Null if no return calc
      checkReturn: boolean;
      checkAsc: boolean;
      prevDiffReturn: number;
      prevDiffAsc: number;
  }

  const trackers: Tracker[] = [
      { name: 'Saturno', id: PlanetId.Saturn, body: Astronomy.Body.Saturn, natalLong: natalSaturn, checkReturn: true, checkAsc: true, prevDiffReturn: 0, prevDiffAsc: 0 },
      { name: 'Júpiter', id: PlanetId.Jupiter, body: Astronomy.Body.Jupiter, natalLong: natalJupiter, checkReturn: true, checkAsc: true, prevDiffReturn: 0, prevDiffAsc: 0 },
      { name: 'Urano', id: PlanetId.Uranus, body: Astronomy.Body.Uranus, natalLong: natalUranus, checkReturn: true, checkAsc: true, prevDiffReturn: 0, prevDiffAsc: 0 },
      { name: 'Nodo Norte', id: PlanetId.NorthNode, body: null, natalLong: natalNode, checkReturn: true, checkAsc: false, prevDiffReturn: 0, prevDiffAsc: 0 },
      { name: 'Neptuno', id: PlanetId.Neptune, body: Astronomy.Body.Neptune, natalLong: null, checkReturn: false, checkAsc: true, prevDiffReturn: 0, prevDiffAsc: 0 },
      { name: 'Plutón', id: PlanetId.Pluto, body: Astronomy.Body.Pluto, natalLong: null, checkReturn: false, checkAsc: true, prevDiffReturn: 0, prevDiffAsc: 0 },
  ];

  // Scan 10 to 88 years (Skip first 10 years)
  const startDate = new Date(birthDate);
  startDate.setFullYear(startDate.getFullYear() + 10);
  const endDate = new Date(birthDate);
  endDate.setFullYear(endDate.getFullYear() + 88);

  let curr = new Date(startDate);
  // Initial previous diffs
  // We need to initialize prevDiffs at t=0 to avoid false positive at start
  const t0 = new Astronomy.AstroTime(curr);
  for (const t of trackers) {
      let transitLon = 0;
      if (t.body) {
          const vec = Astronomy.GeoVector(t.body, t0, true);
          transitLon = Astronomy.Ecliptic(vec).elon;
      } else {
          transitLon = calculateNodesVector(curr).north.longitude;
      }

      if (t.checkReturn && t.natalLong !== null) {
          t.prevDiffReturn = getDiff(t.natalLong, transitLon);
      }
      if (t.checkAsc) {
          t.prevDiffAsc = getDiff(natalAsc, transitLon);
      }
  }

  // Step 10 days
  curr.setDate(curr.getDate() + 10);

  // We accumulate raw events first to dedup if needed, but linear scan is usually fine.
  // We will store raw events then fetch interpretations.
  interface RawEvent {
      date: Date;
      tracker: Tracker;
      type: 'Return' | 'Asc';
  }
  const rawEvents: RawEvent[] = [];

  while (curr < endDate) {
      const time = new Astronomy.AstroTime(curr);

      for (const t of trackers) {
          let transitLon = 0;
          if (t.body) {
              const vec = Astronomy.GeoVector(t.body, time, true);
              transitLon = Astronomy.Ecliptic(vec).elon;
          } else {
              transitLon = calculateNodesVector(curr).north.longitude;
          }

          // Check Return
          if (t.checkReturn && t.natalLong !== null) {
              const diff = getDiff(t.natalLong, transitLon);
              if (Math.sign(t.prevDiffReturn) !== Math.sign(diff) && Math.abs(diff) < 20) {
                  // Crossing
                  rawEvents.push({ date: new Date(curr), tracker: t, type: 'Return' });
              }
              t.prevDiffReturn = diff;
          }

          // Check Ascendant
          if (t.checkAsc) {
              const diff = getDiff(natalAsc, transitLon);
              if (Math.sign(t.prevDiffAsc) !== Math.sign(diff) && Math.abs(diff) < 20) {
                   rawEvents.push({ date: new Date(curr), tracker: t, type: 'Asc' });
              }
              t.prevDiffAsc = diff;
          }
      }

      curr.setDate(curr.getDate() + 10);
  }

  // Filter close duplicates (Retrograde passes)
  // If same tracker and type happen within 1 year, we might want to keep all 3 or just 1.
  // User asked for "conjunction... exact conjunction".
  // "Key Transits" usually lists the first hit or all 3.
  // Let's keep all 3 but maybe clean up if they are identical dates (due to step size artifact? No, step is 10 days).
  // Actually, 10 days step might miss a fast crossing if it goes +1 to -1 without intermediate? No, diff sign check catches it.
  // But 10 days might be coarse for date accuracy.
  // We accept the approximation for "Month/Year".

  // Fetch Interpretations and build final events
  // We need to group events by Planet+Type to identify 3-pass sequences

  // Sort raw events first chronologically
  rawEvents.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Grouping
  const groups: Record<string, RawEvent[]> = {};
  for (const evt of rawEvents) {
      const key = `${evt.tracker.name}-${evt.type}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(evt);
  }

  // Process each group for sequences
  for (const key in groups) {
      const group = groups[key];
      // Split into clusters based on time gap (e.g., > 2 years gap means new sequence)
      const clusters: RawEvent[][] = [];
      let currentCluster: RawEvent[] = [];

      for (const evt of group) {
          if (currentCluster.length === 0) {
              currentCluster.push(evt);
          } else {
              const last = currentCluster[currentCluster.length - 1];
              const diffTime = Math.abs(evt.date.getTime() - last.date.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              // 2 years max gap for a transit sequence
              if (diffDays < 730) {
                  currentCluster.push(evt);
              } else {
                  clusters.push(currentCluster);
                  currentCluster = [evt];
              }
          }
      }
      if (currentCluster.length > 0) clusters.push(currentCluster);

      // Generate events for clusters
      for (const cluster of clusters) {
          for (let i = 0; i < cluster.length; i++) {
              const evt = cluster[i];
              let label = "";
              let description = "";
              let house = 0;
              let signId = 0;

              let suffixTitle = "";
              let suffixDesc = "";

              // Determine Suffix based on position in cluster
              if (cluster.length >= 3) {
                  // If exactly 3, logic is 1=Direct, 2=Retro, 3=Direct.
                  // If 5 (rare), usually D-R-D-R-D.
                  // We map based on index roughly or just label 1st, 2nd, Last.
                  if (i === 0) {
                       suffixTitle = " - Primer contacto";
                       suffixDesc = "\n\n(Primer contacto directo: Impacto inicial, el tema se presenta y se hace consciente.)";
                  } else if (i === cluster.length - 1) {
                       suffixTitle = " - Contacto final";
                       suffixDesc = "\n\n(Contacto final directo: Resolución e integración definitiva del tránsito.)";
                  } else {
                       // Middle contacts usually retrograde or second direct
                       // Simply label "Segundo contacto" or "Contacto retrógrado"
                       // Assumption: In a 3-pass, the middle is retrograde.
                       suffixTitle = " - Segundo contacto";
                       suffixDesc = "\n\n(Segundo contacto retrógrado: Fase de revisión e internalización profunda.)";
                  }
              }

              if (evt.type === 'Return') {
                  label = (evt.tracker.id === PlanetId.NorthNode) ? 'Retorno Nodal' : `Retorno de ${evt.tracker.name}`;
                  signId = getSign(evt.tracker.natalLong!);
                  house = (signId - natalAscSign + 12) % 12 + 1;
                  description = await generateReturnInterpretation(evt.tracker.id, signId, house);
              } else {
                  label = `${evt.tracker.name} conjunción Ascendente`;
                  signId = natalAscSign;
                  house = 1;
                  description = generateAscendantTransitInterpretation(evt.tracker.id, signId);
              }

              events.push({
                  date: formatMonthYear(evt.date),
                  planetName: evt.tracker.name,
                  type: label + suffixTitle,
                  signId,
                  house,
                  description: description + suffixDesc
              });
          }
      }
  }

  // Final Chronological Sort
  const monthMap: Record<string, number> = { "Ene":0, "Feb":1, "Mar":2, "Abr":3, "May":4, "Jun":5, "Jul":6, "Ago":7, "Sep":8, "Oct":9, "Nov":10, "Dic":11 };

  events.sort((a, b) => {
      const [ma, ya] = a.date.split(' ');
      const [mb, yb] = b.date.split(' ');
      if (parseInt(ya) !== parseInt(yb)) return parseInt(ya) - parseInt(yb);
      return monthMap[ma] - monthMap[mb];
  });

  return events;
};