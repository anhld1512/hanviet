import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"

export default function ReviewLoading() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 p-4 md:p-8 pb-20 md:pb-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-gray-100 mb-4" />
        <div className="flex justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-100" />
          <div className="h-10 w-32 bg-gray-100 rounded-xl" />
          <div className="w-10 h-10 rounded-full bg-gray-100" />
        </div>
      </main>
    </div>
  )
}
