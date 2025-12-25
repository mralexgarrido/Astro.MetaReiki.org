import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Map, Home, Star, Compass } from 'lucide-react';
import { ZODIAC_SIGNS } from '../types';

export const LibraryIndex: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>Biblioteca Astrológica Gratuita - MetaReiki Astro</title>
        <meta name="description" content="Explora nuestra biblioteca de interpretaciones astrológicas. Descubre el significado de cada planeta, signo y casa en la astrología helenística." />
      </Helmet>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          Biblioteca Astrológica
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Una colección completa de interpretaciones astrológicas tradicionales.
          Navega por el conocimiento ancestral de los astros, signos y casas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Planetas */}
        <Link to="/biblioteca/planetas" className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:border-reiki-cyan/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-reiki-cyan/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-reiki-cyan/20 transition-colors">
               <Star className="text-reiki-cyan w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-serif">Planetas</h2>
            <p className="text-slate-400 mb-6 line-clamp-3">
              Descubre el significado profundo del Sol, la Luna y los planetas en cada signo y casa. Entiende sus dignidades y debilidades.
            </p>
            <span className="text-reiki-cyan font-medium text-sm uppercase tracking-wider group-hover:underline decoration-reiki-cyan/50 underline-offset-4">
              Explorar Planetas &rarr;
            </span>
          </div>
        </Link>

        {/* Signos */}
        <Link to="/biblioteca/signos" className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:border-reiki-magenta/50 hover:shadow-[0_0_20px_rgba(255,0,255,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Map className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-reiki-magenta/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-reiki-magenta/20 transition-colors">
               <Map className="text-reiki-magenta w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-serif">Signos del Zodiaco</h2>
            <p className="text-slate-400 mb-6 line-clamp-3">
              Los 12 arquetipos fundamentales. Aprende sobre las cualidades elementales, modalidades y regentes de cada signo.
            </p>
            <span className="text-reiki-magenta font-medium text-sm uppercase tracking-wider group-hover:underline decoration-reiki-magenta/50 underline-offset-4">
              Explorar Signos &rarr;
            </span>
          </div>
        </Link>

        {/* Casas */}
        <Link to="/biblioteca/casas" className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Home className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
               <Home className="text-amber-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-serif">Casas Astrológicas</h2>
            <p className="text-slate-400 mb-6 line-clamp-3">
              Los escenarios de la vida. Desde la identidad (Casa 1) hasta el aislamiento (Casa 12), cada casa cuenta una parte de tu historia.
            </p>
            <span className="text-amber-500 font-medium text-sm uppercase tracking-wider group-hover:underline decoration-amber-500/50 underline-offset-4">
              Explorar Casas &rarr;
            </span>
          </div>
        </Link>

        {/* Guías */}
        <Link to="/biblioteca/guias" className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/80 transition-all hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Compass className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-600 transition-colors">
               <Compass className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-serif">Guías de Uso</h2>
            <p className="text-slate-400 mb-6 line-clamp-3">
              Aprende a interpretar tu Carta Natal, Profecciones, y más. Tutoriales paso a paso para sacar el máximo provecho al calculador.
            </p>
            <span className="text-white font-medium text-sm uppercase tracking-wider group-hover:underline decoration-white/50 underline-offset-4">
              Ver Guías &rarr;
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
};
