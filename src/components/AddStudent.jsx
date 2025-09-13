import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddStudent({setStudents, showNotification}) {
  const [fullName, setFullName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('') // New state for email

  const handleAddStudent = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('students')
      .insert([
        { full_name: fullName, roll_no: rollNo, class: studentClass, dob: dob, email: email } // Add email here
      ])
      .select()
    if (error) {
      showNotification('Failed to add student: ' + error.message, 'error')
    } else if (data && data[0]) {
      showNotification('Student added successfully!', 'success')
      setStudents((prev) => [...prev, data[0]])

      // Send welcome email via Node.js backend
      try {
        const emailResponse = await fetch('http://localhost:3001/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email, fullName: fullName, rollNo: rollNo }),
        });

        const emailData = await emailResponse.json();
        if (!emailResponse.ok) {
          console.error('Failed to send welcome email:', emailData.error);
          showNotification('Failed to send welcome email: ' + emailData.error, 'error');
        } else {
          showNotification('Welcome email sent successfully!', 'success');
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        showNotification('Error sending welcome email.', 'error');
      }

      setFullName('')
      setRollNo('')
      setStudentClass('')
      setDob('')
      setEmail('') // Clear email field
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
