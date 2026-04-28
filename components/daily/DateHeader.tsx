import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

const DAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return `${month}월 ${day}일 ${dayName}`;
}

export default function DateHeader() {
  const { selectedDate, goToPreviousDay, goToNextDay } = useDailyStore();
  const { colors } = useThemeStore();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={goToPreviousDay} style={styles.arrow} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <FontAwesome name="chevron-left" size={18} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.dateText, { color: colors.text }]}>
        {formatKoreanDate(selectedDate)}
      </Text>

      <TouchableOpacity onPress={goToNextDay} style={styles.arrow} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <FontAwesome name="chevron-right" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  arrow: {
    padding: spacing.sm,
  },
  dateText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
});
