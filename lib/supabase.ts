// Types and constants only — DB client is in lib/db.ts

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
