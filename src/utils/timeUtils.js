export const DAYS = [
  { key: 'mon', label: 'Man', fullLabel: 'Mandag' },
  { key: 'tue', label: 'Tir', fullLabel: 'Tirsdag' },
  { key: 'wed', label: 'Ons', fullLabel: 'Onsdag' },
  { key: 'thu', label: 'Tor', fullLabel: 'Torsdag' },
  { key: 'fri', label: 'Fre', fullLabel: 'Fredag' },
  { key: 'sat', label: 'Lør', fullLabel: 'Lørdag' },
  { key: 'sun', label: 'Søn', fullLabel: 'Søndag' },
]

export const TRIP_TYPES = [
  { value: 'fast_rute', label: 'Fast rute', color: 'bg-purple-500' },
  { value: 'annet', label: 'Annet', color: 'bg-orange-500' },
]

export function getTripColor(type) {
  const found = TRIP_TYPES.find(t => t.value === type)
  return found ? found.color : 'bg-gray-500'
}

export function getTripColorHex(type) {
  const map = {
    fast_rute: '#a855f7',
    annet: '#f97316',
  }
  return map[type] || '#6b7280'
}

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToPercent(minutes) {
  return (minutes / (24 * 60)) * 100
}

export function formatTime(time) {
  return time
}

export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
