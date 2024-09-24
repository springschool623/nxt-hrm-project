import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface PaginationProps {
  totalItems: number
  currentPage: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleFirstPage = () => onPageChange(1)
  const handleLastPage = () => onPageChange(totalPages)
  const handlePreviousPage = () => onPageChange(Math.max(currentPage - 1, 1))
  const handleNextPage = () =>
    onPageChange(Math.min(currentPage + 1, totalPages))

  const handleItemsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    onItemsPerPageChange(Number(event.target.value))
  }

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex justify-end gap-10 text-sm items-center my-4 mx-3">
      {/* Rows per page selection */}
      <div className="flex items-center">
        <span className="mr-2">Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Page info */}
      <div>
        {indexOfFirstItem}-{indexOfLastItem} of {totalItems}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 mx-1 ${
            currentPage === 1 ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faAngleDoubleLeft} />
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 mx-1 ${
            currentPage === 1 ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 mx-1 ${
            currentPage === totalPages ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 mx-1 ${
            currentPage === totalPages ? 'text-gray-400' : 'text-gray-800'
          }`}
        >
          <FontAwesomeIcon icon={faAngleDoubleRight} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
