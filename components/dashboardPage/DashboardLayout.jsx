"use client";
import DashNav from "./navbar";


export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fff6ef]">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#fae9d7]">
        <DashNav />
      </nav>
      {children}
    </div>
  );
}