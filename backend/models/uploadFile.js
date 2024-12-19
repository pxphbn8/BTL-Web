// backend/models/uploadFileModel.js
import mongoose from 'mongoose';

const uploadFileSchema = new mongoose.Schema({
  title: { type: String, required: true },
  attachments: [
    {
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
    }
  ]
});

const uploadFile = mongoose.model('UploadFile', uploadFileSchema);

export default uploadFile;


