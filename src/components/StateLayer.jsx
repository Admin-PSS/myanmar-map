import { useEffect, useRef, useState } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import { STATE_DEFAULT_COLORS, lightenColor } from '../utils/colorUtils.js'
import { fetchGeoJSON } from '../utils/geojsonCache.js'

export default function StateLayer({ styleMap, onFeatureClick, stateLayerStyle = {}, stateColorsEnabled = true, showStateLabels = true }) {
  const map = useMap()
  const labelMarkersRef = useRef([])
  const [geojson, setGeojson] = useState(null)

  useEffect(() => {
    fetchGeoJSON('states', '/data/myanmar_states.geojson').then(setGeojson).catch(() => {})
  }, [])

  const clearLabels = () => {
    labelMarkersRef.current.forEach(m => map.removeLayer(m))
    labelMarkersRef.current = []
  }

  // Manage labels reactively — runs whenever any label-related dep changes
  useEffect(() => {
    clearLabels()
    if (!showStateLabels || !geojson) return

    geojson.features.forEach(feature => {
      const props = feature.properties
      const pcode = props.ST_PCODE
      const override = styleMap[pcode] || {}
      const labelText = override.label || props.ST || ''
      const labelColor = override.labelColor || '#333333'
      const center = L.geoJSON(feature).getBounds().getCenter()
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: 'state-label-icon',
          html: `<span style="color:${labelColor}">${labelText}</span>`,
          iconSize: [120, 20],
          iconAnchor: [60, 10],
        }),
        interactive: false,
        zIndexOffset: -100,
      })
      marker.addTo(map)
      labelMarkersRef.current.push(marker)
    })

    return () => clearLabels()
  }, [showStateLabels, styleMap, geojson])

  const getStyle = (feature) => {
    const pcode = feature.properties.ST_PCODE
    const defaults = STATE_DEFAULT_COLORS[pcode] || { fill: '#90A4AE', border: '#546E7A' }
    const override = styleMap[pcode] || {}
    const defaultFill = stateColorsEnabled ? defaults.fill : '#90A4AE'
    const defaultBorder = stateColorsEnabled ? defaults.border : '#546E7A'
    return {
      fillColor: override.fillColor || stateLayerStyle.fillColor || defaultFill,
      color: override.borderColor || stateLayerStyle.borderColor || defaultBorder,
      weight: override.borderWidth ?? 2,
      fillOpacity: 0.65,
      opacity: 1,
    }
  }

  const onEachFeature = (feature, layer) => {
    const props = feature.properties
    const pcode = props.ST_PCODE
    const defaults = STATE_DEFAULT_COLORS[pcode] || { fill: '#90A4AE', border: '#546E7A' }
    const override = styleMap[pcode] || {}
    const defaultFill = stateColorsEnabled ? defaults.fill : '#90A4AE'
    const baseFill = override.fillColor || stateLayerStyle.fillColor || defaultFill

    const description = override.description
      ? `<br/><span style="font-size:11px;color:#555">${override.description}</span>` : ''
    layer.bindTooltip(
      `<strong>${props.ST}</strong><br/><span style="font-size:11px">${props.ST_RG || ''}</span>${description}`,
      { sticky: true, className: 'state-hover-tooltip' }
    )

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ fillColor: lightenColor(baseFill, 40), fillOpacity: 0.85 })
        e.target.bringToFront()
      },
      mouseout: (e) => e.target.setStyle(getStyle(feature)),
      click: () => onFeatureClick && onFeatureClick({ ...props, PCODE: pcode }),
    })
  }

  if (!geojson) return null

  return (
    <GeoJSON
      key={JSON.stringify(styleMap) + JSON.stringify(stateLayerStyle) + stateColorsEnabled}
      data={geojson}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  )
}

