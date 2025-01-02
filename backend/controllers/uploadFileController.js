import multer from 'multer';
import path from 'path';
import fs from 'fs';
import uploadFile from '../models/uploadFile.js'; 

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __dirname = import.meta.dirname;
    const uploadPath = path.join(__dirname, '..', 'uploads');
    // Tạo thư mục uploads nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer
const upload = multer({ storage });
export default upload;

// Endpoint tải lên file
export const uploadfile = async (req, res) => {
  try {
    console.log("Request Body:", req.file); // In ra body để kiểm tra

    // Kiểm tra xem có file trong request hay không
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Lấy thông tin file
    const { fileName } = req.body; // Lấy tên file từ body
    const filePath = req.file.path; // Đường dẫn đến file

    // Lưu thông tin file vào cơ sở dữ liệu
    const newFile = new uploadFile({
      title: fileName || req.file.originalname, // Sử dụng tên file từ body hoặc tên gốc
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

export const getAllUploadedFiles = async (req, res) => {
  try {
    const files = await uploadFile.find();
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching files.' });
  }
};


