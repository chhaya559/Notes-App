import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export type SyncStatus = "pending" | "synced";
export const notesTable = sqliteTable("notes_table", {
  id: text("id").primaryKey(),
  userId: text(),
  title: text("title"),
  content: text("content"),
  updatedAt: text(),
  isPasswordProtected: int("isPasswordProtected").default(0),
  isReminderSet: int("isReminderSet").default(0),
  reminder: text("reminder"),
  backgroundColor: text(),
  syncStatus: text("syncStatus")
    .$type<SyncStatus>()
    .notNull()
    .default("pending"),
});
