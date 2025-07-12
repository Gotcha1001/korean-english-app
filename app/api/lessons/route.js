// Lessons route.js
import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { words as wordsTable, lessons } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { sentenceMappingsBeginner } from "../../../data/sentenceMappingsBeginner";
import { sentenceMappingsIntermediate } from "../../../data/sentenceMappingsIntermediate";
import { sentenceMappingsAdvanced } from "../../../data/sentenceMappingsAdvanced";

export async function POST(request) {
  try {
    const { lessonId, context } = await request.json();
    console.log("Received request:", { lessonId, context });

    if (!lessonId || !context) {
      return NextResponse.json(
        { error: "필수 매개변수가 누락되었습니다" },
        { status: 400 }
      );
    }

    // Fetch lesson details to determine the level
    const lesson = await db
      .select({
        id: lessons.id,
        level: lessons.level,
      })
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    console.log("Fetched lesson:", lesson);

    if (lesson.length === 0) {
      return NextResponse.json(
        { error: `ID ${lessonId}에 해당하는 레슨을 찾을 수 없습니다` },
        { status: 404 }
      );
    }

    const lessonLevel = lesson[0].level;

    // Select the appropriate sentence mappings based on level
    let sentenceMappings;
    switch (lessonLevel) {
      case "Beginner":
        sentenceMappings = sentenceMappingsBeginner;
        break;
      case "Intermediate":
        sentenceMappings = sentenceMappingsIntermediate;
        break;
      case "Advanced":
        sentenceMappings = sentenceMappingsAdvanced;
        break;
      default:
        console.warn(`Unknown level: ${lessonLevel}, falling back to Beginner`);
        sentenceMappings = sentenceMappingsBeginner;
    }

    // Fetch words from the database
    const wordsData = await db
      .select({
        word: wordsTable.word,
        translation: wordsTable.translation,
        pronunciation: wordsTable.pronunciation,
      })
      .from(wordsTable)
      .where(eq(wordsTable.lessonId, lessonId));

    console.log("Fetched words:", wordsData);

    if (wordsData.length === 0) {
      return NextResponse.json(
        { error: `레슨 ID ${lessonId}에 대한 단어를 찾을 수 없습니다` },
        { status: 404 }
      );
    }

    // Generate translation quiz (Korean to English)
    const translationQuiz = wordsData
      .slice(0, Math.min(3, wordsData.length))
      .map((word) => {
        const options = generateOptions(word.word, wordsData, true);
        return {
          question: `'${word.translation}'의 영어 뜻은 무엇인가요?`,
          options,
          correctAnswer: word.word,
        };
      });

    // Generate fill-in-the-blank quiz with sentence-to-word mapping
    const fillInTheBlankQuiz = generateFillInTheBlankQuiz(
      wordsData,
      context,
      sentenceMappings
    );

    const content = {
      words: wordsData,
      translationQuiz,
      fillInTheBlankQuiz,
      speechLang: "en-US",
    };

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("레슨 콘텐츠 가져오기 오류:", error);
    return NextResponse.json(
      { error: "레슨 콘텐츠를 가져오지 못했습니다" },
      { status: 500 }
    );
  }
}

function generateFillInTheBlankQuiz(words, context, sentenceMappings) {
  const mappings = sentenceMappings["en"]?.[context] || [
    {
      sentence: `I need a _____ for ${context}.`,
      word: words[0]?.word || "unknown",
      translation: words[0]?.translation || "unknown",
    },
  ];

  const validMappings = mappings.filter(({ word }) =>
    words.some((w) => w.word === word)
  );

  if (!validMappings.length) {
    console.warn(`No valid mappings found for context: ${context}`);
    return [];
  }

  const shuffledMappings = validMappings
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(3, validMappings.length));

  return shuffledMappings.map(({ sentence, word, translation }) => {
    const options = generateOptions(word, words, false);
    return {
      question: sentence,
      options,
      correctAnswer: word,
    };
  });
}

function generateOptions(correctAnswer, words, isTranslationQuiz) {
  const field = isTranslationQuiz ? "word" : "word";
  const correctWord = words.find((w) => w.word === correctAnswer);

  if (!correctWord) {
    console.warn(
      `generateOptions - No correct word found for: ${correctAnswer}, returning default options`
    );
    return [correctAnswer, "Option 1", "Option 2", "Option 3"];
  }

  const options = words
    .filter((w) => w && w.word !== undefined)
    .map((w) => w.word);

  if (!options.includes(correctAnswer)) {
    console.warn(
      `Correct answer was not in options, adding it: ${correctAnswer}`
    );
    options.push(correctAnswer);
  }

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options.slice(0, 4);
}
