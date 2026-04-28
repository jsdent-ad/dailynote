import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';
import { useStatsStore } from '@/stores/useStatsStore';
import { spacing, fontSize } from '@/constants/theme';
import PeriodToggle from '@/components/stats/PeriodToggle';
import EmotionChart from '@/components/stats/EmotionChart';
import CompletionChart from '@/components/stats/CompletionChart';
import StreakCounter from '@/components/stats/StreakCounter';
import EmptyState from '@/components/stats/EmptyState';

export default function StatsScreen() {
  const { colors } = useThemeStore();
  const { period, emotionData, completionData, streak, setPeriod, loadStats } = useStatsStore();

  // Reload stats whenever the tab is focused
  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  const hasData = emotionData.length > 0 || completionData.length > 0;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: colors.text }]}>통계/인사이트</Text>

      <PeriodToggle period={period} onChangePeriod={setPeriod} />

      {!hasData ? (
        <EmptyState />
      ) : (
        <View style={styles.charts}>
          <StreakCounter streak={streak} />

          {emotionData.length > 0 && <EmotionChart data={emotionData} />}

          {completionData.length > 0 && <CompletionChart data={completionData} />}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  charts: {
    gap: spacing.md,
  },
});
