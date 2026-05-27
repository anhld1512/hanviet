import { redirect } from "next/navigation"

// Dashboard đã được ẩn — redirect về Phân tích
export default function DashboardPage() {
  redirect("/learning-path")
}
