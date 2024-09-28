import React, { useState, useEffect } from 'react'
import FormPopUp from '@/app/components/FormPopUp'
import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Employee } from '@/app/models/employeeModel'

const AllEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees)
  const [showPopUp, setShowPopUp] = useState<boolean>(false)
  const totalItems = filteredEmployees.length

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/employees/current-employee-list'
      )
      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((employee: any) => ({
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        phone: employee.phone,
        joinDate: new Date(employee.joinDate).toLocaleDateString(),
        role: employee.role,
      }))
      setEmployees(transformedData)
      setFilteredEmployees(transformedData)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }
  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.joinDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEmployees(filtered)
  }, [searchTerm, employees])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeactivateEmployee = async (employeeId: string) => {
    setIsDeleting(true) // Bắt đầu quá trình xóa, hiển thị loading
    try {
      // Delay 2 giây trước khi thực hiện xóa
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch(
        `http://localhost:5000/api/employees/change-status/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'inactive' }), // Cập nhật trạng thái thành inactive
        }
      )
      if (response.ok) {
        // Xóa nhân viên thành công, cập nhật lại danh sách nhân viên
        const updatedEmployees = employees.filter((employee) =>
          employee.employeeId === employeeId
            ? { ...employee, status: 'inactive' } // Cập nhật trạng thái trong danh sách hiện tại
            : employee
        )
        setEmployees(updatedEmployees)
        setFilteredEmployees(updatedEmployees)
        console.log(employeeId)
      }
    } catch (error) {
      console.error('Failed to deactivate employee: ', error)
      alert('An error occurred while deactivating the employee')
    } finally {
      setIsDeleting(false) // Kết thúc quá trình xóa, tắt loading
    }
  }

  const handleEditEmployee = async (employeeId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${employeeId}`
      )
      if (response.ok) {
        const employeeData = await response.json()
        setEditingEmployee(employeeData) // Lưu thông tin nhân viên vào state
        setShowPopUp(true) // Hiển thị popup chỉnh sửa
      }
    } catch (error) {
      console.error('Failed to fetch employee details:', error)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  )

  const togglePopUp = () => {
    setShowPopUp(!showPopUp)
  }

  // Hàm xử lý thêm nhân viên mới
  const handleAddEmployee = () => {
    fetchEmployees()
  }

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6">All Employees</h1>
        <div className="w-full">
          <div className="flex justify-end gap-2">
            <button
              onClick={togglePopUp}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 border border-blue-600"
              disabled={isDeleting} // Disable nút khi đang xóa
            >
              Add New
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
            {currentEmployees.length > 0 ? (
              <table className="text-left w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      <input type="checkbox" />
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Name
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Email
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Employee ID
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Phone
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Join Date
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Role
                    </th>
                    <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr key={index} className="hover:bg-grey-lighter">
                      <td className="py-4 px-6 border-b border-grey-light">
                        <input type="checkbox" />
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.name}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.email}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.employeeId}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.phone}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.joinDate}
                      </td>
                      <td className="py-4 px-6 border-b border-grey-light">
                        {employee.role}
                      </td>
                      <td className="flex gap-x-2 py-4 px-6 border-b border-grey-light">
                        <button
                          className="w-9 h-8 rounded bg-blue-500"
                          onClick={() =>
                            handleEditEmployee(employee.employeeId)
                          } // Gọi hàm chỉnh sửa
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="text-white"
                          />
                        </button>
                        <button
                          className="w-9 h-8 rounded bg-red-600"
                          onClick={() =>
                            handleDeactivateEmployee(employee.employeeId)
                          } // Gọi hàm xóa nhân viên
                        >
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="text-white"
                          />
                        </button>
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
        {currentEmployees.length > 0 && (
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
          employee={editingEmployee} // Truyền dữ liệu nhân viên đang chỉnh sửa
        />
      )}
    </div>
  )
}

export default AllEmployees
