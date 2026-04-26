/**
 * Create analysis views for BI/export workflows.
 * Run: node scripts/run-analysis-views-migration.js
 */

const fs = require("fs")
const path = require("path")

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const env = fs.readFileSync(filePath, "utf8")
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^["']|["']$/g, "")
      process.env[key] = val
    }
  })
}

loadDotEnv(path.join(__dirname, "..", ".env.local"))

let DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.DIRECT_URL

const dbPassword = process.env.DB_PASSWORD || process.env.SUPABASE_PASSWORD

if (!DATABASE_URL && dbPassword && process.env.NEXT_PUBLIC_SUPABASE_URL) {
  const match = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)
  const projectRef = match ? match[1] : ""
  if (projectRef) {
    DATABASE_URL = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`
  }
}

if (!DATABASE_URL) {
  console.error("Missing database connection. Set DATABASE_URL or SUPABASE_PASSWORD with NEXT_PUBLIC_SUPABASE_URL.")
  process.exit(1)
}

async function main() {
  const { Client } = await import("pg")
  const sqlPath = path.join(__dirname, "..", "database", "add-analysis-views.sql")
  const sql = fs.readFileSync(sqlPath, "utf8")
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    await client.query(sql)
    console.log("OK: analysis views created or replaced.")
  } catch (err) {
    console.error("Migration failed:", err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
