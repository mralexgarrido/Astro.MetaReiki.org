import React, { useState, useEffect } from 'react';
import { BirthData } from '../types';
import { Calendar, Clock, Loader2, User, Save, History, Trash2, CheckCircle } from 'lucide-react';
import { CitySearch } from './CitySearch';
import { saveProfile, getProfiles, deleteProfile, StoredProfile } from '../services/storageService';

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
  const [timezone, setTimezone] = useState<string>('UTC');

  // Storage State
  const [profiles, setProfiles] = useState<StoredProfile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const loaded = await getProfiles();
      setProfiles(loaded);
    } catch (error) {
      console.error("Failed to load profiles", error);
    }
  };

  const handleProfileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProfileId(id);
    
    if (id) {
      const profile = profiles.find(p => p.id === id);
      if (profile) {
        setName(profile.name);
        setDate(profile.date);
        setTime(profile.time);
        setCity(profile.location.city);
        setLat(profile.location.latitude);
        setLng(profile.location.longitude);
        setTimezone(profile.location.timezone || 'UTC');
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !date || !time || lat === null || lng === null) {
      setStatusMsg({ type: 'error', text: "Completa todos los campos para guardar." });
      setTimeout(() => setStatusMsg(null), 3000);
      return;
    }

    try {
      const savedProfile = await saveProfile({
        name,
        date,
        time,
        location: {
          city,
          latitude: lat,
          longitude: lng,
          timezone: timezone
        }
      });
      await loadProfiles();
      setSelectedProfileId(savedProfile.id);
      setStatusMsg({ type: 'success', text: "Perfil guardado correctamente." });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Error al guardar perfil." });
    }
  };

  const handleDeleteProfile = async () => {
    if (!selectedProfileId) return;
    if (window.confirm("¿Estás seguro de eliminar este perfil?")) {
      await deleteProfile(selectedProfileId);
      await loadProfiles();
      setSelectedProfileId('');
      setName('');
      setDate('');
      setTime('');
      setCity('');
      setLat(null);
      setLng(null);
      setTimezone('UTC');
    }
  };

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
        longitude: lng,
        timezone: timezone
      }
    });
  };

  const handleLocationSelect = (newLat: number, newLng: number, name: string, tz: string) => {
      setLat(newLat);
      setLng(newLng);
      setCity(name);
      setTimezone(tz);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-reiki-card/90 backdrop-blur-md border border-reiki-cyan/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-white mb-6 font-sans tracking-wide">
        INGRESA TUS DATOS
      </h2>

      {/* Saved Profiles Section */}
      {profiles.length > 0 && (
        <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
          <label className="block text-slate-400 text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
            <History className="w-3 h-3 text-reiki-magenta" /> Cargar Perfil Guardado
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedProfileId}
                onChange={handleProfileSelect}
                className="w-full appearance-none bg-slate-800 text-slate-200 text-sm rounded-lg border border-slate-600 px-3 py-2 focus:border-reiki-magenta focus:outline-none transition-colors cursor-pointer"
              >
                <option value="">-- Seleccionar Perfil --</option>
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.date})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            {selectedProfileId && (
              <button 
                type="button"
                onClick={handleDeleteProfile}
                className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors"
                title="Eliminar perfil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

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

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-3">
          <button
            type="submit"
            disabled={isLoading || lat === null}
            className="w-full bg-gradient-to-r from-reiki-cyan to-blue-600 hover:from-white hover:to-reiki-cyan text-black font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 tracking-widest uppercase text-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Calculando...
              </span>
            ) : (
              'Revelar Carta'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={!name || !date || !time || lat === null}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium py-3 rounded-xl border border-slate-600 transition-all uppercase text-sm tracking-wider disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Guardar Perfil
          </button>

          {selectedProfileId && (
            <button
              type="button"
              onClick={handleDeleteProfile}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium py-3 rounded-xl border border-red-500/30 transition-all uppercase text-sm tracking-wider"
            >
              <Trash2 className="w-4 h-4" /> Eliminar Perfil
            </button>
          )}
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className={`text-center text-sm font-bold flex items-center justify-center gap-2 animate-fade-in ${statusMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
             {statusMsg.type === 'success' && <CheckCircle className="w-4 h-4" />}
             {statusMsg.text}
          </div>
        )}
      </form>
    </div>
  );
};