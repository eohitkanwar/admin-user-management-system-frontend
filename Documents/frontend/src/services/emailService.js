// src/services/emailService.js
import api from "./api";

// Generate welcome email content
const generateWelcomeEmailContent = (userData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 60px; height: 60px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="color: white; font-size: 24px; font-weight: bold;">${userData.username?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          <h1 style="color: #1f2937; margin: 20px 0 10px 0; font-size: 28px;">Welcome to Admin Panel!</h1>
          <p style="color: #6b7280; font-size: 16px; margin: 0;">Your account has been created successfully</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Your Account Details:</h2>
          <div style="color: #4b5563; line-height: 1.6;">
            <p style="margin: 8px 0;"><strong>Username:</strong> ${userData.username}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${userData.email}</p>
            <p style="margin: 8px 0;"><strong>Role:</strong> ${userData.role === 'admin' ? 'Administrator' : 'User'}</p>
            <p style="margin: 8px 0;"><strong>Password:</strong> ${userData.password}</p>
          </div>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="http://localhost:3000/login" 
             style="background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Login to Your Account
          </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            If you have any questions, please contact your administrator.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    </div>
  `;
};

// Send welcome email to newly created user
export const sendWelcomeEmail = async (userData) => {
  console.log('=== EMAIL SERVICE START ==='); // Debug
  console.log('Sending welcome email to:', userData); // Debug
  
  try {
    // Generate email content
    const emailContent = generateWelcomeEmailContent(userData);
    
    console.log('=== EMAIL CONTENT GENERATED ==='); // Debug
    console.log('📧 WELCOME EMAIL CONTENT:'); // Debug
    console.log('=====================================');
    console.log(`To: ${userData.email}`);
    console.log(`Subject: Welcome to Admin Panel - Your Account Details`);
    console.log('=====================================');
    console.log(emailContent);
    console.log('=====================================');
    
    // Try to call backend email service
    console.log('=== CALLING BACKEND EMAIL API ==='); // Debug
    console.log('API URL:', `${api.defaults.baseURL}/auth/users`); // Debug
    console.log('Request data:', {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      role: userData.role
    }); // Debug
    
    const { data } = await api.post("/auth/send-welcome-email", {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      role: userData.role
    });
    
    console.log('=== EMAIL API RESPONSE ==='); // Debug
    console.log('Email sent successfully:', data); // Debug
    
    return { 
      success: true, 
      message: data.message || "Welcome email sent successfully",
      emailSent: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.log('=== EMAIL SERVICE ERROR ==='); // Debug
    console.error('Backend email service error:', error); // Debug
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    }); // Debug error details
    
    // Don't throw error - user creation should still succeed even if email fails
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to send welcome email",
      error: error
    };
  }
};
