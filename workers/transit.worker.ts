
// Import logic
import { calculateKeyReturns } from '../services/astronomyService';
import { BirthData } from '../types';

// Web Worker setup
self.onmessage = async (e: MessageEvent) => {
    const { birthData } = e.data as { birthData: BirthData };

    try {
        const events = await calculateKeyReturns(birthData);
        self.postMessage({ type: 'SUCCESS', payload: events });
    } catch (error) {
        console.error("Worker Error:", error);
        self.postMessage({ type: 'ERROR', payload: String(error) });
    }
};
