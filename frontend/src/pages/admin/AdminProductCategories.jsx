import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload, FaTag } from 'react-icons/fa'
import toast from 'react-hot-toast'
import adminService from '../../services/adminService'

const AdminProductCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await adminService.getProductCategories({ isActive: true })
      if (response.success) setCategories(response.data)
    } catch (error) { toast.error('Failed to fetch categories') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error('Category name is required')
    setSubmitting(true)

    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('isActive', formData.isActive)
    if (formData.image) fd.append('image', formData.image)

    try {
      if (editingCategory) {
        await adminService.updateProductCategory(editingCategory._id, fd)
        toast.success('Category updated')
      } else {
        await adminService.createProductCategory(fd)
        toast.success('Category created')
      }
      fetchCategories()
      setShowModal(false)
      resetForm()
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save category') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await adminService.deleteProductCategory(id)
        toast.success('Category deleted')
        fetchCategories()
      } catch (error) { toast.error('Failed to delete') }
    }
  }

  const handleEdit = (cat) => {
    setEditingCategory(cat)
    setFormData({ name: cat.name, isActive: cat.isActive, image: null })
    setImagePreview(cat.image || null)
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({ name: '', isActive: true, image: null })
    setImagePreview(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      setImagePreview(URL.createObjectURL(file))
    } else {
      setFormData({ ...formData, image: null })
      setImagePreview(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Product Categories</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Manage product categories for the shop</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn-primary inline-flex items-center gap-2 text-sm">
            <FaPlus size={14} />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">No categories found.</div>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-orange-100 flex items-center justify-center">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaTag className="text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(cat)} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><FaEdit size={14} /></button>
                  <button onClick={() => handleDelete(cat._id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><FaTrash size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-5">
            <h2 className="text-lg font-bold mb-3">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">Category Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Image</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && <img src={imagePreview} alt="preview" className="w-12 h-12 rounded object-cover" />}
                </div>
              </div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-orange-500" /> <span className="text-sm">Active</span></label>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminProductCategories