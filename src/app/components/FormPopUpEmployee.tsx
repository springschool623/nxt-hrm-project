import React, { useEffect, useState } from 'react'
import { Employee } from '../models/employeeModel'
import Image from 'next/image'
import { Department } from '@/app/models/departmentModel'
import { EmployeeRole } from '../models/employeeRoles'

interface FormPopUpEmployeeProps {
  onClose: () => void
  onAddEmployee: () => void
  employee?: Employee | null
}

const FormPopUpEmployee: React.FC<FormPopUpEmployeeProps> = ({
  onClose,
  onAddEmployee,
  employee,
}) => {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    employeeId: employee?.employeeId || '',
    phone: employee?.phone || '',
    joinDate: employee?.joinDate || new Date().toISOString().split('T')[0], // Default to current date if no employee
    role: employee?.role || '',
    department: employee?.department || '',
    avatar: employee?.avatar || '', // Avatar URL or file path
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [employeeRoles, setEmployeeRoles] = useState<EmployeeRole[]>([])

  // Function to fetch department names
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/departments/list')
      if (response.ok) {
        const data = await response.json()
        setDepartments(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch departments.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Function to fetch department names
  const fetchEmployeeRoles = async (department: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee-roles/by-department/${department}`
      )
      if (response.ok) {
        const data = await response.json()
        setEmployeeRoles(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch employee roles.')
        console.log(department)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchDepartments()
  }, [])

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    // Handle department change
    if (name === 'department') {
      // Update department in form data
      setFormData({ ...formData, [name]: value })

      console.log(formData.department)
      // Fetch employee roles based on new department
      if (value) {
        fetchEmployeeRoles(value)
      }

      // Clear the role field if the department changes
      setFormData((prevData) => ({
        ...prevData,
        role: '', // Reset role whenever department changes
      }))
    } else {
      // Update other fields
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a local URL for preview or further usage
      const avatarUrl = URL.createObjectURL(file)
      setFormData({ ...formData, avatar: avatarUrl })

      console.log(avatarUrl)
      // Optionally: Handle file upload logic here (e.g., upload to cloud storage)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let url = 'http://localhost:5000/api/employees/add'
      let method = 'POST'

      if (employee) {
        url = `http://localhost:5000/api/employees/update/${employee.employeeId}`
        method = 'PUT'
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onClose()
        onAddEmployee()
      } else {
        console.error('Failed to submit employee.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px] ">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-xl pb-2 mb-4 border-b border-border">
          {employee ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <form
          className="px-2 overflow-auto max-h-[60vh] cus-scrollbar"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div hidden>
              <label className="block text-gray-700">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.employeeId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between gap-2">
            <div className="w-full">
              <label className="block text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Other input fields */}
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Join Date</label>
              <input
                type="date"
                name="joinDate"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4 flex justify-between gap-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Department</label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((department, index) => (
                  <option key={index} value={department.departmentName}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded outline-none"
              >
                <option value="">Select Role</option>
                {employeeRoles.map((employeeRole, index) => (
                  <option key={index} value={employeeRole.roleName}>
                    {employeeRole.roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-gray-700">Upload Avatar</label>
            <div className="flex items-center border rounded">
              {formData.avatar && (
                <Image
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="h-16 w-16 m-4 rounded object-cover"
                  width={200}
                  height={200}
                />
              )}
              <input
                type="file"
                className="w-full px-3 py-2  outline-none"
                onChange={handleFileChange}
              />
            </div>
            {!formData.avatar && (
              <small className="block text-gray-500 mt-1">
                Upload your avatar here.
              </small>
            )}
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
              {employee ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPopUpEmployee
