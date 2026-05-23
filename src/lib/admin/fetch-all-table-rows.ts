import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_PAGE_SIZE = 1000

/**
 * Fetch every row from a table. Supabase/PostgREST caps unbounded selects at 1000 rows.
 */
export async function fetchAllTableRows(
  supabase: SupabaseClient,
  table: string,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<{ data: Record<string, unknown>[]; error?: string }> {
  const rows: Record<string, unknown>[] = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) {
      return { data: [], error: error.message }
    }

    const batch = (data ?? []) as Record<string, unknown>[]
    rows.push(...batch)

    if (batch.length < pageSize) {
      break
    }

    from += pageSize
  }

  return { data: rows }
}
