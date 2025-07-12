"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "../../configs/db";
import { userProgress } from "../../configs/schema";
import { eq, and } from "drizzle-orm";

export async function saveProgress(lessonId, completed) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("인증되지 않음");
    }

    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.lessonId, lessonId)
        )
      );

    if (existingProgress.length > 0) {
      await db
        .update(userProgress)
        .set({
          completed,
          lastAttempted: new Date(),
        })
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.lessonId, lessonId)
          )
        );
    } else {
      await db.insert(userProgress).values({
        userId: userId,
        lessonId: lessonId,
        completed,
        lastAttempted: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("진행 상황 저장 오류:", error);
    if (error.message === "인증되지 않음") {
      throw new Error("인증에 실패했습니다. 다시 로그인해 주세요.");
    }
    throw new Error("서버 오류입니다. 나중에 다시 시도해 주세요.");
  }
}
