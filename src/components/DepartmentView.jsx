import { useState } from 'react'
import Timeline from './Timeline'
import AddVehicleModal from './AddVehicleModal'
import AddTripModal from './AddTripModal'
import { TRIP_TYPES } from '../utils/timeUtils'

export default function DepartmentView({ department, onUpdateDepartment }) {
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [tripTarget, setTripTarget] = useState(null)

  function addVehicle(vehicle) {
    onUpdateDepartment({
      ...department,
      vehicles: [...department.vehicles, vehicle],
    })
  }

  function deleteVehicle(vehicleId) {
    onUpdateDepartment({
      ...department,
      vehicles: department.vehicles.filter(v => v.id !== vehicleId),
    })
  }

  function addTrip(vehicleId, trip) {
    onUpdateDepartment({
      ...department,
      vehicles: department.vehicles.map(v =>
        v.id === vehicleId ? { ...v, trips: [...v.trips, trip] } : v
      ),
    })
  }

  const totalTrips = department.vehicles.reduce((sum, v) => sum + v.trips.length, 0)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{department.name}</h2>
          <p className="text-xs text-gray-500">
            {department.vehicles.length} bil{department.vehicles.length !== 1 ? 'er' : ''} · {totalTrips} kjøring{totalTrips !== 1 ? 'er' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 mr-2">
            {TRIP_TYPES.map(t => (
              <div key={t.value} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${t.color}`} />
                <span className="text-xs text-gray-500">{t.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAddVehicle(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Legg til bil
          </button>
        </div>
      </div>

      <Timeline
        vehicles={department.vehicles}
        onAddTrip={vehicle => setTripTarget(vehicle)}
        onDeleteVehicle={deleteVehicle}
      />

      {showAddVehicle && (
        <AddVehicleModal
          onClose={() => setShowAddVehicle(false)}
          onAdd={addVehicle}
        />
      )}

      {tripTarget && (
        <AddTripModal
          vehicle={tripTarget}
          onClose={() => setTripTarget(null)}
          onAdd={trip => { addTrip(tripTarget.id, trip); setTripTarget(null) }}
        />
      )}
    </div>
  )
}
