import express from 'express';
import { forgotPassword } from '../controllers/forgotpasswordController.js';
import { resetPassword } from '../controllers/resetpasswordController.js';
import jwt from 'jsonwebtoken'; 
import User from '../models/userModel.js';
import path from 'path';
import { fileURLToPath } from 'url'; 
import fs from 'fs'; // Để đọc file HTML

const router = express.Router();

// Lấy giá trị __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Định nghĩa route cho yêu cầu quên mật khẩu
router.post('/forgot-password', (req, res) => {
  console.log('Request body:', req.body); // Log kiểm tra dữ liệu nhận được
  forgotPassword(req, res);
});

// Route đặt lại mật khẩu
router.post('/reset-password', (req, res) => {
  console.log('Request body:', req.body); // Log kiểm tra dữ liệu nhận được
  resetPassword(req, res);
});

// Route xác minh token và trả về trang HTML đặt lại mật khẩu
router.get('/verify-reset-password/:token', async (req, res) => {
  const { token } = req.params;
  console.log('Received token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Token hợp lệ, trả về trang HTML
    const resetHtmlPath = path.resolve(__dirname, '../../frontend/public/views/reset.html');
    console.log("Path to reset.html:", resetHtmlPath);
   // Đọc nội dung của file HTML và chèn token vào
   const htmlContent = fs.readFileSync(resetHtmlPath, 'utf-8');
   const modifiedHtml = htmlContent.replace('{{token}}', token); // Chèn token vào trong placeholder

   res.send(modifiedHtml); // Trả về trang HTML đã chỉnh sửa
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(400).send('Invalid or expired token.');
  }
});

export default router;
