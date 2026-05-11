import api from './api';

const adminService = {
  // Existing methods
  getDashboardOverview: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users?${queryParams}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create-admin', adminData);
    return response.data;
  },

  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getBookingAnalytics: async (period = 'month') => {
    const response = await api.get(`/admin/analytics/bookings?period=${period}`);
    return response.data;
  },

  getRevenueReport: async (year) => {
    const response = await api.get(`/admin/reports/revenue?year=${year}`);
    return response.data;
  },

  // Product Category Management
  getProductCategories: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/categories?${queryParams}`);
    return response.data;
  },

  getProductCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createProductCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateProductCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteProductCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Product Management
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/products?${queryParams}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Order Management
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/orders?${queryParams}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },

  // ── NEW: Video Management ──
  getAllVideos: async () => {
    const response = await api.get('/videos/admin');
    return response.data;
  },
  createVideo: async (videoData) => {
    const response = await api.post('/videos', videoData);
    return response.data;
  },
  updateVideo: async (id, videoData) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },
  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

export default adminService;