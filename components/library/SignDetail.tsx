import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ZODIAC_SIGNS } from '../../types';
import { SIGN_ADJECTIVES, PLANET_DATA } from '../../services/interpretations';

export const SignDetail: React.FC = () => {
  const { signName } = useParams<{ signName: string }>();
  const decodedSign = decodeURIComponent(signName || '');

  const signData = ZODIAC_SIGNS.find(s => s.name === decodedSign);
  const adjective = SIGN_ADJECTIVES[decodedSign];

  if (!signData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl text-red-400">Signo no encontrado</h1>
        <Link to="/biblioteca/signos" className="text-reiki-cyan mt-4 block">Volver a la lista</Link>
      </div>
    );
  }

  // Get list of planets that have interpretations for this sign
  // We iterate over PLANET_DATA keys.
  const planetLinks = Object.keys(PLANET_DATA).filter(planetKey => {
      const data = PLANET_DATA[planetKey];
      // Check if data has entry for this sign
      return data && data[decodedSign];
  });

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-4xl">
      <Helmet>
        <title>{`${signData.name} - Significado y Planetas - MetaReiki`}</title>
        <meta name="description" content={`Todo sobre el signo de ${signData.name}. Elemento ${signData.element}, regente ${signData.rulers[0].name} y cómo influye en los planetas.`} />
      </Helmet>

      <div className="mb-8">
        <div className="flex gap-2 text-sm text-slate-500 mb-4">
            <Link to="/biblioteca" className="hover:text-reiki-cyan">Biblioteca</Link>
            <span>/</span>
            <Link to="/biblioteca/signos" className="hover:text-reiki-cyan">Signos</Link>
            <span>/</span>
            <span className="text-white">{signData.name}</span>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-reiki-cyan to-transparent opacity-50"></div>

          <div className="text-6xl mb-4 text-white font-serif">{signData.symbol}</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            {signData.name}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 text-sm uppercase tracking-widest font-medium text-reiki-cyan mb-8">
              <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Elemento: {signData.element}</span>
              <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Regente: {signData.rulers.map(r => r.name).join(' / ')}</span>
          </div>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed italic">
              "Una energía {adjective} que impulsa a la acción y define el estilo de expresión de cualquier planeta que resida aquí."
          </p>
      </div>

      {/* Planets in Sign Links */}
      <h2 className="text-2xl font-serif font-bold text-white mb-6 border-b border-slate-800 pb-2">
          Planetas en {signData.name}
      </h2>
      <p className="text-slate-400 mb-6">
          Descubre cómo se expresa cada arquetipo planetario cuando viste el traje de {signData.name}:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {planetLinks.map(planet => (
              <Link
                key={planet}
                to={`/biblioteca/planetas/${encodeURIComponent(planet)}/${encodeURIComponent(signData.name)}`}
                className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-reiki-cyan/30 transition-all group"
              >
                  <span className="text-white font-medium group-hover:text-reiki-cyan transition-colors">
                      {planet} en {signData.name}
                  </span>
                  <span className="text-slate-600 group-hover:text-reiki-cyan">&rarr;</span>
              </Link>
          ))}
      </div>

    </div>
  );
};
