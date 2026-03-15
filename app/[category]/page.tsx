import { sql } from '@/lib/db';
import { CATEGORIES, type Entry, type Category } from '@/lib/supabase';
import CategoryBrowser from '@/components/CategoryBrowser';
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
  return { title: `${cat.label} · Ray of Hope` };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!CATEGORIES.find((c) => c.value === category)) notFound();

  const allEntries = (await sql`SELECT * FROM entries ORDER BY created_at DESC`) as Entry[];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--primary)' }}>Collection</p>
        <h1 className="text-3xl font-bold">Ray of Hope</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-fg)' }}>{allEntries.length} entries across all categories</p>
      </div>

      <CategoryBrowser allEntries={allEntries} initialCategory={category as Category} />
    </div>
  );
}
