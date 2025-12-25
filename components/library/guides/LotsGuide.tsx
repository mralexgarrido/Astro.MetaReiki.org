import React from 'react';
import { GuideLayout } from './GuideLayout';
import { Sparkles, Scale, Target, Shield, Heart } from 'lucide-react';

export const LotsGuide: React.FC = () => {
  return (
    <GuideLayout
      title="Guía de Partes Herméticas"
      description="Más allá de los planetas. Explora los puntos matemáticos árabes y helenísticos que revelan el destino en áreas específicas de la vida."
      image="/assets/guides/lots.png"
    >
      <div className="space-y-12">

        <section>
          <h2 className="text-3xl font-serif text-purple-500 mb-4">¿Qué son las "Partes" o "Lotes"?</h2>
          <p className="text-slate-300 mb-4">
            También conocidos como "Partes Arábigas", son puntos matemáticos calculados tomando la distancia entre dos planetas y proyectándola desde el Ascendente.
          </p>
          <p className="text-slate-300">
            En la antigüedad, se usaban para responder preguntas muy específicas que los planetas generales no podían contestar. Por ejemplo: "¿De dónde vendrá mi fortuna material?" o "¿Cuál es la naturaleza de mi espíritu?".
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Parte de la Fortuna</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Relacionada con el cuerpo físico, la salud, y la prosperidad material "que te sucede" (suerte, circunstancias externas).
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-white" />
              <h3 className="text-xl font-bold text-white">Parte del Espíritu</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Tu voluntad, tus elecciones de carrera y lo que "tú haces" en el mundo. Es el contrapunto activo a la Fortuna pasiva.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-pink-400" />
              <h3 className="text-xl font-bold text-white">Parte del Eros</h3>
            </div>
            <p className="text-slate-400 text-sm">
              El amor, la amistad y los deseos sociales. Indica dónde y cómo encuentras conexión con otros.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-red-400" />
              <h3 className="text-xl font-bold text-white">Parte de la Necesidad</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Las luchas, los enemigos y las obligaciones ineludibles. Revela dónde encuentras resistencia.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-serif text-purple-500 mb-6">Fórmulas Diurnas vs. Nocturnas</h2>
          <p className="text-slate-300 mb-4">
            Una característica clave de nuestra calculadora es que respeta la "Secta". La mayoría de las fórmulas de las Partes se invierten si naciste de noche.
          </p>
          <div className="bg-slate-800 p-6 rounded-xl">
            <p className="text-slate-400 text-sm font-mono">
              Ejemplo Fortuna:<br/>
              Día: Asc + Luna - Sol<br/>
              Noche: Asc + Sol - Luna
            </p>
            <p className="mt-4 text-slate-300">
              Muchos sitios web modernos usan la fórmula diurna para todo el mundo, dando resultados incorrectos para el 50% de las personas. Nosotros ajustamos esto automáticamente.
            </p>
          </div>
        </section>

      </div>
    </GuideLayout>
  );
};
