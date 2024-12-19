import express from 'express';
import { forgotPassword } from '../controllers/forgotpasswordController.js';

const router = express.Router();

// Định nghĩa route cho yêu cầu quên mật khẩu
router.post('/forgot-password', forgotPassword);

export default router;
