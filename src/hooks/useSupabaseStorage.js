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
  const saveEnabled = useRef(false)

  // Load from Supabase when userId changes
  useEffect(() => {
    saveEnabled.current = false
    if (!supabase || !userId || userId === '__none__') {
      saveEnabled.current = true
      return
    }
    setSyncing(true)
    console.log('[Supabase] Laster data for bruker:', userId)
    supabase
      .from('user_data')
      .select('departments, active_dept_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('[Supabase] Last feil:', error)
        if (!error && data) {
          console.log('[Supabase] Data lastet:', data.departments?.length, 'avdelinger')
          const depts = data.departments ?? []
          const active = data.active_dept_id ?? null
          setDepartmentsState(depts)
          setActiveDeptIdState(active)
          writeLocal(`varebil-departments-${userId}`, depts)
          writeLocal(`varebil-active-dept-${userId}`, active)
        }
        saveEnabled.current = true
        setSyncing(false)
      })
  }, [userId])

  // Save to Supabase on changes (debounced, only after initial load)
  useEffect(() => {
    if (!supabase || !userId || userId === '__none__') return
    if (!saveEnabled.current) return
    const timer = setTimeout(() => {
      console.log('[Supabase] Lagrer', departments.length, 'avdelinger for bruker:', userId)
      supabase
        .from('user_data')
        .upsert({ user_id: userId, departments, active_dept_id: activeDeptId, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('[Supabase] Lagre feil:', error)
          else console.log('[Supabase] Lagret OK')
        })
    }, 500)
    return () => clearTimeout(timer)
  }, [departments, activeDeptId, userId])

  function setDepartments(updater) {
    setDepartmentsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeLocal(`varebil-departments-${userId}`, next)
      return next
    })
  }

  function setActiveDeptId(value) {
    setActiveDeptIdState(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      writeLocal(`varebil-active-dept-${userId}`, next)
      return next
    })
  }

  return { departments, setDepartments, activeDeptId, setActiveDeptId, syncing }
}
