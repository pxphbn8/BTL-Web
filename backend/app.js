import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoute.js'; // Đảm bảo rằng đường dẫn đến file route là đúng
import homeRoutes from './routes/homeRoute.js';
import importantRoutes from './routes/importantRoute.js';
import completedRoutes from './routes/completedRoute.js';
import loginRoutes from './routes/loginRoute.js';
import signupRoutes from './routes/signupRoute.js';
import todayRoutes from './routes/todayRoute.js';
import searchRoutes from './routes/searchRoute.js';
import commentRoutes from './routes/commentRoute.js';
import Routes from './routes/uploadFileRoute.js';
import router from './routes/forgotpasswordRoute.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


// Cấu hình CORS theo nhu cầu của bạn
app.use(cors());


// Parse request bodies (req.body)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Kết nối đến cơ sở dữ liệu MongoDB
// const MONGO_URI = 'mongodb://localhost:27017/ToDoListDB';
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
 
// });
mongoose.connect('mongodb://localhost:27017/ToDoListDB');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Sử dụng router cho các endpoint của Task
app.use('/api/tasks', taskRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/important', importantRoutes);
app.use('/api/completed', completedRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/signup', signupRoutes);
app.use('/api/today', todayRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploadfile', Routes);
app.use('/api/auth', router);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


