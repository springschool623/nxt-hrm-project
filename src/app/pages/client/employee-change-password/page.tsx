import Header from '@/app/components/Header'
import BodyLayout from '@/app/layout/BodyLayout'
import { LeaveType } from '@/app/models/leaveTypeModel'
import { User } from '@/app/models/userModel'
import React, { useState, useEffect } from 'react'

const EmployeeChangePassword = () => {
  const [startDate, setStartDate] = useState('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const employeeId = localStorage.getItem('employeeId')
  const email = localStorage.getItem('email')
  const password = localStorage.getItem('password')

  const [formData, setFormData] = useState({
    employeeId: employeeId || '',
    email: email || '',
    recentPassword: password || '', // Track the recent password entered
    newPassword: '', // New password field
    confirmPassword: '', // Confirm password field
  })

  const [users, setUsers] = useState<User[]>([])

  // Function to fetch department names
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/list')
      if (response.ok) {
        const data = await response.json()
        setUsers(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch users.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if new passwords match before submission
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New Password and Confirm New Password do not match!')
      return
    }

    try {
      const url = `http://localhost:5000/api/users/change-password`

      // Update the recentPassword to the newPassword
      const updatedFormData = {
        employeeId: formData.employeeId,
        password: formData.newPassword, // Set recentPassword to the new password
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData), // Only send recentPassword (updated)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Success:', data)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setFormData({
          employeeId: employeeId || '',
          email: '',
          recentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        console.error('Failed to update employee password.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <div className="flex flex-col items-center w-full h-full p-12 bg-white">
          <h1 className="text-3xl text-black pb-6">Employee Leave Requests</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-2/4 h-2/4 m-6 gap-3 rounded"
          >
            <div className="flex">
              <div className="flex flex-col gap-2">
                <label htmlFor="employeeId" hidden>
                  Employee ID:
                </label>
                <input
                  hidden
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="recentPassword">Recent Password:</label>
                <input
                  type="text"
                  id="recentPassword"
                  name="recentPassword"
                  value={formData.recentPassword}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  min={formData.confirmPassword} // Set min to the selected startDate
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-transparent hover:text-blue-600 border border-blue-600">
              Submit
            </button>
          </form>
        </div>
        {/* Nội dung hiện tại của bạn */}
        {isSending && (
          <div className="loading-wrapper">
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          </div>
        )}
      </BodyLayout>
    </div>
  )
}

export default EmployeeChangePassword
