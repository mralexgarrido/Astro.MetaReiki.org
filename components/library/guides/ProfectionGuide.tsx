import React from 'react';
import { GuideLayout } from './GuideLayout';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const ProfectionGuide: React.FC = () => {
  return (
    <GuideLayout
      title="Guía de Profecciones Anuales"
      description="Descubre una de las técnicas predictivas más antiguas y poderosas. Aprende a identificar el 'tema del año' y tu Señor del Tiempo."
      image="/assets/guides/profection.png"
    >
      <div className="space-y-12">

        <section>
          <h2 className="text-3xl font-serif text-amber-500 mb-4">¿Qué es una Profección?</h2>
          <p className="text-slate-300 mb-4">
            La Profección Anual es una técnica de "Señores del Tiempo" (Time Lords). La premisa es simple pero profunda: aunque tienes toda tu carta natal siempre, no todo está activo al mismo tiempo.
          </p>
          <p className="text-slate-300">
            Cada año, en tu cumpleaños, el "foco" de tu vida se mueve a la siguiente casa de tu carta. Al cumplir 0 años estás en Casa 1, al cumplir 1 año en Casa 2, y así sucesivamente en un ciclo de 12 años.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">El Señor del Año</h3>
            <p className="text-slate-400 mb-4">
              El planeta que rige el signo de tu casa profectada se convierte en tu <strong>Señor del Año</strong>.
            </p>
            <p className="text-slate-400">
              Este planeta es el "jefe" de tu vida durante esos 12 meses. Su estado en tu carta natal (signo, casa, aspectos) determinará la calidad de tu año. Si activas una casa con un planeta natal dentro, ese planeta también se "despierta".
            </p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h4 className="font-bold text-amber-500 mb-4">Ejemplo Práctico</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 p-1 rounded px-2">Edad 24</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>Vuelta a Casa 1 (Identidad, Salud)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 p-1 rounded px-2">Edad 25</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>Casa 2 (Dinero, Recursos)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-800 p-1 rounded px-2">Edad 29</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
                <span>Casa 6 (Trabajo duro, Enfermedad)</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-amber-500 mb-6">Cómo usar esta herramienta</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full h-fit text-amber-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Línea de Tiempo</h3>
                <p className="text-slate-400">
                  Nuestra herramienta genera una línea de tiempo desde tu nacimiento hasta los 84 años. Puedes ver exactamente qué casa se activa en qué fechas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-500/10 p-3 rounded-full h-fit text-amber-500">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Interpretación Actual</h3>
                <p className="text-slate-400">
                  La tarjeta principal te muestra tu edad actual, la casa activada y, lo más importante, <strong>qué temas esperar</strong> este año según la teoría helenística.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-6 rounded-xl border-l-4 border-amber-500">
          <p className="text-slate-200 italic">
            "Cuando se active una casa difícil (como la 6, 8 o 12), no temas. Es simplemente un año para trabajar esos temas con consciencia. Conocer al Señor del Año te da las herramientas para manejarlo."
          </p>
        </div>

      </div>
    </GuideLayout>
  );
};
