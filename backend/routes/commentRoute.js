import express from 'express';
import { getAllComments, addComment, deleteComment } from '../controllers/commentController.js';

const commentRoutes = express.Router();

// Endpoint lấy tất cả các bình luận của user
commentRoutes.get('/getAllComments/:userID', getAllComments);

// Endpoint thêm bình luận mới
commentRoutes.post('/addComment/:userID', addComment);

// Endpoint xóa bình luận theo ID
commentRoutes.delete('/deleteComment/:id', deleteComment);

export default commentRoutes;

