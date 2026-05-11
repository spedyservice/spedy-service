import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTag, FaSpinner, FaToggleOn, FaToggleOff, FaUpload } from 'react-icons/fa'
import toast from 'react-hot-toast'
import brandService from '../../services/brandService'

const AdminBrands = () => {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'All Electronics',
    isActive: true,
    description: '',
    logo: null
  })
  const [logoPreview, setLogoPreview] = useState(null)

  useEffect(() => { fetchBrands() }, [])

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const response = await brandService.getAllBrands()
      if (response.success) setBrands(response.data)
    } catch (error) { toast.error('Failed to fetch brands') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const fd = new FormData()
    fd.append('name', formData.name)
    fd.append('category', formData.category)
    fd.append('isActive', formData.isActive)
    if (formData.description) fd.append('description', formData.description)
    if (formData.logo) fd.append('logo', formData.logo)
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, fd)
        toast.success('Brand updated successfully')
      } else {
        await brandService.createBrand(fd)
        toast.success('Brand created successfully')
      }
      fetchBrands()
      setShowModal(false)
      resetForm()
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save brand') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandService.deleteBrand(id)
        toast.success('Brand deleted successfully')
        fetchBrands()
      } catch (error) { toast.error('Failed to delete brand') }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await brandService.toggleBrandStatus(id)
      toast.success(`Brand ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      fetchBrands()
    } catch (error) { toast.error('Failed to toggle brand status') }
  }

  const handleEdit = (brand) => {
    setEditingBrand(brand)
    setFormData({
      name: brand.name,
      category: brand.category || 'All Electronics',
      isActive: brand.isActive,
      description: brand.description || '',
      logo: null
    })
    setLogoPreview(brand.logo || null)
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingBrand(null)
    setFormData({ name: '', category: 'All Electronics', isActive: true, description: '', logo: null })
    setLogoPreview(null)
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, logo: file })
      setLogoPreview(URL.createObjectURL(file))
    } else {
      setFormData({ ...formData, logo: null })
      setLogoPreview(null)
    }
  }

  const categories = ['All Electronics', 'AC', 'Refrigerator', 'Washing Machine', 'TV', 'Microwave', 'All Appliances']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading brands...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Brands</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Add, edit, or remove service brands</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow text-sm">
            <FaPlus size={14} />
            <span>Add New Brand</span>
          </button>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {brands.map((brand, index) => (
            <motion.div key={brand._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center overflow-hidden">
                  {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" /> : <FaTag className="text-accent text-base" />}
                </div>
                <div className="flex gap-0.5">
                  <button onClick={() => handleToggleStatus(brand._id, brand.isActive)} className="p-1 text-gray-500 hover:text-accent rounded-lg" title={brand.isActive ? 'Deactivate' : 'Activate'}>
                    {brand.isActive ? <FaToggleOn size={15} /> : <FaToggleOff size={15} />}
                  </button>
                  <button onClick={() => handleEdit(brand)} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg"><FaEdit size={13} /></button>
                  <button onClick={() => handleDelete(brand._id)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg"><FaTrash size={13} /></button>
                </div>
              </div>
              <h3 className="font-bold text-sm mb-0.5">{brand.name}</h3>
              <p className="text-xs text-gray-500 mb-1">Category: {brand.category || 'All Electronics'}</p>
              {brand.description && <p className="text-xs text-gray-600 mb-2 line-clamp-2">{brand.description}</p>}
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {brand.isActive ? 'Active' : 'Inactive'}
              </span>
            </motion.div>
          ))}
        </div>
        {brands.length === 0 && (
          <div className="text-center py-10"><p className="text-gray-500 text-sm">No brands found. Click "Add New Brand" to create one.</p></div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl max-w-md w-full p-5">
            <h2 className="text-lg font-bold mb-3">{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">Brand Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g., Samsung, LG, Whirlpool" required />
              </div>
              <div>
                <label className="input-label">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Brand Logo (Image)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                  {logoPreview && <div className="w-12 h-12 rounded-lg overflow-hidden border"><img src={logoPreview} alt="Preview" className="w-full h-full object-contain" /></div>}
                </div>
                {editingBrand && !formData.logo && editingBrand.logo && <p className="text-xs text-gray-400 mt-1">Current logo will be kept unless you upload a new one.</p>}
              </div>
              <div>
                <label className="input-label">Description (Optional)</label>
                <textarea rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" placeholder="Brief description about this brand" />
              </div>
              <div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-accent" /><span className="text-sm">Active (visible to customers)</span></label>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : (editingBrand ? 'Update' : 'Create')}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBrands