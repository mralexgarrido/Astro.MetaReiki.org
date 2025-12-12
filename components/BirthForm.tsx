import React, { useState } from 'react';
import { BirthData } from '../types';
import { Calendar, Clock, Loader2, User } from 'lucide-react';
import { CitySearch } from './CitySearch';

interface Props {
  onSubmit: (data: BirthData) => void;
  isLoading: boolean;
}

export const BirthForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lat === null || lng === null) {
      alert("Por favor selecciona una ubicación válida de la lista.");
      return; 
    }
    
    onSubmit({
      name,
      date,
      time,
      location: {
        city,
        latitude: lat,
        longitude: lng
      }
    });
  };

  const handleLocationSelect = (newLat: number, newLng: number, name: string) => {
      setLat(newLat);
      setLng(newLng);
      setCity(name);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-reiki-card/90 backdrop-blur-md border border-reiki-cyan/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-white mb-6 font-sans tracking-wide">
        INGRESA TUS DATOS
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Name */}
        <div className="relative">
          <label className="block text-reiki-cyan text-xs uppercase tracking-widest font-bold mb-2">Nombre Completo</label>
          <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700 focus-within:border-reiki-cyan focus-within:shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-all">
            <User className="w-5 h-5 text-reiki-cyan ml-3" />
            <input
              type="text"
              required
              className="w-full bg-transparent p-3 text-slate-100 focus:outline-none placeholder-slate-600"
              placeholder="Ej. Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Date */}
        <div className="relative">
          <label className="block text-reiki-cyan text-xs uppercase tracking-widest font-bold mb-2">Fecha de Nacimiento</label>
          <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700 focus-within:border-reiki-cyan focus-within:shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-all">
            <Calendar className="w-5 h-5 text-reiki-magenta ml-3" />
            <input
              type="date"
              required
              className="w-full bg-transparent p-3 text-slate-100 focus:outline-none placeholder-slate-600"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Time */}
        <div className="relative">
          <label className="block text-reiki-cyan text-xs uppercase tracking-widest font-bold mb-2">Hora de Nacimiento</label>
          <div className="flex items-center bg-slate-900/80 rounded-lg border border-slate-700 focus-within:border-reiki-cyan focus-within:shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-all">
            <Clock className="w-5 h-5 text-reiki-magenta ml-3" />
            <input
              type="time"
              required
              className="w-full bg-transparent p-3 text-slate-100 focus:outline-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="relative">
          <label className="block text-reiki-cyan text-xs uppercase tracking-widest font-bold mb-2">Ubicación</label>
          <CitySearch onSelect={handleLocationSelect} selectedName={city} />
        </div>

        <button
          type="submit"
          disabled={isLoading || lat === null}
          className="w-full bg-gradient-to-r from-reiki-cyan to-blue-600 hover:from-white hover:to-reiki-cyan text-black font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 mt-6 tracking-widest uppercase"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Calculando...
            </span>
          ) : (
            'Revelar Carta'
          )}
        </button>
      </form>
    </div>
  );
};