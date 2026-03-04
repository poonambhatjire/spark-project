/**
 * Run the ended_at column migration on time_entries
 *
 * Requires: DATABASE_URL or DB_PASSWORD in .env.local
 * Run: node scripts/run-ended-at-migration.js
 */

const fs = require("fs")
const path = require("path")

const envPath = path.join(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "")
  })
}

let DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.DIRECT_URL

const dbPassword = process.env.DB_PASSWORD || process.env.SUPABASE_PASSWORD
if (!DATABASE_URL && dbPassword && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const match = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)
  const projectRef = match ? match[1] : null
  if (projectRef) {
    DATABASE_URL = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`
  }
}

if (!DATABASE_URL) {
  console.error(`
Missing DATABASE_URL or DB_PASSWORD in .env.local.
Get connection string from: Supabase Dashboard > Project Settings > Database
`)
  process.exit(1)
}

async function main() {
  const { Client } = await import("pg")
  const sqlPath = path.join(__dirname, "..", "database", "add-ended-at-column.sql")
  const sql = fs.readFileSync(sqlPath, "utf8")

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log("Running ended_at migration...")
    await client.query(sql)
    console.log("Migration completed. Column 'ended_at' added to time_entries.")
  } catch (err) {
    console.error("Migration failed:", err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
