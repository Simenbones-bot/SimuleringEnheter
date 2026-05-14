import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

function readLocal(key, fallback) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function useUserData(userId) {
  const [departments, setDepartmentsState] = useState(() => readLocal(`varebil-departments-${userId}`, []))
  const [activeDeptId, setActiveDeptIdState] = useState(() => readLocal(`varebil-active-dept-${userId}`, null))
  const [syncing, setSyncing] = useState(false)
  const saveTimer = useRef(null)
  const latestDepts = useRef(departments)
  const latestActive = useRef(activeDeptId)

  // Load from Supabase on mount
  useEffect(() => {
    if (!supabase || !userId) return
    setSyncing(true)
    supabase
      .from('user_data')
      .select('departments, active_dept_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          const depts = data.departments ?? []
          const active = data.active_dept_id ?? null
          setDepartmentsState(depts)
          setActiveDeptIdState(active)
          writeLocal(`varebil-departments-${userId}`, depts)
          writeLocal(`varebil-active-dept-${userId}`, active)
          latestDepts.current = depts
          latestActive.current = active
        }
        setSyncing(false)
      })
  }, [userId])

  function scheduleSave(depts, active) {
    if (!supabase || !userId) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      supabase
        .from('user_data')
        .upsert({ user_id: userId, departments: depts, active_dept_id: active, updated_at: new Date().toISOString() })
        .then(({ error }) => { if (error) console.error('Supabase upsert feil:', error) })
    }, 500)
  }

  function setDepartments(updater) {
    setDepartmentsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeLocal(`varebil-departments-${userId}`, next)
      latestDepts.current = next
      scheduleSave(next, latestActive.current)
      return next
    })
  }

  function setActiveDeptId(value) {
    setActiveDeptIdState(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      writeLocal(`varebil-active-dept-${userId}`, next)
      latestActive.current = next
      scheduleSave(latestDepts.current, next)
      return next
    })
  }

  return { departments, setDepartments, activeDeptId, setActiveDeptId, syncing }
}
