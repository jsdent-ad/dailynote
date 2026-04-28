import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { exportAll as exportNotes } from '@/services/dailyNotes';
import { exportAll as exportTodos } from '@/services/todos';
import { getDatabase } from '@/services/database';
import type { DailyNote, Todo } from '@/types';

interface BackupData {
  version: number;
  exported_at: string;
  daily_notes: DailyNote[];
  todos: Todo[];
}

export async function createBackup(): Promise<void> {
  const notes = exportNotes();
  const todos = exportTodos();
  const data: BackupData = {
    version: 1,
    exported_at: new Date().toISOString(),
    daily_notes: notes,
    todos: todos,
  };
  const json = JSON.stringify(data, null, 2);
  const backupFile = new File(Paths.document, 'dailynote-backup.json');
  backupFile.write(json);
  await Sharing.shareAsync(backupFile.uri, {
    mimeType: 'application/json',
    dialogTitle: 'DailyNote 백업',
  });
}

export async function restoreBackup(): Promise<boolean> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
  });

  if (result.canceled || result.assets.length === 0) {
    return false;
  }

  const fileUri = result.assets[0].uri;
  const pickedFile = new File(fileUri);
  const content = await pickedFile.text();
  const data: BackupData = JSON.parse(content);

  if (!Array.isArray(data.daily_notes) || !Array.isArray(data.todos)) {
    throw new Error('잘못된 백업 파일 형식입니다.');
  }

  const db = getDatabase();

  db.runSync('DELETE FROM todos');
  db.runSync('DELETE FROM daily_notes');

  for (const note of data.daily_notes) {
    db.runSync(
      `INSERT INTO daily_notes (id, date, emotion_score, diary_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        note.id,
        note.date,
        note.emotion_score,
        note.diary_text,
        note.created_at,
        note.updated_at,
      ]
    );
  }

  for (const todo of data.todos) {
    db.runSync(
      `INSERT INTO todos (id, date, content, is_completed, display_order, carried_over, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        todo.id,
        todo.date,
        todo.content,
        todo.is_completed,
        todo.display_order,
        todo.carried_over,
        todo.created_at,
      ]
    );
  }

  return true;
}
