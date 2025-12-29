import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Scale, HeartHandshake, AlertTriangle, Copyright, ExternalLink } from 'lucide-react';

export const TermsOfUse: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-reiki-magenta/30 pb-20">
      <Helmet>
        <title>Términos de Uso | MetaReiki Astro</title>
        <meta name="description" content="Términos y condiciones de uso de MetaReiki Astro. Herramienta educativa y de entretenimiento. No constituye consejo médico, legal o financiero." />
        <link rel="canonical" href="https://astro.metareiki.org/terminos" />
      </Helmet>

      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10 text-center">
          <Scale className="w-16 h-16 text-reiki-magenta mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">Términos de Uso</h1>
          <p className="text-xl text-reiki-magenta font-medium tracking-wide uppercase">Claridad y responsabilidad.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-12 space-y-12">

        {/* Introduction */}
        <section className="prose prose-invert max-w-none">
          <p className="lead text-lg text-slate-300 leading-relaxed">
            Bienvenido a <strong>MetaReiki Astro</strong>. Al utilizar esta aplicación web, aceptas cumplir con los siguientes términos y condiciones.
            Esta herramienta ha sido creada con el propósito de facilitar el cálculo y estudio de cartas astrológicas desde una perspectiva helenística tradicional.
          </p>
        </section>

        {/* Detailed Sections */}
        <div className="space-y-10">

            <article className="border-l-4 border-reiki-magenta pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <HeartHandshake className="w-6 h-6 text-slate-400" />
                    1. Aceptación y Uso
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        El uso de <strong>MetaReiki Astro</strong> es gratuito y de libre acceso. Al utilizar nuestros cálculos, interpretaciones y herramientas,
                        confirmas que lo haces bajo tu propia responsabilidad y criterio.
                    </p>
                    <p>
                        Esta aplicación está diseñada para:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Estudiantes de astrología que buscan cálculos precisos.</li>
                        <li>Entusiastas que desean explorar su autoconocimiento.</li>
                        <li>Astrólogos que requieren una herramienta rápida y fiable de cálculo.</li>
                    </ul>
                </div>
            </article>

            <article className="border-l-4 border-amber-500 pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-slate-400" />
                    2. Descargo de Responsabilidad (Disclaimer)
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed bg-amber-500/5 p-6 rounded-xl border border-amber-500/20">
                    <p className="font-bold text-amber-200">
                        Solo para fines educativos y de entretenimiento.
                    </p>
                    <p>
                        La información proporcionada por esta aplicación, incluyendo pero no limitándose a cálculos de tránsitos,
                        interpretaciones de salud (astrología médica) y predicciones de "time lords", <strong>NO constituye consejo médico, legal, financiero o psicológico profesional</strong>.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>No utilices esta aplicación para diagnosticar enfermedades.</li>
                        <li>No tomes decisiones financieras basándote únicamente en tránsitos astrológicos.</li>
                        <li>Siempre consulta a un profesional cualificado para asuntos graves de salud o legales.</li>
                    </ul>
                </div>
            </article>

            <article className="border-l-4 border-slate-700 pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <Copyright className="w-6 h-6 text-slate-400" />
                    3. Propiedad Intelectual
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        El código fuente de la aplicación, los algoritmos de interpretación personalizados y el diseño visual son propiedad de <strong>MetaReiki</strong>.
                    </p>
                    <p>
                        Sin embargo, los cálculos astronómicos subyacentes se basan en librerías de código abierto (como Swiss Ephemeris y Astronomy Engine),
                        cuyas licencias respectivas son respetadas.
                    </p>
                    <p>
                        Puedes compartir capturas de pantalla de tus cartas en redes sociales libremente (¡nos encanta que lo hagas!),
                        pero no está permitida la reproducción comercial masiva del contenido textual de las interpretaciones sin permiso explícito.
                    </p>
                </div>
            </article>

            <article className="border-l-4 border-indigo-500 pl-6 py-2">
                <h2 className="text-2xl font-serif text-slate-100 mb-4 flex items-center gap-3">
                    <ExternalLink className="w-6 h-6 text-slate-400" />
                    4. Enlaces Externos
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                    <p>
                        La aplicación puede contener enlaces a sitios web externos (como nuestro blog principal <code>metareiki.org</code> o fuentes de datos).
                        No somos responsables del contenido ni de las prácticas de privacidad de esos sitios.
                    </p>
                </div>
            </article>

        </div>

        {/* Footer Note */}
        <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Última actualización: diciembre de 2025</p>
            <p className="mt-2">
                MetaReiki Astro es un servicio de <a href="https://metareiki.org" className="text-reiki-magenta hover:underline">MetaReiki.org</a>.
            </p>
        </div>

      </div>
    </div>
  );
};
