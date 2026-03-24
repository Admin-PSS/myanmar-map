import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { fetchGeoJSON } from '../utils/geojsonCache.js'

export default function StateBorderLayer({ borderColor = '#37474F', borderWidth = 2 }) {
  const [geojson, setGeojson] = useState(null)

  useEffect(() => {
    fetchGeoJSON('states', '/data/myanmar_states.geojson').then(setGeojson).catch(() => {})
  }, [])

  if (!geojson) return null

  return (
    <GeoJSON
      key={borderColor + borderWidth}
      data={geojson}
      style={{
        fillColor: 'transparent',
        fillOpacity: 0,
        color: borderColor,
        weight: borderWidth,
        opacity: 1,
      }}
      interactive={false}
    />
  )
}
