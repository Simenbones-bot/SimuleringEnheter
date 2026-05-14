import { useState } from 'react'
import { DAYS, TRIP_TYPES, timeToMinutes, minutesToPercent, getTripColorHex } from '../utils/timeUtils'

const LABEL_COL = 160
const HOURS = Array.from({ length: 25 }, (_, i) => i)

function Tooltip({ trip, style }) {
  const typeLabel = TRIP_TYPES.find(t => t.value === trip.type)?.label || trip.type
  const staffingLabel = trip.staffing === 'dobbel' ? 'Dobbelt bemannet' : 'Enkeltbemannet'
  return (
    <div
      className="absolute z-30 bg-gray-900 text-white text-xs rounded-lg p-2.5 shadow-xl pointer-events-none whitespace-nowrap"
      style={style}
    >
      {trip.customerName && <div className="font-semibold mb-1">{trip.customerName}</div>}
      <div className="text-gray-300">{typeLabel} · {staffingLabel}</div>
      <div className="text-gray-300">{trip.start} – {trip.end}</div>
      {trip.km != null && <div className="text-gray-300">{trip.km} km</div>}
      {trip.revenuePerHour != null && <div className="text-gray-300">{trip.revenuePerHour} kr/t</div>}
    </div>
  )
}

function TripBlock({ trip, dayKey }) {
  const [hovering, setHovering] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  if (!trip.days.includes(dayKey)) return null

  const startMin = timeToMinutes(trip.start)
  const endMin = timeToMinutes(trip.end)
  const left = minutesToPercent(startMin)
  const width = minutesToPercent(endMin - startMin)
  const color = getTripColorHex(trip.type)

  function handleMouseMove(e) {
    const rect = e.currentTarget.closest('.day-cell').getBoundingClientRect()
    setPos({
      x: e.clientX - rect.left + 8,
      y: e.clientY - rect.top - 60,
    })
  }

  return (
    <div
      className="absolute top-1 bottom-1 rounded cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%`, backgroundColor: color }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="px-1 text-white text-xs font-medium truncate block leading-5 select-none">
        {trip.customerName || trip.start}
      </span>
      {hovering && (
        <Tooltip trip={trip} style={{ left: pos.x, top: pos.y }} />
      )}
    </div>
  )
}

function DayCell({ vehicle, dayKey, onAddTrip }) {
  return (
    <div className="day-cell relative border-r border-gray-200 h-10 bg-white hover:bg-blue-50/30 transition-colors group">
      {vehicle.trips.map(trip => (
        <TripBlock key={trip.id} trip={trip} dayKey={dayKey} />
      ))}
    </div>
  )
}

function VehicleRow({ vehicle, onAddTrip, onDeleteVehicle }) {
  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50/50">
      <div
        className="shrink-0 flex items-center gap-2 px-3 border-r border-gray-200 bg-gray-50"
        style={{ width: LABEL_COL }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-800 truncate">{vehicle.reg}</div>
          <div className="text-xs text-gray-500 truncate">{vehicle.model}</div>
        </div>
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            onClick={() => onAddTrip(vehicle)}
            title="Legg til kjøring"
            className="w-5 h-5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors"
          >
            +
          </button>
          <button
            onClick={() => onDeleteVehicle(vehicle.id)}
            title="Slett bil"
            className="w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 rounded text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {DAYS.map(day => (
          <DayCell key={day.key} vehicle={vehicle} dayKey={day.key} onAddTrip={onAddTrip} />
        ))}
      </div>
    </div>
  )
}

export default function Timeline({ vehicles, onAddTrip, onDeleteVehicle }) {
  return (
    <div className="flex-1 overflow-x-auto overflow-y-auto">
      <div className="min-w-[900px]">
        <div className="flex border-b-2 border-gray-300 sticky top-0 bg-white z-10 shadow-sm">
          <div className="shrink-0 border-r border-gray-200 bg-gray-50" style={{ width: LABEL_COL }} />
          <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAYS.map(day => (
              <div key={day.key} className="text-center py-2 text-xs font-semibold text-gray-600 border-r border-gray-200 uppercase tracking-wide">
                {day.fullLabel}
              </div>
            ))}
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-[37px] z-10">
          <div className="shrink-0 border-r border-gray-200" style={{ width: LABEL_COL }} />
          <div className="flex-1 grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {DAYS.map(day => (
              <div key={day.key} className="relative h-5 border-r border-gray-200 overflow-hidden">
                {HOURS.map(h => (
                  h % 3 === 0 && h < 24 ? (
                    <span
                      key={h}
                      className="absolute text-[9px] text-gray-400 font-mono -translate-x-1/2"
                      style={{ left: `${(h / 24) * 100}%`, top: 3 }}
                    >
                      {String(h).padStart(2, '0')}
                    </span>
                  ) : null
                ))}
                {HOURS.slice(0, 24).map(h => (
                  <div
                    key={h}
                    className={`absolute top-0 bottom-0 border-l ${h % 6 === 0 ? 'border-gray-300' : 'border-gray-200'}`}
                    style={{ left: `${(h / 24) * 100}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Ingen biler ennå – legg til en bil for å komme i gang
          </div>
        ) : (
          vehicles.map(v => (
            <VehicleRow
              key={v.id}
              vehicle={v}
              onAddTrip={onAddTrip}
              onDeleteVehicle={onDeleteVehicle}
            />
          ))
        )}
      </div>
    </div>
  )
}
