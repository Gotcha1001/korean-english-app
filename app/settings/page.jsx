// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { db } from "../../configs/db";
// import { Users, Languages } from "../../configs/schema";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { savePreferences } from "../lib/actions";
// import { eq } from "drizzle-orm";

// export default async function SettingsPage() {
//     const user = await currentUser();
//     const userId = user?.id;

//     if (!userId) {
//         return redirect("/sign-in");
//     }

//     // Fetch user's native and target languages
//     const userData = await db.select().from(Users).where(eq(Users.user_id, userId));
//     const nativeLanguage = userData.length > 0 ? userData[0].native_language : "en";
//     const targetLanguage = userData.length > 0 ? userData[0].target_language : "ko";

//     // Fetch all languages from the database
//     const languages = await db.select().from(Languages);

//     // Get query parameters for success/error messages
//     const urlParams = new URLSearchParams();
//     const success = urlParams.get("success");
//     const error = urlParams.get("error");

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-10">
//             <h1 className="text-4xl font-bold mb-8">Language Settings</h1>
//             <div className="max-w-md mx-auto bg-white text-black p-6 rounded-lg shadow-lg">
//                 {success && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                         {success}
//                     </div>
//                 )}
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//                 <form action={savePreferences}>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold mb-2">Native Language</label>
//                         <select
//                             name="nativeLanguage"
//                             defaultValue={nativeLanguage}
//                             className="w-full p-2 border rounded"
//                         >
//                             {languages.map((lang) => (
//                                 <option key={lang.code} value={lang.code}>
//                                     {lang.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold mb-2">Target Language</label>
//                         <select
//                             name="targetLanguage"
//                             defaultValue={targetLanguage}
//                             className="w-full p-2 border rounded"
//                         >
//                             {languages.map((lang) => (
//                                 <option key={lang.code} value={lang.code}>
//                                     {lang.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <Button
//                         type="submit"
//                         className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                     >
//                         Save Preferences
//                     </Button>
//                 </form>
//                 <Link href="/dashboard">
//                     <Button className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
//                         Back to Dashboard
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//     );
// }

// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { db } from "../../configs/db";
// import { Users, Languages } from "../../configs/schema";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { savePreferences } from "../lib/actions";
// import { eq, inArray } from "drizzle-orm"; // Import inArray

// export default async function SettingsPage() {
//     const user = await currentUser();
//     const userId = user?.id;

//     if (!userId) {
//         return redirect("/sign-in");
//     }

//     // Fetch user's target language
//     const userData = await db.select().from(Users).where(eq(Users.user_id, userId));
//     const targetLanguage = userData.length > 0 ? userData[0].target_language : "es";

//     // Fetch supported languages (es, de, ko, fr)
//     const supportedLanguages = ["es", "de", "ko", "fr"];
//     const languages = await db
//         .select()
//         .from(Languages)
//         .where(inArray(Languages.code, supportedLanguages)); // Use inArray instead of eq

//     // Get query parameters for success/error messages
//     const urlParams = new URLSearchParams();
//     const success = urlParams.get("success");
//     const error = urlParams.get("error");

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-10">
//             <h1 className="text-4xl font-bold mb-8">Language Settings</h1>
//             <div className="max-w-md mx-auto bg-white text-black p-6 rounded-lg shadow-lg">
//                 {success && (
//                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                         {success}
//                     </div>
//                 )}
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//                 <form action={savePreferences}>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold mb-2">Native Language</label>
//                         <p className="w-full p-2 border rounded bg-gray-100">English (Fixed)</p>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-lg font-semibold mb-2">Target Language</label>
//                         <select
//                             name="targetLanguage"
//                             defaultValue={targetLanguage}
//                             className="w-full p-2 border rounded"
//                         >
//                             {languages.length > 0 ? (
//                                 languages.map((lang) => (
//                                     <option key={lang.code} value={lang.code}>
//                                         {lang.name}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option disabled>No languages available</option>
//                             )}
//                         </select>
//                     </div>
//                     <Button
//                         type="submit"
//                         className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                     >
//                         Save Preferences
//                     </Button>
//                 </form>
//                 <Link href="/dashboard">
//                     <Button className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
//                         Back to Dashboard
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//     );
// }


import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../../configs/db";
import { Users, Languages } from "../../configs/schema";
import { savePreferences } from "../lib/actions";
import { eq, inArray } from "drizzle-orm";
import SettingsClient from "../components/SettingsClient";

export default async function SettingsPage({ searchParams }) {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        return redirect("/sign-in");
    }

    // Fetch user's target language
    const userData = await db.select().from(Users).where(eq(Users.user_id, userId));
    const targetLanguage = userData.length > 0 ? userData[0].target_language : "es";

    // Fetch supported languages (es, de, ko, fr, it, ja)
    const supportedLanguages = ["es", "de", "ko", "fr", "it", "ja"]; // Added "it" and "ja"
    const languages = await db
        .select()
        .from(Languages)
        .where(inArray(Languages.code, supportedLanguages));

    // Get query parameters for success/error messages
    const success = searchParams?.success;
    const error = searchParams?.error;

    return (
        <SettingsClient
            targetLanguage={targetLanguage}
            languages={languages}
            success={success}
            error={error}
            savePreferences={savePreferences}
        />
    );
}