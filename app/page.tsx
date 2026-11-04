'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { UserRole, Commission, DayOfWeek, InadequateSpaceReport, ChangeRequest, WeeklyAllocation } from '@/types';
import { INITIAL_COMMISSIONS, WEEKS_DATA } from '@/lib/data/mockData';
import { runAllocationForWeek } from '@/lib/engine/ruleEngine';
import { Header } from '@/components/Header';
import { CarteleraView } from '@/components/CarteleraView';
import { BedeliaConsoleView } from '@/components/BedeliaConsoleView';
import { HeatmapView } from '@/components/HeatmapView';
import { SpacesCatalogView } from '@/components/SpacesCatalogView';
import { PlanificacionView } from '@/components/PlanificacionView';
import { DocentePortalView } from '@/components/DocentePortalView';
import { CopilotDrawer } from '@/components/CopilotDrawer';
import { SupabaseModal } from '@/components/SupabaseModal';
import { CopilotMessage } from '@/lib/copilot/aiEngine';

export default function HomePage() {
  // Estado Global
  const [currentRole, setCurrentRole] = useState<UserRole>('bedelia');
  const [activeTab, setActiveTab] = useState<string>('bedelia');
  const [currentWeek, setCurrentWeek] = useState<number>(16); // Semana 16 tiene los casos emblemáticos del TFI
  const [simulation75Active, setSimulation75Active] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // Datos maestros
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS);
  
  // Modificaciones locales y manuales sobre asignaciones
  const [manualOverrides, setManualOverrides] = useState<Record<string, string[]>>({});
  const [approvedWeeks, setApprovedWeeks] = useState<Record<number, boolean>>({});

  // Reportes y solicitudes del Portal Docente
  const [inadequateReports, setInadequateReports] = useState<InadequateSpaceReport[]>([
    {
      id: 'rep-1',
      spaceId: '302',
      professorName: 'Mg. Silvina Martínez',
      courseName: 'Perspectivas Actuales acerca del Aprendizaje',
      reason: 'Proyector con parpadeo y falta de ventilación en verano',
      date: '10/11/2026',
      status: 'activa'
    }
  ]);

  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([
    {
      id: 'req-1',
      commissionId: 'COM-005',
      courseName: 'Gestión del Conocimiento con Tecnologías Digitales',
      professorName: 'Ing. Lucas Almada',
      weekNumber: 15,
      originalModality: 'virtual',
      requestedModality: 'presencial',
      reason: 'Exposición final de proyectos grupales con rúbrica presencial',
      status: 'pendiente',
      createdAt: '12/11/2026'
    }
  ]);

  // Ejecución del motor determinístico para la semana activa
  const weekSummary = useMemo(() => {
    const summary = runAllocationForWeek(commissions, currentWeek, {
      useAttendanceEstimates: simulation75Active,
      attendanceReductionPercent: simulation75Active ? 75 : undefined
    });

    // Aplicar overrides manuales de Bedelía o Copiloto si existen
    const updatedAllocations = summary.allocations.map(alloc => {
      const overrideSpaces = manualOverrides[alloc.id];
      if (overrideSpaces) {
        return {
          ...alloc,
          assignedSpaceIds: overrideSpaces,
          status: 'asignada' as const,
          statusMessage: 'Reasignado manualmente por Bedelía / Sugerencia Copiloto'
        };
      }
      return alloc;
    });

    return {
      ...summary,
      allocations: updatedAllocations
    };
  }, [commissions, currentWeek, simulation75Active, manualOverrides]);

  const currentWeekInfo = WEEKS_DATA.find(w => w.weekNumber === currentWeek) || {
    weekNumber: currentWeek,
    label: `S${currentWeek}`,
    dateRange: 'Semana ' + currentWeek
  };

  // Reasignar aula manualmente desde Bedelía
  const handleReassignSpace = useCallback((allocationId: string, newSpaceId: string) => {
    setManualOverrides(prev => ({
      ...prev,
      [allocationId]: newSpaceId ? [newSpaceId] : []
    }));
  }, []);

  // Aprobar formalmente la grilla de la semana
  const handleApproveWeek = useCallback(() => {
    setApprovedWeeks(prev => ({ ...prev, [currentWeek]: true }));
    alert(`¡Grilla de la Semana ${currentWeek} aprobada formalmente y sincronizada con la Cartelera Digital!`);
  }, [currentWeek]);

  // Forzar recálculo del motor de reglas
  const handleRunEngine = useCallback(() => {
    setManualOverrides({});
    alert(`Motor determinístico de asignación ejecutado para la Semana ${currentWeek}. Todas las comisiones han sido reevaluadas según la menor aula disponible.`);
  }, [currentWeek]);

  // Agregar comisión desde el formulario
  const handleAddCommission = useCallback((newComm: Commission) => {
    setCommissions(prev => [newComm, ...prev]);
    alert(`Comisión ${newComm.courseName} (${newComm.courseCode}) registrada con éxito.`);
  }, []);

  // Restablecer base oficial
  const handleResetCommissions = useCallback(() => {
    setCommissions(INITIAL_COMMISSIONS);
    setManualOverrides({});
    alert('Base oficial de comisiones restablecida (226 comisiones de la Sede Perón 830).');
  }, []);

  // Portal Docente: Confirmar clase
  const handleConfirmClass = useCallback((allocId: string) => {
    alert('¡Aula confirmada para la clase! Se notificó a Bedelía y a los estudiantes inscritos.');
  }, []);

  // Portal Docente: Reportar aula inadecuada
  const handleReportInadequateSpace = useCallback((reportData: Omit<InadequateSpaceReport, 'id' | 'date' | 'status'>) => {
    const newReport: InadequateSpaceReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      status: 'activa'
    };
    setInadequateReports(prev => [newReport, ...prev]);

    // Añadir a rejectedSpaces de las comisiones del docente para que el motor la descarte
    setCommissions(prev => prev.map(c => {
      if (c.professorName === reportData.professorName) {
        return {
          ...c,
          rejectedSpaces: Array.from(new Set([...(c.rejectedSpaces || []), reportData.spaceId]))
        };
      }
      return c;
    }));

    alert(`Aula ${reportData.spaceId} marcada como no adecuada. El motor de reglas la excluirá automáticamente de futuras asignaciones para este docente.`);
  }, []);

  // Portal Docente: Solicitar cambio de modalidad
  const handleRequestModalityChange = useCallback((reqData: Omit<ChangeRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: ChangeRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
      status: 'pendiente'
    };
    setChangeRequests(prev => [newReq, ...prev]);
    alert('Solicitud enviada a Coordinación y Bedelía con la disponibilidad calculada previamente.');
  }, []);

  // Copiloto: Aplicar sugerencia interactiva
  const handleApplyCopilotAction = useCallback((action: NonNullable<CopilotMessage['suggestedAction']>) => {
    if (action.type === 'reassign_space') {
      const { targetCommission, toSpace } = action.details;
      // Buscar la allocation
      const alloc = weekSummary.allocations.find(a => a.commissionId === targetCommission);
      if (alloc) {
        handleReassignSpace(alloc.id, toSpace || '404');
        alert(`¡Sugerencia aplicada con éxito! El Equipo 3 fue reasignado al Aula 404, liberando el Aula Magna 301 para el Equipo 2.`);
      }
    } else if (action.type === 'apply_simulation_75') {
      setSimulation75Active(true);
      alert('Se activó el escenario de desgranamiento al 75% en toda la plataforma.');
    }
  }, [weekSummary, handleReassignSpace]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Universal con Selector de Rol */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        simulation75Active={simulation75Active}
        onToggleSimulation75={() => setSimulation75Active(!simulation75Active)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Vista Cartelera Pública */}
        {(activeTab === 'cartelera' || currentRole === 'estudiante') && (
          <CarteleraView
            allocations={weekSummary.allocations}
            currentWeek={currentWeek}
            dateRange={currentWeekInfo.dateRange}
          />
        )}

        {/* Vista Consola Bedelía */}
        {currentRole === 'bedelia' && activeTab === 'bedelia' && (
          <BedeliaConsoleView
            allocations={weekSummary.allocations}
            currentWeek={currentWeek}
            dateRange={currentWeekInfo.dateRange}
            occupancyRate={weekSummary.occupancyRate}
            totalPresential={weekSummary.totalPresential}
            totalAssigned={weekSummary.totalAssigned}
            totalConflicts={weekSummary.totalConflicts}
            totalIntendencia={weekSummary.totalIntendencia}
            onReassignSpace={handleReassignSpace}
            onApproveWeek={handleApproveWeek}
            isWeekApproved={Boolean(approvedWeeks[currentWeek])}
            onRunEngine={handleRunEngine}
            onToggleSimulation75={() => setSimulation75Active(!simulation75Active)}
            simulation75Active={simulation75Active}
          />
        )}

        {/* Vista Mapa de Calor & Métricas */}
        {currentRole === 'bedelia' && activeTab === 'heatmap' && (
          <HeatmapView
            commissions={commissions}
            onSelectWeekAndDay={(week, day) => {
              setCurrentWeek(week);
              setActiveTab('bedelia');
            }}
            simulation75Active={simulation75Active}
          />
        )}

        {/* Vista Catálogo de 27 Espacios */}
        {currentRole === 'bedelia' && activeTab === 'spaces' && (
          <SpacesCatalogView />
        )}

        {/* Vista Planificación & Comisiones */}
        {currentRole === 'bedelia' && activeTab === 'planificacion' && (
          <PlanificacionView
            commissions={commissions}
            onAddCommission={handleAddCommission}
            onResetCommissions={handleResetCommissions}
          />
        )}

        {/* Vista Portal Docente */}
        {currentRole === 'docente' && (
          <DocentePortalView
            commissions={commissions}
            allocations={weekSummary.allocations}
            currentWeek={currentWeek}
            dateRange={currentWeekInfo.dateRange}
            onConfirmClass={handleConfirmClass}
            onReportInadequateSpace={handleReportInadequateSpace}
            onRequestModalityChange={handleRequestModalityChange}
            inadequateReports={inadequateReports}
            changeRequests={changeRequests}
          />
        )}
      </main>

      {/* Drawer Lateral del Copiloto de IA (Fase II) */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentWeek={currentWeek}
        commissions={commissions}
        onApplyAction={handleApplyCopilotAction}
      />

      {/* Modal de Conexión y Esquema de Supabase */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Espacios MVP</span>
            <span>· Universidad de la Ciudad de Buenos Aires</span>
          </div>
          <div className="text-slate-400">
            Trabajo Final Integrador · Grupo 12 · Licenciatura en Tecnologías Digitales
          </div>
        </div>
      </footer>
    </div>
  );
}
