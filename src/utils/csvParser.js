import Papa from 'papaparse'

/** Parse a File object → Promise<array of row objects> */
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error:    err     => reject(err),
    })
  })
}

/** Parse raw CSV text string */
export function parseCSVText(text) {
  return Papa.parse(text, { header: true, skipEmptyLines: true }).data
}

/** Validate that required columns are present */
export function validateAttributeData(rows) {
  if (!rows || rows.length === 0)
    return { valid: false, message: 'No data rows found.' }
  const headers = Object.keys(rows[0])
  if (!headers.includes('PCODE'))
    return { valid: false, message: 'Missing required column: PCODE' }
  if (!headers.includes('FILL_COLOR'))
    return { valid: false, message: 'Missing required column: FILL_COLOR' }
  return { valid: true, message: `✓ ${rows.length} rows loaded successfully.` }
}

/** Convert row array to a style map keyed by PCODE */
export function rowsToStyleMap(rows) {
  const map = {}
  rows.forEach(row => {
    if (!row.PCODE) return
    map[row.PCODE.trim()] = {
      fillColor:   row.FILL_COLOR   || null,
      borderColor: row.BORDER_COLOR || null,
      borderWidth: parseFloat(row.BORDER_WIDTH) || 2,
      label:       row.LABEL        || null,
      labelColor:  row.LABEL_COLOR  || '#222222',
      category:    row.CATEGORY     || '',
      description: row.DESCRIPTION  || '',
      name:        row.NAME         || '',
    }
  })
  return map
}

/** Convert a style map back to CSV text for export */
export function styleMapToCSV(styleMap) {
  const rows = Object.entries(styleMap).map(([pcode, s]) => ({
    PCODE:        pcode,
    NAME:         s.name        || '',
    FILL_COLOR:   s.fillColor   || '',
    BORDER_COLOR: s.borderColor || '',
    BORDER_WIDTH: s.borderWidth || 2,
    LABEL:        s.label       || '',
    CATEGORY:     s.category    || '',
    LABEL_COLOR:  s.labelColor  || '#222222',
    DESCRIPTION:  s.description || '',
  }))
  return Papa.unparse(rows)
}