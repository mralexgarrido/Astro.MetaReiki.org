import React from 'react';
import { ChartData, ZODIAC_SIGNS } from '../types';
import { calculateProfectionByAge } from '../services/astronomyService';
// import { generateProfectionInterpretation } from '../services/interpretations'; // Removed
import { Hourglass } from 'lucide-react';
import { TimelineItem } from './TimelineItem';

interface Props {
  data: ChartData;
}

export const ProfectionTimeline: React.FC<Props> = ({ data }) => {
  const currentAge = data.profection.age;
  // Calculate range: Current Age - 6 to Current Age + 6
  // Total 13 items
  const startAge = currentAge - 6;
  const endAge = currentAge + 6;

  const birthDate = new Date(data.birthDate);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const getProfectionDateRange = (age: number) => {
      const startYear = birthDate.getFullYear() + age;
      const endYear = startYear + 1;
      const monthIndex = birthDate.getMonth(); // 0-based
      const monthName = months[monthIndex];

      return `${monthName} ${startYear} - ${monthName} ${endYear}`;
  };

  const timelineItems = [];
  for (let age = startAge; age <= endAge; age++) {
     if (age < 0) continue; // Skip negative ages just in case

     // We need the Ascendant Sign ID to calculate.
     // data.ascendant.signId is reliable.
     const profection = calculateProfectionByAge(age, data.ascendant.signId);
     const sign = ZODIAC_SIGNS[profection.signId];

     timelineItems.push({
         ...profection,
         signName: sign.name,
         signSymbol: sign.symbol,
         dateRange: getProfectionDateRange(age),
         // Interpretation is now fetched inside TimelineItem
     });
  }

  return (
    <div className="bg-reiki-card/80 backdrop-blur border border-slate-800 rounded-xl p-8 mt-8 print:bg-white print:text-black print:border-none print:shadow-none break-before-page">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4 print:border-black">
        <Hourglass className="w-6 h-6 text-reiki-cyan print:text-black" />
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest print:text-black">
            LÍNEA DE TIEMPO DE PROFECCIONES
        </h2>
      </div>

      <p className="text-slate-400 italic mb-6 print:text-gray-600">
          Un mapa de tus ciclos de tiempo pasados y futuros. La Profección Anual resalta una casa específica cada año, activando sus temas y trayendo al frente a su regente como el "Señor del Tiempo".
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelineItems.map((item) => {
              const isCurrent = item.age === currentAge;

              return (
                  <TimelineItem
                    key={item.age}
                    item={item}
                    isCurrent={isCurrent}
                    isDayChart={data.isDayChart}
                  />
              );
          })}
      </div>
    </div>
  );
};
