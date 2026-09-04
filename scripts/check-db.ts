import { Pool } from "pg";
import "dotenv/config";
import { getConnectionString } from "../lib/db/connection";

async function main() {
  const pool = new Pool({ connectionString: getConnectionString() });
  const res = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;`
  );
  console.log("Tables in database:", res.rows.map((r) => r.table_name));
  await pool.end();
}

main().catch(console.error);
