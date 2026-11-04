'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  UserRole, 
  Commission, 
  InadequateSpaceReport, 
  ChangeRequest, 
  RoomFeatureRequest, 
  FictionalUser 
} from '@/types';
import { INITIAL_COMMISSIONS, WEEKS_DATA } from '@/lib/data/mockData';
import { FICTIONAL_USERS } from '@/lib/data/users';
import { runAllocationForWeek } from '@/lib/engine/ruleEngine';
import { Header } from '@/components/Header';
import { LoginView } from '@/components/LoginView';
import { CarteleraView } from '@/components/CarteleraView';
import { BedeliaConsoleView } from '@/components/BedeliaConsoleView';
import { HeatmapView } from '@/components/HeatmapView';
import { SpacesCatalogView } from '@/components/SpacesCatalogView';
import { PlanificacionView } from '@/components/PlanificacionView';
import { DocentePortalView } from '@/components/DocentePortalView';
import { CopilotDrawer } from '@/components/CopilotDrawer';
import { CopilotMessage } from '@/lib/copilot/aiEngine';

export default function HomePage() {
  // Estado de Autenticación y Pantalla de Login (Req 1)
  const [currentUser, setCurrentUser] = useState<FictionalUser | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(true);

  // Estado de Navegación y Rol Activo
  const [currentRole, setCurrentRole] = useState<UserRole>('bedelia');
  const [activeTab, setActiveTab] = useState<string>('bedelia');
  const [currentWeek, setCurrentWeek] = useState<number>(16); // Semana 16
  const [simulation75Active, setSimulation75Active] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Datos Maestros
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS);
  
  // Modificaciones locales y manuales sobre asignaciones
  const [manualOverrides, setManualOverrides] = useState<Record<string, string[]>>({});
  const [approvedWeeks, setApprovedWeeks] = useState<Record<number, boolean>>({});

  // Solicitudes de Aulas con Características Especiales (Req 6)
  const [roomFeatureRequests, setRoomFeatureRequests] = useState<RoomFeatureRequest[]>([
    {
      id: 'feat-1',
      professorName: 'Dr. Alejandro Demarco',
      courseName: 'Fundamentos de Estadística y Probabilidad',
      commissionId: 'COM-012',
      weekNumber: 16,
      dayOfWeek: 'Miércoles',
      minCapacity: 60,
      requiredFeatures: ['Wi-Fi de Alta Capacidad', 'Pizarra Doble / Pizarrón', 'Proyector HD'],
      pedagogicalReason: 'Sesión práctica de análisis de datos y modelado probabilístico donde cada estudiante utiliza su laptop.',
      status: 'pendiente',
      createdAt: '15/11/2026'
    }
  ]);

  // Reportes y solicitudes de modalidad del Portal Docente
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

  // Manejo de Inicio de Sesión
  const handleLogin = useCallback((user: FictionalUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'bedelia') {
      setActiveTab('bedelia');
    } else if (user.role === 'docente') {
      setActiveTab('docente');
    } else {
      setActiveTab('cartelera');
    }
    setIsLoggedOut(false);
  }, []);

  // Acceso público a Cartelera sin Login
  const handleViewPublicCartelera = useCallback(() => {
    setCurrentUser(null);
    setCurrentRole('estudiante');
    setActiveTab('cartelera');
    setIsLoggedOut(false);
  }, []);

  // Cerrar Sesión
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedOut(true);
  }, []);

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

    // Añadir a rejectedSpaces de las comisiones del docente
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

  // Portal Docente: Solicitar aula con características específicas (Req 6)
  const handleRequestRoomFeatures = useCallback((reqData: Omit<RoomFeatureRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: RoomFeatureRequest = {
      ...reqData,
      id: `feat-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
      status: 'pendiente'
    };
    setRoomFeatureRequests(prev => [newReq, ...prev]);
    alert('Solicitud de aula con características específicas enviada a Bedelía con éxito.');
  }, []);

  // Bedelía: Asignar y Aprobar Solicitud de Aula con Características (Req 6)
  const handleApproveFeatureRequest = useCallback((requestId: string, assignedSpaceId: string) => {
    setRoomFeatureRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'asignada',
          assignedSpaceId
        };
      }
      return r;
    }));

    // Encontrar la asignación correspondiente y aplicar la reasignación
    const targetReq = roomFeatureRequests.find(r => r.id === requestId);
    if (targetReq) {
      const alloc = weekSummary.allocations.find(a => a.commissionId === targetReq.commissionId);
      if (alloc) {
        handleReassignSpace(alloc.id, assignedSpaceId);
      }
    }
    alert(`Aula ${assignedSpaceId} asignada con éxito al pedido del docente.`);
  }, [roomFeatureRequests, weekSummary, handleReassignSpace]);

  // Copiloto: Aplicar sugerencia interactiva
  const handleApplyCopilotAction = useCallback((action: NonNullable<CopilotMessage['suggestedAction']>) => {
    if (action.type === 'reassign_space') {
      const { targetCommission, toSpace } = action.details;
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

  // Si no ha iniciado sesión, mostrar pantalla de logueo (Req 1)
  if (isLoggedOut) {
    return (
      <LoginView
        onLogin={handleLogin}
        onViewPublicCartelera={handleViewPublicCartelera}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Universal */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        currentWeek={currentWeek}
        onWeekChange={setCurrentWeek}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
            roomFeatureRequests={roomFeatureRequests}
            onApproveFeatureRequest={handleApproveFeatureRequest}
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
            onRequestRoomFeatures={handleRequestRoomFeatures}
            inadequateReports={inadequateReports}
            changeRequests={changeRequests}
            roomFeatureRequests={roomFeatureRequests}
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
    </div>
  );
}
