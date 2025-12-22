import React, { forwardRef } from 'react';
import { Sun, Moon, ArrowUpCircle, Sparkles } from 'lucide-react';

export interface SocialShareCardProps {
  type: 'Sun' | 'Moon' | 'Ascendant';
  signName: string;
  house?: number;
  text: string;
  userName: string;
  subtitle: string;
}

export const SocialShareCard = forwardRef<HTMLDivElement, SocialShareCardProps>(
  ({ type, signName, house, text, userName, subtitle }, ref) => {

    // Determine icon and colors based on type
    let Icon = Sun;
    let title = 'SOL';
    let colorClass = 'text-amber-400';
    let gradientFrom = 'from-amber-500/20';
    let gradientTo = 'to-amber-900/10';

    if (type === 'Moon') {
      Icon = Moon;
      title = 'LUNA';
      colorClass = 'text-slate-300';
      gradientFrom = 'from-slate-400/20';
      gradientTo = 'to-slate-800/10';
    } else if (type === 'Ascendant') {
      Icon = ArrowUpCircle;
      title = 'ASCENDENTE';
      colorClass = 'text-reiki-cyan';
      gradientFrom = 'from-cyan-500/20';
      gradientTo = 'to-cyan-900/10';
    }

    return (
      <div
        ref={ref}
        className="w-[1080px] h-[1920px] bg-[#090b14] relative overflow-hidden flex flex-col items-center justify-between p-16 font-sans text-white selection:none"
        style={{
            backgroundImage: `
                radial-gradient(circle at 50% 0%, rgba(30, 41, 59, 0.8) 0%, rgba(9, 11, 20, 1) 50%),
                radial-gradient(circle at 80% 90%, rgba(88, 28, 135, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(15, 118, 110, 0.2) 0%, transparent 50%)
            `
        }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none"
             style={{
                 backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                 backgroundSize: '60px 60px'
             }}>
        </div>

        {/* Header */}
        <div className="w-full text-center space-y-4 relative z-10 pt-20">
            <div className="flex items-center justify-center gap-3 opacity-80 mb-2">
                <Sparkles className="w-6 h-6 text-reiki-cyan" />
                <span className="text-3xl uppercase tracking-[0.3em] font-light text-reiki-cyan/80">Carta de {userName}</span>
                <Sparkles className="w-6 h-6 text-reiki-magenta" />
            </div>

            <div className={`inline-flex items-center justify-center p-5 rounded-full bg-slate-900/50 border border-white/10 backdrop-blur-md shadow-2xl ${colorClass}`}>
                <Icon className="w-20 h-20" strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
                <h2 className={`text-4xl font-bold tracking-widest uppercase ${colorClass} opacity-90`}>{title}</h2>
                <p className="text-2xl text-slate-400 font-light tracking-widest uppercase">{subtitle}</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col justify-start pt-16 items-center w-full max-w-4xl relative z-10">
            <h1 className="text-7xl font-serif font-bold text-white mb-2 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                {signName}
            </h1>

            {house && (
                <div className="text-3xl text-slate-500 font-mono mb-12 tracking-widest border-t border-b border-slate-800 py-2 px-8">
                    CASA {house}
                </div>
            )}

            <div className="relative px-8">
                 {/* Quote marks decorative */}
                 <span className="absolute -top-12 -left-4 text-9xl font-serif text-white/5 font-bold">“</span>
                 <p className="text-4xl leading-snug text-slate-200 text-center font-light tracking-wide drop-shadow-md">
                    {text}
                 </p>
                 <span className="absolute -bottom-16 -right-4 text-9xl font-serif text-white/5 font-bold rotate-180">“</span>
            </div>
        </div>

        {/* Footer */}
        <div className="w-full pb-20 border-t border-white/10 flex justify-center items-center relative z-10">
            <div className="bg-slate-900/80 px-10 py-4 rounded-full border border-reiki-cyan/20 flex items-center gap-4 shadow-[0_0_30px_rgba(0,242,255,0.15)] mt-10">
                 <span className="text-3xl font-bold tracking-widest text-reiki-cyan">ASTRO.METAREIKI.ORG</span>
            </div>
        </div>
      </div>
    );
  }
);

SocialShareCard.displayName = 'SocialShareCard';
