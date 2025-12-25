import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Calculator } from './components/Calculator';
import { LibraryIndex } from './components/library/LibraryIndex';
import { PlanetIndex } from './components/library/PlanetIndex';
import { PlanetSignIndex } from './components/library/PlanetSignIndex';
import { InterpretationView } from './components/library/InterpretationView';
import { SignIndex } from './components/library/SignIndex';
import { SignDetail } from './components/library/SignDetail';
import { HouseIndex } from './components/library/HouseIndex';
import { HouseDetail } from './components/library/HouseDetail';

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

              {/* Planetas */}
              <Route path="planetas" element={<PlanetIndex />} />
              <Route path="planetas/:planetName" element={<PlanetSignIndex />} />
              <Route path="planetas/:planetName/:signName" element={<InterpretationView />} />

              {/* Signos */}
              <Route path="signos" element={<SignIndex />} />
              <Route path="signos/:signName" element={<SignDetail />} />

              {/* Casas */}
              <Route path="casas" element={<HouseIndex />} />
              <Route path="casas/:houseId" element={<HouseDetail />} />

              {/* Catch-all for sub-routes */}
              <Route path="*" element={<Navigate to="/biblioteca" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
