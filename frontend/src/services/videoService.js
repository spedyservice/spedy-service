import api from './api';

const videoService = {
  getVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },
};

export default videoService;