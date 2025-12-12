import React, { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';

// Access Leaflet from global window scope as loaded in index.html
declare const L: any;

interface Props {
  onLocationSelect: (lat: number, lng: number, city: string) => void;
  onClose: () => void;
}

export const MapPicker: React.FC<Props> = ({ onLocationSelect, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedPos, setSelectedPos] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Default view: Madrid (neutral default)
      const map = L.map(mapRef.current).setView([40.4168, -3.7038], 4);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
        
        setSelectedPos({ lat, lng });
      });

      leafletMap.current = map;
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const handleConfirm = async () => {
    if (!selectedPos) return;
    
    // Simple reverse geocode approximate or just use coords
    const latStr = selectedPos.lat.toFixed(4);
    const lngStr = selectedPos.lng.toFixed(4);
    
    // Try to fetch city name
    let cityName = `${latStr}, ${lngStr}`;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedPos.lat}&lon=${selectedPos.lng}`);
        const data = await res.json();
        if (data && data.address) {
            cityName = data.address.city || data.address.town || data.address.village || cityName;
        }
    } catch (e) {
        console.warn("Geocoding failed", e);
    }
    
    onLocationSelect(selectedPos.lat, selectedPos.lng, cityName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <h3 className="text-xl font-serif text-amber-100">Pin Birth Location</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          <div className="absolute bottom-6 right-6 z-[1000] flex gap-4">
             {selectedPos && (
                 <button 
                    onClick={handleConfirm}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
                 >
                    <Check className="w-5 h-5" /> Confirm Location
                 </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};