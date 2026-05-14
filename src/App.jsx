import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useUserData } from './hooks/useSupabaseStorage'
import Sidebar from './components/Sidebar'
import DepartmentView from './components/DepartmentView'
import LoginScreen from './components/LoginScreen'
import UserManagementModal from './components/UserManagementModal'

export default function App() {
  const { currentUser, allUsers, ready, login, logout, createUser, deleteUser } = useAuth()
  const [showUserMgmt, setShowUserMgmt] = useState(false)

  const userId = currentUser?.userId || '__none__'
  const { departments, setDepartments, activeDeptId, setActiveDeptId, syncing } = useUserData(userId)

  const activeDept = departments.find(d => d.id === activeDeptId) || null

  if (!ready) return null

  if (!currentUser) {
    return <LoginScreen onLogin={login} />
  }

  function addDepartment(dept) {
    setDepartments(prev => [...prev, dept])
    setActiveDeptId(dept.id)
  }

  function deleteDepartment(id) {
    setDepartments(prev => {
      const next = prev.filter(d => d.id !== id)
      if (activeDeptId === id) setActiveDeptId(next[0]?.id || null)
      return next
    })
  }

  function updateDepartment(updated) {
    setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        departments={departments}
        activeDeptId={activeDeptId}
        currentUser={currentUser}
        syncing={syncing}
        onSelect={setActiveDeptId}
        onAdd={addDepartment}
        onDelete={deleteDepartment}
        onLogout={logout}
        onOpenUserMgmt={() => setShowUserMgmt(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        {activeDept ? (
          <DepartmentView
            department={activeDept}
            onUpdateDepartment={updateDepartment}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="text-5xl mb-4">🚐</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Ingen avdeling valgt</h2>
            <p className="text-gray-500 text-sm max-w-sm">
              Opprett en ny avdeling i menyen til venstre, eller velg en eksisterende avdeling for å se tidslinjen.
            </p>
          </div>
        )}
      </main>

      {showUserMgmt && currentUser.role === 'admin' && (
        <UserManagementModal
          currentUser={currentUser}
          allUsers={allUsers}
          onClose={() => setShowUserMgmt(false)}
          onCreateUser={createUser}
          onDeleteUser={deleteUser}
        />
      )}
    </div>
  )
}
