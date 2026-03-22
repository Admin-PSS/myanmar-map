import { useState } from 'react'
import { STATE_DEFAULT_COLORS, TOWN_TYPE_STYLES, getCategoryColors } from '../utils/colorUtils.js'

export default function Legend({ activeLayers, styleMap }) {
  const [collapsed, setCollapsed] = useState(false)

  const categoryColors = getCategoryColors(Object.values(styleMap))
  const hasCategories = Object.keys(categoryColors).length > 0

  return (
    <div>
      <div className="panel-title">
        <span>Legend</span>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="text-xs text-blue-600 hover:underline"
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-3">
          {activeLayers.has('states') && !hasCategories && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">States / Regions</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {Object.entries(STATE_DEFAULT_COLORS).map(([pcode, info]) => {
                  const override = styleMap[pcode]
                  const fill = override?.fillColor || info.fill
                  return (
                    <div key={pcode} className="flex items-center text-xs">
                      <span
                        className="legend-swatch"
                        style={{ backgroundColor: fill, borderColor: info.border }}
                      />
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
                    <span
                      className="legend-swatch"
                      style={{ backgroundColor: style.color, borderColor: style.border }}
                    />
                    <span className="text-gray-700">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
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
                  <span
                    className="legend-swatch rounded-full"
                    style={{ backgroundColor: style.color }}
                  />
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
