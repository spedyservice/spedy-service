import api from './api';

const adminService = {
  // Dashboard
  getDashboardOverview: async () => {
    return await api.get('/admin/dashboard');
  },

  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/admin/users?${queryParams}`);
  },

  getUserById: async (id) => {
    return await api.get(`/admin/users/${id}`);
  },

  updateUser: async (id, userData) => {
    return await api.put(`/admin/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await api.delete(`/admin/users/${id}`);
  },

  createAdmin: async (adminData) => {
    return await api.post('/admin/create-admin', adminData);
  },

  getSystemStats: async () => {
    return await api.get('/admin/stats');
  },

  getBookingAnalytics: async (period = 'month') => {
    return await api.get(`/admin/analytics/bookings?period=${period}`);
  },

  getRevenueReport: async (year) => {
    return await api.get(`/admin/reports/revenue?year=${year}`);
  },

  // Product Category Management
  getProductCategories: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/categories?${queryParams}`);
  },

  getProductCategoryById: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  createProductCategory: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  updateProductCategory: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  deleteProductCategory: async (id) => {
    return await api.delete(`/categories/${id}`);
  },

  // Product Management
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/products?${queryParams}`);
  },

  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },

  // Order Management
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/orders?${queryParams}`);
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  updateOrderStatus: async (id, status) => {
    return await api.put(`/orders/${id}/status`, { status });
  },

  deleteOrder: async (id) => {
    return await api.delete(`/orders/${id}`);
  },

  // Video Management
  getAllVideos: async () => {
    return await api.get('/videos/admin');
  },
  createVideo: async (videoData) => {
    return await api.post('/videos', videoData);
  },
  updateVideo: async (id, videoData) => {
    return await api.put(`/videos/${id}`, videoData);
  },
  deleteVideo: async (id) => {
    return await api.delete(`/videos/${id}`);
  },
};

export default adminService;