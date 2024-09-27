'use client'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Lưu token vào localStorage hoặc sessionStorage
        localStorage.setItem('token', data.token)
        // Chuyển hướng người dùng đến trang chính (ví dụ: /dashboard)
        window.location.href = '/'
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
    <div className="flex relative justify-center items-center w-screen h-screen linear-background">
      <div className="left w-96 h-96 bg-white rounded-lg shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 items-center p-7"
        >
          <h1 className="w-full text-xl text-left mb-2">
            Login to your account
          </h1>
          <div className="flex flex-col w-full">
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 outline-none bg-gray-50 border border-gray-300 rounded"
              required
            />
          </div>
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
          {error && <p className="text-red-500">{error}</p>}
          <div className="w-full flex items-center gap-2">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-transparent hover:text-blue-600 border border-blue-600"
          >
            LOGIN
          </button>
          <Link href="/forgot-password" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLock} width={15} height={15} />
            <span className="text-color"> Forgot password?</span>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login
