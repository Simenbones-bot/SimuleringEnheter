import { useState } from 'react'
import { generateId } from '../utils/timeUtils'

export default function Sidebar({ departments, activeDeptId, currentUser, onSelect, onAdd, onDelete, onLogout, onOpenUserMgmt }) {
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    onAdd({ id: generateId(), name, vehicles: [] })
    setNewName('')
    setAdding(false)
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">Varebil-simulator</h1>
        <p className="text-xs text-gray-400 mt-0.5">Avdelingsplanlegger</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {departments.map(dept => (
          <div
            key={dept.id}
            className={`group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
              dept.id === activeDeptId
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onSelect(dept.id)}
          >
            <span className="text-sm font-medium truncate">{dept.name}</span>
            <button
              onClick={e => { e.stopPropagation(); onDelete(dept.id) }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 ml-2 text-xs leading-none transition-opacity"
              title="Slett avdeling"
            >
              ✕
            </button>
          </div>
        ))}

        {departments.length === 0 && (
          <p className="text-gray-500 text-xs px-3 py-2">Ingen avdelinger ennå</p>
        )}
      </nav>

      <div className="p-3 border-t border-gray-700 space-y-2">
        {adding ? (
          <div className="space-y-2">
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
              placeholder="Avdelingsnavn..."
              className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
              >
                Legg til
              </button>
              <button
                onClick={() => { setAdding(false); setNewName('') }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1.5 rounded transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            + Ny avdeling
          </button>
        )}

        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenUserMgmt}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium py-1.5 rounded-lg transition-colors"
          >
            Administrer brukere
          </button>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-gray-700">
          <div className="text-xs text-gray-400 truncate">
            <span className="text-gray-500">Innlogget som</span><br />
            <span className="text-gray-200 font-medium">{currentUser?.username}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-white transition-colors ml-2 shrink-0"
            title="Logg ut"
          >
            Logg ut
          </button>
        </div>
      </div>
    </aside>
  )
}
