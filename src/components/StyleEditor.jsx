import { useState, useEffect } from 'react'

export default function StyleEditor({ feature, currentStyle, onSave, onClose }) {
  const [style, setStyle] = useState({
    fillColor: '#66BB6A',
    borderColor: '#2E7D32',
    borderWidth: 2,
    label: '',
    labelColor: '#222222',
    category: '',
    description: '',
  })

  useEffect(() => {
    setStyle({
      fillColor:   currentStyle.fillColor   || '#66BB6A',
      borderColor: currentStyle.borderColor || '#2E7D32',
      borderWidth: currentStyle.borderWidth ?? 2,
      label:       currentStyle.label       || '',
      labelColor:  currentStyle.labelColor  || '#222222',
      category:    currentStyle.category    || '',
      description: currentStyle.description || '',
    })
  }, [feature, currentStyle])

  const set = (key) => (e) => setStyle(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = () => onSave(feature.PCODE, style)

  const featureName = feature.ST || feature.TS || feature.NAME || feature.PCODE

  return (
    <div>
      <div className="panel-title">
        <span>Edit: {featureName}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
      </div>

      <p className="text-xs text-gray-400 mb-2">{feature.PCODE}</p>

      <div className="space-y-2">
        {/* Fill color */}
        <div>
          <label className="style-label">Fill Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={style.fillColor} onChange={set('fillColor')}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0" />
            <input type="text" value={style.fillColor} onChange={set('fillColor')}
              className="style-input flex-1" placeholder="#66BB6A" />
          </div>
        </div>

        {/* Border color */}
        <div>
          <label className="style-label">Border Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={style.borderColor} onChange={set('borderColor')}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0" />
            <input type="text" value={style.borderColor} onChange={set('borderColor')}
              className="style-input flex-1" placeholder="#2E7D32" />
          </div>
        </div>

        {/* Border width */}
        <div>
          <label className="style-label">Border Width</label>
          <input type="number" min="0" max="10" step="0.5" value={style.borderWidth}
            onChange={set('borderWidth')} className="style-input" />
        </div>

        {/* Label */}
        <div>
          <label className="style-label">Label</label>
          <input type="text" value={style.label} onChange={set('label')}
            className="style-input" placeholder="Custom label" />
        </div>

        {/* Label color */}
        <div>
          <label className="style-label">Label Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={style.labelColor} onChange={set('labelColor')}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0" />
            <input type="text" value={style.labelColor} onChange={set('labelColor')}
              className="style-input flex-1" placeholder="#222222" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="style-label">Category</label>
          <input type="text" value={style.category} onChange={set('category')}
            className="style-input" placeholder="e.g. Highland" />
        </div>

        {/* Description */}
        <div>
          <label className="style-label">Description</label>
          <textarea value={style.description} onChange={set('description')}
            className="style-input resize-none" rows={2} placeholder="Optional notes" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded py-1"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded py-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
