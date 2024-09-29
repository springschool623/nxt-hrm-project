import React, { useState } from 'react'
import { User } from '../models/userModel'

interface FormPopUpChangePasswordProps {
  onClose: () => void
  user?: User | null
}

const FormPopUpChangePassword: React.FC<FormPopUpChangePasswordProps> = ({
  onClose,
  user,
}) => {
  const [formData, setFormData] = useState({
    employeeId: user?.employeeId,
    email: user?.email || '',
    recentPassword: user?.password, // Track the recent password entered
    newPassword: '', // New password field
    confirmPassword: '', // Confirm password field
  })

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
        onClose() // Close the popup after successful update
      } else {
        console.error('Failed to update employee password.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px]">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-xl pb-2 mb-4 border-b border-border">
          Change Password
        </h2>
        <form
          className="px-2 overflow-auto max-h-[60vh] cus-scrollbar"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.email}
                disabled // Disable editing of email
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-gray-700">Recent Password</label>
              <input
                type="text"
                name="recentPassword"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.recentPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between gap-2">
            <div className="w-1/2">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-400 border border-gray-400 hover:bg-gray-400 hover:text-white rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-transparent hover:text-blue-600 border border-blue-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPopUpChangePassword
