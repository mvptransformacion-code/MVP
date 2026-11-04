'use client';

import React, { useState } from 'react';
import { WeeklyAllocation, DayOfWeek, Space, RoomFeatureRequest } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  ArrowRightLeft, 
  Clock, 
  FileCheck2,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface BedeliaConsoleViewProps {
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
  occupancyRate: number;
  totalPresential: number;
  totalAssigned: number;
  totalConflicts: number;
  totalIntendencia: number;
  onReassignSpace: (allocationId: string, newSpaceId: string) => void;
  onApproveWeek: () => void;
  isWeekApproved: boolean;
  onRunEngine: () => void;
  onToggleSimulation75: () => void;
  simulation75Active: boolean;
  roomFeatureRequests: RoomFeatureRequest[];
  onApproveFeatureRequest: (requestId: string, assignedSpaceId: string) => void;
  onOpenCopilot?: () => void;
}

export function BedeliaConsoleView({
  allocations,
  currentWeek,
  dateRange,
  occupancyRate,
  totalPresential,
  totalAssigned,
  totalConflicts,
  totalIntendencia,
  onReassignSpace,
  onApproveWeek,
  isWeekApproved,
  onRunEngine,
  onToggleSimulation75,
  simulation75Active,
  roomFeatureRequests,
  onApproveFeatureRequest,
  onOpenCopilot
}: BedeliaConsoleViewProps) {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('Miércoles');
  const [reassigningAllocId, setReassigningAllocId] = useState<string | null>(null);

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Filtrar asignaciones
  const filtered = allocations.filter(a => {
    if (selectedDayFilter !== 'all' && a.dayOfWeek !== selectedDayFilter) return false;
    return a.modality === 'presencial';
  });

  const conflictsList = allocations.filter(a => a.status === 'conflicto_sin_aula' || a.status === 'requiere_intendencia');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Métricas Clave en Píldoras Limpias (Boceto 2) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 px-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-200/80">
            <span className="font-black text-sm">{occupancyRate}%</span>
            <span className="text-xs font-bold">Aulas Asignadas</span>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 text-rose-800 px-4 py-2 rounded-2xl border border-rose-200/80 relative">
            <span className="font-black text-sm">{totalConflicts}</span>
            <span className="text-xs font-bold">Conflictos Pendientes</span>
            {totalConflicts > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 absolute -top-1 -right-1 ring-2 ring-white animate-pulse" />
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl">
            <span className="font-black text-sm">{totalPresential}</span>
            <span className="text-xs font-bold">Comisiones Activas</span>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <button
            onClick={onApproveWeek}
            disabled={isWeekApproved}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              isWeekApproved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isWeekApproved ? 'Grilla Aprobada ✓' : 'Aprobar Grilla'}</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjeta Destacada "Atención Requerida" (Boceto 2) */}
      {conflictsList.length > 0 ? (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-brand-navy">Atención Requerida</h3>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Conflicto en Miércoles S{currentWeek}: <strong>Fundamentos de Estadística (Equipo 2)</strong> y <strong>Planeamiento</strong> requieren aula de más de 60 lugares.
            </p>
          </div>

          <button
            onClick={onOpenCopilot}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-brand-blue hover:bg-[#006cb8] text-white font-extrabold rounded-2xl text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <span>Resolver con Copiloto de IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/60 p-4 px-6 rounded-3xl border border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No hay conflictos pendientes en la Semana {currentWeek}. Todo distribuido de forma óptima.</span>
          </div>
          <button
            onClick={onRunEngine}
            className="text-xs text-brand-blue font-bold hover:underline"
          >
            Recalcular Reglas
          </button>
        </div>
      )}

      {/* 3. Selector de Días y Filtro */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDayFilter(d)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                selectedDayFilter === d
                  ? 'bg-brand-navy text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500">
          {filtered.length} clases presenciales
        </span>
      </div>

      {/* 4. Tabla Limpia con Barras de Ocupación Visuales (Boceto 2) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[11px]">
              <th className="py-4 px-6">Aula / Espacio</th>
              <th className="py-4 px-4 text-center">Capacidad</th>
              <th className="py-4 px-6">Curso Asignado</th>
              <th className="py-4 px-6">Ocupancia</th>
              <th className="py-4 px-6 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((alloc) => {
              const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
              const primarySpace = assignedSpaces[0];
              const cap = primarySpace ? primarySpace.capacity : 0;
              const occPercent = cap > 0 ? Math.min(Math.round((alloc.enrolledStudents / cap) * 100), 100) : 0;
              const isReassigning = reassigningAllocId === alloc.id;

              return (
                <tr key={alloc.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Aula */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {primarySpace ? (
                      <div>
                        <span className="font-black text-sm text-brand-navy block">{primarySpace.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">Piso {primarySpace.floor}</span>
                      </div>
                    ) : (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-xl text-[11px] border border-rose-200">
                        Sin aula compatible
                      </span>
                    )}
                  </td>

                  {/* Capacidad */}
                  <td className="py-4 px-4 text-center font-bold text-slate-700">
                    {cap > 0 ? `${cap}` : '-'}
                  </td>

                  {/* Curso Asignado */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{alloc.courseName}</div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>{alloc.professorName}</span>
                      <span>·</span>
                      <span className="text-slate-400">{alloc.startTime} a {alloc.endTime} hs</span>
                    </div>
                  </td>

                  {/* Barra Visual de Ocupación (Boceto 2) */}
                  <td className="py-4 px-6 min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            occPercent >= 80 ? 'bg-brand-navy' : occPercent >= 50 ? 'bg-brand-blue' : 'bg-slate-400'
                          }`}
                          style={{ width: `${occPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-black text-slate-700 w-8 text-right">
                        {occPercent}%
                      </span>
                    </div>
                  </td>

                  {/* Acción Reasignar */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    {isReassigning ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <select
                          defaultValue={alloc.assignedSpaceIds[0] || ''}
                          onChange={(e) => {
                            onReassignSpace(alloc.id, e.target.value);
                            setReassigningAllocId(null);
                          }}
                          className="text-xs p-1 rounded-xl border border-brand-blue bg-white font-bold"
                        >
                          <option value="">Sin Aula</option>
                          {SPACES.map(s => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.capacity} lug)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setReassigningAllocId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-700"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReassigningAllocId(alloc.id)}
                        className="px-3 py-1.5 text-brand-blue hover:bg-brand-blue/10 rounded-xl text-xs font-bold transition-colors border border-brand-blue/20"
                      >
                        Reasignar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 5. Solicitudes de Docentes con Características Específicas */}
      {roomFeatureRequests.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-xs text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
              Solicitudes Especiales de Docentes
            </h4>
            <span className="text-[11px] text-slate-400">Wi-Fi, Pizarrón, Equipamiento</span>
          </div>

          <div className="space-y-2">
            {roomFeatureRequests.map((req) => (
              <div key={req.id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-brand-navy text-sm">{req.courseName}</span>
                    <span className="text-slate-500 font-medium">· {req.professorName}</span>
                    <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-md font-bold text-[10px]">
                      Min: {req.minCapacity} lug
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {req.requiredFeatures.map((f, i) => (
                      <span key={i} className="bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-semibold">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0">
                  {req.status === 'asignada' ? (
                    <span className="text-emerald-700 font-extrabold bg-emerald-100/80 px-3 py-1 rounded-xl text-xs flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Asignada a {req.assignedSpaceId ? `Aula ${req.assignedSpaceId}` : 'Espacio adecuado'}
                    </span>
                  ) : (
                    <select
                      onChange={(e) => onApproveFeatureRequest(req.id, e.target.value)}
                      className="text-xs p-2 bg-white border border-brand-blue rounded-xl font-bold text-brand-navy focus:outline-none shadow-2xs"
                    >
                      <option value="">Asignar Aula...</option>
                      {SPACES.filter(s => s.capacity >= req.minCapacity).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.capacity} lug)</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
