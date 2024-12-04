// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    user: { type: String, required: true }, // Thông tin người bình luận
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
