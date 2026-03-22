import { useState, useCallback } from 'react'
import {
  parseCSVFile,
  parseCSVText,
  validateAttributeData,
  rowsToStyleMap,
  styleMapToCSV,
} from '../utils/csvParser'

export function useAttributeData() {
  const [styleMap, setStyleMap] = useState({})
  const [validationMsg, setValidationMsg] = useState(null)

  const _applyRows = useCallback((rows) => {
    const result = validateAttributeData(rows)
    setValidationMsg(result.message)
    if (result.valid) {
      setStyleMap(rowsToStyleMap(rows))
    }
    return result
  }, [])

  const loadFromCSV = useCallback(async (file) => {
    try {
      const rows = await parseCSVFile(file)
      return _applyRows(rows)
    } catch (err) {
      const msg = `Error parsing file: ${err.message}`
      setValidationMsg(msg)
      return { valid: false, message: msg }
    }
  }, [_applyRows])

  const loadFromText = useCallback((text) => {
    try {
      const rows = parseCSVText(text)
      return _applyRows(rows)
    } catch (err) {
      const msg = `Error parsing CSV: ${err.message}`
      setValidationMsg(msg)
      return { valid: false, message: msg }
    }
  }, [_applyRows])

  const updateFeatureStyle = useCallback((pcode, styleObj) => {
    setStyleMap(prev => ({ ...prev, [pcode]: { ...(prev[pcode] || {}), ...styleObj } }))
  }, [])

  const resetStyles = useCallback(() => {
    setStyleMap({})
    setValidationMsg(null)
  }, [])

  const exportCSV = useCallback(() => {
    const csv = styleMapToCSV(styleMap)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'myanmar_attribute_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [styleMap])

  return { styleMap, validationMsg, loadFromCSV, loadFromText, updateFeatureStyle, resetStyles, exportCSV }
}
