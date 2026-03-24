import { useEffect, useRef, useState } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import { lightenColor } from '../utils/colorUtils.js'
import { fetchGeoJSON } from '../utils/geojsonCache.js'

const DEFAULT_STYLE = { fill: '#B0BEC5', border: '#546E7A' }

export default function TownshipLayer({ styleMap, onFeatureClick, townshipLayerStyle = {}, showTownshipLabels = false, selectedStateFilter = 'All' }) {
  const map = useMap()
  const labelMarkersRef = useRef([])
  const [geojson, setGeojson] = useState(null)

  useEffect(() => {
    fetchGeoJSON('townships', '/data/myanmar_townships.geojson').then(setGeojson).catch(() => {})
  }, [])

  const clearLabels = () => {
    labelMarkersRef.current.forEach(m => map.removeLayer(m))
    labelMarkersRef.current = []
  }

  // Zoom to selected state bounds
  useEffect(() => {
    if (!geojson) return
    if (selectedStateFilter === 'All') {
      map.setView([19.745, 96.129], 6)
      return
    }
    const features = geojson.features.filter(f => f.properties.ST === selectedStateFilter)
    if (!features.length) return
    const bounds = L.geoJSON({ type: 'FeatureCollection', features }).getBounds()
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] })
  }, [selectedStateFilter, geojson])

  useEffect(() => {
    clearLabels()
    if (!showTownshipLabels || !geojson) return

    const features = selectedStateFilter === 'All'
      ? geojson.features
      : geojson.features.filter(f => f.properties.ST === selectedStateFilter)

    features.forEach(feature => {
      const props = feature.properties
      const pcode = props.TS_PCODE
      const override = styleMap[pcode] || {}
      const labelText = override.label || props.TS || ''
      const labelColor = override.labelColor || '#333333'
      const center = L.geoJSON(feature).getBounds().getCenter()
      const marker = L.marker(center, {
        icon: L.divIcon({
          className: 'state-label-icon',
          html: `<span style="color:${labelColor};font-size:9px">${labelText}</span>`,
          iconSize: [100, 16],
          iconAnchor: [50, 8],
        }),
        interactive: false,
        zIndexOffset: -100,
      })
      marker.addTo(map)
      labelMarkersRef.current.push(marker)
    })

    return () => clearLabels()
  }, [showTownshipLabels, styleMap, geojson, selectedStateFilter])

  if (!geojson) return null

  const filteredGeojson = selectedStateFilter === 'All'
    ? geojson
    : { ...geojson, features: geojson.features.filter(f => f.properties.ST === selectedStateFilter) }

  const hasCategories = Object.values(styleMap).some(s => s.category)

  const getStyle = (feature) => {
    const pcode = feature.properties.TS_PCODE
    const override = styleMap[pcode] || {}

    // Hide townships with no category when category data is loaded
    if (hasCategories && !override.category) {
      return { fillOpacity: 0, opacity: 0, weight: 0 }
    }

    return {
      fillColor: override.fillColor || townshipLayerStyle.fillColor || DEFAULT_STYLE.fill,
      color: override.borderColor || townshipLayerStyle.borderColor || DEFAULT_STYLE.border,
      weight: override.borderWidth ?? 1.5,
      fillOpacity: 0.5,
      opacity: 0.9,
    }
  }

  const onEachFeature = (feature, layer) => {
    const props = feature.properties
    const pcode = props.TS_PCODE
    const override = styleMap[pcode] || {}
    const description = override.description
      ? `<br/><span style="font-size:11px;color:#555">${override.description}</span>` : ''
    layer.bindTooltip(
      `<strong>${props.TS}</strong><br/><span style="font-size:11px">Township · ${props.ST}</span>${description}`,
      { sticky: true, className: 'state-hover-tooltip' }
    )
    layer.on({
      mouseover: (e) => {
        if (hasCategories && !override.category) return
        const base = override.fillColor || townshipLayerStyle.fillColor || DEFAULT_STYLE.fill
        e.target.setStyle({ fillColor: lightenColor(base, 40), fillOpacity: 0.75 })
        e.target.bringToFront()
      },
      mouseout: (e) => e.target.setStyle(getStyle(feature)),
      click: () => {
        if (hasCategories && !override.category) return
        onFeatureClick && onFeatureClick({ ...props, PCODE: pcode })
      },
    })
  }

  return (
    <GeoJSON
      key={JSON.stringify(styleMap) + JSON.stringify(townshipLayerStyle) + selectedStateFilter}
      data={filteredGeojson}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  )
}
