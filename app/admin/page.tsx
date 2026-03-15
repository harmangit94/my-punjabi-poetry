'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Loader2, Plus, Upload, Trash2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { CATEGORIES, type Category, type Entry } from '@/lib/supabase';
import { getEntries, addEntry, deleteEntry, bulkInsert } from './actions';

type Toast = { type: 'success' | 'error'; msg: string };

const BLANK = { title: '', content: '', category: 'shayar' as Category, author: '' };

export default function AdminPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [entries, setEntries]   = useState<Entry[]>([]);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast]       = useState<Toast | null>(null);

  const [importRows, setImportRows]     = useState<Omit<Entry, 'id' | 'created_at'>[]>([]);
  const [importing, setImporting]       = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  function showToast(type: Toast['type'], msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => { load(); }, []);

  async function load() {
    setEntries(await getEntries());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content || !form.author) { showToast('error', 'All fields are required'); return; }
    setSaving(true);
    try {
      await addEntry({ title: form.title.trim(), content: form.content.trim(), category: form.category, author: form.author.trim() });
      showToast('success', 'Entry added!');
      setForm(BLANK);
      load();
    } catch {
      showToast('error', 'Failed to save entry');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return;
    setDeleting(id);
    await deleteEntry(id);
    setDeleting(null);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('success', 'Entry deleted');
  }

  async function handleSignOut() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/auth');
  }

  function parseFile(file: File) {
    setImportRows([]);
    setImportErrors([]);
    const name = file.name.toLowerCase();

    if (name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const raw = JSON.parse(ev.target?.result as string);
          processRows(Array.isArray(raw) ? raw : [raw]);
        } catch { setImportErrors(['Invalid JSON file']); }
      };
      reader.readAsText(file);
      return;
    }
    if (name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true, skipEmptyLines: true,
        complete: (res) => processRows(res.data as Record<string, string>[]),
        error: () => setImportErrors(['Failed to parse CSV']),
      });
      return;
    }
    setImportErrors(['Only .csv or .json files accepted']);
  }

  function processRows(rows: Record<string, string>[]) {
    const valid: Omit<Entry, 'id' | 'created_at'>[] = [];
    const errors: string[] = [];
    const validCats = CATEGORIES.map((c) => c.value);
    rows.forEach((row, i) => {
      const title    = (row.title ?? '').trim();
      const content  = (row.content ?? row.body ?? '').trim();
      const author   = (row.author ?? 'Unknown').trim();
      const category = (row.category ?? '').trim().toLowerCase() as Category;
      if (!title)   { errors.push(`Row ${i + 1}: missing title`); return; }
      if (!content) { errors.push(`Row ${i + 1}: missing content/body`); return; }
      if (!validCats.includes(category)) { errors.push(`Row ${i + 1}: invalid category "${category}"`); return; }
      valid.push({ title, content, author, category });
    });
    setImportRows(valid);
    setImportErrors(errors);
  }

  async function handleBulkImport() {
    if (!importRows.length) return;
    setImporting(true);
    try {
      await bulkInsert(importRows as { title: string; content: string; category: Category; author: string }[]);
      showToast('success', `Imported ${importRows.length} entries!`);
      setImportRows([]);
      setImportErrors([]);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch { showToast('error', 'Import failed'); }
    setImporting(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{ backgroundColor: toast.type === 'success' ? '#d1fae5' : '#fee2e2', color: toast.type === 'success' ? '#065f46' : '#991b1b' }}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-fg)' }}>{entries.length} entries in collection</p>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)', color: 'var(--muted-fg)' }}>
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Entry */}
        <section className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" style={{ color: 'var(--primary)' }} /> Add Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title (Gurmukhi)</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm gurmukhi outline-none"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="ਸਿਰਲੇਖ" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Author</label>
              <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label} — {c.labelPunjabi}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Content (Gurmukhi)</label>
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={8} className="w-full px-3 py-2.5 rounded-xl border text-sm gurmukhi outline-none resize-y"
                style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="ਇੱਥੇ ਲਿਖੋ..." />
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-fg)' }}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Add Entry
            </button>
          </form>
        </section>

        {/* Bulk Import */}
        <section className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Upload className="w-5 h-5" style={{ color: 'var(--primary)' }} /> Bulk Import
          </h2>
          <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:opacity-70 transition-opacity"
            style={{ borderColor: 'var(--primary)' }} onClick={() => fileRef.current?.click()}>
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--primary)' }} />
            <p className="text-sm font-medium">Click to upload CSV or JSON</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-fg)' }}>Columns: title, content (or body), category, author</p>
          </div>
          <input ref={fileRef} type="file" accept=".csv,.json" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }} />

          <div className="rounded-xl p-3 text-xs font-mono" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-fg)' }}>
            <p className="font-semibold mb-1 font-sans">CSV example:</p>
            title,content,category,author<br />
            ਤੇਰੀ ਯਾਦ,ਤੂੰ ਮੇਰੇ...,shayar,Amrita Pritam
          </div>

          {importErrors.length > 0 && (
            <div className="rounded-xl p-3 space-y-1 text-xs" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
              {importErrors.map((e, i) => <p key={i}>⚠ {e}</p>)}
            </div>
          )}

          {importRows.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{importRows.length} entries ready:</p>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {importRows.map((row, i) => (
                  <div key={i} className="text-xs rounded-lg px-3 py-2 border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                    <span className="font-semibold gurmukhi">{row.title}</span>
                    <span className="ml-2" style={{ color: 'var(--muted-fg)' }}>· {row.category} · {row.author}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleBulkImport} disabled={importing}
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: '#059669', color: '#fff' }}>
                {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                Import {importRows.length} Entries
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Entries list */}
      <section>
        <h2 className="font-semibold text-lg mb-4">All Entries ({entries.length})</h2>
        {entries.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted-fg)' }}>No entries yet.</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="min-w-0">
                  <p className="gurmukhi font-medium text-sm truncate">{entry.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-fg)' }}>
                    {entry.category} · {entry.author} · {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}
                  className="shrink-0 p-2 rounded-lg hover:opacity-70 transition-opacity disabled:opacity-40"
                  style={{ color: '#ef4444' }}>
                  {deleting === entry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
