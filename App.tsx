import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Calculator } from './components/Calculator';
import { LibraryIndex } from './components/library/LibraryIndex';
import { PlanetIndex } from './components/library/PlanetIndex';
import { PlanetSignIndex } from './components/library/PlanetSignIndex';
import { InterpretationView } from './components/library/InterpretationView';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Calculator />} />
            
            {/* Landing Pages (Virtual routes that also load Calculator with params) */}
            <Route path="carta-natal" element={<Calculator />} />
            <Route path="profecciones" element={<Navigate to="/?tab=profection" replace />} />
            <Route path="transitos" element={<Navigate to="/?tab=transits" replace />} />
            <Route path="partes-hermeticas" element={<Navigate to="/?tab=lots" replace />} />
            <Route path="reiki-salud" element={<Navigate to="/?tab=reiki" replace />} />

            {/* Library Routes */}
            <Route path="biblioteca">
              <Route index element={<LibraryIndex />} />
              <Route path="planetas" element={<PlanetIndex />} />
              <Route path="planetas/:planetName" element={<PlanetSignIndex />} />
              <Route path="planetas/:planetName/:signName" element={<InterpretationView />} />
              {/* Signos and Casas routes can be added similarly */}
              <Route path="*" element={<div className="p-12 text-center text-slate-500">Sección en desarrollo.</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
