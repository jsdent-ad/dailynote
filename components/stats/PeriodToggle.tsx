import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';
import type { Period } from '@/types';

interface PeriodToggleProps {
  period: Period;
  onChangePeriod: (period: Period) => void;
}

export default function PeriodToggle({ period, onChangePeriod }: PeriodToggleProps) {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.button,
          period === 'weekly' && { backgroundColor: colors.primary },
        ]}
        onPress={() => onChangePeriod('weekly')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            { color: period === 'weekly' ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          주간
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          period === 'monthly' && { backgroundColor: colors.primary },
        ]}
        onPress={() => onChangePeriod('monthly')}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.buttonText,
            { color: period === 'monthly' ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          월간
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
