import { getRange, getStreak } from '@/services/dailyNotes';
import { getCompletionStats } from '@/services/todos';
import type { Period } from '@/types';

export function getEmotionData(startDate: string, endDate: string) {
  return getRange(startDate, endDate).map((n) => ({
    date: n.date,
    score: n.emotion_score,
  }));
}

export function getCompletionData(startDate: string, endDate: string) {
  return getCompletionStats(startDate, endDate);
}

export function getCurrentStreak(today: string) {
  return getStreak(today);
}

export function getDateRange(period: Period): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10);

  const daysBack = period === 'weekly' ? 6 : 29;
  const start = new Date(today);
  start.setDate(start.getDate() - daysBack);
  const startDate = start.toISOString().slice(0, 10);

  return { startDate, endDate };
}
