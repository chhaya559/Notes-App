import { eq } from "drizzle-orm";
import { db } from "./notes";
import { notesTable } from "./schema";
export const Storage = {
  removeItem: async (key: string) => {
    await db.delete(notesTable).where(eq(notesTable.id, key));
  },
  getItem: async (key: string) => {
    const result = await db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, key));
    return result.length > 0 ? result : null;
  },
  setItem: async (key: string, value: any) => {
    try {
      const data = JSON.parse(value);
      await db
        .insert(notesTable)
        .values({
          id: key,
          userId: data.userId,
          title: data.title,
          content: data.content,
          updatedAt: data.updatedAt || new Date().toISOString(),
          isPasswordProtected: data.isPasswordProtected ? 1 : 0,
          reminder: data.reminder || null,
          syncStatus: data.syncStatus,
        })
        .onConflictDoUpdate({
          target: notesTable.id,
          set: {
            title: data.title,
            content: data.content,
            updatedAt: data.updatedAt || new Date().toISOString(),
            isPasswordProtected: data.isPasswordProtected ? 1 : 0,
            reminder: data.reminder || null,
            syncStatus: data.syncStatus ?? "pending",
          },
        });
    } catch (error) {
      console.log("error saving data", error);
    }
  },
};
