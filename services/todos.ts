import { getDatabase } from '@/services/database';
import type { Todo, CompletionStat } from '@/types';

/**
 * List all todos for a given date, ordered by display_order.
 */
export function listByDate(date: string): Todo[] {
  const db = getDatabase();
  return db.getAllSync<Todo>(
    'SELECT * FROM todos WHERE date = ? ORDER BY display_order ASC',
    [date]
  );
}

/**
 * Create a new todo for the given date.
 * Automatically assigns the next display_order.
 */
export function create(date: string, content: string): Todo {
  const db = getDatabase();

  const row = db.getFirstSync<{ maxOrder: number | null }>(
    'SELECT MAX(display_order) as maxOrder FROM todos WHERE date = ?',
    [date]
  );
  const nextOrder = (row?.maxOrder ?? -1) + 1;

  const result = db.runSync(
    'INSERT INTO todos (date, content, display_order) VALUES (?, ?, ?)',
    [date, content, nextOrder]
  );

  return db.getFirstSync<Todo>(
    'SELECT * FROM todos WHERE id = ?',
    [result.lastInsertRowId]
  )!;
}

/**
 * Toggle the is_completed flag for a todo.
 */
export function toggleComplete(id: number): void {
  const db = getDatabase();
  db.runSync(
    'UPDATE todos SET is_completed = CASE WHEN is_completed = 0 THEN 1 ELSE 0 END WHERE id = ?',
    [id]
  );
}

/**
 * Delete a todo by id.
 */
export function deleteTodo(id: number): void {
  const db = getDatabase();
  db.runSync('DELETE FROM todos WHERE id = ?', [id]);
}

/**
 * Reorder todos by updating display_order based on array index.
 */
export function reorder(todoIds: number[]): void {
  const db = getDatabase();
  for (let i = 0; i < todoIds.length; i++) {
    db.runSync(
      'UPDATE todos SET display_order = ? WHERE id = ?',
      [i, todoIds[i]]
    );
  }
}

/**
 * Carry over incomplete todos from one date to another.
 * Skips todos that have already been carried over (prevents duplicates).
 */
export function carryOver(fromDate: string, toDate: string): void {
  const db = getDatabase();
  db.runSync(
    `INSERT INTO todos (date, content, is_completed, display_order, carried_over)
     SELECT ?, content, 0, display_order, 1
     FROM todos
     WHERE date = ? AND is_completed = 0
     AND content NOT IN (SELECT content FROM todos WHERE date = ? AND carried_over = 1)`,
    [toDate, fromDate, toDate]
  );
}

/**
 * Get completion statistics for a date range.
 */
export function getCompletionStats(startDate: string, endDate: string): CompletionStat[] {
  const db = getDatabase();
  return db.getAllSync<CompletionStat>(
    `SELECT date, COUNT(*) as total, SUM(is_completed) as completed,
            ROUND(CAST(SUM(is_completed) AS FLOAT) / COUNT(*) * 100, 1) as completion_rate
     FROM todos WHERE date BETWEEN ? AND ? GROUP BY date ORDER BY date ASC`,
    [startDate, endDate]
  );
}

/**
 * Export all todos ordered by date and display_order.
 */
export function exportAll(): Todo[] {
  const db = getDatabase();
  return db.getAllSync<Todo>('SELECT * FROM todos ORDER BY date, display_order');
}
