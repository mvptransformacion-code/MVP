import { Commission } from '@/types';
import { runAllocationForWeek } from '@/lib/engine/ruleEngine';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  timestamp: string;
  sourceCitations?: string[];
  suggestedAction?: {
    type: 'reassign_space' | 'apply_simulation_75' | 'request_intendencia';
    label: string;
    details: any;
  };
}

export const COPILOT_SUGGESTED_PROMPTS = [
  '¿Qué problemas tengo el miércoles de la semana 16?',
  '¿Qué pasa si asiste el 75%?',
  '¿Por qué me proponés mover Fundamentos de Estadística, Equipo 3?',
  '¿Cuál es la tasa de ocupación esperada para la semana 15?',
  '¿Qué comisiones requieren autorización de Intendencia?'
];

export function queryCopilot(
  question: string,
  currentWeek: number,
  commissions: Commission[]
): CopilotMessage {
  const q = question.toLowerCase();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const id = `msg-${Date.now()}`;

  // Caso 1: Miércoles semana 16
  if (q.includes('miércoles') && (q.includes('16') || q.includes('problema') || q.includes('conflicto'))) {
    return {
      id,
      sender: 'copilot',
      timestamp: now,
      text: 'En la simulación con inscriptos para el **Miércoles de la Semana 16 (23 al 28/11)**, dos comisiones quedan sin aula compatible: **Fundamentos de Estadística y Probabilidad, Equipo 2** (85 inscriptos) y **Planeamiento Estratégico Institucional** (67 inscriptos). Ocurre porque las aulas de más de 60 lugares ya están asignadas a grupos mayores. Además, una comisión requiere el auditorio (-1A), administrado por Intendencia.',
      sourceCitations: [
        'Motor de reglas determinístico (Fase 1)',
        'Archivo unificado: Miércoles S16',
        'Catálogo de espacios Sede Perón 830'
      ],
      suggestedAction: {
        type: 'reassign_space',
        label: 'Optimizar por Asistencia Estimada (Mover Eq 3 a Aula 404)',
        details: { targetCommission: 'COM-012', fromSpace: '301', toSpace: '404' }
      }
    };
  }

  // Caso 2: Escenario Asistencia 75%
  if (q.includes('75%') || q.includes('75 por ciento') || q.includes('desgranamiento') || q.includes('asistencia estimada')) {
    return {
      id,
      sender: 'copilot',
      timestamp: now,
      text: 'En la simulación del cuatrimestre con una hipótesis de desgranamiento al **75% de asistencia**, los casos de comisiones sin aula compatible caen drásticamente de **77 a 35** en toda la sede. Si se mantuvieran las aulas originales con inscriptos nominales, la ocupación real caería del 67% al 50%. Reasignando con el motor a aulas acordes al grupo real asistencial, la ocupación promedio se optimiza al **59%**, evitando horas ociosas en aulas grandes.',
      sourceCitations: [
        'Simulación de desgranamiento estadístico (TFI Tabla 24)',
        'Métricas de asignación real vs. simulada'
      ],
      suggestedAction: {
        type: 'apply_simulation_75',
        label: 'Activar filtro de desgranamiento al 75% en el Tablero',
        details: { percent: 75 }
      }
    };
  }

  // Caso 3: Fundamentos de Estadística Equipo 3
  if (q.includes('equipo 3') || (q.includes('estadística') && q.includes('mover'))) {
    return {
      id,
      sender: 'copilot',
      timestamp: now,
      text: 'En este escenario de análisis, el **Equipo 3 de Fundamentos de Estadística** cuenta con 86 inscriptos nominales y fue asignado inicialmente por el motor al **Aula 301** (Aula Magna, 121 lugares). Con una asistencia estimada observada de **52 personas**, entra perfectamente en el **Aula 404** (capacidad 60 lugares), que se encuentra libre ese miércoles. Al moverlo, se libera inmediatamente el Aula 301 para el **Equipo 2**, resolviendo el cuello de botella sin tener que enviar a nadie a Bedelía.',
      sourceCitations: [
        'Registro de Asistencia del Campus Virtual',
        'Capacidad Aula 404 (4° piso, 60 butacas)',
        'Capacidad Aula 301 (3° piso, 121 butacas)'
      ],
      suggestedAction: {
        type: 'reassign_space',
        label: 'Confirmar reasignación: Eq 3 -> Aula 404 (Libera Aula 301)',
        details: { targetCommission: 'COM-012', spaceId: '404' }
      }
    };
  }

  // Caso 4: Intendencia
  if (q.includes('intendencia') || q.includes('auditorio') || q.includes('capacitación')) {
    return {
      id,
      sender: 'copilot',
      timestamp: now,
      text: 'Los 3 espacios administrados por **Intendencia** son el **Auditorio (-1A, Subsuelo, 120 lugares)** y las **Salas de Capacitación 0SCA y 0SCB (PB, 30 lugares c/u)**. Actualmente, comisiones masivas como *Cálculo y Análisis Matemático* (280 inscriptos) requieren solicitud a Intendencia o combinación de aulas (ej. 306 con 206). Se recomienda enviar el pedido con al menos 1 semana de anticipación mediante la agenda compartida.',
      sourceCitations: [
        'Protocolo de Coordinación con Intendencia',
        'Planilla de espacios dependientes PB y Subsuelo'
      ]
    };
  }

  // Caso 5: Ocupación general
  if (q.includes('ocupación') || q.includes('porcentaje') || q.includes('kpi') || q.includes('métrica')) {
    const summary = runAllocationForWeek(commissions, currentWeek);
    return {
      id,
      sender: 'copilot',
      timestamp: now,
      text: `Para la **Semana ${currentWeek} (${summary.dateRange})**, la tasa de ocupación calculada es del **${summary.occupancyRate}%**. Se registran **${summary.totalPresential} comisiones presenciales**, de las cuales **${summary.totalAssigned} tienen aula asignada**, **${summary.totalConflicts} alertas de conflicto** y **${summary.totalIntendencia} solicitudes de Intendencia**.`,
      sourceCitations: [
        `Cálculo en tiempo real: personas / capacidad total asignada * 100`,
        `Semana activa: S${currentWeek}`
      ]
    };
  }

  // Respuesta general contextual
  return {
    id,
    sender: 'copilot',
    timestamp: now,
    text: `He procesado tu consulta sobre la gestión de aulas en la Sede Perón 830: "${question}". De acuerdo con el catálogo de 27 espacios y las 226 comisiones relevadas, el motor de reglas determinístico prioriza asignar la menor aula compatible sin superposiciones horarias. Si necesitas analizar una franja particular (ej. lunes o miércoles) o simular desgranamiento por asistencia, házmelo saber.`,
    sourceCitations: [
      'Motor de reglas Espacios UniCABA',
      'Catálogo de 27 espacios (Sede Perón 830)'
    ]
  };
}
