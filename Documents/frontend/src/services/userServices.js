// src/services/userService.js
import api from "./api";

// ✅ Get single user
export const getUserById = async (userId) => {
  console.log('Getting user by ID:', userId);
  
  try {
    const { data } = await api.get(`/auth/users/${userId}`);
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
  console.log('Creating user:', userData);
  
  try {
    const { data } = await api.post("/auth/users", userData);
    console.log('User created:', data);
    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// ✅ Update user
export const updateUser = async (userId, userData) => {
  console.log('Updating user:', userId, userData);
  
  try {
    const { data } = await api.put(`/auth/users/${userId}`, userData);
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
    const { data } = await api.delete(`/auth/users/${userId}`);
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
    const { data } = await api.patch(`/auth/users/${userId}/status`, { status });
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
    const { data } = await api.get("/auth/users/recent");
    console.log('Recent active users response:', data);
    return data;
  } catch (error) {
    console.error('Get recent active users error:', error);
    throw error;
  }
};
