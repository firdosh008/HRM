'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Calendar } from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/protected', icon: LayoutDashboard },
  { label: 'Employees', href: '/protected/employees', icon: Users },
  { label: 'Attendance', href: '/protected/attendance', icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold">HRMS Lite</h1>
        <p className="text-gray-400 text-sm mt-1">HR Management</p>
      </div>

      <nav className="px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
