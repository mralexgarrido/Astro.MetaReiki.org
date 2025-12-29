import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock, Database, Globe, EyeOff, Server, HardDrive } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-reiki-cyan/30 pb-20">
      <Helmet>
        <title>Política de Privacidad | MetaReiki Astro</title>
        <meta name="description" content="Conoce nuestra política de Privacidad Total. En MetaReiki Astro, tus datos astrológicos nunca salen de tu dispositivo. Procesamiento local y seguro." />
        <link rel="canonical" href="https://astro.metareiki.org/privacidad" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10 text-center">
          <ShieldCheck className="w-16 h-16 text-reiki-cyan mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">Política de Privacidad</h1>
          <p className="text-xl text-reiki-cyan font-medium tracking-wide uppercase">Tus estrellas, tus datos, tu privacidad.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12 space-y-12">

        {/* Introduction */}
        <section className="prose prose-invert max-w-none">
          <p className="lead text-lg text-slate-300 leading-relaxed">
            En <strong>MetaReiki Astro</strong>, creemos que la astrología es una herramienta profundamente personal.
            Por eso, hemos diseñado nuestra aplicación con una filosofía de <strong>"Privacidad por Diseño"</strong>.
            A diferencia de la mayoría de las aplicaciones en internet, nosotros no queremos tus datos.
            Toda la magia ocurre en tu dispositivo.
          </p>
        </section>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-reiki-cyan/30 transition-colors">
            <Lock className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200 mb-2">Procesamiento Local</h3>
            <p className="text-slate-400 text-sm">
              Todos los cálculos astronómicos se realizan en tu navegador usando WebAssembly.
              Tus fechas de nacimiento nunca se envían a nuestros servidores para ser procesadas.
            </p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 hover:border-reiki-cyan/30 transition-colors">
            <Database className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200 mb-2">Almacenamiento en tu Dispositivo</h3>
            <p className="text-slate-400 text-sm">
              Los perfiles que creas se guardan en el <code>LocalStorage</code> de tu navegador.
              Si borras el caché o cambias de dispositivo, los datos desaparecen porque solo tú los tienes.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10">

            <article className="border-l-4 border-reiki-cyan pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <Server className="w-6 h-6 text-slate-400" />
                    1. Recopilación de Datos
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        No recopilamos, almacenamos ni vendemos información personal identificable.
                        No tenemos una base de datos de usuarios. No tenemos sistemas de registro ni cuentas de usuario en la nube.
                    </p>
                    <p>
                        Los datos que ingresas (nombre, fecha, hora y lugar de nacimiento) se utilizan exclusivamente en tiempo real
                        para generar tu carta astral y se almacenan únicamente en la memoria de tu dispositivo.
                    </p>
                </div>
            </article>

            <article className="border-l-4 border-reiki-magenta pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-slate-400" />
                    2. Servicios de Terceros
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        Para ofrecer la funcionalidad de búsqueda de ciudades y coordenadas precisas, utilizamos un servicio externo:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                            <strong>Open-Meteo Geocoding API:</strong> Cuando buscas una ciudad, enviamos el texto de búsqueda a Open-Meteo.
                            Ellos nos devuelven las coordenadas y la zona horaria. Puedes consultar su
                            <a href="https://open-meteo.com/en/features#terms" target="_blank" rel="noopener noreferrer" className="text-reiki-cyan hover:underline ml-1">
                                política de privacidad aquí
                            </a>.
                        </li>
                    </ul>
                    <p className="text-sm bg-slate-900 p-4 rounded-lg border border-slate-800 mt-4">
                        <strong>Nota:</strong> Solo se envía el nombre de la ciudad. Nunca enviamos tu fecha de nacimiento ni tu nombre a este servicio.
                    </p>
                </div>
            </article>

            <article className="border-l-4 border-amber-500 pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <HardDrive className="w-6 h-6 text-slate-400" />
                    3. Cookies y Almacenamiento Local
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        No utilizamos cookies de rastreo ni de publicidad.
                    </p>
                    <p>
                        Utilizamos <strong>LocalStorage</strong> (una tecnología moderna similar a las cookies pero más segura)
                        para guardar tus preferencias y los perfiles que decidas crear, para que no tengas que escribirlos cada vez que entras.
                    </p>
                    <p>
                        Puedes eliminar estos datos en cualquier momento usando el botón "Eliminar" en la aplicación o borrando los datos de navegación de tu navegador.
                    </p>
                </div>
            </article>

            <article className="border-l-4 border-slate-700 pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <EyeOff className="w-6 h-6 text-slate-400" />
                    4. Cambios en la Política
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        Dado que nuestra arquitectura no depende de servidores centrales, es poco probable que cambiemos radicalmente esta política.
                        Sin embargo, nos reservamos el derecho de actualizarla para reflejar cambios en la legislación o nuevas funcionalidades.
                    </p>
                    <p>
                        Cualquier cambio será publicado en esta página.
                    </p>
                </div>
            </article>

        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Última actualización: diciembre de 2025</p>
            <p className="mt-2">
                Si tienes dudas técnicas sobre cómo protegemos tus datos, contáctanos a través de <a href="https://metareiki.org" className="text-reiki-cyan hover:underline">MetaReiki.org</a>.
            </p>
        </div>

      </div>
    </div>
  );
};
