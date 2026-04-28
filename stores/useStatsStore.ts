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
  loadStats: () => void;
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

  loadStats: () => {
    const { period } = get();
    const { startDate, endDate } = getDateRange(period);
    const today = new Date().toISOString().slice(0, 10);

    const emotionData = getEmotionData(startDate, endDate);
    const completionData = getCompletionData(startDate, endDate);
    const streak = getCurrentStreak(today);

    set({ emotionData, completionData, streak });
  },
}));
