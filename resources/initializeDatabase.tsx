import { SQLiteDatabase } from "expo-sqlite";

export const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT,
        user TEXT,
        time TEXT,
        header TEXT,
        body TEXT,
        image TEXT
      );
      `
    );
  } catch (error) {
    console.error('Could not create table stories', error);
  }
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        password TEXT
      );
      `
    );
  } catch (error) {
    console.error('Could not create table users',error);
  }
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS activeuser (
        name TEXT
      );
      `
    );
  } catch (error) {
    console.error('Could not create table activeuser', error);
  }
}