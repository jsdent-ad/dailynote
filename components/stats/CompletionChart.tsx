import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';
import type { CompletionStat } from '@/types';

interface CompletionChartProps {
  data: CompletionStat[];
}

function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
}

export default function CompletionChart({ data }: CompletionChartProps) {
  const { colors } = useThemeStore();
  const chartWidth = Dimensions.get('window').width - 32;

  const rates = data.map((d) => d.completion_rate);
  const labels = data.map((d) => formatDateLabel(d.date));

  // Show a subset of labels to avoid overcrowding
  const maxLabels = 7;
  const step = Math.max(1, Math.floor(labels.length / maxLabels));
  const displayLabels = labels.map((label, i) => (i % step === 0 ? label : ''));

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>할 일 완료율</Text>
      <BarChart
        data={{
          labels: displayLabels,
          datasets: [
            {
              data: rates.length > 0 ? rates : [0],
            },
          ],
        }}
        width={chartWidth}
        height={200}
        yAxisSuffix="%"
        yAxisLabel=""
        fromZero
        chartConfig={{
          backgroundColor: colors.cardBackground,
          backgroundGradientFrom: colors.cardBackground,
          backgroundGradientTo: colors.cardBackground,
          decimalPlaces: 0,
          color: () => colors.success,
          labelColor: () => colors.textSecondary,
          barPercentage: 0.6,
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: 8,
    marginLeft: -spacing.md,
  },
});
