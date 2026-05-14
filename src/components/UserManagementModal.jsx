import { useState } from 'react'

export default function UserManagementModal({ currentUser, allUsers, onClose, onCreateUser, onDeleteUser }) {
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const result = await onCreateUser(newUsername, newPassword)
    setLoading(false)
    if (result.ok) {
      setSuccess(`Brukeren "${newUsername.trim()}" ble opprettet`)
      setNewUsername('')
      setNewPassword('')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Brukeradministrasjon</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Eksisterende brukere</h3>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
              {allUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-800 font-medium">{user.username}</span>
                    {user.role === 'admin' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">admin</span>
                    )}
                    {user.id === currentUser.userId && (
                      <span className="text-xs text-gray-400">(deg)</span>
                    )}
                  </div>
                  {user.id !== currentUser.userId && (
                    <button
                      onClick={() => {
                        if (confirm(`Slett brukeren "${user.username}"? All data tilknyttet denne brukeren slettes permanent.`)) {
                          onDeleteUser(user.id)
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Slett
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Opprett ny bruker</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">{error}</div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-lg">{success}</div>
              )}
              <input
                value={newUsername}
                onChange={e => { setNewUsername(e.target.value); setError(''); setSuccess('') }}
                placeholder="Brukernavn"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); setSuccess('') }}
                placeholder="Passord"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                {loading ? 'Oppretter...' : 'Opprett bruker'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
