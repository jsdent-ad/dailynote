import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing, fontSize } from '@/constants/theme';

interface SettingsItemProps {
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  trailing?: React.ReactNode;
  trailingText?: string;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

export default function SettingsItem({
  icon,
  label,
  trailing,
  trailingText,
  showChevron = false,
  onPress,
  isLast = false,
}: SettingsItemProps) {
  const { colors } = useThemeStore();

  const content = (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.left}>
        {icon && (
          <FontAwesome
            name={icon}
            size={18}
            color={colors.primary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <View style={styles.right}>
        {trailingText && (
          <Text style={[styles.trailingText, { color: colors.textSecondary }]}>
            {trailingText}
          </Text>
        )}
        {trailing}
        {showChevron && (
          <FontAwesome
            name="chevron-right"
            size={14}
            color={colors.textSecondary}
            style={styles.chevron}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed && { opacity: 0.6 }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.sm,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: fontSize.md,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailingText: {
    fontSize: fontSize.sm,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
});
