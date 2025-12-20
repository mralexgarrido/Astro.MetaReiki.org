import React from 'react';
import { ChartData, ZODIAC_SIGNS, RulerInfo } from '../types';

interface Props {
  data: ChartData;
}

const getOrdinalWord = (n: number) => {
    // Simplified Spanish ordinal logic for 1-12
    const words = [
        "Primera", "Segunda", "Tercera", "Cuarta", "Quinta", "Sexta", 
        "Séptima", "Octava", "Novena", "Décima", "Undécima", "Duodécima"
    ];
    return words[n - 1] || n + "ª";
}

export const HouseList: React.FC<Props> = ({ data }) => {
  
  const renderRulerDescription = (houseNumber: number, rulers: RulerInfo[]) => {
      const houseName = getOrdinalWord(houseNumber).toLowerCase();
      
      return rulers.map((r, idx) => {
          const rulerHouseName = getOrdinalWord(r.house).toLowerCase();
          const prefix = r.type === 'Único' 
            ? `Regente de la ${houseName} casa`
            : `Regente ${r.type.toLowerCase()} de la ${houseName} casa`;
            
          return (
              <span key={idx} className="block">
                  {prefix} en la casa {r.house}
              </span>
          );
      });
  };

  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-6 h-full print:border-gray-300 print:shadow-none print:bg-white print:p-2 print:border">
      <h3 className="text-xl font-bold text-reiki-magenta mb-6 border-b border-slate-800 pb-2 uppercase tracking-widest print:text-black print:border-gray-300 flex items-center gap-2 print:text-sm print:mb-2 print:pb-1">
        <span className="w-2 h-2 rounded-full bg-reiki-magenta print:bg-black print:w-1 print:h-1"></span>
        Casas de Signo Entero
      </h3>
      {/* Removed max-h and overflow-y to fix spacing issue */}
      <div className="space-y-3 pr-0 print:space-y-1">
        {data.houses.map((house) => {
          const sign = ZODIAC_SIGNS[house.signId];
          const isAscendant = house.houseNumber === 1;
          
          return (
            <div key={house.houseNumber} className={`flex flex-col py-3 px-4 rounded-xl border transition-all ${isAscendant ? 'bg-gradient-to-r from-reiki-magenta/10 to-transparent border-reiki-magenta/30 shadow-[0_0_10px_rgba(255,0,255,0.05)]' : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'} print:bg-white print:border-gray-200 print:py-1 print:px-2 print:rounded-none print:border-b`}>
              
              {/* Header: Number, Sign, ASC badge, Ruler Name */}
              <div className="flex items-center justify-between mb-3 print:mb-1">
                  <div className="flex items-center gap-4 print:gap-2">
                     <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shadow-lg ${isAscendant ? 'bg-reiki-magenta text-white' : 'bg-slate-700 text-slate-300'} print:border print:border-gray-400 print:bg-transparent print:text-black print:w-5 print:h-5 print:text-xs print:shadow-none`}>
                        {house.houseNumber}
                     </div>
                     <div className="flex items-center gap-3 print:gap-1">
                        <div className="flex items-center gap-2 text-lg print:gap-1">
                             <span className={`${isAscendant ? 'text-reiki-magenta' : 'text-slate-400'} print:text-black print:text-sm`}>{sign.symbol}</span>
                             <span className={`font-serif tracking-wide ${isAscendant ? 'text-white' : 'text-slate-200'} print:text-black print:text-xs`}>{sign.name.toUpperCase()}</span>
                        </div>
                        {isAscendant && <span className="text-[10px] bg-reiki-cyan text-black px-1.5 py-0.5 rounded font-bold tracking-wider print:border print:border-black print:bg-transparent print:px-1 print:py-0">ASC</span>}
                     </div>
                  </div>

                  <div className="text-right">
                     <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5 print:hidden">Regente</div>
                     <div className="flex flex-col items-end print:flex-row print:gap-2">
                         {house.rulers.map((r, i) => (
                             <span key={i} className={`text-sm font-medium ${isAscendant ? 'text-reiki-cyan' : 'text-reiki-cyan/80'} print:text-black print:text-[10px]`}>
                                 {r.name}
                             </span>
                         ))}
                     </div>
                  </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-400 pl-12 border-t border-dashed border-slate-700/50 pt-2 space-y-1 print:text-black print:border-none print:pt-0 print:pl-7 print:text-[10px] print:italic">
                 {renderRulerDescription(house.houseNumber, house.rulers)}
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
};