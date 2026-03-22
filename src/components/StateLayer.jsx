import { useEffect, useState, useRef } from 'react'
import { GeoJSON } from 'react-leaflet'
import { STATE_DEFAULT_COLORS, lightenColor } from '../utils/colorUtils.js'

export default function StateLayer({ styleMap, onFeatureClick }) {
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState(null)
  const geojsonRef = useRef(null)

  useEffect(() => {
    fetch('/data/myanmar_states.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setGeojson)
      .catch(e => setError(e.message))
  }, [])

  // Re-render GeoJSON when styleMap changes
  useEffect(() => {
    if (geojsonRef.current) {
      geojsonRef.current.clearLayers()
      if (geojson) geojsonRef.current.addData(geojson)
    }
  }, [styleMap, geojson])

  if (error) return null
  if (!geojson) return null

  const getStyle = (feature) => {
    const pcode = feature.properties.PCODE
    const defaults = STATE_DEFAULT_COLORS[pcode] || { fill: '#90A4AE', border: '#546E7A' }
    const override = styleMap[pcode] || {}
    return {
      fillColor: override.fillColor || defaults.fill,
      color: override.borderColor || defaults.border,
      weight: override.borderWidth ?? 2,
      fillOpacity: 0.65,
      opacity: 1,
    }
  }

  const onEachFeature = (feature, layer) => {
    const props = feature.properties
    const pcode = props.PCODE
    const defaults = STATE_DEFAULT_COLORS[pcode] || { fill: '#90A4AE', border: '#546E7A' }
    const override = styleMap[pcode] || {}
    const baseFill = override.fillColor || defaults.fill

    layer.bindTooltip(
      `<strong>${props.ST}</strong><br/><span class="text-xs">${props.TYPE || ''}</span>`,
      { sticky: true }
    )

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillColor: lightenColor(baseFill, 40), fillOpacity: 0.85 })
        e.target.bringToFront()
      },
      mouseout: (e) => {
        e.target.setStyle(getStyle(feature))
      },
      click: () => onFeatureClick && onFeatureClick(props),
    })
  }

  return (
    <GeoJSON
      key={JSON.stringify(styleMap)}
      ref={geojsonRef}
      data={geojson}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  )
}
