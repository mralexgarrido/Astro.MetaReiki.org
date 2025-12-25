import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HOUSE_THEMES } from '../../services/interpretations';

export const HouseIndex: React.FC = () => {
  // Houses are 1-12
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>Casas Astrológicas - Biblioteca MetaReiki</title>
        <meta name="description" content="Explora las 12 casas astrológicas. Descubre qué área de la vida gobierna cada sector de tu carta natal." />
      </Helmet>

      <div className="mb-8">
        <Link to="/biblioteca" className="text-reiki-cyan hover:underline text-sm mb-4 block">&larr; Volver al Índice</Link>
        <h1 className="text-4xl font-serif font-bold text-white mb-4">Casas Astrológicas</h1>
        <p className="text-slate-400 max-w-2xl">
            Los escenarios de la vida donde ocurre la acción. Cada casa representa un campo de experiencia específico, desde la identidad hasta el inconsciente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
            <Link
            key={house}
            to={`/biblioteca/casas/${house}`}
            className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:bg-slate-700 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all group"
            >
            <div className="flex justify-between items-center mb-4">
                <span className="w-10 h-10 rounded-full bg-slate-900 border border-slate-600 flex items-center justify-center text-xl font-serif font-bold text-amber-500">
                    {house}
                </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">
                Casa {house}
            </h3>

            <p className="text-slate-400 text-sm">
                {HOUSE_THEMES[house]}
            </p>
            </Link>
        ))}
      </div>
    </div>
  );
};
