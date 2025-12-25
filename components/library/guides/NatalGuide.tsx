import React from 'react';
import { GuideLayout } from './GuideLayout';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export const NatalGuide: React.FC = () => {
  return (
    <GuideLayout
      title="Guía de la Carta Natal"
      description="Aprende a interpretar tu mapa cósmico personal. Entiende los componentes esenciales de tu carta natal y cómo navegar por el reporte detallado."
      image="/assets/guides/natal.png"
    >
      <div className="space-y-12">

        {/* Section 1: Concept */}
        <section>
          <h2 className="text-3xl font-serif text-reiki-cyan mb-4">¿Qué es la Carta Natal?</h2>
          <p className="text-slate-300 mb-4">
            La Carta Natal es una fotografía del cielo en el momento exacto de tu nacimiento. No es solo tu "signo solar" (el que lees en el horóscopo), sino un mapa complejo que muestra dónde estaban todos los planetas y cómo interactuaban entre sí.
          </p>
          <div className="bg-slate-800/50 p-6 rounded-xl border-l-4 border-reiki-cyan">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-reiki-cyan" />
              Dato Importante
            </h4>
            <p className="text-slate-400 text-sm">
              Esta calculadora utiliza el sistema de <strong>Casas de Signo Completo</strong> (Whole Sign Houses), el sistema original de la astrología helenística. Esto significa que si tu Ascendente es Aries, toda la casa 1 es Aries, la casa 2 es Tauro, y así sucesivamente.
            </p>
          </div>
        </section>

        {/* Section 2: The Big Three */}
        <section>
          <h2 className="text-3xl font-serif text-reiki-cyan mb-6">Los Tres Grandes (Big Three)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-amber-400 mb-2">El Sol ☉</h3>
              <p className="text-slate-400 text-sm">
                Tu esencia, tu propósito vital y lo que vienes a iluminar en el mundo. Representa tu espíritu y vitalidad.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-slate-200 mb-2">La Luna ☽</h3>
              <p className="text-slate-400 text-sm">
                Tu mundo emocional, tu cuerpo físico y tus necesidades instintivas. Representa cómo te nutres y reaccionas.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-reiki-cyan mb-2">El Ascendente (AC)</h3>
              <p className="text-slate-400 text-sm">
                El timón de tu vida. Representa tu motivación principal, tu apariencia y la lente a través de la cual ves el mundo.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interpreting the Report */}
        <section>
          <h2 className="text-3xl font-serif text-reiki-cyan mb-4">Cómo leer tu reporte</h2>
          <p className="text-slate-300 mb-6">
            Al calcular tu carta, verás varias pestañas. La primera es "Carta Natal". Aquí encontrarás:
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-slate-800 p-3 rounded-full h-fit">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Datos Técnicos</h3>
                <p className="text-slate-400">
                  En la parte superior verás tu secta (Diurna o Nocturna). Esto es crucial en astrología tradicional porque determina qué planetas son más constructivos o difíciles para ti.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-slate-800 p-3 rounded-full h-fit">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Interpretaciones Detalladas</h3>
                <p className="text-slate-400">
                  Debajo verás tarjetas para cada planeta. Cada tarjeta te dice:
                </p>
                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1 ml-4">
                  <li>En qué <strong>Signo</strong> está (el "cómo" actúa).</li>
                  <li>En qué <strong>Casa</strong> está (el "dónde" actúa).</li>
                  <li>Si tiene <strong>Dignidad</strong> (si está fuerte o cómodo).</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">¿Por qué es importante la hora exacta?</h3>
          <p className="text-slate-300 mb-4">
            El Ascendente cambia de signo aproximadamente cada 2 horas. Una diferencia de 15 minutos puede cambiar todo tu mapa de casas, moviendo planetas a áreas de vida completamente diferentes.
          </p>
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Siempre verifica tu hora en tu certificado de nacimiento.</span>
          </div>
        </section>

      </div>
    </GuideLayout>
  );
};
