import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload, FaBox, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import adminService from '../../services/adminService'
import categoryService from '../../services/categoryService'
import brandService from '../../services/brandService'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
    isActive: true,
    images: [],           // new File objects
  })
  const [existingImages, setExistingImages] = useState([])   // URLs of already saved images
  const [imagePreviews, setImagePreviews] = useState([])     // local previews of new files

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        adminService.getProducts({ limit: 50 }),
        categoryService.getAllCategories({ isActive: true }),
        brandService.getAllBrands({ isActive: true })
      ])
      if (prodRes.success) setProducts(prodRes.data)
      if (catRes.success) setCategories(catRes.data)
      if (brandRes.success) setBrands(brandRes.data)
    } catch (error) { toast.error('Failed to load data') }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price) {
      toast.error('Name and price are required')
      return
    }
    setSubmitting(true)

    const fd = new FormData()
    fd.append('name', formData.name)
    if (formData.description) fd.append('description', formData.description)
    fd.append('price', formData.price)
    if (formData.salePrice) fd.append('salePrice', formData.salePrice)
    fd.append('category', formData.category)
    if (formData.brand) fd.append('brand', formData.brand)
    fd.append('stock', formData.stock || 0)
    fd.append('featured', formData.featured)
    fd.append('isActive', formData.isActive)

    // Append new image files (if any)
    for (let i = 0; i < formData.images.length; i++) {
      fd.append('images', formData.images[i])
    }
    // Append kept existing images (they are already on server – we don't re-upload them,
    // just send their URLs to backend so it knows to keep them)
    if (editingProduct) {
      for (let i = 0; i < existingImages.length; i++) {
        fd.append('existingImages', existingImages[i])
      }
    }

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct._id, fd)
        toast.success('Product updated')
      } else {
        await adminService.createProduct(fd)
        toast.success('Product created')
      }
      fetchData()
      setShowModal(false)
      resetForm()
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save product') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await adminService.deleteProduct(id)
        toast.success('Product deleted')
        fetchData()
      } catch (error) { toast.error('Failed to delete product') }
    }
  }

  const handleEdit = (prod) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      salePrice: prod.salePrice || '',
      category: prod.category?._id || prod.category || '',
      brand: prod.brand || '',
      stock: prod.stock || 0,
      featured: prod.featured || false,
      isActive: prod.isActive !== false,
      images: []          // new files will be added
    })
    setExistingImages(prod.images || [])
    setImagePreviews([])   // no local previews yet
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '', description: '', price: '', salePrice: '', category: '', brand: '',
      stock: '', featured: false, isActive: true, images: []
    })
    setExistingImages([])
    setImagePreviews([])
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setFormData({ ...formData, images: files })
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, i) => i !== indexToRemove))
  }

  const removeNewImage = (indexToRemove) => {
    const filteredFiles = formData.images.filter((_, i) => i !== indexToRemove)
    setFormData({ ...formData, images: filteredFiles })
    const filteredPreviews = imagePreviews.filter((_, i) => i !== indexToRemove)
    setImagePreviews(filteredPreviews)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="ml-3 text-gray-600 text-sm">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Products</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Add, edit, or remove shop products</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true) }} className="btn-primary inline-flex items-center gap-2 text-sm">
            <FaPlus size={14} /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">No products found.</div>
          ) : (
            products.map((prod) => (
              <div key={prod._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 bg-gray-100">
                  {prod.images?.[0] ? (
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><FaBox size={32} /></div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm line-clamp-1">{prod.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-blue-600">₹{prod.salePrice || prod.price}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${prod.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {prod.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(prod)} className="flex-1 text-xs py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                      <FaEdit size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(prod._id)} className="flex-1 text-xs py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1">
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">Product Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea rows="2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Price *</label>
                  <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="input-label">Sale Price</label>
                  <input type="number" step="0.01" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Category *</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field" required>
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Brand</label>
                  <select value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="input-field">
                    <option value="">Select brand</option>
                    {brands.map((brand) => {
                      const name = typeof brand === 'string' ? brand : brand.name
                      return (
                        <option key={name} value={name}>{name}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="input-label">Images</label>
                {/* Existing images (edit mode) */}
                {existingImages.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
                        >
                          <FaTimes size={8} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* New image previews */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative w-12 h-12 rounded overflow-hidden border border-gray-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
                        >
                          <FaTimes size={8} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">Choose Images</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-orange-500" /> <span className="text-sm">Featured</span></label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-orange-500" /> <span className="text-sm">Active</span></label>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts