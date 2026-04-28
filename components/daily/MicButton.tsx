import React from 'react';
import { TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useDailyStore } from '@/stores/useDailyStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { spacing } from '@/constants/theme';

let ExpoSpeechRecognitionModule: any = null;
let useSpeechRecognitionEvent: any = null;

try {
  const speechModule = require('expo-speech-recognition');
  ExpoSpeechRecognitionModule = speechModule.ExpoSpeechRecognitionModule;
  useSpeechRecognitionEvent = speechModule.useSpeechRecognitionEvent;
} catch {
  // expo-speech-recognition not available on this platform
}

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export default function MicButton({ onTranscript }: MicButtonProps) {
  const { isRecording, setIsRecording } = useDailyStore();
  const { colors } = useThemeStore();

  // Register speech recognition events if available
  if (useSpeechRecognitionEvent) {
    useSpeechRecognitionEvent('result', (event: any) => {
      const transcript = event.results?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    });

    useSpeechRecognitionEvent('end', () => {
      setIsRecording(false);
    });

    useSpeechRecognitionEvent('error', (event: any) => {
      setIsRecording(false);
      Alert.alert('음성 인식 오류', event.error || '음성 인식 중 오류가 발생했습니다.');
    });
  }

  const handlePress = async () => {
    if (!ExpoSpeechRecognitionModule) {
      Alert.alert('지원되지 않음', '이 기기에서는 음성 인식을 사용할 수 없습니다.');
      return;
    }

    try {
      if (isRecording) {
        ExpoSpeechRecognitionModule.stop();
        setIsRecording(false);
        return;
      }

      const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('권한 필요', '음성 인식을 사용하려면 마이크 권한이 필요합니다.');
        return;
      }

      ExpoSpeechRecognitionModule.start({
        lang: 'ko-KR',
        interimResults: false,
      });
      setIsRecording(true);
    } catch (error: any) {
      setIsRecording(false);
      Alert.alert('음성 인식 오류', error?.message || '음성 인식을 시작할 수 없습니다.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: isRecording ? colors.error : colors.surface, borderColor: isRecording ? colors.error : colors.border },
      ]}
    >
      <FontAwesome
        name="microphone"
        size={18}
        color={isRecording ? '#FFFFFF' : colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
