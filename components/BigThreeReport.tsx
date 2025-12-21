import React, { useState, useRef } from 'react';
import { ChartData, PlanetId, ZODIAC_SIGNS } from '../types';
import { generateInterpretation, getBlogLink } from '../services/interpretations';
import { Sun, Moon, ArrowUpCircle, ExternalLink, Share2, Loader2 } from 'lucide-react';
import { SocialShareCard, SocialShareCardProps } from './SocialShareCard';
import { toBlob } from 'html-to-image';

interface Props {
  data: ChartData;
}

export const BigThreeReport: React.FC<Props> = ({ data }) => {
  const sun = data.planets.find(p => p.id === PlanetId.Sun);
  const moon = data.planets.find(p => p.id === PlanetId.Moon);
  const ascendant = data.ascendant;

  const [sharingCard, setSharingCard] = useState<string | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [shareData, setShareData] = useState<SocialShareCardProps | null>(null);

  if (!sun || !moon || !ascendant) return null;

  const sunSign = ZODIAC_SIGNS[sun.signId];
  const moonSign = ZODIAC_SIGNS[moon.signId];
  const ascSign = ZODIAC_SIGNS[ascendant.signId];

  const items = [
    {
      id: 'ascendant',
      title: 'ASCENDENTE',
      subtitle: 'Tu Máscara y Camino',
      icon: ArrowUpCircle,
      sign: ascSign.name,
      house: 1, // Ascendant is always 1st house cusp, but text is general
      text: generateInterpretation(PlanetId.Ascendant, ascSign.name, 1, '', 0),
      link: getBlogLink(PlanetId.Ascendant, ascSign.name),
      color: 'text-reiki-cyan',
      bg: 'bg-reiki-cyan/10',
      border: 'border-reiki-cyan/30',
      type: 'Ascendant' as const
    },
    {
      id: 'sun',
      title: 'SOL',
      subtitle: 'Tu Esencia',
      icon: Sun,
      sign: sunSign.name,
      house: sun.house,
      text: generateInterpretation(PlanetId.Sun, sunSign.name, sun.house, '', 0),
      link: getBlogLink(PlanetId.Sun, sunSign.name),
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/30',
      type: 'Sun' as const
    },
    {
      id: 'moon',
      title: 'LUNA',
      subtitle: 'Tu Mundo Emocional',
      icon: Moon,
      sign: moonSign.name,
      house: moon.house,
      text: generateInterpretation(PlanetId.Moon, moonSign.name, moon.house, '', 0),
      link: getBlogLink(PlanetId.Moon, moonSign.name),
      color: 'text-slate-300',
      bg: 'bg-slate-300/10',
      border: 'border-slate-300/30',
      type: 'Moon' as const
    }
  ];

  const handleShare = async (item: typeof items[0]) => {
    try {
        setSharingCard(item.id);

        // Prepare the data for the share card template
        setShareData({
            type: item.type,
            signName: item.sign,
            house: item.house,
            text: item.text,
            userName: data.name,
            subtitle: item.subtitle
        });

        // Allow React to render the hidden card
        await new Promise(resolve => setTimeout(resolve, 100));

        if (shareCardRef.current) {
            const blob = await toBlob(shareCardRef.current, {
                cacheBust: true,
                canvasWidth: 1080,
                canvasHeight: 1080,
                pixelRatio: 1
            });

            if (blob) {
                const file = new File([blob], `metareiki-${item.id}-${item.sign}.png`, { type: 'image/png' });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: `Mi ${item.title} en ${item.sign}`,
                        text: `Descubre tu carta natal en https://astro.metareiki.org`,
                    });
                } else {
                    // Fallback to download
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `metareiki-${item.id}-${item.sign}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
            }
        }
    } catch (error) {
        console.error('Error sharing card:', error);
        alert('Hubo un problema al generar la imagen. Por favor intenta de nuevo.');
    } finally {
        setSharingCard(null);
        setShareData(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in break-inside-avoid print:space-y-2 relative">
       {/* Hidden container for image generation */}
       <div className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ zIndex: -1000 }}>
           {shareData && <SocialShareCard ref={shareCardRef} {...shareData} />}
       </div>

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

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-3 print:grid-cols-1">
         {items.map((item) => (
           <div key={item.title} className={`relative overflow-hidden rounded-xl border ${item.border} bg-slate-900/40 backdrop-blur p-6 hover:bg-slate-900/60 transition-colors print:bg-white print:border-gray-300 print:text-black print:p-3 print:rounded-lg print:border-b flex flex-col`}>
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

              <div className="text-sm text-slate-300 leading-relaxed text-justify print:text-black print:text-xs print:leading-snug flex-grow">
                 {item.text}
              </div>

              <div className="mt-4 flex items-center justify-between print:hidden">
                 {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity ${item.color}`}
                    >
                      <span>Explorar Más</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                 ) : <div></div>}

                 <button
                    onClick={() => handleShare(item)}
                    disabled={sharingCard !== null}
                    className={`p-2 rounded-lg transition-all ${sharingCard === item.id ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                    title="Compartir tarjeta"
                 >
                    {sharingCard === item.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Share2 className="w-5 h-5" />
                    )}
                 </button>
              </div>
           </div>
         ))}
       </div>
    </div>
  );
};
