import type { Entry } from './supabase';

/**
 * Returns a deterministic "entry of the hour" — same for all users
 * within the same clock-hour. Seed changes every hour.
 */
export function getSpotlightEntry(entries: Entry[]): Entry | null {
  if (!entries.length) return null;
  const now = new Date();
  // Build an integer seed: YYYYMMDDHH
  const seed = parseInt(
    `${now.getFullYear()}` +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0')
  );
  return entries[seed % entries.length];
}

/** Seconds until the next full hour (for revalidation) */
export function secondsUntilNextHour(): number {
  const now = new Date();
  return (60 - now.getMinutes()) * 60 - now.getSeconds();
}
