"use server";

import { db } from "../../configs/db";
import { Users } from "../../configs/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// ... existing imports ...

export async function savePreferences(formData) {
  const user = await currentUser();
  if (!user) {
    console.error("savePreferences: No user found, redirecting to sign-in");
    redirect("/sign-in?redirect_url=/settings");
  }

  const userId = user.id;
  const targetLanguage = formData.get("targetLanguage");

  // Validate target language
  const supportedLanguages = ["es", "de", "ko", "fr", "it", "ja"]; // Added "it" and "ja"
  if (!supportedLanguages.includes(targetLanguage)) {
    redirect("/settings?error=Invalid+target+language");
  }

  try {
    console.log("savePreferences: Processing for user", {
      userId,
      targetLanguage,
    });

    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.user_id, userId));

    if (existingUser.length > 0) {
      await db
        .update(Users)
        .set({
          native_language: "en", // Ensure native_language is always English
          target_language: targetLanguage,
        })
        .where(eq(Users.user_id, userId));
    } else {
      await db.insert(Users).values({
        user_id: userId,
        native_language: "en", // Fixed to English
        target_language: targetLanguage,
      });
    }

    console.log("savePreferences: Success");
  } catch (err) {
    console.error("savePreferences: Error saving preferences", {
      error: err.message,
      stack: err.stack,
      userId,
      targetLanguage,
    });
    redirect("/settings?error=Failed+to+save+preferences");
  }

  redirect("/dashboard?refresh=true");
}
