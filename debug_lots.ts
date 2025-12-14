
import { calculateChart } from './services/astronomyService';
import { BirthData, PlanetId } from './types';

const testData: BirthData = {
    name: "Test User",
    date: "1990-05-15",
    time: "14:30",
    location: {
        city: "Madrid, Spain",
        latitude: 40.4168,
        longitude: -3.7038
    }
};

const chart = calculateChart(testData);

console.log(`--- Chart Details ---`);
console.log(`Ascendant: ${chart.ascendant.longitude.toFixed(2)} (Sign: ${chart.ascendant.signId})`);
const getPos = (id: PlanetId) => chart.planets.find(p => p.id === id)?.longitude || 0;

console.log(`Sun: ${getPos(PlanetId.Sun).toFixed(2)}`);
console.log(`Moon: ${getPos(PlanetId.Moon).toFixed(2)}`);
console.log(`Mercury: ${getPos(PlanetId.Mercury).toFixed(2)}`);
console.log(`Venus: ${getPos(PlanetId.Venus).toFixed(2)}`);
console.log(`Mars: ${getPos(PlanetId.Mars).toFixed(2)}`);
console.log(`Jupiter: ${getPos(PlanetId.Jupiter).toFixed(2)}`);
console.log(`Saturn: ${getPos(PlanetId.Saturn).toFixed(2)}`);

console.log(`\nIs Day Chart: ${chart.isDayChart}`);

console.log(`\n--- Calculated Lots ---`);
chart.hermeticLots.forEach(lot => {
    console.log(`${lot.name}: ${lot.longitude.toFixed(2)} (Sign: ${lot.signId}, House: ${lot.house})`);
});
