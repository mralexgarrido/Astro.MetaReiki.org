import React from 'react';
import { ProfectionData, ZODIAC_SIGNS } from '../types';
import { Hourglass, Crown, Sparkles } from 'lucide-react';

interface Props {
  data: ProfectionData;
}

export const ProfectionDisplay: React.FC<Props> = ({ data }) => {
  const signName = ZODIAC_SIGNS[data.signId].name;
  const signSymbol = ZODIAC_SIGNS[data.signId].symbol;

  return (
    <div className="bg-gradient-to-r from-reiki-card to-reiki-dark border border-reiki-cyan/20 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,242,255,0.05)] relative overflow-hidden print:border-black print:bg-white print:text-black print:shadow-none">
      <div className="absolute top-0 right-0 p-4 opacity-10 print:hidden">
        <Hourglass className="w-32 h-32 text-reiki-cyan" />
      </div>
      
      <h3 className="text-reiki-cyan text-sm font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2 print:text-black">
         <Hourglass className="w-4 h-4" /> Profección Anual
      </h3>
      
      <div className="flex flex-col md:flex-row items-start justify-between relative z-10 gap-6">
        <div className="flex-1">
           <div className="text-5xl font-serif text-white mb-2 print:text-black drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
             {data.age} <span className="text-lg text-slate-400 font-sans print:text-gray-600">años</span>
           </div>
           <div className="text-2xl text-reiki-magenta font-serif mb-2 print:text-black">
             Año de la Casa {data.houseNumber}
           </div>
           
           <div className="flex items-start gap-2 text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 print:bg-gray-100 print:border-gray-200 print:text-black">
              <Sparkles className="w-5 h-5 text-reiki-cyan flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{data.theme}</p>
           </div>
        </div>
        
        <div className="text-right flex-shrink-0">
           <div className="flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-reiki-magenta/50 flex items-center justify-center text-4xl mb-2 text-reiki-magenta shadow-[0_0_15px_rgba(255,0,255,0.2)] print:border-black print:text-black print:bg-white print:shadow-none">
                {signSymbol}
             </div>
             <div className="font-bold text-white uppercase tracking-widest print:text-black">{signName}</div>
           </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-4 print:border-black">
         <div className="bg-reiki-cyan/10 p-3 rounded-full print:bg-gray-200 border border-reiki-cyan/20">
            <Crown className="w-6 h-6 text-reiki-cyan print:text-black" />
         </div>
         <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider print:text-gray-600">Señor del Tiempo</div>
            <div className="text-xl font-bold text-white print:text-black">{data.timeLord}</div>
         </div>
      </div>
    </div>
  );
};