import React from 'react';
import { PositiveNegativeAnalysis, ScoredPlanet, ConditionDetail } from '../types';

interface Props {
  analysis: PositiveNegativeAnalysis;
}

const PlanetCard: React.FC<{
  title: string;
  planet: ScoredPlanet;
  isPositive: boolean;
}> = ({ title, planet, isPositive }) => {
  const borderColor = isPositive ? 'border-green-500' : 'border-red-500';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const headerColor = isPositive ? 'text-green-800' : 'text-red-800';
  const scoreColor = isPositive ? 'text-green-600' : 'text-red-600';

  const positiveDetails = planet.details.filter(d => d.type === 'Positive');
  const negativeDetails = planet.details.filter(d => d.type === 'Negative');

  return (
    <div className={`border-2 ${borderColor} rounded-lg p-6 shadow-md ${bgColor} flex flex-col h-full`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2 border-opacity-20 border-black">
        <h3 className={`text-xl font-bold ${headerColor} uppercase tracking-wide`}>{title}</h3>
        <div className={`text-3xl font-extrabold ${scoreColor}`}>{planet.totalScore}</div>
      </div>

      <div className="mb-4">
        {/* Planet Name and Status Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-800">{planet.planetName}</span>

          {/* Status Badge */}
          {planet.status && (
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
               planet.status === 'Potente' || planet.status === 'Constructivo / Domesticado' ? 'bg-green-200 text-green-800' :
               planet.status === 'Impedido' || planet.status === 'Difícil' ? 'bg-red-200 text-red-800' :
               planet.status === 'Desconectado / Oculto' ? 'bg-gray-700 text-white' :
               'bg-yellow-200 text-yellow-800'
            }`}>
               {planet.status}
            </span>
          )}
        </div>

        {/* Description */}
        {planet.scoreDescription && (
            <p className="mt-2 text-sm text-gray-700 italic border-l-2 border-gray-300 pl-2">
                "{planet.scoreDescription}"
            </p>
        )}

        {/* Disconnected Warning */}
        {planet.isAvertedToLight && isPositive && (
             <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1">
                 ⚠️ Aversión a la Luz de la Secta (No puede ver al líder)
             </div>
        )}

        {/* Alternate Suggestion (Only for Positive typically) */}
        {isPositive && planet.alternateSuggestion && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
                <span className="font-bold block mb-1">💡 Sugerencia Alternativa: {planet.alternateSuggestion.planetName} (Score: {planet.alternateSuggestion.score})</span>
                {planet.alternateSuggestion.reason}
            </div>
        )}
      </div>

      <div className="flex-grow space-y-4 mt-4">
        {positiveDetails.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-700 text-sm uppercase mb-1">Fortalezas / Bonificaciones</h4>
            <ul className="text-sm space-y-1">
              {positiveDetails.map((d, idx) => (
                <li key={idx} className="flex justify-between text-gray-700">
                  <span>{d.description}</span>
                  <span className="font-bold text-green-600">+{d.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {negativeDetails.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-700 text-sm uppercase mb-1">Debilidades / Maltratos</h4>
            <ul className="text-sm space-y-1">
              {negativeDetails.map((d, idx) => (
                <li key={idx} className="flex justify-between text-gray-700">
                  <span>{d.description}</span>
                  <span className="font-bold text-red-600">{d.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {planet.details.length === 0 && (
            <p className="text-sm text-gray-500 italic">No se encontraron condiciones especiales.</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
        Puntuación Base: {planet.baseScore}
      </div>
    </div>
  );
};

export const PositiveNegativeReport: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
        <p className="text-blue-800 font-medium">
          Secta del Mapa: <span className="font-bold uppercase">{analysis.sect}</span>
        </p>
        <p className="text-sm text-blue-600 mt-1">
          {analysis.sect === 'Diurna'
            ? `El Sol está por encima del horizonte. La Luz de la Secta es el Sol. Júpiter es el benéfico de la secta y Marte es el maléfico contrario.`
            : `El Sol está por debajo del horizonte. La Luz de la Secta es la Luna. Venus es el benéfico de la secta y Saturno es el maléfico contrario.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanetCard
          title="Planeta Más Positivo"
          planet={analysis.mostPositive}
          isPositive={true}
        />
        <PlanetCard
          title="Planeta Más Negativo"
          planet={analysis.mostNegative}
          isPositive={false}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded border text-sm text-gray-600 mt-8">
        <h4 className="font-bold mb-2">Nota sobre el cálculo:</h4>
        <p>
          Este reporte utiliza un algoritmo basado en la Astrología Helenística para evaluar la condición planetaria.
          Se consideran la dignidad esencial, la ubicación por casa (incluyendo gozos), la fase solar y las configuraciones de aspecto (bonificación y maltrato)
          con orbes estrictos (3°).
        </p>
      </div>
    </div>
  );
};
