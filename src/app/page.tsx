'use client'
import {
  faAngleLeft,
  faCaretDown,
  faHome,
  faMinus,
  faStickyNote,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import Image from 'next/image'
import Home from './(pages)/home/page'
import Activities from './(pages)/activities/page'
import Users from './(pages)/users/page'
import AllEmployees from './(pages)/employees/all-employees/page'
import Attendances from './(pages)/employees/attendances/page'
import Departments from './(pages)/employees/departments/page'
import LeaveRequests from './(pages)/employees/leave-requests/page'

const SideBar = () => {
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />
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
      case 'users':
        return <Users />
      default:
        return null
    }
  }

  const toggleEmployeesMenu = () => {
    setIsEmployeesOpen(!isEmployeesOpen)
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
              <span className="font-light">Welcome,</span>
              <span className="font-bold flex items-center cursor-pointer relative group">
                Truong Nguyen
                <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-2" />
                <div className="invisible opacity-0 text-sm transform translate-y-[-16px] group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out font-normal absolute w-32 bg-white rounded-lg shadow-lg py-2 px-4 top-8 right-0">
                  <a href="#" className="block text-black my-2">
                    Account
                  </a>
                  <a href="#" className="block text-black my-2">
                    Support
                  </a>
                  <hr />
                  <a href="#" className="block text-black my-2">
                    Sign Out
                  </a>
                </div>
              </span>
            </div>
          </div>
        </div>
        <nav className="text-white text-base font-semibold pt-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item cursor-pointer"
          >
            <FontAwesomeIcon icon={faHome} className="w-6 h-6 mr-3" />
            HR Dashboard
          </div>
          <div
            onClick={() => setActiveTab('activities')}
            className="flex items-center text-white py-4 pl-6 nav-item cursor-pointer"
          >
            <FontAwesomeIcon icon={faStickyNote} className="w-6 h-6 mr-3" />
            Activities
          </div>
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
                    <FontAwesomeIcon icon={faMinus} className="w-2 h-2 mr-7" />
                    All Employees
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setActiveTab('leave-requests')}
                    className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-2 h-2 mr-7" />
                    Leave Requests
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setActiveTab('attendances')}
                    className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-2 h-2 mr-7" />
                    Attendances
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => setActiveTab('departments')}
                    className="flex items-center opacity-80 hover:opacity-100 text-white py-4 pl-6 nav-item text-sm cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-2 h-2 mr-7" />
                    Departments
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
        </nav>
      </aside>
      {renderContent()}
    </>
  )
}

export default SideBar
