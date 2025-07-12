import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DRIZZLE_DATABASE_URL);

async function dropTables() {
  try {
    console.log("Dropping tables...");
    await sql`DROP TABLE IF EXISTS user_progress CASCADE;`;
    await sql`DROP TABLE IF EXISTS words CASCADE;`;
    await sql`DROP TABLE IF EXISTS lessons CASCADE;`;
    await sql`DROP TABLE IF EXISTS levels CASCADE;`;
    await sql`DROP TABLE IF EXISTS languages CASCADE;`;
    console.log("Tables dropped successfully!");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
}

dropTables().then(() => process.exit(0));
