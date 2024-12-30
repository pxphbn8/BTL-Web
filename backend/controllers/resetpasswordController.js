import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


// Hàm đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Kiểm tra thời hạn token
    if (user.tokenExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'Token has expired.' });
    }

    // Cập nhật mật khẩu
    user.password = newPassword;
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Token has expired.' });
    }

    res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
  }
};
