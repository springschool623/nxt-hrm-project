import React, { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LeaveRequest } from '@/app/models/leaveRequestModel'
import Image from 'next/image'

const LeaveRequests: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [filteredLeaveRequests, setFilteredLeaveRequests] =
    useState<LeaveRequest[]>(leaveRequests)
  const totalItems = filteredLeaveRequests.length
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null) // State cho user role hiện tại

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/leave-requests/pending-request-list'
      )
      const data = await response.json()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((leaveRequest: any) => ({
        requestId: leaveRequest.requestId,
        employeeId: leaveRequest.employeeId,
        leaveType: leaveRequest.leaveType,
        startDate: new Date(leaveRequest.startDate).toLocaleDateString(),
        endDate: new Date(leaveRequest.endDate).toLocaleDateString(),
        reason: leaveRequest.reason,
        avatar: leaveRequest.employeeInfo?.avatar || '/images/realmadrid.jpg',
        name: leaveRequest.employeeInfo?.name || 'Unknown',
      }))
      setLeaveRequests(transformedData)
      setFilteredLeaveRequests(transformedData)
    } catch (error) {
      console.error('Failed to fetch leave requests:', error)
    }
  }

  useEffect(() => {
    // Lấy userRole từ localStorage khi component mount
    const userRoleFromStorage = localStorage.getItem('userRole')
    setCurrentUserRole(userRoleFromStorage)
    console.log(userRoleFromStorage)

    // Fetch users
    fetchLeaveRequests()
  }, [])

  useEffect(() => {
    const filtered = leaveRequests.filter(
      (leaveRequest) =>
        leaveRequest.employeeId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leaveRequest.leaveType
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leaveRequest.startDate
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leaveRequest.endDate
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leaveRequest.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leaveRequest.avatar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leaveRequest.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLeaveRequests(filtered)
  }, [searchTerm, leaveRequests])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleApprovedRequest = async (requestId: string) => {
    setIsDeleting(true) // Bắt đầu quá trình xóa, hiển thị loading
    try {
      // Delay 2 giây trước khi thực hiện xóa
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(
        `http://localhost:5000/api/leave-requests/approve/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'approved' }), // Cập nhật trạng thái thành inactive
        }
      )
      if (response.ok) {
        // Xóa nhân viên thành công, cập nhật lại danh sách nhân viên
        const updatedLeaveRequests = leaveRequests.filter((leaveRequest) =>
          leaveRequest.requestId === requestId
            ? { ...leaveRequest, status: 'approved' } // Cập nhật trạng thái trong danh sách hiện tại
            : leaveRequest
        )
        setLeaveRequests(updatedLeaveRequests)
        setFilteredLeaveRequests(updatedLeaveRequests)
        console.log(requestId)
      }
    } catch (error) {
      console.error('Failed to approve request: ', error)
      alert('An error occurred while approving the request')
    } finally {
      setIsDeleting(false) // Kết thúc quá trình xóa, tắt loading
      fetchLeaveRequests()
    }
  }

  const handleRejectedRequest = async (requestId: string) => {
    setIsDeleting(true) // Bắt đầu quá trình xóa, hiển thị loading
    try {
      // Delay 2 giây trước khi thực hiện xóa
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(
        `http://localhost:5000/api/leave-requests/rejected/${requestId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'rejected' }), // Cập nhật trạng thái thành inactive
        }
      )
      if (response.ok) {
        // Xóa nhân viên thành công, cập nhật lại danh sách nhân viên
        const updatedLeaveRequests = leaveRequests.filter((leaveRequest) =>
          leaveRequest.requestId === requestId
            ? { ...leaveRequest, status: 'rejected' } // Cập nhật trạng thái trong danh sách hiện tại
            : leaveRequest
        )
        setLeaveRequests(updatedLeaveRequests)
        setFilteredLeaveRequests(updatedLeaveRequests)
        console.log(requestId)
      }
    } catch (error) {
      console.error('Failed to reject request: ', error)
      alert('An error occurred while rejecting the request')
    } finally {
      setIsDeleting(false) // Kết thúc quá trình xóa, tắt loading
      fetchLeaveRequests()
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const indexOfLastLeaveRequest = currentPage * itemsPerPage
  const indexOfFirstLeaveRequest = indexOfLastLeaveRequest - itemsPerPage
  const currentLeaveRequests = filteredLeaveRequests.slice(
    indexOfFirstLeaveRequest,
    indexOfLastLeaveRequest
  )

  const canPerformAction =
    currentUserRole === 'Super Admin' || currentUserRole === 'Admin'

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6">Pending Leave Requests</h1>
        <div className="w-full">
          {/* Hiển thị Loading khi đang xóa */}
          <div className="flex justify-end mt-8 gap-2">
            <input
              type="text"
              className="px-4 py-2 w-60 outline-none rounded border border-blue-400 font-light"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-5 py-2 rounded bg-red-600 text-white hover:bg-transparent hover:text-red-600 border border-red-600"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          </div>
          <div className="bg-white overflow-auto mt-4">
            {currentLeaveRequests.length > 0 ? (
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Avatar
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Name
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Employee ID
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Leave Type
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Date
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Reason
                    </th>
                    {canPerformAction && (
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentLeaveRequests.map((leaveRequest, index) => (
                    <tr key={index} className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">
                        <Image
                          src={leaveRequest.avatar}
                          alt="Avatar"
                          width={400}
                          height={400}
                          className="w-12 h-12 rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {leaveRequest.name}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {leaveRequest.employeeId}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {leaveRequest.leaveType}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {leaveRequest.startDate} to {leaveRequest.endDate}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {leaveRequest.reason}
                      </td>
                      {canPerformAction && (
                        <td className="py-4 px-6 border-b border-grey-light">
                          <div className="flex gap-x-2">
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() =>
                                handleApprovedRequest(leaveRequest.requestId)
                              }
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                              onClick={() =>
                                handleRejectedRequest(leaveRequest.requestId)
                              }
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4">
                There are no records to display
              </p>
            )}
          </div>
        </div>
        {currentLeaveRequests.length > 0 && (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
        {/* Nội dung hiện tại của bạn */}
        {isDeleting && (
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

export default LeaveRequests
