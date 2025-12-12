import { GoogleGenAI } from "@google/genai";
import { ChartData, ZODIAC_SIGNS } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHoroscope = async (chart: ChartData): Promise<string> => {
  const model = "gemini-2.5-flash";

  // Construct a concise prompt
  const planetSummaries = chart.planets.map(p => 
    `${p.name}: ${ZODIAC_SIGNS[p.signId].name} (House ${p.house}) ${p.isRetrograde ? 'Retrograde' : ''}`
  ).join('\n');
  
  const ascInfo = `Ascendant: ${ZODIAC_SIGNS[chart.ascendant.signId].name}`;
  const mcInfo = `Midheaven: ${ZODIAC_SIGNS[chart.midheaven.signId].name}`;

  const prompt = `
    You are an expert Western Astrologer specializing in the Whole Sign House system.
    Please provide a modern, sleek, and insightful interpretation of the following Natal Chart data.
    Focus on the "Big Three" (Sun, Moon, Rising) first, then touch upon key planetary placements and house themes.
    Keep the tone empowering, mystical but grounded, and accessible.
    Format the output in clean Markdown.

    Chart Data:
    ${ascInfo}
    ${mcInfo}
    ${planetSummaries}

    Structure the response as:
    ## The Core Self (Big Three)
    ...
    ## Key Themes & Strengths
    ...
    ## Growth Areas (Challenges)
    ...
    ## Summary
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate horoscope at this time. Please check your connection or API key.";
  }
};