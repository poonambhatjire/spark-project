/**
 * Quick script to test Supabase connection and list tables
 * Run: node scripts/list-tables.js
 */

const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const tables = [
    "profiles",
    "time_entries",
    "additional_survey_responses",
    "burnout_survey_responses",
    "institutions",
    "activities",
    "activity_categories",
    "contact_submissions",
    "admin_activities",
    "telemetry_events",
  ];

  console.log("Supabase connection test\n");
  console.log("URL:", SUPABASE_URL.replace(/https?:\/\/[^@]+@/, "***@"));

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    if (error) {
      if (error.code === "42P01") {
        console.log(`  ${table}: (table not found)`);
      } else {
        console.log(`  ${table}: ERROR - ${error.message}`);
      }
    } else {
      console.log(`  ${table}: ${count ?? "?"} rows`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
