import { NextResponse } from "next/server";
import { db } from "../../../configs/db"; // Updated to match your db import path
import { UserProgress } from "../../../configs/schema";
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
      .from(UserProgress)
      .where(
        and(
          eq(UserProgress.user_id, userId),
          eq(UserProgress.lesson_id, lessonId)
        )
      );

    if (existingProgress.length > 0) {
      // Update existing progress
      await db
        .update(UserProgress)
        .set({
          completed,
          last_attempted: new Date(), // Update timestamp for consistency
        })
        .where(
          and(
            eq(UserProgress.user_id, userId),
            eq(UserProgress.lesson_id, lessonId)
          )
        );
    } else {
      // Insert new progress
      await db.insert(UserProgress).values({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        last_attempted: new Date(),
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
