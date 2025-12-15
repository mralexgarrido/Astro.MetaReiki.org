import * as Astronomy from 'astronomy-engine';
import { BirthData, ChartData, PlanetId, PlanetPosition, ZODIAC_SIGNS, HouseData, ProfectionData, RulerInfo, HermeticLot } from '../types';
import { HOUSE_THEMES } from './interpretations';
import { toDate } from 'date-fns-tz';
import { calculateChironPosition } from './swissephService';

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

  const createLot = (key: string, name: string, lon: number, symbol: string, meaning: string): HermeticLot => {
    const signId = getSign(lon);
    // Calculate Whole Sign House relative to Ascendant
    // Asc Sign is ascSign.
    // House = (LotSign - AscSign + 12) % 12 + 1
    const house = (signId - ascSign + 12) % 12 + 1;

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