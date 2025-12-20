import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';

interface Props {
  data: ChartData;
}

export const PlanetList: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-6 h-full print:border-gray-300 print:shadow-none print:bg-white print:p-2 print:border">
      <h3 className="text-xl font-bold text-reiki-cyan mb-6 border-b border-slate-800 pb-2 uppercase tracking-widest print:text-black print:border-gray-300 flex items-center gap-2 print:text-sm print:mb-2 print:pb-1">
        <span className="w-2 h-2 rounded-full bg-reiki-cyan print:bg-black print:w-1 print:h-1"></span>
        Posiciones Planetarias
      </h3>
      <div className="flex flex-col gap-2 print:gap-1">
        {data.planets.map((planet) => {
          const sign = ZODIAC_SIGNS[planet.signId];
          const degree = Math.floor(planet.longitude % 30);
          const minute = Math.floor((planet.longitude % 1) * 60);
          
          let dignityColor = 'bg-slate-800 text-slate-400 border-slate-700';
          
          if (planet.dignity === 'Domicilio') {
              dignityColor = 'bg-reiki-cyan/10 text-reiki-cyan border-reiki-cyan/30';
          } else if (planet.dignity === 'Exaltación') {
              dignityColor = 'bg-reiki-magenta/10 text-reiki-magenta border-reiki-magenta/30';
          } else if (planet.dignity === 'Detrimento') {
              dignityColor = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
          } else if (planet.dignity === 'Caída') {
              dignityColor = 'bg-red-500/10 text-red-400 border-red-500/30';
          }

          return (
            <div key={planet.id} className="grid grid-cols-12 items-center p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-700 print:bg-white print:border-gray-200 print:p-1 print:border-b print:rounded-none">
              
              {/* Planet */}
              <div className="col-span-4 flex items-center gap-3 print:gap-1">
                <span className="text-xl text-reiki-cyan font-serif w-6 text-center print:text-black print:text-base">{planet.symbol}</span>
                <span className="font-bold text-slate-100 text-sm print:text-black print:text-xs">{planet.name}</span>
              </div>

              {/* Retrograde & Dignity */}
              <div className="col-span-3 flex flex-col items-center justify-center gap-1 print:flex-row print:gap-1">
                 <div className="flex gap-1">
                    {planet.isRetrograde && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 print:border-black print:text-black print:px-1 print:py-0">Rx</span>
                    )}
                 </div>
                 {planet.dignity && (
                     <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${dignityColor} print:bg-white print:text-black print:border-none print:font-normal print:px-0 print:py-0 print:italic`}>
                         {planet.dignity}
                     </span>
                 )}
              </div>

              {/* Sign & Degree */}
              <div className="col-span-4 flex flex-col items-center justify-center print:flex-row print:gap-2">
                 <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded border border-slate-700 min-w-[100px] justify-center print:bg-transparent print:border-none print:p-0 print:min-w-0">
                     <span className="text-reiki-magenta print:text-black">{sign.symbol}</span>
                     <span className="text-slate-200 text-xs font-semibold print:text-black">{sign.name}</span>
                 </div>
                 <span className="text-slate-500 font-mono text-[10px] mt-1 print:text-black print:mt-0">
                    {degree}° {minute}'
                 </span>
              </div>

              {/* House */}
              <div className="col-span-1 text-right text-slate-500 text-xs font-medium print:text-black">
                 C{planet.house}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};