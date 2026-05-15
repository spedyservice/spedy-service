import api from './api';

const videoService = {
  getVideos: async () => {
    return await api.get('/videos');
  },
};

export default videoService;