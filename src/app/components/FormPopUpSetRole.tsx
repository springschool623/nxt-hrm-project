import React, { useEffect, useState } from 'react'
import { User } from '../models/userModel'
import { UserRole } from '../models/userRole'

interface FormPopUpSetRoleProps {
  onClose: () => void
  onUpdateUser: () => void
  user?: User | null
}

const FormPopUpSetRole: React.FC<FormPopUpSetRoleProps> = ({
  onClose,
  onUpdateUser,
  user,
}) => {
  const [formData, setFormData] = useState({
    employeeId: user?.employeeId,
    userRole: user?.userRole || '',
  })
  const [userRoles, setUserRoles] = useState<UserRole[]>([])

  // Function to fetch department names
  const fetchUserRoles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user-roles/list')
      if (response.ok) {
        const data = await response.json()
        setUserRoles(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch user roles.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchUserRoles()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = `http://localhost:5000/api/users/set-role`

      // Update the recentPassword to the newPassword
      const updatedFormData = {
        employeeId: formData.employeeId,
        userRoleType: formData.userRole,
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData), // Only send recentPassword (updated)
      })

      if (response.ok) {
        onClose()
        onUpdateUser()
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
            <div className="w-1/2">
              <label className="block text-gray-700">Employee ID</label>
              <input
                type="employeeId"
                name="employeeId"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.employeeId}
                disabled // Disable editing of email
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">User Role</label>
              <select
                id="userRole"
                name="userRole"
                required
                value={formData.userRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded outline-none"
              >
                <option value="">Select Role</option>
                {userRoles.map((userRole, index) => (
                  <option key={index} value={userRole.userRoleType}>
                    {userRole.userRoleType}
                  </option>
                ))}
              </select>
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

export default FormPopUpSetRole
