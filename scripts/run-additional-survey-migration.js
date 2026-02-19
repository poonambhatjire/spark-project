/**
 * Run the additional_survey_responses table migration
 * 
 * Requires: DATABASE_URL in .env.local (direct Postgres connection string from Supabase)
 * Get it from: Supabase Dashboard > Project Settings > Database > Connection string > URI
 * 
 * Run: node scripts/run-additional-survey-migration.js
 */

const fs = require("fs")
const path = require("path")

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8")
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, "")
      process.env[key] = val
    }
  })
}

let DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.DIRECT_URL

// Build from Supabase URL + DB_PASSWORD if available
if (!DATABASE_URL && process.env.DB_PASSWORD && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const match = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)
  const projectRef = match ? match[1] : "vhlnnzeepjuzjezsisss"
  DATABASE_URL = `postgresql://postgres:${encodeURIComponent(process.env.DB_PASSWORD)}@db.${projectRef}.supabase.co:5432/postgres`
}

if (!DATABASE_URL) {
  console.error(`
Missing database connection.

Option A - Add to .env.local:
   DB_PASSWORD=your_database_password

   (Uses NEXT_PUBLIC_SUPABASE_URL from .env.local to build the connection)

Option B - Add full connection string to .env.local:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

Get your database password from: Supabase Dashboard > Project Settings > Database
`)
  process.exit(1)
}

async function main() {
  const { Client } = await import("pg")
  const sqlPath = path.join(__dirname, "..", "database", "add-additional-survey-table.sql")
  const sql = fs.readFileSync(sqlPath, "utf8")

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log("Connected to database. Running migration...")
    await client.query(sql)
    console.log("Migration completed successfully. Table 'additional_survey_responses' created.")
  } catch (err) {
    console.error("Migration failed:", err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
