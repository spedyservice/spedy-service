import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import popupBannerService from '../../services/popupBannerService';

const AdminPopupBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Book Now',
    buttonLink: '/book-now',
    isActive: true,
    displayOrder: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await popupBannerService.getAllBanners();
      if (res.success) setBanners(res.data);
    } catch (err) { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      if (editingBanner) {
        await popupBannerService.updateBanner(editingBanner._id, formDataToSend);
        toast.success('Banner updated');
      } else {
        await popupBannerService.createBanner(formDataToSend);
        toast.success('Banner created');
      }
      fetchBanners();
      setShowModal(false);
      resetForm();
    } catch (err) { toast.error('Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this banner?')) {
      try {
        await popupBannerService.deleteBanner(id);
        toast.success('Banner deleted');
        fetchBanners();
      } catch (err) { toast.error('Delete failed'); }
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '', subtitle: '', description: '', buttonText: 'Book Now',
      buttonLink: '/book-now', isActive: true, displayOrder: 0,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      buttonText: banner.buttonText || 'Book Now',
      buttonLink: banner.buttonLink || '/book-now',
      isActive: banner.isActive,
      displayOrder: banner.displayOrder || 0,
    });
    setImagePreview(banner.imageUrl);
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-blue-600 w-8 h-8" /></div>;

  return (
    <div className="bg-gray-50 py-6 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Popup Banners</h1>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPlus /> Add Banner
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map(b => (
            <div key={b._id} className="bg-white rounded-xl shadow-md overflow-hidden">
              {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <h3 className="font-bold">{b.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{b.subtitle}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(b)} className="text-blue-600"><FaEdit /></button>
                    <button onClick={() => handleDelete(b._id)} className="text-red-600"><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for create/edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingBanner ? 'Edit Banner' : 'New Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border rounded-lg p-2" />
              <textarea placeholder="Description" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2" />
              
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium mb-1">Banner Image *</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                    <FaUpload /> Choose Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
                  )}
                </div>
                {!imagePreview && editingBanner && !imageFile && (
                  <p className="text-xs text-gray-500 mt-1">Leave unchanged to keep current image</p>
                )}
              </div>
              
              <input type="text" placeholder="Button Text" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="text" placeholder="Button Link (e.g., /book-now)" value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})} className="w-full border rounded-lg p-2" />
              <input type="number" placeholder="Display Order" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value)})} className="w-full border rounded-lg p-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                Active
              </label>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{submitting ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPopupBanners;