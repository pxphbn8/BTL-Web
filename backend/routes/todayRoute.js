import express from 'express';
import { getTasksForToday, updateTasksForToday } from '../controllers/todayController.js';

const todayRoutes = express.Router();

// Lấy tất cả các công việc cho ngày hiện tại của người dùng
todayRoutes.get('/getToday/:userID', getTasksForToday);

// Đổi từ PUT thành PATCH để phù hợp với client
todayRoutes.patch('/update/:id', updateTasksForToday); 

export default todayRoutes;

