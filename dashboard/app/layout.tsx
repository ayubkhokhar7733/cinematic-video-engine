import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinematic Studio — Professional Video Suite',
  description: 'Enterprise Autonomous Documentary & Video Production Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
