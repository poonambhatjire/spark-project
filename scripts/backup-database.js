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

const HOSPITAL_SERVICE_LABELS = {
  level1_trauma: "Level 1 trauma center",
  burn_unit: "Burn unit",
  solid_organ_transplant: "Solid organ transplant program",
  bone_marrow_transplant: "Bone marrow transplant program",
  none: "None of the above",
};

const EFFECTIVENESS_LABELS = {
  cost_savings: "Cost savings/cost avoidance",
  decreased_utilization: "Decreased antibiotic utilization",
  decreased_cdiff: "Decreased Clostridium difficile infection",
  decreased_resistance: "Decreased rate of drug-resistant organisms",
  none: "Our ASP has not demonstrated any of the above",
  other: "Other (please specify)",
};

const TELEHEALTH_ASP_LABELS = {
  provides: "My hospital provides telehealth ASP",
  receives: "My hospital receives telehealth ASP",
  none: "None of the above",
};

const SAAR_CATEGORY_LABELS = {
  much_lower: "Much lower than predicted (<0.7)",
  slightly_lower: "Slightly lower than predicted (0.7 to <1)",
  about_predicted: "About as predicted (around 1.0)",
  slightly_higher: "Slightly higher than predicted (>1 to 1.3)",
  much_higher: "Much higher than predicted (>1.3)",
  dont_know: "Don't know",
  not_available: "SAAR not available",
};

function asStringArray(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(",").map((part) => part.trim()).filter(Boolean);
    }
  }
  return [];
}

function labelsForValues(value, labels) {
  return asStringArray(value).map((item) => labels[item] || item).join(", ");
}

function hasAnsweredSelection(value) {
  return asStringArray(value).length > 0;
}

function hasAnsweredScalar(value) {
  return value !== null && value !== undefined && !(typeof value === "string" && value.trim() === "");
}

function labelForValue(value, labels) {
  return typeof value === "string" && value ? labels[value] || value : "";
}

function numberValue(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function isDeleted(row) {
  return hasAnsweredScalar(row.deleted_at);
}

function buildLoggedItemsWithProfileRows(payload) {
  const timeEntries = payload.time_entries || [];
  const profiles = payload.profiles || [];
  const surveyResponses = payload.additional_survey_responses || [];
  const profileById = new Map(profiles.map((profile) => [String(profile.id), profile]));
  const surveyByUserId = new Map(surveyResponses.map((survey) => [String(survey.user_id), survey]));

  return timeEntries.map((entry) => {
    const userId = String(entry.user_id || "");
    const profile = profileById.get(userId) || {};
    const survey = surveyByUserId.get(userId) || {};

    return {
      "Logged Item ID": entry.id ?? null,
      "User ID": entry.user_id ?? null,
      "User Name": profile.name ?? null,
      "User Email": profile.email ?? null,
      "Task": entry.task ?? null,
      "Other Task": entry.other_task ?? null,
      "Minutes": entry.minutes ?? null,
      "Occurred On": entry.occurred_on ?? null,
      "Ended At": entry.ended_at ?? null,
      "Patient Count": entry.patient_count ?? null,
      "Typical Day": entry.is_typical_day ?? null,
      "Tele-health": entry.is_telehealth ?? null,
      "Comment": entry.comment ?? null,
      "Created At": entry.created_at ?? null,
      "Updated At": entry.updated_at ?? null,
      "Deleted At": entry.deleted_at ?? null,
      "Profile - Job Title": profile.title ?? null,
      "Profile - Experience Level": profile.experience_level ?? null,
      "Profile - Institution": profile.institution ?? null,
      "Profile - Licensed Beds": survey.licensed_beds ?? null,
      "Profile - Occupied Beds Count": survey.occupied_beds_count ?? null,
      "Profile - Occupied Beds Percent": survey.occupied_beds_percent ?? null,
      "Profile - ICU Beds": survey.icu_beds ?? null,
      "Profile - Has Additional Survey": Boolean(survey.id),
      "Profile - Additional Survey Submitted At": survey.profile_survey_submitted_at ?? null,
      "Profile - Hospital Services Answered": hasAnsweredSelection(survey.hospital_services),
      "Profile - Hospital Services Offered": labelsForValues(survey.hospital_services, HOSPITAL_SERVICE_LABELS),
      "Profile - Current ASP FTE": survey.asp_fte ?? null,
      "Profile - Pharmacist FTE": survey.pharmacist_fte ?? null,
      "Profile - Physician FTE": survey.physician_fte ?? null,
      "Profile - Other FTE 1 Role": survey.other1_specify ?? null,
      "Profile - Other FTE 1": survey.other1_fte ?? null,
      "Profile - Other FTE 2 Role": survey.other2_specify ?? null,
      "Profile - Other FTE 2": survey.other2_fte ?? null,
      "Profile - Other FTE 3 Role": survey.other3_specify ?? null,
      "Profile - Other FTE 3": survey.other3_fte ?? null,
      "Profile - Telehealth ASP Utilization": labelForValue(survey.telehealth_asp, TELEHEALTH_ASP_LABELS),
      "Profile - Telehealth ASP Answered": hasAnsweredScalar(survey.telehealth_asp),
      "Profile - SAAR Value": survey.saar_value ?? null,
      "Profile - SAAR Category": labelForValue(survey.saar_category, SAAR_CATEGORY_LABELS),
      "Profile - SAAR Answered": hasAnsweredScalar(survey.saar_value) || hasAnsweredScalar(survey.saar_category),
      "Profile - Demonstrated Effectiveness Answered": hasAnsweredSelection(survey.effectiveness_options),
      "Profile - Demonstrated Effectiveness": labelsForValues(survey.effectiveness_options, EFFECTIVENESS_LABELS),
      "Profile - Effectiveness Other": survey.effectiveness_other ?? null,
    };
  });
}

function buildAnalysisUsersRows(payload) {
  const profiles = payload.profiles || [];
  const timeEntries = payload.time_entries || [];
  const surveyResponses = payload.additional_survey_responses || [];
  const burnoutResponses = payload.burnout_survey_responses || [];
  const institutions = payload.institutions || [];
  const surveyByUserId = new Map(surveyResponses.map((survey) => [String(survey.user_id), survey]));
  const institutionById = new Map(institutions.map((institution) => [String(institution.id), institution]));

  return profiles.map((profile) => {
    const userId = String(profile.id || "");
    const entries = timeEntries.filter((entry) => String(entry.user_id || "") === userId);
    const activeEntries = entries.filter((entry) => !isDeleted(entry));
    const survey = surveyByUserId.get(userId) || {};
    const burnoutForUser = burnoutResponses.filter((response) => String(response.user_id || "") === userId);
    const institution = institutionById.get(String(profile.institution_id || "")) || {};

    return {
      "User ID": profile.id ?? null,
      "User Name": profile.name ?? null,
      "User Email": profile.email ?? null,
      "Role": profile.role ?? null,
      "Active": profile.is_active ?? null,
      "Profile - Job Title": profile.title ?? null,
      "Profile - Experience Level": profile.experience_level ?? null,
      "Profile - Institution Text": profile.institution ?? null,
      "Profile - Institution ID": profile.institution_id ?? null,
      "Profile - Institution ID Name": institution.name ?? null,
      "Time Entries Total": entries.length,
      "Time Entries Active": activeEntries.length,
      "Time Entries Deleted": entries.length - activeEntries.length,
      "Total Active Minutes": activeEntries.reduce((sum, entry) => sum + numberValue(entry.minutes), 0),
      "Has Additional Survey": Boolean(survey.id),
      "Additional Survey Submitted At": survey.profile_survey_submitted_at ?? null,
      "Hospital Services Answered": hasAnsweredSelection(survey.hospital_services),
      "Hospital Services Offered": labelsForValues(survey.hospital_services, HOSPITAL_SERVICE_LABELS),
      "Telehealth ASP Answered": hasAnsweredScalar(survey.telehealth_asp),
      "Telehealth ASP Utilization": labelForValue(survey.telehealth_asp, TELEHEALTH_ASP_LABELS),
      "SAAR Answered": hasAnsweredScalar(survey.saar_value) || hasAnsweredScalar(survey.saar_category),
      "Demonstrated Effectiveness Answered": hasAnsweredSelection(survey.effectiveness_options),
      "Burnout Answers": burnoutForUser.length,
      "Burnout Complete": burnoutForUser.length === 12,
    };
  });
}

const EXHAUSTION_QUESTIONS = new Set([2, 4, 5, 8, 10, 12]);
const DISENGAGEMENT_QUESTIONS = new Set([1, 3, 6, 7, 9, 11]);
const REVERSE_SCORED_QUESTIONS = new Set([1, 5, 7, 10]);

function scoredBurnoutValue(questionNumber, responseValue) {
  return REVERSE_SCORED_QUESTIONS.has(questionNumber) ? 5 - responseValue : responseValue;
}

function buildAnalysisBurnoutScoresRows(payload) {
  const profiles = payload.profiles || [];
  const burnoutResponses = payload.burnout_survey_responses || [];
  const profileById = new Map(profiles.map((profile) => [String(profile.id), profile]));
  const userIds = [...new Set(burnoutResponses.map((response) => String(response.user_id || "")))];

  return userIds.map((userId) => {
    const profile = profileById.get(userId) || {};
    const responses = burnoutResponses.filter((response) => String(response.user_id || "") === userId);
    const exhaustionScores = [];
    const disengagementScores = [];
    for (const response of responses) {
      const questionNumber = numberValue(response.question_number);
      const responseValue = numberValue(response.response_value);
      const score = scoredBurnoutValue(questionNumber, responseValue);
      if (EXHAUSTION_QUESTIONS.has(questionNumber)) exhaustionScores.push(score);
      if (DISENGAGEMENT_QUESTIONS.has(questionNumber)) disengagementScores.push(score);
    }
    const sum = (values) => values.reduce((total, value) => total + value, 0);
    const avg = (values) => values.length ? Math.round((sum(values) / values.length) * 100) / 100 : null;
    const exhaustionAverage = avg(exhaustionScores);
    const disengagementAverage = avg(disengagementScores);

    return {
      "User ID": userId,
      "User Name": profile.name ?? null,
      "User Email": profile.email ?? null,
      "Answers": responses.length,
      "Complete": responses.length === 12,
      "Exhaustion Score": sum(exhaustionScores),
      "Disengagement Score": sum(disengagementScores),
      "Exhaustion Average": exhaustionAverage,
      "Disengagement Average": disengagementAverage,
      "Total Average": exhaustionAverage !== null && disengagementAverage !== null
        ? Math.round(((exhaustionAverage + disengagementAverage) / 2) * 100) / 100
        : null,
      "Completed At": responses[0]?.completed_at ?? null,
    };
  });
}

function buildAnalysisDataQualityRows(payload) {
  const profiles = payload.profiles || [];
  const timeEntries = payload.time_entries || [];
  const surveyResponses = payload.additional_survey_responses || [];
  const burnoutResponses = payload.burnout_survey_responses || [];
  const profileIds = new Set(profiles.map((profile) => String(profile.id || "")));
  const surveyUserIds = new Set(surveyResponses.map((survey) => String(survey.user_id || "")));
  const activeTimeEntries = timeEntries.filter((entry) => !isDeleted(entry));
  const burnoutUserIds = [...new Set(burnoutResponses.map((response) => String(response.user_id || "")))];

  const checks = [
    ["Active time entries join to profiles", activeTimeEntries.filter((entry) => profileIds.has(String(entry.user_id || ""))).length, activeTimeEntries.length],
    ["Active time entries have additional survey context", activeTimeEntries.filter((entry) => surveyUserIds.has(String(entry.user_id || ""))).length, activeTimeEntries.length],
    ["Users have additional survey rows", surveyUserIds.size, profiles.length],
    ["Additional survey rows have hospital services answered", surveyResponses.filter((survey) => hasAnsweredSelection(survey.hospital_services)).length, surveyResponses.length],
    ["Additional survey rows have submitted timestamp", surveyResponses.filter((survey) => hasAnsweredScalar(survey.profile_survey_submitted_at)).length, surveyResponses.length],
    ["Users have complete burnout survey", burnoutUserIds.filter((userId) => burnoutResponses.filter((response) => String(response.user_id || "") === userId).length === 12).length, profiles.length],
    ["Time entries have valid minutes", timeEntries.filter((entry) => numberValue(entry.minutes) > 0 && numberValue(entry.minutes) <= 480).length, timeEntries.length],
  ];

  return checks.map(([check, value, total]) => ({
    "Check": check,
    "Passing Rows": value,
    "Total Rows": total,
    "Pass Percent": total ? Math.round((value / total) * 1000) / 10 : null,
  }));
}

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
  const payload = {};

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");

    if (error) {
      console.log(`  ${table}: ERROR - ${error.message}`);
      summary.tables[table] = { error: error.message };
      continue;
    }

    const rows = data || [];
    payload[table] = rows;
    console.log(`  ${table}: ${rows.length} rows`);

    // Excel sheet
    const sheetRows = rows.map((row) => {
      const out = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) out[k] = null;
        else if (Array.isArray(v)) out[k] = v.join(", ");
        else if (typeof v === "object" && !(v instanceof Date))
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

  const loggedItemsRows = buildLoggedItemsWithProfileRows(payload);
  const loggedItemsSheet = XLSX.utils.json_to_sheet(
    loggedItemsRows.length ? loggedItemsRows : [{ "(empty)": "No logged items found" }]
  );
  XLSX.utils.book_append_sheet(workbook, loggedItemsSheet, "logged_items_with_profile");
  summary.tables.logged_items_with_profile = { rows: loggedItemsRows.length, derived: true };

  const analysisSheets = [
    ["analysis_users", buildAnalysisUsersRows(payload)],
    ["analysis_burnout_scores", buildAnalysisBurnoutScoresRows(payload)],
    ["analysis_data_quality", buildAnalysisDataQualityRows(payload)],
  ];
  for (const [name, rows] of analysisSheets) {
    const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ "(empty)": "No analysis rows found" }]);
    XLSX.utils.book_append_sheet(workbook, sheet, name);
    summary.tables[name] = { rows: rows.length, derived: true };
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
