import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";

export const notesTable = sqliteTable("notes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text(),
  title: text(),
  content: text(),
  createdAt: text().notNull(),
  isLocked: int({ mode: "boolean" }).default(false),
  reminder: text(),
  syncStatus: text(),
});
