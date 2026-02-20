'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, BarChart3 } from 'lucide-react'

interface Stats {
  totalEmployees: number
  totalAttendance: number
  totalLeaveRequests: number
  averageRating: number
  attendanceRate: string
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats>({
    totalEmployees: 0,
    totalAttendance: 0,
    totalLeaveRequests: 0,
    averageRating: 0,
    attendanceRate: '0%',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const supabase = createClient()

      const { count: employeeCount } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })

      const { count: attendanceCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })

      const { count: leaveCount } = await supabase
        .from('leave_requests')
        .select('*', { count: 'exact', head: true })

      const { data: reviews } = await supabase
        .from('performance_reviews')
        .select('rating')

      const avgRating =
        reviews && reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
              reviews.length)
          : 0

      const attendanceRate = employeeCount
        ? Math.round((attendanceCount || 0) / (employeeCount * 30) * 100)
        : 0

      setStats({
        totalEmployees: employeeCount || 0,
        totalAttendance: attendanceCount || 0,
        totalLeaveRequests: leaveCount || 0,
        averageRating: avgRating,
        attendanceRate: `${attendanceRate}%`,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!')
  }

  const handleExportCSV = () => {
    alert('CSV export feature coming soon!')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">View HR analytics and insights</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading reports...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalEmployees}
              </div>
              <p className="text-xs text-gray-600 mt-2">Active employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalAttendance}
              </div>
              <p className="text-xs text-gray-600 mt-2">Records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.attendanceRate}
              </div>
              <p className="text-xs text-gray-600 mt-2">Overall rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}/5
              </div>
              <p className="text-xs text-gray-600 mt-2">Rating</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-600">Chart visualization coming soon</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Engineering', 'Sales', 'HR', 'Finance'].map((dept) => (
                <div key={dept} className="flex items-center justify-between pb-3 border-b">
                  <span className="text-gray-600">{dept}</span>
                  <span className="font-semibold text-gray-900">--</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Approved', 'Pending', 'Rejected'].map((status) => (
                <div key={status} className="flex items-center justify-between pb-3 border-b">
                  <span className="text-gray-600">{status}</span>
                  <span className="font-semibold text-gray-900">{stats.totalLeaveRequests}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
