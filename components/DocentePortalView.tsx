'use client';

import React, { useState } from 'react';
import { Commission, WeeklyAllocation, InadequateSpaceReport, ChangeRequest, RoomFeatureRequest, Modality, DayOfWeek } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { 
  UserCheck, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  MapPin, 
  Clock, 
  Calendar, 
  ThumbsUp,
  SlidersHorizontal,
  Wifi,
  Tv,
  Mic,
  Wind,
  Accessibility,
  PlusCircle,
  FileCheck2
} from 'lucide-react';

interface DocentePortalViewProps {
  commissions: Commission[];
  allocations: WeeklyAllocation[];
  currentWeek: number;
  dateRange: string;
  onConfirmClass: (allocationId: string) => void;
  onReportInadequateSpace: (report: Omit<InadequateSpaceReport, 'id' | 'date' | 'status'>) => void;
  onRequestModalityChange: (req: Omit<ChangeRequest, 'id' | 'createdAt' | 'status'>) => void;
  onRequestRoomFeatures: (req: Omit<RoomFeatureRequest, 'id' | 'createdAt' | 'status'>) => void;
  inadequateReports: InadequateSpaceReport[];
  changeRequests: ChangeRequest[];
  roomFeatureRequests: RoomFeatureRequest[];
}

export function DocentePortalView({
  commissions,
  allocations,
  currentWeek,
  dateRange,
  onConfirmClass,
  onReportInadequateSpace,
  onRequestModalityChange,
  onRequestRoomFeatures,
  inadequateReports,
  changeRequests,
  roomFeatureRequests
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

  // Modal Solicitud de Aula con Características Especiales (Req 6)
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [featureCommissionId, setFeatureCommissionId] = useState(commissions[0]?.id || '');
  const [minCapacity, setMinCapacity] = useState<number>(45);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Wi-Fi de Alta Capacidad',
    'Pizarra Doble / Pizarrón',
    'Proyector HD'
  ]);
  const [pedagogicalReason, setPedagogicalReason] = useState('');

  // Clases del docente en la semana activa
  const myAllocations = allocations.filter(a => a.professorName === selectedProf);
  const myCommissions = commissions.filter(c => c.professorName === selectedProf);

  const availableFeatures = [
    { id: 'Wi-Fi de Alta Capacidad', label: 'Wi-Fi de alta densidad (para notebooks/celulares)', icon: Wifi },
    { id: 'Pizarra Doble / Pizarrón', label: 'Pizarrón amplio / Pizarra doble para demostraciones', icon: SlidersHorizontal },
    { id: 'Proyector HD', label: 'Proyector HD con conexión HDMI y sonido', icon: Tv },
    { id: 'Sistema de Audio / Micrófonos', label: 'Micrófono corbatero / Sonido integral', icon: Mic },
    { id: 'Accesibilidad Motriz', label: 'Acceso en PB o ascensor para movilidad reducida', icon: Accessibility },
    { id: 'Ventilación y Climatización', label: 'Ventilación adecuada / Aire acondicionado', icon: Wind },
    { id: 'Laboratorio de Ciencias', label: 'Mesadas y equipamiento experimental', icon: SlidersHorizontal }
  ];

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) ? prev.filter(f => f !== featureId) : [...prev, featureId]
    );
  };

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

  const handleFeatureRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetComm = commissions.find(c => c.id === featureCommissionId) || myCommissions[0];
    if (!targetComm) return;

    onRequestRoomFeatures({
      commissionId: targetComm.id,
      courseName: targetComm.courseName,
      professorName: selectedProf,
      weekNumber: currentWeek,
      dayOfWeek: targetComm.dayOfWeek,
      minCapacity: Number(minCapacity),
      requiredFeatures: selectedFeatures,
      pedagogicalReason: pedagogicalReason.trim() || 'Actividad práctica con requerimientos técnicos específicos.'
    });

    setIsFeatureModalOpen(false);
    setPedagogicalReason('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full border border-brand-blue/20">
              Portal Docente
            </span>
            <span className="text-xs text-slate-500">· Gestión de Aulas y Requerimientos</span>
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight mt-1">
            Mis Clases y Espacios Asignados
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Semana activa: <span className="font-bold text-slate-800">S{currentWeek} ({dateRange})</span> · Confirmá tu espacio o solicitá aulas con características especiales
          </p>
        </div>

        {/* Acciones del Docente */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsFeatureModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-navy hover:from-[#006cb8] hover:to-[#081b33] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-brand-cyan" />
            <span>Solicitar Aula con Características</span>
          </button>

          {/* Selector de Docente para la Presentación */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs">
            <span className="font-bold text-slate-500 pl-1">Docente:</span>
            <select
              value={selectedProf}
              onChange={(e) => setSelectedProf(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-bold text-brand-navy focus:ring-1 focus:ring-brand-blue"
            >
              {professors.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Mis Clases */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-brand-navy flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-blue" />
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
                <div key={alloc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-brand-blue/40 transition-colors">
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
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {alloc.dayOfWeek} de {alloc.startTime} a {alloc.endTime} hs
                      </span>
                      <span className="font-medium text-slate-500">{alloc.enrolledStudents} inscriptos</span>
                    </div>

                    {/* Espacio Asignado */}
                    {isPresential && primarySpace && (
                      <div className="mt-4 p-3 bg-brand-light rounded-xl border border-brand-blue/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-brand-blue" />
                          <div>
                            <div className="font-black text-sm text-brand-navy">{primarySpace.name}</div>
                            <div className="text-[11px] text-slate-600">
                              Piso <span className="font-bold text-slate-800">{primarySpace.floor}</span> · Capacidad: {primarySpace.capacity} lugares
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white text-brand-blue px-2 py-0.5 rounded border border-brand-blue/30">
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
                        title="Pedir cambio de modalidad con 48 h de anticipación"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-500" />
                        <span>Cambiar Modalidad</span>
                      </button>

                      {isPresential && primarySpace && (
                        <button
                          onClick={() => setReportingSpaceForAlloc(alloc)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-all border border-rose-200"
                          title="Marcar aula no adecuada para que el motor la descarte"
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

      {/* Historial de Solicitudes de Aulas Especiales y Reportes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Solicitudes de Aulas con Características (Req 6) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-xs text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
              Solicitudes de Aulas con Características Específicas ({roomFeatureRequests.length})
            </h3>
            <span className="text-[10px] text-slate-400">Wi-Fi, Pizarrón, Capacidad, etc.</span>
          </div>

          {roomFeatureRequests.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No se han registrado solicitudes especiales todavía.</p>
          ) : (
            <div className="space-y-2.5">
              {roomFeatureRequests.map((req) => (
                <div key={req.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-brand-navy">{req.courseName}</span>
                      <span className="text-slate-500 text-[11px] block">
                        Día {req.dayOfWeek} · Capacidad mínima requerida: <strong>{req.minCapacity} personas</strong>
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'asignada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'rechazada'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status === 'asignada' ? 'Asignada y Confirmada' : 'Pendiente en Bedelía'}
                    </span>
                  </div>

                  {/* Características solicitadas */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {req.requiredFeatures.map((feat, idx) => (
                      <span key={idx} className="bg-white text-brand-blue border border-brand-blue/20 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  {req.pedagogicalReason && (
                    <p className="text-slate-600 text-[11px] bg-white/70 p-2 rounded-lg border border-slate-100 mt-1">
                      <em>" {req.pedagogicalReason} "</em>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aulas Inadecuadas Bloqueadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-extrabold text-xs text-brand-navy uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            Aulas Descartadas ({inadequateReports.length})
          </h3>
          {inadequateReports.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay aulas descartadas.</p>
          ) : (
            <div className="space-y-2">
              {inadequateReports.map((r) => (
                <div key={r.id} className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>Aula {r.spaceId}</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-mono">
                      Bloqueada
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 text-[11px]">Motivo: {r.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Solicitar Aula con Características Específicas (Req 6) */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-2xl shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy text-base">Solicitar Aula con Requisitos Especiales</h3>
                  <p className="text-xs text-slate-500">Wi-Fi, Pizarrón, Capacidad y Equipamiento</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleFeatureRequestSubmit} className="space-y-4 text-xs">
              {/* Asignatura */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Materia / Comisión *</label>
                <select
                  value={featureCommissionId}
                  onChange={(e) => setFeatureCommissionId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-blue"
                >
                  {myCommissions.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.courseName} ({c.team}) - {c.dayOfWeek} {c.startTime} a {c.endTime} hs
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacidad Mínima */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Capacidad Mínima de Butacas Necesarias *
                </label>
                <input
                  type="number"
                  min="5"
                  max="150"
                  required
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              {/* Checkboxes de Características Específicas */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Características y Equipamiento Requerido:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableFeatures.map((feat) => {
                    const isChecked = selectedFeatures.includes(feat.id);
                    const IconComponent = feat.icon;
                    return (
                      <button
                        key={feat.id}
                        type="button"
                        onClick={() => toggleFeature(feat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          isChecked
                            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 font-medium'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 shrink-0 ${isChecked ? 'text-brand-blue' : 'text-slate-400'}`} />
                        <span className="text-[11px] leading-tight">{feat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Motivo Pedagógico */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Justificación Pedagógica / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={pedagogicalReason}
                  onChange={(e) => setPedagogicalReason(e.target.value)}
                  placeholder="Ej: Clase práctica donde los estudiantes usarán notebooks simultáneamente y requieren buena señal de Wi-Fi..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeatureModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-blue hover:bg-[#006cb8] text-white font-bold rounded-xl shadow-xs"
                >
                  Registrar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reporte de Aula Inadecuada */}
      {reportingSpaceForAlloc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
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
                  placeholder="Ej: Problemas de ventilación / Proyector dañado / Acústica deficiente"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-brand-blue" />
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-blue"
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
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-blue"
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
                  className="px-4 py-2 bg-brand-blue hover:bg-[#006cb8] text-white font-bold rounded-xl shadow-xs"
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
