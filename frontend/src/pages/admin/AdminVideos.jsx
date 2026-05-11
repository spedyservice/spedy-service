import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaUpload, FaPlay } from 'react-icons/fa';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video: null,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllVideos();
      if (res.success) setVideos(res.data);
    } catch (error) {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || (!formData.video && !editingVideo)) {
      toast.error('Title and video file are required');
      return;
    }
    setSubmitting(true);

    const fd = new FormData();
    fd.append('title', formData.title);
    if (formData.description) fd.append('description', formData.description);
    fd.append('isActive', formData.isActive);
    fd.append('displayOrder', formData.displayOrder);
    if (formData.video) fd.append('video', formData.video);

    try {
      if (editingVideo) {
        await adminService.updateVideo(editingVideo._id, fd);
        toast.success('Video updated');
      } else {
        await adminService.createVideo(fd);
        toast.success('Video created');
      }
      fetchVideos();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save video');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this video?')) {
      try {
        await adminService.deleteVideo(id);
        toast.success('Video deleted');
        fetchVideos();
      } catch (error) {
        toast.error('Failed to delete video');
      }
    }
  };

  const handleEdit = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      video: null,
      isActive: video.isActive,
      displayOrder: video.displayOrder || 0,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({ title: '', description: '', video: null, isActive: true, displayOrder: 0 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="ml-3 text-gray-600 text-sm">Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Manage Videos</h1>
            <p className="text-gray-600 text-xs md:text-sm mt-0.5">Add, edit, or remove promotional videos</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            <FaPlus size={14} /> Add Video
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 text-sm">No videos found.</div>
          ) : (
            videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="relative h-32 bg-gray-100 flex items-center justify-center cursor-pointer"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  <FaPlay className="text-3xl text-gray-400" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm line-clamp-1">{video.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        video.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {video.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex-1 text-xs py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <FaEdit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="flex-1 text-xs py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                    >
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-lg font-bold mb-3">{editingVideo ? 'Edit Video' : 'Add Video'}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="input-label">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Video File {editingVideo ? '(optional)' : '*'}</label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">
                      {formData.video ? formData.video.name : 'Choose Video'}
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setFormData({ ...formData, video: e.target.files[0] })}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-500"
                />
                <span className="text-sm">Active</span>
              </label>
              <div className="flex gap-3 pt-3">
                <button type="submit" disabled={submitting} className="btn-primary flex-1">
                  {submitting ? 'Saving...' : editingVideo ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;