// // client/src/api.js
// import axios from 'axios';

// export default axios.create({
//   baseURL: 'http://localhost:5000',
// });



// client/src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// This is the "interceptor"
// It runs before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Return the modified request config
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;