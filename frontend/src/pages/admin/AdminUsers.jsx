import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaTrash, FaEnvelope, FaPhone, FaSpinner, FaEdit } from 'react-icons/fa'
import toast from 'react-hot-toast'
import adminService from '../../services/adminService'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchUsers() }, [roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {}
      if (roleFilter !== 'all') params.role = roleFilter
      if (searchTerm) params.search = searchTerm
      const response = await adminService.getAllUsers(params)
      if (response.success) setUsers(response.data)
    } catch (error) { toast.error('Failed to fetch users') }
    finally { setLoading(false) }
  }

  const handleSearch = () => fetchUsers()

  const handleDelete = async (id, role) => {
    if (role === 'admin') { toast.error('Cannot delete admin users'); return }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id)
        toast.success('User deleted successfully')
        fetchUsers()
      } catch (error) { toast.error('Failed to delete user') }
    }
  }

  const handleEdit = (user) => {
    setEditingUser({ ...user })
    setShowEditModal(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await adminService.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        isActive: editingUser.isActive
      })
      toast.success('User updated successfully')
      setShowEditModal(false)
      fetchUsers()
    } catch (error) { toast.error('Failed to update user') }
    finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-600 text-xs md:text-sm mt-0.5">View and manage all registered customers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name, email, or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10 py-2 text-sm" />
            </div>
            <div>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field py-2 text-sm">
                <option value="all">All Users</option>
                <option value="customer">Customers Only</option>
                <option value="admin">Admins Only</option>
                <option value="technician">Technicians Only</option>
              </select>
            </div>
            <button onClick={handleSearch} className="btn-primary text-sm py-2">Search</button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Joined</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-10 text-center text-gray-500 text-sm">No users found</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user._id.slice(-8)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm"><FaEnvelope className="text-gray-400 text-xs" /><span>{user.email}</span></div>
                          <div className="flex items-center gap-2 text-sm"><FaPhone className="text-gray-400 text-xs" /><span>{user.phone}</span></div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          user.role === 'technician' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>{user.role === 'admin' ? 'Admin' : user.role === 'technician' ? 'Technician' : 'Customer'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(user)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit size={14} /></button>
                          <button onClick={() => handleDelete(user._id, user.role)} disabled={user.role === 'admin'} className={`p-1.5 rounded-lg transition-colors ${user.role === 'admin' ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}>
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-blue-600">{users.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-green-500">{users.filter(u => u.role === 'customer').length}</p>
            <p className="text-xs text-gray-500">Customers</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-purple-500">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-blue-500">{users.filter(u => u.isActive).length}</p>
            <p className="text-xs text-gray-500">Active Users</p>
          </div>
        </div>
      </motion.div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-5">
            <h2 className="text-lg font-bold mb-3">Edit User</h2>
            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="input-label">Full Name</label>
                <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Email</label>
                <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Phone</label>
                <input type="tel" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Role</label>
                <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="input-field">
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={editingUser.isActive} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })} className="w-4 h-4 text-accent" /><span className="text-sm">Active Account</span></label>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers