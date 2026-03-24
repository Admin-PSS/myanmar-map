import { useState } from 'react'
import MapView from './components/MapView.jsx'
import { StateMapPanel, TownshipMapPanel } from './components/LayerControls.jsx'
import Legend from './components/Legend.jsx'
import AttributeImporter from './components/AttributeImporter.jsx'
import StyleEditor from './components/StyleEditor.jsx'
import { useAttributeData } from './hooks/useAttributeData.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('state')
  const [activeLayers, setActiveLayers] = useState(new Set(['states']))
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [showImporter, setShowImporter] = useState(false)
  const [stateLayerStyle, setStateLayerStyle] = useState({ fillColor: '', borderColor: '' })
  const [stateColorsEnabled, setStateColorsEnabled] = useState(true)
  const [showStateLabels, setShowStateLabels] = useState(true)
  const [townshipLayerStyle, setTownshipLayerStyle] = useState({ fillColor: '', borderColor: '' })
  const [showTownshipLabels, setShowTownshipLabels] = useState(false)
  const [selectedStateFilter, setSelectedStateFilter] = useState('All')
  const [showStateBorder, setShowStateBorder] = useState(true)
  const [stateBorderStyle, setStateBorderStyle] = useState({ color: '#37474F', width: 2 })
  const [plainBackground, setPlainBackground] = useState(true)

  const { styleMap, validationMsg, loadFromCSV, loadFromText, updateFeatureStyle, resetStyles, exportCSV } =
    useAttributeData()

  const toggleLayer = (layer) => {
    setActiveLayers(prev => {
      const next = new Set(prev)
      next.has(layer) ? next.delete(layer) : next.add(layer)
      return next
    })
  }

  const handleFeatureClick = (props) => {
    setSelectedFeature(props)
    setShowStyleEditor(true)
  }

  const handleStyleSave = (pcode, styleObj) => {
    updateFeatureStyle(pcode, styleObj)
    setShowStyleEditor(false)
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setShowImporter(false)
    setShowStyleEditor(false)
    if (tab === 'state') {
      setActiveLayers(prev => {
        const next = new Set(prev)
        next.add('states')
        next.delete('townships')
        return next
      })
    } else {
      setActiveLayers(prev => {
        const next = new Set(prev)
        next.add('townships')
        next.delete('states')
        return next
      })
    }
  }

  const tabs = [
    { id: 'state',    label: 'State Map' },
    { id: 'township', label: 'Township Map' },
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map area */}
      <div className="flex-1 relative">
        <MapView
          activeLayers={activeLayers}
          styleMap={styleMap}
          onFeatureClick={handleFeatureClick}
          stateLayerStyle={stateLayerStyle}
          stateColorsEnabled={stateColorsEnabled}
          showStateLabels={showStateLabels}
          townshipLayerStyle={townshipLayerStyle}
          showTownshipLabels={showTownshipLabels}
          selectedStateFilter={selectedStateFilter}
          showStateBorder={showStateBorder}
          stateBorderStyle={stateBorderStyle}
          plainBackground={plainBackground}
        />
        <Legend
          activeLayers={activeLayers}
          styleMap={styleMap}
          stateColorsEnabled={stateColorsEnabled}
          stateLayerStyle={stateLayerStyle}
          activeTab={activeTab}
        />
      </div>

      {/* Sidebar */}
      <aside className="sidebar-panel z-10">
        {/* Header */}
        <div className="bg-yellow-600 text-white px-3 py-2 font-bold text-base tracking-wide shrink-0">
          🗺 Myanmar Interactive Map
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 shrink-0">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={`flex-1 text-xs font-semibold py-2 transition-colors ${
                activeTab === t.id
                  ? 'text-yellow-700 border-b-2 border-yellow-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'state' && (
            <>
              <div className="panel-section">
                <StateMapPanel
                  activeLayers={activeLayers}
                  toggleLayer={toggleLayer}
                  stateLayerStyle={stateLayerStyle}
                  onStateLayerStyleChange={setStateLayerStyle}
                  stateColorsEnabled={stateColorsEnabled}
                  onStateColorsToggle={setStateColorsEnabled}
                  showStateLabels={showStateLabels}
                  onShowStateLabelsToggle={setShowStateLabels}
                  plainBackground={plainBackground}
                  onPlainBackgroundChange={setPlainBackground}
                />
              </div>
              <div className="panel-section">
                <div className="panel-title">
                  <span>Attribute Data</span>
                  <button onClick={() => setShowImporter(v => !v)} className="text-xs text-blue-600 hover:underline">
                    {showImporter ? 'Hide' : 'Import'}
                  </button>
                </div>
                {showImporter && (
                  <AttributeImporter
                    loadFromCSV={loadFromCSV} loadFromText={loadFromText}
                    validationMsg={validationMsg} onReset={resetStyles} onExport={exportCSV}
                    sampleUrl={`${import.meta.env.BASE_URL}data/sample_attribute_data.csv`}
                  />
                )}
                {!showImporter && validationMsg && <p className="text-xs text-green-700">{validationMsg}</p>}
              </div>
            </>
          )}

          {activeTab === 'township' && (
            <>
              <div className="panel-section">
                <TownshipMapPanel
                  activeLayers={activeLayers}
                  toggleLayer={toggleLayer}
                  townshipLayerStyle={townshipLayerStyle}
                  onTownshipLayerStyleChange={setTownshipLayerStyle}
                  showTownshipLabels={showTownshipLabels}
                  onShowTownshipLabelsToggle={setShowTownshipLabels}
                  selectedStateFilter={selectedStateFilter}
                  onSelectedStateFilterChange={setSelectedStateFilter}
                  showStateBorder={showStateBorder}
                  onShowStateBorderToggle={setShowStateBorder}
                  stateBorderStyle={stateBorderStyle}
                  onStateBorderStyleChange={setStateBorderStyle}
                  plainBackground={plainBackground}
                  onPlainBackgroundChange={setPlainBackground}
                />
              </div>
              <div className="panel-section">
                <div className="panel-title">
                  <span>Attribute Data</span>
                  <button onClick={() => setShowImporter(v => !v)} className="text-xs text-blue-600 hover:underline">
                    {showImporter ? 'Hide' : 'Import'}
                  </button>
                </div>
                {showImporter && (
                  <AttributeImporter
                    loadFromCSV={loadFromCSV} loadFromText={loadFromText}
                    validationMsg={validationMsg} onReset={resetStyles} onExport={exportCSV}
                    sampleUrl={`${import.meta.env.BASE_URL}data/sample_township_data.csv`}
                  />
                )}
                {!showImporter && validationMsg && <p className="text-xs text-green-700">{validationMsg}</p>}
              </div>
            </>
          )}

          {showStyleEditor && selectedFeature && (
            <div className="panel-section">
              <StyleEditor
                feature={selectedFeature}
                currentStyle={styleMap[selectedFeature.PCODE] || {}}
                onSave={handleStyleSave}
                onClose={() => setShowStyleEditor(false)}
              />
            </div>
          )}

          <div className="panel-section">
            <p className="text-xs text-gray-400 text-center">Click a region to edit its style</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
