import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export type SyncStatus = "pending" | "synced" | "pending_delete";
export const notesTable = sqliteTable("notes_table", {
  id: text("id").primaryKey(),
  userId: text().notNull(),
  title: text("title"),
  content: text("content"),
  updatedAt: text(),
  isPasswordProtected: int("isPasswordProtected").default(0),
  isReminderSet: int("isReminderSet").default(0),
  //  reminder: int("reminder").default(0),
  isLocked: int("isLocked").default(0),
  backgroundColor: text(),
  syncStatus: text("syncStatus")
    .$type<SyncStatus>()
    .notNull()
    .default("pending"),
  filePaths: text("filePaths"),
  isDeleted: int("isDeleted").default(0),
});
