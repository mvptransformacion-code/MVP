import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Sub-header Proyecto con líneas magenta de la portada */}
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="h-[2px] w-4 bg-brand-magenta rounded-full" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-magenta">
          Proyecto
        </span>
        <span className="h-[2px] w-4 bg-brand-magenta rounded-full" />
      </div>

      {/* Ícono de Puerta Abierta en Perspectiva + Nombre "espacios" */}
      <div className="flex items-center gap-2.5">
        {/* Ícono inspirado en la portada (puerta abierta en perspectiva) */}
        <div className={`${iconSizes[size]} relative rounded-lg bg-gradient-to-br from-[#0094e8] to-[#006cb8] p-1.5 shadow-md flex items-center justify-center shrink-0`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-white"
          >
            {/* Marco de la puerta */}
            <path d="M4 3h16v18H4" />
            {/* Puerta abierta en perspectiva hacia adelante */}
            <path d="M4 21V3l10 3v15l-10 3z" fill="white" fillOpacity="0.25" />
            {/* Picaporte */}
            <circle cx="11.5" cy="13.5" r="1" fill="white" />
          </svg>
        </div>

        {/* Tipografía espacios en Azul Marino Profundo */}
        <span className={`font-black tracking-tight text-brand-navy ${textSizes[size]} font-sans`}>
          espacios
        </span>
      </div>

      {/* Bajada oficial de la portada */}
      {showSubtitle && (
        <span className="text-[11px] font-semibold text-brand-navy/70 tracking-tight mt-0.5">
          Una plataforma para gestionar aulas.
        </span>
      )}
    </div>
  );
}

