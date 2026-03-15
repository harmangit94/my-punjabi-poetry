'use client';

import { useState } from 'react';
import EntryCarousel from './EntryCarousel';
import { CATEGORIES, type Category, type Entry } from '@/lib/supabase';

interface Props {
  allEntries: Entry[];
  initialCategory?: Category;
}

const CATEGORY_COLORS: Record<Category, string> = {
  shayar: '#7c3aed',
  short:  '#0891b2',
  poem:   '#059669',
  song:   '#d97706',
};

export default function CategoryBrowser({ allEntries, initialCategory = 'shayar' }: Props) {
  const [active, setActive] = useState<Category>(initialCategory);

  const filtered = allEntries.filter((e) => e.category === active);
  const color = CATEGORY_COLORS[active];

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map((cat) => {
          const isActive = cat.value === active;
          const count = allEntries.filter((e) => e.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: isActive ? CATEGORY_COLORS[cat.value] : 'var(--muted)',
                color: isActive ? '#fff' : 'var(--muted-fg)',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <span>{cat.label}</span>
              <span className="gurmukhi text-xs">{cat.labelPunjabi}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--muted-fg)',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active category header */}
      <div className="flex items-baseline gap-3">
        <h2 className="text-2xl font-bold">{CATEGORIES.find((c) => c.value === active)?.label}</h2>
        <span className="gurmukhi text-lg" style={{ color: 'var(--muted-fg)' }}>
          {CATEGORIES.find((c) => c.value === active)?.labelPunjabi}
        </span>
        <span className="text-sm ml-auto" style={{ color: 'var(--muted-fg)' }}>{filtered.length} entries</span>
      </div>

      {/* Carousel */}
      {filtered.length > 0 ? (
        <EntryCarousel entries={filtered} />
      ) : (
        <div className="py-20 text-center" style={{ color: 'var(--muted-fg)' }}>
          <p className="gurmukhi text-2xl mb-2">ਕੋਈ ਐਂਟਰੀ ਨਹੀਂ</p>
          <p className="text-sm">No entries in this category yet.</p>
        </div>
      )}
    </div>
  );
}
