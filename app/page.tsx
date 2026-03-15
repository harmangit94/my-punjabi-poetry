import { sql } from '@/lib/db';
import { CATEGORIES, type Entry } from '@/lib/supabase';
import { getSpotlightEntry } from '@/lib/spotlight';
import SpotlightCard from '@/components/SpotlightCard';
import EntryCard from '@/components/EntryCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const entries = (await sql`SELECT * FROM entries ORDER BY created_at DESC`) as Entry[];
  const spotlight = getSpotlightEntry(entries);

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    entries: entries.filter((e) => e.category === cat.value).slice(0, 4),
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
      <div className="flex items-center justify-between">
        <h1 className="gurmukhi text-2xl font-bold">ਕਾਵਿ-ਸੰਗ੍ਰਹਿ</h1>
        <span className="text-sm" style={{ color: 'var(--muted-fg)' }}>{entries.length} entries</span>
      </div>

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

      {byCategory.map((cat, ci) =>
        cat.entries.length > 0 ? (
          <section key={cat.value}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-bold">{cat.label}</h2>
                <span className="gurmukhi text-sm" style={{ color: 'var(--muted-fg)' }}>{cat.labelPunjabi}</span>
              </div>
              <Link href={`/${cat.value}`} className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cat.entries.map((entry, i) => (
                <EntryCard key={entry.id} entry={entry} delay={ci * 60 + i * 80} />
              ))}
            </div>
          </section>
        ) : null
      )}

      {entries.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--muted-fg)' }}>
          <p className="gurmukhi text-2xl mb-3">ਸ਼ੁਰੂ ਕਰੋ</p>
          <p className="mb-5">Get started by adding entries in the admin panel.</p>
          <Link href="/admin" className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)' }}>
            Go to Admin
          </Link>
        </div>
      )}
    </div>
  );
}
