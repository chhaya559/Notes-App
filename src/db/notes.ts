import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

export const sqlite = SQLite.openDatabaseSync("notes.db");

export const db = drizzle(sqlite);
