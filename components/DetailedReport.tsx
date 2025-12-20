import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';
import { HOUSE_DEFINITIONS, HOUSE_THEMES, SIGN_ADJECTIVES, PLANET_MEANINGS, getRulerInterpretation, generateInterpretation, getBlogLink } from '../services/interpretations';
import { BookOpen, Map as MapIcon, Crown, ExternalLink } from 'lucide-react';

interface Props {
  data: ChartData;
}

export const DetailedReport: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-8 mt-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0 print:mt-4">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4 print:border-black print:mb-4 print:pb-2">
        <BookOpen className="w-6 h-6 text-reiki-cyan print:text-black" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest print:text-black print:text-lg">Reporte Detallado de Casas</h2>
      </div>

      <div className="space-y-12 print:space-y-6">
        {data.houses.map((house) => {
          const sign = ZODIAC_SIGNS[house.signId];
          const planetsInHouse = data.planets.filter(p => p.house === house.houseNumber);
          
          return (
            <div key={house.houseNumber} className="break-inside-avoid print:mb-4">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4 print:gap-2 print:mb-2">
                 <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-reiki-magenta/50 text-reiki-magenta font-serif text-lg font-bold print:border-black print:bg-transparent print:text-black print:w-6 print:h-6 print:text-sm">
                    {house.houseNumber}
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2 print:text-base">
                        Casa {house.houseNumber}: <span className="text-reiki-cyan print:text-black">{sign.name}</span>
                    </h3>
                    <p className="text-sm text-slate-400 print:text-gray-600 italic print:text-xs">{HOUSE_DEFINITIONS[house.houseNumber]}</p>
                 </div>
              </div>

              <div className="ml-5 pl-10 border-l-2 border-slate-800 space-y-6 print:border-gray-300 print:ml-2 print:pl-4 print:space-y-3">
                  
                  {/* Governance */}
                  <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800/50 print:bg-transparent print:border-none print:p-0">
                     <p className="text-slate-300 text-sm leading-relaxed print:text-black print:text-xs">
                        <strong className="text-reiki-magenta print:text-black block mb-1 uppercase text-xs tracking-wider">Temas Principales</strong>
                        {house.theme}
                     </p>
                  </div>

                  {/* Planets in House */}
                  {planetsInHouse.length > 0 ? (
                      <div className="space-y-3 print:space-y-2">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest print:text-black flex items-center gap-2 print:mb-1">
                             <span className="w-1 h-1 bg-slate-500 rounded-full print:bg-black"></span> Planetas
                          </h4>
                          {planetsInHouse.map(planet => (
                              <div key={planet.id} className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-reiki-cyan print:bg-transparent print:border-l-2 print:border-gray-300 print:p-0 print:pl-2 print:rounded-none">
                                  <div className="flex items-center gap-2 mb-2 print:mb-0">
                                      <span className="text-reiki-cyan font-serif text-lg print:text-black print:text-sm">{planet.symbol}</span>
                                      <span className="font-bold text-white print:text-black print:text-sm">{planet.name} en {sign.name}</span>
                                      {planet.dignity === 'Domicilio' && (
                                        <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1 print:text-black print:fill-black print:w-3 print:h-3" />
                                      )}
                                  </div>
                                  <p className="text-sm text-slate-300 print:text-black leading-relaxed print:text-xs print:mt-1">
                                      {generateInterpretation(planet.name, sign.name, house.houseNumber, '', 0)}
                                  </p>
                                  {getBlogLink(planet.name, sign.name) && (
                                    <a
                                      href={getBlogLink(planet.name, sign.name)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors print:hidden"
                                    >
                                      <span>Explorar Más</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-sm text-slate-500 italic mt-2 print:text-gray-500 print:text-xs">Sin planetas.</div>
                  )}

                  {/* Rulers */}
                  <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 print:text-black flex items-center gap-2 print:mb-1">
                          <span className="w-1 h-1 bg-slate-500 rounded-full print:bg-black"></span> Regencia
                      </h4>
                      <div className="grid grid-cols-1 gap-3 print:gap-2">
                          {house.rulers.map((r, idx) => (
                              <div key={idx} className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-reiki-magenta print:bg-transparent print:border-l-2 print:border-gray-300 print:p-0 print:pl-2 print:rounded-none">
                                  <div className="flex items-center gap-2 mb-2 print:mb-0">
                                      <MapIcon className="w-4 h-4 text-reiki-magenta print:hidden" />
                                      <span className="text-reiki-magenta font-bold print:text-black print:text-xs">{r.name} ({r.type})</span>
                                      <span className="font-bold text-white print:text-black print:text-xs">está en la Casa {r.house}</span>
                                  </div>
                                  <p className="text-sm text-slate-300 print:text-black leading-relaxed print:text-xs print:mt-1">
                                      {getRulerInterpretation(house.houseNumber, r.house)}
                                  </p>
                              </div>
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