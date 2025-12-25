import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface GuideLayoutProps {
  title: string;
  description: string;
  image?: string;
  children: React.ReactNode;
}

export const GuideLayout: React.FC<GuideLayoutProps> = ({ title, description, image, children }) => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 animate-fade-in max-w-5xl">
      <Helmet>
        <title>{`${title} - Guía de Uso - MetaReiki Astro`}</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm mb-8 text-slate-400 flex flex-wrap gap-2 items-center">
        <Link to="/" className="hover:text-reiki-cyan transition-colors">Inicio</Link>
        <span>/</span>
        <Link to="/biblioteca" className="hover:text-reiki-cyan transition-colors">Biblioteca</Link>
        <span>/</span>
        <Link to="/biblioteca/guias" className="hover:text-reiki-cyan transition-colors">Guías</Link>
        <span>/</span>
        <span className="text-slate-200 font-medium truncate">{title}</span>
      </nav>

      {/* Header */}
      <header className="mb-12 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        {image && (
          <img
            src={image}
            alt={title}
            className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-20"
          />
        )}

        <div className="relative z-20 p-8 md:p-12 max-w-2xl">
          <Link to="/biblioteca/guias" className="inline-flex items-center gap-2 text-reiki-cyan mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Volver a las Guías
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {title}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-invert prose-lg max-w-none">
        {children}
      </article>

      {/* Footer CTA */}
      <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center">
        <BookOpen className="w-12 h-12 text-reiki-cyan mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2 font-serif">¿Listo para aplicar este conocimiento?</h3>
        <p className="text-slate-400 mb-6">Calcula tu carta ahora y explora tus propias configuraciones.</p>
        <Link
          to="/"
          className="inline-block bg-reiki-cyan text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all"
        >
          Ir al Calculador
        </Link>
      </div>
    </div>
  );
};
