import { FictionalUser } from '@/types';

export const FICTIONAL_USERS: FictionalUser[] = [
  {
    id: 'user-bedelia',
    name: 'Lic. Valeria Rossi',
    email: 'bedelia@unicaba.edu.ar',
    role: 'bedelia',
    roleLabel: 'Coordinación Académica & Bedelía',
    title: 'Responsable de Gestión de Espacios y Aulas',
    avatarColor: 'from-brand-blue to-brand-navy'
  },
  {
    id: 'user-docente-1',
    name: 'Dr. Alejandro Demarco',
    email: 'ademarco@unicaba.edu.ar',
    role: 'docente',
    roleLabel: 'Portal Docente',
    title: 'Profesor Titular · Estadística y Probabilidad',
    avatarColor: 'from-brand-navy to-brand-magenta'
  },
  {
    id: 'user-docente-2',
    name: 'Dra. María Elena Gómez',
    email: 'mgomez@unicaba.edu.ar',
    role: 'docente',
    roleLabel: 'Portal Docente',
    title: 'Profesora Adjunta · Instituciones Educativas',
    avatarColor: 'from-brand-blue to-brand-cyan'
  },
  {
    id: 'user-estudiante',
    name: 'Franco Benítez',
    email: 'fbenitez@estudiantes.unicaba.edu.ar',
    role: 'estudiante',
    roleLabel: 'Estudiante / Público',
    title: 'Estudiante · Consultas y Cartelera Digital',
    avatarColor: 'from-brand-cyan to-emerald-600'
  }
];

