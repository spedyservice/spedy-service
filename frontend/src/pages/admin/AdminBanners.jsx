import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload, FaImage } from 'react-icons/fa';
import toast from 'react-hot-toast';
import bannerService from '../../services/bannerService';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    isActive: true,
    displayOrder: 0,
  });
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await bannerService.getAllBanners();
      if (response.success) setBanners(response.data);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({ title: '', subtitle: '', tagline: '', buttonText: 'Shop Now', buttonLink: '/shop', isActive: true, displayOrder: 0 });
    setDesktopFile(null); setMobileFile(null);
    setDesktopPreview(null); setMobilePreview(null);
  };

  const handleEdit = (banner) => {
    setEditing(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      tagline: banner.tagline || '',
      buttonText: banner.buttonText || 'Shop Now',
      buttonLink: banner.buttonLink || '/shop',
      isActive: banner.isActive !== false,
      displayOrder: banner.displayOrder || 0,
    });
    setDesktopPreview(banner.desktopImage);
    setMobilePreview(banner.mobileImage);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Title is required');
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
    if (desktopFile) fd.append('desktopImage', desktopFile);
    if (mobileFile) fd.append('mobileImage', mobileFile);

    try {
      if (editing) {
        await bannerService.updateBanner(editing._id, fd);
        toast.success('Banner updated');
      } else {
        await bannerService.createBanner(fd);
        toast.success('Banner created');
      }
      fetchBanners();
      setShowModal(false);
      resetForm();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save banner'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await bannerService.deleteBanner(id);
      toast.success('Banner deleted');
      fetchBanners();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div className="flex justify-center py-12"><FaSpinner className="animate-spin w-8 h-8 text-orange-500" /></div>
  );

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Banners</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Add, edit, or reorder hero banners</p>
          </div>
          <button onClick={() => { resetForm(); setShowModal(true); }}
            className="btn-primary inline-flex items-center gap-2 text-sm">
            <FaPlus size={14} /> Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No banners found.</div>}
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
              <div className="h-40 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {b.desktopImage ? <img src={b.desktopImage} alt={b.title} className="w-full h-full object-cover" /> : <FaImage className="text-gray-400 text-4xl" />}
              </div>
              <h3 className="font-semibold text-sm">{b.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{b.tagline || b.subtitle}</p>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {b.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-400">Order: {b.displayOrder}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEdit(b)} className="flex-1 text-xs py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-1">
                  <FaEdit size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(b._id)} className="flex-1 text-xs py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center justify-center gap-1">
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl max-w-lg w-full p-5 max-h-[85vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">{editing ? 'Edit Banner' : 'Add Banner'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="input-label">Title *</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input-field" required /></div>
              <div><label className="input-label">Subtitle</label><input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="input-field" /></div>
              <div><label className="input-label">Tagline (small badge)</label><input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="input-field" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Button Text</label><input type="text" value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} className="input-field" /></div>
                <div><label className="input-label">Button Link</label><input type="text" value={formData.buttonLink} onChange={e => setFormData({ ...formData, buttonLink: e.target.value })} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Desktop Image {!editing && '*'}</label>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm">
                    <FaUpload className="text-gray-500" /> Choose
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; setDesktopFile(f); if (f) setDesktopPreview(URL.createObjectURL(f)); }} className="hidden" />
                  </label>
                  {desktopPreview && <img src={desktopPreview} alt="desktop" className="mt-2 w-full h-20 object-cover rounded" />}
                </div>
                <div>
                  <label className="input-label">Mobile Image</label>
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm">
                    <FaUpload className="text-gray-500" /> Choose
                    <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; setMobileFile(f); if (f) setMobilePreview(URL.createObjectURL(f)); }} className="hidden" />
                  </label>
                  {mobilePreview && <img src={mobilePreview} alt="mobile" className="mt-2 w-full h-20 object-cover rounded" />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="input-label">Display Order</label><input type="number" value={formData.displayOrder} onChange={e => setFormData({ ...formData, displayOrder: e.target.value })} className="input-field" /></div>
                <div className="flex items-center gap-2"><input type="checkbox" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-orange-500" /><span className="text-sm">Active</span></div>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;