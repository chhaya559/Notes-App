import { db } from "./notes";

export async function createTable() {
  await db.run(
    `
        CREATE TABLE IF NOT EXISTS notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT
        title TEXT NOT NULL,
      body TEXT NOT NULL,
      is_locked INTEGER DEFAULT 0,
      reminder TEXT,
      created_at TEXT NOT NULL
      );,
  `,
  );
}
