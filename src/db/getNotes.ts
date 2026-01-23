import { desc } from "drizzle-orm";
import { db } from "./notes";
import { notesTable } from "./schema";

export async function getNotes() {
  return await db.select().from(notesTable).orderBy(desc(notesTable.createdAt));
}
