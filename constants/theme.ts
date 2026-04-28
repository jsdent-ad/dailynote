export const lightTheme = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  accent: '#F59E0B',
  border: '#E5E7EB',
  success: '#10B981',
  error: '#EF4444',
  todoCompleted: '#9CA3AF',
  cardBackground: '#FFFFFF',
};

export const darkTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  primary: '#818CF8',
  primaryLight: '#6366F1',
  accent: '#FBBF24',
  border: '#334155',
  success: '#34D399',
  error: '#F87171',
  todoCompleted: '#64748B',
  cardBackground: '#1E293B',
};

export type AppTheme = typeof lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};
