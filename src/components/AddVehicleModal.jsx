import { useState } from 'react'
import { generateId } from '../utils/timeUtils'

export default function AddVehicleModal({ onClose, onAdd }) {
  const [reg, setReg] = useState('')
  const [model, setModel] = useState('')
  const [desc, setDesc] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!reg.trim() || !model.trim()) return
    onAdd({
      id: generateId(),
      reg: reg.trim().toUpperCase(),
      model: model.trim(),
      desc: desc.trim(),
      trips: [],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Legg til bil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registreringsnummer *</label>
            <input
              autoFocus
              value={reg}
              onChange={e => setReg(e.target.value)}
              placeholder="EK 12345"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merke / Modell *</label>
            <input
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Ford Transit"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse (valgfri)</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Kort beskrivelse..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Legg til bil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
