import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VedaAI – AI Assessment Creator',
  description: 'Create intelligent, AI-powered question papers and assessments in seconds. The modern platform for educators.',
  keywords: ['AI', 'assessment', 'education', 'question paper', 'teacher', 'EdTech'],
  authors: [{ name: 'VedaAI' }],
  openGraph: {
    title: 'VedaAI – AI Assessment Creator',
    description: 'Create intelligent, AI-powered question papers and assessments in seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '12px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
