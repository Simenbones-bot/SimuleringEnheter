import { useState } from 'react'
import { DAYS, TRIP_TYPES, generateId } from '../utils/timeUtils'

export default function AddTripModal({ vehicle, onClose, onAdd }) {
  const [type, setType] = useState('fast_rute')
  const [customerName, setCustomerName] = useState('')
  const [km, setKm] = useState('')
  const [revenuePerHour, setRevenuePerHour] = useState('')
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('09:00')
  const [selectedDays, setSelectedDays] = useState([])
  const [staffing, setStaffing] = useState('enkelt')
  const [error, setError] = useState('')

  function toggleDay(key) {
    setSelectedDays(prev =>
      prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
    )
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (selectedDays.length === 0) {
      setError('Velg minst én dag')
      return
    }
    if (start >= end) {
      setError('Sluttidspunkt må være etter starttidspunkt')
      return
    }
    onAdd({
      id: generateId(),
      type,
      customerName: customerName.trim() || null,
      km: km ? parseFloat(km) : null,
      revenuePerHour: revenuePerHour ? parseFloat(revenuePerHour) : null,
      start,
      end,
      days: selectedDays,
      staffing,
    })
    onClose()
  }

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Legg til kjøring</h2>
            <p className="text-sm text-gray-500">{vehicle.reg} – {vehicle.model}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kundenavn</label>
            <input
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Navn på kunde (valgfri)"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type kjøring</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className={inputCls}
              >
                {TRIP_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bemanning</label>
              <select
                value={staffing}
                onChange={e => setStaffing(e.target.value)}
                className={inputCls}
              >
                <option value="enkelt">Enkeltbemannet</option>
                <option value="dobbel">Dobbelt bemannet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kilometer</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={km}
                onChange={e => setKm(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inntekter pr. time (kr/t)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={revenuePerHour}
                onChange={e => setRevenuePerHour(e.target.value)}
                placeholder="0"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starttidspunkt</label>
              <input
                type="time"
                value={start}
                onChange={e => setStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sluttidspunkt</label>
              <input
                type="time"
                value={end}
                onChange={e => setEnd(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Faste dager i uken *</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map(day => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => { toggleDay(day.key); setError('') }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedDays.includes(day.key)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
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
              Lagre kjøring
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
