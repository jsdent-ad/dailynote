import { getDatabase } from '@/services/database';
import type { DailyNote } from '@/types';

/**
 * Get a daily note by date.
 */
export async function getByDate(date: string): Promise<DailyNote | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<DailyNote>(
    'SELECT * FROM daily_notes WHERE date = ?',
    [date]
  );
  return row ?? null;
}

/**
 * Insert or update a daily note for the given date.
 * Uses COALESCE so that only provided fields are updated on conflict.
 */
export async function upsertByDate(
  date: string,
  data: { emotion_score?: number | null; diary_text?: string }
): Promise<void> {
  const db = await getDatabase();
  const emotionScore = data.emotion_score ?? null;
  const diaryText = data.diary_text ?? '';

  await db.runAsync(
    `INSERT INTO daily_notes (date, emotion_score, diary_text, updated_at)
     VALUES (?, ?, ?, datetime('now', 'localtime'))
     ON CONFLICT(date) DO UPDATE SET
       emotion_score = COALESCE(?, emotion_score),
       diary_text = COALESCE(?, diary_text),
       updated_at = datetime('now', 'localtime')`,
    [date, emotionScore, diaryText, emotionScore, diaryText]
  );
}

/**
 * Get all daily notes within a date range (inclusive), ordered by date ascending.
 */
export async function getRange(startDate: string, endDate: string): Promise<DailyNote[]> {
  const db = await getDatabase();
  return db.getAllAsync<DailyNote>(
    'SELECT * FROM daily_notes WHERE date BETWEEN ? AND ? ORDER BY date ASC',
    [startDate, endDate]
  );
}

/**
 * Calculate the number of consecutive days with a daily note,
 * counting backwards from the given date.
 */
export async function getStreak(today: string): Promise<number> {
  const db = await getDatabase();

  // Fetch all dates up to today in descending order
  const rows = await db.getAllAsync<{ date: string }>(
    'SELECT date FROM daily_notes WHERE date <= ? ORDER BY date DESC',
    [today]
  );

  if (rows.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date(today + 'T00:00:00');

  for (const row of rows) {
    const rowDate = new Date(row.date + 'T00:00:00');
    const expectedDateStr = currentDate.toISOString().slice(0, 10);

    if (row.date === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Export all daily notes ordered by date.
 */
export async function exportAll(): Promise<DailyNote[]> {
  const db = await getDatabase();
  return db.getAllAsync<DailyNote>(
    'SELECT * FROM daily_notes ORDER BY date'
  );
}
