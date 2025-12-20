import { useState, useEffect, useRef } from 'react';
import { BirthData, TransitEvent } from '../types';

interface UseTransitsResult {
    events: TransitEvent[];
    loading: boolean;
    error: string | null;
}

export const useTransits = (birthData: BirthData): UseTransitsResult => {
    const [events, setEvents] = useState<TransitEvent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setEvents([]);

        // Create Worker
        // Note: Vite handles the worker import syntax
        const worker = new Worker(new URL('../workers/transit.worker.ts', import.meta.url), {
            type: 'module'
        });
        workerRef.current = worker;

        worker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'SUCCESS') {
                setEvents(payload);
                setLoading(false);
            } else if (type === 'ERROR') {
                setError(payload);
                setLoading(false);
            }
        };

        worker.onerror = (e) => {
            console.error("Worker Global Error:", e);
            setError("Error en el cálculo de tránsitos.");
            setLoading(false);
        };

        // Send Data
        worker.postMessage({ birthData });

        return () => {
            worker.terminate();
        };
    }, [birthData]);

    return { events, loading, error };
};
