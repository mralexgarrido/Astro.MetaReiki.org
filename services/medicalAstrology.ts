import medicalData from './interpretations/data/medical.json';

// Define the structure of the medical data for type safety
interface MedicalSignData {
  bodyPart: string;
  chakra: string;
  crystals: string[];
  affirmation: string;
  healthRisk: string;
}

export const MEDICAL_SIGNS: Record<number, MedicalSignData> = medicalData;

export const getMedicalInfo = (signIndex: number): MedicalSignData => {
    return MEDICAL_SIGNS[signIndex] || {
        bodyPart: "Información no disponible.",
        chakra: "Información no disponible.",
        crystals: [],
        affirmation: "Información no disponible.",
        healthRisk: "Información no disponible."
    };
};
