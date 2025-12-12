import React, { useState } from 'react';
import { BirthData, ChartData } from './types';
import { calculateChart } from './services/astronomyService';
import { BirthForm } from './components/BirthForm';
import { PlanetList } from './components/PlanetList';
import { HouseList } from './components/HouseList';
import { ProfectionDisplay } from './components/ProfectionDisplay';
import { DetailedReport } from './components/DetailedReport';
import { ProfectionTimeline } from './components/ProfectionTimeline';
import { Sparkles, Printer } from 'lucide-react';

const App: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBirthDataSubmit = (data: BirthData) => {
    setLoading(true);
    setChartData(null);

    // Simulate a brief calculation time for UX
    setTimeout(() => {
        try {
            const calculatedChart = calculateChart(data);
            setChartData(calculatedChart);
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al calcular la carta.");
        } finally {
            setLoading(false);
        }
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    // 'print:bg-white print:text-black' overrides global body dark mode styles
    // IMPORTANT: print:h-auto and print:overflow-visible are crucial for multi-page printing
    <div className="min-h-screen text-slate-200 font-sans selection:bg-reiki-cyan/30 pb-20 print:bg-white print:text-black print:pb-0 print:h-auto print:overflow-visible print:static print:w-full print:block">
      
      {/* Header */}
      <header className="p-6 text-center relative z-10 print:hidden border-b border-reiki-cyan/10 bg-reiki-dark/50 backdrop-blur-sm">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          {/* Logo Placeholder / Icon */}
          <Sparkles className="text-reiki-cyan w-6 h-6 animate-pulse-slow" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-reiki-cyan font-sans drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">
            METAREIKI.ORG
          </h1>
          <Sparkles className="text-reiki-magenta w-6 h-6 animate-pulse-slow" />
        </div>
        <p className="text-reiki-cyan text-xs md:text-sm tracking-[0.2em] uppercase font-medium">Astrología de Signos Enteros • Motor de Precisión</p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10 max-w-7xl print:max-w-none print:px-0 print:py-0 mt-8 print:mt-0 print:block">
        
        {!chartData && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up print:hidden">
            <BirthForm onSubmit={handleBirthDataSubmit} isLoading={loading} />
          </div>
        )}

        {loading && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] print:hidden">
             <div className="relative w-20 h-20 mb-4">
               <div className="absolute inset-0 border-4 border-reiki-cyan/30 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-reiki-cyan rounded-full animate-spin"></div>
             </div>
             <p className="text-reiki-cyan font-serif animate-pulse tracking-widest">Alineando las esferas...</p>
           </div>
        )}

        {chartData && !loading && (
          <div className="animate-fade-in space-y-6 print:space-y-0 print:block">
            
            {/* Print Header */}
            <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4 pt-4">
                <h1 className="text-4xl font-bold text-black mb-2">METAREIKI.ORG</h1>
                <h2 className="text-2xl font-serif text-gray-800">Reporte Astrológico de {chartData.name}</h2>
                <p className="text-sm text-gray-600 mt-1">Generado el {new Date().toLocaleDateString()}</p>
            </div>

            {/* Screen Header for Name */}
            <div className="print:hidden text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-white">Carta de <span className="text-reiki-cyan font-bold">{chartData.name}</span></h2>
            </div>

            {/* Top: Profection (Full Width) */}
            <div className="print:mb-8 print:break-inside-avoid">
               <ProfectionDisplay data={chartData.profection} />
            </div>
            
            {/* Middle: Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:gap-0 print:space-y-8">
                <div className="print:border print:border-gray-300 print:rounded-none print:p-0 print:break-inside-avoid">
                    <PlanetList data={chartData} />
                </div>
                <div className="print:border print:border-gray-300 print:rounded-none print:p-0 print:break-inside-avoid">
                    <HouseList data={chartData} />
                </div>
            </div>

            {/* Bottom: Detailed Report */}
            <div className="print:mt-8">
                <DetailedReport data={chartData} />
            </div>

            {/* Timeline Report */}
            <div className="print:mt-8">
               <ProfectionTimeline data={chartData} />
            </div>
            
            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-800 print:hidden pb-12">
                <button 
                  onClick={handlePrint}
                  className="px-8 py-3 bg-reiki-card border border-reiki-cyan/30 text-reiki-cyan rounded-xl hover:bg-reiki-cyan/10 hover:border-reiki-cyan transition-all uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                >
                  <Printer className="w-4 h-4" /> Imprimir Reporte (PDF)
                </button>

                <button 
                  onClick={() => setChartData(null)}
                  className="px-8 py-3 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm font-medium"
                >
                  Nueva Carta
                </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;