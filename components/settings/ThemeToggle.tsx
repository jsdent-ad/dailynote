import React from 'react';
import { Switch } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import SettingsItem from './SettingsItem';

interface ThemeToggleProps {
  isLast?: boolean;
}

export default function ThemeToggle({ isLast = false }: ThemeToggleProps) {
  const { theme, colors, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <SettingsItem
      icon="moon-o"
      label="다크 모드"
      isLast={isLast}
      trailing={
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      }
    />
  );
}
