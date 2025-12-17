import React, { useState } from 'react';
import { BirthData, ChartData, ZODIAC_SIGNS } from './types';
import { calculateChart } from './services/astronomyService';
import { BirthForm } from './components/BirthForm';
import { PlanetList } from './components/PlanetList';
import { HouseList } from './components/HouseList';
import { ProfectionDisplay } from './components/ProfectionDisplay';
import { DetailedReport } from './components/DetailedReport';
import { ProfectionTimeline } from './components/ProfectionTimeline';
import { HermeticLotsReport } from './components/HermeticLotsReport';
import { ReikiReport } from './components/ReikiReport';
import { BigThreeReport } from './components/BigThreeReport';
import ImportantTransits from './components/ImportantTransits';
import { PositiveNegativeReport } from './components/PositiveNegativeReport';
import { analyzePositiveNegative } from './services/scoring';
import { Sparkles, Printer, FileText, CalendarClock, Lock, HeartPulse, Hourglass, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'natal' | 'profection' | 'lots' | 'reiki' | 'transits' | 'positive-negative'>('natal');

  const handleBirthDataSubmit = (data: BirthData) => {
    setLoading(true);
    setChartData(null);
    setBirthData(data);
    setActiveTab('natal');

    // Simulate a brief calculation time for UX
    setTimeout(async () => {
        try {
            const calculatedChart = await calculateChart(data);
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

            {/* Tab Navigation (Screen Only) */}
            <div className="print:hidden flex flex-wrap justify-center gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('natal')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'natal' ? 'bg-reiki-cyan text-slate-900 shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <FileText className="w-4 h-4" /> Carta Natal
                </button>
                <button
                    onClick={() => setActiveTab('profection')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'profection' ? 'bg-reiki-magenta text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <CalendarClock className="w-4 h-4" /> Profecciones
                </button>
                <button
                    onClick={() => setActiveTab('lots')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'lots' ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <Lock className="w-4 h-4" /> Partes Herméticas
                </button>
                <button
                    onClick={() => setActiveTab('reiki')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'reiki' ? 'bg-green-500 text-slate-900 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <HeartPulse className="w-4 h-4" /> Reiki y Salud
                </button>
                <button
                    onClick={() => setActiveTab('transits')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'transits' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <Hourglass className="w-4 h-4" /> Tránsitos
                </button>
                <button
                    onClick={() => setActiveTab('positive-negative')}
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${activeTab === 'positive-negative' ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                   <Scale className="w-4 h-4" /> Positivo / Negativo
                </button>
            </div>

            {/* Content Areas */}
            
            {/* Natal Chart View */}
            {(activeTab === 'natal' || loading) && ( // keep visible during loading if needed, but loading state handles that
               <div className={`space-y-6 ${activeTab !== 'natal' ? 'hidden print:block' : ''}`}>
                   {/* Top: Big Three Report */}
                   <BigThreeReport data={chartData} />

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
               </div>
            )}

            {/* Profection View */}
            {activeTab === 'profection' && (
                <div className="space-y-6 animate-fade-in">
                    <ProfectionDisplay data={chartData.profection} />
                    <ProfectionTimeline data={chartData} />
                </div>
            )}

            {/* Hermetic Lots View */}
            {activeTab === 'lots' && (
                <div className="animate-fade-in">
                    <HermeticLotsReport lots={chartData.hermeticLots} zodiacSigns={ZODIAC_SIGNS} />
                </div>
            )}

            {/* Reiki Report View */}
            {activeTab === 'reiki' && (
                <div className="animate-fade-in">
                   <ReikiReport data={chartData} />
                </div>
            )}

            {/* Important Transits View */}
            {activeTab === 'transits' && birthData && (
                <div className="animate-fade-in">
                   <ImportantTransits birthData={birthData} />
                </div>
            )}

            {/* Positive/Negative View */}
            {activeTab === 'positive-negative' && chartData && (
                <div className="animate-fade-in">
                   <PositiveNegativeReport analysis={analyzePositiveNegative(chartData)} />
                </div>
            )}
            
            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-slate-800 print:hidden pb-12 mt-8">
                <button 
                  onClick={handlePrint}
                  className="px-8 py-3 bg-reiki-card border border-reiki-cyan/30 text-reiki-cyan rounded-xl hover:bg-reiki-cyan/10 hover:border-reiki-cyan transition-all uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                >
                  <Printer className="w-4 h-4" /> Imprimir Vista Actual (PDF)
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