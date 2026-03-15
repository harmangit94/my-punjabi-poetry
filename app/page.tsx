import { sql } from '@/lib/db';
import { type Entry } from '@/lib/supabase';
import { getSpotlightEntry } from '@/lib/spotlight';
import SpotlightCard from '@/components/SpotlightCard';
import CategoryBrowser from '@/components/CategoryBrowser';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const entries = (await sql`SELECT * FROM entries ORDER BY created_at DESC`) as Entry[];
  const spotlight = getSpotlightEntry(entries);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
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

      {/* All categories carousel browser */}
      {entries.length > 0 && (
        <section>
          <CategoryBrowser allEntries={entries} initialCategory="shayar" />
        </section>
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
