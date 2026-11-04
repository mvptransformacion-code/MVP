import { Space } from '@/types';

/**
 * Catálogo Oficial de Espacios - Universidad de la Ciudad de Buenos Aires (Sede Perón 830)
 * Relevamiento: 27 espacios en seis niveles (1.389 butacas en total)
 * 24 espacios propios (21 aulas, 1 laboratorio de ciencias, 2 salas de reunión)
 * 3 espacios administrados por Intendencia (Auditorio y 2 salas de capacitación)
 */
export const SPACES: Space[] = [
  // Subsuelo (Intendencia)
  {
    id: '-1A',
    name: 'Auditorio',
    floor: 'Subsuelo',
    type: 'Auditorio',
    capacity: 120,
    department: 'Intendencia',
    equipment: ['Proyector HD', 'Sonido integral', 'Micrófonos', 'Accesible'],
    isAvailable: true
  },
  // Planta Baja (Intendencia)
  {
    id: '0SCA',
    name: 'Sala de Capacitación A',
    floor: 'PB',
    type: 'Sala de Capacitación',
    capacity: 30,
    department: 'Intendencia',
    equipment: ['Proyector', 'Pizarra interactiva', 'Accesible'],
    isAvailable: true
  },
  {
    id: '0SCB',
    name: 'Sala de Capacitación B',
    floor: 'PB',
    type: 'Sala de Capacitación',
    capacity: 30,
    department: 'Intendencia',
    equipment: ['Proyector', 'Pizarra', 'Accesible'],
    isAvailable: true
  },
  // 1° Piso (Propios)
  {
    id: '1',
    name: 'Laboratorio de Ciencias',
    floor: '1°',
    type: 'Lab. de Ciencias',
    capacity: 60,
    department: 'Propios',
    equipment: ['Equipamiento científico', 'Proyector', 'Mesadas de trabajo'],
    isAvailable: true
  },
  // 2° Piso (Propios)
  {
    id: '201',
    name: 'Aula 201',
    floor: '2°',
    type: 'Aula',
    capacity: 42,
    department: 'Propios',
    equipment: ['Proyector', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '202',
    name: 'Aula 202',
    floor: '2°',
    type: 'Aula',
    capacity: 48,
    department: 'Propios',
    equipment: ['Proyector', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '203',
    name: 'Aula 203',
    floor: '2°',
    type: 'Aula',
    capacity: 60,
    department: 'Propios',
    equipment: ['Proyector', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '204',
    name: 'Aula 204',
    floor: '2°',
    type: 'Aula',
    capacity: 48,
    department: 'Propios',
    equipment: ['Proyector', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '205',
    name: 'Aula 205',
    floor: '2°',
    type: 'Aula',
    capacity: 60,
    department: 'Propios',
    equipment: ['Proyector', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '206',
    name: 'Aula 206',
    floor: '2°',
    type: 'Aula',
    capacity: 99,
    department: 'Propios',
    equipment: ['Proyector', 'Sonido', 'Pizarra doble'],
    isAvailable: true
  },
  {
    id: '2SR',
    name: 'Sala de Reunión 2SR',
    floor: '2°',
    type: 'Sala de Reunión',
    capacity: 12,
    department: 'Propios',
    equipment: ['Pantalla TV', 'Mesa de conferencias', 'Webcam'],
    isAvailable: true
  },
  // 3° Piso (Propios)
  {
    id: '301',
    name: 'Aula Magna 301',
    floor: '3°',
    type: 'Aula',
    capacity: 121,
    department: 'Propios',
    equipment: ['Proyector doble', 'Sonido integral', 'Micrófono corbatero'],
    isAvailable: true
  },
  {
    id: '302',
    name: 'Aula 302',
    floor: '3°',
    type: 'Aula',
    capacity: 22,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '303',
    name: 'Aula 303',
    floor: '3°',
    type: 'Aula',
    capacity: 28,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '304',
    name: 'Aula 304',
    floor: '3°',
    type: 'Aula',
    capacity: 28,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '305',
    name: 'Aula 305',
    floor: '3°',
    type: 'Aula',
    capacity: 22,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '306',
    name: 'Aula 306',
    floor: '3°',
    type: 'Aula',
    capacity: 98,
    department: 'Propios',
    equipment: ['Proyector', 'Sonido', 'Pizarra doble'],
    isAvailable: true
  },
  {
    id: '307',
    name: 'Aula 307',
    floor: '3°',
    type: 'Aula',
    capacity: 24,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '308',
    name: 'Aula 308',
    floor: '3°',
    type: 'Aula',
    capacity: 24,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '309',
    name: 'Aula 309',
    floor: '3°',
    type: 'Aula',
    capacity: 40,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  // 4° Piso (Propios)
  {
    id: '401',
    name: 'Aula 401',
    floor: '4°',
    type: 'Aula',
    capacity: 42,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '402',
    name: 'Aula 402',
    floor: '4°',
    type: 'Aula',
    capacity: 56,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '403',
    name: 'Aula 403',
    floor: '4°',
    type: 'Aula',
    capacity: 56,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '404',
    name: 'Aula 404',
    floor: '4°',
    type: 'Aula',
    capacity: 60,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '405',
    name: 'Aula 405',
    floor: '4°',
    type: 'Aula',
    capacity: 50,
    department: 'Propios',
    equipment: ['Pizarra', 'Proyector'],
    isAvailable: true
  },
  {
    id: '406',
    name: 'Aula 406',
    floor: '4°',
    type: 'Aula',
    capacity: 96,
    department: 'Propios',
    equipment: ['Proyector', 'Sonido', 'Pizarra'],
    isAvailable: true
  },
  {
    id: '4SR',
    name: 'Sala de Reunión 4SR',
    floor: '4°',
    type: 'Sala de Reunión',
    capacity: 13,
    department: 'Propios',
    equipment: ['Pantalla TV', 'Mesa redonda'],
    isAvailable: true
  }
];

export const TOTAL_OWN_CAPACITY = SPACES.filter(s => s.department === 'Propios').reduce((acc, s) => acc + s.capacity, 0);
export const TOTAL_BUILDING_CAPACITY = SPACES.reduce((acc, s) => acc + s.capacity, 0);
