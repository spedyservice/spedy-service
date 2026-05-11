import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaWrench, FaSpinner, FaToggleOn, FaToggleOff, FaUpload } from 'react-icons/fa'
import toast from 'react-hot-toast'
import serviceService from '../../services/serviceService'

const AdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    popular: false,
    featured: false,
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const response = await serviceService.getAllServices()
      if (response.success) {
        setServices(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Service name is required')
      return
    }
    setSubmitting(true)
    const fd = new FormData()
    fd.append('name', formData.name)
    if (formData.description) fd.append('description', formData.description)
    fd.append('isActive', formData.isActive)
    fd.append('popular', formData.popular)
    fd.append('featured', formData.featured)
    if (formData.image) fd.append('image', formData.image)

    try {
      if (editingService) {
        await serviceService.updateService(editingService._id, fd)
        toast.success('Service updated successfully')
      } else {
        await serviceService.createService(fd)
        toast.success('Service created successfully')
      }
      fetchServices()
      setShowModal(false)
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await serviceService.deleteService(id)
        toast.success('Service deleted successfully')
        fetchServices()
      } catch (error) {
        toast.error('Failed to delete service')
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await serviceService.toggleServiceStatus(id)
      toast.success(`Service ${currentStatus ? 'deactivated' : 'activated'} successfully`)
      fetchServices()
    } catch (error) {
      toast.error('Failed to toggle service status')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      isActive: service.isActive,
      popular: service.popular || false,
      featured: service.featured || false,
      image: null
    })
    setImagePreview(service.imageUrl || null)
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingService(null)
    setFormData({
      name: '',
      description: '',
      isActive: true,
      popular: false,
      featured: false,
      image: null
    })
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
        <div className="text-center">
          <FaSpinner className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Services</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Add, edit, or remove service categories</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true) }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow text-sm"
          >
            <FaPlus size={14} />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                  ) : (
                    <FaWrench className="text-orange-500 text-base" />
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggleStatus(service._id, service.isActive)} className="p-1 text-gray-500 hover:text-orange-500 rounded-lg" title={service.isActive ? 'Deactivate' : 'Activate'}>
                    {service.isActive ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                  </button>
                  <button onClick={() => handleEdit(service)} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <FaEdit size={13} />
                  </button>
                  <button onClick={() => handleDelete(service._id)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-base font-bold text-gray-800 mb-1">{service.name}</h3>
              {service.description && (
                <p className="text-gray-500 text-xs mb-2 line-clamp-2">{service.description}</p>
              )}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
                {service.popular && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Popular</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">No services found. Click "Add New Service" to create one.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal – unchanged */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-5"
          >
            <h2 className="text-lg font-bold mb-3">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">Service Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g., Washing Machine, AC Repair, etc." required />
              </div>
              <div>
                <label className="input-label">Description (Optional)</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" placeholder="Brief description of this service..." />
              </div>
              <div>
                <label className="input-label">Service Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">Choose Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {editingService && !formData.image && editingService.imageUrl && (
                  <p className="text-xs text-gray-400 mt-1">Current image will be kept unless you upload a new one.</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-orange-500 rounded" /><span className="text-sm">Active</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.popular} onChange={(e) => setFormData({ ...formData, popular: e.target.checked })} className="w-4 h-4 text-orange-500 rounded" /><span className="text-sm">Popular</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-orange-500 rounded" /><span className="text-sm">Featured</span></label>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : (editingService ? 'Update' : 'Create')}</button>
                <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminServices