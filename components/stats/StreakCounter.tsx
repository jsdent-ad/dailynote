import { StyleSheet, View, Text } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={[styles.count, { color: colors.accent }]}>{streak}일</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>연속 기록</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: fontSize.xl,
  },
  count: {
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  label: {
    fontSize: fontSize.md,
  },
});
