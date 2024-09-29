import React, { useEffect, useState } from 'react'
import { Employee } from '../models/employeeModel'
import { Department } from '../models/departmentModel'

interface FormPopUpAddManagerProps {
  onClose: () => void
  onAddManager: () => void
  department?: Department | null
}

const FormPopUpAddManager: React.FC<FormPopUpAddManagerProps> = ({
  onClose,
  onAddManager,
  department,
}) => {
  const [formData, setFormData] = useState({
    departmentName: department?.departmentName,
    manager: department?.manager || '',
  })
  const [employees, setEmployees] = useState<Employee[]>([])

  // Function to fetch department names
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/employees-by-department/${formData.departmentName}`
      )
      if (response.ok) {
        const data = await response.json()
        setEmployees(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch user roles.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchEmployees()
    console.log(formData.departmentName)
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
      const url = `http://localhost:5000/api/departments/set-manager`

      // Update the recentPassword to the newPassword
      const updatedFormData = {
        departmentName: formData.departmentName,
        manager: formData.manager,
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
        onAddManager()
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
          Set Manager
        </h2>
        <form
          className="px-2 overflow-auto max-h-[60vh] cus-scrollbar"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Employee ID</label>
              <input
                type="departmentName"
                name="departmentName"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.departmentName}
                disabled // Disable editing of email
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">User Role</label>
              <select
                id="manager"
                name="manager"
                required
                value={formData.manager}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded outline-none"
              >
                <option value="">Select Role</option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee.employeeId}>
                    {employee.employeeId}
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

export default FormPopUpAddManager
