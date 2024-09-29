import React, { useEffect, useState } from 'react'
import { Employee } from '../models/employeeModel'

interface FormPopUpSetSalaryProps {
  onClose: () => void
  onSetSalary: () => void
  employee?: Employee | null
}

const FormPopUpSetSalary: React.FC<FormPopUpSetSalaryProps> = ({
  onClose,
  onSetSalary,
  employee,
}) => {
  const [formData, setFormData] = useState({
    employeeId: employee?.employeeId || '',
    salary: employee?.salary || 0,
  })
  const [employees, setEmployees] = useState<Employee[]>([])

  // Fetch the list of employees
  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/current-employee-list`
      )
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        console.error('Failed to fetch employee list.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Update salary when employeeId changes
  useEffect(() => {
    const selectedEmployee = employees.find(
      (emp) => emp.employeeId === formData.employeeId
    )
    if (selectedEmployee) {
      setFormData((prevData) => ({
        ...prevData,
        salary: selectedEmployee.salary || 0,
      }))
    }
  }, [formData.employeeId, employees])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = `http://localhost:5000/api/employees/set-salary`

      const updatedFormData = {
        employeeId: formData.employeeId,
        salary: formData.salary,
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      })

      if (response.ok) {
        onClose()
        onSetSalary()
      } else {
        console.error('Failed to update employee salary.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[5px]">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center text-xl pb-2 mb-4 border-b border-border">
          Set Employee Salary
        </h2>
        <form
          className="px-2 overflow-auto max-h-[60vh] cus-scrollbar"
          onSubmit={handleSubmit}
        >
          <div className="mb-4 flex justify-between gap-2">
            <div className="w-2/3">
              <label className="block text-gray-700">Employee ID</label>
              <select
                id="employeeId"
                name="employeeId"
                required
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded outline-none"
              >
                <option value="">Select Employee</option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee.employeeId}>
                    {employee.employeeId}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700">Salary</label>
              <input
                type="number"
                name="salary"
                className="w-full px-3 py-2 border rounded outline-none"
                value={formData.salary}
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
              {employee ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPopUpSetSalary
