import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

let hideTimeout;
let isLoading = false;

// Check if we should show loading on current page
const shouldShowLoading = () => {
  const path = window.location.pathname;
  
  // Show loading on these pages
  const loadingPages = [
    '/login',
    '/dashboard',
    '/dashboard/settings'
  ];
  
  // Don't show loading on these pages
  const noLoadingPages = [
    '/dashboard/users',
    '/dashboard/users/edit',
    '/dashboard/profile'
  ];
  
  // Check if current path should show loading
  return loadingPages.some(page => path === page || path.startsWith(page + '/')) &&
         !noLoadingPages.some(page => path.startsWith(page));
};

// Show loading only on specific pages
const showLoading = () => {
  if (!isLoading && shouldShowLoading()) {
    isLoading = true;
    const loadingElement = document.querySelector('.global-loading-overlay');
    if (loadingElement) {
      loadingElement.classList.add('active');
    }
  }
};

// Hide loading after minimum 2-3 seconds
const hideLoading = () => {
  if (isLoading && shouldShowLoading()) {
    // Clear any existing hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Hide loading after at least 2.5 seconds total
    hideTimeout = setTimeout(() => {
      isLoading = false;
      const loadingElement = document.querySelector('.global-loading-overlay');
      if (loadingElement) {
        loadingElement.classList.remove('active');
      }
    }, 2500); // 2.5 seconds minimum
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    showLoading();
    
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

export default api;
