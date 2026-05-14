import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Fyll inn brukernavn og passord')
      return
    }
    setLoading(true)
    setError('')
    const ok = await onLogin(username, password)
    if (!ok) {
      setError('Feil brukernavn eller passord')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚐</div>
          <h1 className="text-2xl font-bold text-white">Varebil-simulator</h1>
          <p className="text-gray-400 text-sm mt-1">Logg inn for å fortsette</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brukernavn</label>
              <input
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="brukernavn"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passord</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Logger inn...' : 'Logg inn'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
