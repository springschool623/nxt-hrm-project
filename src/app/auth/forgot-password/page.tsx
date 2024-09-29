'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter từ Next.js
import AuthLayout from '@/app/layout/AuthLayout'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter() // Khởi tạo router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(
        'http://localhost:5000/api/users/change-password/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Lưu token vào localStorage hoặc sessionStorage
        document.cookie = `token=${data.token}; path=/; max-age=3600` // max-age=3600 là 1 giờ
        localStorage.setItem('userRole', data.userRoleType) // Lưu userRole vào localStorage
        localStorage.setItem('employeeId', data.employeeId) // Lưu userRole vào localStorage

        // Sử dụng router để chuyển hướng người dùng đến trang chính
        router.push('/') // Điều hướng đến trang chủ
        console.log('Login thành công')
        console.log(data.employeeId)
      } else {
        // Hiển thị lỗi nếu đăng nhập không thành công
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Server error')
    }
  }

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-center p-7"
      >
        <h1 className="w-full text-xl text-left mb-2">Recover my password</h1>

        <div className="flex flex-col w-full">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <input
            type="text"
            id="email"
            placeholder="New Password"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-transparent hover:text-blue-600 border border-blue-600"
        >
          RESET PASSWORD
        </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Know your password?</span>
          <Link href="login">
            <span className="text-color">Login</span>
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
