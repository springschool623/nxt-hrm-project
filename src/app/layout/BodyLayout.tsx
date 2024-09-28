import React, { ReactNode } from 'react'

interface BodyLayoutProps {
  children: ReactNode
}

const BodyLayout: React.FC<BodyLayoutProps> = ({ children }) => {
  return (
    <div className="w-full h-screen overflow-x-hidden border-t flex flex-col">
      <main className="w-full flex-grow p-6 overflow-y-scroll">{children}</main>
    </div>
  )
}

export default BodyLayout
