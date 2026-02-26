/**
 * Database cleanup: Option 2 + 3
 * - Full reset: keep only admin profile, delete ALL activity/survey data
 * - Delete other users from auth.users
 *
 * Admin: Poonambhatjirejb@gmail.com
 * Run: node scripts/cleanup-database-admin-only.js
 */

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    });
}

const ADMIN_EMAIL = "poonambhatjirejb@gmail.com";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: adminProfile, error: profileErr } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", ADMIN_EMAIL)
    .single();

  if (profileErr || !adminProfile) {
    console.error("Admin profile not found for", ADMIN_EMAIL);
    process.exit(1);
  }

  const adminId = adminProfile.id;
  console.log("Admin user_id:", adminId);
  console.log("\nStarting cleanup...\n");

  async function deleteAll(table, key = "id", batchSize = 100) {
    let total = 0;
    while (true) {
      const { data: rows } = await supabase.from(table).select(key).limit(batchSize);
      if (!rows?.length) break;
      const ids = rows.map((r) => r[key]);
      const { error } = await supabase.from(table).delete().in(key, ids);
      if (error) {
        for (const id of ids) {
          await supabase.from(table).delete().eq(key, id);
        }
      }
      total += rows.length;
    }
    return total;
  }

  // 1. Delete all time_entries
  const teCount = await deleteAll("time_entries");
  console.log("  time_entries: deleted", teCount);

  // 2. Delete all additional_survey_responses (by user_id)
  const addCount = await deleteAll("additional_survey_responses", "user_id", 50);
  console.log("  additional_survey_responses: deleted", addCount);

  // 3. Delete all burnout_survey_responses
  const burnCount = await deleteAll("burnout_survey_responses");
  console.log("  burnout_survey_responses: deleted", burnCount);

  // 4. Delete contact_submissions, admin_activities, telemetry_events
  const csCount = await deleteAll("contact_submissions");
  console.log("  contact_submissions: deleted", csCount);

  const aaCount = await deleteAll("admin_activities");
  console.log("  admin_activities: deleted", aaCount);

  const telCount = await deleteAll("telemetry_events");
  console.log("  telemetry_events: deleted", telCount);

  // 5. Delete non-admin profiles
  const { data: profiles } = await supabase.from("profiles").select("id");
  let profilesDeleted = 0;
  for (const p of profiles || []) {
    if (p.id !== adminId) {
      await supabase.from("profiles").delete().eq("id", p.id);
      profilesDeleted++;
    }
  }
  console.log("  profiles: deleted", profilesDeleted, "(kept admin)");

  // 6. Delete other users from auth.users
  const { data: authData, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.warn("  auth.users: could not list (", listErr.message, ")");
  } else {
    const users = authData?.users || [];
    let authDeleted = 0;
    for (const u of users) {
      if (u.id !== adminId) {
        const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
        if (!delErr) authDeleted++;
      }
    }
    console.log("  auth.users: deleted", authDeleted, "(kept admin)");
  }

  console.log("\nCleanup complete. Admin", ADMIN_EMAIL, "retained.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
