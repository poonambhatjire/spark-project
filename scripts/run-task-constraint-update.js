/**
 * Update time_entries_task_check constraint to include Work Interruptions
 * Run: node scripts/run-task-constraint-update.js
 */

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
}

const dbPassword = process.env.DB_PASSWORD || process.env.SUPABASE_PASSWORD;
let DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.DIRECT_URL;
if (!DATABASE_URL && dbPassword && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const match = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match) {
    DATABASE_URL = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${match[1]}.supabase.co:5432/postgres`;
  }
}

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL or DB_PASSWORD in .env.local");
  process.exit(1);
}

async function main() {
  const { Client } = await import("pg");
  const sqlPath = path.join(__dirname, "..", "database", "update-task-constraint-add-work-interruptions.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Updating time_entries_task_check constraint...");
    await client.query(sql);
    console.log("Constraint updated. New task type is now allowed.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
