import type { Entry } from '@/lib/supabase';

export default function SpotlightCard({ entry }: { entry: Entry }) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-8 md:p-12 fade-up"
      style={{
        background: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
        color: '#fff',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full opacity-10 bg-white" />

      <div className="relative z-10 max-w-3xl">
        {/* Label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-full">
            ✦ Spotlight of the Hour
          </span>
          <span className="text-xs text-white/60">Changes every hour · same for all</span>
        </div>

        {/* Category */}
        <p className="text-white/60 text-sm uppercase tracking-widest mb-3">{entry.category}</p>

        {/* Title */}
        <h2 className="gurmukhi-lg text-3xl md:text-4xl font-bold mb-6">{entry.title}</h2>

        {/* Content */}
        <div className="gurmukhi-lg text-lg md:text-xl whitespace-pre-line text-white/90 leading-relaxed max-w-2xl">
          {entry.content}
        </div>

        {/* Author */}
        <div className="mt-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
            {entry.author.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-white/80">{entry.author}</span>
        </div>
      </div>
    </div>
  );
}
