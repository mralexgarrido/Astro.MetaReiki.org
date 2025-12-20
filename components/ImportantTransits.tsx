import React from 'react';
import { Loader } from 'lucide-react';
import { BirthData, TransitEvent } from '../types';
import { useTransits } from '../hooks/useTransits';

interface ImportantTransitsProps {
  birthData: BirthData;
}

const ImportantTransits: React.FC<ImportantTransitsProps> = ({ birthData }) => {
  const { events, loading, error } = useTransits(birthData);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-reiki-light-gray">
        <Loader className="w-8 h-8 animate-spin mb-4 text-reiki-magenta" />
        <p>Calculando tránsitos importantes de vida (esto puede tardar unos segundos)...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 bg-red-900/20 rounded-xl border border-red-900/50">
        <p>Hubo un error al calcular los tránsitos.</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-reiki-light-gray">
        No se encontraron tránsitos importantes en el periodo analizado.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn break-before-page">
      <div className="bg-reiki-card border border-reiki-border rounded-xl p-6 shadow-lg print:border-none print:shadow-none print:bg-white print:text-black">
        <h2 className="text-xl font-serif text-reiki-gold mb-2 print:text-black">Tránsitos Importantes</h2>
        <p className="text-reiki-light-gray mb-6 print:text-gray-600">
          Eventos astrológicos clave que marcan ciclos de crecimiento, madurez y evolución a lo largo de tu vida.
        </p>

        <div className="relative border-l-2 border-reiki-border ml-3 md:ml-6 space-y-8 print:border-gray-300">
          {events.map((event, index) => (
            <div key={index} className="relative pl-8 md:pl-12 break-inside-avoid">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-reiki-magenta border-2 border-reiki-dark-bg print:bg-black print:border-white" />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <span className="text-reiki-magenta font-mono font-bold text-lg print:text-black">
                  {event.date}
                </span>
                <h3 className="text-lg font-serif text-white print:text-black">
                  {event.type}
                </h3>
              </div>

              <div className="text-sm text-reiki-gold/80 mb-2 font-medium print:text-gray-800">
                {event.planetName} conjunción Natal (Casa {event.house})
              </div>

              <div className="bg-reiki-dark-bg/50 p-4 rounded-lg border border-white/5 print:bg-gray-50 print:border-gray-200">
                <p className="text-reiki-light-gray text-sm leading-relaxed print:text-black whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportantTransits;
