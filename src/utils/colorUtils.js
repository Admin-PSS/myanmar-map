// Default color palette for all 15 States/Regions (14 + Naypyidaw)
export const STATE_DEFAULT_COLORS = {
  MMR001: { fill: '#66BB6A', border: '#2E7D32', name: 'Ayeyarwady' },
  MMR002: { fill: '#42A5F5', border: '#1565C0', name: 'Bago' },
  MMR003: { fill: '#BDBDBD', border: '#616161', name: 'Chin' },
  MMR004: { fill: '#26C6DA', border: '#00838F', name: 'Kachin' },
  MMR005: { fill: '#EC407A', border: '#880E4F', name: 'Kayah' },
  MMR006: { fill: '#FF7043', border: '#BF360C', name: 'Kayin' },
  MMR007: { fill: '#FFA726', border: '#E65100', name: 'Magway' },
  MMR008: { fill: '#AB47BC', border: '#6A1B9A', name: 'Mandalay' },
  MMR009: { fill: '#26A69A', border: '#00695C', name: 'Mon' },
  MMR010: { fill: '#EF5350', border: '#B71C1C', name: 'Naypyidaw' },
  MMR011: { fill: '#8D6E63', border: '#4E342E', name: 'Rakhine' },
  MMR012: { fill: '#78909C', border: '#37474F', name: 'Sagaing' },
  MMR013: { fill: '#FFCA28', border: '#F57F17', name: 'Shan' },
  MMR014: { fill: '#9CCC65', border: '#558B2F', name: 'Tanintharyi' },
  MMR015: { fill: '#5C6BC0', border: '#283593', name: 'Yangon' },
}

export const TOWN_TYPE_STYLES = {
  City:    { color: '#C62828', radius: 9  },
  Town:    { color: '#1565C0', radius: 6  },
  Village: { color: '#2E7D32', radius: 4  },
}

/** Lighten a hex color by `amount` (0-255) */
export function lightenColor(hex, amount = 30) {
  if (!hex || !hex.startsWith('#')) return hex || '#90A4AE'
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16)         + amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + amount)
  const b = Math.min(255, (num & 0xff)        + amount)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

/** Extract unique categories from data rows and build a color map */
export function getCategoryColors(dataArray, categoryField = 'CATEGORY') {
  const map = {}
  const palette = [
    '#42A5F5','#EF5350','#66BB6A','#AB47BC','#FFA726',
    '#26C6DA','#FF7043','#FFCA28','#78909C','#9CCC65',
    '#EC407A','#26A69A','#8D6E63','#5C6BC0','#FFEE58',
  ]
  let idx = 0
  dataArray.forEach(row => {
    const cat = row[categoryField]
    if (cat && !map[cat]) {
      map[cat] = {
        color:  row.FILL_COLOR   || palette[idx % palette.length],
        border: row.BORDER_COLOR || '#555555',
      }
      idx++
    }
  })
  return map
}