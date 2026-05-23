/** Fetch every row from a Supabase table (PostgREST default max is 1000). */
async function fetchAllTableRows(supabase, table, pageSize = 1000) {
  const rows = []
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1)

    if (error) {
      return { data: [], error: error.message }
    }

    const batch = data || []
    rows.push(...batch)

    if (batch.length < pageSize) {
      break
    }

    from += pageSize
  }

  return { data: rows }
}

module.exports = { fetchAllTableRows }
