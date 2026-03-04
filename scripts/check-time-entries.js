/**
 * Query and display time_entries from Supabase
 * Run: node scripts/check-time-entries.js
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

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from("time_entries")
    .select("id, task, minutes, occurred_on, ended_at, patient_count, created_at")
    .is("deleted_at", null)
    .order("occurred_on", { ascending: false })
    .limit(15);

  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }

  console.log("\n=== time_entries (recent, non-deleted) ===\n");
  if (!data || data.length === 0) {
    console.log("No entries found.");
    return;
  }
  data.forEach((row, i) => {
    console.log(`--- Entry ${i + 1} ---`);
    console.log(`  Task:         ${row.task}`);
    console.log(`  Minutes:      ${row.minutes}`);
    console.log(`  Started:      ${row.occurred_on}`);
    console.log(`  Ended:        ${row.ended_at ?? "(not set)"}`);
    console.log(`  Patients:     ${row.patient_count ?? "—"}`);
    console.log(`  Created:      ${row.created_at}`);
    console.log("");
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
