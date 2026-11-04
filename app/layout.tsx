import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Espacios · Universidad de la Ciudad',
  description: 'Plataforma para la asignación y gestión inteligente de aulas · Sede Perón 830 · UniCABA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

