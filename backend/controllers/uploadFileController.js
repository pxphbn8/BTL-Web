import multer from 'multer';
import path from 'path';
import fs from 'fs';
import uploadFile from '../models/uploadFile.js'; // Model file MongoDB

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Tạo thư mục uploads nếu chưa có
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Tạo tên file duy nhất
  }
});

// Initialize multer
const upload = multer({ storage });

// Endpoint tải lên file
export const uploadfile = async (req, res) => {
  try {
    // Kiểm tra xem có file trong request hay không
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Lấy thông tin file
    const { fileName } = req.body; // Có thể lấy thêm các dữ liệu khác từ body (như title hoặc task ID)
    const filePath = req.file.path; // Đường dẫn đến file

    // Lưu thông tin file vào cơ sở dữ liệu
    const newFile = new uploadFile({
      title: fileName || req.file.originalname, // Nếu có tên file từ body, sử dụng, nếu không dùng tên file gốc
      attachments: [{
        fileName: req.file.originalname,
        filePath: filePath,
      }]
    });

    // Lưu vào MongoDB
    await newFile.save();

    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully!',
      file: newFile,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading file.' });
  }
};
