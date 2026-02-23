import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export type SyncStatus = 1 | 2 | 3;
export const pendingNotes = sqliteTable("pending_notes", {
  id: text("id").primaryKey(),
  userId: text().notNull(),
  title: text("title"),
  content: text("content"),
  updatedAt: text(),
  syncStatus: int("syncStatus").$type<SyncStatus>().notNull().default(1),
  filePaths: text("filePaths"),
});
