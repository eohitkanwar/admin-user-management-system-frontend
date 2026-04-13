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

