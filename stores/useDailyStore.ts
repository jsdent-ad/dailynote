import { create } from 'zustand';
import type { DailyNote, Todo } from '@/types';
import * as dailyNotesService from '@/services/dailyNotes';
import * as todosService from '@/services/todos';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayString(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface DailyState {
  selectedDate: string;
  dailyNote: DailyNote | null;
  todos: Todo[];
  isRecording: boolean;

  setSelectedDate: (date: string) => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;
  loadDayData: () => Promise<void>;
  updateEmotionScore: (score: number | null) => Promise<void>;
  updateDiaryText: (text: string) => Promise<void>;
  addTodo: (content: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  setIsRecording: (recording: boolean) => void;
}

export const useDailyStore = create<DailyState>((set, get) => ({
  selectedDate: getTodayString(),
  dailyNote: null,
  todos: [],
  isRecording: false,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  goToPreviousDay: () => {
    const prev = addDays(get().selectedDate, -1);
    set({ selectedDate: prev });
  },

  goToNextDay: () => {
    const next = addDays(get().selectedDate, 1);
    set({ selectedDate: next });
  },

  loadDayData: async () => {
    const { selectedDate } = get();
    const today = getTodayString();

    // Carry over incomplete todos from yesterday if viewing today
    if (selectedDate === today) {
      const yesterday = getYesterdayString(selectedDate);
      try {
        await todosService.carryOver(yesterday, selectedDate);
      } catch {
        // Silently ignore carry-over errors
      }
    }

    const dailyNote = await dailyNotesService.getByDate(selectedDate);
    const todos = await todosService.listByDate(selectedDate);
    set({ dailyNote, todos });
  },

  updateEmotionScore: async (score: number | null) => {
    const { selectedDate } = get();
    await dailyNotesService.upsertByDate(selectedDate, { emotion_score: score });
    const dailyNote = await dailyNotesService.getByDate(selectedDate);
    set({ dailyNote });
  },

  updateDiaryText: async (text: string) => {
    const { selectedDate } = get();
    await dailyNotesService.upsertByDate(selectedDate, { diary_text: text });
    const dailyNote = await dailyNotesService.getByDate(selectedDate);
    set({ dailyNote });
  },

  addTodo: async (content: string) => {
    const { selectedDate } = get();
    await todosService.create(selectedDate, content);
    const todos = await todosService.listByDate(selectedDate);
    set({ todos });
  },

  toggleTodo: async (id: number) => {
    const { selectedDate } = get();
    await todosService.toggleComplete(id);
    const todos = await todosService.listByDate(selectedDate);
    set({ todos });
  },

  removeTodo: async (id: number) => {
    const { selectedDate } = get();
    await todosService.deleteTodo(id);
    const todos = await todosService.listByDate(selectedDate);
    set({ todos });
  },

  setIsRecording: (recording: boolean) => {
    set({ isRecording: recording });
  },
}));
