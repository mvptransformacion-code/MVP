'use client';

import React, { useState } from 'react';
import { WeeklyAllocation, DayOfWeek, Space } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  Clock, 
  Info, 
  CheckCircle2, 
  Flame,
  FileCheck2
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
  simulation75Active
}: BedeliaConsoleViewProps) {
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [reassigningAllocId, setReassigningAllocId] = useState<string | null>(null);

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Filtrar asignaciones
  const filtered = allocations.filter(a => {
    if (selectedDayFilter !== 'all' && a.dayOfWeek !== selectedDayFilter) return false;
    if (selectedStatusFilter === 'conflicto' && a.status !== 'conflicto_sin_aula') return false;
    if (selectedStatusFilter === 'intendencia' && a.status !== 'requiere_intendencia') return false;
    if (selectedStatusFilter === 'combinadas' && a.status !== 'aulas_combinadas') return false;
    if (selectedStatusFilter === 'presencial' && a.modality !== 'presencial') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner de Control y Acciones */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-unicaba-purple font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
              Consola de Bedelía & Coordinación
            </span>
            <span className="text-xs text-slate-500">· HU5, HU6, HU7 (Aprobación y Trazabilidad)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Asignación Semanal de Aulas · Sede Perón 830
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Semana activa: <span className="font-bold text-slate-800">S{currentWeek} ({dateRange})</span> · Algoritmo: Menor aula que alcanza
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onRunEngine}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            title="Ejecutar motor determinístico de reglas para optimizar la distribución"
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Ejecutar Motor de Reglas</span>
          </button>

          <button
            onClick={onApproveWeek}
            disabled={isWeekApproved}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isWeekApproved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{isWeekApproved ? 'Grilla Aprobada ✓' : 'Aprobar Grilla Semanal'}</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas de la Semana */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Ocupación Media */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Ocupación de Butacas</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{occupancyRate}%</span>
            <span className="text-[11px] text-slate-500">
              {simulation75Active ? '(Simul. 75%)' : '(Base Inscriptos)'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                occupancyRate >= 70 ? 'bg-emerald-500' : occupancyRate >= 50 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Comisiones Presenciales */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Comisiones Presenciales</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalPresential}</span>
            <span className="text-[11px] text-emerald-600 font-bold">{totalAssigned} con aula</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">En 27 espacios de 6 niveles</p>
        </div>

        {/* Conflictos sin Aula */}
        <div className={`p-4 rounded-xl border shadow-xs ${
          totalConflicts > 0 ? 'bg-red-50/70 border-red-200' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Alertas de Conflicto</span>
            <AlertTriangle className={`w-4 h-4 ${totalConflicts > 0 ? 'text-red-500' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${totalConflicts > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {totalConflicts}
            </span>
            <span className="text-[11px] text-slate-500">sin aula compatible</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {totalConflicts > 0 ? 'Requieren intervención o copiloto' : 'Sin conflictos pendientes'}
          </p>
        </div>

        {/* Pedidos a Intendencia */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Espacios Intendencia</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700">{totalIntendencia}</span>
            <span className="text-[11px] text-slate-500">auditorio / salas</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Agenda compartida anticipada</p>
        </div>
      </div>

      {/* Alertas Destacadas si existen */}
      {totalConflicts > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-extrabold text-red-900 text-sm">
              Se detectaron {totalConflicts} comisiones sin aula compatible en la semana {currentWeek}
            </h4>
            <p className="text-red-700 mt-0.5">
              Ocurre principalmente los miércoles en franja vespertina porque los 4 espacios de más de 60 lugares ya están ocupados.
              Podés consultar al <strong>Copiloto IA</strong> para sugerencias o reasignar manualmente abajo.
            </p>
          </div>
        </div>
      )}

      {/* Filtros de la Tabla */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDayFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos los días
          </button>
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDayFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDayFilter === d ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Estado:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">Todas las clases</option>
            <option value="presencial">Solo Presenciales</option>
            <option value="conflicto">Solo Conflictos</option>
            <option value="intendencia">Solo Intendencia</option>
            <option value="combinadas">Aulas Combinadas</option>
          </select>
        </div>
      </div>

      {/* Tabla de Asignaciones de la Semana */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Día / Horario</th>
                <th className="py-3.5 px-4">Asignatura & Comisión</th>
                <th className="py-3.5 px-4">Docente</th>
                <th className="py-3.5 px-4 text-center">Inscriptos</th>
                <th className="py-3.5 px-4">Modalidad</th>
                <th className="py-3.5 px-4">Aula Asignada</th>
                <th className="py-3.5 px-4">Diagnóstico / Motivo</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((alloc) => {
                const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
                const primarySpace = assignedSpaces[0];
                const isReassigning = reassigningAllocId === alloc.id;

                return (
                  <tr key={alloc.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Día / Horario */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{alloc.dayOfWeek}</span>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {alloc.startTime} - {alloc.endTime}
                      </span>
                    </td>

                    {/* Asignatura */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{alloc.courseName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {alloc.courseCode} · {alloc.team} · <span className="font-sans">{alloc.career}</span>
                      </div>
                    </td>

                    {/* Docente */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {alloc.professorName}
                    </td>

                    {/* Inscriptos vs Efectivo */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 text-sm">{alloc.enrolledStudents}</span>
                      {alloc.effectiveCount !== alloc.enrolledStudents && (
                        <span className="text-[10px] text-amber-700 block font-semibold">
                          (Est: {alloc.effectiveCount})
                        </span>
                      )}
                    </td>

                    {/* Modalidad */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        alloc.modality === 'presencial'
                          ? 'bg-emerald-100 text-emerald-800'
                          : alloc.modality === 'virtual'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}>
                        {alloc.modality}
                      </span>
                    </td>

                    {/* Aula Asignada */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isReassigning ? (
                        <div className="flex items-center gap-1.5">
                          <select
                            defaultValue={alloc.assignedSpaceIds[0] || ''}
                            onChange={(e) => {
                              onReassignSpace(alloc.id, e.target.value);
                              setReassigningAllocId(null);
                            }}
                            className="text-xs p-1 rounded border border-purple-400 bg-white font-bold"
                          >
                            <option value="">-- Sin Aula --</option>
                            {SPACES.map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.capacity} lug - {s.floor})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setReassigningAllocId(null)}
                            className="text-[10px] text-slate-500 hover:text-slate-800"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        alloc.modality === 'presencial' ? (
                          primarySpace ? (
                            <div>
                              <span className="font-black text-slate-900">
                                {alloc.assignedSpaceIds.length > 1
                                  ? assignedSpaces.map(s => s?.name).join(' + ')
                                  : primarySpace.name
                                }
                              </span>
                              <span className="text-[11px] text-slate-500 block">
                                Piso {primarySpace.floor} · Cap: {primarySpace.capacity} lug
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded text-[11px]">
                              Sin aula asignada
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">No requiere espacio</span>
                        )
                      )}
                    </td>

                    {/* Diagnóstico / Motivo */}
                    <td className="py-3.5 px-4 text-[11px] max-w-xs text-slate-600">
                      {alloc.statusMessage || '-'}
                    </td>

                    {/* Acción */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {alloc.modality === 'presencial' && (
                        <button
                          onClick={() => setReassigningAllocId(alloc.id)}
                          className="px-2.5 py-1 text-slate-600 hover:text-unicaba-purple hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 border border-slate-200"
                          title="Reasignar aula manualmente con registro de decisión"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>Reasignar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
