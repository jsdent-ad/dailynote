import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

export default function TodoList() {
  const { todos, toggleTodo, removeTodo } = useDailyStore();
  const { colors } = useThemeStore();

  const handleLongPress = (id: number, content: string) => {
    Alert.alert(
      '할 일 삭제',
      `"${content}"을(를) 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => removeTodo(id) },
      ]
    );
  };

  if (todos.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>할 일</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          아직 할 일이 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>할 일</Text>
      {todos.map((todo) => {
        const isCompleted = todo.is_completed === 1;
        return (
          <TouchableOpacity
            key={todo.id}
            style={[styles.todoRow, { borderBottomColor: colors.border }]}
            onPress={() => toggleTodo(todo.id)}
            onLongPress={() => handleLongPress(todo.id, todo.content)}
            activeOpacity={0.6}
          >
            <FontAwesome
              name={isCompleted ? 'check-square-o' : 'square-o'}
              size={20}
              color={isCompleted ? colors.success : colors.textSecondary}
            />
            <Text
              style={[
                styles.todoText,
                {
                  color: isCompleted ? colors.todoCompleted : colors.text,
                  textDecorationLine: isCompleted ? 'line-through' : 'none',
                },
              ]}
              numberOfLines={2}
            >
              {todo.content}
            </Text>
            {todo.carried_over === 1 && (
              <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                <Text style={styles.badgeText}>이월</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
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
  emptyText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  todoText: {
    flex: 1,
    fontSize: fontSize.md,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
