import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-reiki-cyan/30 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center relative z-10 print:hidden border-b border-reiki-cyan/10 bg-reiki-dark/50 backdrop-blur-sm">
        <Link to="/" className="inline-flex items-center justify-center gap-3 mb-2 hover:opacity-80 transition-opacity">
          <Sparkles className="text-reiki-cyan w-6 h-6 animate-pulse-slow" />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-reiki-cyan font-sans drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">
            METAREIKI.ORG
          </h1>
          <Sparkles className="text-reiki-magenta w-6 h-6 animate-pulse-slow" />
        </Link>
        <p className="text-reiki-cyan text-xs md:text-sm tracking-[0.2em] uppercase font-medium">Astrología de Signos Enteros • Motor de Precisión</p>
      </header>

      {/* Breadcrumb / Back Button (conditionally rendered) */}
      {!isHome && (
        <div className="container mx-auto px-4 mt-4 print:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-reiki-cyan/70 hover:text-reiki-cyan transition-colors text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Volver a la Calculadora
            </Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer / Sitemap */}
      <footer className="border-t border-slate-800 bg-reiki-card/50 mt-12 py-12 print:hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-reiki-cyan font-serif font-bold mb-4">Calculadoras</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li><Link to="/carta-natal" className="hover:text-white transition-colors">Carta Natal</Link></li>
                    <li><Link to="/profecciones" className="hover:text-white transition-colors">Profecciones</Link></li>
                    <li><Link to="/transitos" className="hover:text-white transition-colors">Tránsitos</Link></li>
                    <li><Link to="/reiki-salud" className="hover:text-white transition-colors">Reiki y Salud</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-reiki-cyan font-serif font-bold mb-4">Biblioteca</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li><Link to="/biblioteca" className="hover:text-white transition-colors">Índice General</Link></li>
                    <li><Link to="/biblioteca/planetas" className="hover:text-white transition-colors">Planetas</Link></li>
                    <li><Link to="/biblioteca/signos" className="hover:text-white transition-colors">Signos del Zodiaco</Link></li>
                    <li><Link to="/biblioteca/casas" className="hover:text-white transition-colors">Casas Astrológicas</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="text-reiki-cyan font-serif font-bold mb-4">Legal</h3>
                <ul className="space-y-2 text-slate-400 text-sm">
                    <li><a href="https://metareiki.org/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                    <li><a href="https://metareiki.org/terminos" className="hover:text-white transition-colors">Términos de Uso</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-reiki-cyan font-serif font-bold mb-4">MetaReiki</h3>
                <p className="text-slate-500 text-sm mb-4">
                    Astrología Helenística tradicional adaptada a la era moderna. Precisión suiza, interpretación humana.
                </p>
                <div className="flex gap-4">
                    {/* Social Icons Placeholder */}
                </div>
            </div>
        </div>
        <div className="text-center mt-12 text-slate-600 text-xs">
            © {new Date().getFullYear()} MetaReiki.org. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
