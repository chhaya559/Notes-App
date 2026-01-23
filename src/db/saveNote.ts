import { db } from "./notes";
import { notesTable } from "./schema";

export async function saveNote({
  title,
  body,
  isLocked,
  reminder,
}: {
  title: string | null;
  body: string | null;
  isLocked: boolean;
  reminder: string | null;
}) {
  await db.insert(notesTable).values({
    title,
    body,
    isLocked: isLocked ?? false,
    reminder: reminder ?? null,
    createdAt: new Date().toString(),
  });
}
