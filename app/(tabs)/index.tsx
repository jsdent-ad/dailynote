import { StyleSheet, View, Text } from 'react-native';

export default function DailyNoteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 데일리노트</Text>
      <Text style={styles.subtitle}>P2-S1-T1에서 구현 예정</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
});
