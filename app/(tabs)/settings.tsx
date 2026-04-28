import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet } from 'react-native';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing } from '@/constants/theme';
import { createBackup, restoreBackup } from '@/services/backup';
import SettingsGroup from '@/components/settings/SettingsGroup';
import SettingsItem from '@/components/settings/SettingsItem';
import ThemeToggle from '@/components/settings/ThemeToggle';

export default function SettingsScreen() {
  const { colors } = useThemeStore();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleBackup = async () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    try {
      await createBackup();
    } catch (error) {
      Alert.alert('백업 실패', '데이터를 백업하는 중 오류가 발생했습니다.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = () => {
    Alert.alert(
      '데이터 복원',
      '기존 데이터를 덮어씁니다. 계속하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '복원',
          style: 'destructive',
          onPress: async () => {
            if (isRestoring) return;
            setIsRestoring(true);
            try {
              const success = await restoreBackup();
              if (success) {
                Alert.alert('복원 완료', '데이터가 성공적으로 복원되었습니다.');
              }
            } catch (error) {
              Alert.alert(
                '복원 실패',
                error instanceof Error
                  ? error.message
                  : '데이터를 복원하는 중 오류가 발생했습니다.'
              );
            } finally {
              setIsRestoring(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <SettingsGroup title="외관">
        <ThemeToggle isLast />
      </SettingsGroup>

      <SettingsGroup title="데이터">
        <SettingsItem
          icon="download"
          label="데이터 백업"
          showChevron
          onPress={handleBackup}
        />
        <SettingsItem
          icon="upload"
          label="데이터 복원"
          showChevron
          onPress={handleRestore}
          isLast
        />
      </SettingsGroup>

      <SettingsGroup title="정보">
        <SettingsItem
          icon="info-circle"
          label="앱 버전"
          trailingText="v1.0.0"
          isLast
        />
      </SettingsGroup>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
});
