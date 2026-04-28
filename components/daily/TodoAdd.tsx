import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

export default function TodoAdd() {
  const [text, setText] = useState('');
  const { addTodo } = useDailyStore();
  const { colors } = useThemeStore();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setText('');
  };

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TextInput
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        placeholder="새로운 할 일 추가..."
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, { backgroundColor: text.trim() ? colors.primary : colors.border }]}
        disabled={!text.trim()}
      >
        <FontAwesome name="plus" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
