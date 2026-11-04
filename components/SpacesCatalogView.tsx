'use client';

import React, { useState, useMemo } from 'react';
import { Space, SpaceType } from '@/types';
import { SPACES, TOTAL_OWN_CAPACITY, TOTAL_BUILDING_CAPACITY } from '@/lib/data/spaces';
import { Building2, Search, Users } from 'lucide-react';

export function SpacesCatalogView() {
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const floors = ['Subsuelo', 'PB', '1°', '2°', '3°', '4°'];
  const types: SpaceType[] = ['Aula', 'Lab. de Ciencias', 'Sala de Reunión', 'Auditorio', 'Sala de Capacitación'];

  const filteredSpaces = useMemo(() => {
    return SPACES.filter(s => {
      if (selectedFloor !== 'all' && s.floor !== selectedFloor) return false;
      if (selectedType !== 'all' && s.type !== selectedType) return false;
      if (selectedDept !== 'all' && s.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [selectedFloor, selectedType, selectedDept, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-brand-blue/20">
              Datos Maestros
            </span>
            <span className="text-xs text-slate-500">· Infraestructura Digital</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight mt-1">
            Catálogo de Espacios Físicos · Sede Perón 830
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            27 espacios distribuidos en 6 niveles con capacidad real verificada (1.389 butacas totales)
          </p>
        </div>

        {/* Resumen de Butacas */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
            <span className="text-xs text-slate-500 block">Aulas Propias (24)</span>
            <span className="text-xl font-black text-brand-navy">{TOTAL_OWN_CAPACITY}</span>
            <span className="text-[10px] text-slate-400 block">lugares</span>
          </div>
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-center">
            <span className="text-xs text-amber-800 block">Intendencia (3)</span>
            <span className="text-xl font-black text-amber-700">180</span>
            <span className="text-[10px] text-amber-600 block">lugares</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Buscador */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar aula o código..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Filtros Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Piso */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">Todos los Pisos</option>
            {floors.map(f => <option key={f} value={f}>Piso: {f}</option>)}
          </select>

          {/* Tipo de Espacio */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">Todos los Tipos</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {/* Dependencia */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">Todas las Dependencias</option>
            <option value="Propios">Espacios Propios (24)</option>
            <option value="Intendencia">Intendencia (3)</option>
          </select>
        </div>
      </div>

      {/* Grid de Espacios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSpaces.map((space) => {
          const isIntendencia = space.department === 'Intendencia';

          return (
            <div
              key={space.id}
              className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                isIntendencia
                  ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200 hover:border-amber-400'
                  : 'bg-white border-slate-200 hover:border-brand-blue/50'
              }`}
            >
              <div>
                {/* Header Tarjeta */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    Cód: {space.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isIntendencia
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-brand-blue/10 text-brand-blue'
                  }`}>
                    {space.department}
                  </span>
                </div>

                {/* Nombre y Tipo */}
                <h3 className="font-bold text-base text-brand-navy">{space.name}</h3>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="font-medium">{space.type}</span> · 
                  <span className="font-semibold text-slate-700">Piso {space.floor}</span>
                </div>

                {/* Equipamiento */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {space.equipment.map((eq, i) => (
                    <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-100">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacidad */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Capacidad Real:
                </span>
                <span className="text-base font-black text-brand-navy">
                  {space.capacity} <span className="text-xs font-normal text-slate-400">lugares</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
