import React, { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex relative justify-center items-center w-screen h-screen linear-background">
      <div className="left w-96 h-96 bg-white rounded-lg shadow-2xl">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
