import React, { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Department } from '@/app/models/departmentModel'
import FormPopUpAddManager from '@/app/components/FormPopUpAddManager'

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  )
  const [filteredDepartments, setFilteredDepartments] =
    useState<Department[]>(departments)
  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const totalItems = filteredDepartments.length
  const [currentRoleLevel, setCurrentRoleLevel] = useState<number | null>(null) // State cho user role hiện tại

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/departments/list')
      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((department: any) => ({
        departmentName: department.departmentName,
        manager: department?.manager || 'Unknown',
        totalEmployee: department?.totalEmployee || 0,
      }))
      setDepartments(transformedData)
      setFilteredDepartments(transformedData)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }
  useEffect(() => {
    fetchDepartments()
  }, [])

  useEffect(() => {
    const filtered = departments.filter(
      (department) =>
        department.departmentName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        department.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.totalEmployee
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    setFilteredDepartments(filtered)
  }, [searchTerm, departments])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleEditDepartment = async (departmentName: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/departments/${departmentName}`
      )
      if (response.ok) {
        const departmentData = await response.json()
        setEditingDepartment(departmentData) // Lưu thông tin nhân viên vào state
        setShowPopUp(true) // Hiển thị popup chỉnh sửa
      }
    } catch (error) {
      console.error('Failed to fetch department details:', error)
    }
  }

  // Fetch userRoleLevel from localStorage and user roles on component mount
  useEffect(() => {
    const userRoleLevelFromStorage = localStorage.getItem('roleLevel')
    setCurrentRoleLevel(
      userRoleLevelFromStorage ? Number(userRoleLevelFromStorage) : null
    )
    console.log(userRoleLevelFromStorage)
  }, [])

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const indexOfLastDepartment = currentPage * itemsPerPage
  const indexOfFirstDepartment = indexOfLastDepartment - itemsPerPage
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  )

  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }

  // Hàm xử lý thêm nhân viên mới
  const handleAddManager = () => {
    fetchDepartments()
  }

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6">All Departments</h1>
        <div className="w-full">
          <div className="flex justify-end gap-2">
            <button
              onClick={togglePopUp}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 border border-blue-600"
              disabled={isDeleting} // Disable nút khi đang xóa
            >
              Set Manager
            </button>
          </div>
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
            {currentDepartments.length > 0 ? (
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      #
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Department Name
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Manager
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Total Employee
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDepartments.map((department, index) => (
                    <tr key={index} className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {department.departmentName}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {department.manager}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {department.totalEmployee}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {currentRoleLevel !== null && currentRoleLevel <= 1 && (
                          <div className="flex gap-x-2">
                            <button
                              className="flex items-center justify-center w-9 h-8 rounded hover:bg-blue-500 hover:text-white border border-blue-500 text-blue-500"
                              onClick={() =>
                                handleEditDepartment(department.departmentName)
                              } // Gọi hàm chỉnh sửa
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button
                              className="flex items-center justify-center w-9 h-8 rounded hover:bg-red-600 hover:text-white border border-red-600 text-red-600" // Gọi hàm xóa nhân viên
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        )}
                      </td>
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
        {currentDepartments.length > 0 && (
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
        <FormPopUpAddManager
          onClose={togglePopUp}
          onAddManager={handleAddManager}
          department={editingDepartment} // Truyền dữ liệu nhân viên đang chỉnh sửa
        />
      )}
    </div>
  )
}

export default Departments
