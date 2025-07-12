// Dashboard page.jsx
import { db } from "../../configs/db";
import { lessons, userProgress } from "../../configs/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";
import LessonCard from "../components/LessonCard";

export default async function Dashboard() {
    const { userId } = await auth();
    console.log("대시보드 - 사용자 ID:", userId);

    if (!userId) {
        return redirect("/sign-in");
    }

    // Set fixed languages for Korean users learning English
    const nativeLanguage = "ko";
    const targetLanguage = "en";

    // Fetch lessons for English
    const lessonsData = await db
        .select({
            id: lessons.id,
            languageCode: lessons.languageCode,
            topic: lessons.topic,
            level: lessons.level,
            title: lessons.title,
            description: lessons.description,
        })
        .from(lessons)
        .where(eq(lessons.languageCode, targetLanguage))
        .orderBy(lessons.level); // Ensure levels are ordered (Beginner, Intermediate, Advanced)

    // Group lessons by level
    const levels = [
        ...new Set(lessonsData.map((lesson) => lesson.level)),
    ].map((level) => ({
        level_name: level,
        lessons: lessonsData.filter((lesson) => lesson.level === level),
    }));

    // Sort levels by level_order (Beginner: 1, Intermediate: 2, Advanced: 3)
    levels.sort((a, b) => {
        const orderMap = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return orderMap[a.level_name] - orderMap[b.level_name];
    });

    // Fetch user progress
    let progress = [];
    try {
        progress = await db
            .select()
            .from(userProgress)
            .where(eq(userProgress.userId, userId));
    } catch (error) {
        console.error("사용자 진행 상황 가져오기 오류:", error);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">영어 학습 대시보드</h1>
            </div>

            {levels.map((level) => (
                <div key={level.level_name} className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                        {level.level_name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {level.lessons.map((lesson) => (
                            <div key={lesson.id} className="relative">
                                <LessonCard
                                    lesson={lesson}
                                    languageCode={targetLanguage}
                                    nativeLanguage={nativeLanguage}
                                />
                                {progress.some((p) => p.lessonId === lesson.id && p.completed) && (
                                    <span className="absolute top-2 right-2 text-green-400">✅ 완료됨</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}