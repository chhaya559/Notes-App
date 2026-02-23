import { pendingDB } from "../notes";

export async function createPendingTable() {
  // await pendingDB.execAsync(`
  //   DROP TABLE IF EXISTS pending_notes;
  // `);

  await pendingDB.execAsync(`
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
