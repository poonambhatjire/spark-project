#!/bin/bash

# =============================================
# DATABASE EXPORT USING API KEYS
# =============================================

echo "🚀 Starting database export using API keys..."

# Get current timestamp for filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="database/complete_backup_${TIMESTAMP}.sql"

echo "📁 Backup file: ${BACKUP_FILE}"

# Check if API keys are provided
if [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: Supabase service key not provided"
    echo "💡 Usage: SUPABASE_SERVICE_KEY='your_service_key' ./database/export-with-api-keys.sh"
    echo "🔑 Get your service key from: Supabase Dashboard → Settings → API → service_role key"
    echo "💡 Or use the key from your .env.local file: SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Set environment variables
export SUPABASE_URL="https://vhlnnzeepjuzjezsisss.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_KEY"

echo "🔗 Using Supabase URL: $SUPABASE_URL"
echo "🔑 Service key: ${SUPABASE_SERVICE_KEY:0:20}..."

# Create a simple export using curl and Supabase API
echo "📤 Exporting data via Supabase API..."

# Export profiles table
echo "📊 Exporting profiles table..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/profiles?select=*" \
     -o "database/profiles_export_${TIMESTAMP}.json"

# Export time_entries table
echo "📊 Exporting time_entries table..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/time_entries?select=*" \
     -o "database/time_entries_export_${TIMESTAMP}.json"

# Export admin_activities table
echo "📊 Exporting admin_activities table..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/admin_activities?select=*" \
     -o "database/admin_activities_export_${TIMESTAMP}.json"

# Export contact_submissions table
echo "📊 Exporting contact_submissions table..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/contact_submissions?select=*" \
     -o "database/contact_submissions_export_${TIMESTAMP}.json"

# Export telemetry_events table
echo "📊 Exporting telemetry_events table..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/telemetry_events?select=*" \
     -o "database/telemetry_events_export_${TIMESTAMP}.json"

# Export activity_summary view
echo "📊 Exporting activity_summary view..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/activity_summary?select=*" \
     -o "database/activity_summary_export_${TIMESTAMP}.json"

# Export user_stats view
echo "📊 Exporting user_stats view..."
curl -H "apikey: $SUPABASE_SERVICE_KEY" \
     -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
     "$SUPABASE_URL/rest/v1/user_stats?select=*" \
     -o "database/user_stats_export_${TIMESTAMP}.json"

# Create a summary file
echo "📝 Creating export summary..."
cat > "database/export_summary_${TIMESTAMP}.txt" << EOF
Database Export Summary
======================
Export Date: $(date)
Supabase Project: vhlnnzeepjuzjezsisss
Export Method: API Keys

Exported Files:
- profiles_export_${TIMESTAMP}.json
- time_entries_export_${TIMESTAMP}.json
- admin_activities_export_${TIMESTAMP}.json
- contact_submissions_export_${TIMESTAMP}.json
- telemetry_events_export_${TIMESTAMP}.json
- activity_summary_export_${TIMESTAMP}.json
- user_stats_export_${TIMESTAMP}.json

File Sizes:
$(ls -lh database/*_export_${TIMESTAMP}.json 2>/dev/null || echo "No files found")

Notes:
- This export contains JSON data from all tables
- Use the restore script to import this data back
- Keep your API keys secure and never commit them
EOF

echo "✅ API-based export completed!"
echo "📁 Files saved in database/ directory with timestamp: ${TIMESTAMP}"
echo "📊 Summary: database/export_summary_${TIMESTAMP}.txt"
echo ""
echo "🔍 Exported files:"
ls -la database/*_export_${TIMESTAMP}.json 2>/dev/null || echo "No files found"
echo ""
echo "📏 File sizes:"
ls -lh database/*_export_${TIMESTAMP}.json 2>/dev/null || echo "No files found"
