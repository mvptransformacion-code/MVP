'use client';

import React from 'react';
import { Commission, DayOfWeek } from '@/types';
import { generateHeatmapMatrix } from '@/lib/engine/ruleEngine';
import { WEEKS_DATA } from '@/lib/data/mockData';
import { Flame, Info, CheckCircle2, TrendingUp, BarChart3, AlertOctagon } from 'lucide-react';

interface HeatmapViewProps {
  commissions: Commission[];
  onSelectWeekAndDay: (week: number, day: DayOfWeek) => void;
  simulation75Active: boolean;
}

export function HeatmapView({ commissions, onSelectWeekAndDay, simulation75Active }: HeatmapViewProps) {
  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const heatmapData = generateHeatmapMatrix(commissions, {
    useAttendanceEstimates: simulation75Active,
    attendanceReductionPercent: simulation75Active ? 75 : undefined
  });

  const getCellColor = (status: string) => {
    switch (status) {
      case 'holiday':
        return 'bg-slate-100 text-slate-400 border-slate-200';
      case 'conflict_large':
        return 'bg-purple-600 text-white font-extrabold shadow-xs'; // >121 inscriptos
      case 'conflict_no_space':
        return 'bg-rose-600 text-white font-extrabold shadow-xs animate-pulse'; // Sin aula
      case 'intendencia':
        return 'bg-amber-600 text-white font-bold'; // Requiere auditorio
      case 'high':
        return 'bg-amber-400 text-slate-900 font-bold'; // 20-24 aulas
      case 'medium':
        return 'bg-teal-400 text-slate-900 font-bold'; // 12-19 aulas
      case 'low':
      default:
        return 'bg-emerald-100 text-emerald-900 font-semibold'; // <12 aulas
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-unicaba-purple font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-purple-200">
              Ilustración 3 del TFI
            </span>
            <span className="text-xs text-slate-500">· Matriz Completa del Cuatrimestre (2C 2026)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Mapa de Calor de Ocupación y Cuellos de Botella
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Distribución de comisiones presenciales por día y semana. El número indica comisiones activas; el color, la saturación del edificio.
          </p>
        </div>

        {/* Badge de simulación activa */}
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-unicaba-pink" />
          <div>
            <span className="text-slate-500 block">Modo de cálculo:</span>
            <span className="font-bold text-slate-800">
              {simulation75Active ? 'Simulación con Desgranamiento (75% Asistencia)' : 'Escenario Base (Total Inscriptos)'}
            </span>
          </div>
        </div>
      </div>

      {/* Matriz del Mapa de Calor */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr>
              <th className="py-2.5 px-3 text-left text-xs font-bold text-slate-400 w-24">Día / Sem</th>
              {WEEKS_DATA.map((w) => (
                <th key={w.weekNumber} className="py-2.5 px-1.5 text-center">
                  <div className="text-xs font-black text-slate-800">{w.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal whitespace-nowrap">{w.dateRange}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="border-t border-slate-100">
                <td className="py-2.5 px-3 font-extrabold text-xs text-slate-700 whitespace-nowrap">
                  {day}
                </td>
                {WEEKS_DATA.map((w) => {
                  const cell = heatmapData.find(c => c.day === day && c.week === w.weekNumber);
                  const count = cell ? cell.presentialCount : 0;
                  const status = cell ? cell.status : 'holiday';

                  return (
                    <td key={w.weekNumber} className="p-1 text-center">
                      <button
                        onClick={() => onSelectWeekAndDay(w.weekNumber, day)}
                        className={`w-full h-11 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105 hover:ring-2 hover:ring-slate-900/30 ${getCellColor(
                          status
                        )}`}
                        title={`Semana ${w.weekNumber} (${day}): ${count} comisiones presenciales. Click para ver detalle.`}
                      >
                        <span className="text-xs font-black leading-none">{count}</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Referencias del Mapa de Calor (Exactas del TFI) */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Referencias:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
            <span>Menos de 12 aulas</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-teal-400 inline-block" />
            <span>12 a 19 aulas</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 inline-block" />
            <span>20 a 24 aulas (casi lleno)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-purple-600 inline-block" />
            <span className="font-medium text-purple-900">Comisiones &gt; 121 inscriptos (superan el aula mayor)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-600 inline-block" />
            <span>Requiere Intendencia</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-600 inline-block" />
            <span className="font-bold text-rose-800">Quedan sin disponibilidad propia</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block" />
            <span className="text-slate-400">Feriado / Sin presenciales</span>
          </div>
        </div>
      </div>

      {/* Tabla Comparativa de Indicadores (Tabla 4 y 24 del TFI) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-unicaba-pink" />
          <h2 className="text-base font-black text-slate-900">
            Comparativa de Desempeño: Cartelera Real vs. Motor de Reglas (TFI Tablas 4 y 24)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Indicador</th>
                <th className="py-2.5 px-3 text-center">Asignación Real (Cartelera Noviembre)</th>
                <th className="py-2.5 px-3 text-center">Simulación Motor (Base Inscriptos)</th>
                <th className="py-2.5 px-3 text-center text-emerald-800 bg-emerald-50/50">Simulación con Desgranamiento (75%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Ocupación media por franja</td>
                <td className="py-2.5 px-3 text-center">74%</td>
                <td className="py-2.5 px-3 text-center font-bold">67%</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-700 bg-emerald-50/30">59% (50% si no se reasigna)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Clases con menos lugares que inscriptos</td>
                <td className="py-2.5 px-3 text-center text-amber-700 font-bold">49 clases (17%)</td>
                <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">0 (Regla inviolable)</td>
                <td className="py-2.5 px-3 text-center text-emerald-700 font-bold bg-emerald-50/30">0</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Clases publicadas sin aula asignada</td>
                <td className="py-2.5 px-3 text-center text-red-600 font-bold">20 ("Consultar en Bedelía")</td>
                <td className="py-2.5 px-3 text-center">77 comisiones-franja</td>
                <td className="py-2.5 px-3 text-center font-black text-emerald-700 bg-emerald-50/30">35 (Baja un 54%)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Grupos chicos en aulas sobredimensionadas</td>
                <td className="py-2.5 px-3 text-center">59 casos</td>
                <td className="py-2.5 px-3 text-center">207 casos</td>
                <td className="py-2.5 px-3 text-center text-slate-600 bg-emerald-50/30">257 casos</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-800">Tiempo semanal de gestión de aulas</td>
                <td className="py-2.5 px-3 text-center text-red-600 font-semibold">8 a 10 h semanales (15-20 h inicio)</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-600">&lt; 30 min semanales</td>
                <td className="py-2.5 px-3 text-center font-bold text-emerald-700 bg-emerald-50/30">&lt; 30 min semanales</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
