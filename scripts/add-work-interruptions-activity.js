/**
 * Add "Work Interruptions/ Miscellaneous/ Non-ASP time" activity to database
 * Run: node scripts/add-work-interruptions-activity.js
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

const ACTIVITY_NAME = "Work Interruptions/ Miscellaneous/ Non-ASP time";

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Check if already exists
  const { data: existing } = await supabase
    .from("activities")
    .select("id, name")
    .eq("name", ACTIVITY_NAME)
    .single();

  if (existing) {
    console.log(`Activity "${ACTIVITY_NAME}" already exists (id: ${existing.id})`);
    return;
  }

  // Use Administrative category (or create new - using Administrative as catch-all)
  const { data: adminCat } = await supabase
    .from("activity_categories")
    .select("id")
    .eq("name", "Administrative")
    .single();

  const categoryId = adminCat?.id;
  if (!categoryId) {
    console.error("Could not find Administrative category. Create a category first.");
    process.exit(1);
  }

  const { data: inserted, error } = await supabase
    .from("activities")
    .insert({ name: ACTIVITY_NAME, category_id: categoryId })
    .select("id, name")
    .single();

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`Added activity: ${inserted.name} (id: ${inserted.id})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
