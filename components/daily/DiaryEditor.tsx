import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';
import MicButton from './MicButton';

export default function DiaryEditor() {
  const { dailyNote, updateDiaryText } = useDailyStore();
  const { colors } = useThemeStore();
  const [localText, setLocalText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoadRef = useRef(true);

  // Sync from store to local state when dailyNote changes (date navigation)
  useEffect(() => {
    const noteText = dailyNote?.diary_text ?? '';
    setLocalText(noteText);
    isInitialLoadRef.current = true;
  }, [dailyNote?.date]);

  // Debounced save
  const handleTextChange = useCallback((text: string) => {
    setLocalText(text);
    isInitialLoadRef.current = false;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateDiaryText(text);
    }, 1000);
  }, [updateDiaryText]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleTranscript = useCallback((transcript: string) => {
    setLocalText((prev) => {
      const newText = prev ? `${prev} ${transcript}` : transcript;
      // Save immediately after STT
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        updateDiaryText(newText);
      }, 500);
      return newText;
    });
  }, [updateDiaryText]);

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>일기</Text>
        <MicButton onTranscript={handleTranscript} />
      </View>
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="오늘 하루는 어땠나요?"
        placeholderTextColor={colors.textSecondary}
        value={localText}
        onChangeText={handleTextChange}
        multiline
        textAlignVertical="top"
      />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  input: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    padding: spacing.md,
    fontSize: fontSize.md,
    lineHeight: 24,
  },
});
