import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser, createUser } from "../services/userServices";
import { sendWelcomeEmail } from "../services/emailService";
import { FiEdit2, FiTrash2, FiShield, FiChevronLeft, FiChevronRight, FiSearch, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import "../styles/UserManagement.css";

const USERS_PER_PAGE = 6;

const UserManagement = () => {
  // ✅ ALL HOOKS FIRST (NO CONDITION)
  const navigate = useNavigate();
  
  console.log('=== USER MANAGEMENT COMPONENT MOUNTED ==='); // Debug component mount
  console.log('localStorage userInfo:', localStorage.getItem('userInfo')); // Debug localStorage
  console.log('localStorage token:', !!localStorage.getItem('token')); // Debug token

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

  // 🔐 AUTH CHECK (NORMAL VARIABLE — NOT A HOOK)
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  console.log('UserManagement - userInfo from localStorage:', userInfo); // Debug
  console.log('UserManagement - userInfo.role:', userInfo?.role); // Debug
  console.log('UserManagement - typeof userInfo.role:', typeof userInfo?.role); // Debug
  
  // TEMPORARY: Bypass admin check to test backend
const isAdmin = userInfo?.role === "admin";  //   userInfo.role === "admin" || 
  //   userInfo.role === "administrator" || 
  //   userInfo.role === "Admin" || 
  //   userInfo.role === "ADMIN" ||ss
  //   userInfo.role?.toLowerCase()?.includes("admin")
  // );
  
  console.log('UserManagement - isAdmin check:', { userInfo, role: userInfo?.role, isAdmin }); // Debug

  // 🔹 FETCH USERS (MUST BE BEFORE useEffect)
  const fetchUsers = useCallback(async (page, search) => {
    console.log('=== FETCH USERS START ==='); // Debug
    console.log('fetchUsers called with:', { page, search, loading, error }); // Debug log
    console.log('API URL:', 'http://localhost:5000/api/auth/users'); // Debug API URL
    console.log('Token available:', !!localStorage.getItem('token')); // Debug token
    
    try {
      setLoading(true);
      setError(null);
      console.log('Making API call to getUsers...'); // Debug API call start
      
      const res = await getUsers(page, USERS_PER_PAGE, search);
      console.log('userServices response:', res);
      
      if (res && res.users) {
        console.log('Users loaded via userServices:', res.users);
        console.log('Setting users state with:', res.users.length, 'users');
        setUsers(res.users || []);
        setTotalPages(res.totalPages || 1);
        setTotalUsers(res.totalUsers || 0);
        console.log('Users state set successfully!');
      } else if (Array.isArray(res)) {
        console.log('Users loaded via userServices (direct array):', res);
        console.log('Setting users state with:', res.length, 'users');
        setUsers(res || []);
        setTotalPages(1);
        setTotalUsers(res.length || 0);
        console.log('Users state set successfully!');
      } else if (res.data && Array.isArray(res.data)) {
        console.log('Users loaded via userServices (data array):', res.data);
        console.log('Setting users state with:', res.data.length, 'users');
        setUsers(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalUsers(res.total || res.data.length || 0);
        console.log('Users state set successfully!');
      } else {
        console.error('Failed to load users via userServices - unknown format:', res);
        console.error('Expected formats:');
        console.error('1. {users: [...]}');
        console.error('2. {data: [...]}');
        console.error('3. [...direct array...]');
        
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
        console.log('Set empty users state to stop loading');
      }
    } catch (error) {
      console.error("Fetch error:", error); // Debug error
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }); // Debug error details
      setError(error);
      toast.error("Failed to fetch users");
      setUsers([]); // 🛡️ fallback
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      console.log('=== FETCH USERS FINALLY ==='); // Debug
      setLoading(false);
    }
  }, []);

  // 🔹 USE EFFECT FOR FETCHING USERS (MUST BE BEFORE ANY CONDITIONAL RETURNS)
  useEffect(() => {
    console.log('useEffect triggered!'); // Debug
    console.log('isAdmin:', isAdmin); // Debug
    console.log('currentPage:', currentPage); // Debug
    console.log('searchTerm:', searchTerm); // Debug
    console.log('fetchUsers function:', typeof fetchUsers); // Debug
    console.log('localStorage token:', !!localStorage.getItem('token')); // Debug
    console.log('localStorage userInfo:', localStorage.getItem('userInfo')); // Debug
    
    if (isAdmin) {
      console.log('useEffect - calling fetchUsers'); // Debug
      fetchUsers(currentPage, searchTerm);
    } else {
      console.log('useEffect - isAdmin is false, skipping fetchUsers'); // Debug
    }
  }, [isAdmin, currentPage, searchTerm, fetchUsers]);

  // 🔹 SEARCH HANDLER WITH LOADING (AFTER HOOKS ✔️)
  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    console.log('Search triggered, setting loading to true'); // Debug log
    setLoading(true); // Show loading immediately for search
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Reset to first page when searching
    // fetchUsers will be called by useEffect with loading
  };

  // 🔹 PAGINATION HANDLERS WITH LOADING
  const handlePageChange = (page) => {
    console.log('Pagination triggered, setting loading to true'); // Debug log
    setLoading(true); // Show loading immediately
    setCurrentPage(page);
    // fetchUsers will be called by useEffect with loading
  };

  // 🔹 PAGINATION
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = users; // Users are already paginated from backend

  // Handle edit user with loading
  const handleEdit = (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }
    // Show loading when navigating to edit page
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/dashboard/users/edit/${userId}`);
    }, 2000);
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setDeleteUserData(user);
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const confirmDelete = async () => {
    if (!deleteUserData?._id) {
      toast.error("Invalid user data");
      return;
    }
  
    try {
      setLoading(true); // Show loading for delete
      await deleteUser(deleteUserData._id);
      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setDeleteUserData(null);
      fetchUsers(currentPage, searchTerm); // This will show loading again
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // Handle add user
  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  // Handle save new user
  const handleSaveNewUser = async () => {
    console.log('handleSaveNewUser called with newUser:', newUser); // Debug
    
    // Validation
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error("Username, email, and password are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Username validation
    if (newUser.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    // Password validation
    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newUser.password.length > 20) {
      toast.error("Password must be less than 20 characters long");
      return;
    }

    if (!/^[^\s]+$/.test(newUser.password)) {
      toast.error("Password cannot contain spaces");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('=== USER CREATION START ==='); // Debug
      console.log('Creating user with data:', newUser); // Debug log
      console.log('Current user token:', localStorage.getItem('token')); // Debug log
      console.log('Current user info:', localStorage.getItem('userInfo')); // Debug log
      console.log('Backend API URL:', 'http://localhost:5000/api/auth/users'); // Debug
      console.log('Network status:', navigator.onLine ? 'Online' : 'Offline'); // Debug
      
      // Call the actual API to create user
      console.log('=== CALLING CREATE USER API ==='); // Debug
      console.log('Making POST request to:', 'http://localhost:5000/api/auth/users'); // Debug
      console.log('Request data:', JSON.stringify(newUser, null, 2)); // Debug
      
      const response = await createUser(newUser);
      console.log('=== CREATE USER API RESPONSE ==='); // Debug
      console.log('User created successfully:', response); // Debug log
      
      // Send welcome email
      console.log('=== SENDING WELCOME EMAIL ==='); // Debug
      console.log('Sending welcome email to:', newUser.email); // Debug
      const emailResult = await sendWelcomeEmail(newUser);
      console.log('=== EMAIL SEND RESPONSE ==='); // Debug
      console.log('Email result:', emailResult); // Debug log
      
      if (emailResult.success) {
        console.log('Welcome email sent successfully'); // Debug
        toast.success("User added successfully! Welcome email sent.");
      } else {
        console.log('Welcome email failed to send:', emailResult.message); // Debug
        toast.success("User added successfully! (Welcome email failed to send)");
        console.warn('Welcome email failed:', emailResult.message);
      }
      
      setShowAddUserModal(false);
      setNewUser({ username: "", email: "", password: "", role: "user" });
      console.log('=== REFRESHING USER LIST ==='); // Debug
      fetchUsers(currentPage, searchTerm); // Refresh user list
      console.log('=== USER CREATION COMPLETE ==='); // Debug
    } catch (error) {
      console.log('=== USER CREATION ERROR ==='); // Debug
      console.error('Error creating user:', error); // Debug error
      console.error('Error response:', error.response); // Debug error response
      console.error('Error status:', error.response?.status); // Debug error status
      console.error('Error data:', error.response?.data); // Debug error data
      console.error('Error code:', error.code); // Debug error code
      console.error('Error message:', error.message); // Debug error message
      
      setError(error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add user";
      
      // Don't show toast for 403 errors to prevent infinite loops
      if (error.response?.status !== 403) {
        toast.error(errorMessage);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="user-loading">
          <div className="user-loading-spinner"></div>
          <div className="user-loading-text">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="user-management-header">
          <div className="user-management-header-content">
            <div>
              <h1 className="user-management-title">User Management</h1>
              <p className="user-management-subtitle">Manage all users and their permissions</p>
            </div>
            <button 
              className="user-add-btn"
              onClick={handleAddUser}
            >
              <FiUserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="user-search-container">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="user-search-icon" />
            </div>
            <input
              type="text"
              className="user-search-input"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              onInput={(e) => console.log('Input event:', e.target.value)} // Debug input events
              onKeyDown={(e) => console.log('Key pressed:', e.key)} // Debug keyboard events
              autoComplete="off"
              autoFocus={false}
              spellCheck="false"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="user-table-container">
          <div className="overflow-x-auto">
            <table className="user-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user?.username?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user?.username || user?.name || 'Unknown User'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user?.email || 'N/A'}</td>
                    <td>
                      <span className={`user-role-badge ${user?.role || 'user'}`}>
                        <FiShield className="w-3 h-3 mr-1" />
                        {user?.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <div className="user-action-buttons">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="user-btn-edit"
                          title="Edit user"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="user-btn-delete"
                          title="Delete user"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="user-pagination">
              <div className="flex items-center justify-between">
                <div className="user-pagination-info">
                  Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastUser, totalUsers)}
                  </span>{' '}
                  of <span className="font-medium">{totalUsers}</span> results
                </div>
                <div className="user-pagination-nav">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="user-pagination-btn"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="user-pagination-btn"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`user-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="user-pagination-btn"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="user-pagination-btn"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        user={deleteUserData}
        isDeleting={false}
      />

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="user-modal-overlay">
          <div className="user-modal-content">
            <div className="user-modal-header">
              <h3 className="user-modal-title">Add New User</h3>
              <button 
                className="user-modal-close"
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="user-modal-body">
              <div className="user-form-group">
                <label className="user-form-label">Username</label>
                <input
                  type="text"
                  className="user-form-input"
                  placeholder="Enter username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              
              <div className="user-form-group">
                <label className="user-form-label">Email</label>
                <input
                  type="email"
                  className="user-form-input"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              
              <div className="user-form-group">
                <label className="user-form-label">Password</label>
                <input
                  type="password"
                  className="user-form-input"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              
              <div className="user-form-group">
                <label className="user-form-label">Role</label>
                <select
                  className="user-form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="user-modal-footer">
              <button
                className="user-btn-cancel"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button
                className="user-btn-save"
                onClick={handleSaveNewUser}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  export default UserManagement;
