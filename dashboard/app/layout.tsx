import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinematic Studio — Cloud Video Generator',
  description: 'Automated code-driven documentary & video engine powered by GitHub Actions',
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
