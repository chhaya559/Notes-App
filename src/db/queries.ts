import { db } from "./notes";
import { notesTable } from "./schema";
import { desc, eq, sql } from "drizzle-orm";

export async function getLocalNotesPaginated(userId: string, page: number) {
  const limit = 10;
  const offset = (page - 1) * limit;

  return await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.userId, userId))
    .orderBy(desc(notesTable.updatedAt))
    .limit(limit)
    .offset(offset);
}
