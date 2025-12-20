import React from 'react';
import { ChartData, PlanetId, ZODIAC_SIGNS } from '../types';
import { generateInterpretation, getBlogLink } from '../services/interpretations';
import { Sun, Moon, ArrowUpCircle, ExternalLink } from 'lucide-react';

interface Props {
  data: ChartData;
}

export const BigThreeReport: React.FC<Props> = ({ data }) => {
  const sun = data.planets.find(p => p.id === PlanetId.Sun);
  const moon = data.planets.find(p => p.id === PlanetId.Moon);
  const ascendant = data.ascendant;

  if (!sun || !moon || !ascendant) return null;

  const sunSign = ZODIAC_SIGNS[sun.signId];
  const moonSign = ZODIAC_SIGNS[moon.signId];
  const ascSign = ZODIAC_SIGNS[ascendant.signId];

  const items = [
    {
      title: 'ASCENDENTE',
      subtitle: 'Tu Máscara y Camino',
      icon: ArrowUpCircle,
      sign: ascSign.name,
      house: 1, // Ascendant is always 1st house cusp, but text is general
      text: generateInterpretation(PlanetId.Ascendant, ascSign.name, 1, '', 0),
      link: getBlogLink(PlanetId.Ascendant, ascSign.name),
      color: 'text-reiki-cyan',
      bg: 'bg-reiki-cyan/10',
      border: 'border-reiki-cyan/30'
    },
    {
      title: 'SOL',
      subtitle: 'Tu Esencia',
      icon: Sun,
      sign: sunSign.name,
      house: sun.house,
      text: generateInterpretation(PlanetId.Sun, sunSign.name, sun.house, '', 0),
      link: getBlogLink(PlanetId.Sun, sunSign.name),
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30'
    },
    {
      title: 'LUNA',
      subtitle: 'Tu Mundo Emocional',
      icon: Moon,
      sign: moonSign.name,
      house: moon.house,
      text: generateInterpretation(PlanetId.Moon, moonSign.name, moon.house, '', 0),
      link: getBlogLink(PlanetId.Moon, moonSign.name),
      color: 'text-slate-300',
      bg: 'bg-slate-300/10',
      border: 'border-slate-300/30'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in break-inside-avoid print:space-y-2">
       <div className="flex items-center gap-3 mb-4 print:hidden">
         <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-reiki-magenta">✦</span> Tus Tres Grandes
         </h3>
         <div className="h-px bg-slate-800 flex-grow"></div>
       </div>

       {/* Print Header for Big Three (Only visible when printing full report usually, but helpful here) */}
       <div className="hidden print:flex items-center gap-2 mb-2 border-b border-gray-300 pb-1">
           <span className="text-lg font-bold text-black uppercase tracking-wider">Tus Tres Grandes</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-3">
         {items.map((item) => (
           <div key={item.title} className={`relative overflow-hidden rounded-xl border ${item.border} bg-slate-900/40 backdrop-blur p-6 hover:bg-slate-900/60 transition-colors print:bg-white print:border-gray-300 print:text-black print:p-3 print:rounded-lg print:border-b`}>
              <div className="flex items-center justify-between mb-4 print:mb-2">
                <div className="flex items-center gap-3 print:gap-2">
                   <div className={`p-2 rounded-lg ${item.bg} ${item.color} print:bg-transparent print:text-black print:p-0`}>
                      <item.icon className="w-6 h-6 print:w-4 print:h-4" />
                   </div>
                   <div>
                      <h4 className={`font-bold ${item.color} print:text-black print:text-sm`}>{item.title}</h4>
                      <div className="text-xs text-slate-400 uppercase tracking-wider print:text-gray-600 print:text-[10px]">{item.subtitle}</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xl font-serif font-bold text-white print:text-black print:text-base">{item.sign}</div>
                   {item.title !== 'ASCENDENTE' && (
                       <div className="text-xs text-slate-500 font-mono print:text-gray-600 print:text-[10px]">Casa {item.house}</div>
                   )}
                </div>
              </div>

              <div className="text-sm text-slate-300 leading-relaxed text-justify print:text-black print:text-xs print:leading-snug">
                 {item.text}
              </div>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity ${item.color} print:hidden`}
                >
                  <span>Explorar Más</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
           </div>
         ))}
       </div>
    </div>
  );
};
