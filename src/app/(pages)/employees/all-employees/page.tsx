import Header from '@/app/components/Header'
import Pagination from '@/app/components/Pagination'
import BodyLayout from '@/app/layout/BodyLayout'
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

interface Employee {
  name: string
  email: string
  employeeID: string
  phone: string
  joinDate: string
  role: string
}

const AllEmployees: React.FC = () => {
  const employees: Employee[] = [
    {
      name: 'Marshall Nichols',
      email: 'marshall-n@gmail.com',
      employeeID: 'LA-0215',
      phone: '+ 264-625-2583',
      joinDate: '24 Jun, 2015',
      role: 'Web Designer',
    },
    {
      name: 'Susie Willis',
      email: 'sussie-w@gmail.com',
      employeeID: 'LA-0216',
      phone: '+ 264-625-2583',
      joinDate: '28 Jun, 2015',
      role: 'Web Developer',
    },
    // Thêm dữ liệu mẫu
  ]

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const totalItems = employees.length

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset lại trang hiện tại về 1
  }

  const indexOfLastEmployee = currentPage * itemsPerPage
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage
  const currentEmployees = employees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  )

  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />
      <BodyLayout>
        <h1 className="text-3xl text-black pb-6"> All Employees</h1>
        <div className="w-full">
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 rounded bg-teal-400 text-white hover:bg-transparent hover:text-teal-400 border border-teal-400">
              Add New
            </button>
          </div>
          <div className="flex justify-end mt-8 gap-2">
            <input
              type="text"
              className="px-4 py-2 w-60 outline-none	rounded border border-blue-400 font-light"
              placeholder="Search here..."
            />
            <button className="px-5 py-2 rounded bg-red-600 text-white hover:bg-transparent hover:text-red-600 border border-red-600">
              Clear
            </button>
          </div>
          <div className="bg-white overflow-auto mt-4">
            <table className="text-left w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b-2 border-grey-light">
                    <input type="checkbox" name="" id="" />
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
                {currentEmployees.map((employee) => (
                  // eslint-disable-next-line react/jsx-key
                  <tr className="hover:bg-grey-lighter">
                    <td className="py-4 px-6 border-b border-grey-light">
                      <input type="checkbox" name="" id="" />
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {employee.name}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {employee.email}
                    </td>
                    <td className="py-4 px-6 border-b border-grey-light">
                      {employee.employeeID}
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
                      <button className="w-9 h-8 rounded bg-blue-500">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="text-white	"
                        />
                      </button>
                      <button className="w-9 h-8 rounded bg-red-600">
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="text-white	"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Phân trang */}
        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </BodyLayout>
    </div>
  )
}

export default AllEmployees
