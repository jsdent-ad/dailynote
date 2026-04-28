import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '@/types';
import { lightTheme, darkTheme, AppTheme } from '@/constants/theme';

const THEME_STORAGE_KEY = 'dailynote_theme';

interface ThemeState {
  theme: Theme;
  colors: AppTheme;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  colors: lightTheme,

  toggleTheme: () => {
    const newTheme: Theme = get().theme === 'light' ? 'dark' : 'light';
    const newColors = newTheme === 'light' ? lightTheme : darkTheme;

    set({ theme: newTheme, colors: newColors });
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme).catch(() => {
      // Silently handle storage write failure
    });
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        const colors = savedTheme === 'light' ? lightTheme : darkTheme;
        set({ theme: savedTheme, colors });
      }
    } catch {
      // Fall back to default light theme
    }
  },
}));
