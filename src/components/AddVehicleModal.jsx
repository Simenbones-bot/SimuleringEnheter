import { useState } from 'react'
import { generateId } from '../utils/timeUtils'

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

function CostField({ label, unit, value, onChange, type = 'number', placeholder = '0' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label} {unit && <span className="text-gray-400 font-normal">({unit})</span>}
      </label>
      <input
        type={type}
        min={type === 'number' ? '0' : undefined}
        step={type === 'number' ? '1' : undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  )
}

export default function AddVehicleModal({ onClose, onAdd }) {
  const [reg, setReg] = useState('')
  const [model, setModel] = useState('')
  const [desc, setDesc] = useState('')

  const [leasing, setLeasing] = useState('')
  const [insurance, setInsurance] = useState('')
  const [service, setService] = useState('')
  const [tires, setTires] = useState('')
  const [damage, setDamage] = useState('')
  const [parking, setParking] = useState('')
  const [leasingStart, setLeasingStart] = useState('')
  const [euControl, setEuControl] = useState('')
  const [budgetKm, setBudgetKm] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!reg.trim() || !model.trim()) return
    onAdd({
      id: generateId(),
      reg: reg.trim().toUpperCase(),
      model: model.trim(),
      desc: desc.trim(),
      trips: [],
      costs: {
        leasing: leasing ? parseFloat(leasing) : null,
        insurance: insurance ? parseFloat(insurance) : null,
        service: service ? parseFloat(service) : null,
        tires: tires ? parseFloat(tires) : null,
        damage: damage ? parseFloat(damage) : null,
        parking: parking ? parseFloat(parking) : null,
        leasingStart: leasingStart || null,
        euControl: euControl || null,
        budgetKm: budgetKm ? parseFloat(budgetKm) : null,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
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
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Merke / Modell *</label>
            <input
              value={model}
              onChange={e => setModel(e.target.value)}
              placeholder="Ford Transit"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse (valgfri)</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Kort beskrivelse..."
              className={inputCls}
            />
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Kostnader og informasjon</p>
            <div className="grid grid-cols-2 gap-3">
              <CostField label="Leasing kostnader" unit="kr/mnd" value={leasing} onChange={setLeasing} />
              <CostField label="Forsikring" unit="kr/mnd" value={insurance} onChange={setInsurance} />
              <CostField label="Service / vedlikehold" unit="kr/år" value={service} onChange={setService} />
              <CostField label="Dekk / dekkhotell" unit="kr/år" value={tires} onChange={setTires} />
              <CostField label="Skade / erstatninger" unit="kr" value={damage} onChange={setDamage} />
              <CostField label="Parkering" unit="kr/mnd" value={parking} onChange={setParking} />
              <CostField label="Leasing start" type="date" placeholder="" value={leasingStart} onChange={setLeasingStart} />
              <CostField label="EU kontroll" type="date" placeholder="" value={euControl} onChange={setEuControl} />
              <div className="col-span-2">
                <CostField label="Budsjettert kilometer" unit="km/år" value={budgetKm} onChange={setBudgetKm} />
              </div>
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
              Legg til bil
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
