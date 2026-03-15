import { sql } from '@/lib/db';
import { CATEGORIES, type Entry, type Category } from '@/lib/supabase';
import EntryCard from '@/components/EntryCard';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.value }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.value === category);
  if (!cat) return {};
  return { title: `${cat.label} · ਕਾਵਿ-ਸੰਗ੍ਰਹਿ` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.value === category);
  if (!cat) notFound();

  const entries = (await sql`
    SELECT * FROM entries
    WHERE category = ${category as Category}
    ORDER BY created_at DESC
  `) as Entry[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--primary)' }}>Collection</p>
        <h1 className="text-3xl font-bold">{cat.label}</h1>
        <p className="gurmukhi text-xl mt-1" style={{ color: 'var(--muted-fg)' }}>{cat.labelPunjabi}</p>
        <p className="text-sm mt-2" style={{ color: 'var(--muted-fg)' }}>{entries.length} entries</p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--muted-fg)' }}>
          <p className="gurmukhi text-2xl mb-2">ਕੋਈ ਐਂਟਰੀ ਨਹੀਂ</p>
          <p className="text-sm">No {cat.label.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
