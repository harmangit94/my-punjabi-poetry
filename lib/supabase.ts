import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://placeholder.supabase.co';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder';

export const supabase = createClient(url, anon);

export type Category = 'shayar' | 'short' | 'poem' | 'song';

export interface Entry {
  id: string;
  title: string;
  content: string;
  category: Category;
  author: string;
  created_at: string;
}

export const CATEGORIES: { value: Category; label: string; labelPunjabi: string }[] = [
  { value: 'shayar', label: 'Shayari',  labelPunjabi: 'ਸ਼ਾਇਰੀ'  },
  { value: 'short',  label: 'Short',    labelPunjabi: 'ਛੋਟੀਆਂ'  },
  { value: 'poem',   label: 'Poems',    labelPunjabi: 'ਕਵਿਤਾਵਾਂ' },
  { value: 'song',   label: 'Songs',    labelPunjabi: 'ਗੀਤ'      },
];
