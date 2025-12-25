import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Compass, Calendar, Clock, Heart, Activity, ArrowRight } from 'lucide-react';

export const GuidesIndex: React.FC = () => {
  const guides = [
    {
      title: "Carta Natal",
      description: "La base de tu identidad astrológica. Aprende a leer tu mapa de nacimiento, entender tus 'Tres Grandes' (Sol, Luna, Ascendente) y descubrir tu propósito.",
      path: "/biblioteca/guias/carta-natal",
      icon: <Compass className="w-8 h-8 text-reiki-cyan" />,
      color: "reiki-cyan",
      image: "/assets/guides/natal.png"
    },
    {
      title: "Profecciones Anuales",
      description: "Una técnica predictiva antigua que revela qué temas y planetas están activados para ti en tu edad actual. Conoce a tu Señor del Año.",
      path: "/biblioteca/guias/profecciones",
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      color: "amber-500",
      image: "/assets/guides/profection.png"
    },
    {
      title: "Partes Herméticas",
      description: "Puntos calculados matemáticamente que revelan el destino en áreas específicas como la fortuna, el espíritu, el amor y la necesidad.",
      path: "/biblioteca/guias/partes-hermeticas",
      icon: <Activity className="w-8 h-8 text-purple-500" />,
      color: "purple-500",
      image: "/assets/guides/lots.png"
    },
    {
      title: "Tránsitos Importantes",
      description: "Tu calendario cósmico personal. Rastrea eventos mayores como el Retorno de Saturno y tránsitos a tu Ascendente.",
      path: "/biblioteca/guias/transitos",
      icon: <Calendar className="w-8 h-8 text-indigo-400" />,
      color: "indigo-400",
      image: "/assets/guides/transits.png"
    },
    {
      title: "Reiki y Salud",
      description: "Astrología médica aplicada. Conecta tus configuraciones planetarias con tus centros de energía (Chakras) y encuentra equilibrio.",
      path: "/biblioteca/guias/reiki",
      icon: <Heart className="w-8 h-8 text-green-500" />,
      color: "green-500",
      image: "/assets/guides/reiki.png"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <Helmet>
        <title>Guías de Uso del Calculador - MetaReiki Astro</title>
        <meta name="description" content="Aprende a utilizar nuestras herramientas astrológicas. Guías paso a paso para la Carta Natal, Profecciones, Partes Herméticas y más." />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm mb-8 text-slate-400">
        <Link to="/" className="hover:text-reiki-cyan transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/biblioteca" className="hover:text-reiki-cyan transition-colors">Biblioteca</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">Guías de Uso</span>
      </nav>

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]">
          Guías de Uso
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Saca el máximo partido a nuestras herramientas astrológicas profesionales.
          Selecciona una guía para entender cómo interpretar tus resultados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {guides.map((guide) => (
          <Link
            key={guide.path}
            to={guide.path}
            className="group relative bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-800/80 transition-all hover:border-slate-500 hover:shadow-2xl"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="md:w-1/3 h-48 md:h-auto overflow-hidden relative">
                 <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80 z-10`} />
                 <img
                   src={guide.image}
                   alt={guide.title}
                   className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                 />
              </div>

              {/* Content Section */}
              <div className="p-6 md:w-2/3 flex flex-col justify-center relative z-20">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-slate-800/80 ring-1 ring-slate-700`}>
                    {guide.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white font-serif">{guide.title}</h2>
                </div>

                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {guide.description}
                </p>

                <div className={`flex items-center gap-2 text-sm font-bold text-${guide.color} mt-auto`}>
                  <span>Leer Guía</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
