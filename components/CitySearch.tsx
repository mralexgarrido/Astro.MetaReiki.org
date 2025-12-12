import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface Props {
  onSelect: (lat: number, lng: number, name: string) => void;
  selectedName?: string;
}

export const CitySearch: React.FC<Props> = ({ onSelect, selectedName }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedName) setQuery(selectedName);
  }, [selectedName]);

  useEffect(() => {
    // Click outside handler
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchCities = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
        setResults([]);
        return;
    }
    
    setLoading(true);
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=5&language=es&format=json`);
        const data = await response.json();
        if (data.results) {
            setResults(data.results);
            setIsOpen(true);
        } else {
            setResults([]);
        }
    } catch (e) {
        console.error("Geocoding error:", e);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
        searchCities(val);
    }, 400);
  };

  const handleSelect = (city: CityResult) => {
      const displayName = `${city.name}, ${city.admin1 ? city.admin1 + ', ' : ''}${city.country}`;
      setQuery(displayName);
      onSelect(city.latitude, city.longitude, displayName);
      setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
        <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700 focus-within:border-reiki-cyan focus-within:shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-all">
            <Search className="w-5 h-5 text-reiki-cyan ml-3 flex-shrink-0" />
            <input
                type="text"
                className="w-full bg-transparent p-3 text-slate-100 focus:outline-none placeholder-slate-600"
                placeholder="Busca tu ciudad de nacimiento..."
                value={query}
                onChange={handleChange}
                onFocus={() => { if(results.length > 0) setIsOpen(true); }}
            />
            {loading && <Loader2 className="w-4 h-4 text-reiki-magenta animate-spin mr-3" />}
        </div>

        {isOpen && results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar ring-1 ring-reiki-cyan/20">
                {results.map((city) => (
                    <button
                        key={city.id}
                        type="button"
                        onClick={() => handleSelect(city)}
                        className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
                    >
                        <div className="font-medium text-slate-200">{city.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-reiki-magenta" />
                            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                        </div>
                    </button>
                ))}
            </div>
        )}
    </div>
  );
};