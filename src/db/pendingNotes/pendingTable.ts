import { pendingDB, sqlite } from "../notes";

export async function createPendingTable() {
  // await sqlite.execAsync(`
  //   DROP TABLE IF EXISTS pending_notes;
  // `);

  await sqlite.execAsync(`
    CREATE TABLE IF NOT EXISTS pending_notes (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT,
      content TEXT,
      updatedAt TEXT,
      syncStatus INTEGER DEFAULT 1,
      filePaths TEXT
    );
  `);
}
console.log("pending notes DB table created");
