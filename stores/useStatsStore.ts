import { create } from 'zustand';
import type { Period, CompletionStat } from '@/types';
import {
  getEmotionData,
  getCompletionData,
  getCurrentStreak,
  getDateRange,
} from '@/services/stats';

interface StatsState {
  period: Period;
  emotionData: { date: string; score: number | null }[];
  completionData: CompletionStat[];
  streak: number;
  setPeriod: (period: Period) => void;
  loadStats: () => Promise<void>;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  period: 'weekly',
  emotionData: [],
  completionData: [],
  streak: 0,

  setPeriod: (period: Period) => {
    set({ period });
    get().loadStats();
  },

  loadStats: async () => {
    const { period } = get();
    const { startDate, endDate } = getDateRange(period);
    const today = new Date().toISOString().slice(0, 10);

    const emotionData = await getEmotionData(startDate, endDate);
    const completionData = await getCompletionData(startDate, endDate);
    const streak = await getCurrentStreak(today);

    set({ emotionData, completionData, streak });
  },
}));
