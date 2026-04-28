import * as SQLite from 'expo-sqlite';

const DB_NAME = 'dailynote.db';
const CURRENT_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Returns the singleton database instance.
 * Call initializeDatabase() before first use.
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
  }
  return db;
}

/**
 * Initializes the database: enables WAL mode, creates tables/indexes,
 * and runs any pending migrations.
 */
export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();

  // Enable WAL mode for better concurrent read performance
  await database.execAsync('PRAGMA journal_mode = WAL;');

  const result = await database.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version;'
  );
  const currentVersion = result!.user_version;

  if (currentVersion < 1) {
    await migrateToV1(database);
  }

  // Future migrations:
  // if (currentVersion < 2) { await migrateToV2(database); }

  await database.execAsync(`PRAGMA user_version = ${CURRENT_VERSION};`);
}

/**
 * Migration v0 -> v1: Create initial tables and indexes.
 */
async function migrateToV1(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_notes (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      date          TEXT    NOT NULL UNIQUE,
      emotion_score INTEGER CHECK (emotion_score BETWEEN 1 AND 5),
      diary_text    TEXT    DEFAULT '',
      created_at    TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS todos (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      date          TEXT    NOT NULL,
      content       TEXT    NOT NULL,
      is_completed  INTEGER NOT NULL DEFAULT 0 CHECK (is_completed IN (0, 1)),
      display_order INTEGER NOT NULL DEFAULT 0,
      carried_over  INTEGER NOT NULL DEFAULT 0 CHECK (carried_over IN (0, 1)),
      created_at    TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE INDEX IF NOT EXISTS idx_daily_notes_date ON daily_notes (date);
    CREATE INDEX IF NOT EXISTS idx_todos_date ON todos (date);
    CREATE INDEX IF NOT EXISTS idx_todos_date_order ON todos (date, display_order);
    CREATE INDEX IF NOT EXISTS idx_todos_incomplete ON todos (date, is_completed) WHERE is_completed = 0;
  `);
}
