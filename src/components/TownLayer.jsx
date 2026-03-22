import { useEffect, useState } from 'react'
import { CircleMarker, Popup } from 'react-leaflet'
import { TOWN_TYPE_STYLES } from '../utils/colorUtils.js'

export default function TownLayer({ styleMap, onFeatureClick }) {
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/myanmar_towns.geojson')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setGeojson)
      .catch(e => setError(e.message))
  }, [])

  if (error || !geojson) return null

  return geojson.features.map((feature) => {
    const props = feature.properties
    const [lng, lat] = feature.geometry.coordinates
    const typeStyle = TOWN_TYPE_STYLES[props.TYPE] || TOWN_TYPE_STYLES.Village
    const override = styleMap[props.PCODE] || {}

    const fillColor = override.fillColor || typeStyle.color
    const borderColor = override.borderColor || '#ffffff'
    const radius = typeStyle.radius

    return (
      <CircleMarker
        key={props.PCODE}
        center={[lat, lng]}
        radius={radius}
        pathOptions={{
          fillColor,
          color: borderColor,
          weight: 1.5,
          fillOpacity: 0.9,
          opacity: 1,
        }}
        eventHandlers={{
          click: () => onFeatureClick && onFeatureClick(props),
        }}
      >
        <Popup>
          <div className="text-sm">
            <p className="font-semibold text-base">{props.NAME}</p>
            <p className="text-gray-600">{props.TYPE}</p>
            {props.POP && (
              <p className="text-gray-500">
                Population: {Number(props.POP).toLocaleString()}
              </p>
            )}
            {props.PCODE && <p className="text-xs text-gray-400">{props.PCODE}</p>}
          </div>
        </Popup>
      </CircleMarker>
    )
  })
}
