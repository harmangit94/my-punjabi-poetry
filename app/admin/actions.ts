'use server';

import { sql } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Category, Entry } from '@/lib/supabase';

export async function getEntries(): Promise<Entry[]> {
  return (await sql`SELECT * FROM entries ORDER BY created_at DESC`) as Entry[];
}

export async function addEntry(data: { title: string; content: string; category: Category; author: string }) {
  await sql`
    INSERT INTO entries (title, content, category, author)
    VALUES (${data.title}, ${data.content}, ${data.category}, ${data.author})
  `;
  revalidatePath('/');
  revalidatePath(`/${data.category}`);
}

export async function deleteEntry(id: string) {
  const rows = (await sql`SELECT category FROM entries WHERE id = ${id}`) as { category: string }[];
  await sql`DELETE FROM entries WHERE id = ${id}`;
  revalidatePath('/');
  if (rows[0]) revalidatePath(`/${rows[0].category}`);
}

export async function updateEntry(id: string, data: { title: string; content: string; category: Category; author: string }) {
  await sql`
    UPDATE entries
    SET title = ${data.title}, content = ${data.content}, category = ${data.category}, author = ${data.author}
    WHERE id = ${id}
  `;
  revalidatePath('/');
  revalidatePath(`/${data.category}`);
}

export async function bulkInsert(rows: { title: string; content: string; category: Category; author: string }[]) {
  for (const row of rows) {
    await sql`
      INSERT INTO entries (title, content, category, author)
      VALUES (${row.title}, ${row.content}, ${row.category}, ${row.author})
    `;
  }
  revalidatePath('/');
  revalidatePath('/shayar');
  revalidatePath('/short');
  revalidatePath('/poem');
  revalidatePath('/song');
}
