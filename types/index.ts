export type SpaceType = 
  | 'Aula' 
  | 'Lab. de Ciencias' 
  | 'Sala de Reunión' 
  | 'Auditorio' 
  | 'Sala de Capacitación';

export type SpaceDepartment = 'Propios' | 'Intendencia';

export interface Space {
  id: string; // e.g. "201", "301", "-1A", "0SCA", "2SR"
  name: string;
  floor: 'Subsuelo' | 'PB' | '1°' | '2°' | '3°' | '4°';
  type: SpaceType;
  capacity: number; // Capacidad real
  department: SpaceDepartment;
  equipment: string[];
  isAvailable?: boolean;
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export type Modality = 'presencial' | 'virtual' | 'asincronica' | 'feriado';

export interface Commission {
  id: string; // e.g. "COM-ASIG00001-EQ1"
  courseCode: string; // e.g. "ASIG00001"
  courseName: string;
  career: string;
  team: string; // e.g. "Equipo 1", "Equipo 2", "n/c"
  professorName: string;
  enrolledStudents: number;
  estimatedAttendance?: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // e.g. "18:00"
  endTime: string; // e.g. "21:30"
  weeklyModality: Modality[]; // 16 weeks
  requirements?: string[];
  rejectedSpaces?: string[]; // IDs de aulas no adecuadas
}

export type AllocationStatus = 
  | 'asignada' 
  | 'conflicto_sin_aula' 
  | 'requiere_intendencia' 
  | 'aulas_combinadas' 
  | 'virtual' 
  | 'feriado'
  | 'asincronica';

export interface WeeklyAllocation {
  id: string;
  commissionId: string;
  courseCode: string;
  courseName: string;
  career: string;
  team: string;
  professorName: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  weekNumber: number;
  dateRange: string;
  modality: Modality;
  enrolledStudents: number;
  effectiveCount: number; // Asistencia estimada o inscriptos
  assignedSpaceIds: string[]; // e.g. ["404"] o ["306", "206"] para combinadas
  status: AllocationStatus;
  statusMessage?: string;
  approved: boolean;
  notes?: string;
}

export interface InadequateSpaceReport {
  id: string;
  spaceId: string;
  professorName: string;
  courseName: string;
  reason: string;
  date: string;
  status: 'activa' | 'resuelta';
}

export interface ChangeRequest {
  id: string;
  commissionId: string;
  courseName: string;
  professorName: string;
  weekNumber: number;
  originalModality: Modality;
  requestedModality: Modality;
  reason: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
}

export interface HeatmapCellData {
  day: DayOfWeek;
  week: number;
  dateRange: string;
  presentialCount: number;
  status: 'low' | 'medium' | 'high' | 'intendencia' | 'conflict_large' | 'conflict_no_space' | 'holiday';
  usedSpacesCount: number;
  totalEnrolled: number;
}

export type UserRole = 'bedelia' | 'docente' | 'estudiante';
