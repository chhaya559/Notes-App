import { eq } from "drizzle-orm";
import { db } from "./notes";
import { notesTable } from "./schema";
export const Storage = {
  removeItem: async (key: string) => {
    await db.delete(notesTable).where(eq(notesTable.key, key));
  },
  getItem: async (key: string) => {
    const result = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.key, key));
    return result.length > 0 ? result : null;
  },
  setItem: async (key: string, value: string) => {
    const data = JSON.parse(value);
    await db
      .insert(notesTable)
      .values({
        id: data.id,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
        isLocked: data.isLocked,
        reminder: data.reminder,
        syncStatus: data.syncStatus,
      })
      .onConflictDoUpdate({
        target: notesTable.id,
        set: {
          title: data.title,
          content: data.content,
          createdAt: data.createdAt,
          isLocked: data.isLocked,
          reminder: data.reminder,
          syncStatus: data.syncStatus,
        },
      });
  },
};
