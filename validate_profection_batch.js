import fs from 'fs';
import path from 'path';

const expectedSigns = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'
];

const suffixes = ['_Day', '_Night'];
const expectedKeys = new Set();

expectedSigns.forEach(sign => {
  suffixes.forEach(suffix => {
    expectedKeys.add(sign + suffix);
  });
});

const houses = [2, 3, 4, 5, 6];
let hasError = false;

houses.forEach(houseNum => {
    const filename = `profection_house_${houseNum}.json`;
    const filePath = path.join(process.cwd(), 'services/interpretations/data/profections', filename);

    console.log(`Validating ${filename}...`);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File ${filename} does not exist.`);
            hasError = true;
            return;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);
        const actualKeys = new Set(Object.keys(json));

        const missingKeys = [...expectedKeys].filter(k => !actualKeys.has(k));
        const extraKeys = [...actualKeys].filter(k => !expectedKeys.has(k));

        if (missingKeys.length > 0) {
            console.error(`  Missing keys in ${filename}:`, missingKeys);
            hasError = true;
        }

        if (extraKeys.length > 0) {
            console.warn(`  Extra keys in ${filename} (warning):`, extraKeys);
        }

        if (missingKeys.length === 0) {
            console.log(`  PASSED: ${filename}`);
        }

    } catch (error) {
        console.error(`  Error reading or parsing ${filename}:`, error.message);
        hasError = true;
    }
});

if (hasError) {
    process.exit(1);
} else {
    console.log('All files validated successfully.');
}
