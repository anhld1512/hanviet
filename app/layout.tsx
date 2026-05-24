import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HanViet Writing Coach - Luyện viết TOPIK II Q51-54 với AI",
  description:
    "App luyện viết TOPIK II chuyên sâu cho người Việt. AI chấm điểm tức thì theo rubric NIIED, feedback 100% tiếng Việt. Tập trung Q51-54.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-white"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {children}
      </body>
    </html>
  )
}
