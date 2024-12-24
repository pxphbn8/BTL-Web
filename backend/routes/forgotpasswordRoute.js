import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/forgotpasswordController.js';

const router = express.Router();

// Định nghĩa route cho yêu cầu quên mật khẩu
router.post('/forgot-password', forgotPassword);
// Route đặt lại mật khẩu
router.get('/reset-password', resetPassword);
export default router;




