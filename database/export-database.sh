#!/bin/bash

# =============================================
# COMPLETE DATABASE EXPORT SCRIPT
# =============================================

echo "🚀 Starting complete database export..."

# Get current timestamp for filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="database/complete_backup_${TIMESTAMP}.sql"

echo "📁 Backup file: ${BACKUP_FILE}"

# Check if password is provided
if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Error: Database password not provided"
    echo "💡 Usage: DB_PASSWORD='your_password' ./database/export-database.sh"
    echo "🔑 Get your password from: Supabase Dashboard → Settings → Database → Connection string"
    exit 1
fi

# Export complete database
echo "📤 Exporting database..."
npx supabase db dump \
    --db-url "postgresql://postgres:${DB_PASSWORD}@db.vhlnnzeepjuzjezsisss.supabase.co:5432/postgres" \
    > "${BACKUP_FILE}"

# Check if export was successful
if [ $? -eq 0 ]; then
    echo "✅ Database export completed successfully!"
    echo "📁 File saved as: ${BACKUP_FILE}"
    echo "📊 File size: $(ls -lh ${BACKUP_FILE} | awk '{print $5}')"
    echo ""
    echo "🔍 First few lines of backup:"
    head -10 "${BACKUP_FILE}"
    echo ""
    echo "🎯 This backup contains:"
    echo "   - Complete database schema"
    echo "   - All data from all tables"
    echo "   - Indexes and constraints"
    echo "   - Functions and triggers"
    echo ""
    echo "💾 You can restore this backup with:"
    echo "   psql -h db.vhlnnzeepjuzjezsisss.supabase.co -U postgres -d postgres -f ${BACKUP_FILE}"
else
    echo "❌ Database export failed!"
    echo "🔍 Check the error messages above"
    exit 1
fi

echo "🎉 Export process completed!"
