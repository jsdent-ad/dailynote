// DailyNote 도메인 타입

export interface DailyNote {
  id: number;
  date: string; // YYYY-MM-DD
  emotion_score: number | null; // 1~5, null if not set
  diary_text: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface Todo {
  id: number;
  date: string; // YYYY-MM-DD
  content: string;
  is_completed: 0 | 1;
  display_order: number;
  carried_over: 0 | 1;
  created_at: string; // ISO 8601
}

export interface CompletionStat {
  date: string;
  total: number;
  completed: number;
  completion_rate: number; // 0~100
}

export type EmotionScore = 1 | 2 | 3 | 4 | 5;
export type Period = 'weekly' | 'monthly';
export type Theme = 'light' | 'dark';
