import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import các models
import User from './models/userModel.js';
import Task from './models/taskModel.js';
import Comment from './models/CommentModel.js';
import UploadFile from './models/uploadFile.js'; 

// Import các routes
import taskRoutes from './routes/taskRoute.js'; 
import homeRoutes from './routes/homeRoute.js';
import importantRoutes from './routes/importantRoute.js';
import completedRoutes from './routes/completedRoute.js';
import loginRoutes from './routes/loginRoute.js';
import signupRoutes from './routes/signupRoute.js';
import todayRoutes from './routes/todayRoute.js';
import searchRoutes from './routes/searchRoute.js';
import commentRoutes from './routes/commentRoute.js';
import uploadFileRoutes from './routes/uploadFileRoute.js';
import forgotPasswordRoutes from './routes/forgotpasswordRoute.js';

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Cấu hình CORS
app.use(cors());

// Middleware để parse body của request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Đăng ký các routes
app.use('/api/tasks', taskRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/important', importantRoutes);
app.use('/api/completed', completedRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/today', todayRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploadfile', uploadFileRoutes);
app.use('/api/auth', forgotPasswordRoutes);

// Route mặc định trả về toàn bộ dữ liệu
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('user_id', 'name email'); 
    const users = await User.find();
    const comments = await Comment.find();
    const files = await UploadFile.find();

    res.json({
      tasks: tasks,
      users: users,
      comments: comments,
      files: files
    });
  } catch (err) {
    console.error('Error fetching data:', err); // Log lỗi chi tiết
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});