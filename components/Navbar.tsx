'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, BookOpen, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: '/', label: 'Home', labelPa: 'ਮੁੱਖ' },
    ...CATEGORIES.map((c) => ({ href: `/${c.value}`, label: c.label, labelPa: c.labelPunjabi })),
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <BookOpen className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span className="text-base font-bold hidden sm:block" style={{ color: 'var(--primary)' }}>
            Ray of Hope
          </span>
          <span className="text-sm font-bold sm:hidden" style={{ color: 'var(--primary)' }}>Ray of Hope</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--muted-fg)',
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--muted-fg)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--muted-fg)' }}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'var(--accent)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--foreground)',
                }}
              >
                <span>{l.label}</span>
                <span className="gurmukhi text-xs" style={{ color: 'var(--muted-fg)' }}>{l.labelPa}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
