/**
 * Create full database backup (Excel + JSON)
 * Run: node scripts/backup-database.js
 */

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLES = [
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
];

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const XLSX = await import("xlsx");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupDir = path.join(__dirname, "..", "database", "backups", timestamp);
  fs.mkdirSync(backupDir, { recursive: true });

  console.log(`Backup started: ${timestamp}\n`);

  const workbook = XLSX.utils.book_new();
  const summary = { timestamp, tables: {} };

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.log(`  ${table}: ERROR - ${error.message}`);
      summary.tables[table] = { error: error.message };
      continue;
    }

    const rows = data || [];
    console.log(`  ${table}: ${rows.length} rows`);

    // Excel sheet
    const sheetRows = rows.map((row) => {
      const out = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) out[k] = null;
        else if (typeof v === "object" && !Array.isArray(v) && !(v instanceof Date))
          out[k] = JSON.stringify(v);
        else if (v instanceof Date) out[k] = v.toISOString();
        else out[k] = v;
      }
      return out;
    });
    if (sheetRows.length === 0) sheetRows.push({ "(empty)": "No data" });
    const sheet = XLSX.utils.json_to_sheet(sheetRows);
    XLSX.utils.book_append_sheet(workbook, sheet, table.slice(0, 31));

    // JSON per table
    fs.writeFileSync(
      path.join(backupDir, `${table}.json`),
      JSON.stringify(rows, null, 0),
      "utf8"
    );

    summary.tables[table] = { rows: rows.length };
  }

  XLSX.writeFile(workbook, path.join(backupDir, "full_export.xlsx"));
  fs.writeFileSync(
    path.join(backupDir, "summary.json"),
    JSON.stringify(summary, null, 2),
    "utf8"
  );

  console.log(`\nBackup saved to: ${backupDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
