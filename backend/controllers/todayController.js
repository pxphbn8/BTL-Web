import mongoose from 'mongoose';
import { format } from 'date-fns-tz';
import Task from '../models/taskModel.js';

// Lấy tất cả các công việc cho ngày hiện tại của người dùng
export const getTasksForToday = async (req, res) => {
  const userID = req.params.userID;
  
  try {
    const currentDate = format(new Date(), 'yyyy-MM-dd', { timeZone: 'Asia/Ho_Chi_Minh' });
    console.log(currentDate);

    const tasks = await Task.find({ user_id: userID, dueDate: currentDate });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Cập nhật trạng thái công việc hoặc thông tin công việc theo ID
export const updateTasksForToday = async (req, res) => {
  const taskId = req.params.id;
  const { title, dueDate, description, isCompleted } = req.body;

  try {
    if (!taskId || !title || !dueDate || !description || typeof isCompleted === 'undefined') {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, dueDate, description, isCompleted },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error during task update:', error);
    res.status(500).json({ message: error.message });
  }
};







