'use client';

import React, { useState, useMemo } from 'react';
import { WeeklyAllocation, DayOfWeek } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Tv, 
  Monitor, 
  BookOpen, 
  Laptop, 
  Code2, 
  Database, 
  Network, 
  Cpu, 
  GraduationCap
} from 'lucide-react';

interface CarteleraViewProps {
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
}

export function CarteleraView({ allocations, currentWeek, dateRange }: CarteleraViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Miércoles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isKioskMode, setIsKioskMode] = useState(false);

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Ícono contextual según la asignatura
  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('estadística') || n.includes('cálculo') || n.includes('matemática')) {
      return Cpu;
    }
    if (n.includes('base de datos') || n.includes('datos')) {
      return Database;
    }
    if (n.includes('redes') || n.includes('comunicación')) {
      return Network;
    }
    if (n.includes('programación') || n.includes('desarrollo') || n.includes('computacional')) {
      return Code2;
    }
    if (n.includes('tecnología') || n.includes('digital')) {
      return Laptop;
    }
    return BookOpen;
  };

  // Filtrar asignaciones
  const filteredAllocations = useMemo(() => {
    return allocations.filter(a => {
      if (a.dayOfWeek !== selectedDay) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = a.courseName.toLowerCase().includes(query);
        const matchProf = a.professorName.toLowerCase().includes(query);
        const matchSpace = a.assignedSpaceIds.some(id => id.toLowerCase().includes(query));
        if (!matchName && !matchProf && !matchSpace) return false;
      }
      return true;
    });
  }, [allocations, selectedDay, searchQuery]);

  return (
    <div className={`space-y-7 ${isKioskMode ? 'p-8 bg-slate-950 text-white min-h-screen' : ''}`}>
      {/* Barra de Búsqueda y Selector de Pantalla */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        <div className="relative w-full flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por materia, docente o aula..."
            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium transition-all shadow-xs border focus:outline-none focus:ring-2 ${
              isKioskMode
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:ring-brand-blue'
                : 'bg-white border-slate-200/90 text-slate-800 placeholder-slate-400 focus:ring-brand-blue'
            }`}
          />
        </div>

        <button
          onClick={() => setIsKioskMode(!isKioskMode)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0 ${
            isKioskMode
              ? 'bg-brand-blue hover:bg-[#006cb8] text-white'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
          title="Alternar vista ampliada para monitores de pasillo"
        >
          <Tv className="w-4 h-4 text-brand-blue" />
          <span>{isKioskMode ? 'Salir de Modo Pantalla' : 'Modo Pantalla Sede'}</span>
        </button>
      </div>

      {/* Selector de Días Limpio (Estilo Boceto 1) */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-4xl mx-auto">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 whitespace-nowrap shadow-2xs ${
                isSelected
                  ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20 shadow-sm'
                  : isKioskMode
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Grid de Clases Limpias y Espaciadas (Boceto 1) */}
      {filteredAllocations.length === 0 ? (
        <div className={`text-center py-16 rounded-3xl border max-w-2xl mx-auto ${
          isKioskMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="font-bold text-sm">No hay clases programadas para esta búsqueda.</p>
          <p className="text-xs text-slate-400 mt-1">Probá seleccionando otro día o limpiando el filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filteredAllocations.map((alloc) => {
            const isPresential = alloc.modality === 'presencial';
            const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
            const primarySpace = assignedSpaces[0];
            const IconComponent = getSubjectIcon(alloc.courseName);

            return (
              <div
                key={alloc.id}
                className={`p-6 rounded-3xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isKioskMode
                    ? 'bg-slate-900 border-slate-800 hover:border-brand-blue/60'
                    : 'bg-white border-slate-200/90 hover:border-brand-blue/40'
                }`}
              >
                <div>
                  {/* Icono de Asignatura y Estado */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                      isPresential
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        : alloc.modality === 'virtual'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200/80'
                          : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                    }`}>
                      {alloc.modality === 'presencial' ? 'Presencial' : alloc.modality === 'virtual' ? 'Virtual' : 'Feriado'}
                    </span>
                  </div>

                  {/* Nombre de la Materia */}
                  <h3 className={`font-black text-lg leading-snug line-clamp-2 ${isKioskMode ? 'text-white' : 'text-brand-navy'}`}>
                    {alloc.courseName}
                  </h3>

                  {/* Docente */}
                  <p className={`text-xs mt-1 font-semibold ${isKioskMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {alloc.professorName}
                  </p>

                  {/* Horario */}
                  <div className={`flex items-center gap-1.5 text-xs font-bold mt-3 ${isKioskMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alloc.startTime} - {alloc.endTime} hs</span>
                  </div>
                </div>

                {/* Badge Destacado de Aula (Boceto 1) */}
                <div className="mt-5 pt-4 border-t border-slate-100/90">
                  {isPresential ? (
                    primarySpace ? (
                      <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-blue" />
                          <span className="font-black text-sm text-brand-navy">
                            {alloc.assignedSpaceIds.length > 1
                              ? `Aulas ${assignedSpaces.map(s => s?.id).join(' + ')}`
                              : `${primarySpace.name} · Piso ${primarySpace.floor}`
                            }
                          </span>
                        </div>
                        {primarySpace.department === 'Intendencia' && (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                            Intendencia
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="bg-rose-50 text-rose-700 p-2.5 rounded-2xl border border-rose-200 text-xs font-bold text-center">
                        Aula en asignación
                      </div>
                    )
                  ) : (
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Campus Virtual</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
