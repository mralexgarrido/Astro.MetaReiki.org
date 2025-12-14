
import { calculateChart } from './services/astronomyService';
import { BirthData, PlanetId } from './types';

// Mocking 4 AM (Night)
const nightData: BirthData = {
    name: "Night User",
    date: "1990-05-15",
    time: "04:00",
    location: {
        city: "Madrid, Spain",
        latitude: 40.4168,
        longitude: -3.7038
    }
};

try {
    const chart = calculateChart(nightData);

    console.log(`--- Night Chart Details (04:00) ---`);
    console.log(`Ascendant: ${chart.ascendant.longitude.toFixed(2)}`);
    const getPos = (id: PlanetId) => chart.planets.find(p => p.id === id)?.longitude || 0;
    const sun = getPos(PlanetId.Sun);
    const moon = getPos(PlanetId.Moon);

    console.log(`Sun: ${sun.toFixed(2)}`);
    console.log(`Moon: ${moon.toFixed(2)}`);
    console.log(`Is Day Chart: ${chart.isDayChart}`); // Should be FALSE

    const fortune = chart.hermeticLots.find(l => l.key === 'fortune');
    const spirit = chart.hermeticLots.find(l => l.key === 'spirit');

    console.log(`Fortune: ${fortune?.longitude.toFixed(2)}`);
    console.log(`Spirit: ${spirit?.longitude.toFixed(2)}`);

    // Verification
    // Night Fortune = Asc + Sun - Moon
    const expectedFortune = (chart.ascendant.longitude + sun - moon + 360) % 360;
    console.log(`Expected Fortune (Asc+Sun-Moon): ${expectedFortune.toFixed(2)}`);

    if (Math.abs(fortune!.longitude - expectedFortune) < 0.1) {
        console.log("PASS: Fortune uses Night Formula.");
    } else {
        console.log("FAIL: Fortune does NOT use Night Formula.");
    }

} catch (e) {
    console.error(e);
}
