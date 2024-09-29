import Header from '@/app/components/Header'
import BodyLayout from '@/app/layout/BodyLayout'
import { LeaveType } from '@/app/models/leaveTypeModel'
import React, { useState, useEffect } from 'react'

const EmployeeLeaveRequests = () => {
  const [startDate, setStartDate] = useState('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const employeeId = localStorage.getItem('employeeId')

  const [formData, setFormData] = useState({
    employeeId: employeeId || '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  })

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])

  // Function to fetch department names
  const fetchLeaveTypes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave-types/list')
      if (response.ok) {
        const data = await response.json()
        setLeaveTypes(data) // Assuming data is an array of department names
      } else {
        console.error('Failed to fetch leave types.')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Fetch departments when the component mounts
  useEffect(() => {
    fetchLeaveTypes()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSending(true) // Bắt đầu quá trình xóa, hiển thị loading
    e.preventDefault()
    try {
      // Replace with your API endpoint
      const response = await fetch(
        'http://localhost:5000/api/leave-requests/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error(
          'Something went wrong while submitting the leave request.'
        )
      }

      const data = await response.json()
      console.log('Success:', data)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setFormData({
        employeeId: employeeId || '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit leave request. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  // Thiết lập ngày hiện tại khi component được mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0] // Lấy ngày hiện tại dưới dạng YYYY-MM-DD
    setStartDate(today)
  }, [])

  // Thiết lập ngày hiện tại khi component được mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0] // Lấy ngày hiện tại dưới dạng YYYY-MM-DD
    setStartDate(today)
  }, [])

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
                <label htmlFor="leaveType">Leave Type:</label>
                <select
                  id="leaveType"
                  name="leaveType"
                  required
                  value={formData.leaveType} // Bind to formData state
                  onChange={handleChange} // Add the onChange handler
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((leaveType, index) => (
                    <option key={index} value={leaveType.leaveType}>
                      {leaveType.leaveType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="startDate">From:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  min={startDate}
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="endDate">To:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  min={formData.startDate} // Set min to the selected startDate
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="reason">Reason:</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={(
                    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                  ) => handleChange(e)}
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                ></textarea>
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

export default EmployeeLeaveRequests
