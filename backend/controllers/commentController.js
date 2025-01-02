import Comment from '../models/CommentModel.js'; 


// Lấy tất cả các bình luận của một người dùng
export const getAllComments = async (req, res) => {
  try {
    const { userID } = req.params; 

    // Sửa lại cú pháp populate đúng
    const comments = await Comment.find({ userId: userID })

    res.status(200).json(comments); // Trả về danh sách bình luận
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Thêm một bình luận mới
export const addComment = async (req, res) => {
  try {
    const { userID } = req.params;
    const { taskId, comment } = req.body;

    if (!taskId || !comment) {
      return res.status(400).json({ error: 'Task ID and comment are required' });
    }

    const newComment = await Comment.create({
      userId: userID,
      taskId: taskId,
      comment: comment,
    });

    // Trả về comment mới
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Xóa một bình luận
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id của comment từ URL
    await Comment.findByIdAndDelete(id); // Xóa comment theo ID
    res.status(200).json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
