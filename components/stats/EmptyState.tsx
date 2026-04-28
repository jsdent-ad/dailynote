import { StyleSheet, View, Text } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

export default function EmptyState() {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { color: colors.textSecondary }]}>📝</Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>기록을 시작해보세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  text: {
    fontSize: fontSize.lg,
  },
});
