import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight, Loader } from 'lucide-react';
import { BirthData, TransitEvent } from '../types';
import { calculateKeyReturns } from '../services/astronomyService';

interface ImportantTransitsProps {
  birthData: BirthData;
}

const ImportantTransits: React.FC<ImportantTransitsProps> = ({ birthData }) => {
  const [events, setEvents] = useState<TransitEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true);
      try {
        const calculatedEvents = await calculateKeyReturns(birthData);
        setEvents(calculatedEvents);
      } catch (error) {
        console.error("Error calculating returns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [birthData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-reiki-light-gray">
        <Loader className="w-8 h-8 animate-spin mb-4 text-reiki-magenta" />
        <p>Calculando tránsitos importantes de vida...</p>
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
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-reiki-card border border-reiki-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-serif text-reiki-gold mb-2">Tránsitos Importantes</h2>
        <p className="text-reiki-light-gray mb-6">
          Eventos astrológicos clave que marcan ciclos de crecimiento, madurez y evolución a lo largo de tu vida.
        </p>

        <div className="relative border-l-2 border-reiki-border ml-3 md:ml-6 space-y-8">
          {events.map((event, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-reiki-magenta border-2 border-reiki-dark-bg" />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <span className="text-reiki-magenta font-mono font-bold text-lg">
                  {event.date}
                </span>
                <h3 className="text-lg font-serif text-white">
                  {event.type}
                </h3>
              </div>

              <div className="text-sm text-reiki-gold/80 mb-2 font-medium">
                {event.planetName} conjunción Natal (Casa {event.house})
              </div>

              <div className="bg-reiki-dark-bg/50 p-4 rounded-lg border border-white/5">
                <p className="text-reiki-light-gray text-sm leading-relaxed">
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
