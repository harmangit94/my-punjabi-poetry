'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, List, X } from 'lucide-react';
import type { Entry } from '@/lib/supabase';

const CATEGORY_COLORS: Record<string, string> = {
  shayar: '#7c3aed',
  short:  '#0891b2',
  poem:   '#059669',
  song:   '#d97706',
};

export default function EntryViewer({ entries }: { entries: Entry[] }) {
  const [index, setIndex]       = useState(0);
  const [showAll, setShowAll]   = useState(false);

  if (!entries.length) {
    return (
      <div className="py-24 text-center" style={{ color: 'var(--muted-fg)' }}>
        <p className="gurmukhi text-2xl mb-2">ਕੋਈ ਐਂਟਰੀ ਨਹੀਂ</p>
        <p className="text-sm">No entries in this category yet.</p>
      </div>
    );
  }

  const entry  = entries[index];
  const color  = CATEGORY_COLORS[entry.category] ?? '#7c3aed';
  const total  = entries.length;
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  return (
    <div className="relative">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium" style={{ color: 'var(--muted-fg)' }}>
          {index + 1} of {total}
        </span>
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-fg)' }}
        >
          <List className="w-4 h-4" /> All Entries
        </button>
      </div>

      {/* Entry display */}
      <div
        className="rounded-3xl p-8 md:p-14 min-h-[420px] flex flex-col justify-between fade-up"
        key={entry.id}
        style={{ backgroundColor: 'var(--card)', border: `1px solid var(--border)` }}
      >
        <div>
          {/* Category pill */}
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: color + '18', color }}
          >
            {entry.category}
          </span>

          {/* Title */}
          <h2 className="gurmukhi text-3xl md:text-4xl font-bold mb-8 leading-snug">{entry.title}</h2>

          {/* Content */}
          <div className="gurmukhi-lg text-lg md:text-xl whitespace-pre-line" style={{ color: 'var(--foreground)', lineHeight: 2 }}>
            {entry.content}
          </div>
        </div>

        {/* Author + date */}
        <div className="flex items-center gap-3 mt-10 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {entry.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold">{entry.author}</p>
            <p className="text-xs" style={{ color: 'var(--muted-fg)' }}>
              {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <button
          onClick={() => { setIndex(index - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={!hasPrev}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-30 hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {/* Dot indicators (up to 10) */}
        {total <= 20 && (
          <div className="flex items-center gap-1.5">
            {entries.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === index ? 20 : 8,
                  height: 8,
                  backgroundColor: i === index ? color : 'var(--border)',
                }}
              />
            ))}
          </div>
        )}
        {total > 20 && (
          <span className="text-sm font-medium" style={{ color: 'var(--muted-fg)' }}>
            {index + 1} / {total}
          </span>
        )}

        <button
          onClick={() => { setIndex(index + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={!hasNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all disabled:opacity-30 hover:opacity-70"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* All entries drawer */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAll(false)}>
          <div
            className="w-full max-w-sm h-full overflow-y-auto shadow-2xl flex flex-col"
            style={{ backgroundColor: 'var(--card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
              <p className="font-semibold">All Entries ({total})</p>
              <button onClick={() => setShowAll(false)} className="p-1.5 rounded-lg hover:opacity-70" style={{ color: 'var(--muted-fg)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Entry list */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {entries.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => { setIndex(i); setShowAll(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full text-left px-5 py-4 transition-colors hover:opacity-70 flex items-start gap-3"
                  style={{ backgroundColor: i === index ? color + '12' : 'transparent' }}
                >
                  <span
                    className="text-xs font-bold shrink-0 mt-0.5 w-6 text-right"
                    style={{ color: i === index ? color : 'var(--muted-fg)' }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="gurmukhi text-sm font-semibold truncate" style={{ color: i === index ? color : 'var(--foreground)' }}>
                      {e.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-fg)' }}>{e.author}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
