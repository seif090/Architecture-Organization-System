import { initDb, pool } from "../src/db";

async function main() {
  await initDb();

  const result = await pool.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name IN ('users', 'clients', 'projects', 'inventory_items', 'financial_records', 'properties')
     ORDER BY table_name`
  );

  console.log("Migration finished. Verified tables:");
  console.table(result.rows);
}

main()
  .catch((error) => {
    console.error("Migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
