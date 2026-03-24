import { useEffect, useState } from 'react'
import { CircleMarker, Tooltip } from 'react-leaflet'
import { TOWN_TYPE_STYLES } from '../utils/colorUtils.js'

export default function TownLayer({ styleMap, onFeatureClick }) {
  const [geojson, setGeojson] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/myanmar_towns.geojson`)
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
    const typeStyle = TOWN_TYPE_STYLES[props.Level] || TOWN_TYPE_STYLES['Other Town']
    const override = styleMap[props.Town_Pcode] || {}

    const fillColor = override.fillColor || typeStyle.color
    const borderColor = override.borderColor || '#ffffff'
    const radius = typeStyle.radius

    return (
      <CircleMarker
        key={props.Town_Pcode}
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
          click: () => onFeatureClick && onFeatureClick({ ...props, PCODE: props.Town_Pcode }),
        }}
      >
        <Tooltip sticky className='state-hover-tooltip'>
          <strong>{props.Town}</strong>
          <br /><span style={{ fontSize: 11 }}>{props.Level} · {props.Township}</span>
        </Tooltip>
      </CircleMarker>
    )
  })
}
