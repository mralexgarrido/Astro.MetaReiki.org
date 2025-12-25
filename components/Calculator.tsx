import React, { useState, useEffect } from 'react';
import { BirthData, ChartData, ZODIAC_SIGNS } from '../types';
import { calculateChart } from '../services/astronomyService';
import { BirthForm } from './BirthForm';
import { PlanetList } from './PlanetList';
import { HouseList } from './HouseList';
import { ProfectionDisplay } from './ProfectionDisplay';
import { DetailedReport } from './DetailedReport';
import { ProfectionTimeline } from './ProfectionTimeline';
import { HermeticLotsReport } from './HermeticLotsReport';
import { ReikiReport } from './ReikiReport';
import { BigThreeReport } from './BigThreeReport';
import ImportantTransits from './ImportantTransits';
import { PositiveNegativeReport } from './PositiveNegativeReport';
import { AboutSection } from './AboutSection';
import { analyzePositiveNegative } from '../services/scoring';
import { Printer, FileText, CalendarClock, Lock, HeartPulse, Hourglass, Scale, FileStack } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') as 'natal' | 'profection' | 'lots' | 'reiki' | 'transits' | 'positive-negative' | null;

  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'natal' | 'profection' | 'lots' | 'reiki' | 'transits' | 'positive-negative'>('natal');
  const [isPrintingFullReport, setIsPrintingFullReport] = useState(false);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

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

  const handlePrintFullReport = () => {
    setIsPrintingFullReport(true);
    // Wait for the state to update and render the full report before printing
    // We use a small timeout to allow React to repaint
    setTimeout(() => {
        window.print();
        // We can't automatically unset isPrintingFullReport because window.print() is blocking in many browsers,
        // but not all. The 'afterprint' event is cleaner.
    }, 100);
  };

  useEffect(() => {
    const afterPrint = () => {
      setIsPrintingFullReport(false);
    };
    window.addEventListener('afterprint', afterPrint);
    return () => {
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  return (
    // 'print:bg-white print:text-black' overrides global body dark mode styles
    // IMPORTANT: print:h-auto and print:overflow-visible are crucial for multi-page printing
    <div className="animate-fade-in pb-20 print:bg-white print:text-black print:pb-0 print:h-auto print:overflow-visible print:static print:w-full print:block">

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 max-w-7xl print:max-w-none print:px-4 print:py-0 mt-8 print:mt-0 print:block">

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
          <div className="animate-fade-in space-y-6 print:space-y-4 print:block">

            {/* Print Header */}
            <div className="hidden print:block text-center mb-4 border-b border-black pb-2 pt-2">
                <h1 className="text-2xl font-bold text-black mb-1">METAREIKI.ORG</h1>
                <h2 className="text-xl font-serif text-gray-800">Reporte Astrológico de {chartData.name}</h2>
                <p className="text-xs text-gray-600 mt-1">Generado el {new Date().toLocaleDateString()}</p>
            </div>

            {/* Screen Header for Name */}
            <div className="print:hidden text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-white">Carta de <span className="text-reiki-cyan font-bold">{chartData.name}</span></h2>
            </div>

            {/* Tab Navigation (Screen Only) */}
            <div className="print:hidden flex flex-wrap justify-center gap-2 mb-4">
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

            {/* Guide Link for Active Tab */}
            <div className="print:hidden flex justify-center mb-8">
               {activeTab === 'natal' && (
                 <Link to="/biblioteca/guias/carta-natal" className="text-xs text-reiki-cyan hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                    <HelpCircle className="w-3 h-3" /> ¿Cómo interpretar mi Carta Natal?
                 </Link>
               )}
               {activeTab === 'profection' && (
                 <Link to="/biblioteca/guias/profecciones" className="text-xs text-reiki-magenta hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                    <HelpCircle className="w-3 h-3" /> ¿Cómo funcionan las Profecciones?
                 </Link>
               )}
               {activeTab === 'lots' && (
                 <Link to="/biblioteca/guias/partes-hermeticas" className="text-xs text-amber-500 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                    <HelpCircle className="w-3 h-3" /> ¿Qué son las Partes Herméticas?
                 </Link>
               )}
               {activeTab === 'reiki' && (
                 <Link to="/biblioteca/guias/reiki" className="text-xs text-green-500 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                    <HelpCircle className="w-3 h-3" /> Astrología Médica y Chakras
                 </Link>
               )}
               {activeTab === 'transits' && (
                 <Link to="/biblioteca/guias/transitos" className="text-xs text-purple-400 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
                    <HelpCircle className="w-3 h-3" /> Guía de Tránsitos Importantes
                 </Link>
               )}
            </div>

            {/* Content Areas */}

            {/* Natal Chart View */}
            {(activeTab === 'natal' || isPrintingFullReport || loading) && (
               <div className={`space-y-6 print:space-y-4 ${activeTab !== 'natal' && !isPrintingFullReport ? 'hidden' : ''}`}>
                   {/* Top: Big Three Report */}
                   <BigThreeReport data={chartData} />

                   {/* Middle: Summary Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:gap-0 print:space-y-4">
                        <div className="print:break-inside-avoid print:mb-4">
                            <PlanetList data={chartData} />
                        </div>
                        <div className="print:break-inside-avoid">
                            <HouseList data={chartData} />
                        </div>
                    </div>

                    {/* Bottom: Detailed Report */}
                    <div className="print:mt-4">
                        <DetailedReport data={chartData} />
                    </div>
               </div>
            )}

            {/* Profection View */}
            {(activeTab === 'profection' || isPrintingFullReport) && (
                <div className={`space-y-6 animate-fade-in ${isPrintingFullReport ? 'print:break-before-page' : ''}`}>
                    {isPrintingFullReport && <h2 className="hidden print:block text-2xl font-bold text-black border-b border-black pb-2 mb-4">Profecciones Anuales</h2>}
                    <ProfectionDisplay data={chartData.profection} />
                    <ProfectionTimeline data={chartData} />
                </div>
            )}

            {/* Hermetic Lots View */}
            {(activeTab === 'lots' || isPrintingFullReport) && (
                <div className={`animate-fade-in ${isPrintingFullReport ? 'print:break-before-page' : ''}`}>
                    {isPrintingFullReport && <h2 className="hidden print:block text-2xl font-bold text-black border-b border-black pb-2 mb-4">Partes Herméticas</h2>}
                    <HermeticLotsReport lots={chartData.hermeticLots} zodiacSigns={ZODIAC_SIGNS} />
                </div>
            )}

            {/* Reiki Report View */}
            {(activeTab === 'reiki' || isPrintingFullReport) && (
                <div className={`animate-fade-in ${isPrintingFullReport ? 'print:break-before-page' : ''}`}>
                   {isPrintingFullReport && <h2 className="hidden print:block text-2xl font-bold text-black border-b border-black pb-2 mb-4">Reiki y Salud</h2>}
                   <ReikiReport data={chartData} />
                </div>
            )}

            {/* Important Transits View */}
            {(activeTab === 'transits' || isPrintingFullReport) && birthData && (
                <div className={`animate-fade-in ${isPrintingFullReport ? 'print:break-before-page' : ''}`}>
                   {isPrintingFullReport && <h2 className="hidden print:block text-2xl font-bold text-black border-b border-black pb-2 mb-4">Tránsitos Importantes</h2>}
                   <ImportantTransits birthData={birthData} />
                </div>
            )}

            {/* Positive/Negative View */}
            {(activeTab === 'positive-negative' || isPrintingFullReport) && chartData && (
                <div className={`animate-fade-in ${isPrintingFullReport ? 'print:break-before-page' : ''}`}>
                   {isPrintingFullReport && <h2 className="hidden print:block text-2xl font-bold text-black border-b border-black pb-2 mb-4">Análisis Positivo / Negativo</h2>}
                   <PositiveNegativeReport analysis={analyzePositiveNegative(chartData)} />
                </div>
            )}

            {/* Footer Buttons */}
            <div className="flex flex-col items-center gap-4 pt-8 border-t border-slate-800 print:hidden pb-12 mt-8">
                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                    <button
                    onClick={handlePrint}
                    className="px-8 py-3 bg-reiki-card border border-reiki-cyan/30 text-reiki-cyan rounded-xl hover:bg-reiki-cyan/10 hover:border-reiki-cyan transition-all uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,255,0.1)] hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                    >
                    <Printer className="w-4 h-4" /> Imprimir Vista Actual
                    </button>

                    <button
                    onClick={() => setChartData(null)}
                    className="px-8 py-3 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm font-medium"
                    >
                    Nueva Carta
                    </button>
                </div>

                {/* Secondary Action: Full Report Print */}
                <button
                  onClick={handlePrintFullReport}
                  className="mt-2 px-4 py-2 text-slate-500 hover:text-slate-300 transition-all uppercase tracking-widest text-xs font-medium flex items-center justify-center gap-2 opacity-70 hover:opacity-100"
                >
                  <FileStack className="w-3 h-3" /> Imprimir Reporte Completo (Lento)
                </button>
            </div>

          </div>
        )}
      </div>

      {/* SEO / About Section - Always visible at bottom, but hidden in print */}
      <AboutSection />
    </div>
  );
};
