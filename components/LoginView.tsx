'use client';

import React, { useState } from 'react';
import { FictionalUser } from '@/types';
import { FICTIONAL_USERS } from '@/lib/data/users';
import { Logo } from '@/components/Logo';
import { 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Tv, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: FictionalUser) => void;
  onViewPublicCartelera: () => void;
}

export function LoginView({ onLogin, onViewPublicCartelera }: LoginViewProps) {
  const [selectedUser, setSelectedUser] = useState<FictionalUser>(FICTIONAL_USERS[0]);
  const [email, setEmail] = useState(FICTIONAL_USERS[0].email);
  const [password, setPassword] = useState('unicaba2026');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectQuickUser = (user: FictionalUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('unicaba2026');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedUser);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061527] via-[#0a2240] to-[#004e82] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Elementos decorativos inspirados en la portada del TP (ondas cyan y magenta) */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#008bd2]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#e60067]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-[#00b4d8]/10 blur-3xl pointer-events-none" />

      {/* Franja superior estética */}
      <div className="w-full bg-white/10 backdrop-blur-md border-b border-white/10 py-2 px-6 flex items-center justify-between text-white/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-wide">UniCABA</span>
          <span>·</span>
          <span>Universidad de la Ciudad de Buenos Aires</span>
          <span className="hidden sm:inline">· Sede Perón 830</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistema en Línea</span>
        </div>
      </div>

      {/* Contenedor Central */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Columna Izquierda: Identidad Visual y Presentación */}
          <div className="md:col-span-5 bg-gradient-to-br from-brand-navy via-[#004270] to-[#0077c8] p-8 text-white flex flex-col justify-between relative">
            {/* Ondas decorativas de portada */}
            <div className="absolute bottom-0 right-0 w-44 h-44 rounded-full bg-brand-cyan/20 blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-magenta/20 blur-xl pointer-events-none" />

            <div>
              {/* Logo en versión blanco/claro */}
              <div className="inline-block bg-white/95 p-4 rounded-2xl shadow-lg mb-6 border border-white">
                <Logo size="md" showSubtitle={true} />
              </div>

              <div className="space-y-3 mt-4">
                <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-magenta" />
                  Sede Perón 830
                </div>
                <h2 className="text-xl font-black text-white leading-tight">
                  Gestión Unificada y Trazable de Espacios
                </h2>
                <p className="text-xs text-white/80 leading-relaxed">
                  Asignación inteligente para 226 comisiones en 27 espacios físicos de 6 niveles, con motor de reglas determinístico y asistencia de IA.
                </p>
              </div>
            </div>

            {/* Acceso Directo a Cartelera Pública */}
            <div className="mt-8 pt-6 border-t border-white/15">
              <span className="text-[11px] text-white/70 block mb-2 font-medium">¿Sos alumno o visitante?</span>
              <button
                type="button"
                onClick={onViewPublicCartelera}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs transition-all border border-white/30 shadow-xs"
              >
                <Tv className="w-4 h-4 text-brand-cyan" />
                <span>Ver Cartelera Pública de Aulas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto text-white/70" />
              </button>
            </div>
          </div>

          {/* Columna Derecha: Formulario y Perfiles de Demostración */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-brand-navy">Iniciar Sesión Institucional</h3>
                  <p className="text-xs text-slate-500">Selecciona un perfil de demostración o ingresa tus credenciales</p>
                </div>
              </div>

              {/* Botones de Selección Rápida de Perfil */}
              <div className="mb-5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Perfiles de Prueba Rápidos:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FICTIONAL_USERS.map((user) => {
                    const isSelected = selectedUser.id === user.id;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectQuickUser(user)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-brand-blue/10 border-brand-blue ring-2 ring-brand-blue/30 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${user.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                          {user.role === 'bedelia' ? <Building2 className="w-4 h-4" /> : user.role === 'docente' ? <UserCheck className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-black text-slate-900 truncate">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-semibold truncate">{user.roleLabel}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Formulario de Login */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico Institucional
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@unicaba.edu.ar"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white font-medium text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-brand-blue to-[#005da3] hover:from-[#006cb8] hover:to-[#004e88] text-white font-extrabold rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Validando usuario institucional...</span>
                  ) : (
                    <>
                      <span>Ingresar al Sistema como {selectedUser.name.split(' ')[0]}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Nota de pie informativa */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
                Acceso con cuenta institucional
              </span>
              <span className="font-semibold text-brand-navy">UniCABA 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separador inferior sutil */}
      <div className="w-full py-2 text-center text-[11px] text-white/50 z-10">
        Plataforma Espacios · Sede Perón 830
      </div>
    </div>
  );
}

