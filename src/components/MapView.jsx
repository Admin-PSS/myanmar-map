import { MapContainer, TileLayer } from 'react-leaflet'
import StateLayer from './StateLayer.jsx'
import TownshipLayer from './TownshipLayer.jsx'
import TownLayer from './TownLayer.jsx'

export default function MapView({ activeLayers, styleMap, onFeatureClick }) {
  return (
    <MapContainer
      center={[19.745, 96.129]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {activeLayers.has('states') && (
        <StateLayer styleMap={styleMap} onFeatureClick={onFeatureClick} />
      )}

      {activeLayers.has('townships') && (
        <TownshipLayer styleMap={styleMap} onFeatureClick={onFeatureClick} />
      )}

      {activeLayers.has('towns') && (
        <TownLayer styleMap={styleMap} onFeatureClick={onFeatureClick} />
      )}
    </MapContainer>
  )
}
