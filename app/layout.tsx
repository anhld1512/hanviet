import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HanViet - Hoc tieng Han cho nguoi Viet",
  description: "Hoc tieng Han theo tinh huong thuc te, luyen thi TOPIK va EPS. Danh rieng cho nguoi Viet Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-white" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
