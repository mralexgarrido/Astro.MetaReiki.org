import React from 'react';
import { Sparkles, Globe, BookOpen, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutSection: React.FC = () => {
  return (
    <section className="mt-20 py-12 px-4 border-t border-slate-800 bg-reiki-card/30 backdrop-blur-sm print:hidden">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Main Introduction */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-reiki-cyan mb-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
              Astrología de Precisión para el Alma Moderna
            </h2>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-slate-300 leading-relaxed text-lg max-w-2xl mx-auto">
            Bienvenido a <strong>MetaReiki Astro</strong>, tu herramienta definitiva para el autoconocimiento astrológico.
            Nuestra plataforma combina la sabiduría ancestral de la <strong>astrología helenística</strong> con la precisión
            matemática de los algoritmos suizos modernos (Swiss Ephemeris).
          </p>
        </section>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

          <article className="space-y-3">
            <div className="flex items-center gap-3 text-reiki-magenta">
              <Globe className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Carta Natal Precisa</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calculamos tu <strong>carta astral</strong> utilizando el sistema de <strong>Signos Enteros (Whole Sign Houses)</strong>,
              el estándar de oro de la astrología tradicional. Descubre la posición exacta de tus planetas,
              tu signo ascendente y cómo los astros configuran tu personalidad única.
            </p>
          </article>

          <article className="space-y-3">
            <div className="flex items-center gap-3 text-amber-500">
              <BookOpen className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Profecciones Anuales</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              ¿Cuál es tu <strong>Señor del Tiempo</strong> este año? Nuestra calculadora de
              <strong>profecciones anuales</strong> te revela qué planeta y casa están activos en tu vida ahora mismo,
              permitiéndote prever temas clave y oportunidades de crecimiento personal.
            </p>
          </article>

          <article className="space-y-3">
            <div className="flex items-center gap-3 text-green-500">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Salud y Astrología</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Integramos la <strong>astrología médica</strong> y el sistema de chakras para ofrecerte una visión holística.
              Analiza tus <strong>Partes Herméticas</strong> (Fortuna, Espíritu, Eros) y recibe consejos personalizados
              para equilibrar tu energía vital a través del Reiki y la conciencia corporal.
            </p>
          </article>

        </div>

        {/* SEO Keywords */}
        <div className="border-t border-slate-800 pt-8 text-center space-y-4">
          <div className="flex justify-center gap-6 text-xs text-slate-500 font-medium uppercase tracking-wider">
            <span>Herramientas Gratuitas de Astrología</span>
            <span>•</span>
            <span>Sin Registro</span>
            <span>•</span>
            <Link to="/privacidad" className="hover:text-reiki-cyan transition-colors">100% Privado</Link>
          </div>

          <div className="text-xs text-slate-600 max-w-3xl mx-auto leading-loose">
            <span className="sr-only">Palabras clave: </span>
            Calculadora de Tránsitos Planetarios • Revolución Solar • Astrología Psicológica •
            Signo Solar, Lunar y Ascendente • Compatibilidad Astrológica • Efemérides Suizas •
            Metafísica y Espiritualidad
          </div>

          <div className="flex justify-center gap-4 text-[10px] text-slate-700">
             <Link to="/privacidad" className="hover:text-slate-500 transition-colors">Política de Privacidad</Link>
             <span>|</span>
             <Link to="/terminos" className="hover:text-slate-500 transition-colors">Términos de Uso</Link>
          </div>
        </div>

      </div>
    </section>
  );
};
