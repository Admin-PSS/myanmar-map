import { useEffect, useState } from 'react'
import { GeoJSON } from 'react-leaflet'
import { lightenColor } from '../utils/colorUtils.js'

const DEFAULT_STYLE = { fill: '#B0BEC5', border: '#546E7A' }

export default function TownshipLayer({ styleMap, onFeatureClick }) {
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/myanmar_townships.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setGeojson)
      .catch(e => setError(e.message))
  }, [])

  if (error || !geojson) return null

  const getStyle = (feature) => {
    const pcode = feature.properties.PCODE
    const override = styleMap[pcode] || {}
    return {
      fillColor: override.fillColor || DEFAULT_STYLE.fill,
      color: override.borderColor || DEFAULT_STYLE.border,
      weight: override.borderWidth ?? 1.5,
      fillOpacity: 0.5,
      opacity: 0.9,
    }
  }

  const onEachFeature = (feature, layer) => {
    const props = feature.properties
    layer.bindTooltip(
      `<strong>${props.TS}</strong><br/><span style="font-size:11px">Township · ${props.ST_PCODE}</span>`,
      { sticky: true }
    )
    layer.on({
      mouseover: (e) => {
        const pcode = props.PCODE
        const override = styleMap[pcode] || {}
        const base = override.fillColor || DEFAULT_STYLE.fill
        e.target.setStyle({ fillColor: lightenColor(base, 40), fillOpacity: 0.75 })
        e.target.bringToFront()
      },
      mouseout: (e) => e.target.setStyle(getStyle(feature)),
      click: () => onFeatureClick && onFeatureClick(props),
    })
  }

  return (
    <GeoJSON
      key={JSON.stringify(styleMap)}
      data={geojson}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  )
}
