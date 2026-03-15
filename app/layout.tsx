import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'ਕਾਵਿ-ਸੰਗ੍ਰਹਿ — Punjabi Poetry & Songs',
  description: 'A curated collection of Punjabi shayari, poems, and songs in Gurmukhi script.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pa" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme') || 'system';
                  if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches))
                    document.documentElement.classList.add('dark');
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t py-8 mt-12 text-center text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted-fg)' }}>
            <p className="gurmukhi text-base">ਕਾਵਿ-ਸੰਗ੍ਰਹਿ</p>
            <p className="mt-1">Punjabi Poetry & Songs Collection</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
