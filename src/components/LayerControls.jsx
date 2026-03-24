export function StateMapPanel({
  activeLayers, toggleLayer,
  stateLayerStyle, onStateLayerStyleChange,
  stateColorsEnabled, onStateColorsToggle,
  showStateLabels, onShowStateLabelsToggle,
  plainBackground, onPlainBackgroundChange,
}) {
  const stateActive = activeLayers.has('states')

  const handleColor = (key, value) =>
    onStateLayerStyleChange(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-3">
      {/* Layer toggle */}
      <div>
        <div className="panel-title">Layer</div>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={stateActive} onChange={() => toggleLayer('states')}
            className="accent-blue-600 w-4 h-4" />
          <span className="text-gray-700">States / Regions</span>
        </label>
        {stateActive && (
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none mt-2">
            <input type="checkbox" checked={plainBackground} onChange={e => onPlainBackgroundChange(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Plain background map</span>
          </label>
        )}
      </div>

      {/* Style options */}
      {stateActive && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Boundary Style</div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input type="checkbox" checked={stateColorsEnabled} onChange={e => onStateColorsToggle(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Individual state colors</span>
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input type="checkbox" checked={showStateLabels} onChange={e => onShowStateLabelsToggle(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Show state labels</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24 shrink-0">Fill color</label>
            <input type="color" value={stateLayerStyle.fillColor || '#90A4AE'}
              onChange={e => handleColor('fillColor', e.target.value)}
              className="w-8 h-7 cursor-pointer rounded border border-gray-300" />
            {stateLayerStyle.fillColor && (
              <button onClick={() => handleColor('fillColor', '')} className="text-xs text-gray-400 hover:text-red-500">✕</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24 shrink-0">Border color</label>
            <input type="color" value={stateLayerStyle.borderColor || '#546E7A'}
              onChange={e => handleColor('borderColor', e.target.value)}
              className="w-8 h-7 cursor-pointer rounded border border-gray-300" />
            {stateLayerStyle.borderColor && (
              <button onClick={() => handleColor('borderColor', '')} className="text-xs text-gray-400 hover:text-red-500">✕</button>
            )}
          </div>
          {(stateLayerStyle.fillColor || stateLayerStyle.borderColor) && (
            <button onClick={() => onStateLayerStyleChange({ fillColor: '', borderColor: '' })}
              className="text-xs text-red-500 hover:underline">Reset to defaults</button>
          )}
        </div>
      )}
    </div>
  )
}

const MYANMAR_STATES = [
  'Ayeyarwady','Bago','Chin','Kachin','Kayah','Kayin',
  'Magway','Mandalay','Mon','Nay Pyi Taw','Rakhine',
  'Sagaing','Shan','Tanintharyi','Yangon',
]

export function TownshipMapPanel({
  activeLayers, toggleLayer,
  townshipLayerStyle, onTownshipLayerStyleChange,
  showTownshipLabels, onShowTownshipLabelsToggle,
  selectedStateFilter, onSelectedStateFilterChange,
  showStateBorder, onShowStateBorderToggle,
  stateBorderStyle, onStateBorderStyleChange,
  plainBackground, onPlainBackgroundChange,
}) {
  const townshipActive = activeLayers.has('townships')
  const townsActive = activeLayers.has('towns')

  const handleColor = (key, value) =>
    onTownshipLayerStyleChange(prev => ({ ...prev, [key]: value }))

  const handleBorderColor = (key, value) =>
    onStateBorderStyleChange(prev => ({ ...prev, [key]: value }))

  return (
    <div className="space-y-3">
      {/* Layer toggles */}
      <div>
        <div className="panel-title">Layers</div>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={townshipActive} onChange={() => toggleLayer('townships')}
              className="accent-blue-600 w-4 h-4" />
            <span className="text-gray-700">Townships</span>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={townsActive} onChange={() => toggleLayer('towns')}
              className="accent-blue-600 w-4 h-4" />
            <span className="text-gray-700">Towns &amp; Cities</span>
          </label>
        </div>
        {townshipActive && (
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none mt-2">
            <input type="checkbox" checked={plainBackground} onChange={e => onPlainBackgroundChange(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Plain background map</span>
          </label>
        )}
      </div>

      {/* State filter */}
      {townshipActive && (
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State Filter</div>
          <select
            value={selectedStateFilter}
            onChange={e => onSelectedStateFilterChange(e.target.value)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="All">All States &amp; Regions</option>
            {MYANMAR_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {selectedStateFilter !== 'All' && (
            <button onClick={() => onSelectedStateFilterChange('All')}
              className="text-xs text-red-500 hover:underline">Show all</button>
          )}
        </div>
      )}

      {/* Township style options */}
      {townshipActive && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Township Style</div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input type="checkbox" checked={showTownshipLabels} onChange={e => onShowTownshipLabelsToggle(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Show township labels</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24 shrink-0">Fill color</label>
            <input type="color" value={townshipLayerStyle.fillColor || '#B0BEC5'}
              onChange={e => handleColor('fillColor', e.target.value)}
              className="w-8 h-7 cursor-pointer rounded border border-gray-300" />
            {townshipLayerStyle.fillColor && (
              <button onClick={() => handleColor('fillColor', '')} className="text-xs text-gray-400 hover:text-red-500">✕</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-24 shrink-0">Border color</label>
            <input type="color" value={townshipLayerStyle.borderColor || '#546E7A'}
              onChange={e => handleColor('borderColor', e.target.value)}
              className="w-8 h-7 cursor-pointer rounded border border-gray-300" />
            {townshipLayerStyle.borderColor && (
              <button onClick={() => handleColor('borderColor', '')} className="text-xs text-gray-400 hover:text-red-500">✕</button>
            )}
          </div>
          {(townshipLayerStyle.fillColor || townshipLayerStyle.borderColor) && (
            <button onClick={() => onTownshipLayerStyleChange({ fillColor: '', borderColor: '' })}
              className="text-xs text-red-500 hover:underline">Reset to defaults</button>
          )}
        </div>
      )}

      {/* State border overlay */}
      {townshipActive && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">State Border Overlay</div>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
            <input type="checkbox" checked={showStateBorder} onChange={e => onShowStateBorderToggle(e.target.checked)}
              className="accent-blue-600 w-4 h-4" />
            <span>Show state borders</span>
          </label>
          {showStateBorder && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 w-24 shrink-0">Border color</label>
                <input type="color" value={stateBorderStyle.color || '#37474F'}
                  onChange={e => handleBorderColor('color', e.target.value)}
                  className="w-8 h-7 cursor-pointer rounded border border-gray-300" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 w-24 shrink-0">Border width</label>
                <input type="number" min="1" max="6" step="0.5" value={stateBorderStyle.width || 2}
                  onChange={e => handleBorderColor('width', parseFloat(e.target.value))}
                  className="w-16 text-xs border border-gray-300 rounded px-2 py-1" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
