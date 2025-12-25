import React from 'react';
import { GuideLayout } from './GuideLayout';
import { RefreshCw, ArrowUpCircle, AlertTriangle } from 'lucide-react';

export const TransitsGuide: React.FC = () => {
  return (
    <GuideLayout
      title="Guía de Tránsitos Importantes"
      description="No todos los tránsitos son iguales. Aprende a distinguir el ruido de fondo de los eventos que cambian vidas, como el Retorno de Saturno."
      image="/assets/guides/transits.png"
    >
      <div className="space-y-12">

        <section>
          <h2 className="text-3xl font-serif text-indigo-400 mb-4">Eventos Mayores vs. Tránsitos Diarios</h2>
          <p className="text-slate-300 mb-6">
            La mayoría de las apps de astrología te bombardean con "La Luna cuadratura a tu Marte" cada dos días. Eso es ruido. Nuestra herramienta de Tránsitos Importantes filtra todo eso para mostrarte solo los eventos estructurales de tu vida.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Retornos Planetarios</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Ocurren cuando un planeta lento vuelve al lugar exacto donde estaba cuando naciste.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong>Retorno de Saturno (29-30 años):</strong> Madurez, responsabilidad, estructuración de la vida adulta.</li>
              <li><strong>Retorno de Júpiter (12, 24, 36...):</strong> Nuevos ciclos de crecimiento y oportunidades.</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <ArrowUpCircle className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Tránsitos al Ascendente</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Cuando un planeta lento cruza tu Ascendente (pasa de la Casa 12 a la 1), es un reinicio total de tu identidad y vitalidad.
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><strong>Plutón al Asc:</strong> Transformación radical de la personalidad.</li>
              <li><strong>Urano al Asc:</strong> Cambios repentinos, liberación, rebeldía.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-indigo-400 mb-6">Cómo leer la línea de tiempo</h2>
          <div className="bg-slate-800/50 p-6 rounded-xl">
            <h4 className="font-bold text-white mb-2">Fases Retrógradas</h4>
            <p className="text-slate-300 mb-4">
              Verás que muchos eventos tienen 3 fechas. Esto es porque los planetas retrogradan.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-400">
              <li><strong>Primer Contacto:</strong> El tema se presenta. El "shock" inicial o la novedad.</li>
              <li><strong>Segundo Contacto (Rx):</strong> El planeta vuelve hacia atrás sobre el punto. Revisión, internalización y duda.</li>
              <li><strong>Contacto Final:</strong> Resolución. El planeta avanza definitivamente y el tema se integra en tu vida.</li>
            </ol>
          </div>
        </section>

        <div className="flex items-center gap-4 bg-indigo-500/10 p-6 rounded-xl border border-indigo-500/30">
          <AlertTriangle className="w-8 h-8 text-indigo-400" />
          <p className="text-slate-300 text-sm">
            Recuerda: Los tránsitos no son "sentencias", son climas. Saber que va a llover (un tránsito de Saturno) te permite llevar paraguas, no evita la lluvia, pero evita que te mojes y sufras.
          </p>
        </div>

      </div>
    </GuideLayout>
  );
};
