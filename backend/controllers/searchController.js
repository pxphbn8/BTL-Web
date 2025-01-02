import Task from '../models/taskModel.js';

export const searchTask = async (req, res) => {
  try {
    // Lấy userID từ params và searchInput từ body của request
    const user_ID = req.params.userID;
    const search_Input = req.params.input;
    console.log(search_Input);
    console.log(user_ID);


    // Tìm các công việc có user_id là userID và chứa searchInput trong title, description hoặc duedate
    const tasks = await Task.find({
      user_id: user_ID,
      $or: [
 
        { title: { $regex: new RegExp(search_Input, 'i') } },
        // Tìm các công việc có mô tả chứa searchInput (không phân biệt chữ hoa chữ thường)
        { description: { $regex: new RegExp(search_Input, 'i') } },
    
      ],
    }).sort({ dueDate: 1 }); 

    // Trả về danh sách các công việc tìm thấy dưới dạng JSON
    res.status(200).json(tasks);
  } catch (error) {
    // Nếu có lỗi, trả về mã lỗi 500 và thông báo lỗi
    res.status(500).json({ message: error.message });
  }
};
