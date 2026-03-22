import { useRef, useState } from 'react'

export default function AttributeImporter({ loadFromCSV, loadFromText, validationMsg, onReset, onExport }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = async (file) => {
    if (!file) return
    setLoading(true)
    await loadFromCSV(file)
    setLoading(false)
  }

  const handleFileInput = (e) => handleFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSample = async () => {
    setLoading(true)
    try {
      const res = await fetch('/data/sample_attribute_data.csv')
      const text = await res.text()
      loadFromText(text)
    } catch {
      // ignore
    }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      {/* Drag-drop / click zone */}
      <div
        className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <p className="text-xs text-gray-500">
          {loading ? 'Loading…' : 'Drop CSV here or click to browse'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSample}
          className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1"
        >
          Load Sample
        </button>
        <button
          onClick={onExport}
          className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded px-2 py-1"
        >
          Export CSV
        </button>
        <button
          onClick={onReset}
          className="flex-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded px-2 py-1"
        >
          Reset
        </button>
      </div>

      {/* Validation message */}
      {validationMsg && (
        <p className={`text-xs rounded px-2 py-1 ${
          validationMsg.startsWith('✓')
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-600'
        }`}>
          {validationMsg}
        </p>
      )}
    </div>
  )
}
