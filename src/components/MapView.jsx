import { MapContainer, TileLayer } from 'react-leaflet'
import StateLayer from './StateLayer.jsx'
import TownshipLayer from './TownshipLayer.jsx'
import TownLayer from './TownLayer.jsx'
import StateBorderLayer from './StateBorderLayer.jsx'

const BASEMAPS = {
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  plain: {
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  },
}

export default function MapView({
  activeLayers, styleMap, onFeatureClick,
  stateLayerStyle, stateColorsEnabled, showStateLabels,
  townshipLayerStyle, showTownshipLabels, selectedStateFilter,
  showStateBorder, stateBorderStyle,
  plainBackground,
}) {
  const hasOverlayLayer = activeLayers.has('states') || activeLayers.has('townships')
  const basemap = (hasOverlayLayer && plainBackground) ? BASEMAPS.plain : BASEMAPS.standard

  return (
    <MapContainer
      center={[19.745, 96.129]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer key={basemap.url} attribution={basemap.attribution} url={basemap.url} />

      {activeLayers.has('states') && (
        <StateLayer styleMap={styleMap} onFeatureClick={onFeatureClick}
          stateLayerStyle={stateLayerStyle} stateColorsEnabled={stateColorsEnabled} showStateLabels={showStateLabels} />
      )}

      {activeLayers.has('townships') && (
        <TownshipLayer styleMap={styleMap} onFeatureClick={onFeatureClick}
          townshipLayerStyle={townshipLayerStyle} showTownshipLabels={showTownshipLabels}
          selectedStateFilter={selectedStateFilter} />
      )}

      {activeLayers.has('townships') && showStateBorder && (
        <StateBorderLayer borderColor={stateBorderStyle.color} borderWidth={stateBorderStyle.width} />
      )}

      {activeLayers.has('towns') && (
        <TownLayer styleMap={styleMap} onFeatureClick={onFeatureClick} />
      )}
    </MapContainer>
  )
}
