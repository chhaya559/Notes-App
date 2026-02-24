import { sqlite } from "./notes";

export async function createTable() {
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS notes_table (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT,
      content TEXT,
      updatedAt TEXT,
      isPasswordProtected INTEGER DEFAULT 0,
      isReminderSet INTEGER DEFAULT 0,
      syncStatus TEXT DEFAULT 'synced',
      backgroundColor TEXT,
      filePaths TEXT,
      isLocked INTEGER DEFAULT 0,
      isDeleted INTEGER DEFAULT 0
    );
  `);
}
