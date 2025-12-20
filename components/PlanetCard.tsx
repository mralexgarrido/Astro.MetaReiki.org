import React from 'react';
import { Crown, ExternalLink, Loader2 } from 'lucide-react';
import { usePlanetInterpretation } from '../hooks/useInterpretations';
import { getBlogLinkAsync } from '../services/interpretations';

interface PlanetCardProps {
    planet: {
        id: string;
        name: string;
        symbol: string;
        dignity?: string;
    };
    signName: string;
    houseNumber: number;
}

export const PlanetCard: React.FC<PlanetCardProps> = ({ planet, signName, houseNumber }) => {
    const { text, loading } = usePlanetInterpretation(planet.name, signName, houseNumber);
    const [link, setLink] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        getBlogLinkAsync(planet.name, signName).then(setLink);
    }, [planet.name, signName]);

    return (
        <div className="bg-slate-800/60 p-4 rounded-lg border-l-4 border-reiki-cyan print:bg-gray-50 print:border-gray-200 break-inside-avoid">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-reiki-cyan font-serif text-lg print:text-black">{planet.symbol}</span>
                <span className="font-bold text-white print:text-black">{planet.name} en {signName}</span>
                {planet.dignity === 'Domicilio' && (
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500 ml-1" />
                )}
            </div>

            <div className="text-sm text-slate-300 print:text-black leading-relaxed min-h-[40px]">
                {loading ? (
                    <div className="flex items-center text-slate-500 gap-2">
                         <Loader2 className="w-3 h-3 animate-spin" />
                         <span className="text-xs">Cargando...</span>
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
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors print:hidden"
            >
                <span>Explorar Más</span>
                <ExternalLink className="w-3 h-3" />
            </a>
            )}
        </div>
    );
};
