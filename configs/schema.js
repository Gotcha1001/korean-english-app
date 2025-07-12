import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  nativeLanguage: text("native_language").notNull().default("ko"),
  targetLanguage: text("target_language").notNull().default("en"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  languageCode: text("language_code").notNull().default("en"),
  topic: text("topic").notNull(),
  level: text("level").notNull(),
  title: text("title").notNull(),
  description: text("description"),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  partOfSpeech: text("part_of_speech").notNull(),
  exampleSentence: text("example_sentence"),
  exampleTranslation: text("example_translation"),
  pronunciation: text("pronunciation").notNull(),
  nativeLanguage: text("native_language").notNull().default("ko"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id),
  completed: boolean("completed").notNull().default(false),
  lastAttempted: timestamp("last_attempted").notNull().defaultNow(),
});
