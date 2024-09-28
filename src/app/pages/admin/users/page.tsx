import React, { useState, useEffect } from 'react'
import FormPopUp from '@/app/components/FormPopUp'
import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@/app/models/userModel'

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const totalItems = filteredUsers.length
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null) // State cho user role hiện tại

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/list')
      const data = await response.json()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((user: any) => ({
        employeeId: user.employeeId,
        name: user.employeeInfo?.name || 'Unknown', // Lấy từ employeeInfo
        email: user.employeeInfo?.email || user.email, // Ưu tiên email từ employeeInfo nếu có
        userRole: user.userRoleType,
        createDate: new Date(user.createdAt).toLocaleDateString(),
        employeeRole: user.employeeInfo?.role || 'Unknown', // Lấy role từ employeeInfo
        avatar: user.employeeInfo?.avatar || 'default-avatar-url', // Nếu không có avatar, dùng avatar mặc định
      }))
      setUsers(transformedData)
      setFilteredUsers(transformedData)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  useEffect(() => {
    // Lấy userRole từ localStorage khi component mount
    const userRoleFromStorage = localStorage.getItem('userRole')
    setCurrentUserRole(userRoleFromStorage)
    console.log(userRoleFromStorage)

    // Fetch users
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.createDate?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    setIsDeleting(true) // Bắt đầu quá trình xóa, hiển thị loading
    try {
      // Delay 5 giây trước khi thực hiện xóa
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(
        `http://localhost:5000/api/users/delete/${employeeId}`,
        {
          method: 'DELETE',
        }
      )
      if (response.ok) {
        // Xóa nhân viên thành công, cập nhật lại danh sách nhân viên
        const updatedUsers = users.filter(
          (user) => user.employeeId !== employeeId
        )
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('An error occurred while deleting the user')
    } finally {
      setIsDeleting(false) // Kết thúc quá trình xóa, tắt loading
    }
  }

  const handleEditUser = async (employeeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${employeeId}`
      )
      if (response.ok) {
        const userData = await response.json()
        setEditingUser(userData) // Lưu thông tin nhân viên vào state
        setShowPopUp(true) // Hiển thị popup chỉnh sửa
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }

  // Hàm xử lý thêm nhân viên mới
  const handleAddEmployee = () => {
    fetchUsers()
  }
  const canPerformAction =
    currentUserRole === 'Super Admin' || currentUserRole === 'Admin'

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6">All Users</h1>
        <div className="w-full">
          {isDeleting && <p>Loading...</p>}
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
            {currentUsers.length > 0 ? (
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
                      Email
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      User Role
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Create Date
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Role
                    </th>
                    {canPerformAction && (
                      <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.avatar}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.userRole}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.createDate}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.employeeRole}
                      </td>
                      {canPerformAction && (
                        <td className="flex gap-x-2 py-4 px-6 border-b border-grey-light">
                          <button
                            className="w-9 h-8 rounded bg-blue-500"
                            onClick={() => handleEditUser(user.employeeId)}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-white"
                            />
                          </button>
                          <button
                            className="w-9 h-8 rounded bg-red-600"
                            onClick={() =>
                              handleDeleteEmployee(user.employeeId)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              className="text-white"
                            />
                          </button>
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
        {currentUsers.length > 0 && (
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
      {showPopUp && (
        <FormPopUp
          onClose={togglePopUp}
          onAddEmployee={handleAddEmployee}
          employee={editingUser} // Truyền dữ liệu nhân viên đang chỉnh sửa
        />
      )}
    </div>
  )
}

export default Users
