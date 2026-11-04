# 🏛️ Proyecto Espacios · MVP Funcional
> **Plataforma de asignación y gestión inteligente de aulas y espacios**  
> **Universidad de la Ciudad de Buenos Aires (UniCABA) · Sede Perón 830**

---

## 🚀 Descripción del Proyecto

En la sede Perón 830, la asignación de aulas involucra **226 comisiones** y **27 espacios físicos en 6 niveles** (1.389 butacas en total), demandando entre 8 y 10 horas semanales de gestión manual en planillas de cálculo.

**"Espacios"** transforma este proceso reuniendo la información en una fuente única de verdad, implementando un **motor determinístico de reglas** que asigna *"la menor aula que alcanza sin superposiciones"*, publicando una **cartelera digital en vivo** y proporcionando un **Copiloto de IA generativa (Fase II)** que asiste en la toma de decisiones estratégicas.

---

## 🛠️ Stack Tecnológico

- **Frontend & Fullstack:** [Next.js 15 (App Router)](https://nextjs.org/) + React 19 + TypeScript.
- **Estilos & UI:** Tailwind CSS + Lucide Icons + diseño responsivo (móvil, desktop y pantalla de pasillo).
- **Despliegue:** Optimizado para [Vercel](https://vercel.com/) con despliegue en 1 click y cero configuración.

---

## 🌟 Módulos Implementados en el MVP

1. **Pantalla de Inicio de Sesión Institucional:**
   - Acceso con perfiles de demostración rápidos (Bedelía, Docentes, Estudiantes).
   - Acceso directo a la Cartelera Pública sin necesidad de iniciar sesión.

2. **Cartelera Digital Pública en Tiempo Real:**
   - Vista pública sin login requerido, accesible desde celulares y tótems de la sede.
   - Búsqueda por materia, código, docente o aula.
   - Filtros por día (Lunes a Sábado), turno y carrera.
   - Botón **"Modo Pantalla Sede"** para proyectar en pantallas de pasillos.

3. **Consola de Decisión y Asignación de Bedelía:**
   - Resumen semanal de ocupación de butacas, comisiones presenciales y alertas.
   - Ejecución del **Motor de Reglas determinístico** (*menor aula que alcanza*).
   - Detección y resolución de cuellos de botella.
   - Aprobación y asignación de aulas solicitadas por docentes con características especiales.
   - Botón formal de **"Aprobar Grilla Semanal"**.

4. **Portal Docente y Solicitudes Especiales:**
   - Visualización de aulas y horarios asignados.
   - **Solicitud de aulas con características específicas:** Wi-Fi de alta densidad, pizarrón/pizarra doble, proyector HD, capacidad mínima, accesibilidad, etc.
   - Confirmación de aula y solicitud de cambio de modalidad.
   - Reporte de aula no adecuada (el motor descarta esa aula automáticamente).

5. **Mapa de Calor & Métricas Cuatrimestrales:**
   - Matriz visual interactiva de **16 semanas x 6 días**.
   - Código de colores de saturación y cuellos de botella.
   - Comparativa de indicadores de ocupación y optimización.

6. **Catálogo de Espacios:**
   - Los **27 espacios reales** de la sede Perón 830 (21 aulas, 1 laboratorio de ciencias, 2 salas de reunión, auditorio -1A y 2 salas de capacitación).
   - Capacidad real, pisos (Subsuelo a 4°), tipo y equipamiento.

7. **Planificación Académica & Carga de Comisiones:**
   - Formulario validado con opciones cerradas.
   - Carga directa y botón para restablecer el conjunto oficial de comisiones.

8. **Copiloto de IA para Toma de Decisiones:**
   - Asistente conversacional generativo con botones de consultas estratégicas.
   - Cita de fuentes de datos verificadas sin alucinaciones.
   - Botones de acción interactiva para aplicar sugerencias directamente a la grilla.

---

## 💻 Ejecución Local

Para probar la plataforma en tu computadora:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000)

---

## 📦 Subir a GitHub

Para subir el proyecto a tu repositorio de GitHub:

```bash
# 1. Agregar todos los cambios
git add .

# 2. Crear commit
git commit -m "feat: Pantalla de login, colores de portada y solicitud de aulas especiales"

# 3. Vincular con tu repositorio de GitHub (si aún no lo hiciste)
git remote add origin https://github.com/TU-USUARIO/espacios-unicaba.git

# 4. Subir a la rama principal
git push -u origin main
```

---

## ☁️ Despliegue en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** → **"Project"**.
3. Selecciona el repositorio **`espacios-unicaba`**.
4. Haz clic en **"Deploy"**.
5. En menos de 2 minutos tu plataforma estará en línea.
