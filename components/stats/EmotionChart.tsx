import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

interface EmotionChartProps {
  data: { date: string; score: number | null }[];
}

function formatDateLabel(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
}

export default function EmotionChart({ data }: EmotionChartProps) {
  const { colors } = useThemeStore();
  const chartWidth = Dimensions.get('window').width - 32;

  const scores = data.map((d) => (d.score != null ? d.score : 0));
  const labels = data.map((d) => formatDateLabel(d.date));

  // Show a subset of labels to avoid overcrowding
  const maxLabels = 7;
  const step = Math.max(1, Math.floor(labels.length / maxLabels));
  const displayLabels = labels.map((label, i) => (i % step === 0 ? label : ''));

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>감정 점수</Text>
      <LineChart
        data={{
          labels: displayLabels,
          datasets: [
            {
              data: scores.length > 0 ? scores : [0],
              color: () => colors.primary,
              strokeWidth: 2,
            },
          ],
        }}
        width={chartWidth}
        height={200}
        yAxisSuffix=""
        yAxisInterval={1}
        fromZero={false}
        segments={4}
        chartConfig={{
          backgroundColor: colors.cardBackground,
          backgroundGradientFrom: colors.cardBackground,
          backgroundGradientTo: colors.cardBackground,
          decimalPlaces: 0,
          color: () => colors.primary,
          labelColor: () => colors.textSecondary,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
          },
        }}
        style={styles.chart}
        bezier
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
