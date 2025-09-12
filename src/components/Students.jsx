import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function Students({students, setStudents, showNotification}) {
  const [editingStudent, setEditingStudent] = useState(null)
  const [editedStudentData, setEditedStudentData] = useState(null)

  const handleDeleteStudent = async (id) => {
    const { error } = await supabase.from('students').delete().match({ id })

    if (error) {
      showNotification('Error deleting student: ' + error.message, 'error')
    } else {
      setStudents((prevStudents) => prevStudents.filter((s) => s.id !== id))
      showNotification('Student deleted successfully!', 'success')
    }
  }

  const handleEditStudent = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('students')
      .update(editedStudentData)
      .match({ id: editingStudent })
      .select()

    if (error) {
      showNotification('Error updating student: ' + error.message, 'error')
    } else if (data && data[0]) {
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.id === editingStudent ? data[0] : s))
      )
      setEditingStudent(null)
      setEditedStudentData(null)
      showNotification('Student updated successfully!', 'success')
    } else {
      showNotification('Student updated but no data returned', 'error')
    }
  }

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Students List</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">Roll No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Class</th>
              <th className="border border-gray-300 px-4 py-2 text-left">DOB</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="odd:bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out">
                {editingStudent === s.id ? (
                  <td colSpan="5" className="border border-gray-300 px-4 py-2">
                    <form onSubmit={handleEditStudent} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={editedStudentData.roll_no}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            roll_no: e.target.value,
                          })
                        }
                        className="p-1 border rounded w-24"
                        required
                      />
                      <input
                        type="text"
                        value={editedStudentData.full_name}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            full_name: e.target.value,
                          })
                        }
                        className="p-1 border rounded w-40"
                        required
                      />
                      <input
                        type="text"
                        value={editedStudentData.class}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            class: e.target.value,
                          })
                        }
                        className="p-1 border rounded w-24"
                        required
                      />
                      <input
                        type="date"
                        value={editedStudentData.dob}
                        onChange={(e) =>
                          setEditedStudentData({
                            ...editedStudentData,
                            dob: e.target.value,
                          })
                        }
                        className="p-1 border rounded w-32"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 text-sm ml-2"
                      >
                        Cancel
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="border border-gray-300 px-4 py-2">{s.roll_no}</td>
                    <td className="border border-gray-300 px-4 py-2">{s.full_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{s.class}</td>
                    <td className="border border-gray-300 px-4 py-2">{s.dob}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 text-sm"
                        onClick={() => {
                          setEditingStudent(s.id)
                          setEditedStudentData(s)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 text-sm ml-2"
                        onClick={() => handleDeleteStudent(s.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
