'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EntryCard from './EntryCard';
import type { Entry } from '@/lib/supabase';

interface Props {
  entries: Entry[];
  /** How many cards visible at once — auto-responsive if omitted */
  perView?: number;
}

export default function EntryCarousel({ entries }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', sync); ro.disconnect(); };
  }, [sync, entries]);

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by roughly one card width
    const card = el.querySelector(':scope > div') as HTMLElement | null;
    const amount = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  if (!entries.length) return null;

  return (
    <div className="relative group">
      {/* Left button */}
      <button
        onClick={() => scroll('left')}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        disabled={!canLeft}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="shrink-0"
            style={{
              scrollSnapAlign: 'start',
              width: 'clamp(260px, 30vw, 320px)',
            }}
          >
            <EntryCard entry={entry} delay={i * 60} />
          </div>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={() => scroll('right')}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full border shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        disabled={!canRight}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Scroll shadow hints */}
      {canLeft && (
        <div className="absolute left-0 top-0 bottom-2 w-10 pointer-events-none rounded-l-xl"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
      )}
      {canRight && (
        <div className="absolute right-0 top-0 bottom-2 w-10 pointer-events-none rounded-r-xl"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />
      )}
    </div>
  );
}
