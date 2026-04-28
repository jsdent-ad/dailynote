import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

const EMOTION_LABELS = ['', '😞', '😐', '🙂', '😊', '😄'];
const SCORES = [1, 2, 3, 4, 5] as const;

export default function EmotionScore() {
  const { dailyNote, updateEmotionScore } = useDailyStore();
  const { colors } = useThemeStore();
  const currentScore = dailyNote?.emotion_score ?? null;

  const handlePress = (score: number) => {
    if (currentScore === score) {
      updateEmotionScore(null);
    } else {
      updateEmotionScore(score);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>오늘의 기분</Text>
      <View style={styles.row}>
        {SCORES.map((score) => {
          const isSelected = currentScore === score;
          return (
            <TouchableOpacity
              key={score}
              onPress={() => handlePress(score)}
              style={[
                styles.button,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={styles.emoji}>{EMOTION_LABELS[score]}</Text>
              <Text
                style={[
                  styles.scoreText,
                  { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                ]}
              >
                {score}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  scoreText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
