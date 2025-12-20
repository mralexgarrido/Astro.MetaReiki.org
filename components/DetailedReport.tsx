import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';
import { HOUSE_DEFINITIONS } from '../services/interpretations';
import { BookOpen } from 'lucide-react';
import { PlanetCard } from './PlanetCard';
import { RulerCard } from './RulerCard';

interface Props {
  data: ChartData;
}

export const DetailedReport: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-8 mt-8 print:bg-white print:text-black print:border-none print:shadow-none break-before-page">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4 print:border-black">
        <BookOpen className="w-6 h-6 text-reiki-cyan print:text-black" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest print:text-black">Reporte Detallado de Casas</h2>
      </div>

      <div className="space-y-12">
        {data.houses.map((house) => {
          const sign = ZODIAC_SIGNS[house.signId];
          const planetsInHouse = data.planets.filter(p => p.house === house.houseNumber);
          
          return (
            <div key={house.houseNumber} className="break-inside-avoid">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-reiki-magenta/50 text-reiki-magenta font-serif text-lg font-bold print:border-black print:bg-gray-100 print:text-black">
                    {house.houseNumber}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2">
                        Casa {house.houseNumber}: <span className="text-reiki-cyan">{sign.name}</span>
                    </h3>
                    <p className="text-sm text-slate-400 print:text-gray-600 italic">{HOUSE_DEFINITIONS[house.houseNumber]}</p>
                 </div>
              </div>

              <div className="ml-5 pl-10 border-l-2 border-slate-800 space-y-6 print:border-gray-300">
                  
                  {/* Governance */}
                  <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/50 print:bg-transparent print:border-none print:p-0">
                     <p className="text-slate-300 text-sm leading-relaxed print:text-black">
                        <strong className="text-reiki-magenta print:text-black block mb-1 uppercase text-xs tracking-wider">Temas Principales</strong>
                        {house.theme}
                     </p>
                  </div>

                  {/* Planets in House */}
                  {planetsInHouse.length > 0 ? (
                      <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest print:text-gray-700 flex items-center gap-2">
                             <span className="w-1 h-1 bg-slate-500 rounded-full"></span> Planetas en esta casa
                          </h4>
                          {planetsInHouse.map(planet => (
                              <PlanetCard
                                key={planet.id}
                                planet={planet}
                                signName={sign.name}
                                houseNumber={house.houseNumber}
                              />
                          ))}
                      </div>
                  ) : (
                      <div className="text-sm text-slate-500 italic mt-2 print:text-gray-500">No hay planetas en esta casa. La energía fluye principalmente a través de su regente.</div>
                  )}

                  {/* Rulers */}
                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 print:text-gray-700 flex items-center gap-2">
                          <span className="w-1 h-1 bg-slate-500 rounded-full"></span> Regencia
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                          {house.rulers.map((r, idx) => (
                              <RulerCard
                                key={idx}
                                ruler={r}
                                houseNumber={house.houseNumber}
                              />
                          ))}
                      </div>
                  </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
