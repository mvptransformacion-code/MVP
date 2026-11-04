'use client';

import React, { useState, useMemo } from 'react';
import { WeeklyAllocation, DayOfWeek } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { Search, MapPin, Clock, Calendar, Users, Filter, Tv, CheckCircle2, AlertTriangle, Monitor } from 'lucide-react';

interface CarteleraViewProps {
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
}

export function CarteleraView({ allocations, currentWeek, dateRange }: CarteleraViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Miércoles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<string>('all');
  const [isKioskMode, setIsKioskMode] = useState(false);

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Obtener lista única de carreras
  const careers = useMemo(() => {
    const set = new Set(allocations.map(a => a.career));
    return Array.from(set);
  }, [allocations]);

  // Filtrar asignaciones
  const filteredAllocations = useMemo(() => {
    return allocations.filter(a => {
      if (a.dayOfWeek !== selectedDay) return false;
      if (selectedCareer !== 'all' && a.career !== selectedCareer) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = a.courseName.toLowerCase().includes(query);
        const matchCode = a.courseCode.toLowerCase().includes(query);
        const matchProf = a.professorName.toLowerCase().includes(query);
        const matchCareer = a.career.toLowerCase().includes(query);
        const matchSpace = a.assignedSpaceIds.some(id => id.toLowerCase().includes(query));
        if (!matchName && !matchCode && !matchProf && !matchCareer && !matchSpace) return false;
      }
      return true;
    });
  }, [allocations, selectedDay, selectedCareer, searchQuery]);

  return (
    <div className={`space-y-6 ${isKioskMode ? 'p-6 bg-slate-900 text-white min-h-screen' : ''}`}>
      {/* Banner de la Cartelera */}
      <div className={`p-6 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isKioskMode ? 'bg-slate-800/80 border-slate-700' : 'bg-gradient-to-r from-pink-50 via-white to-purple-50 border-pink-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isKioskMode ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'bg-pink-100 text-unicaba-pink'
            }`}>
              Cartelera Digital en Vivo
            </span>
            <span className="text-xs text-slate-400">· Vista Pública (Sin Login Requerido)</span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight mt-1 ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>
            Distribución Diaria de Aulas · Sede Perón 830
          </h1>
          <p className={`text-xs mt-1 ${isKioskMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Semana {currentWeek} ({dateRange}) · Actualizada automáticamente en tiempo real
          </p>
        </div>

        {/* Botón Modo Pantalla de Sede / Tótem */}
        <button
          onClick={() => setIsKioskMode(!isKioskMode)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isKioskMode
              ? 'bg-pink-600 hover:bg-pink-700 text-white'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
          title="Alternar vista ampliada para monitores en pasillos de la sede"
        >
          <Tv className="w-4 h-4 text-unicaba-pink" />
          <span>{isKioskMode ? 'Salir de Modo Tótem' : 'Modo Pantalla Sede'}</span>
        </button>
      </div>

      {/* Controles de Día y Filtros */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Selector de Días */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {days.map((day) => {
            const count = allocations.filter(a => a.dayOfWeek === day && a.modality === 'presencial').length;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
                  isSelected
                    ? isKioskMode
                      ? 'bg-pink-600 text-white ring-2 ring-pink-400'
                      : 'bg-unicaba-pink text-white ring-2 ring-pink-300 shadow-md'
                    : isKioskMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{day}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count} presenc.
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador y Filtro por Carrera */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar materia, aula, docente..."
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
                isKioskMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:ring-pink-500'
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-unicaba-pink'
              }`}
            />
          </div>

          {/* Filtro Carrera */}
          <select
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            className={`w-full sm:w-56 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 ${
              isKioskMode
                ? 'bg-slate-800 border-slate-700 text-white focus:ring-pink-500'
                : 'bg-white border-slate-200 text-slate-800 focus:ring-unicaba-pink'
            }`}
          >
            <option value="all">Todas las carreras</option>
            {careers.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Clases del Día */}
      {filteredAllocations.length === 0 ? (
        <div className={`text-center py-12 rounded-2xl border ${
          isKioskMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-sm">No se encontraron clases para los filtros seleccionados.</p>
          <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otro día o quitando el filtro de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAllocations.map((alloc) => {
            const isPresential = alloc.modality === 'presencial';
            const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
            const primarySpace = assignedSpaces[0];

            return (
              <div
                key={alloc.id}
                className={`p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isKioskMode
                    ? 'bg-slate-800/90 border-slate-700 hover:border-pink-500'
                    : isPresential
                      ? 'bg-white border-slate-200 hover:border-unicaba-pink/50'
                      : 'bg-slate-50/70 border-dashed border-slate-200'
                }`}
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {alloc.courseCode} · {alloc.team}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      alloc.modality === 'presencial'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : alloc.modality === 'virtual'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : alloc.modality === 'feriado'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                    }`}>
                      {alloc.modality.toUpperCase()}
                    </span>
                  </div>

                  {/* Nombre de la Materia */}
                  <h3 className={`font-bold text-base leading-snug line-clamp-2 ${isKioskMode ? 'text-white' : 'text-slate-900'}`}>
                    {alloc.courseName}
                  </h3>
                  <p className={`text-xs mt-1 ${isKioskMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {alloc.career}
                  </p>
                  <p className={`text-xs mt-2 font-medium flex items-center gap-1.5 ${isKioskMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-slate-400">Docente:</span> {alloc.professorName}
                  </p>
                </div>

                {/* Bloque de Aula / Ubicación Destacada */}
                <div className="mt-4 pt-4 border-t border-slate-100/80">
                  {isPresential ? (
                    primarySpace ? (
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-pink-100 text-unicaba-pink flex items-center justify-center font-black text-sm">
                            <MapPin className="w-5 h-5 text-unicaba-pink" />
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-slate-900">
                              {alloc.assignedSpaceIds.length > 1 
                                ? `Aulas combinadas: ${assignedSpaces.map(s => s?.name).join(' + ')}`
                                : primarySpace.name
                              }
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              Piso: <span className="font-bold text-slate-700">{primarySpace.floor}</span> · Capacidad: {primarySpace.capacity} lugares
                            </div>
                          </div>
                        </div>
                        {primarySpace.department === 'Intendencia' && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                            Intendencia
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span>Conflicto: Aula en asignación Bedelía</span>
                      </div>
                    )
                  ) : (
                    <div className="bg-slate-100/70 p-3 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-500" />
                      <span>{alloc.statusMessage || 'Sin espacio físico asignado (Campus Virtual)'}</span>
                    </div>
                  )}

                  {/* Horario y Alumnos */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 px-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {alloc.startTime} a {alloc.endTime} hs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {alloc.enrolledStudents} inscriptos
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
