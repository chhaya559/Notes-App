import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const sqlite = SQLite.openDatabaseSync("notes.db");

export const db = drizzle(sqlite);
