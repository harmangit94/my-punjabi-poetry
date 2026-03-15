import Link from 'next/link';
import type { Entry } from '@/lib/supabase';
import { CATEGORIES } from '@/lib/supabase';

const CATEGORY_COLORS: Record<string, string> = {
  shayar: '#7c3aed',
  short:  '#0891b2',
  poem:   '#059669',
  song:   '#d97706',
};

export default function EntryCard({ entry, delay = 0 }: { entry: Entry; delay?: number }) {
  const cat = CATEGORIES.find((c) => c.value === entry.category);
  const color = CATEGORY_COLORS[entry.category] ?? '#7c3aed';

  // Preview: first 3 lines of content
  const preview = entry.content.split('\n').filter(Boolean).slice(0, 3).join('\n');

  return (
    <div
      className="fade-up rounded-2xl p-5 border transition-shadow hover:shadow-lg cursor-pointer flex flex-col gap-3"
      style={{
        animationDelay: `${delay}ms`,
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Category badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: color + '18', color }}
        >
          {cat?.label ?? entry.category}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted-fg)' }}>
          {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Title */}
      <h3 className="gurmukhi font-semibold text-lg leading-snug">{entry.title}</h3>

      {/* Preview */}
      <p className="gurmukhi text-sm whitespace-pre-line line-clamp-4" style={{ color: 'var(--muted-fg)' }}>
        {preview}
      </p>

      {/* Author */}
      <div className="mt-auto flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {entry.author.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--muted-fg)' }}>{entry.author}</span>
      </div>
    </div>
  );
}
