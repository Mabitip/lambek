import { Pool } from "pg";
import "dotenv/config";
import { getConnectionString } from "../lib/db/connection";

async function main() {
  const pool = new Pool({ connectionString: getConnectionString() });
  
  console.log("Adding missing unique constraints if not present...");
  
  const queries = [
    `CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "JournalCategory_slug_key" ON "JournalCategory"("slug");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "JournalPost_slug_key" ON "JournalPost"("slug");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "JournalTag_slug_key" ON "JournalTag"("slug");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "JournalPostTag_postId_tagId_key" ON "JournalPostTag"("postId", "tagId");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "CoffeeLot_lotId_key" ON "CoffeeLot"("lotId");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "CoffeeProfile_coffeeId_key" ON "CoffeeProfile"("coffeeId");`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");`,
  ];

  for (const q of queries) {
    try {
      await pool.query(q);
      console.log("Executed:", q);
    } catch (e: any) {
      console.error("Error executing query:", q, e.message);
    }
  }

  await pool.end();
  console.log("Indexes checked/created successfully.");
}

main().catch(console.error);
