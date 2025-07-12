// Seed.js
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { lessons, words } from "../configs/schema.js";
import { languageDataBeginner } from "../data/englishBeginner.js";
import { languageDataIntermediate } from "../data/englishIntermediate.js";
import { languageDataAdvanced } from "../data/englishAdvanced.js";

const sql = neon(process.env.DRIZZLE_DATABASE_URL);
const db = drizzle(sql, {
  schema: { lessons, words },
});

async function seedDatabase() {
  try {
    console.log("데이터베이스 시딩 시작...");

    // Combine all levels
    const allLevels = [
      languageDataBeginner.level,
      languageDataIntermediate.level,
      languageDataAdvanced.level,
    ];

    // Seed Lessons
    const lessonMap = {};
    for (const level of allLevels) {
      console.log(
        `레벨 시딩: ${languageDataBeginner.name}의 ${level.level_name}`
      );
      for (const lesson of level.lessons) {
        console.log(`레슨 시딩: ${level.level_name}의 ${lesson.lesson_name}`);
        const existingLessons = await db.select().from(lessons);
        let lessonId;
        if (
          !existingLessons.some(
            (l) =>
              l.topic === lesson.context &&
              l.title === lesson.lesson_name &&
              l.languageCode === languageDataBeginner.code &&
              l.level === level.level_name
          )
        ) {
          const [insertedLesson] = await db
            .insert(lessons)
            .values({
              languageCode: languageDataBeginner.code, // 'en'
              topic: lesson.context,
              level: level.level_name,
              title: lesson.lesson_name,
              description: `Learn ${lesson.context} vocabulary in English for ${level.level_name} level`,
            })
            .returning({
              id: lessons.id,
              title: lessons.title,
            });
          lessonId = insertedLesson.id;
          console.log(
            `삽입된 레슨: ${insertedLesson.title} (ID: ${insertedLesson.id})`
          );
        } else {
          const existing = existingLessons.find(
            (l) =>
              l.topic === lesson.context &&
              l.title === lesson.lesson_name &&
              l.languageCode === languageDataBeginner.code &&
              l.level === level.level_name
          );
          lessonId = existing.id;
          console.log(
            `이미 존재하는 레슨: ${lesson.lesson_name} (ID: ${existing.id})`
          );
        }
        lessonMap[`${level.level_name}-${lesson.lesson_name}`] = lessonId;

        // Seed Words
        console.log(`레슨의 단어 시딩: ${lesson.lesson_name}`);
        const existingWords = await db.select().from(words);
        const wordsToInsert = lesson.words
          .filter(
            (word) =>
              !existingWords.some(
                (w) => w.lessonId === lessonId && w.word === word.word
              )
          )
          .map((word) => ({
            lessonId: lessonId,
            word: word.word,
            translation: word.translation,
            partOfSpeech: word.partOfSpeech || "noun",
            exampleSentence: word.exampleSentence || "",
            exampleTranslation: word.exampleTranslation || "",
            pronunciation: word.pronunciation,
            nativeLanguage: word.native_language || "ko",
          }));

        if (wordsToInsert.length > 0) {
          await db.insert(words).values(wordsToInsert);
          console.log(
            `${lesson.lesson_name}에 ${wordsToInsert.length}개의 단어 삽입`
          );
        } else {
          console.log(`${lesson.lesson_name}에 삽입할 새 단어 없음`);
        }
      }
    }

    console.log("데이터베이스 시딩 성공!");
  } catch (error) {
    console.error("데이터베이스 시딩 오류:", error);
    throw error;
  }
}

seedDatabase().then(() => process.exit(0));
