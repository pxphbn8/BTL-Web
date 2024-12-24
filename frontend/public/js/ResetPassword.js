import axios from 'axios';

// Hàm gửi yêu cầu đặt lại mật khẩu
export const ResetPassword = async (token, newPassword, email) => {
  try {
    // Gửi yêu cầu đặt lại mật khẩu
    const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword });
    
    // Kiểm tra nếu đặt lại mật khẩu thành công
    if (response.data.success) {
      // Tự động đăng nhập bằng mật khẩu mới
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: newPassword,
      });

      if (loginResponse.data.token) {
        // Lưu token vào localStorage hoặc sessionStorage
        localStorage.setItem('authToken', loginResponse.data.token);
        alert('Password reset and logged in successfully!');
        window.location.href = '/dashboard'; // Điều hướng đến trang chính
        return loginResponse.data;
      } else {
        throw new Error('Login failed after resetting password.');
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reset password.',
    };
  }
};
window.ResetPassword = ResetPassword;
