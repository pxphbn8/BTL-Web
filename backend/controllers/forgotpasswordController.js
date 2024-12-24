import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'; // Đường dẫn model User

// Hàm gửi email quên mật khẩu
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Tạo token đặt lại mật khẩu
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `http://127.0.0.1:5500/frontend/views/reset.html?`;

    // Cấu hình email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Hi,\n\nPlease click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send password reset email.' });
  }
};

// Hàm đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  // const { token, newPassword } = req.body;
  const token = req.query.token;
  

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

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    user.password = hashedPassword;
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
