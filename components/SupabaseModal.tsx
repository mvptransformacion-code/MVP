'use client';

import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseModal({ isOpen, onClose }: SupabaseModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = async () => {
    try {
      const sqlText = `-- PROYECTO ESPACIOS - UNIVERSIDAD DE LA CIUDAD DE BUENOS AIRES
-- Esquema Supabase (PostgreSQL) para Sede Perón 830
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.spaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    floor TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    department TEXT NOT NULL DEFAULT 'Propios',
    equipment TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.commissions (
    id TEXT PRIMARY KEY,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    career TEXT NOT NULL,
    team TEXT NOT NULL DEFAULT 'Único',
    professor_name TEXT NOT NULL,
    professor_email TEXT,
    enrolled_students INTEGER NOT NULL,
    estimated_attendance INTEGER,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL DEFAULT '18:00',
    end_time TEXT NOT NULL DEFAULT '21:30',
    weekly_modality JSONB NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    rejected_spaces TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cargar 27 espacios oficiales
INSERT INTO public.spaces (id, name, floor, type, capacity, department, equipment) VALUES
  ('-1A', 'Auditorio', 'Subsuelo', 'Auditorio', 120, 'Intendencia', ARRAY['Proyector HD', 'Sonido integral']),
  ('0SCA', 'Sala de Capacitación A', 'PB', 'Sala de Capacitación', 30, 'Intendencia', ARRAY['Proyector']),
  ('0SCB', 'Sala de Capacitación B', 'PB', 'Sala de Capacitación', 30, 'Intendencia', ARRAY['Proyector']),
  ('1', 'Laboratorio de Ciencias', '1°', 'Lab. de Ciencias', 60, 'Propios', ARRAY['Equipamiento científico']),
  ('201', 'Aula 201', '2°', 'Aula', 42, 'Propios', ARRAY['Proyector']),
  ('202', 'Aula 202', '2°', 'Aula', 48, 'Propios', ARRAY['Proyector']),
  ('203', 'Aula 203', '2°', 'Aula', 60, 'Propios', ARRAY['Proyector']),
  ('204', 'Aula 204', '2°', 'Aula', 48, 'Propios', ARRAY['Proyector']),
  ('205', 'Aula 205', '2°', 'Aula', 60, 'Propios', ARRAY['Proyector']),
  ('206', 'Aula 206', '2°', 'Aula', 99, 'Propios', ARRAY['Proyector', 'Sonido']),
  ('2SR', 'Sala de Reunión 2SR', '2°', 'Sala de Reunión', 12, 'Propios', ARRAY['Pantalla TV']),
  ('301', 'Aula Magna 301', '3°', 'Aula', 121, 'Propios', ARRAY['Proyector doble', 'Sonido']),
  ('302', 'Aula 302', '3°', 'Aula', 22, 'Propios', ARRAY['Proyector']),
  ('303', 'Aula 303', '3°', 'Aula', 28, 'Propios', ARRAY['Proyector']),
  ('304', 'Aula 304', '3°', 'Aula', 28, 'Propios', ARRAY['Proyector']),
  ('305', 'Aula 305', '3°', 'Aula', 22, 'Propios', ARRAY['Proyector']),
  ('306', 'Aula 306', '3°', 'Aula', 98, 'Propios', ARRAY['Proyector', 'Sonido']),
  ('307', 'Aula 307', '3°', 'Aula', 24, 'Propios', ARRAY['Proyector']),
  ('308', 'Aula 308', '3°', 'Aula', 24, 'Propios', ARRAY['Proyector']),
  ('309', 'Aula 309', '3°', 'Aula', 40, 'Propios', ARRAY['Proyector']),
  ('401', 'Aula 401', '4°', 'Aula', 42, 'Propios', ARRAY['Proyector']),
  ('402', 'Aula 402', '4°', 'Aula', 56, 'Propios', ARRAY['Proyector']),
  ('403', 'Aula 403', '4°', 'Aula', 56, 'Propios', ARRAY['Proyector']),
  ('404', 'Aula 404', '4°', 'Aula', 60, 'Propios', ARRAY['Proyector']),
  ('405', 'Aula 405', '4°', 'Aula', 50, 'Propios', ARRAY['Proyector']),
  ('406', 'Aula 406', '4°', 'Aula', 96, 'Propios', ARRAY['Proyector', 'Sonido']),
  ('4SR', 'Sala de Reunión 4SR', '4°', 'Sala de Reunión', 13, 'Propios', ARRAY['Pantalla TV'])
ON CONFLICT (id) DO NOTHING;`;

      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Integración con Supabase</h3>
              <p className="text-xs text-slate-500">Base de Datos PostgreSQL y Autenticación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modo Híbrido Activo */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-emerald-950">Modo Híbrido Activo (Listo para Presentación)</h4>
            <p className="text-emerald-800 mt-0.5">
              La plataforma está funcionando con el conjunto de datos completo y validado de la <strong>Sede Perón 830</strong>. 
              Para vincular tu propio proyecto en la nube de Supabase, sigue los 3 pasos a continuación.
            </p>
          </div>
        </div>

        {/* Pasos para conectar Supabase */}
        <div className="space-y-3 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
            <div>
              <p className="font-bold">Crea tu proyecto en Supabase:</p>
              <p className="text-slate-500">
                Ingresa en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> y crea un nuevo proyecto gratuito.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
            <div className="flex-1">
              <p className="font-bold">Ejecuta el script SQL en el SQL Editor:</p>
              <p className="text-slate-500 mb-2">Crea las tablas y precarga los 27 espacios con 1 click:</p>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Script SQL Copiado al portapapeles!' : 'Copiar Script SQL Completo (schema.sql)'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
            <div>
              <p className="font-bold">Configura tus variables de entorno en Vercel o en .env.local:</p>
              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] mt-1">
                NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
