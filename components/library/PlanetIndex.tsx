import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PLANET_DATA } from '../../services/interpretations';

const AVAILABLE_PLANETS = Object.keys(PLANET_DATA);

export const PlanetIndex: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>Planetas en Astrología - Biblioteca MetaReiki</title>
        <meta name="description" content="Significado de los planetas en la astrología helenística. Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno y más." />
      </Helmet>

      <div className="mb-8">
        <Link to="/biblioteca" className="text-reiki-cyan hover:underline text-sm mb-4 block">&larr; Volver al Índice</Link>
        <h1 className="text-4xl font-serif font-bold text-white mb-4">Planetas y Puntos</h1>
        <p className="text-slate-400 max-w-2xl">
            Los actores del drama celeste. Selecciona un cuerpo celeste para explorar sus interpretaciones a través de los signos y las casas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {AVAILABLE_PLANETS.map((planet) => (
          <Link
            key={planet}
            to={`/biblioteca/planetas/${encodeURIComponent(planet)}`}
            className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:bg-slate-700 hover:border-reiki-cyan/30 transition-all group"
          >
            <h3 className="text-xl font-serif font-bold text-white group-hover:text-reiki-cyan transition-colors">
              {planet}
            </h3>
            <span className="text-xs text-slate-500 mt-2 block">Ver interpretaciones &rarr;</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
