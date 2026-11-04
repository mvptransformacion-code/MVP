'use client';

import React from 'react';
import { UserRole, FictionalUser } from '@/types';
import { WEEKS_DATA } from '@/lib/data/mockData';
import { Logo } from '@/components/Logo';
import { 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Sparkles, 
  LogOut, 
  TrendingUp, 
  User as UserIcon,
  Flame
} from 'lucide-react';

interface HeaderProps {
  currentUser: FictionalUser | null;
  onLogout: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentWeek: number;
  onWeekChange: (week: number) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  simulation75Active: boolean;
  onToggleSimulation75: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export function Header({
  currentUser,
  onLogout,
  currentRole,
  onRoleChange,
  currentWeek,
  onWeekChange,
  activeTab,
  onTabChange,
  simulation75Active,
  onToggleSimulation75,
  onToggleCopilot,
  isCopilotOpen
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner en Azul Marino y Cyan de la portada */}
      <div className="bg-gradient-to-r from-brand-navy via-[#004e82] to-[#0077c8] text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Universidad de la Ciudad de Buenos Aires</span>
          <span className="text-white/60">·</span>
          <span className="text-white/90">Sede Perón 830</span>
        </div>

        {/* Usuario conectado y Cerrar sesión */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-white/80 hidden sm:inline text-[11px]">
                Conectado como <strong className="text-white">{currentUser.name}</strong> ({currentUser.roleLabel})
              </span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-0.5 rounded-lg border border-white/20 transition-colors text-[11px] font-bold"
                title="Cerrar sesión y volver a la pantalla de acceso"
              >
                <LogOut className="w-3 h-3" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-lg transition-colors text-[11px] font-bold"
            >
              <UserIcon className="w-3 h-3" />
              <span>Iniciar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo oficial con colores de la portada */}
        <div className="cursor-pointer" onClick={() => onTabChange('cartelera')}>
          <Logo size="sm" showSubtitle={true} />
        </div>

        {/* Controles Globales: Selector de Semana, Escenario y Copiloto */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Week Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <span className="px-2 text-brand-navy font-black">Semana:</span>
            <select
              value={currentWeek}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              aria-label="Seleccionar semana"
              className="bg-white text-brand-navy rounded-lg px-2.5 py-1 font-extrabold shadow-2xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {WEEKS_DATA.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  {w.label} ({w.dateRange})
                </option>
              ))}
            </select>
          </div>

          {/* Escenario Asistencia al 75% */}
          <button
            onClick={onToggleSimulation75}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs border ${
              simulation75Active
                ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Simular escenario de desgranamiento al 75% de asistencia"
          >
            <span className={`w-2 h-2 rounded-full ${simulation75Active ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>Escenario 75% Asistencia</span>
          </button>

          {/* Botón Copiloto de IA */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-xs ${
              isCopilotOpen
                ? 'bg-gradient-to-r from-brand-blue to-brand-navy text-white ring-2 ring-brand-blue/50'
                : 'bg-brand-light hover:bg-blue-100/80 text-brand-blue border border-brand-blue/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Copiloto IA</span>
          </button>
        </div>

        {/* Selector de Perfil / Roles */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => {
              onRoleChange('estudiante');
              onTabChange('cartelera');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentRole === 'estudiante'
                ? 'bg-white text-brand-blue shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Cartelera Pública</span>
          </button>

          <button
            onClick={() => {
              onRoleChange('bedelia');
              if (activeTab === 'docente') onTabChange('bedelia');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentRole === 'bedelia'
                ? 'bg-white text-brand-navy shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bedelía</span>
          </button>

          <button
            onClick={() => {
              onRoleChange('docente');
              onTabChange('docente');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              currentRole === 'docente'
                ? 'bg-white text-brand-magenta shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Portal Docente</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation cuando se está en rol Bedelía */}
      {currentRole === 'bedelia' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 border-t border-slate-100 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => onTabChange('bedelia')}
            className={`px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'bedelia'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Consola de Asignación & Reglas
          </button>
          <button
            onClick={() => onTabChange('heatmap')}
            className={`px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'heatmap'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Mapa de Calor & Métricas
          </button>
          <button
            onClick={() => onTabChange('spaces')}
            className={`px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'spaces'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Catálogo de 27 Espacios
          </button>
          <button
            onClick={() => onTabChange('planificacion')}
            className={`px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'planificacion'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Carga de Planificación
          </button>
          <button
            onClick={() => onTabChange('cartelera')}
            className={`px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cartelera'
                ? 'border-brand-blue text-brand-blue'
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
