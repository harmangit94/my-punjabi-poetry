import { sql } from '@/lib/db';
import { CATEGORIES, type Entry } from '@/lib/supabase';
import { getSpotlightEntry } from '@/lib/spotlight';
import SpotlightCard from '@/components/SpotlightCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const CATEGORY_COLORS: Record<string, string> = {
  shayar: '#7c3aed',
  short:  '#0891b2',
  poem:   '#059669',
  song:   '#d97706',
};

export default async function HomePage() {
  const entries = (await sql`SELECT * FROM entries ORDER BY created_at DESC`) as Entry[];
  const spotlight = getSpotlightEntry(entries);

  const counts = CATEGORIES.map((cat) => ({
    ...cat,
    count: entries.filter((e) => e.category === cat.value).length,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ray of Hope</h1>
        <span className="text-sm" style={{ color: 'var(--muted-fg)' }}>{entries.length} entries</span>
      </div>

      {/* Spotlight */}
      <section>
        {spotlight ? (
          <SpotlightCard entry={spotlight} />
        ) : (
          <div className="rounded-3xl p-12 text-center border-2 border-dashed" style={{ borderColor: 'var(--border)', color: 'var(--muted-fg)' }}>
            <p className="gurmukhi text-xl mb-2">ਕੋਈ ਐਂਟਰੀ ਨਹੀਂ</p>
            <p className="text-sm">No entries yet — <Link href="/admin" className="underline">add some via Admin</Link></p>
          </div>
        )}
      </section>

      {/* Category cards */}
      <section>
        <h2 className="text-lg font-bold mb-4">Browse Collections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {counts.map((cat) => {
            const color = CATEGORY_COLORS[cat.value];
            return (
              <Link
                key={cat.value}
                href={`/${cat.value}`}
                className="group rounded-2xl p-5 border flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: color + '18' }}>
                  {cat.value === 'shayar' ? '✍️' : cat.value === 'short' ? '💬' : cat.value === 'poem' ? '📜' : '🎵'}
                </div>
                <div>
                  <p className="font-bold text-sm">{cat.label}</p>
                  <p className="gurmukhi text-xs mt-0.5" style={{ color: 'var(--muted-fg)' }}>{cat.labelPunjabi}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold" style={{ color }}>{cat.count} entries</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" style={{ color }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
