import { useState, useRef, useCallback } from 'react'
import { STATE_DEFAULT_COLORS, TOWN_TYPE_STYLES, getCategoryColors } from '../utils/colorUtils.js'

export default function Legend({ activeLayers, styleMap, stateColorsEnabled, stateLayerStyle = {}, activeTab }) {
  const [collapsed, setCollapsed] = useState(false)
  const [pos, setPos] = useState({ x: 16, y: 16 })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e) => {
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
  }, [])

  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  const categoryColors = getCategoryColors(Object.values(styleMap))
  const hasCategories = Object.keys(categoryColors).length > 0
  const hasGlobalOverride = !!(stateLayerStyle.fillColor || stateLayerStyle.borderColor)
  const showStateLegend = activeTab === 'state' && activeLayers.has('states') && stateColorsEnabled && !hasGlobalOverride && !hasCategories

  return (
    <div
      className="absolute z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 select-none"
      style={{ left: pos.x, top: pos.y, minWidth: 160, maxWidth: 220 }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Drag handle / title bar */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-t-lg border-b border-gray-200 cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
      >
        <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Legend</span>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => setCollapsed(v => !v)}
          className="text-gray-400 hover:text-gray-600 text-base leading-none ml-2"
        >
          {collapsed ? '▲' : '▼'}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3">
          {showStateLegend && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">States / Regions</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {Object.entries(STATE_DEFAULT_COLORS).map(([pcode, info]) => {
                  const override = styleMap[pcode]
                  const fill = override?.fillColor || info.fill
                  return (
                    <div key={pcode} className="flex items-center text-xs">
                      <span className="legend-swatch" style={{ backgroundColor: fill, borderColor: info.border }} />
                      <span className="truncate text-gray-700">{info.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {hasCategories && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Categories</p>
              <div className="space-y-1">
                {Object.entries(categoryColors).map(([cat, style]) => (
                  <div key={cat} className="flex items-center text-xs">
                    <span className="legend-swatch" style={{ backgroundColor: style.color, borderColor: style.border }} />
                    <span className="text-gray-700">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'state' && activeLayers.has('states') && !showStateLegend && !hasCategories && (
            <p className="text-xs text-gray-400 italic">Import CSV to show legend</p>
          )}

          {activeTab === 'township' && activeLayers.has('townships') && !hasCategories && (
            <p className="text-xs text-gray-400 italic">Import CSV to show legend</p>
          )}

          {activeLayers.has('townships') && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Townships</p>
              <div className="flex items-center text-xs">
                <span className="legend-swatch" style={{ backgroundColor: '#B0BEC5' }} />
                <span className="text-gray-700">Township boundary</span>
              </div>
            </div>
          )}

          {activeLayers.has('towns') && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Towns</p>
              {Object.entries(TOWN_TYPE_STYLES).map(([type, style]) => (
                <div key={type} className="flex items-center text-xs mb-1">
                  <span className="legend-swatch rounded-full" style={{ backgroundColor: style.color }} />
                  <span className="text-gray-700">{type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
