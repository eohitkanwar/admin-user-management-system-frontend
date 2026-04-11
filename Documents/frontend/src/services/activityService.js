import api from './api';

// Get all user activities (admin only)
export const getUserActivities = async (page = 1, limit = 10, search = '') => {
  try {
    console.log('Fetching user activities:', { page, limit, search });
    const { data } = await api.get(`/api/auth/user-history?page=${page}&limit=${limit}&search=${search}`);
    console.log('User activities response:', data);
    return data;
  } catch (error) {
    console.error('Get user activities error:', error);
    throw error;
  }
};

// Create activity log when user is added
export const createActivityLog = async (activityData) => {
  try {
    console.log('Creating activity log:', activityData);
    const { data } = await api.post('/api/auth/user-history', activityData);
    console.log('Activity log created:', data);
    return data;
  } catch (error) {
    console.error('Create activity log error:', error);
    throw error;
  }
};  

// Get activities by specific admin
export const getActivitiesByAdmin = async (adminId, page = 1, limit = 10) => {
  try {
    console.log('Fetching activities by admin:', { adminId, page, limit });
    const { data } = await api.get(`/api/auth/user-history/admin/${adminId}?page=${page}&limit=${limit}`);
    console.log('Admin activities response:', data);
    return data;
  } catch (error) {
    console.error('Get activities by admin error:', error);
    throw error;
  }
};
