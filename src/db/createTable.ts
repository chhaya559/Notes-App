import { sqlite } from "./notes";

export async function createTable() {
  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS notes_table (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT,
      content TEXT,
      updatedAt TEXT NOT NULL,
      isPasswordProtected INTEGER,
      reminder TEXT,
      syncStatus TEXT,
      backgroundColor TEXT
    );
  `);
}
