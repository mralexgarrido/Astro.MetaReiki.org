import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PLANET_DATA } from '../../services/interpretations';

export const InterpretationView: React.FC = () => {
  const { planetName, signName } = useParams<{ planetName: string; signName: string }>();
  const decodedPlanet = decodeURIComponent(planetName || '');
  const decodedSign = decodeURIComponent(signName || '');

  const planetData = PLANET_DATA[decodedPlanet];

  if (!planetData || !planetData[decodedSign]) {
    return (
       <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl text-red-400">Interpretación no encontrada</h1>
        <p className="text-slate-400 mt-2">No tenemos datos para {decodedPlanet} en {decodedSign}.</p>
        <Link to={`/biblioteca/planetas/${planetName}`} className="text-reiki-cyan mt-4 block">Volver atrás</Link>
      </div>
    );
  }

  // Check if the data structure is Sign -> House -> Text (Standard planets) or just Sign -> Text (Ascendant/MC)
  // Based on `generateInterpretation`, standard planets are nested.
  // Actually, checking `sol.json`, it is `{"Aries": {"1": "text..."}}`.
  // Ascendant is `{"Aries": "text..."}`.

  const content = planetData[decodedSign];
  const isHouseBased = typeof content === 'object' && content !== null && !Array.isArray(content);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in max-w-4xl">
      <Helmet>
        <title>{`${decodedPlanet} en ${decodedSign} - Significado Completo`}</title>
        <meta name="description" content={`Lee todo sobre ${decodedPlanet} en el signo de ${decodedSign}. Interpretaciones por casa y significado general.`} />
        {/* FAQ Schema for AEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${decodedPlanet} en ${decodedSign}`,
            "description": `Interpretación astrológica detallada de ${decodedPlanet} posicionándose en el signo de ${decodedSign}.`,
            "author": {
              "@type": "Organization",
              "name": "MetaReiki Astro"
            },
            "publisher": {
               "@type": "Organization",
               "name": "MetaReiki",
               "logo": {
                 "@type": "ImageObject",
                 "url": "https://astro.metareiki.org/android-chrome-512x512.png"
               }
            }
          })}
        </script>
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 text-sm text-slate-500 mb-6 items-center">
            <Link to="/biblioteca" className="hover:text-reiki-cyan">Biblioteca</Link>
            <span>/</span>
            <Link to="/biblioteca/planetas" className="hover:text-reiki-cyan">Planetas</Link>
            <span>/</span>
            <Link to={`/biblioteca/planetas/${planetName}`} className="hover:text-reiki-cyan">{decodedPlanet}</Link>
            <span>/</span>
            <span className="text-white">{decodedSign}</span>
      </div>

      <header className="mb-10 border-b border-slate-800 pb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-reiki-cyan to-reiki-magenta">
            {decodedPlanet} en {decodedSign}
        </h1>
        <p className="text-lg text-slate-300">
            Análisis detallado de esta configuración astrológica.
        </p>
      </header>

      {/* Content Rendering */}
      <div className="space-y-12">
          {isHouseBased ? (
              // Iterate over houses 1-12
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
                  const text = content[house.toString()];
                  if (!text) return null;

                  // Extract first sentence for bolding/emphasis if desired, or just render
                  return (
                      <article key={house} className="bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors" id={`casa-${house}`}>
                          <div className="flex items-center gap-3 mb-4">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-reiki-cyan font-bold font-serif text-sm border border-slate-700">
                                  {house}
                              </span>
                              <h2 className="text-xl font-bold text-white font-serif">
                                  Casa {house}
                              </h2>
                          </div>
                          <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                              <p>{text}</p>
                          </div>
                      </article>
                  );
              })
          ) : (
              // Simple string content (e.g. Ascendant)
              <article className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/50">
                  <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed">
                      <p>{content}</p>
                  </div>
              </article>
          )}
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-reiki-card to-reiki-dark border border-reiki-cyan/20 rounded-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-reiki-cyan via-reiki-magenta to-reiki-cyan"></div>
          <h3 className="text-2xl font-serif font-bold text-white mb-4">¿Tienes {decodedPlanet} en {decodedSign}?</h3>
          <p className="text-slate-400 mb-6">Calcula tu carta natal completa gratis para ver en qué casa cae esta posición y cómo interactúa con el resto de tu cielo.</p>
          <Link to="/carta-natal" className="inline-block px-8 py-3 bg-reiki-cyan text-slate-900 font-bold rounded-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,242,255,0.3)]">
              Calcular mi Carta Natal
          </Link>
      </div>

    </div>
  );
};
