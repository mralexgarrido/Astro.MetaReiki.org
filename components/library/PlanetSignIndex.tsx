import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PLANET_DATA } from '../../services/interpretations';
import { ZODIAC_SIGNS } from '../../types';

export const PlanetSignIndex: React.FC = () => {
  const { planetName } = useParams<{ planetName: string }>();
  const decodedPlanet = decodeURIComponent(planetName || '');

  // Validate planet exists
  if (!PLANET_DATA[decodedPlanet]) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl text-red-400">Planeta no encontrado</h1>
        <Link to="/biblioteca/planetas" className="text-reiki-cyan mt-4 block">Volver a la lista</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>{`${decodedPlanet} en los Signos - Biblioteca Astrológica`}</title>
        <meta name="description" content={`Explora el significado de ${decodedPlanet} en cada uno de los 12 signos del zodiaco.`} />
      </Helmet>

      <div className="mb-8">
        <div className="flex gap-2 text-sm text-slate-500 mb-4">
            <Link to="/biblioteca" className="hover:text-reiki-cyan">Biblioteca</Link>
            <span>/</span>
            <Link to="/biblioteca/planetas" className="hover:text-reiki-cyan">Planetas</Link>
        </div>
        <h1 className="text-4xl font-serif font-bold text-white mb-2">
            {decodedPlanet} en los Signos
        </h1>
        <p className="text-slate-400">
            Selecciona un signo para ver cómo se expresa {decodedPlanet} en ese territorio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ZODIAC_SIGNS.map((sign) => (
           <Link
             key={sign.id}
             to={`/biblioteca/planetas/${encodeURIComponent(decodedPlanet)}/${encodeURIComponent(sign.name)}`}
             className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:bg-slate-700 hover:border-reiki-magenta/30 transition-all flex items-center justify-between group"
           >
             <span className="font-serif font-bold text-white group-hover:text-reiki-magenta transition-colors">{sign.name}</span>
             <span className="text-slate-600 group-hover:text-slate-400">&rarr;</span>
           </Link>
        ))}
      </div>
    </div>
  );
};
