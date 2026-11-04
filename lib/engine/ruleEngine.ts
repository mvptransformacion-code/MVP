import { Commission, Space, WeeklyAllocation, AllocationStatus, HeatmapCellData, DayOfWeek } from '@/types';
import { SPACES } from '@/lib/data/spaces';
import { WEEKS_DATA } from '@/lib/data/mockData';

export interface RuleEngineOptions {
  useAttendanceEstimates?: boolean; // false = inscriptos, true = asistencia estimada
  allowIntendenciaFallback?: boolean;
  attendanceReductionPercent?: number; // e.g. 75 para simular 75%
}

export interface WeekAllocationSummary {
  weekNumber: number;
  dateRange: string;
  totalPresential: number;
  totalAssigned: number;
  totalConflicts: number;
  totalIntendencia: number;
  occupancyRate: number; // porcentaje promedio de ocupación
  allocations: WeeklyAllocation[];
}

/**
 * Motor Determinístico de Asignación por Reglas - "Espacios"
 * Sigue la regla central del TFI: "Menor aula que alcanza, sin superposiciones y con trazabilidad".
 */
export function runAllocationForWeek(
  commissions: Commission[],
  weekNumber: number,
  options: RuleEngineOptions = {}
): WeekAllocationSummary {
  const weekInfo = WEEKS_DATA.find(w => w.weekNumber === weekNumber) || {
    weekNumber,
    label: `S${weekNumber}`,
    dateRange: 'Semana ' + weekNumber
  };

  const weekIndex = weekNumber - 1;
  const allocations: WeeklyAllocation[] = [];
  
  // Agrupar comisiones por día
  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  let totalCapacityAssignedSum = 0;
  let totalPeopleSum = 0;
  let totalPresential = 0;
  let totalConflicts = 0;
  let totalIntendencia = 0;

  for (const day of days) {
    // Filtrar comisiones de ese día
    const dayCommissions = commissions.filter(c => c.dayOfWeek === day);

    // Separar comisiones virtuales / feriados / asincrónicas de las presenciales
    const presentialList: { commission: Commission; effectiveCount: number }[] = [];

    for (const comm of dayCommissions) {
      const modality = comm.weeklyModality[weekIndex] || 'presencial';
      
      if (modality !== 'presencial') {
        allocations.push({
          id: `alloc-${comm.id}-w${weekNumber}`,
          commissionId: comm.id,
          courseCode: comm.courseCode,
          courseName: comm.courseName,
          career: comm.career,
          team: comm.team,
          professorName: comm.professorName,
          dayOfWeek: comm.dayOfWeek,
          startTime: comm.startTime,
          endTime: comm.endTime,
          weekNumber,
          dateRange: weekInfo.dateRange,
          modality,
          enrolledStudents: comm.enrolledStudents,
          effectiveCount: 0,
          assignedSpaceIds: [],
          status: modality === 'feriado' ? 'feriado' : (modality === 'asincronica' ? 'asincronica' : 'virtual'),
          statusMessage: modality === 'feriado' ? 'Feriado nacional / institucional' : (modality === 'virtual' ? 'Clase Virtual' : 'Actividad Asincrónica'),
          approved: true
        });
      } else {
        totalPresential++;
        // Determinar grupo efectivo
        let count = comm.enrolledStudents;
        if (options.useAttendanceEstimates && comm.estimatedAttendance) {
          count = comm.estimatedAttendance;
        } else if (options.attendanceReductionPercent) {
          count = Math.round(comm.enrolledStudents * (options.attendanceReductionPercent / 100));
        }

        presentialList.push({ commission: comm, effectiveCount: count });
      }
    }

    // Ordenar presenciales de mayor a menor tamaño (Heurística Best-Fit Decreasing)
    presentialList.sort((a, b) => b.effectiveCount - a.effectiveCount);

    // Registro de espacios ocupados en este día
    const occupiedSpacesInDay = new Set<string>();

    for (const item of presentialList) {
      const comm = item.commission;
      const count = item.effectiveCount;
      const rejected = new Set(comm.rejectedSpaces || []);

      // Filtrar espacios propios disponibles que no hayan sido marcados como inadecuados
      const ownAvailable = SPACES.filter(s => 
        s.department === 'Propios' && 
        !occupiedSpacesInDay.has(s.id) &&
        !rejected.has(s.id)
      );

      // Si requiere laboratorio específicamente
      const requiresLab = comm.requirements?.some(r => r.toLowerCase().includes('laboratorio'));
      
      let assignedSpaces: Space[] = [];
      let status: AllocationStatus = 'asignada';
      let message = '';

      if (requiresLab) {
        const lab = ownAvailable.find(s => s.type === 'Lab. de Ciencias');
        if (lab && lab.capacity >= count) {
          assignedSpaces = [lab];
          occupiedSpacesInDay.add(lab.id);
          message = `Asignado a ${lab.name} por requerimiento de laboratorio`;
        }
      }

      // Si aún no está asignado
      if (assignedSpaces.length === 0) {
        // Buscar menor aula propia que alcanza: capacidad >= count, ordenada de menor a mayor capacidad
        const candidateOwn = ownAvailable
          .filter(s => s.capacity >= count && (requiresLab ? s.type === 'Lab. de Ciencias' : true))
          .sort((a, b) => a.capacity - b.capacity);

        if (candidateOwn.length > 0) {
          const selected = candidateOwn[0]; // Menor aula que alcanza
          assignedSpaces = [selected];
          occupiedSpacesInDay.add(selected.id);
          message = `Asignado a ${selected.name} (${selected.capacity} lugares para ${count} personas)`;
          
          if (count <= 12 && selected.capacity >= 40) {
            message += ' [Alerta: grupo reducido en aula sobredimensionada por falta de aulas pequeñas]';
          }
        } else {
          // No entra en un aula propia individual.
          // ¿Es mayor a 121 (o capacidad de aula más grande) o se agotaron las aulas grandes?
          if (count > 121 || ownAvailable.length === 0) {
            // Evaluar Auditorio de Intendencia o Aulas Combinadas
            if (options.allowIntendenciaFallback !== false) {
              const auditorio = SPACES.find(s => s.id === '-1A' && !occupiedSpacesInDay.has(s.id));
              if (auditorio && count <= auditorio.capacity + 30) {
                assignedSpaces = [auditorio];
                occupiedSpacesInDay.add(auditorio.id);
                status = 'requiere_intendencia';
                totalIntendencia++;
                message = `Requiere Auditorio (-1A, Intendencia) por superar capacidad de aulas estándar (${count} personas)`;
              }
            }

            // Si aún no se asignó y count > 121, buscar combinación de 2 aulas
            if (assignedSpaces.length === 0) {
              const largeAulas = ownAvailable
                .filter(s => s.capacity >= 50)
                .sort((a, b) => b.capacity - a.capacity);

              if (largeAulas.length >= 2 && (largeAulas[0].capacity + largeAulas[1].capacity) >= count) {
                assignedSpaces = [largeAulas[0], largeAulas[1]];
                occupiedSpacesInDay.add(largeAulas[0].id);
                occupiedSpacesInDay.add(largeAulas[1].id);
                status = 'aulas_combinadas';
                message = `Aulas combinadas sugeridas: ${largeAulas[0].name} + ${largeAulas[1].name} (Cap. total ${largeAulas[0].capacity + largeAulas[1].capacity} para ${count} personas)`;
              }
            }
          }

          // Si sigue sin aula asignada
          if (assignedSpaces.length === 0) {
            status = 'conflicto_sin_aula';
            totalConflicts++;
            message = `Conflicto: No hay aulas compatibles disponibles para ${count} personas en esta franja. Consultar en Bedelía.`;
          }
        }
      }

      // Cálculo de métricas
      const assignedCap = assignedSpaces.reduce((sum, s) => sum + s.capacity, 0);
      if (assignedCap > 0) {
        totalCapacityAssignedSum += assignedCap;
        totalPeopleSum += count;
      }

      allocations.push({
        id: `alloc-${comm.id}-w${weekNumber}`,
        commissionId: comm.id,
        courseCode: comm.courseCode,
        courseName: comm.courseName,
        career: comm.career,
        team: comm.team,
        professorName: comm.professorName,
        dayOfWeek: comm.dayOfWeek,
        startTime: comm.startTime,
        endTime: comm.endTime,
        weekNumber,
        dateRange: weekInfo.dateRange,
        modality: 'presencial',
        enrolledStudents: comm.enrolledStudents,
        effectiveCount: count,
        assignedSpaceIds: assignedSpaces.map(s => s.id),
        status,
        statusMessage: message,
        approved: status === 'asignada' || status === 'aulas_combinadas'
      });
    }
  }

  const occupancyRate = totalCapacityAssignedSum > 0 
    ? Math.round((totalPeopleSum / totalCapacityAssignedSum) * 100) 
    : 0;

  return {
    weekNumber,
    dateRange: weekInfo.dateRange,
    totalPresential,
    totalAssigned: totalPresential - totalConflicts,
    totalConflicts,
    totalIntendencia,
    occupancyRate,
    allocations
  };
}

/**
 * Genera la matriz completa del Mapa de Calor (6 días x 16 semanas)
 * Reproduce visualmente la Ilustración 3 del trabajo de grado
 */
export function generateHeatmapMatrix(
  commissions: Commission[],
  options: RuleEngineOptions = {}
): HeatmapCellData[] {
  const cells: HeatmapCellData[] = [];
  const days: DayOfWeek[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  for (let w = 1; w <= 16; w++) {
    const weekAlloc = runAllocationForWeek(commissions, w, options);
    const weekInfo = WEEKS_DATA.find(wd => wd.weekNumber === w)!;

    for (const day of days) {
      const dayAllocs = weekAlloc.allocations.filter(a => a.dayOfWeek === day);
      const presentials = dayAllocs.filter(a => a.modality === 'presencial');
      const presentialCount = presentials.length;
      const conflicts = presentials.filter(a => a.status === 'conflicto_sin_aula').length;
      const intendencia = presentials.filter(a => a.status === 'requiere_intendencia').length;
      const combinedOrLarge = presentials.filter(a => a.effectiveCount > 121 || a.status === 'aulas_combinadas').length;
      const usedSpaces = new Set(presentials.flatMap(a => a.assignedSpaceIds)).size;
      const totalEnrolled = presentials.reduce((acc, p) => acc + p.enrolledStudents, 0);

      let status: HeatmapCellData['status'] = 'low';

      if (presentialCount === 0) {
        status = 'holiday';
      } else if (combinedOrLarge > 0) {
        status = 'conflict_large'; // Purple en Ilustración 3: comisiones > 121
      } else if (conflicts > 0) {
        status = 'conflict_no_space'; // Red: comisiones que cabrían en aula propia quedan sin disponibilidad
      } else if (intendencia > 0) {
        status = 'intendencia'; // Orange: Requiere intendencia
      } else if (usedSpaces >= 20) {
        status = 'high'; // Casi lleno
      } else if (usedSpaces >= 12) {
        status = 'medium';
      } else {
        status = 'low';
      }

      cells.push({
        day,
        week: w,
        dateRange: weekInfo.dateRange,
        presentialCount,
        status,
        usedSpacesCount: usedSpaces,
        totalEnrolled
      });
    }
  }

  return cells;
}

