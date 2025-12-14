import React from 'react';
import { ChartData, PlanetId, ZODIAC_SIGNS } from '../types';
import { MEDICAL_SIGNS } from '../services/medicalAstrology';
import { Activity, Heart, Brain, Moon, ShieldCheck, Zap } from 'lucide-react';

interface ReikiReportProps {
  data: ChartData;
}

export const ReikiReport: React.FC<ReikiReportProps> = ({ data }) => {
  const getMedicalInfo = (signId: number) => MEDICAL_SIGNS[signId];

  const ascInfo = getMedicalInfo(data.ascendant.signId);

  const sun = data.planets.find(p => p.id === PlanetId.Sun);
  const sunInfo = sun ? getMedicalInfo(sun.signId) : null;

  const moon = data.planets.find(p => p.id === PlanetId.Moon);
  const moonInfo = moon ? getMedicalInfo(moon.signId) : null;

  // 6th House (Health & Illness)
  const house6 = data.houses.find(h => h.houseNumber === 6);
  const house6Info = house6 ? getMedicalInfo(house6.signId) : null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-serif text-reiki-cyan mb-2">Reporte de Salud y Reiki</h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Análisis basado en Astrología Médica y recomendaciones de sanación holística.
          <span className="block mt-2 text-xs text-reiki-magenta opacity-80 uppercase tracking-widest border-t border-slate-800 pt-2 inline-block">
             Descargo de responsabilidad: Esto no es consejo médico profesional.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {/* Section 1: Ascendant (Physical Body) */}
         <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-800/50 p-4 flex items-center gap-3 border-b border-slate-700">
               <Activity className="text-reiki-cyan w-5 h-5" />
               <h3 className="font-bold text-lg text-slate-200">El Cuerpo Físico (Ascendente en {ZODIAC_SIGNS[data.ascendant.signId].name})</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-2">Constitución y Puntos Débiles</h4>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                     El Ascendente rige la vitalidad general y la apariencia física. En {ZODIAC_SIGNS[data.ascendant.signId].name}, las zonas vulnerables son: <span className="text-reiki-magenta">{ascInfo.bodyPart}</span>
                  </p>
                  <div className="bg-red-900/20 border border-red-900/30 p-3 rounded-lg">
                     <p className="text-red-200/80 text-xs"><span className="font-bold text-red-400">Riesgos Comunes:</span> {ascInfo.healthRisk}</p>
                  </div>
               </div>
               <div className="space-y-4 border-l border-slate-800 pl-6 border-dashed">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-reiki-cyan mb-1">Chakra Principal</h4>
                    <p className="text-white font-medium">{ascInfo.chakra}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-purple-400 mb-1">Cristales de Sanación</h4>
                    <div className="flex flex-wrap gap-2">
                        {ascInfo.crystals.map(c => (
                            <span key={c} className="px-2 py-1 rounded bg-purple-900/30 border border-purple-500/30 text-purple-200 text-xs">{c}</span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-green-400 mb-1">Afirmación de Poder</h4>
                    <p className="text-green-100 italic text-sm">"{ascInfo.affirmation}"</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Section 2: Sun (Vitality) & Moon (Emotions) */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sun */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-slate-800/50 p-4 flex items-center gap-3 border-b border-slate-700">
                   <Zap className="text-yellow-400 w-5 h-5" />
                   <h3 className="font-bold text-lg text-slate-200">Energía Vital (Sol en {sun && ZODIAC_SIGNS[sun.signId].name})</h3>
                </div>
                <div className="p-6 flex-1">
                   {sunInfo && (
                       <>
                         <p className="text-slate-400 text-sm mb-4">
                            La fuente de tu prana (energía vital). Debes cuidar especialmente: <span className="text-slate-200">{sunInfo.bodyPart}</span>.
                         </p>
                         <div className="space-y-3">
                             <div className="flex items-start gap-2 text-sm">
                                <span className="text-reiki-cyan font-bold min-w-[70px]">Chakra:</span>
                                <span className="text-slate-300">{sunInfo.chakra}</span>
                             </div>
                             <div className="flex items-start gap-2 text-sm">
                                <span className="text-reiki-cyan font-bold min-w-[70px]">Cristales:</span>
                                <span className="text-slate-300">{sunInfo.crystals.join(", ")}</span>
                             </div>
                         </div>
                       </>
                   )}
                </div>
            </div>

            {/* Moon */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="bg-slate-800/50 p-4 flex items-center gap-3 border-b border-slate-700">
                   <Moon className="text-blue-300 w-5 h-5" />
                   <h3 className="font-bold text-lg text-slate-200">Cuerpo Emocional (Luna en {moon && ZODIAC_SIGNS[moon.signId].name})</h3>
                </div>
                <div className="p-6 flex-1">
                   {moonInfo && (
                       <>
                         <p className="text-slate-400 text-sm mb-4">
                            Cómo tus emociones afectan tu cuerpo físico (psicosomática). Zonas sensibles: <span className="text-slate-200">{moonInfo.bodyPart}</span>.
                         </p>
                         <div className="space-y-3">
                             <div className="flex items-start gap-2 text-sm">
                                <span className="text-reiki-cyan font-bold min-w-[70px]">Sanación:</span>
                                <span className="text-slate-300 italic">"{moonInfo.affirmation}"</span>
                             </div>
                             <div className="bg-blue-900/20 p-2 rounded border border-blue-900/30 mt-3">
                                <p className="text-xs text-blue-200">
                                   Recomendación: Usa {moonInfo.crystals[0]} para equilibrar tus estados emocionales.
                                </p>
                             </div>
                         </div>
                       </>
                   )}
                </div>
            </div>
         </div>

         {/* Section 3: 6th House (Health) */}
         <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
             <div className="bg-slate-800/50 p-4 flex items-center gap-3 border-b border-slate-700">
                 <ShieldCheck className="text-green-400 w-5 h-5" />
                 <h3 className="font-bold text-lg text-slate-200">Casa 6: Salud y Hábitos ({house6 && house6.signName})</h3>
             </div>
             <div className="p-6">
                {house6Info && (
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                           <p className="text-slate-300 text-sm mb-3">
                              La Casa 6 indica las enfermedades agudas y los desequilibrios causados por el estilo de vida. Con {house6?.signName} aquí, presta atención a:
                           </p>
                           <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-2">
                               <li>{house6Info.bodyPart}</li>
                               <li>Tendencia a: {house6Info.healthRisk}</li>
                           </ul>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl flex-1 w-full border border-slate-700">
                            <h4 className="text-reiki-cyan text-sm font-bold uppercase mb-2 text-center">Protocolo de Armonización</h4>
                            <div className="space-y-2 text-center">
                                <p className="text-slate-300 text-sm">Cristal Recomendado: <span className="text-white font-medium">{house6Info.crystals[0]}</span></p>
                                <p className="text-slate-300 text-sm">Foco Energético: <span className="text-white font-medium">{house6Info.chakra}</span></p>
                            </div>
                        </div>
                    </div>
                )}
             </div>
         </div>

      </div>
    </div>
  );
};
