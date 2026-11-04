-- ==============================================================================
-- PROYECTO ESPACIOS - UNIVERSIDAD DE LA CIUDAD DE BUENOS AIRES (Sede Perón 830)
-- Script de Creación de Esquema y Datos Semilla para Supabase (PostgreSQL)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE ESPACIOS (27 espacios en 6 niveles)
CREATE TABLE IF NOT EXISTS public.spaces (
    id TEXT PRIMARY KEY, -- Ej: '201', '301', '-1A', '0SCA', '2SR'
    name TEXT NOT NULL,
    floor TEXT NOT NULL, -- 'Subsuelo', 'PB', '1°', '2°', '3°', '4°'
    type TEXT NOT NULL,  -- 'Aula', 'Lab. de Ciencias', 'Sala de Reunión', 'Auditorio', 'Sala de Capacitación'
    capacity INTEGER NOT NULL,
    department TEXT NOT NULL DEFAULT 'Propios', -- 'Propios' o 'Intendencia'
    equipment TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE COMISIONES
CREATE TABLE IF NOT EXISTS public.commissions (
    id TEXT PRIMARY KEY, -- Ej: 'COM-001'
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    career TEXT NOT NULL,
    team TEXT NOT NULL DEFAULT 'Único',
    professor_name TEXT NOT NULL,
    professor_email TEXT,
    enrolled_students INTEGER NOT NULL,
    estimated_attendance INTEGER,
    day_of_week TEXT NOT NULL, -- 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    start_time TEXT NOT NULL DEFAULT '18:00',
    end_time TEXT NOT NULL DEFAULT '21:30',
    weekly_modality JSONB NOT NULL, -- Array de 16 semanas ['presencial', 'virtual', ...]
    requirements TEXT[] DEFAULT '{}',
    rejected_spaces TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE ASIGNACIONES SEMANALES
CREATE TABLE IF NOT EXISTS public.allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission_id TEXT REFERENCES public.commissions(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    date_range TEXT NOT NULL,
    day_of_week TEXT NOT NULL,
    modality TEXT NOT NULL, -- 'presencial', 'virtual', 'asincronica', 'feriado'
    effective_count INTEGER NOT NULL DEFAULT 0,
    assigned_space_ids TEXT[] DEFAULT '{}',
    status TEXT NOT NULL, -- 'asignada', 'conflicto_sin_aula', 'requiere_intendencia', 'aulas_combinadas', 'virtual', 'feriado'
    status_message TEXT,
    approved BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE REPORTES DE AULAS NO ADECUADAS (PORTAL DOCENTE)
CREATE TABLE IF NOT EXISTS public.inadequate_space_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    space_id TEXT REFERENCES public.spaces(id) ON DELETE CASCADE,
    professor_name TEXT NOT NULL,
    course_name TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'activa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DE SOLICITUDES DE CAMBIO DE MODALIDAD (PORTAL DOCENTE)
CREATE TABLE IF NOT EXISTS public.change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commission_id TEXT REFERENCES public.commissions(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    requested_modality TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'aprobada', 'rechazada'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA DE AUDITORÍA Y TRAZABILIDAD
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. POLÍTICAS DE ACCESO (RLS)
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inadequate_space_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública para la cartelera y visualización del MVP
CREATE POLICY "Lectura pública de espacios" ON public.spaces FOR SELECT USING (true);
CREATE POLICY "Lectura pública de comisiones" ON public.commissions FOR SELECT USING (true);
CREATE POLICY "Lectura pública de asignaciones" ON public.allocations FOR SELECT USING (true);
CREATE POLICY "Lectura de reportes" ON public.inadequate_space_reports FOR SELECT USING (true);
CREATE POLICY "Inserción de reportes" ON public.inadequate_space_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Lectura y creación de solicitudes" ON public.change_requests FOR ALL USING (true);

-- ==============================================================================
-- 9. CARGA SEMILLA DE LOS 27 ESPACIOS OFICIALES DE PERÓN 830
-- ==============================================================================
INSERT INTO public.spaces (id, name, floor, type, capacity, department, equipment) VALUES
  ('-1A', 'Auditorio', 'Subsuelo', 'Auditorio', 120, 'Intendencia', ARRAY['Proyector HD', 'Sonido integral', 'Micrófonos', 'Accesible']),
  ('0SCA', 'Sala de Capacitación A', 'PB', 'Sala de Capacitación', 30, 'Intendencia', ARRAY['Proyector', 'Pizarra interactiva', 'Accesible']),
  ('0SCB', 'Sala de Capacitación B', 'PB', 'Sala de Capacitación', 30, 'Intendencia', ARRAY['Proyector', 'Pizarra', 'Accesible']),
  ('1', 'Laboratorio de Ciencias', '1°', 'Lab. de Ciencias', 60, 'Propios', ARRAY['Equipamiento científico', 'Proyector', 'Mesadas de trabajo']),
  ('201', 'Aula 201', '2°', 'Aula', 42, 'Propios', ARRAY['Proyector', 'Pizarra']),
  ('202', 'Aula 202', '2°', 'Aula', 48, 'Propios', ARRAY['Proyector', 'Pizarra']),
  ('203', 'Aula 203', '2°', 'Aula', 60, 'Propios', ARRAY['Proyector', 'Pizarra']),
  ('204', 'Aula 204', '2°', 'Aula', 48, 'Propios', ARRAY['Proyector', 'Pizarra']),
  ('205', 'Aula 205', '2°', 'Aula', 60, 'Propios', ARRAY['Proyector', 'Pizarra']),
  ('206', 'Aula 206', '2°', 'Aula', 99, 'Propios', ARRAY['Proyector', 'Sonido', 'Pizarra doble']),
  ('2SR', 'Sala de Reunión 2SR', '2°', 'Sala de Reunión', 12, 'Propios', ARRAY['Pantalla TV', 'Mesa de conferencias', 'Webcam']),
  ('301', 'Aula Magna 301', '3°', 'Aula', 121, 'Propios', ARRAY['Proyector doble', 'Sonido integral', 'Micrófono']),
  ('302', 'Aula 302', '3°', 'Aula', 22, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('303', 'Aula 303', '3°', 'Aula', 28, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('304', 'Aula 304', '3°', 'Aula', 28, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('305', 'Aula 305', '3°', 'Aula', 22, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('306', 'Aula 306', '3°', 'Aula', 98, 'Propios', ARRAY['Proyector', 'Sonido', 'Pizarra doble']),
  ('307', 'Aula 307', '3°', 'Aula', 24, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('308', 'Aula 308', '3°', 'Aula', 24, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('309', 'Aula 309', '3°', 'Aula', 40, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('401', 'Aula 401', '4°', 'Aula', 42, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('402', 'Aula 402', '4°', 'Aula', 56, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('403', 'Aula 403', '4°', 'Aula', 56, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('404', 'Aula 404', '4°', 'Aula', 60, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('405', 'Aula 405', '4°', 'Aula', 50, 'Propios', ARRAY['Pizarra', 'Proyector']),
  ('406', 'Aula 406', '4°', 'Aula', 96, 'Propios', ARRAY['Proyector', 'Sonido', 'Pizarra']),
  ('4SR', 'Sala de Reunión 4SR', '4°', 'Sala de Reunión', 13, 'Propios', ARRAY['Pantalla TV', 'Mesa redonda'])
ON CONFLICT (id) DO NOTHING;
