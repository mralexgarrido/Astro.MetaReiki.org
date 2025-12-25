import React from 'react';
import { GuideLayout } from './GuideLayout';
import { Heart, Zap, Leaf } from 'lucide-react';

export const ReikiGuide: React.FC = () => {
  return (
    <GuideLayout
      title="Guía de Reiki y Salud Astrológica"
      description="Combina la sabiduría astrológica con el sistema de Chakras. Identifica bloqueos energéticos y encuentra remedios vibracionales."
      image="/assets/guides/reiki.png"
    >
      <div className="space-y-12">

        <section>
          <h2 className="text-3xl font-serif text-green-500 mb-4">Astrología Médica y Energética</h2>
          <p className="text-slate-300 mb-6">
            Desde la antigüedad, cada signo del zodiaco se ha asociado a una parte del cuerpo. En MetaReiki, llevamos esto un paso más allá conectando los planetas difíciles con los Chakras (centros de energía) que podrían necesitar atención.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-green-500/10 p-4 rounded-xl shrink-0">
              <Zap className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Detección de Bloqueos</h3>
              <p className="text-slate-400">
                El sistema analiza tus planetas "Maléficos" (Saturno y Marte, y a veces otros dependiendo de los aspectos). Si Saturno está en Leo, por ejemplo, podría indicar una restricción en el flujo del Chakra Corazón o Plexo Solar, manifestándose como problemas de espalda o corazón, o rigidez emocional.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-green-500/10 p-4 rounded-xl shrink-0">
              <Leaf className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Remedios Vibracionales</h3>
              <p className="text-slate-400">
                Para cada configuración difícil, ofrecemos sugerencias de:
              </p>
              <ul className="grid grid-cols-2 gap-2 mt-4 text-sm text-slate-300">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Cristales y Gemas</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Aromaterapia</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Afirmaciones</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Prácticas de Reiki</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Nota de Responsabilidad</h3>
          <p className="text-slate-400 text-sm">
            Esta herramienta es para fines de autoconocimiento y bienestar energético. <strong>No sustituye el consejo médico profesional.</strong> Si tienes síntomas físicos, consulta siempre a un médico. La astrología médica tradicional es un complemento holístico, no un diagnóstico clínico.
          </p>
        </section>

      </div>
    </GuideLayout>
  );
};
