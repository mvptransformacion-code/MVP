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
  LayoutGrid,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface CarteleraViewProps {
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
}

export function CarteleraView({ allocations, currentWeek, dateRange }: CarteleraViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Miércoles');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'display'>('display'); // Default display mode similar to user's photo
  const [isFullScreen, setIsFullScreen] = useState(false);

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Fechas aproximadas de la semana para el encabezado del tótem (ej: Miércoles 25/11)
  const getDayFormattedDate = (day: DayOfWeek) => {
    const dayMap: Record<DayOfWeek, string> = {
      'Lunes': '23/11',
      'Martes': '24/11',
      'Miércoles': '25/11',
      'Jueves': '26/11',
      'Viernes': '27/11',
      'Sábado': '28/11'
    };
    return dayMap[day] || '25/11';
  };

  // Convertir piso a formato corto P1, P2, P3, P4, PB, SS
  const getShortFloor = (floor: string) => {
    if (floor.includes('Subsuelo')) return 'SS';
    if (floor === 'PB') return 'PB';
    if (floor.includes('1°')) return 'P1';
    if (floor.includes('2°')) return 'P2';
    if (floor.includes('3°')) return 'P3';
    if (floor.includes('4°')) return 'P4';
    return floor;
  };

  // Abreviar el nombre para que calce idéntico a la pantalla digital
  const getDisplaySubjectName = (name: string, team: string) => {
    let shortName = name.toUpperCase();
    if (shortName.includes('FUNDAMENTOS DE ESTADÍSTICA')) shortName = 'FUND. DE ESTADÍSTICA';
    else if (shortName.includes('PLANEAMIENTO ESTRATÉGICO')) shortName = 'PLANEAMIENTO ESTRAT.';
    else if (shortName.includes('GESTIÓN DEL CONOCIMIENTO')) shortName = 'GESTIÓN DE PROY. DIGITALES';
    else if (shortName.includes('PENSAMIENTO COMPUTACIONAL')) shortName = 'PROG. DE VIDEOJUEGOS III';
    else if (shortName.includes('INSTITUCIONES EDUCATIVAS')) shortName = 'INSTITUCIONES EDUCATIVAS';
    else if (shortName.includes('POLÍTICA EDUCATIVA')) shortName = 'POLÍTICA Y GESTIÓN';
    else if (shortName.includes('APRENDIZAJE Y DESARROLLO')) shortName = 'APRENDIZAJE Y DESARROLLO';

    let teamSuffix = '';
    if (team.includes('Equipo 1')) teamSuffix = ' · EQ. 1';
    else if (team.includes('Equipo 2')) teamSuffix = ' · EQ. 2';
    else if (team.includes('Equipo 3')) teamSuffix = ' · EQ. 3';

    return `${shortName}${teamSuffix}`;
  };

  // Formato de aula para la pantalla digital (ej: AULA 205 · P2)
  const getDisplayRoomInfo = (alloc: WeeklyAllocation) => {
    if (alloc.assignedSpaceIds.length === 0 || alloc.status === 'conflicto_sin_aula') {
      return { text: 'CONSULTAR BEDELÍA', isPending: true };
    }
    const space = SPACES.find(s => s.id === alloc.assignedSpaceIds[0]);
    if (!space) {
      return { text: 'CONSULTAR BEDELÍA', isPending: true };
    }

    let roomName = space.name.toUpperCase();
    if (roomName.includes('SALA DE REUNIÓN')) roomName = 'SALA REUNIÓN';
    if (roomName.includes('AULA MAGNA')) roomName = 'AULA 301';

    const shortFloor = getShortFloor(space.floor);
    return { text: `${roomName} · ${shortFloor}`, isPending: false };
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

  // Asignaciones presenciales para el Tótem Digital
  const presentialAllocations = useMemo(() => {
    const list = allocations.filter(a => a.dayOfWeek === selectedDay && a.modality === 'presencial');
    // Si hay un caso sin aula, asegurarse de incluirlo al final como en la foto
    return list;
  }, [allocations, selectedDay]);

  return (
    <div className={`space-y-6 ${isFullScreen ? 'fixed inset-0 z-50 bg-[#06182c] p-6 overflow-y-auto' : ''}`}>
      {/* Barra de Control: Selector de Modo (Resumen Digital vs Tarjetas) y Días */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
        {/* Toggle de Modo de Vista */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300/80 text-xs font-bold">
          <button
            onClick={() => setViewMode('display')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'display'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            <Tv className="w-4 h-4 text-brand-cyan" />
            <span>Pantalla Digital (Tótem)</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'cards'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-slate-600 hover:text-brand-navy'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-brand-blue" />
            <span>Vista Tarjetas</span>
          </button>
        </div>

        {/* Botón Pantalla Completa */}
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 shadow-2xs"
          title="Alternar pantalla completa para proyector o monitor"
        >
          {isFullScreen ? <Minimize2 className="w-4 h-4 text-brand-blue" /> : <Maximize2 className="w-4 h-4 text-brand-blue" />}
          <span>{isFullScreen ? 'Salir de Pantalla Completa' : 'Modo Pantalla Completa'}</span>
        </button>
      </div>

      {/* Selector de Días (Lunes a Sábado) */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 max-w-4xl mx-auto">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all duration-200 whitespace-nowrap shadow-2xs ${
                isSelected
                  ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODO 1: PANTALLA DIGITAL DE RESUMEN (RÉPLICA EXACTA DE LA FOTO DEL USUARIO) */}
      {/* ========================================================================= */}
      {viewMode === 'display' && (
        <div className="max-w-3xl mx-auto my-4 transition-all animate-fadeIn">
          {/* Contenedor Azul Oscuro con Borde Cyan (#008bd2 / #0284c7) */}
          <div className="bg-[#052852] border-2 border-[#0ea5e9] rounded-2xl shadow-2xl p-6 sm:p-7 text-white font-mono overflow-hidden">
            {/* Header del Display */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold tracking-wider text-[#38bdf8] pb-2">
              <span className="uppercase">
                {selectedDay.toUpperCase()} {getDayFormattedDate(selectedDay)} · PRESENCIAL
              </span>
              <span className="uppercase text-right hidden sm:inline">
                HORA · ASIGNATURA · AULA · PISO
              </span>
            </div>

            {/* Línea divisoria Magenta (#e60067) idéntica a la foto */}
            <div className="h-[2px] w-full bg-[#e60067] mb-3" />

            {/* Filas de la Cartelera Digital */}
            <div className="space-y-0 text-xs sm:text-sm">
              {presentialAllocations.length === 0 ? (
                <div className="py-8 text-center text-[#38bdf8]/60 font-semibold">
                  NO HAY CLASES PRESENCIALES PROGRAMADAS PARA ESTE DÍA
                </div>
              ) : (
                presentialAllocations.map((alloc, idx) => {
                  const roomInfo = getDisplayRoomInfo(alloc);
                  const isPending = roomInfo.isPending;
                  const displaySubject = getDisplaySubjectName(alloc.courseName, alloc.team);

                  return (
                    <div
                      key={alloc.id}
                      className={`py-3.5 px-3 flex items-center justify-between gap-4 transition-colors ${
                        isPending
                          ? 'bg-[#1e1c45] text-white -mx-3 px-6 my-1 rounded-lg'
                          : 'border-b border-dashed border-[#164478] hover:bg-white/5'
                      }`}
                    >
                      {/* Hora + Asignatura */}
                      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                        <span className={`font-black shrink-0 ${isPending ? 'text-[#ff3b82]' : 'text-[#38bdf8]'}`}>
                          {isPending ? 'HOY' : (alloc.startTime.substring(0, 5) || '18:30')}
                        </span>
                        <span className="font-bold tracking-wide truncate text-[#f0f9ff]">
                          {displaySubject}
                        </span>
                      </div>

                      {/* Aula · Piso o CONSULTAR BEDELÍA en Magenta */}
                      <div className="shrink-0 text-right">
                        {isPending ? (
                          <span className="font-black text-[#ff3388] tracking-widest text-xs sm:text-sm drop-shadow-sm">
                            CONSULTAR BEDELÍA
                          </span>
                        ) : (
                          <span className="font-black text-white tracking-wider text-xs sm:text-sm">
                            {roomInfo.text}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-400 mt-2 font-mono">
            Pantalla de pasillo interactiva · Sincronizada automáticamente con Bedelía
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: VISTA TARJETAS (EXPLORACIÓN CON BUSCADOR)                         */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Buscador */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por materia, docente o aula..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium transition-all shadow-xs border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {filteredAllocations.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border bg-white border-slate-200 text-slate-500 max-w-xl mx-auto">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No hay clases encontradas con ese criterio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAllocations.map((alloc) => {
                const isPresential = alloc.modality === 'presencial';
                const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
                const primarySpace = assignedSpaces[0];

                return (
                  <div
                    key={alloc.id}
                    className="p-6 rounded-3xl border bg-white border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {alloc.courseCode} · {alloc.team}
                        </span>
                        <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full ${
                          isPresential
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {alloc.modality === 'presencial' ? 'Presencial' : 'Virtual'}
                        </span>
                      </div>

                      <h3 className="font-black text-lg text-brand-navy leading-snug line-clamp-2">
                        {alloc.courseName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">{alloc.professorName}</p>

                      <div className="flex items-center gap-1.5 text-xs font-bold mt-3 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{alloc.startTime} - {alloc.endTime} hs</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      {isPresential ? (
                        primarySpace ? (
                          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-brand-blue" />
                              <span className="font-black text-sm text-brand-navy">
                                {primarySpace.name} · Piso {primarySpace.floor}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-rose-50 text-rose-700 p-2.5 rounded-2xl border border-rose-200 text-xs font-bold text-center">
                            CONSULTAR BEDELÍA
                          </div>
                        )
                      ) : (
                        <div className="bg-slate-50 p-2.5 rounded-2xl text-xs font-medium text-slate-500 text-center">
                          Campus Virtual
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
