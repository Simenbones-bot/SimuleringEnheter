import { useState, useEffect } from 'react'
import { generateId } from '../utils/timeUtils'

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(username, password) {
  return sha256(username.toLowerCase() + password)
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem('varebil-users') || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem('varebil-users', JSON.stringify(users))
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem('varebil-session') || 'null')
  } catch {
    return null
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(loadSession)
  const [allUsers, setAllUsers] = useState(loadUsers)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function seed() {
      const users = loadUsers()
      if (users.length === 0) {
        const hash = await hashPassword('admin', 'Admin123')
        const admin = { id: 'admin', username: 'admin', passwordHash: hash, role: 'admin' }
        saveUsers([admin])
        setAllUsers([admin])
      }
      setReady(true)
    }
    seed()
  }, [])

  async function login(username, password) {
    const users = loadUsers()
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
    if (!user) return false
    const hash = await hashPassword(username, password)
    if (hash !== user.passwordHash) return false
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
    const users = loadUsers()
    if (users.find(u => u.username.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: 'Brukernavnet er allerede i bruk' }
    }
    const hash = await hashPassword(trimmed, password)
    const newUser = { id: generateId(), username: trimmed, passwordHash: hash, role: 'user' }
    const updated = [...users, newUser]
    saveUsers(updated)
    setAllUsers(updated)
    return { ok: true }
  }

  function deleteUser(userId) {
    const users = loadUsers()
    const updated = users.filter(u => u.id !== userId)
    saveUsers(updated)
    setAllUsers(updated)
    // Clean up the user's data
    localStorage.removeItem(`varebil-departments-${userId}`)
    localStorage.removeItem(`varebil-active-dept-${userId}`)
  }

  return { currentUser, allUsers, ready, login, logout, createUser, deleteUser }
}
