import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, PanResponder, View } from 'react-native';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing } from '@/constants/theme';
import DateHeader from '@/components/daily/DateHeader';
import EmotionScore from '@/components/daily/EmotionScore';
import TodoList from '@/components/daily/TodoList';
import TodoAdd from '@/components/daily/TodoAdd';
import DiaryEditor from '@/components/daily/DiaryEditor';

const SWIPE_THRESHOLD = 80;

export default function DailyNoteScreen() {
  const { selectedDate, loadDayData, goToPreviousDay, goToNextDay } = useDailyStore();
  const { colors } = useThemeStore();

  // Load data when selectedDate changes
  useEffect(() => {
    loadDayData();
  }, [selectedDate]);

  // Horizontal swipe for date navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        // Only capture horizontal swipes
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          goToPreviousDay();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          goToNextDay();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]} {...panResponder.panHandlers}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <DateHeader />
        <EmotionScore />
        <TodoList />
        <TodoAdd />
        <DiaryEditor />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
