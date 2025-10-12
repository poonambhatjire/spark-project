#!/bin/bash

# Supabase Keep-Alive Script Runner
# This script runs the keep-alive SQL to prevent project shutdown

echo "🔄 Starting Supabase Keep-Alive Activity..."
echo "=========================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "💡 Please ensure you're running this from the project root directory"
    exit 1
fi

# Get Supabase URL and service key from .env.local
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2 | tr -d '"')
SUPABASE_SERVICE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env.local | cut -d '=' -f2 | tr -d '"')

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: Could not find Supabase credentials in .env.local"
    echo "💡 Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set"
    exit 1
fi

echo "🔗 Using Supabase URL: ${SUPABASE_URL}"
echo "🔑 Service key: ${SUPABASE_SERVICE_KEY:0:15}..." # Show only first 15 chars for security

# Run the SQL script using curl
echo ""
echo "📊 Executing keep-alive SQL script..."

RESPONSE=$(curl -s -X POST \
    "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
    -H "apikey: ${SUPABASE_SERVICE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"sql\": \"$(cat database/keep-alive-simple.sql | sed 's/"/\\"/g' | tr '\n' ' ')\"}")

if [ $? -eq 0 ]; then
    echo "✅ Keep-alive activity completed successfully!"
    echo "📈 Database activity generated to prevent shutdown"
    echo "🕐 Timestamp: $(date)"
else
    echo "❌ Error: Failed to execute keep-alive script"
    echo "🔍 Response: $RESPONSE"
    exit 1
fi

echo ""
echo "💡 Tip: Run this script daily or set up a cron job to automate it"
echo "📋 Manual execution: You can also run the SQL directly in Supabase SQL Editor"
