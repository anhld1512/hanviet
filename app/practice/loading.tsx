import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"

export default function PracticeLoading() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 p-4 md:p-8 pb-20 md:pb-8 animate-pulse">
        <div className="h-36 bg-blue-50 rounded-2xl mb-6" />
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100" />
          ))}
        </div>
      </main>
    </div>
  )
}
