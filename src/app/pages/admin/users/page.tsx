import React, { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faCircleUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from '@/app/models/userModel'
import Image from 'next/image'
import FormPopUpChangePassword from '@/app/components/FormPopUpChangePassword'
import FormPopUpSetRole from '@/app/components/FormPopUpSetRole'

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
  const [showPopUpChangePass, setShowPopUpChangePass] = useState<boolean>(false)
  const [showPopUpSetRole, setShowPopUpSetRole] = useState<boolean>(false)

  const totalItems = filteredUsers.length
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null) // State cho user role hiện tại
  const [currentRoleLevel, setCurrentRoleLevel] = useState<number | null>(null) // State cho user role hiện tại

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
        avatar: user.employeeInfo?.avatar, // Nếu không có avatar, dùng avatar mặc định
        roleLevel: user.roleLevel,
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

    // Fetch users
    fetchUsers()
  }, [])

  // Hàm xử lý thêm nhân viên mới
  const handleUpdateUsers = () => {
    fetchUsers()
  }

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employeeRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.createDate?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  // Fetch userRoleLevel from localStorage and user roles on component mount
  useEffect(() => {
    const userRoleLevelFromStorage = localStorage.getItem('roleLevel')
    setCurrentRoleLevel(
      userRoleLevelFromStorage ? Number(userRoleLevelFromStorage) : null
    )
    console.log(userRoleLevelFromStorage)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleChangePassword = async (employeeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${employeeId}`
      )
      if (response.ok) {
        const userData = await response.json()
        setEditingUser(userData) // Lưu thông tin nhân viên vào state
        setShowPopUpChangePass(true) // Hiển thị popup chỉnh sửa
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    }
  }

  const handleSetRole = async (employeeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${employeeId}`
      )
      if (response.ok) {
        const userData = await response.json()
        setEditingUser(userData) // Lưu thông tin nhân viên vào state
        setShowPopUpSetRole(true) // Hiển thị popup chỉnh sửa
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

  const togglePopUpChangePass = () => {
    setShowPopUpChangePass(!showPopUpChangePass)
  }
  const togglePopUpSetRole = () => {
    setShowPopUpSetRole(!showPopUpSetRole)
  }

  const canPerformAction =
    currentUserRole === 'Super Admin' || currentUserRole === 'Admin'
  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6">All Users</h1>
        <div className="w-full">
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
                        <Image
                          src={user.avatar || '/images/realmadrid.jpg'}
                          alt="Avatar"
                          width={400}
                          height={400}
                          className="w-12 h-12 rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.name}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.email}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        <div
                          className={`w-fit px-2 py-1 rounded-md uppercase text-sm	${
                            user.userRole === 'Super Admin'
                              ? 'text-super-admin'
                              : user.userRole === 'Admin'
                              ? 'text-admin'
                              : user.userRole === 'HR'
                              ? 'text-hr'
                              : 'text-employee'
                          }`}
                        >
                          {user.userRole}
                        </div>
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.createDate}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {user.employeeRole}
                      </td>
                      {canPerformAction && (
                        <td className="py-4 px-6 border-b border-grey-light">
                          {(currentRoleLevel !== null &&
                            user.roleLevel !== null &&
                            currentRoleLevel >= user.roleLevel) ||
                          user.roleLevel == 0 ? null : ( // Không hiển thị button nếu currentRoleLevel >= user.roleLevel
                            // Hiển thị button nếu currentRoleLevel < user.roleLevel
                            <div className="flex gap-x-2">
                              <button
                                className="flex items-center justify-center w-9 h-8 rounded hover:bg-blue-500 hover:text-white border border-blue-500 text-blue-500"
                                onClick={() =>
                                  handleChangePassword(user.employeeId)
                                }
                              >
                                <FontAwesomeIcon icon={faLock} />
                              </button>
                              <button
                                className="flex items-center justify-center w-9 h-8 rounded hover:bg-black hover:text-white border border-black text-black"
                                onClick={() => handleSetRole(user.employeeId)}
                              >
                                <FontAwesomeIcon icon={faCircleUser} />
                              </button>
                            </div>
                          )}
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
      </BodyLayout>
      {showPopUpSetRole && (
        <FormPopUpSetRole
          onUpdateUser={handleUpdateUsers}
          onClose={togglePopUpSetRole}
          user={editingUser} // Truyền dữ liệu nhân viên đang chỉnh sửa
        />
      )}
      {showPopUpChangePass && (
        <FormPopUpChangePassword
          onClose={togglePopUpChangePass}
          user={editingUser} // Truyền dữ liệu nhân viên đang chỉnh sửa
        />
      )}
    </div>
  )
}

export default Users
