import Sidebar from "@/app/components/Sidebar"
import BottomNav from "@/app/components/BottomNav"

export default function LearningPathLoading() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F7]">
      <Sidebar />
      <BottomNav />
      <main className="ml-0 md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-7 pb-20 md:pb-7 animate-pulse">
        <div className="space-y-5">
          <div className="h-24 bg-white rounded-2xl border border-gray-100" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />
            ))}
          </div>
          <div className="h-36 bg-blue-50 rounded-2xl" />
          <div className="h-40 bg-white rounded-2xl border border-gray-100" />
        </div>
      </main>
    </div>
  )
}
