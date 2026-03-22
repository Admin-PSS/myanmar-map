export default function LayerControls({ activeLayers, toggleLayer }) {
  const layers = [
    { id: 'states',    label: 'States / Regions' },
    { id: 'townships', label: 'Townships' },
    { id: 'towns',     label: 'Towns & Cities' },
  ]

  return (
    <div>
      <div className="panel-title">Layers</div>
      <div className="space-y-1">
        {layers.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={activeLayers.has(id)}
              onChange={() => toggleLayer(id)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
