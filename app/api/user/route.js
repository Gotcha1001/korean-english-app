import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { userProgress } from "../../../configs/schema"; // Use camelCase to match schema export
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "인증되지 않음" }, { status: 401 });
    }

    const { lessonId, completed } = await request.json();

    if (!lessonId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "누락되었거나 잘못된 매개변수" },
        { status: 400 }
      );
    }

    // Check if progress already exists
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
      // Update existing progress
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
      // Insert new progress
      await db.insert(userProgress).values({
        userId: userId,
        lessonId: lessonId,
        completed,
        lastAttempted: new Date(),
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("진행 상황 업데이트 오류:", error);
    return NextResponse.json(
      { error: "진행 상황 업데이트 실패" },
      { status: 500 }
    );
  }
}
