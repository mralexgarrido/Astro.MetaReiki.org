import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ZODIAC_SIGNS } from '../../types';
import { SIGN_ADJECTIVES } from '../../services/interpretations';

export const SignIndex: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>Signos del Zodiaco - Biblioteca MetaReiki</title>
        <meta name="description" content="Explora los 12 signos del zodiaco. Conoce sus elementos, modalidades y cualidades únicas." />
      </Helmet>

      <div className="mb-8">
        <Link to="/biblioteca" className="text-reiki-cyan hover:underline text-sm mb-4 block">&larr; Volver al Índice</Link>
        <h1 className="text-4xl font-serif font-bold text-white mb-4">Signos del Zodiaco</h1>
        <p className="text-slate-400 max-w-2xl">
            Los 12 arquetipos fundamentales de la experiencia humana. Cada signo tiñe los planetas con su propio estilo y motivación.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ZODIAC_SIGNS.map((sign) => {
            const adjective = SIGN_ADJECTIVES[sign.name];

            // Color coding based on element
            let borderColor = 'border-slate-700';
            let iconColor = 'text-slate-400';
            let shadowColor = '';

            switch(sign.element) {
                case 'Fuego':
                    borderColor = 'hover:border-red-500/50';
                    iconColor = 'text-red-500';
                    shadowColor = 'hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]';
                    break;
                case 'Tierra':
                    borderColor = 'hover:border-emerald-500/50';
                    iconColor = 'text-emerald-500';
                    shadowColor = 'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                    break;
                case 'Aire':
                    borderColor = 'hover:border-amber-400/50';
                    iconColor = 'text-amber-400';
                    shadowColor = 'hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]';
                    break;
                case 'Agua':
                    borderColor = 'hover:border-blue-500/50';
                    iconColor = 'text-blue-500';
                    shadowColor = 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]';
                    break;
            }

            return (
              <Link
                key={sign.id}
                to={`/biblioteca/signos/${encodeURIComponent(sign.name)}`}
                className={`bg-slate-800 border border-slate-700 p-6 rounded-xl transition-all group ${borderColor} ${shadowColor}`}
              >
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-4xl font-serif ${iconColor}`}>{sign.symbol}</span>
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-700">
                        {sign.element}
                    </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-reiki-cyan transition-colors">
                  {sign.name}
                </h3>

                <p className="text-slate-400 text-sm mb-4 italic">
                    "Una energía {adjective}..."
                </p>

                <div className="text-xs text-slate-500">
                    Regente: <span className="text-slate-300">{sign.rulers[0].name}</span>
                </div>
              </Link>
            );
        })}
      </div>
    </div>
  );
};
