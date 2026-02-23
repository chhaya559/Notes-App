import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

export const sqlite = SQLite.openDatabaseSync("notes.db");
export const pendingDB = SQLite.openDatabaseSync("pendingNotes.db");
export const db = drizzle(sqlite);
export const pendingDb = drizzle(pendingDB);
