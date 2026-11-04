'use client';

import React, { useState } from 'react';
import { Commission, DayOfWeek, Modality } from '@/types';
import { PlusCircle, RotateCcw, BookOpen } from 'lucide-react';

interface PlanificacionViewProps {
  commissions: Commission[];
  onAddCommission: (comm: Commission) => void;
  onResetCommissions: () => void;
}

export function PlanificacionView({ commissions, onAddCommission, onResetCommissions }: PlanificacionViewProps) {
  const [isOpenForm, setIsOpenForm] = useState(false);

  // Form State
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [career, setCareer] = useState('Lic. en Tecnologías Digitales');
  const [team, setTeam] = useState('Equipo 1');
  const [professorName, setProfessorName] = useState('');
  const [enrolledStudents, setEnrolledStudents] = useState<number>(35);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Miércoles');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:30');
  const [defaultModality, setDefaultModality] = useState<Modality>('presencial');

  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim() || !courseCode.trim() || !professorName.trim()) {
      alert('Por favor complete los campos obligatorios.');
      return;
    }

    const newComm: Commission = {
      id: `COM-${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      career,
      team,
      professorName: professorName.trim(),
      enrolledStudents: Number(enrolledStudents),
      estimatedAttendance: Math.round(Number(enrolledStudents) * 0.8),
      dayOfWeek,
      startTime,
      endTime,
      weeklyModality: Array(16).fill(defaultModality),
      requirements: ['Proyector']
    };

    onAddCommission(newComm);
    setIsOpenForm(false);
    // Reset form
    setCourseCode('');
    setCourseName('');
    setProfessorName('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-brand-blue/20">
              Planificación Académica
            </span>
            <span className="text-xs text-slate-500">· Formulario con Opciones Cerradas</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight mt-1">
            Gestión y Carga de Comisiones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reemplaza el envío de planillas de cálculo dispersas por un repositorio unificado y validado
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpenForm(!isOpenForm)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-blue hover:bg-[#006cb8] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isOpenForm ? 'Cerrar Formulario' : 'Nueva Comisión'}</span>
          </button>

          <button
            onClick={onResetCommissions}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-200"
            title="Recargar los datos del archivo unificado oficial de la UniCABA"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recargar Base Oficial</span>
          </button>
        </div>
      </div>

      {/* Formulario de Carga */}
      {isOpenForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-brand-blue/30 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-brand-navy flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            Cargar Nueva Comisión con Validación de Formato
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Código */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Código de Asignatura *</label>
              <input
                type="text"
                required
                placeholder="Ej: ASIG00240"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Nombre de la Asignatura *</label>
              <input
                type="text"
                required
                placeholder="Ej: Sistemas de Información"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Carrera */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Carrera / Programa *</label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="Lic. en Tecnologías Digitales">Lic. en Tecnologías Digitales</option>
                <option value="Lic. en Gestión Institucional">Lic. en Gestión Institucional</option>
                <option value="Enseñanza con Tecnologías Digitales (ETD)">Enseñanza con Tecnologías Digitales (ETD)</option>
                <option value="Profesorado Universitario">Profesorado Universitario</option>
                <option value="Tronco Común">Tronco Común</option>
              </select>
            </div>

            {/* Equipo */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Equipo / Comisión *</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="Único">Único</option>
                <option value="Equipo 1">Equipo 1</option>
                <option value="Equipo 2">Equipo 2</option>
                <option value="Equipo 3">Equipo 3</option>
              </select>
            </div>

            {/* Docente */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Docente a Cargo *</label>
              <input
                type="text"
                required
                placeholder="Nombre y Apellido del Docente"
                value={professorName}
                onChange={(e) => setProfessorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>

            {/* Inscriptos */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Cantidad de Inscriptos *</label>
              <input
                type="number"
                min="1"
                max="350"
                required
                value={enrolledStudents}
                onChange={(e) => setEnrolledStudents(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
              />
            </div>

            {/* Día */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Día de Cursada *</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue font-bold"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Franja Horaria */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">Horario (Franja Vespertina) *</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 text-center font-bold"
                />
                <span>-</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl border border-slate-200 text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpenForm(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-blue hover:bg-[#006cb8] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Guardar Comisión
            </button>
          </div>
        </form>
      )}

      {/* Lista de Comisiones Registradas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-extrabold text-xs text-brand-navy">
            Comisiones Cargadas en la Base ({commissions.length})
          </span>
          <span className="text-[11px] text-slate-400">
            Archivo Unificado · 2° Cuatrimestre 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Asignatura</th>
                <th className="py-2.5 px-3">Carrera</th>
                <th className="py-2.5 px-3">Docente</th>
                <th className="py-2.5 px-3 text-center">Inscriptos</th>
                <th className="py-2.5 px-3">Día y Horario</th>
                <th className="py-2.5 px-3">Modalidades (16 Semanas)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {commissions.map((c) => {
                const presentialWeeks = c.weeklyModality.filter(m => m === 'presencial').length;
                const virtualWeeks = c.weeklyModality.filter(m => m === 'virtual').length;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{c.courseCode}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{c.courseName}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{c.team}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{c.career}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{c.professorName}</td>
                    <td className="py-2.5 px-3 text-center font-black text-slate-900">{c.enrolledStudents}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-800">{c.dayOfWeek}</div>
                      <div className="text-[10px] text-slate-400">{c.startTime} a {c.endTime}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {presentialWeeks} pres.
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                          {virtualWeeks} virt.
                        </span>
                      </div>
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
