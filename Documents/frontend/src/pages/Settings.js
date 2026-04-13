// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiBell, FiDatabase, FiGlobe, FiMoon, FiSun, FiSave, FiRefreshCw, FiTrash2, FiDownload, FiUpload, FiEye, FiEyeOff, FiClock, FiFilter, FiSearch, FiChevronLeft, FiChevronRight, FiSettings, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getUserActivities } from '../services/activityService';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/SettingsPage.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Admin Dashboard',
    siteUrl: 'https://example.com',
    maxUsers: 1000,
    sessionTimeout: 30,
    maintenanceMode: false,
    backupFrequency: 'daily'
  });
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin',
    bio: 'System administrator with full access to all features.',
    phone: '+1 234 567 8900',
    location: 'New York, USA'
  });
  
  // Security settings state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  // Activity history state
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  
  // Common state
  const [isSaving, setIsSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Tab configuration
  const tabs = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'activity', label: 'Activity History', icon: FiClock }
  ];

  // Fetch activities when activity tab is active
  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivities();
    }
  }, [activeTab, currentPage, searchTerm, filterAction]);

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

  // Handler functions
  const handleGeneralSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('General settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update general settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    toast.info('Exporting data...');
    // Simulate data export
    setTimeout(() => {
      toast.success('Data exported successfully!');
    }, 2000);
  };

  const handleClearCache = () => {
    toast.info('Clearing cache...');
    // Simulate cache clearing
    setTimeout(() => {
      toast.success('Cache cleared successfully!');
    }, 1500);
  };

  return (
    <div className="settings-container p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/80 text-lg">Manage your application settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="settings-sidebar p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`settings-tab w-full flex items-center ${
                        activeTab === tab.id ? 'active' : ''
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 icon" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="settings-card p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="settings-section-title">General Settings</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="settings-label">Site Name</label>
                        <input
                          type="text"
                          value={generalSettings.siteName}
                          onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Site URL</label>
                        <input
                          type="url"
                          value={generalSettings.siteUrl}
                          onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Max Users</label>
                        <input
                          type="number"
                          value={generalSettings.maxUsers}
                          onChange={(e) => setGeneralSettings({...generalSettings, maxUsers: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                      <div>
                        <label className="settings-label">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          value={generalSettings.sessionTimeout}
                          onChange={(e) => setGeneralSettings({...generalSettings, sessionTimeout: e.target.value})}
                          className="settings-input"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="settings-label">Backup Frequency</label>
                      <select
                        value={generalSettings.backupFrequency}
                        onChange={(e) => setGeneralSettings({...generalSettings, backupFrequency: e.target.value})}
                        className="settings-input"
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
                        onClick={() => setGeneralSettings({...generalSettings, maintenanceMode: !generalSettings.maintenanceMode})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleGeneralSave}
                        disabled={isSaving}
                        className="settings-btn-primary"
                      >
                        {isSaving ? 'Saving...' : 'Save General Settings'}
                      </button>
                      <button
                        onClick={handleExportData}
                        className="settings-btn-secondary flex items-center"
                      >
                        <FiDownload className="w-4 h-4 mr-2" />
                        Export Data
                      </button>
                      <button
                        onClick={handleClearCache}
                        className="settings-btn-secondary flex items-center"
                      >
                        <FiRefreshCw className="w-4 h-4 mr-2" />
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="settings-section-title">Profile Settings</h2>
                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <div className="settings-avatar">
                        {profileData.name.charAt(0)}
                      </div>
                      <div>
                        <button className="settings-btn-primary">
                          Change Avatar
                        </button>
                        <p className="text-white/70 text-sm mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                      </div>
                    </div>

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
                        className="settings-btn-primary"
                      >
                        {isSaving ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="settings-section-title">Security Settings</h2>
                  <div className="space-y-8">
                    <div className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="settings-label">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                              className="settings-input pr-10"
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
                          <label className="settings-label">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                              className="settings-input pr-10"
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
                          <label className="settings-label">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                              className="settings-input pr-10"
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
                          className="settings-btn-primary"
                        >
                          {isSaving ? 'Changing...' : 'Change Password'}
                        </button>
                      </div>
                    </div>

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
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="settings-section-title">Notification Settings</h2>
                  <div className="space-y-8">
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

              {/* Activity History */}
              {activeTab === 'activity' && (
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
                        {activities.map((activity) => {
                          // Extract performed by info
                          const performedByName = activity.performedBy?.name || activity.performedBy?.username || 'Unknown Admin';
                          const performedByEmail = activity.performedBy?.email || '';
                          const performedByRole = activity.performedBy?.role || 'admin';
                          
                          // Extract target user info
                          const targetUserName = activity.createUser?.name || 
                                              activity.createUser?.username || 
                                              activity.targetUser?.name || 
                                              activity.targetUser?.username || 
                                              activity.targetUserName || 
                                              'Unknown User';
                          const targetUserEmail = activity.createUser?.email || 
                                               activity.targetUser?.email || 
                                               activity.targetUserEmail || 
                                               '';
                          const targetUserRole = activity.createUser?.role || 
                                               activity.targetUser?.role || 
                                               activity.targetUserRole || 
                                               'user';
                          
                          return (
                            <div key={activity._id || activity.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(activity.action)}`}>
                                    {activity.action?.replace('_', ' ') || 'Unknown Action'}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    {formatTimestamp(activity.timestamp)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {/* Performed By Section */}
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 text-xs font-medium">
                                      {performedByName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {performedByName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {performedByEmail && `${performedByEmail} `}
                                      {performedByRole && `(${performedByRole})`}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Action Arrow */}
                                <div className="flex items-center justify-center">
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <span className="text-xs">performed</span>
                                    <span className="text-lg">{'>'}</span>
                                  </div>
                                </div>
                                
                                {/* Target User Section */}
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-600 text-xs font-medium">
                                      {targetUserName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {targetUserName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {targetUserEmail && `${targetUserEmail} `}
                                      {targetUserRole && `(${targetUserRole})`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {activity.description && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-600 italic">
                                    {activity.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
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
