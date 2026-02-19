/**
 * One-time script: Export all database data to Excel
 * Run: node scripts/export-database-to-excel.js
 * Requires: .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js")
  const XLSX = await import("xlsx")

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const workbook = XLSX.utils.book_new()

  const tables = [
    "profiles",
    "time_entries",
    "additional_survey_responses",
    "burnout_survey_responses",
    "contact_submissions",
    "admin_activities",
    "telemetry_events",
    "institutions",
    "activities",
    "activity_categories",
  ]

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*")

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        console.log(`Skipping ${table} (table not found)`)
        continue
      }
      console.error(`Error fetching ${table}:`, error.message)
      continue
    }

    const rows = (data || []).map((row) => {
      const out = {}
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) out[k] = null
        else if (typeof v === "object" && !Array.isArray(v) && !(v instanceof Date))
          out[k] = JSON.stringify(v)
        else if (v instanceof Date) out[k] = v.toISOString()
        else out[k] = v
      }
      return out
    })

    if (rows.length === 0) {
      rows.push({ "(empty)": "No data" })
    }

    const sheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, sheet, table.slice(0, 31))
    console.log(`Exported ${table}: ${data?.length || 0} rows`)
  }

  const date = new Date().toISOString().split("T")[0]
  const filename = `SPARC_Database_Export_${date}.xlsx`
  const outPath = path.join(__dirname, "..", filename)
  XLSX.writeFile(workbook, outPath)
  console.log(`\nSaved: ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
