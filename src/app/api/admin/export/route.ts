import { NextResponse } from 'next/server'
import { checkAdminAccess } from '@/lib/actions/admin'
import {
  ADMIN_EXPORT_TABLES,
  ANALYSIS_BURNOUT_SCORES_SHEET,
  ANALYSIS_DATA_QUALITY_SHEET,
  ANALYSIS_USERS_SHEET,
  LOGGED_ITEMS_WITH_PROFILE_SHEET,
  buildAnalysisBurnoutScoresRows,
  buildAnalysisDataQualityRows,
  buildAnalysisUsersRows,
  buildLoggedItemsWithProfileRows,
  rowToSheetRow,
  type AdminExportTableName,
} from '@/lib/admin/export-tables'
import { createServiceRoleClient, isServiceRoleConfigured } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function filenameStem(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

export async function GET() {
  const admin = await checkAdminAccess()
  if (!admin.success || !admin.isAdmin) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      {
        error:
          'Full database export is not configured. Set SUPABASE_SERVICE_ROLE_KEY in the server environment (same as backup scripts).',
      },
      { status: 503 }
    )
  }

  let supabase
  try {
    supabase = createServiceRoleClient()
  } catch (e) {
    console.error('Admin export: service client', e)
    return NextResponse.json({ error: 'Export service unavailable' }, { status: 503 })
  }

  const tables: AdminExportTableName[] = [...ADMIN_EXPORT_TABLES]
  const payload: Record<string, unknown[]> = {}
  const fetchErrors: { table: string; message: string }[] = []

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*')
    if (error) {
      console.error(`Admin export: ${table}`, error.message)
      fetchErrors.push({ table, message: error.message })
      payload[table] = []
      continue
    }
    payload[table] = data ?? []
  }

  const stem = filenameStem()

  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()

  for (const table of tables) {
    const rows = (payload[table] as Record<string, unknown>[]) || []
    const sheetRows =
      rows.length > 0
        ? rows.map((row) => rowToSheetRow(row))
        : [{ '(empty)': 'No rows or table could not be read' }]
    const sheet = XLSX.utils.json_to_sheet(sheetRows)
    const safeName = table.slice(0, 31)
    XLSX.utils.book_append_sheet(workbook, sheet, safeName)
  }

  const loggedItemsRows = buildLoggedItemsWithProfileRows(payload)
  const loggedItemsSheet = XLSX.utils.json_to_sheet(
    loggedItemsRows.length > 0
      ? loggedItemsRows.map((row) => rowToSheetRow(row))
      : [{ '(empty)': 'No logged items found' }]
  )
  XLSX.utils.book_append_sheet(workbook, loggedItemsSheet, LOGGED_ITEMS_WITH_PROFILE_SHEET)

  const analysisSheets = [
    { name: ANALYSIS_USERS_SHEET, rows: buildAnalysisUsersRows(payload) },
    { name: ANALYSIS_BURNOUT_SCORES_SHEET, rows: buildAnalysisBurnoutScoresRows(payload) },
    { name: ANALYSIS_DATA_QUALITY_SHEET, rows: buildAnalysisDataQualityRows(payload) },
  ]

  for (const { name, rows } of analysisSheets) {
    const sheet = XLSX.utils.json_to_sheet(
      rows.length > 0
        ? rows.map((row) => rowToSheetRow(row))
        : [{ '(empty)': 'No analysis rows found' }]
    )
    XLSX.utils.book_append_sheet(workbook, sheet, name)
  }

  if (fetchErrors.length) {
    const errSheet = XLSX.utils.json_to_sheet(
      fetchErrors.map((e) => ({ table: e.table, error: e.message }))
    )
    XLSX.utils.book_append_sheet(workbook, errSheet, '_export_errors')
  }

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }) as Buffer

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="spark-full-export-${stem}.xlsx"`,
    },
  })
}
