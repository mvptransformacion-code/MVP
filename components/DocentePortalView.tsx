'use client';

import React, { useState } from 'react';
import { Commission, WeeklyAllocation, InadequateSpaceReport, ChangeRequest, Modality } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { UserCheck, CheckCircle2, AlertOctagon, RefreshCw, MapPin, Clock, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';

interface DocentePortalViewProps {
  commissions: Commission[];
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
  onConfirmClass: (allocationId: string) => void;
  onReportInadequateSpace: (report: Omit<InadequateSpaceReport, 'id' | 'date' | 'status'>) => void;
  onRequestModalityChange: (req: Omit<ChangeRequest, 'id' | 'createdAt' | 'status'>) => void;
  inadequateReports: InadequateSpaceReport[];
  changeRequests: ChangeRequest[];
}

export function DocentePortalView({
  commissions,
  allocations,
  currentWeek,
  dateRange,
  onConfirmClass,
  onReportInadequateSpace,
  onRequestModalityChange,
  inadequateReports,
  changeRequests
}: DocentePortalViewProps) {
  // Lista de docentes disponibles para simular
  const professors = Array.from(new Set(commissions.map(c => c.professorName)));
  const [selectedProf, setSelectedProf] = useState<string>(professors[0] || 'Dr. Alejandro Demarco');

  // Modales
  const [reportingSpaceForAlloc, setReportingSpaceForAlloc] = useState<WeeklyAllocation | null>(null);
  const [reportReason, setReportReason] = useState('');

  const [changingModalityAlloc, setChangingModalityAlloc] = useState<WeeklyAllocation | null>(null);
  const [newModality, setNewModality] = useState<Modality>('presencial');
  const [changeReason, setChangeReason] = useState('');

  // Clases del docente en la semana activa
  const myAllocations = allocations.filter(a => a.professorName === selectedProf);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingSpaceForAlloc || !reportReason.trim()) return;

    const spaceId = reportingSpaceForAlloc.assignedSpaceIds[0];
    if (spaceId) {
      onReportInadequateSpace({
        spaceId,
        professorName: selectedProf,
        courseName: reportingSpaceForAlloc.courseName,
        reason: reportReason.trim()
      });
    }
    setReportingSpaceForAlloc(null);
    setReportReason('');
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changingModalityAlloc || !changeReason.trim()) return;

    onRequestModalityChange({
      commissionId: changingModalityAlloc.commissionId,
      courseName: changingModalityAlloc.courseName,
      professorName: selectedProf,
      weekNumber: currentWeek,
      originalModality: changingModalityAlloc.modality,
      requestedModality: newModality,
      reason: changeReason.trim()
    });
    setChangingModalityAlloc(null);
    setChangeReason('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-indigo-200">
              Portal Docente (Fase 2)
            </span>
            <span className="text-xs text-slate-500">· Gestión del Cambio y Comunicación Activa</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Mis Clases y Espacios Asignados
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Semana activa: S{currentWeek} ({dateRange}) · Podés confirmar tu aula o solicitar cambios con 48 h de anticipación
          </p>
        </div>

        {/* Selector de Docente para la Demo */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs">
          <span className="font-bold text-slate-500">Simular como:</span>
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-900 focus:ring-1 focus:ring-indigo-500"
          >
            {professors.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Mis Clases */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          Clases programadas para {selectedProf} (Semana {currentWeek})
        </h2>

        {myAllocations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No tienes clases asignadas para la semana {currentWeek}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAllocations.map((alloc) => {
              const isPresential = alloc.modality === 'presencial';
              const assignedSpaces = alloc.assignedSpaceIds.map(id => SPACES.find(s => s.id === id)).filter(Boolean);
              const primarySpace = assignedSpaces[0];

              return (
                <div key={alloc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {alloc.courseCode} · {alloc.team}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        alloc.modality === 'presencial'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alloc.modality.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{alloc.courseName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{alloc.career}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {alloc.dayOfWeek} de {alloc.startTime} a {alloc.endTime} hs
                      </span>
                      <span>{alloc.enrolledStudents} inscriptos</span>
                    </div>

                    {/* Espacio Asignado */}
                    {isPresential && primarySpace && (
                      <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-black text-sm text-indigo-950">{primarySpace.name}</div>
                            <div className="text-[11px] text-indigo-700">
                              Piso {primarySpace.floor} · Capacidad {primarySpace.capacity} lugares
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold bg-white text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                          Asignada
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botones de Acción Docente */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onConfirmClass(alloc.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Confirmar Aula</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setChangingModalityAlloc(alloc)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-200"
                        title="Pedir cambio de modalidad hasta 48 h antes"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Pedir Cambio</span>
                      </button>

                      {isPresential && primarySpace && (
                        <button
                          onClick={() => setReportingSpaceForAlloc(alloc)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-all border border-rose-200"
                          title="Reportar esta aula como no adecuada para que el motor no la vuelva a asignar"
                        >
                          <AlertOctagon className="w-3 h-3 text-rose-500" />
                          <span>Aula No Adecuada</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historial de Reportes y Solicitudes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reportes de Aulas Inadecuadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            Aulas Marcadas como No Adecuadas ({inadequateReports.length})
          </h3>
          {inadequateReports.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay aulas marcadas como inadecuadas.</p>
          ) : (
            <div className="space-y-2">
              {inadequateReports.map((r) => (
                <div key={r.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>Aula {r.spaceId}</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-mono">
                      Bloqueada para este docente
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">Motivo: {r.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Por: {r.professorName} ({r.courseName})</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solicitudes de Cambio de Modalidad */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-blue-500" />
            Solicitudes de Cambio de Modalidad ({changeRequests.length})
          </h3>
          {changeRequests.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay solicitudes de cambio pendientes.</p>
          ) : (
            <div className="space-y-2">
              {changeRequests.map((req) => (
                <div key={req.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-blue-900">
                    <span>{req.courseName} (Semana {req.weekNumber})</span>
                    <span className="text-[10px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded">
                      {req.originalModality} → {req.requestedModality}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">Motivo: {req.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Estado: Pendiente revisión Bedelía</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Reporte de Aula Inadecuada */}
      {reportingSpaceForAlloc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              Marcar Aula como No Adecuada
            </h3>
            <p className="text-xs text-slate-600">
              Indique el motivo técnico o pedagógico para que el motor de reglas <strong>no vuelva a asignarle</strong> el{' '}
              <strong>Aula {reportingSpaceForAlloc.assignedSpaceIds[0]}</strong> a su cátedra.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo del descarte *</label>
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Ej: Problemas de ventilación / Proyector dañado / Acústica deficiente para el número de estudiantes"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingSpaceForAlloc(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Registrar Descarte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Solicitud de Cambio de Modalidad */}
      {changingModalityAlloc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              Solicitar Cambio de Modalidad
            </h3>
            <p className="text-xs text-slate-600">
              Solicitud de cambio con al menos 48 h de anticipación para {changingModalityAlloc.courseName} (Semana {currentWeek}).
            </p>

            <form onSubmit={handleChangeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nueva Modalidad Deseada *</label>
                <select
                  value={newModality}
                  onChange={(e) => setNewModality(e.target.value as Modality)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="presencial">Presencial (Requiere Aula)</option>
                  <option value="virtual">Virtual (Campus)</option>
                  <option value="asincronica">Asincrónica</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Justificación *</label>
                <textarea
                  required
                  rows={3}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Ej: Evaluación presencial imprevista / Taller práctico / Actividad especial"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangingModalityAlloc(null)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Enviar a Bedelía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
