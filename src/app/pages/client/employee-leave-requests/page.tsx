import Header from '@/app/components/Header'
import BodyLayout from '@/app/layout/BodyLayout'
import React, { useState, useEffect } from 'react'

const EmployeeLeaveRequests = () => {
  const [startDate, setStartDate] = useState('')

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
            action=""
            method="post"
            className="flex flex-col w-2/4 h-2/4 m-6 gap-3 rounded"
          >
            <div className="flex gap-5">
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="employeeId">Employee ID:</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                />
              </div>
              <div className="flex flex-col w-1/2 gap-2">
                <label htmlFor="leaveType">Leave Type:</label>
                <select
                  id="leaveType"
                  name="leaveType"
                  required
                  className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
                >
                  <option value="">Casual Leave</option>
                  <option value="">Medical Leave</option>
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
                  value={startDate} // Gán giá trị ngày hiện tại
                  onChange={(e) => setStartDate(e.target.value)} // Cập nhật khi người dùng thay đổi
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
      </BodyLayout>
    </div>
  )
}

export default EmployeeLeaveRequests
