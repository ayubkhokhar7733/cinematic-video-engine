import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinematic Studio — Cloud Video Suite',
  description: 'Next-Gen Autonomous Documentary & Video Production Suite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-studio-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
