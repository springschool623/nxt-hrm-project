'use client'
import {
  faAngleLeft,
  faCaretDown,
  faHome,
  faLock,
  faMinus,
  faStickyNote,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Dashboard from './pages/admin/dashboard/page'
import Activities from './pages/admin/activities/page'
import AllEmployees from './pages/admin/employees/all-employees/page'
import Attendances from './pages/admin/employees/attendances/page'
import Departments from './pages/admin/employees/departments/page'
import LeaveRequests from './pages/admin/employees/leave-requests/page'
import Users from './pages/admin/users/page'
import EmployeeLeaveRequests from './pages/client/employee-leave-requests/page'
import EmployeeSalary from './pages/admin/payroll/employee-salary/page'
import EmployeeChangePassword from './pages/client/employee-change-password/page'

const Home = () => {
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false)
  const [isPayrollOpen, setIsPayrollOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentRoleLevel, setCurrentRoleLevel] = useState<number | null>(null) // State cho user role hiện tại

  // Simulate loading for 3 seconds
  useEffect(() => {
    const userRoleLevelFromStorage = localStorage.getItem('roleLevel')
    setCurrentRoleLevel(
      userRoleLevelFromStorage ? Number(userRoleLevelFromStorage) : null
    )
    // Show loading screen for 3 seconds
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer) // Cleanup timeout if the component is unmounted
  }, [router])

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />
      case 'activities':
        return <Activities />
      case 'all-employees':
        return <AllEmployees />
      case 'attendances':
        return <Attendances />
      case 'departments':
        return <Departments />
      case 'leave-requests':
        return <LeaveRequests />
      case 'employee-salary':
        return <EmployeeSalary />
      case 'users':
        return <Users />
      case 'employee-leave-requests':
        return <EmployeeLeaveRequests />
      case 'employee-change-password':
        return <EmployeeChangePassword />
      default:
        return null
    }
  }

  // Hàm xử lý logout
  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0' // Xóa cookie token
    setIsLoading(true)
    setTimeout(() => {
      // Xóa token khỏi cookie
      setIsLoading(false)
      router.push('/auth/login')
    }, 2000) // Đặt thời gian chờ 2 giây (2000ms)
    // Điều hướng về trang login
  }

  const toggleEmployeesMenu = () => {
    setIsEmployeesOpen(!isEmployeesOpen)
  }

  const togglePayrollMenu = () => {
    setIsPayrollOpen(!isPayrollOpen)
  }

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="loading-overlay_login">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <aside className="relative bg-sidebar h-screen w-80 hidden sm:block shadow-xl">
        <div className="p-6 pb-0">
          <a
            href="index.html"
            className="text-white text-3xl font-semibold uppercase hover:text-gray-300"
          >
            Admin
          </a>
          <div className="flex my-4">
            <Image
              src="/images/realmadrid.jpg"
              alt="Avatar"
              width={400}
              height={400}
              className="w-12 h-12 rounded-lg"
            />
            <div className="relative ml-2 flex flex-col text-white">
              <span className="font-light text-sm">Welcome,</span>
              <span className="font-bold flex cursor-pointer relative group text-sm">
                Nguyen Xuan Truong
                <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-2" />
                <div className="invisible opacity-0 text-sm transform translate-y-[-16px] group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out font-normal absolute w-32 bg-white rounded-lg shadow-lg py-2 px-4 top-8 right-0">
                  <a href="#" className="block text-black my-2">
                    Account
                  </a>
                  <a href="#" className="block text-black my-2">
                    Support
                  </a>
                  <hr />
                  <div
                    onClick={handleLogout} // Gọi hàm handleLogout khi nhấn vào nút
                    className="block text-black my-2"
                  >
                    Sign Out
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <nav className="text-white text-base font-semibold pt-3">
          {currentRoleLevel !== null && currentRoleLevel <= 2 && (
            <>
              <div
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center active-nav-link text-white py-4 pl-6 nav-item cursor-pointer"
              >
                <FontAwesomeIcon icon={faHome} className="w-6 h-6 mr-3" />
                HR Dashboard
              </div>
            </>
          )}
          {/* <div
            onClick={() => setActiveTab('activities')}
            className="flex items-center text-white py-4 pl-6 nav-item cursor-pointer"
          >
            <FontAwesomeIcon icon={faStickyNote} className="w-6 h-6 mr-3" />
            Activities
          </div> */}
          {currentRoleLevel !== null && currentRoleLevel > 2 && (
            <>
              <div
                onClick={() => setActiveTab('employee-change-password')}
                className="flex items-center text-white py-4 pl-6 nav-item cursor-pointer"
              >
                <FontAwesomeIcon icon={faLock} className="w-6 h-6 mr-3" />
                Change Password
              </div>
              <div
                onClick={() => setActiveTab('employee-leave-requests')}
                className="flex items-center text-white py-4 pl-6 nav-item cursor-pointer"
              >
                <FontAwesomeIcon icon={faStickyNote} className="w-6 h-6 mr-3" />
                Leave Requests
              </div>
            </>
          )}
          {currentRoleLevel !== null && currentRoleLevel <= 2 && (
            <>
              <div>
                <div
                  onClick={toggleEmployeesMenu}
                  className="flex items-center justify-between text-white py-4 pl-6 nav-item cursor-pointer"
                >
                  <div className="flex">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 mr-3" />
                    Employees
                  </div>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={`w-4 h-4 mr-4 transition-transform duration-300 ${
                      isEmployeesOpen ? '-rotate-90' : ''
                    }`}
                  />
                </div>
                {isEmployeesOpen && (
                  <ul>
                    <li>
                      <div
                        onClick={() => setActiveTab('all-employees')}
                        className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="w-2 h-2 mr-7"
                        />
                        All Employees
                      </div>
                    </li>
                    {currentRoleLevel !== null && currentRoleLevel < 2 && (
                      <>
                        <li>
                          <div
                            onClick={() => setActiveTab('leave-requests')}
                            className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="w-2 h-2 mr-7"
                            />
                            Leave Requests
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => setActiveTab('attendances')}
                            className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="w-2 h-2 mr-7"
                            />
                            Attendances
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => setActiveTab('departments')}
                            className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faMinus}
                              className="w-2 h-2 mr-7"
                            />
                            Departments
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <div
                  onClick={togglePayrollMenu}
                  className="flex items-center justify-between text-white py-4 pl-6 nav-item cursor-pointer"
                >
                  <div className="flex">
                    <FontAwesomeIcon icon={faUsers} className="w-6 h-6 mr-3" />
                    Payroll
                  </div>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={`w-4 h-4 mr-4 transition-transform duration-300 ${
                      isPayrollOpen ? '-rotate-90' : ''
                    }`}
                  />
                </div>
                {isPayrollOpen && (
                  <ul>
                    <li>
                      <div
                        onClick={() => setActiveTab('employee-salary')}
                        className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="w-2 h-2 mr-7"
                        />
                        Payslip
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => setActiveTab('employee-salary')}
                        className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="w-2 h-2 mr-7"
                        />
                        Employee Salary
                      </div>
                    </li>
                  </ul>
                )}
              </div>
              <div
                onClick={() => setActiveTab('users')}
                className="flex items-center text-white py-4 pl-6 nav-item cursor-pointer"
              >
                <FontAwesomeIcon icon={faUser} className="w-6 h-6 mr-3" />
                Users
              </div>
            </>
          )}
        </nav>
      </aside>
      {renderContent()}
      {/* Nội dung hiện tại của bạn */}
      {isLoading && (
        <div className="loading-wrapper">
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
