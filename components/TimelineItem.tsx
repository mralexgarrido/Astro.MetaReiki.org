import React from 'react';
import { useProfectionInterpretation } from '../hooks/useInterpretations';
import { ArrowRight, Loader2 } from 'lucide-react';

interface TimelineItemProps {
    item: {
        age: number;
        houseNumber: number;
        dateRange: string;
        signSymbol: string;
        signName: string;
        timeLord: string;
        theme: string;
        // interpretation: string; // Removed, we fetch it here
        signId: number;
    };
    isCurrent: boolean;
    isDayChart: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isCurrent, isDayChart }) => {
    // We need to fetch interpretation
    const { text, loading } = useProfectionInterpretation(
        item.timeLord,
        item.houseNumber,
        item.signName,
        isDayChart
    );

    return (
        <div
        className={`
            relative overflow-hidden rounded-xl border p-5 transition-all
            ${isCurrent
                ? 'bg-gradient-to-br from-reiki-card to-slate-900 border-reiki-cyan shadow-[0_0_15px_rgba(0,242,255,0.15)] ring-1 ring-reiki-cyan/30'
                : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
            }
            print:bg-white print:border-gray-300 print:break-inside-avoid
        `}
        >
            {/* Current Year Badge */}
            {isCurrent && (
                <div className="absolute top-0 right-0 bg-reiki-cyan text-slate-900 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider print:bg-black print:text-white">
                    Actual
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-serif ${isCurrent ? 'text-white' : 'text-slate-300'} print:text-black`}>
                        {item.age}
                    </span>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">años</span>
                </div>

                <div className={`px-2 py-1 rounded text-xs font-bold uppercase border ${isCurrent ? 'border-reiki-cyan/30 text-reiki-cyan bg-reiki-cyan/10' : 'border-slate-700 text-slate-400 bg-slate-800'} print:border-gray-400 print:text-black print:bg-gray-100`}>
                    Casa {item.houseNumber}
                </div>
                </div>

                {/* Date Range Badge */}
                <div className="self-start px-2 py-0.5 border border-red-500/50 bg-red-500/10 text-red-400 text-[10px] font-medium rounded uppercase tracking-wider print:border-red-600 print:text-red-600 print:bg-transparent">
                    {item.dateRange}
                </div>
            </div>

            {/* Sign & Planet */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dashed border-slate-700/50 print:border-gray-300">
                <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-slate-950 border border-slate-800 ${isCurrent ? 'text-reiki-magenta shadow-[0_0_10px_rgba(255,0,255,0.15)]' : 'text-slate-400'} print:bg-white print:text-black print:border-gray-300`}>
                    {item.signSymbol}
                </div>
                <div>
                    <div className={`font-bold ${isCurrent ? 'text-reiki-magenta' : 'text-slate-200'} print:text-black`}>
                        {item.signName}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 print:text-gray-600">
                        <ArrowRight className="w-3 h-3" />
                        <span className={isCurrent ? 'text-reiki-cyan' : ''}>{item.timeLord}</span>
                    </div>
                </div>
            </div>

            {/* Theme & Interpretation */}
            <div className="space-y-3">
                <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Temática</h4>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed print:text-black">
                        {item.theme}
                    </p>
                </div>

                <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Interpretación</h4>
                    <div className="text-xs text-slate-400 leading-relaxed print:text-gray-700 min-h-[40px]">
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>Cargando...</span>
                            </div>
                        ) : (
                            text
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};
