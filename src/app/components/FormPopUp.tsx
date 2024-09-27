import React, { useState } from 'react'
import { Employee } from '../models/employeeModel'
import Image from 'next/image'

interface FormPopUpProps {
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAddEmployee: (newEmployee: any) => void
  employee?: Employee | null
}

const FormPopUp: React.FC<FormPopUpProps> = ({
  onClose,
  onAddEmployee,
  employee,
}) => {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    employeeId: employee?.employeeId || '',
    phone: employee?.phone || '',
    joinDate: employee?.joinDate || '',
    role: employee?.role || '',
    avatar: employee?.avatar || '', // Avatar URL or file path
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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
        const updatedEmployee = await response.json()
        onClose()
        onAddEmployee(updatedEmployee)
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

          {/* Other input fields */}
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-1/2">
              <label className="block text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.email}
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
              <label className="block text-gray-700">Role</label>
              <input
                type="text"
                name="role"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.role}
                onChange={handleChange}
              />
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
          {/* Social Media Links */}
          {/* <div className="mb-4 grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <label className="block text-gray-700">Facebook</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Twitter</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">LinkedIn</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Instagram</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded outline-none"
              />
            </div>
          </div> */}
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

export default FormPopUp
