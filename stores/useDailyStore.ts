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
  loadDayData: () => void;
  updateEmotionScore: (score: number | null) => void;
  updateDiaryText: (text: string) => void;
  addTodo: (content: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
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

  loadDayData: () => {
    const { selectedDate } = get();
    const today = getTodayString();

    // Carry over incomplete todos from yesterday if viewing today
    if (selectedDate === today) {
      const yesterday = getYesterdayString(selectedDate);
      try {
        todosService.carryOver(yesterday, selectedDate);
      } catch {
        // Silently ignore carry-over errors
      }
    }

    const dailyNote = dailyNotesService.getByDate(selectedDate);
    const todos = todosService.listByDate(selectedDate);
    set({ dailyNote, todos });
  },

  updateEmotionScore: (score: number | null) => {
    const { selectedDate } = get();
    dailyNotesService.upsertByDate(selectedDate, { emotion_score: score });
    const dailyNote = dailyNotesService.getByDate(selectedDate);
    set({ dailyNote });
  },

  updateDiaryText: (text: string) => {
    const { selectedDate } = get();
    dailyNotesService.upsertByDate(selectedDate, { diary_text: text });
    const dailyNote = dailyNotesService.getByDate(selectedDate);
    set({ dailyNote });
  },

  addTodo: (content: string) => {
    const { selectedDate } = get();
    todosService.create(selectedDate, content);
    const todos = todosService.listByDate(selectedDate);
    set({ todos });
  },

  toggleTodo: (id: number) => {
    const { selectedDate } = get();
    todosService.toggleComplete(id);
    const todos = todosService.listByDate(selectedDate);
    set({ todos });
  },

  removeTodo: (id: number) => {
    const { selectedDate } = get();
    todosService.deleteTodo(id);
    const todos = todosService.listByDate(selectedDate);
    set({ todos });
  },

  setIsRecording: (recording: boolean) => {
    set({ isRecording: recording });
  },
}));
