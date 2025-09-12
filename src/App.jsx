import { useState, useEffect } from 'react'
import Login from './components/Login'
import AddStudent from './components/AddStudent'
import Students from './components/Students'
import Notification from './components/Notification'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState(null)
  const [students, setStudents] = useState([])
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch students initially
  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from('students').select('*')
      if (error) console.error('Error fetching students:', error)
      else setStudents(data)
    }
    fetchStudents()
  }, [])

  return (
    <div className="flex gap-8 p-6">
      {!session ? (
        <Login />
      ) : (
        <div className="container mx-auto">
          <header className="bg-gray-800 p-4 text-white flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Student Management</h1>
            <span className="text-sm">{session.user.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                setSession(null)
                showNotification('Logged out successfully!', 'success')
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </header>
          <div className="flex gap-8 p-6">
            <div className="w-1/3">
              <AddStudent setStudents={setStudents} showNotification={showNotification} />
            </div>
            <div className="w-2/3">
              <Students students={students} setStudents={setStudents} showNotification={showNotification} />
            </div>
          </div>
        </div>
      )}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  )
}

export default App
