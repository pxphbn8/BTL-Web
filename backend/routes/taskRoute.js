import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask, getTaskById } from '../controllers/taskController.js';

const taskRoutes = express.Router();

// Get all tasks
taskRoutes.get('/getTask/:userID', getAllTasks);

taskRoutes.get('/:id', getTaskById);
// Create a new task
taskRoutes.post('/create', createTask);

// Update a task
taskRoutes.patch('/update/:id', updateTask);

// Delete a task
taskRoutes.delete('/delete/:id', deleteTask);

export default taskRoutes;
