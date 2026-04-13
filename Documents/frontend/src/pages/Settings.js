// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { FiClock, FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getUserActivities } from '../services/activityService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/SettingsPage.css';

const Settings = () => {
  // Activity history state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');

  // Fetch activities on component mount and when filters change
  useEffect(() => {
    fetchActivities();
  }, [currentPage, searchTerm, filterAction]);

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    setActivitiesError(null);
    try {
      const response = await getUserActivities(currentPage, 10, searchTerm);
      const activitiesData = response.data || response.activities || response;
      const totalPagesData = response.totalPages || 1;
      setActivities(activitiesData);
      setTotalPages(totalPagesData);
    } catch (error) {
      console.error('Failed to load activity history', error);
      setActivitiesError('Failed to load activity history');
      toast.error('Failed to load activity history');
    } finally {
      setActivitiesLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'USER_CREATED':
        return 'bg-green-100 text-green-800';
      case 'USER_UPDATED':
        return 'bg-blue-100 text-blue-800';
      case 'USER_DELETED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="settings-container p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activity History</h1>
          <p className="text-white/80 text-lg">View all user activities and system events</p>
        </div>

        <div className="flex-1">
          <div className="settings-card p-8">
            {/* Activity History */}
            <div>
              <h2 className="settings-section-title">Activity History</h2>
              <div className="space-y-8">
                {/* Search and Filter */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search activities"
                      className="settings-input"
                    />
                    <button
                      onClick={() => setFilterAction('')}
                      className={`settings-btn-secondary ${filterAction === '' ? 'active' : ''}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterAction('USER_CREATED')}
                      className={`settings-btn-secondary ${filterAction === 'USER_CREATED' ? 'active' : ''}`}
                    >
                      Created
                    </button>
                    <button
                      onClick={() => setFilterAction('USER_UPDATED')}
                      className={`settings-btn-secondary ${filterAction === 'USER_UPDATED' ? 'active' : ''}`}
                    >
                      Updated
                    </button>
                    <button
                      onClick={() => setFilterAction('USER_DELETED')}
                      className={`settings-btn-secondary ${filterAction === 'USER_DELETED' ? 'active' : ''}`}
                    >
                      Deleted
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`settings-btn-secondary ${currentPage === 1 ? 'disabled' : ''}`}
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white/80">{currentPage} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`settings-btn-secondary ${currentPage === totalPages ? 'disabled' : ''}`}
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Activity List */}
                {activitiesLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                        </div>
                        <span className={`px-2 py-1 ${getActionBadgeColor(activity.action)} text-xs font-medium rounded`}>
                          {activity.action}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
                    </div>

                    {/* Profile Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="settings-label">Full Name</label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Username</label>
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Phone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="settings-label">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                        className="settings-input"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleProfileSave}
                        disabled={isSaving}
                        className={`settings-btn-primary ${isSaving ? 'settings-spinner' : ''}`}
                      >
                        {isSaving ? (
                          <>
                            <FiRefreshCw className="w-5 h-5 mr-3" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="w-5 h-5 mr-3" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password Change */}
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showCurrentPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showNewPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showConfirmPassword ? <FiEyeOff className="w-5 h-5 text-gray-400" /> : <FiEye className="w-5 h-5 text-gray-400" />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Login Sessions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-500">Chrome on Windows • New York, USA</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive push notifications on your devices</p>
                      </div>
                      <button
                        onClick={() => setPushNotifications(!pushNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <input
                          type="text"
                          value={systemSettings.siteName}
                          onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                        <input
                          type="url"
                          value={systemSettings.siteUrl}
                          onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Users</label>
                        <input
                          type="number"
                          value={systemSettings.maxUsers}
                          onChange={(e) => setSystemSettings({...systemSettings, maxUsers: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={systemSettings.sessionTimeout}
                          onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select
                        value={systemSettings.backupFrequency}
                        onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                      </div>
                      <button
                        onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleSystemSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Save System Settings
                      </button>
                      <button
                        onClick={handleExportData}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Export Data
                      </button>
                      <button
                        onClick={handleClearCache}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                      >
                        <FiRefreshCw className="w-4 h-4 mr-2" />
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity History */}
              {activeTab === 'activity' && (
                <div>
                  <h2 className="settings-section-title">Activity History</h2>
                  <p className="text-white/70 mb-6">Track all user management activities performed by administrators</p>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                        <input
                          type="text"
                          placeholder="Search activities..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="settings-input pl-10"
                        />
                      </div>
                    </div>
                    <div className="md:w-48">
                      <select
                        value={filterAction}
                        onChange={(e) => {
                          setFilterAction(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="settings-input"
                      >
                        <option value="">All Actions</option>
                        <option value="USER_CREATED">User Created</option>
                        <option value="USER_UPDATED">User Updated</option>
                        <option value="USER_DELETED">User Deleted</option>
                      </select>
                    </div>
                  </div>
                  
                  {activitiesLoading ? (
                    <LoadingSpinner message="Loading activity history..." size="medium" />
                  ) : activitiesError ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">{activitiesError}</p>
                    </div>
                  ) : activities.length === 0 ? (
                    <div className="text-center py-12">
                      <FiClock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">No activity history found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {console.log('=== RENDER SECTION START ===')}
                      {console.log('About to render activities:', activities)}
                      {console.log('Activities length:', activities.length)}
                      {activities.map((activity, index) => {
                        console.log(`=== RENDERING ACTIVITY ${index} ===`);
                        console.log('Full activity object:', activity);
                        console.log('Activity keys:', activity ? Object.keys(activity) : 'null/undefined');
                        console.log('Activity action:', activity.action);
                        console.log('Activity timestamp:', activity.timestamp);
                        console.log('Activity description:', activity.description);
                        console.log('Performed by:', activity.performedBy);
                        console.log('Target user:', activity.targetUser);
                        console.log('Target user name:', activity.targetUserName);
                        console.log('Target user email:', activity.targetUserEmail);

                        let performedByName, performedByEmail, performedByRole, targetUserName, targetUserEmail, targetUserRole;

                        // Add more comprehensive field checking
                        if (activity) {
                          performedByName = activity.performedBy?.name || 
                                          activity.admin?.name || 
                                          activity.createdBy?.name || 
                                          activity.adminName || 
                                          activity.performedByName || 
                                          'Unknown';
                          
                          performedByEmail = activity.performedBy?.email || 
                                           activity.admin?.email || 
                                           activity.createdBy?.email || 
                                           activity.adminEmail || 
                                           activity.performedByEmail || 
                                           '';
                          
                          performedByRole = activity.performedBy?.role || 
                                          activity.admin?.role || 
                                          activity.createdBy?.role || 
                                          activity.adminRole || 
                                          activity.performedByRole || 
                                          'Unknown';
                          
                          // Updated to handle createUser instead of targetUser
                          targetUserName = activity.createUser?.name || 
                                          activity.createUser?.username || 
                                          activity.createUser?.fullName || 
                                          activity.targetUserName || 
                                          activity.targetUser?.name || 
                                          activity.user?.name || 
                                          activity.userName || 
                                          activity.targetName || 
                                          'Unknown';
                          
                          targetUserEmail = activity.createUser?.email || 
                                           activity.createUser?.emailAddress || 
                                           activity.targetUserEmail || 
                                           activity.targetUser?.email || 
                                           activity.user?.email || 
                                           activity.userEmail || 
                                           activity.targetEmail || 
                                           '';
                          
                          targetUserRole = activity.createUser?.role || 
                                           activity.createUser?.userType || 
                                           activity.targetUserRole || 
                                           activity.targetUser?.role || 
                                           activity.user?.role || 
                                           activity.userRole || 
                                           activity.targetRole || 
                                           'Unknown';
                        } else {
                          performedByName = 'Unknown';
                          performedByEmail = '';
                          performedByRole = 'Unknown';
                          targetUserName = 'Unknown';
                          targetUserEmail = '';
                          targetUserRole = 'Unknown';
                        }

                        return (
                        <div key={activity._id || index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(activity.action)}`}>
                                  {activity.action?.replace('_', ' ') || 'Unknown Action'}
                                </span>
                                <span className="text-white/70 text-sm">
                                  {formatTimestamp(activity.timestamp)}
                                </span>
                              </div>
                              
                              <p className="text-white font-medium mb-2">{activity.description || 'No description'}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {/* Performed By */}
                                <div>
                                  <p className="text-white/50 mb-1">Performed By:</p>
                                  <div className="bg-white/5 rounded p-2">
                                    <p className="text-white font-medium">{performedByName}</p>
                                    <p className="text-white/70 text-xs">{performedByEmail}</p>
                                    <p className="text-white/50 text-xs">Role: {performedByRole}</p>
                                  </div>
                                </div>
                                
                                {/* Target User */}
                                <div>
                                  <p className="text-white/50 mb-1">Target User:</p>
                                  <div className="bg-white/5 rounded p-2">
                                    <p className="text-white font-medium">{targetUserName}</p>
                                    <p className="text-white/70 text-xs">{targetUserEmail}</p>
                                    <p className="text-white/50 text-xs">Role: {targetUserRole}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                      {console.log('=== RENDER SECTION END ===')}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                          <div className="text-white/70 text-sm">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiChevronLeft />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                  currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiChevronRight />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;