import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaUsers, FaCalendarAlt, FaWrench, FaTag, FaClock,
  FaArrowUp, FaSpinner, FaEye, FaBox, FaShoppingBag, FaList
} from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import adminService from '../../services/adminService'
import bookingService from '../../services/bookingService'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [bookingStats, setBookingStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [dashboardRes, bookingStatsRes] = await Promise.all([
        adminService.getDashboardOverview(),
        bookingService.getBookingStats()
      ])
      setStats(dashboardRes.data)
      setBookingStats(bookingStatsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Service stats (top row)
  const serviceStats = [
    { title: 'Total Bookings', value: stats?.stats?.totalBookings || 0, icon: FaCalendarAlt, bg: 'bg-blue-500', change: '+12%' },
    { title: 'Total Customers', value: stats?.stats?.totalCustomers || 0, icon: FaUsers, bg: 'bg-green-500', change: '+8%' },
    { title: "Today's Bookings", value: stats?.stats?.todayBookings || 0, icon: FaClock, bg: 'bg-orange-500', change: '+5%' },
    { title: 'Active Services', value: stats?.stats?.totalServices || 0, icon: FaWrench, bg: 'bg-purple-500', change: '+5%' },
  ]

  // Sales stats (second row)
  const salesStats = [
    { title: 'Total Products', value: stats?.stats?.totalProducts || 0, icon: FaBox, bg: 'bg-teal-500', change: '+10%' },
    { title: 'Categories', value: stats?.stats?.totalCategories || 0, icon: FaList, bg: 'bg-cyan-500', change: '+3%' },
    { title: 'Total Orders', value: stats?.stats?.totalOrders || 0, icon: FaShoppingBag, bg: 'bg-indigo-500', change: '+15%' },
    { title: 'Total Revenue', value: `₹${stats?.stats?.totalRevenue || 0}`, icon: FaTag, bg: 'bg-pink-500', change: '+18%' },
  ]

  const bookingStatusData = stats?.bookingStatus ? [
    { name: 'Pending', value: stats.bookingStatus.pending, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.bookingStatus.confirmed, color: '#3b82f6' },
    { name: 'In Progress', value: stats.bookingStatus.inProgress, color: '#8b5cf6' },
    { name: 'Completed', value: stats.bookingStatus.completed, color: '#10b981' },
    { name: 'Cancelled', value: stats.bookingStatus.cancelled, color: '#ef4444' }
  ] : []

  // Conditional rendering for charts – prevent rendering with empty data
  const monthlyData = stats?.monthlyStats || []
  const hasMonthlyData = monthlyData.length > 0
  const hasBookingStatusData = bookingStatusData.length > 0 && bookingStatusData.some(item => item.value > 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your business today.</p>
          </div>

          {/* ---- Service Stats ---- */}
          <h2 className="text-lg font-bold text-gray-700 mb-3">Service Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {serviceStats.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className="text-white text-lg" />
                  </div>
                  <span className="text-green-600 text-xs font-semibold flex items-center">
                    <FaArrowUp className="mr-0.5 text-xs" />{card.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
              </motion.div>
            ))}
          </div>

          {/* ---- Sales Stats ---- */}
          <h2 className="text-lg font-bold text-gray-700 mb-3">Sales Stats</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {salesStats.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className="text-white text-lg" />
                  </div>
                  <span className="text-green-600 text-xs font-semibold flex items-center">
                    <FaArrowUp className="mr-0.5 text-xs" />{card.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts – stacked on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Bookings */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Monthly Bookings</h3>
              <div className="h-60 sm:h-72">
                {hasMonthlyData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data available</div>
                )}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Booking Status Distribution</h3>
              <div className="h-60 sm:h-72">
                {hasBookingStatusData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">No data available</div>
                )}
              </div>
              {hasBookingStatusData && (
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {bookingStatusData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { href: '/admin/bookings', label: 'Manage Bookings', icon: FaCalendarAlt },
              { href: '/admin/services', label: 'Manage Services', icon: FaWrench },
              { href: '/admin/brands', label: 'Manage Brands', icon: FaTag },
              { href: '/admin/users', label: 'Manage Users', icon: FaUsers },
              { href: '/admin/products', label: 'Manage Products', icon: FaBox },
              { href: '/admin/categories', label: 'Manage Categories', icon: FaList },
              { href: '/admin/orders', label: 'Manage Orders', icon: FaShoppingBag },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 text-center transition-shadow flex flex-col items-center gap-2"
              >
                <link.icon className="text-blue-600 text-xl" />
                <span className="text-sm font-medium text-gray-700">{link.label}</span>
              </a>
            ))}
          </div>

          {/* Recent Bookings – card list on mobile, table on desktop */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Recent Bookings</h3>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {stats?.recentBookings?.map((booking, index) => (
                <div key={index} className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-mono font-medium">{booking.bookingId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>{booking.status}</span>
                  </div>
                  <p className="text-sm text-gray-700">{booking.customerName} – {booking.productCategory}</p>
                  <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats?.recentBookings?.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{booking.bookingId}</td>
                      <td className="px-6 py-4 text-sm">{booking.customerName}</td>
                      <td className="px-6 py-4 text-sm">{booking.productCategory}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>{booking.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <a href="/admin/bookings" className="text-blue-600 hover:text-blue-800">
                          <FaEye />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard