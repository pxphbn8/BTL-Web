import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
