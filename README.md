# 🏛️ Proyecto Espacios · MVP Funcional
> **Plataforma de asignación y gestión inteligente de aulas y espacios**  
> **Universidad de la Ciudad de Buenos Aires (UniCABA) · Sede Perón 830**  
> **Carrera:** Licenciatura en Tecnologías Digitales (CCC) · Transformación Digital en las Organizaciones  
> **Equipo (Grupo 12):** Araujo Mercedes · Artesi Nicolas · Demarco Alejandro · Marinelli Guillermo

---

## 🚀 Descripción del Proyecto

En la sede Perón 830, la asignación de aulas involucra **226 comisiones** y **27 espacios físicos en 6 niveles** (1.389 butacas en total), demandando entre 8 y 10 horas semanales de gestión manual en planillas de cálculo.

**"Espacios"** transforma este proceso reuniendo la información en una fuente única de verdad, implementando un **motor determinístico de reglas** que asigna *"la menor aula que alcanza sin superposiciones"*, publicando una **cartelera digital en vivo** y proporcionando un **Copiloto de IA generativa (Fase II)** que asiste en la toma de decisiones estratégicas.

---

## 🛠️ Stack Tecnológico

- **Frontend & Fullstack:** [Next.js 15 (App Router)](https://nextjs.org/) + React 19 + TypeScript.
- **Estilos & UI:** Tailwind CSS + Lucide Icons + diseño responsivo (móvil, desktop y tótem/pantalla de sede).
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (PostgreSQL) con soporte para **Modo Híbrido** (funciona al 100% en modo local/demo y se conecta a Supabase mediante variables de entorno).
- **Despliegue:** Optimizado para [Vercel](https://vercel.com/) con despliegue en 1 click y cero configuración.

---

## 🌟 Módulos Implementados en el MVP

1. **Cartelera Digital Pública en Tiempo Real (`HU8`):**
   - Vista pública sin login requerido, accesible desde celulares y tótems de la sede.
   - Búsqueda por materia, código, docente o aula.
   - Filtros por día (Lunes a Sábado), turno y carrera.
   - Reemplaza la planilla de Google Sheets y elimina las clases *"Consultar en Bedelía"*.
   - Botón **"Modo Pantalla Sede"** para pantallas de pasillo.

2. **Consola de Decisión y Asignación de Bedelía (`HU5`, `HU6`, `HU7`):**
   - Resumen semanal de ocupación de butacas, comisiones presenciales y alertas.
   - Ejecución del **Motor de Reglas determinístico** (menor aula que alcanza).
   - Detección de cuellos de botella (comisiones >121, combinación de aulas como 306+206, auditorio de Intendencia).
   - Reasignación manual con trazabilidad y auditoría.
   - Botón formal de **"Aprobar Grilla Semanal"**.

3. **Mapa de Calor & Métricas Cuatrimestrales (`Ilustración 3 del TFI`):**
   - Matriz visual interactiva de **16 semanas x 6 días**.
   - Código de colores de saturación idéntico al trabajo final.
   - Comparativa de indicadores: *Cartelera Real Noviembre vs. Simulación Base vs. Simulación con Desgranamiento (75% Asistencia)*.

4. **Catálogo de Espacios (`HU1`):**
   - Los **27 espacios reales** de la sede Perón 830 (21 aulas, 1 laboratorio de ciencias, 2 salas de reunión, auditorio -1A y 2 salas de capacitación).
   - Capacidad real, pisos (Subsuelo a 4°), tipo y equipamiento.
   - Diferenciación entre espacios propios y administrados por Intendencia.

5. **Planificación Académica & Carga de Comisiones (`HU2`, `HU3`, `HU4`):**
   - Formulario validado con opciones cerradas (código, horarios cerrados, modalidades de 16 semanas).
   - Carga directa y botón para restablecer el *Archivo Unificado Oficial del 2C 2026*.

6. **Portal Docente (`Fase 2 / Backlog`):**
   - El docente visualiza sus aulas asignadas de la semana.
   - Botón para **confirmar asistencia/aula**.
   - Solicitud de **cambio de modalidad** con 48 h de anticipación.
   - Reporte de **aula no adecuada** (el motor descarta esa aula automáticamente para ese docente).

7. **Copiloto de IA para Toma de Decisiones (`Fase II - MIT 4-Stage`):**
   - Asistente conversacional generativo con botones de consultas clave (Tabla 20 del TFI):
     - *"¿Qué problemas tengo el miércoles de la semana 16?"*
     - *"¿Qué pasa si asiste el 75%?"*
     - *"¿Por qué me proponés mover Fundamentos de Estadística, Equipo 3?"*
   - Cita de fuentes de datos verificadas sin alucinaciones.
   - Botones de acción interactiva para aplicar sugerencias directamente a la grilla.

8. **Selector de Rol en Barra Superior:**
   - Permite alternar en vivo entre:
     - 🎓 **Público / Alumnos:** Vista limpia de la cartelera digital.
     - 🏛️ **Bedelía / Asignador:** Consola integral, mapa de calor, catálogo y planificación.
     - 👨‍🏫 **Portal Docente:** Confirmaciones y solicitudes de cambio.

---

## 💻 Ejecución Local

Para probar la plataforma en tu computadora:

```bash
# 1. Instalar dependencias (ya instaladas)
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 📦 Subir a GitHub

Para subir el proyecto a tu cuenta de GitHub:

```bash
# 1. Inicializar git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Crear el commit inicial
git commit -m "feat: MVP Espacios UniCABA Grupo 12 final"

# 4. Cambiar a la rama principal
git branch -M main

# 5. Vincular con tu repositorio de GitHub (crea uno vacío en github.com previamente)
git remote add origin https://github.com/TU-USUARIO/espacios-unicaba.git

# 6. Subir los cambios
git push -u origin main
```

---

## ☁️ Despliegue en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Selecciona el repositorio **`espacios-unicaba`**.
4. Vercel detectará automáticamente **Next.js**. Haz clic en **"Deploy"**.
5. ¡Listo! En menos de 2 minutos tu MVP estará accesible públicamente desde una URL tipo `https://espacios-unicaba.vercel.app`.

---

## 🗄️ Conexión con Supabase (Opcional)

El MVP incluye un **Modo Híbrido** que funciona inmediatamente con datos precargados. Si deseas sincronizarlo con tu propia base de datos Supabase en la nube:

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Ve al **SQL Editor** de Supabase y pega el contenido del archivo [`supabase/schema.sql`](supabase/schema.sql).
3. Haz clic en **"Run"** para crear las tablas y precargar los 27 espacios.
4. En Vercel (o en tu archivo local `.env.local`), añade las siguientes variables de entorno:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```
