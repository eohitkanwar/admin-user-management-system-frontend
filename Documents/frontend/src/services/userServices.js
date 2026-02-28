// src/services/userService.js
import api from "./api";

// ✅ Get single user
export const getUserById = async (userId) => {
  console.log('Getting user by ID:', userId);
  
  try {
    const { data } = await api.get(`/users/${userId}`);
    console.log('User found:', data);
    return data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

// ✅ Get all users (ADMIN) with pagination
export const getUsers = async (page = 1, limit = 6, search = '') => {
  console.log('Fetching users with:', { page, limit, search });
  
  try {
    const { data } = await api.get(`/auth/users?page=${page}&limit=${limit}&search=${search}`);
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// ✅ Create user (if backend supports it)
export const createUser = async (userData) => {
  console.log('=== USER SERVICES CREATE USER START ==='); // Debug
  console.log('Creating user:', userData); // Debug
  console.log('API URL:', `${api.defaults.baseURL}/auth/users`); // Debug
  console.log('Full API URL:', `${api.defaults.baseURL}/auth/users`); // Debug
  console.log('Request headers:', {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }); // Debug
  console.log('Token available:', !!localStorage.getItem('token')); // Debug
  console.log('Token value:', localStorage.getItem('token')?.substring(0, 20) + '...'); // Debug (first 20 chars)
  
  try {
    console.log('=== MAKING API REQUEST ==='); // Debug
    console.log('Request method:', 'POST'); // Debug
    console.log('Request endpoint:', '/users'); // Debug
    console.log('Request payload:', userData); // Debug
    console.log('Request config:', {
      method: 'POST',
      url: `${api.defaults.baseURL}/users`,
      data: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }); // Debug
    
    const { data } = await api.post("/users", userData);
    console.log('=== API RESPONSE RECEIVED ==='); // Debug
    console.log('Response status:', data); // Debug
    console.log('User created:', data); // Debug
    return data;
  } catch (error) {
    console.log('=== USER SERVICES CREATE USER ERROR ==='); // Debug
    console.error('Create user error:', error); // Debug
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
      code: error.code
    }); // Debug error details
    console.error('Full error object:', error); // Debug full error
    throw error;
  }
};

// ✅ Update user
export const updateUser = async (userId, userData) => {
  console.log('Updating user:', userId, userData);
  
  try {
    const { data } = await api.put(`auth/users/${userId}`, userData);
    console.log('User updated:', data);
    return data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

// ✅ Delete user
export const deleteUser = async (userId) => {
  console.log('Deleting user:', userId);
  
  try {
    const { data } = await api.delete(`/users/${userId}`);
    console.log('User deleted:', data);
    return data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// ✅ Update user status
export const updateUserStatus = async (userId, status) => {
  console.log('Updating user status:', userId, status);
  
  try {
    const { data } = await api.patch(`/users/${userId}/status`, { status });
    return data;
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  console.log('Updating profile:', profileData);
  
  try {
    const { data } = await api.put("/auth/profile", profileData);
    return { success: true, user: data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || err.message,
    };
  }
};

// ✅ Get dashboard statistics
export const getDashboardStats = async () => {
  console.log('Getting dashboard stats');
  
  try {
    const { data } = await api.get("/auth/dashboard/stats");
    console.log('Dashboard stats response:', data);
    return data;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

// ✅ Get recently active users
export const getRecentActiveUsers = async () => {
  console.log('Getting recent active users');
  
  try {
    const { data } = await api.get("/users/recent");
    console.log('Recent active users response:', data);
    return data;
  } catch (error) {
    console.error('Get recent active users error:', error);
    throw error;
  }
};
