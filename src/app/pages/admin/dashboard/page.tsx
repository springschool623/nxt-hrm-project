import Header from '@/app/components/Header'
import BodyLayout from '@/app/layout/BodyLayout'

export default function Dashboard() {
  return (
    <div className="relative w-full flex flex-col h-screen overflow-y-hidden">
      <Header />

      <BodyLayout>
        <h1 className="text-3xl text-black pb-6"></h1>
        Dashboard
      </BodyLayout>
    </div>
  )
}
