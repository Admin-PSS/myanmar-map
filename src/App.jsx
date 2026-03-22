import { useState } from 'react'
import MapView from './components/MapView.jsx'
import LayerControls from './components/LayerControls.jsx'
import Legend from './components/Legend.jsx'
import AttributeImporter from './components/AttributeImporter.jsx'
import StyleEditor from './components/StyleEditor.jsx'
import { useAttributeData } from './hooks/useAttributeData.js'

export default function App() {
  const [activeLayers, setActiveLayers] = useState(new Set(['states']))
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [showImporter, setShowImporter] = useState(false)

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Map area */}
      <div className="flex-1 relative">
        <MapView
          activeLayers={activeLayers}
          styleMap={styleMap}
          onFeatureClick={handleFeatureClick}
        />
      </div>

      {/* Sidebar */}
      <aside className="sidebar-panel z-10">
        <div className="bg-yellow-600 text-white px-3 py-2 font-bold text-base tracking-wide shrink-0">
          🗺 Myanmar Interactive Map
        </div>

        <div className="panel-section">
          <LayerControls activeLayers={activeLayers} toggleLayer={toggleLayer} />
        </div>

        <div className="panel-section">
          <Legend activeLayers={activeLayers} styleMap={styleMap} />
        </div>

        <div className="panel-section">
          <div className="panel-title">
            <span>Attribute Data</span>
            <button
              onClick={() => setShowImporter(v => !v)}
              className="text-xs text-blue-600 hover:underline"
            >
              {showImporter ? 'Hide' : 'Import'}
            </button>
          </div>
          {showImporter && (
            <AttributeImporter
              loadFromCSV={loadFromCSV}
              loadFromText={loadFromText}
              validationMsg={validationMsg}
              onReset={resetStyles}
              onExport={exportCSV}
            />
          )}
          {!showImporter && validationMsg && (
            <p className="text-xs text-green-700">{validationMsg}</p>
          )}
        </div>

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

        <div className="panel-section mt-auto">
          <p className="text-xs text-gray-400 text-center">
            Click a region to edit its style
          </p>
        </div>
      </aside>
    </div>
  )
}
