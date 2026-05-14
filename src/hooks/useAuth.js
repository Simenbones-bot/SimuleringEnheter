import { useState, useEffect } from 'react'
import { generateId } from '../utils/timeUtils'
import { supabase } from '../lib/supabase'

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(username, password) {
  return sha256(username.toLowerCase() + password)
}

// localStorage fallback helpers (used when Supabase is not configured)
function loadLocalUsers() {
  try { return JSON.parse(localStorage.getItem('varebil-users') || '[]') } catch { return [] }
}
function saveLocalUsers(users) {
  localStorage.setItem('varebil-users', JSON.stringify(users))
}
function loadSession() {
  try { return JSON.parse(localStorage.getItem('varebil-session') || 'null') } catch { return null }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(loadSession)
  const [allUsers, setAllUsers] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function seed() {
      if (supabase) {
        const { data: users, error } = await supabase.from('app_users').select('id, username, role')
        if (!error) {
          setAllUsers(users ?? [])
          if ((users ?? []).length === 0) {
            const hash = await hashPassword('admin', 'Admin123')
            await supabase.from('app_users').insert({ id: 'admin', username: 'admin', password_hash: hash, role: 'admin' })
            setAllUsers([{ id: 'admin', username: 'admin', role: 'admin' }])
          }
          setReady(true)
          return
        }
      }
      // Fallback: localStorage
      const users = loadLocalUsers()
      if (users.length === 0) {
        const hash = await hashPassword('admin', 'Admin123')
        const admin = { id: 'admin', username: 'admin', passwordHash: hash, role: 'admin' }
        saveLocalUsers([admin])
        setAllUsers([admin])
      } else {
        setAllUsers(users)
      }
      setReady(true)
    }
    seed()
  }, [])

  async function login(username, password) {
    const hash = await hashPassword(username, password)

    if (supabase) {
      const { data: user, error } = await supabase
        .from('app_users')
        .select('id, username, role, password_hash')
        .ilike('username', username.trim())
        .maybeSingle()
      if (!error && user) {
        if (user.password_hash !== hash) return false
        const session = { userId: user.id, username: user.username, role: user.role }
        localStorage.setItem('varebil-session', JSON.stringify(session))
        setCurrentUser(session)
        return true
      }
      if (!error) return false
      // Supabase error — fall through to localStorage
    }

    // Fallback: localStorage
    const users = loadLocalUsers()
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
    if (!user || user.passwordHash !== hash) return false
    const session = { userId: user.id, username: user.username, role: user.role }
    localStorage.setItem('varebil-session', JSON.stringify(session))
    setCurrentUser(session)
    return true
  }

  function logout() {
    localStorage.removeItem('varebil-session')
    setCurrentUser(null)
  }

  async function createUser(username, password) {
    const trimmed = username.trim()
    if (!trimmed || !password) return { ok: false, error: 'Brukernavn og passord er påkrevd' }

    if (supabase) {
      const hash = await hashPassword(trimmed, password)
      const newUser = { id: generateId(), username: trimmed, password_hash: hash, role: 'user' }
      const { error } = await supabase.from('app_users').insert(newUser)
      if (error) {
        if (error.code === '23505') return { ok: false, error: 'Brukernavnet er allerede i bruk' }
        return { ok: false, error: 'Kunne ikke opprette bruker: ' + error.message }
      }
      setAllUsers(prev => [...prev, { id: newUser.id, username: newUser.username, role: newUser.role }])
      return { ok: true }
    }

    // Fallback: localStorage
    const users = loadLocalUsers()
    if (users.find(u => u.username.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: 'Brukernavnet er allerede i bruk' }
    }
    const hash = await hashPassword(trimmed, password)
    const newUser = { id: generateId(), username: trimmed, passwordHash: hash, role: 'user' }
    const updated = [...users, newUser]
    saveLocalUsers(updated)
    setAllUsers(updated)
    return { ok: true }
  }

  async function deleteUser(userId) {
    if (supabase) {
      await supabase.from('app_users').delete().eq('id', userId)
      await supabase.from('user_data').delete().eq('user_id', userId)
      setAllUsers(prev => prev.filter(u => u.id !== userId))
      return
    }
    // Fallback: localStorage
    const users = loadLocalUsers()
    saveLocalUsers(users.filter(u => u.id !== userId))
    setAllUsers(prev => prev.filter(u => u.id !== userId))
    localStorage.removeItem(`varebil-departments-${userId}`)
    localStorage.removeItem(`varebil-active-dept-${userId}`)
  }

  return { currentUser, allUsers, ready, login, logout, createUser, deleteUser }
}
