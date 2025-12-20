import React from 'react';
import { HermeticLot } from '../types';
import { Sparkles } from 'lucide-react';

interface HermeticLotsReportProps {
  lots: HermeticLot[];
  zodiacSigns: { id: number; name: string }[];
}

export const HermeticLotsReport: React.FC<HermeticLotsReportProps> = ({ lots, zodiacSigns }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-reiki-cyan mb-2">Las 7 Partes Herméticas</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          En la astrología helenística, las Partes (o Lotes) son puntos matemáticos calculados a partir de las posiciones de los planetas y el Ascendente. Revelan temas específicos del destino y la fortuna oculta del nativo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:grid-cols-1">
        {lots.map((lot) => {
           const signName = zodiacSigns[lot.signId].name;
           const degree = Math.floor(lot.longitude % 30);
           const minute = Math.floor((lot.longitude % 1) * 60);

           return (
             <div key={lot.key} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-reiki-cyan/30 transition-all group">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl text-reiki-cyan border border-slate-700 group-hover:border-reiki-cyan group-hover:bg-reiki-cyan/10 transition-colors">
                      {lot.symbol}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{lot.name}</h3>
                      <div className="text-xs text-reiki-magenta font-mono">
                         {degree}° {minute}' {signName} • Casa {lot.house}
                      </div>
                    </div>
                 </div>
               </div>

               <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-3">
                 {lot.meaning}
               </p>
             </div>
           );
        })}
      </div>
    </div>
  );
};
