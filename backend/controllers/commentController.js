// commentController.js
export const getAllComments = async (req, res) => {
    try {
      // Logic lấy tất cả các bình luận
      res.status(200).json({ message: "Fetched comments successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const addComment = async (req, res) => {
    try {
      // Logic thêm bình luận
      res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const deleteComment = async (req, res) => {
    try {
      // Logic xóa bình luận
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  