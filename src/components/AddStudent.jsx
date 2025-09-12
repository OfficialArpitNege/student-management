import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddStudent({setStudents, showNotification}) {
  const [fullName, setFullName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [dob, setDob] = useState('')

  const handleAddStudent = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('students')
      .insert([
        { full_name: fullName, roll_no: rollNo, class: studentClass, dob: dob }
      ])
      .select()
    if (error) {
      showNotification('Failed to add student: ' + error.message, 'error')
    } else if (data && data[0]) {
      showNotification('Student added successfully!', 'success')
      setStudents((prev) => [...prev, data[0]])
      setFullName('')
      setRollNo('')
      setStudentClass('')
      setDob('')
    } else {
      showNotification('Student added but no data returned', 'error')
    }

  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleAddStudent} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Class"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Add Student
        </button>
      </form>
    </div>
  )
}
