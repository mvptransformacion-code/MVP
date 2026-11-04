'use client';

import React from 'react';
import { UserRole } from '@/types';
import { WEEKS_DATA } from '@/lib/data/mockData';
import { Database, ShieldCheck, GraduationCap, Building2, UserCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentWeek: number;
  onWeekChange: (week: number) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSupabaseModal: () => void;
  simulation75Active: boolean;
  onToggleSimulation75: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export function Header({
  currentRole,
  onRoleChange,
  currentWeek,
  onWeekChange,
  activeTab,
  onTabChange,
  onOpenSupabaseModal,
  simulation75Active,
  onToggleSimulation75,
  onToggleCopilot,
  isCopilotOpen
}: HeaderProps) {
  const currentWeekObj = WEEKS_DATA.find(w => w.weekNumber === currentWeek);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-unicaba-pink via-unicaba-purple to-unicaba-dark text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide">UniCABA</span>
          <span>Universidad de la Ciudad de Buenos Aires · Sede Perón 830</span>
          <span className="hidden md:inline text-white/70">|</span>
          <span className="hidden md:inline text-white/90">Lic. en Tecnologías Digitales · TFI Grupo 12</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/40 transition-colors text-[11px]"
            title="Configuración de base de datos y esquema Supabase"
          >
            <Database className="w-3 h-3 text-emerald-300" />
            <span>Supabase Híbrido: Activo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-unicaba-pink to-unicaba-blue flex items-center justify-center shadow-md text-white font-black text-xl">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                espacios
              </span>
              <span className="text-[10px] uppercase font-bold bg-pink-100 text-unicaba-pink px-2 py-0.5 rounded-full border border-pink-200">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500">Gestión Inteligente de Aulas y Espacios</p>
          </div>
        </div>

        {/* Global Controls: Week Selector & Simulation Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <span className="px-2 text-slate-500 font-semibold">Semana:</span>
            <select
              value={currentWeek}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              aria-label="Seleccionar semana del cuatrimestre"
              className="bg-white text-slate-800 rounded-md px-2 py-1 font-bold shadow-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-unicaba-pink"
            >
              {WEEKS_DATA.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  {w.label} ({w.dateRange})
                </option>
              ))}
            </select>
          </div>

          {/* 75% Attendance Scenario Toggle */}
          <button
            onClick={onToggleSimulation75}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs border ${
              simulation75Active
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Simula desgranamiento al 75% de asistencia (Anexo A del TFI)"
          >
            <span className={`w-2 h-2 rounded-full ${simulation75Active ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>Escenario 75% Asistencia</span>
          </button>

          {/* AI Copilot Toggle Button */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isCopilotOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Copiloto IA (Fase II)</span>
          </button>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              onRoleChange('estudiante');
              onTabChange('cartelera');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentRole === 'estudiante'
                ? 'bg-white text-unicaba-pink shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Público / Alumnos</span>
          </button>

          <button
            onClick={() => {
              onRoleChange('bedelia');
              if (activeTab === 'docente') onTabChange('bedelia');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentRole === 'bedelia'
                ? 'bg-white text-unicaba-purple shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bedelía / Asignador</span>
          </button>

          <button
            onClick={() => {
              onRoleChange('docente');
              onTabChange('docente');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              currentRole === 'docente'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Portal Docente</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation for Bedelía role */}
      {currentRole === 'bedelia' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 border-t border-slate-100 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('bedelia')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bedelia'
                ? 'border-unicaba-purple text-unicaba-purple font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Consola de Asignación & Reglas
          </button>
          <button
            onClick={() => onTabChange('heatmap')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'heatmap'
                ? 'border-unicaba-purple text-unicaba-purple font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Mapa de Calor & Métricas (16 Semanas)
          </button>
          <button
            onClick={() => onTabChange('spaces')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'spaces'
                ? 'border-unicaba-purple text-unicaba-purple font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Catálogo de 27 Espacios (Perón 830)
          </button>
          <button
            onClick={() => onTabChange('planificacion')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'planificacion'
                ? 'border-unicaba-purple text-unicaba-purple font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Carga de Planificación & Comisiones
          </button>
          <button
            onClick={() => onTabChange('cartelera')}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cartelera'
                ? 'border-unicaba-purple text-unicaba-purple font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Vista Cartelera Digital
          </button>
        </div>
      )}
    </header>
  );
}
