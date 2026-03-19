/**
 * Add all missing activities to match task types in the app
 * Run: node scripts/add-missing-activities.js
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

const ALL_TASKS = [
  "Patient Care - Prospective Audit & Feedback",
  "Patient Care - Authorization of Restricted Antimicrobials",
  "Patient Care - Participating in Clinical Rounds",
  "Patient Care - Curbside ASP Questions",
  'Patient Care - ASP Rounds (including "handshake" ASP)',
  "Patient Care - Other (please specify under comment section)",
  "Administrative - Guidelines/EHR",
  "Administrative - Committee Work",
  "Administrative - QI projects/research",
  "Administrative - Emails",
  "Administrative - Other (please specify under comment section)",
  "Tracking - Antimicrobial Use",
  "Tracking - Antimicrobial Resistance",
  "Tracking - Antibiotic Appropriateness",
  "Tracking - Intervention Acceptance",
  "Tracking - Other (please specify under comment section)",
  "Reporting - sharing data with prescribers/decision makers",
  "Reporting - Other (please specify under comment section)",
  "Education - Providing Education/Teaching",
  "Education - Receiving Education (e.g. CE)",
  "Education - Other (please specify under comment section)",
  "Work Interruptions/ Miscellaneous/ Non-ASP time",
];

const CATEGORY_MAP = {
  "Patient Care": "Patient Care",
  Administrative: "Administrative",
  Tracking: "Tracking",
  Reporting: "Reporting",
  Education: "Education",
  "Work Interruptions": "Administrative",
};

function getCategoryForTask(taskName) {
  const prefix = taskName.split(" - ")[0];
  return CATEGORY_MAP[prefix] || "Administrative";
}

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: existing } = await supabase.from("activities").select("id, name");
  const existingNames = new Set((existing || []).map((a) => a.name));

  const { data: categories } = await supabase.from("activity_categories").select("id, name");
  const categoryById = Object.fromEntries((categories || []).map((c) => [c.name, c.id]));

  let added = 0;
  for (const taskName of ALL_TASKS) {
    if (existingNames.has(taskName)) continue;

    const catName = getCategoryForTask(taskName);
    const categoryId = categoryById[catName];
    if (!categoryId) {
      console.error(`No category for "${catName}" (task: ${taskName})`);
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("activities")
      .insert({ name: taskName, category_id: categoryId })
      .select("id, name")
      .single();

    if (error) {
      console.error(`Failed to add "${taskName}":`, error.message);
      continue;
    }

    console.log(`Added: ${inserted.name}`);
    existingNames.add(taskName);
    added++;
  }

  console.log(`\nDone. Added ${added} activities.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
