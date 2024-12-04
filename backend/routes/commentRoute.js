import express from 'express';
import { getAllComments, addComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

// Định nghĩa các endpoint
router.get('/', getAllComments);
router.post('/', addComment);
router.delete('/:id', deleteComment);

export default router;
