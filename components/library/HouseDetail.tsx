import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HOUSE_DEFINITIONS, HOUSE_THEMES } from '../../services/interpretations';

export const HouseDetail: React.FC = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const id = parseInt(houseId || '0', 10);

  const definition = HOUSE_DEFINITIONS[id];
  const theme = HOUSE_THEMES[id];

  if (!definition) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl text-red-400">Casa no encontrada</h1>
        <Link to="/biblioteca/casas" className="text-reiki-cyan mt-4 block">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-4xl">
      <Helmet>
        <title>{`Casa ${id}: ${theme} - Biblioteca Astrológica`}</title>
        <meta name="description" content={`Significado de la Casa ${id} en astrología. ${theme}.`} />
      </Helmet>

      <div className="mb-8">
        <div className="flex gap-2 text-sm text-slate-500 mb-4">
            <Link to="/biblioteca" className="hover:text-reiki-cyan">Biblioteca</Link>
            <span>/</span>
            <Link to="/biblioteca/casas" className="hover:text-reiki-cyan">Casas</Link>
            <span>/</span>
            <span className="text-white">Casa {id}</span>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

          <div className="flex items-center gap-6 mb-6">
             <span className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-3xl font-serif font-bold text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                 {id}
             </span>
             <div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
                    La Casa {id}
                </h1>
                <h2 className="text-xl text-amber-500 font-medium tracking-wide uppercase">
                    {theme}
                </h2>
             </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed border-t border-slate-800 pt-6">
              <p>{definition}</p>
          </div>
      </div>

      {/* Additional Context / Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-white font-bold mb-3">¿Tienes planetas aquí?</h3>
              <p className="text-slate-400 text-sm mb-4">
                  Los planetas en esta casa concentrarán su energía en los asuntos de {theme.toLowerCase()}.
                  Calcula tu carta natal para ver quién habita este sector.
              </p>
              <Link to="/carta-natal" className="text-reiki-cyan text-sm font-bold hover:underline">
                  Ver mi Carta Natal &rarr;
              </Link>
          </div>

          <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-white font-bold mb-3">El Regente</h3>
              <p className="text-slate-400 text-sm mb-4">
                  El planeta que gobierna el signo en la cúspide de esta casa es el "casero".
                  Su posición en otra casa conecta ambas áreas de vida.
              </p>
          </div>
      </div>

    </div>
  );
};
