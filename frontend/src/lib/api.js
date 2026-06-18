import axios from 'axios';

// Configure the base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important if backend uses cookies
});

function logoutClient() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-change'));
}

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Default instance sets Content-Type: application/json — that breaks multipart
  // (missing boundary). Let the runtime set multipart boundaries for FormData.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: () => {
    logoutClient();
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getPublicProfile: async (username) => {
    const response = await api.get(`/auth/profile/${username}`);
    return response.data;
  },

  toggleFollow: async (userId) => {
    const response = await api.post(`/auth/follow/${userId}`);
    return response.data;
  },

  updateProfile: async (payload) => {
    const response = await api.patch('/auth/profile', payload);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/auth/upload-profile', formData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async ({ token, password }) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  changePassword: async (payload) => {
    const response = await api.post('/auth/change-password', payload);
    return response.data;
  },

  updateEmail: async (payload) => {
    const response = await api.post('/auth/update-email', payload);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },

  exportData: async () => {
    const response = await api.get('/auth/export-data');
    return response.data;
  },

  generate2FA: async () => {
    const response = await api.post('/auth/2fa/generate');
    return response.data;
  },

  enable2FA: async (code) => {
    const response = await api.post('/auth/2fa/enable', { code });
    return response.data;
  },

  disable2FA: async (code) => {
    const response = await api.post('/auth/2fa/disable', { code });
    return response.data;
  },

  verify2FALogin: async ({ userId, code }) => {
    const response = await api.post('/auth/2fa/verify-login', { userId, code });
    return response.data;
  },
};

// Blog API endpoints
export const blogAPI = {
  createBlog: async (formData) => {
    const response = await api.post('/blog/create-blog', formData);
    return response.data;
  },
  
  getMyBlogs: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/blog/my-blogs', { params });
    return response.data;
  },

  updateBlog: async (id, formData) => {
    const response = await api.patch(`/blog/update-blog/${id}`, formData);
    return response.data;
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blog/delete-blog/${id}`);
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blog/get-blog/${id}`);
    return response.data;
  },

  getAllBlogs: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/blog/get-all-blogs', { params });
    return response.data;
  },

  getExploreData: async () => {
    const response = await api.get('/blog/explore');
    return response.data;
  },

  getFeed: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/blog/feed', { params });
    return response.data;
  },

  getTags: async () => {
    const response = await api.get('/blog/tags');
    return response.data;
  },

  getTopContributors: async () => {
    const response = await api.get('/blog/top-contributors');
    return response.data;
  }
};

export const likeAPI = {
  toggleLike: async (blogId) => {
    const response = await api.post(`/likes/toggle/${blogId}`);
    return response.data;
  },
  getLikeCount: async (blogId) => {
    const response = await api.get(`/likes/get-count/${blogId}`);
    return response.data;
  },
  checkLikeStatus: async (blogId) => {
    const response = await api.get(`/likes/check/${blogId}`);
    return response.data;
  }
};

export const commentsAPI = {
  getCommentsByBlog: async (blogId, params = { page: 1, limit: 50 }) => {
    const response = await api.get(`/comments/get-comment/${blogId}`, { params });
    return response.data;
  },
  createComment: async (blogId, payload) => {
    const response = await api.post(`/comments/create-comment/${blogId}`, payload);
    return response.data;
  },
  updateComment: async (commentId, payload) => {
    const response = await api.patch(`/comments/update-comment/${commentId}`, payload);
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/delete-comment/${commentId}`);
    return response.data;
  }
};

export const notificationsAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read');
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  }
};

export const bookmarkAPI = {
  toggleBookmark: async (blogId) => {
    const response = await api.post(`/bookmarks/toggle/${blogId}`);
    return response.data;
  },
  getMyBookmarks: async (params = { page: 1, limit: 10 }) => {
    const response = await api.get('/bookmarks/my-bookmarks', { params });
    return response.data;
  },
  checkBookmarkStatus: async (blogId) => {
    const response = await api.get(`/bookmarks/check/${blogId}`);
    return response.data;
  }
};

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const reqUrl = (originalRequest?.url || '').toString();

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const isAuthPath =
      reqUrl.includes('/auth/login') ||
      reqUrl.includes('/auth/register') ||
      reqUrl.includes('/auth/refresh-token');

    if (status !== 401 || isAuthPath) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logoutClient();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const baseURL = api.defaults.baseURL || '';

    try {
      const { data } = await axios.post(
        `${baseURL}/auth/refresh-token`,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const tokens = data?.data ?? data;
      const accessToken = tokens?.accessToken;
      const newRefresh = tokens?.refreshToken;

      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }

      localStorage.setItem('accessToken', accessToken);
      if (newRefresh) {
        localStorage.setItem('refreshToken', newRefresh);
      }
      window.dispatchEvent(new Event('auth-change'));

      processQueue(null, accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      logoutClient();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  const msg = error.response?.data?.message;
  if (Array.isArray(msg)) {
    return msg.join(', ');
  }
  return msg || error.message || fallback;
};

export default api;
