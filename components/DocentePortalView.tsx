'use client';

import React, { useState } from 'react';
import { Commission, WeeklyAllocation, InadequateSpaceReport, ChangeRequest, RoomFeatureRequest, Modality } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { 
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
  Plus,
  BookOpen
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
  const professors = Array.from(new Set(commissions.map(c => c.professorName)));
  const [selectedProf, setSelectedProf] = useState<string>(professors[0] || 'Dr. Alejandro Demarco');

  // Modales
  const [reportingSpaceForAlloc, setReportingSpaceForAlloc] = useState<WeeklyAllocation | null>(null);
  const [reportReason, setReportReason] = useState('');

  const [changingModalityAlloc, setChangingModalityAlloc] = useState<WeeklyAllocation | null>(null);
  const [newModality, setNewModality] = useState<Modality>('presencial');
  const [changeReason, setChangeReason] = useState('');

  // Modal Solicitud de Aula Especial (Req 6)
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

  // Clase destacada (Próxima Clase)
  const nextClass = myAllocations.find(a => a.modality === 'presencial') || myAllocations[0];
  const nextSpace = nextClass ? SPACES.find(s => s.id === nextClass.assignedSpaceIds[0]) : null;

  const availableFeatures = [
    { id: 'Wi-Fi de Alta Capacidad', label: 'Wi-Fi de alta densidad (notebooks/celulares)', icon: Wifi },
    { id: 'Pizarra Doble / Pizarrón', label: 'Pizarrón amplio / Pizarra doble', icon: SlidersHorizontal },
    { id: 'Proyector HD', label: 'Proyector HD con conexión HDMI', icon: Tv },
    { id: 'Sistema de Audio / Micrófono', label: 'Micrófono corbatero / Sonido', icon: Mic },
    { id: 'Accesibilidad Motriz', label: 'Acceso PB o ascensor (movilidad reducida)', icon: Accessibility },
    { id: 'Ventilación y Climatización', label: 'Ventilación adecuada / Climatización', icon: Wind }
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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Selector de Docente Sutil en la Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Portal Docente</span>
          <h2 className="text-xl font-black text-brand-navy">Bienvenido/a, {selectedProf}</h2>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200/90 p-1.5 px-3 rounded-2xl shadow-2xs">
          <span className="text-xs font-bold text-slate-400">Docente:</span>
          <select
            value={selectedProf}
            onChange={(e) => setSelectedProf(e.target.value)}
            className="text-xs font-bold text-brand-navy bg-transparent focus:outline-none"
          >
            {professors.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Hero Card: "Mi Próxima Clase" (Boceto 3) */}
      {nextClass ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm text-center max-w-xl mx-auto space-y-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
              Mi Próxima Clase
            </span>
            <div className="w-8 h-1 bg-brand-magenta rounded-full mx-auto mb-3" />
            <h3 className="text-2xl font-black text-brand-navy">
              {nextClass.courseName}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {nextClass.dayOfWeek}, {nextClass.startTime} - {nextClass.endTime} hs
            </p>
          </div>

          {/* Badge Grande de Aula en Azul Marino Profundo (Boceto 3) */}
          <div className="inline-block bg-brand-navy text-white px-8 py-3.5 rounded-full shadow-md">
            <span className="text-base font-black tracking-wide">
              {nextSpace ? `${nextSpace.name} · Piso ${nextSpace.floor}` : 'Aula en Confirmación'}
            </span>
          </div>

          <div>
            <button
              onClick={() => onConfirmClass(nextClass.id)}
              className="w-full sm:w-72 py-3 px-6 bg-brand-blue hover:bg-[#006cb8] text-white font-extrabold rounded-2xl text-xs transition-all shadow-xs"
            >
              Confirmar Aula
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
          No tienes clases asignadas para esta semana.
        </div>
      )}

      {/* 2. Sección: "Mis Aulas y Requerimientos" (Boceto 3) */}
      <div className="space-y-4">
        <h4 className="text-sm font-black text-brand-navy">
          Mis Aulas y Requerimientos
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {myCommissions.map((comm) => {
            const alloc = myAllocations.find(a => a.commissionId === comm.id);
            const space = alloc && alloc.assignedSpaceIds[0] ? SPACES.find(s => s.id === alloc.assignedSpaceIds[0]) : null;

            return (
              <div
                key={comm.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-brand-blue/40 transition-colors"
              >
                <div>
                  <h5 className="font-extrabold text-sm text-brand-navy line-clamp-1">{comm.courseName}</h5>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{comm.dayOfWeek} · {comm.startTime} hs</span>

                  {/* Iconos de Equipamiento (Wi-Fi, Pantalla) */}
                  <div className="flex items-center gap-2 mt-4 text-slate-400">
                    <Wifi className="w-4 h-4 text-brand-blue" />
                    <Tv className="w-4 h-4 text-slate-500" />
                    <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {/* Aula */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {space ? `${space.name} · ${space.floor}` : 'Campus'}
                  </span>
                  <button
                    onClick={() => alloc && setReportingSpaceForAlloc(alloc)}
                    className="text-[10px] text-slate-400 hover:text-rose-600 font-semibold"
                    title="Reportar aula si no resulta adecuada"
                  >
                    Reportar
                  </button>
                </div>
              </div>
            );
          })}

          {/* Tarjeta de Acción Rápida: + Solicitar Aula Especial (Boceto 3) */}
          <button
            onClick={() => setIsFeatureModalOpen(true)}
            className="p-5 rounded-2xl border-2 border-dashed border-brand-blue/30 hover:border-brand-blue hover:bg-brand-blue/5 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-black text-brand-blue leading-tight px-2">
              Solicitar Aula Especial<br />
              <span className="text-[10px] font-normal text-slate-400">(Wi-Fi, Pizarrón, etc.)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Modal: Solicitar Aula con Características (Req 6) */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 rounded-3xl shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-brand-navy text-base">Solicitar Aula con Requisitos Especiales</h3>
                <p className="text-xs text-slate-500">Wi-Fi, Pizarrón, Capacidad y Equipamiento</p>
              </div>
            </div>

            <form onSubmit={handleFeatureRequestSubmit} className="space-y-4 text-xs">
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Capacidad Mínima Requerida *
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

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Requerimientos Específicos:
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

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Motivo Pedagógico / Observaciones
                </label>
                <textarea
                  rows={2}
                  value={pedagogicalReason}
                  onChange={(e) => setPedagogicalReason(e.target.value)}
                  placeholder="Ej: Clase práctica de software donde los estudiantes usarán notebooks y requieren Wi-Fi robusto..."
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
                  Enviar Pedido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reporte de Aula Inadecuada */}
      {reportingSpaceForAlloc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-xl border border-slate-200 space-y-4">
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
                  Confirmar Descarte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
