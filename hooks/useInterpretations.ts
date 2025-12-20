import { useState, useEffect } from 'react';
import {
  loadPlanetData,
  loadPointData,
  loadRulerData,
  loadProfectionData,
  loadLotData
} from '../services/loader';

interface InterpretationResult {
  text: string;
  loading: boolean;
}

export const usePlanetInterpretation = (
  planet: string,
  sign: string,
  house: number
): InterpretationResult => {
  const [text, setText] = useState<string>("Cargando interpretación...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      setLoading(true);
      try {
        let data;
        // Check if it's a point (Asc/MC) or a Planet
        if (planet === 'Ascendente' || planet === 'Medio Cielo') {
           data = await loadPointData(planet);
           if (mounted && data) {
               setText(data[sign] || `Interpretación no disponible para ${planet} en ${sign}.`);
           }
        } else {
           data = await loadPlanetData(planet);
           if (mounted && data) {
               if (data[sign]) {
                   setText(data[sign][house.toString()] || `Interpretación no disponible para ${planet} en ${sign} casa ${house}.`);
               } else {
                   setText(`Interpretación no disponible para ${planet} en ${sign}.`);
               }
           }
        }
      } catch (e) {
          if (mounted) setText("Error al cargar la interpretación.");
          console.error(e);
      } finally {
          if (mounted) setLoading(false);
      }
    };

    fetch();

    return () => { mounted = false; };
  }, [planet, sign, house]);

  return { text, loading };
};

export const useRulerInterpretation = (
    sourceHouse: number,
    targetHouse: number
): InterpretationResult => {
    const [text, setText] = useState<string>("Cargando...");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await loadRulerData(sourceHouse);
                if (mounted && data) {
                    setText(data[targetHouse.toString()] || "Interpretación no disponible.");
                }
            } catch (e) {
                if (mounted) setText("Error.");
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, [sourceHouse, targetHouse]);

    return { text, loading };
};

export const useProfectionInterpretation = (
    timeLord: string,
    houseNumber: number,
    signName: string,
    isDayChart: boolean
): InterpretationResult => {
    const [text, setText] = useState<string>("Cargando...");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await loadProfectionData(houseNumber);
                if (mounted && data) {
                    const sectSuffix = isDayChart ? 'Day' : 'Night';
                    const key = `${signName}_${sectSuffix}`;
                    setText(data[key] || `Interpretación no disponible.`);
                }
            } catch (e) {
                if (mounted) setText("Error.");
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, [houseNumber, signName, isDayChart]);

    return { text, loading };
};

export const useLotInterpretation = (
    lotKey: string,
    signName: string,
    houseNumber: number
): InterpretationResult => {
    const [text, setText] = useState<string>("Cargando...");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await loadLotData(lotKey);
                if (mounted && data) {
                    if (data[signName]) {
                        setText(data[signName][houseNumber.toString()] || "");
                    } else {
                        setText("");
                    }
                }
            } catch (e) {
                if (mounted) setText("Error.");
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, [lotKey, signName, houseNumber]);

    return { text, loading };
};
