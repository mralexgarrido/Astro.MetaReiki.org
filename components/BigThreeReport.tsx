import React from 'react';
import { ChartData, PlanetId, ZODIAC_SIGNS } from '../types';
import { getBlogLinkAsync } from '../services/interpretations';
import { usePlanetInterpretation } from '../hooks/useInterpretations';
import { Sun, Moon, ArrowUpCircle, ExternalLink, Loader2 } from 'lucide-react';

interface Props {
  data: ChartData;
}

// Sub-component for individual cards to handle hooks cleanly
const BigThreeCard: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ElementType;
    planetId: string; // "Sol", "Luna", "Ascendente"
    signName: string;
    house: number;
    color: string;
    bg: string;
    border: string;
}> = ({ title, subtitle, icon: Icon, planetId, signName, house, color, bg, border }) => {

    const { text, loading } = usePlanetInterpretation(planetId, signName, house);
    // Blog link is async too but for now we can just load it or ignore loading state (it's less critical)
    const [link, setLink] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        getBlogLinkAsync(planetId, signName).then(setLink);
    }, [planetId, signName]);

    return (
        <div className={`relative overflow-hidden rounded-xl border ${border} bg-slate-900/40 backdrop-blur p-6 hover:bg-slate-900/60 transition-colors print:bg-white print:border-gray-300 print:text-black break-inside-avoid`}>
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg} ${color} print:bg-transparent print:text-black print:p-0`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className={`font-bold ${color} print:text-black`}>{title}</h4>
                    <div className="text-xs text-slate-400 uppercase tracking-wider print:text-gray-600">{subtitle}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-serif font-bold text-white print:text-black">{signName}</div>
                {title !== 'ASCENDENTE' && (
                    <div className="text-xs text-slate-500 font-mono print:text-gray-600">Casa {house}</div>
                )}
            </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed text-justify print:text-black min-h-[100px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-slate-500 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Cargando...</span>
                    </div>
                ) : (
                    text
                )}
            </div>

            {link && (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity ${color} print:hidden`}
            >
                <span>Explorar Más</span>
                <ExternalLink className="w-3 h-3" />
            </a>
            )}
        </div>
    );
};

export const BigThreeReport: React.FC<Props> = ({ data }) => {
  const sun = data.planets.find(p => p.id === PlanetId.Sun);
  const moon = data.planets.find(p => p.id === PlanetId.Moon);
  const ascendant = data.ascendant;

  if (!sun || !moon || !ascendant) return null;

  const sunSign = ZODIAC_SIGNS[sun.signId];
  const moonSign = ZODIAC_SIGNS[moon.signId];
  const ascSign = ZODIAC_SIGNS[ascendant.signId];

  return (
    <div className="space-y-6 animate-fade-in break-inside-avoid">
       <div className="flex items-center gap-3 mb-4 print:hidden">
         <h3 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-reiki-magenta">✦</span> Tus Tres Grandes
         </h3>
         <div className="h-px bg-slate-800 flex-grow"></div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <BigThreeCard
                title="ASCENDENTE"
                subtitle="Tu Máscara y Camino"
                icon={ArrowUpCircle}
                planetId={PlanetId.Ascendant} // 'Ascendente'
                signName={ascSign.name}
                house={1}
                color="text-reiki-cyan"
                bg="bg-reiki-cyan/10"
                border="border-reiki-cyan/30"
           />
           <BigThreeCard
                title="SOL"
                subtitle="Tu Esencia"
                icon={Sun}
                planetId={PlanetId.Sun} // 'Sol'
                signName={sunSign.name}
                house={sun.house}
                color="text-amber-400"
                bg="bg-amber-400/10"
                border="border-amber-400/30"
           />
           <BigThreeCard
                title="LUNA"
                subtitle="Tu Mundo Emocional"
                icon={Moon}
                planetId={PlanetId.Moon} // 'Luna'
                signName={moonSign.name}
                house={moon.house}
                color="text-slate-300"
                bg="bg-slate-300/10"
                border="border-slate-300/30"
           />
       </div>
    </div>
  );
};
