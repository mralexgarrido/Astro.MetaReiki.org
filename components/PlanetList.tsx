import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';

interface Props {
  data: ChartData;
}

export const PlanetList: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-6 h-full print:border-gray-300 print:shadow-none print:bg-white">
      <h3 className="text-xl font-bold text-reiki-cyan mb-6 border-b border-slate-800 pb-2 uppercase tracking-widest print:text-black print:border-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-reiki-cyan"></span>
        Posiciones Planetarias
      </h3>
      <div className="flex flex-col gap-2">
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
            <div key={planet.id} className="grid grid-cols-12 items-center p-3 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-colors group border border-transparent hover:border-slate-700 print:bg-white print:border-gray-200">
              
              {/* Planet */}
              <div className="col-span-4 flex items-center gap-3">
                <span className="text-xl text-reiki-cyan font-serif w-6 text-center print:text-black">{planet.symbol}</span>
                <span className="font-bold text-slate-100 text-sm print:text-black">{planet.name}</span>
              </div>

              {/* Retrograde & Dignity */}
              <div className="col-span-3 flex flex-col items-center justify-center gap-1">
                 <div className="flex gap-1">
                    {planet.isRetrograde && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 print:border-red-500 print:text-red-700">Rx</span>
                    )}
                 </div>
                 {planet.dignity && (
                     <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${dignityColor} print:bg-white print:text-black print:border-black font-medium`}>
                         {planet.dignity}
                     </span>
                 )}
              </div>

              {/* Sign & Degree */}
              <div className="col-span-4 flex flex-col items-center justify-center">
                 <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded border border-slate-700 min-w-[100px] justify-center print:bg-gray-100 print:border-gray-300">
                     <span className="text-reiki-magenta print:text-black">{sign.symbol}</span>
                     <span className="text-slate-200 text-xs font-semibold print:text-black">{sign.name}</span>
                 </div>
                 <span className="text-slate-500 font-mono text-[10px] mt-1 print:text-gray-600">
                    {degree}° {minute}'
                 </span>
              </div>

              {/* House */}
              <div className="col-span-1 text-right text-slate-500 text-xs font-medium print:text-gray-800">
                 C{planet.house}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};