import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';
import { calculateProfectionByAge } from '../services/astronomyService';
import { generateProfectionInterpretation } from '../services/interpretations';
import { Hourglass, ArrowRight } from 'lucide-react';

interface Props {
  data: ChartData;
}

export const ProfectionTimeline: React.FC<Props> = ({ data }) => {
  const currentAge = data.profection.age;
  // Calculate range: Current Age - 6 to Current Age + 6
  // Total 13 items
  const startAge = currentAge - 6;
  const endAge = currentAge + 6;

  const timelineItems = [];
  for (let age = startAge; age <= endAge; age++) {
     if (age < 0) continue; // Skip negative ages just in case

     // We need the Ascendant Sign ID to calculate.
     // data.ascendant.signId is reliable.
     const profection = calculateProfectionByAge(age, data.ascendant.signId);
     const sign = ZODIAC_SIGNS[profection.signId];

     timelineItems.push({
         ...profection,
         signName: sign.name,
         signSymbol: sign.symbol,
         interpretation: generateProfectionInterpretation(profection.timeLord, profection.houseNumber, sign.name)
     });
  }

  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-8 mt-8 print:bg-white print:text-black print:border-none print:shadow-none break-before-page">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4 print:border-black">
        <Hourglass className="w-6 h-6 text-reiki-cyan print:text-black" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest print:text-black">
            Pronóstico: Próximos 6 Años
        </h2>
      </div>

      <p className="text-slate-400 italic mb-6 print:text-gray-600">
          Un mapa de tus ciclos de tiempo pasados y futuros. La Profección Anual resalta una casa específica cada año, activando sus temas y trayendo al frente a su regente como el "Señor del Tiempo".
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineItems.map((item) => {
              const isCurrent = item.age === currentAge;

              return (
                  <div
                    key={item.age}
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
                      <div className="flex items-center justify-between mb-4">
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
                                  {item.theme.split(',')[0]}...
                              </p>
                          </div>

                          <div>
                              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Interpretación</h4>
                              <p className="text-xs text-slate-400 leading-relaxed print:text-gray-700">
                                  {item.interpretation}
                              </p>
                          </div>
                      </div>

                  </div>
              );
          })}
      </div>
    </div>
  );
};
