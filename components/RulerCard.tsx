import React from 'react';
import { Map as MapIcon, Loader2 } from 'lucide-react';
import { useRulerInterpretation } from '../hooks/useInterpretations';

interface RulerCardProps {
    ruler: {
        name: string;
        type: string;
        house: number;
    };
    houseNumber: number;
}

export const RulerCard: React.FC<RulerCardProps> = ({ ruler, houseNumber }) => {
    const { text, loading } = useRulerInterpretation(houseNumber, ruler.house);

    return (
        <div className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-reiki-magenta print:bg-gray-50 print:border-gray-200 break-inside-avoid">
            <div className="flex items-center gap-2 mb-2">
                <MapIcon className="w-4 h-4 text-reiki-magenta" />
                <span className="text-reiki-magenta font-bold print:text-black">{ruler.name} ({ruler.type})</span>
                <span className="font-bold text-white print:text-black">está en la Casa {ruler.house}</span>
            </div>
            <div className="text-sm text-slate-300 print:text-black leading-relaxed min-h-[40px]">
                 {loading ? (
                    <div className="flex items-center text-slate-500 gap-2">
                         <Loader2 className="w-3 h-3 animate-spin" />
                         <span className="text-xs">Cargando...</span>
                    </div>
                ) : (
                    text
                )}
            </div>
        </div>
    );
};
